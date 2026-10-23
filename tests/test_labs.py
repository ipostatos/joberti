#!/usr/bin/env python3
"""
Лабораторные и DutyOps-упражнения: контент, безопасность и слияние прогресса.

Mini App не может проверить внешнюю Linux/Kubernetes/облачную среду, поэтому
выполнение лабораторной — это чек-лист, заметка и post-check. Тесты следят,
чтобы контент был выполним без платного аккаунта, деструктивные шаги были
помечены, а слияние прогресса никогда не отнимало подтверждённое выполнение.

Запуск:  python tests/test_labs.py
"""
from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "tools"))
sys.path.insert(0, str(BASE / "api"))

import merge  # noqa: E402
import validate_content as vc  # noqa: E402
from content_lib import load_all  # noqa: E402
from models import AttemptIn  # noqa: E402

T = "devops-platform"


class TestLabContent(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()
        cls.labs = [x for x in cls.c.labs if x["track_id"] == T]
        cls.track = cls.c.track(T)

    def test_enough_labs(self):
        self.assertGreaterEqual(len(self.labs), 32)
        core = [x for x in self.labs if x["priority"] == "core"]
        self.assertGreaterEqual(len(core), 16)

    def test_every_core_domain_has_core_lab(self):
        for d in self.track["lab_domains"]:
            if d["core"]:
                with self.subTest(domain=d["id"]):
                    self.assertTrue(any(l["lab_domain"] == d["id"] and l["priority"] == "core"
                                        for l in self.labs))

    def test_spec_domains_present(self):
        core_ids = {d["id"] for d in self.track["lab_domains"] if d["core"]}
        self.assertEqual(core_ids, {"linux", "networking", "nginx", "docker", "monitoring",
                                    "databases", "iac", "kubernetes"})

    def test_post_check_questions_exist_and_match(self):
        q = self.c.questions_by_id
        for lab in self.labs:
            for qid in lab["post_check_question_ids"]:
                with self.subTest(lab=lab["id"], q=qid):
                    self.assertIn(qid, q)
                    self.assertEqual(q[qid]["track_id"], T)

    def test_cloud_labs_never_required_and_never_surprise_bill(self):
        for lab in self.labs:
            if lab["environment"] == "cloud-optional":
                with self.subTest(lab=lab["id"]):
                    self.assertNotEqual(lab["priority"], "core")
                    self.assertTrue(lab.get("cost_warning"))
                    self.assertTrue(lab.get("cleanup_steps"))
                    self.assertTrue(lab.get("local_alternative"))

    def test_destructive_steps_are_scoped(self):
        rx = vc.DESTRUCTIVE_RE
        for lab in self.labs:
            blob = " ".join(str(s) for f in ("setup", "tasks", "cleanup_steps", "hints")
                            for s in lab.get(f) or [])
            if rx.search(blob):
                with self.subTest(lab=lab["id"]):
                    self.assertIn("одноразов", " ".join(lab["safety_notes"]).lower())

    def test_no_auto_verification_claims(self):
        """Лабораторная не обещает автоматическую проверку среды."""
        for lab in self.labs:
            blob = (lab["goal"] + " " + lab["evidence_prompt"]).lower()
            self.assertNotRegex(blob, r"автоматически провер|ai[- ]провер")

    def test_validator_rejects_unscoped_destructive_lab(self):
        c = load_all()
        lab = next(x for x in c.labs if x["track_id"] == T)
        lab["setup"] = list(lab["setup"]) + ["`rm -rf /var/lib/app`"]
        lab["safety_notes"] = ["Будьте внимательны"]
        rep = vc.Report()
        vc.validate_labs(rep, c)
        self.assertTrue(any("одноразов" in e for e in rep.errors))

    def test_validator_rejects_core_cloud_lab(self):
        c = load_all()
        lab = next(x for x in c.labs if x["environment"] == "cloud-optional")
        lab["priority"] = "core"
        rep = vc.Report()
        vc.validate_labs(rep, c)
        self.assertTrue(any("не может быть core" in e for e in rep.errors))


class TestDutyOpsContent(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    def test_drills_and_runbooks(self):
        kinds = [d["kind"] for d in self.c.dutyops]
        self.assertGreaterEqual(kinds.count("drill"), 6)
        self.assertGreaterEqual(kinds.count("runbook"), 7)

    def test_reasoning_not_single_answer(self):
        """Оценивается последовательность решений: в drill несколько шагов разных
        фаз, в каждом ровно один лучший вариант и есть плохие."""
        for d in self.c.dutyops:
            with self.subTest(d=d["id"]):
                self.assertGreaterEqual(len(d["steps"]), 4)
                for st in d["steps"]:
                    scores = [o["score"] for o in st["options"]]
                    self.assertEqual(scores.count(2), 1)
                    self.assertIn(0, scores)

    def test_authority_boundary_and_unknowns(self):
        for d in self.c.dutyops:
            with self.subTest(d=d["id"]):
                self.assertTrue(d["escalation_boundary"].strip())
                for u in d.get("unknowns") or []:
                    self.assertIn("уточнить у интервьюера", u.lower())

    def test_runbook_sections_in_order(self):
        for d in self.c.dutyops:
            if d["kind"] == "runbook":
                with self.subTest(d=d["id"]):
                    self.assertEqual([s["phase"] for s in d["steps"]], vc.RUNBOOK_PHASES)


class TestLabMerge(unittest.TestCase):
    """Правила слияния прогресса лабораторных (паритет с JS — в test_sync.py)."""

    def test_completion_never_lost(self):
        a = {"l": {"attempts": 2, "completed": True, "ts": 10}}
        b = {"l": {"attempts": 1, "completed": False, "ts": 99}}
        self.assertTrue(merge.merge_labs(a, b)["l"]["completed"])
        self.assertTrue(merge.merge_labs(b, a)["l"]["completed"])

    def test_attempts_not_lost(self):
        r = merge.merge_labs({"l": {"attempts": 3, "ts": 1}}, {"l": {"attempts": 1, "ts": 5}})
        self.assertEqual(r["l"]["attempts"], 3)

    def test_fresher_note_wins(self):
        a = {"l": {"evidence_note": "старая", "ts": 1}}
        b = {"l": {"evidence_note": "новая", "ts": 2}}
        self.assertEqual(merge.merge_labs(a, b)["l"]["evidence_note"], "новая")
        self.assertEqual(merge.merge_labs(b, a)["l"]["evidence_note"], "новая")

    def test_empty_fresh_note_does_not_erase(self):
        a = {"l": {"evidence_note": "есть", "ts": 1}}
        b = {"l": {"evidence_note": "", "ts": 2}}
        self.assertEqual(merge.merge_labs(a, b)["l"]["evidence_note"], "есть")

    def test_best_post_check_kept(self):
        a = {"l": {"post_check_score": 1, "ts": 1}}
        b = {"l": {"post_check_score": 0.5, "ts": 2}}
        self.assertEqual(merge.merge_labs(a, b)["l"]["post_check_score"], 1)

    def test_garbage_normalized(self):
        r = merge.merge_labs({"l": {"attempts": "x", "post_check_score": "1",
                                    "evidence_note": "a" * 5000, "ts": -5}}, {})
        self.assertEqual(r["l"]["attempts"], 0)
        self.assertIsNone(r["l"]["post_check_score"], "строка не число — не засчитывается")
        self.assertEqual(len(r["l"]["evidence_note"]), merge.LAB_NOTE_MAX)
        self.assertEqual(r["l"]["ts"], 0)

    def test_checklist_union(self):
        r = merge.merge_labs({"l": {"checklist": {"0": True}}}, {"l": {"checklist": {"2": True, "1": False}}})
        self.assertEqual(set(r["l"]["checklist"]), {"0", "2"})

    def test_drills_best_and_last(self):
        r = merge.merge_drills({"d": {"best": 80, "last": 80, "attempts": 1, "ts": 1}},
                               {"d": {"best": 50, "last": 50, "attempts": 2, "ts": 9}})
        self.assertEqual(r["d"], {"best": 80, "last": 50, "attempts": 2, "ts": 9})

    def test_merge_is_idempotent(self):
        a = {"labs": {"l": {"attempts": 1, "completed": True, "post_check_score": 0.5, "ts": 3}},
             "drills": {"d": {"best": 40, "last": 40, "attempts": 1, "ts": 2}},
             "diagnostic": {"ts": 5, "pct": 60, "domains": {"linux": 70}}}
        once = merge.merge_profile(a, {})
        twice = merge.merge_profile(once, once)
        self.assertEqual(once, twice)


class TestLabHistory(unittest.TestCase):

    def test_lab_and_drill_kinds_accepted(self):
        for kind in ("lab", "drill"):
            with self.subTest(kind=kind):
                rec = AttemptIn(id="x", ts=1, kind=kind, mode="lab-linux-service-001", pct=50)
                self.assertEqual(rec.kind, kind)

    def test_unknown_kind_still_normalized(self):
        self.assertEqual(AttemptIn(id="x", ts=1, kind="whatever").kind, "quiz")


class TestLabUiSafety(unittest.TestCase):
    """Текст лабораторных и заметки пользователя попадают в разметку только экранированными."""

    def test_rich_escapes_before_code(self):
        html = (BASE / "webapp" / "labs.html").read_text(encoding="utf-8")
        m = re.search(r"function rich\(s\) \{\s*return App\.esc\(s\)\.replace", html)
        self.assertIsNotNone(m, "rich() обязан сначала экранировать, потом размечать `код`")

    def test_evidence_note_not_concatenated(self):
        html = (BASE / "webapp" / "labs.html").read_text(encoding="utf-8")
        self.assertIsNone(re.search(r"\+\s*st\.evidence_note\s*\+", html))
        self.assertIn('getElementById("noteBox").value = st.evidence_note', html)


if __name__ == "__main__":
    unittest.main(verbosity=2)
