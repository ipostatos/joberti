#!/usr/bin/env python3
"""
Трек devops-platform как тренажёр под вакансию RedCore TATECH-23211.

Что проверяется:
  * трек сохранил идентификатор и указывает на конкретную вакансию;
  * у вакансии есть источник и честный статус сверки;
  * требования не заполнены за пользователя, опыт отделён от навыка;
  * совместимость прогресса: каждый старый id DevOps-трека жив и не сменил смысл;
  * остальные три трека не изменились по составу.

Запуск:  python tests/test_devops_vacancy.py
"""
from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "tools"))

from content_lib import load_all  # noqa: E402

T = "devops-platform"
VID = "redcore-junior-devops-tatech-23211"
FIX = BASE / "tests" / "fixtures"


class TestVacancy(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()
        cls.track = cls.c.track(T)
        cls.v = next(v for v in cls.c.vacancies if v["id"] == VID)

    def test_track_id_kept_and_points_to_redcore(self):
        self.assertIsNotNone(self.track, "трек devops-platform обязан сохранить id: к нему привязан прогресс")
        self.assertEqual(self.track["status"], "active")
        self.assertEqual(self.track["vacancy_id"], VID)
        self.assertEqual(self.v["track_id"], T)
        self.assertEqual(self.v["company"], "RedCore")
        self.assertEqual(self.v["external_ref"], "TATECH-23211")

    def test_generic_vacancy_kept_as_history(self):
        """Обобщённая вакансия остаётся записью истории, но трек на неё не ссылается."""
        ids = {v["id"] for v in self.c.vacancies}
        self.assertIn("devops-platform-generic", ids)

    def test_source_metadata_is_honest(self):
        v = self.v
        self.assertTrue(v["source_url"].startswith("https://redcore.group/vacancy/tatech-23211"))
        self.assertIn(v["source_status"], {"verified", "needs_review"})
        self.assertTrue(v["source_title"])
        if v["source_status"] == "verified":
            self.assertRegex(v["source_verified_at"] or "", r"^\d{4}-\d{2}-\d{2}$")
        else:
            # Непроверенный текст не выдаётся за проверенный: нет даты сверки,
            # но есть объяснение, почему, и дата снимка.
            self.assertFalse(v.get("source_verified_at"))
            self.assertTrue(v.get("source_note"))
            self.assertRegex(v.get("source_snapshot_at") or "", r"^\d{4}-\d{2}-\d{2}$")

    def test_requirements_unique_and_not_prefilled(self):
        reqs = self.v["requirements"]
        ids = [r["id"] for r in reqs]
        self.assertEqual(len(ids), len(set(ids)))
        for r in reqs:
            with self.subTest(req=r["id"]):
                self.assertEqual(r["status"], "not_started")
                self.assertEqual(r["evidence"], "")
                self.assertIn(r["importance"], {"required", "desirable", "nice_to_have"})
                self.assertIn(r["kind"], {"skill", "experience"})

    def test_experience_requirement_cannot_be_learned_away(self):
        """«2+ года Linux Administrator» — требование-опыт, у него нет лабораторных,
        которые могли бы выглядеть как его закрытие."""
        exp = [r for r in self.v["requirements"] if r["kind"] == "experience"]
        self.assertTrue(any("2 лет" in r["requirement"] for r in exp))
        for r in exp:
            self.assertEqual(r["lab_ids"], [], "опыт не закрывается лабораторной")

    def test_vacancy_requirements_reflect_the_stack(self):
        text = " ".join(r["requirement"] for r in self.v["requirements"]).lower()
        for needle in ("tcp/ip", "http", "dns", "nginx", "prometheus", "grafana", "logql",
                       "mongodb", "postgresql", "clickhouse", "ci/cd", "terraform", "ansible",
                       "git", "aws", "gcp", "kubernetes", "eks", "docker", "bash",
                       "cloudflare", "custom hostnames", "waf", "nats", "redis", "jira"):
            with self.subTest(tech=needle):
                self.assertIn(needle, text)
        tasks = " ".join(self.v["main_tasks"]).lower()
        for needle in ("мониторинг", "runbook", "зеркал", "полномочий", "инцидент", "оптимизац"):
            with self.subTest(task=needle):
                self.assertIn(needle, tasks)

    def test_weights_by_importance(self):
        req = [r for r in self.v["requirements"] if r["importance"] == "required"]
        plus = [r for r in self.v["requirements"] if r["importance"] == "desirable"]
        self.assertGreaterEqual(len(req), 20)
        self.assertGreaterEqual(len(plus), 5)

    def test_skill_matrix_depth_levels(self):
        sm = {d["id"]: d for d in self.v["skill_matrix"]}
        for dom, target in (("linux", "L4"), ("networking", "L3"), ("nginx", "L3"),
                            ("kubernetes", "L3"), ("mongodb", "L2"), ("clickhouse", "L2"),
                            ("eks", "L2"), ("gcp", "L2")):
            with self.subTest(domain=dom):
                self.assertEqual(sm[dom]["target"], target)
        for d in sm.values():
            self.assertRegex(d["target"], r"^L[0-4](–L[0-4])?$")
            self.assertIn(d["priority"], {"P0", "P1", "P2"})

    def test_no_invented_company_internals(self):
        """Внутреннее устройство RedCore не публично — тренажёр это говорит прямо."""
        blob = json.dumps(self.v, ensure_ascii=False).lower()
        self.assertIn("уточнить у интервьюера", blob)

    def test_critical_topics_cover_p0(self):
        crit = set(self.track["critical_topic_ids"])
        for t in ("linux-basics", "networking", "nginx-proxy", "containers", "ci-cd",
                  "dutyops-runbooks"):
            self.assertIn(t, crit)

    def test_curriculum_reference_pinned(self):
        ref = self.track["curriculum_ref"]
        self.assertEqual(ref["repo"], "milanm/DevOps-Roadmap")
        self.assertEqual(ref["commit"], "d7499e6dabe2fc54be85a28952080c0b6be857b3")
        self.assertEqual(ref["license"], "Apache-2.0")
        self.assertTrue((BASE / "THIRD_PARTY.md").exists(), "нужна атрибуция в THIRD_PARTY.md")


class TestMigrationCompatibility(unittest.TestCase):
    """Старый прогресс DevOps-трека остаётся читаемым: id не исчезли и не сменили смысл."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()
        cls.base = json.loads((FIX / "devops_baseline_ids.json").read_text(encoding="utf-8"))

    def test_questions_keep_topic(self):
        q = self.c.questions_by_id
        for qid, topic in self.base["questions"].items():
            with self.subTest(q=qid):
                self.assertIn(qid, q, "старый вопрос пропал: SRS-запись станет сиротой")
                self.assertEqual(q[qid]["track_id"], T)
                self.assertEqual(q[qid]["topic"], topic, "id переиспользован под другую тему")

    def test_lessons_keep_topic(self):
        ls = self.c.lessons_by_id
        for lid, topic in self.base["lessons"].items():
            with self.subTest(lesson=lid):
                self.assertIn(lid, ls)
                self.assertEqual(ls[lid]["topic_id"], topic)

    def test_terms_keep_name(self):
        tm = self.c.terms_by_id
        for tid, term in self.base["glossary"].items():
            with self.subTest(term=tid):
                self.assertIn(tid, tm)
                self.assertEqual(tm[tid]["term"], term)
                self.assertIn(T, tm[tid]["track_ids"])

    def test_mock_cases_steps_stories_topics_exist(self):
        mocks = self.c.mock_by_id
        for mid, cat in self.base["mock_questions"].items():
            with self.subTest(mock=mid):
                self.assertEqual(mocks[mid]["category"], cat)
        cases = self.c.cases_by_id
        for cid in self.base["cases"]:
            with self.subTest(case=cid):
                self.assertEqual(cases[cid]["track_id"], T)
        steps = self.c.steps_by_id
        for sid in self.base["roadmap"]:
            with self.subTest(step=sid):
                self.assertIn(sid, steps)
                self.assertEqual(steps[sid]["track_id"], T)
        stories = {s["id"] for s in self.c.stories}
        for sid in self.base["stories"]:
            self.assertIn(sid, stories)
        topics = self.c.topics_by_id
        for tid in self.base["topics"]:
            with self.subTest(topic=tid):
                self.assertEqual(topics[tid]["track_id"], T)

    def test_self_assessment_areas_kept(self):
        have = {a["id"] for a in self.c.track(T)["self_assessment_areas"]}
        for aid in self.base["self_assessment"]:
            self.assertIn(aid, have)

    def test_stale_srs_ids_do_not_break_readiness(self):
        """SRS-запись на id, которого больше нет, не должна ронять расчёт.

        Расчёт идёт по контенту, а не по ключам SRS, поэтому сироты просто
        игнорируются. Проверяем это на JS-стороне в webapp/_readiness_check.mjs;
        здесь — что ни один старый id не стал «сиротой» без пометки."""
        all_ids = set(self.c.questions_by_id)
        orphan = [qid for qid in self.base["questions"] if qid not in all_ids]
        self.assertEqual(orphan, [])


class TestLegacyTracksUnchanged(unittest.TestCase):
    """Остальные треки не меняются из-за обновления DevOps."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()
        cls.base = json.loads((FIX / "legacy_tracks_baseline.json").read_text(encoding="utf-8"))

    def test_same_content_sets(self):
        c = self.c
        for t, snap in self.base["tracks"].items():
            now = {
                "questions": sorted(x["id"] for x in c.questions if x["track_id"] == t),
                "lessons": sorted(x["id"] for x in c.lessons if x["track_id"] == t),
                "mock_questions": sorted(x["id"] for x in c.mock_questions if x["track_id"] == t),
                "cases": sorted(x["id"] for x in c.cases if x["track_id"] == t),
                "roadmap": sorted(x["id"] for x in c.roadmap if x["track_id"] == t),
                "topics": sorted(x["id"] for x in c.topics if x["track_id"] == t),
                "glossary": sorted(x["id"] for x in c.glossary
                                   if not x.get("track_ids") or t in x["track_ids"]),
                "stories": sorted(x["id"] for x in c.stories if x["track_id"] == t),
            }
            for k, v in now.items():
                with self.subTest(track=t, part=k):
                    self.assertEqual(v, snap[k])
            with self.subTest(track=t, part="vacancy"):
                self.assertEqual(c.track(t)["vacancy_id"], snap["vacancy_id"])
                self.assertEqual(c.track(t)["critical_topic_ids"], snap["critical_topic_ids"])

    def test_labs_and_drills_belong_to_devops_only(self):
        for x in self.c.labs + self.c.dutyops:
            self.assertEqual(x["track_id"], T)


if __name__ == "__main__":
    unittest.main(verbosity=2)
