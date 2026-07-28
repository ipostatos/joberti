#!/usr/bin/env python3
"""
Тесты слияния состояния + ПАРИТЕТ с клиентской реализацией.

Правила слияния намеренно продублированы в webapp/sync.js и api/merge.py:
клиент должен уметь сливать состояние офлайн. Цена дублирования — риск
расхождения, и это самая дорогая поломка синхронизации: прогресс тихо теряется
на одном из устройств.

Поэтому здесь те же фикстуры прогоняются через Python, а результат сверяется с
выводом `node webapp/_sync_check.mjs --dump`. Если Node недоступен, тест
паритета пропускается, но собственные проверки merge.py всё равно выполняются.

Запуск:  python tests/test_sync.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "api"))

import merge  # noqa: E402

# Фикстуры ДОЛЖНЫ совпадать с FIXTURES в webapp/_sync_check.mjs.
FIXTURES = {
    "srs": [
        ({"q:a": {"box": 1, "due": 100}}, {"q:a": {"box": 3, "due": 50}}),
        ({"q:a": {"box": 2, "due": 100}}, {"q:a": {"box": 2, "due": 300}}),
        ({"q:a": {"box": 2, "due": 100}}, {"q:b": {"box": 1, "due": 10}}),
        ({"q:a": {"box": 99, "due": 1}}, {"q:a": {"box": 2, "due": 5}}),
        ({"q:a": "мусор"}, {"q:b": {"box": 0, "due": 0}}),
        ({}, {}),
    ],
    "progress": [
        (
            {"goal": 15, "days": {"2026-07-01": 10}, "streak": 3, "best": 5,
             "lastDay": "2026-07-01", "frozenUsed": False},
            {"goal": 25, "days": {"2026-07-01": 4, "2026-07-02": 8}, "streak": 1,
             "best": 2, "lastDay": "2026-07-02", "frozenUsed": True},
        ),
        (
            {"days": {}, "streak": 9, "best": 9, "lastDay": "2026-07-10", "frozenUsed": True},
            {"days": {}, "streak": 2, "best": 2, "lastDay": "2026-07-02", "frozenUsed": False},
        ),
        ({"flags": {"flawless": True}}, {"flags": {"weakTopicRecovered": True}}),
        ({"days": {"2026-07-01": "abc", "2026-07-02": -5}}, {"days": {"2026-07-01": 3}}),
        ({}, {}),
    ],
    "rated": [
        ({"m1": {"rating": 2, "count": 1, "ts": 10}}, {"m1": {"rating": 4, "count": 3, "ts": 20}}),
        ({"m1": {"rating": 4, "count": 3, "ts": 30}}, {"m1": {"rating": 1, "count": 1, "ts": 40}}),
        ({"m1": {"rating": 3, "count": 2, "ts": 5}}, {"m2": {"rating": 1, "count": 1, "ts": 7}}),
        ({"m1": {"rating": "abc", "count": None}}, {"m1": {"rating": 9, "count": -3}}),
        ({}, {}),
    ],
    "roadmap": [
        (
            {"s1": {"lessonRead": True, "quizBest": 60, "casesDone": 1,
                    "mocksAnswered": 0, "done": False}},
            {"s1": {"lessonRead": False, "quizBest": 85, "casesDone": 0,
                    "mocksAnswered": 2, "done": True}},
        ),
        ({"s1": {"done": True}}, {"s2": {"quizBest": 40}}),
        ({}, {}),
    ],
    "requirements": [
        ({"r1": {"status": "partial", "evidence": "было"}},
         {"r1": {"status": "confirmed", "evidence": "стало"}}),
        ({"r1": {"status": "confirmed", "evidence": "было"}},
         {"r1": {"status": "learning", "evidence": ""}}),
        ({"r1": {"status": "not_started"}}, {"r2": {"status": "learning"}}),
        ({}, {}),
    ],
    "library": [
        ({"l1": {"read": True, "note": "старая"}}, {"l1": {"read": False, "note": "новая"}}),
        ({"l1": {"read": False, "note": ""}}, {"l1": {"read": True, "note": ""}}),
        ({}, {}),
    ],
    "stories": [
        (
            {"s1": {"situation": "A", "task": "A", "action": "A", "result": "A",
                    "reflection": "A", "updatedAt": 100}},
            {"s1": {"situation": "B", "task": "B", "action": "B", "result": "B",
                    "reflection": "B", "updatedAt": 200}},
        ),
        (
            {"s1": {"situation": "A", "task": "A", "action": "A", "result": "A",
                    "reflection": "A", "updatedAt": 300}},
            {"s1": {"situation": "B", "task": "B", "action": "B", "result": "B",
                    "reflection": "B", "updatedAt": 100}},
        ),
        ({}, {}),
    ],
    "examDate": [
        ({"value": "2026-08-01", "setAt": 100}, {"value": "2026-09-01", "setAt": 200}),
        ({"value": "2026-09-01", "setAt": 500}, {"value": "2026-08-01", "setAt": 100}),
        (None, {"value": "2026-08-01", "setAt": 10}),
        ("2026-07-01", None),
        (None, None),
    ],
    "history": [
        (
            [{"id": "a", "ts": 300, "pct": 50}, {"id": "b", "ts": 200, "pct": 60}],
            [{"id": "b", "ts": 200, "pct": 60}, {"id": "c", "ts": 400, "pct": 70}],
        ),
        ([], [{"id": "x", "ts": 1, "pct": 0}]),
        ([{"noId": 1}, None, {"ts": 5}], [{"id": "ok", "ts": 5}]),
        ([], []),
    ],
    "profile": [
        (
            {
                "trackId": "redcore-junior-seo", "onboarded": True,
                "selfAssessment": {"sa-gsc": 3},
                "requirements": {"r1": {"status": "learning"}},
                "roadmap": {"s1": {"done": True}},
                "glossary": {"g1": {"favorite": True, "checked": 2}},
                "mock": {"m1": {"rating": 2, "count": 1, "ts": 1}},
                "cases": {"c1": {"rating": 1, "count": 1, "ts": 1}},
                "library": {"l1": {"read": True, "note": ""}},
                "stories": {"st1": {"situation": "A", "updatedAt": 5}},
                "lessons": {"les1": {"read": True, "ts": 100}},
                "quizBest": {"on-page": 80},
                "weakTopicsSeen": {"on-page": True},
                "english": {
                    "words": {"ev-queue": {"favorite": True, "checked": 2}},
                    "drills": {"ed-self-001": {"rating": 2, "count": 1, "ts": 10}},
                    "phrases": {"ph-open-001": {"learned": True}},
                },
            },
            {
                "onboarded": False,
                "selfAssessment": {"sa-gsc": 5, "sa-ga4": 2, "bad": 99},
                "requirements": {"r1": {"status": "partial", "evidence": "есть"}},
                "roadmap": {"s1": {"quizBest": 90}},
                "glossary": {"g1": {"favorite": False, "checked": 5}},
                "mock": {"m1": {"rating": 4, "count": 2, "ts": 9}},
                "cases": {"c1": {"rating": 3, "count": 2, "ts": 9}},
                "library": {"l1": {"read": False, "note": "заметка"}},
                "stories": {"st1": {"situation": "B", "updatedAt": 9}},
                "lessons": {"les2": {"read": True, "ts": 50}},
                "quizBest": {"on-page": 45, "technical-seo": 70},
                "weakTopicsSeen": {},
                "english": {
                    "words": {"ev-queue": {"favorite": False, "checked": 5}},
                    "drills": {"ed-self-001": {"rating": 4, "count": 2, "ts": 20}},
                    "phrases": {"ph-open-001": {"learned": False},
                                "ph-self-001": {"learned": True}},
                },
            },
        ),
        ({}, {}),
    ],
}

MERGERS = {
    "srs": merge.merge_srs,
    "progress": merge.merge_progress,
    "rated": merge.merge_rated,
    "roadmap": merge.merge_roadmap,
    "requirements": merge.merge_requirements,
    "library": merge.merge_library,
    "stories": merge.merge_stories,
    "examDate": merge.merge_exam_date,
    "history": merge.merge_history,
    "profile": merge.merge_profile,
}


def python_results() -> dict:
    return {name: [fn(a, b) for a, b in FIXTURES[name]] for name, fn in MERGERS.items()}


class TestMergeRules(unittest.TestCase):
    """Собственные проверки правил слияния."""

    def test_srs_higher_box_wins(self):
        r = merge.merge_srs({"q:a": {"box": 1, "due": 100}}, {"q:a": {"box": 3, "due": 50}})
        self.assertEqual(r, {"q:a": {"box": 3, "due": 50}})

    def test_srs_equal_box_later_due_wins(self):
        r = merge.merge_srs({"q:a": {"box": 2, "due": 100}}, {"q:a": {"box": 2, "due": 300}})
        self.assertEqual(r["q:a"]["due"], 300)

    def test_srs_rejects_garbage(self):
        r = merge.merge_srs({"q:a": {"box": 99, "due": 1}, "q:b": "мусор"},
                            {"q:c": {"box": 2, "due": 5}})
        self.assertEqual(set(r), {"q:c"}, "невалидные записи отбрасываются")

    def test_srs_never_loses_items(self):
        """Слияние не должно терять элементы: это прямая потеря прогресса."""
        a = {f"q:{i}": {"box": 1, "due": i} for i in range(50)}
        b = {f"q:{i}": {"box": 2, "due": i} for i in range(25, 75)}
        r = merge.merge_srs(a, b)
        self.assertEqual(len(r), 75)

    def test_progress_days_take_max(self):
        r = merge.merge_progress({"days": {"d": 10}}, {"days": {"d": 3}})
        self.assertEqual(r["days"]["d"], 10)

    def test_progress_flags_union(self):
        r = merge.merge_progress({"flags": {"a": True}}, {"flags": {"b": True}})
        self.assertEqual(r["flags"], {"a": True, "b": True})

    def test_progress_frozen_from_newer(self):
        """Устройство, не заходившее неделю, не должно возвращать потраченную
        страховку серии."""
        old = {"lastDay": "2026-07-01", "frozenUsed": False}
        new = {"lastDay": "2026-07-10", "frozenUsed": True}
        self.assertTrue(merge.merge_progress(old, new)["frozenUsed"])
        self.assertTrue(merge.merge_progress(new, old)["frozenUsed"])

    def test_progress_days_are_capped(self):
        days = {f"2020-01-{i:02d}": 1 for i in range(1, 29)}
        big = {f"day-{i}": 1 for i in range(500)}
        r = merge.merge_progress({"days": {**days, **big}}, {})
        self.assertLessEqual(len(r["days"]), merge.MAX_HISTORY_DAYS)

    def test_rated_best_wins_and_count_grows(self):
        r = merge.merge_rated({"m": {"rating": 4, "count": 3, "ts": 1}},
                              {"m": {"rating": 1, "count": 1, "ts": 9}})
        self.assertEqual(r["m"], {"rating": 4, "count": 3, "ts": 9})

    def test_rated_clamps_values(self):
        r = merge.merge_rated({"m": {"rating": 99, "count": -5, "ts": -1}}, {})
        self.assertEqual(r["m"], {"rating": 4, "count": 1, "ts": 0})

    def test_requirements_status_never_downgrades(self):
        r = merge.merge_requirements({"r": {"status": "confirmed"}}, {"r": {"status": "learning"}})
        self.assertEqual(r["r"]["status"], "confirmed")

    def test_requirements_keeps_evidence(self):
        r = merge.merge_requirements({"r": {"evidence": "было"}}, {"r": {"evidence": ""}})
        self.assertEqual(r["r"]["evidence"], "было",
                         "пустое значение не должно затирать заполненное")

    def test_stories_newer_version_wins_whole(self):
        """Поля истории не смешиваются между редакциями."""
        a = {"s": {"situation": "A", "result": "A", "updatedAt": 1}}
        b = {"s": {"situation": "B", "result": "B", "updatedAt": 2}}
        r = merge.merge_stories(a, b)
        self.assertEqual(r["s"]["situation"], "B")
        self.assertEqual(r["s"]["result"], "B")

    def test_exam_date_by_set_time_not_by_value(self):
        """Собеседование можно перенести и назад: побеждает та дата, которую
        установили позже, а не более поздняя календарно."""
        r = merge.merge_exam_date({"value": "2026-09-01", "setAt": 500},
                                  {"value": "2026-08-01", "setAt": 100})
        self.assertEqual(r["value"], "2026-09-01")
        r2 = merge.merge_exam_date({"value": "2026-09-01", "setAt": 100},
                                   {"value": "2026-08-01", "setAt": 500})
        self.assertEqual(r2["value"], "2026-08-01")

    def test_history_dedupes_and_sorts(self):
        r = merge.merge_history(
            [{"id": "a", "ts": 1}, {"id": "b", "ts": 3}],
            [{"id": "b", "ts": 3}, {"id": "c", "ts": 2}],
        )
        self.assertEqual([x["id"] for x in r], ["b", "c", "a"])

    def test_history_is_capped(self):
        big = [{"id": str(i), "ts": i} for i in range(500)]
        self.assertEqual(len(merge.merge_history(big, [])), merge.MAX_ATTEMPTS)

    def test_history_drops_records_without_id(self):
        r = merge.merge_history([{"noId": 1}, None, {"ts": 5}], [{"id": "ok", "ts": 5}])
        self.assertEqual([x["id"] for x in r], ["ok"])

    def test_profile_keeps_track_when_client_omits_it(self):
        r = merge.merge_profile({"trackId": "redcore-junior-seo"}, {})
        self.assertEqual(r["trackId"], "redcore-junior-seo")

    def test_profile_self_assessment_range(self):
        r = merge.merge_profile({}, {"selfAssessment": {"a": 3, "b": 99, "c": "x"}})
        self.assertEqual(r["selfAssessment"], {"a": 3})

    def test_profile_keeps_lessons_and_quiz_best(self):
        """Разделы, которых раньше не было в белом списке слияния.

        Их отсутствие означало тихую потерю: клиент заменяет профиль целиком
        ответом сервера, поэтому «урок прочитан» и лучший процент по теме
        обнулялись при первом же обмене, а шаги плана откатывались.
        """
        r = merge.merge_profile(
            {"lessons": {"les1": {"read": True, "ts": 5}}, "quizBest": {"on-page": 90},
             "weakTopicsSeen": {"on-page": True}},
            {"quizBest": {"on-page": 40, "html-http": 55}},
        )
        self.assertTrue(r["lessons"]["les1"]["read"])
        self.assertEqual(r["quizBest"], {"on-page": 90, "html-http": 55})
        self.assertEqual(r["weakTopicsSeen"], {"on-page": True})

    def test_profile_keeps_english_progress(self):
        r = merge.merge_profile(
            {"english": {"words": {"ev-queue": {"checked": 3, "favorite": True}},
                         "drills": {"ed-self-001": {"rating": 4, "count": 1, "ts": 7}},
                         "phrases": {"ph-open-001": {"learned": True}}}},
            {"english": {"words": {"ev-queue": {"checked": 1}},
                         "drills": {"ed-self-001": {"rating": 2, "count": 3, "ts": 9}},
                         "phrases": {"ph-open-001": {"learned": False}}}},
        )
        eng = r["english"]
        self.assertEqual(eng["words"]["ev-queue"], {"favorite": True, "checked": 3})
        self.assertEqual(eng["drills"]["ed-self-001"], {"rating": 4, "count": 3, "ts": 9})
        self.assertEqual(eng["phrases"], {"ph-open-001": {"learned": True}})

    def test_merge_is_idempotent(self):
        """Повторный обмен не должен менять состояние: иначе оно «дрейфует»
        при каждой синхронизации."""
        a = {"srs": FIXTURES["srs"][0][0], "progress": FIXTURES["progress"][0][0],
             "profile": FIXTURES["profile"][0][0], "exam_date": FIXTURES["examDate"][0][0]}
        b = {"srs": FIXTURES["srs"][0][1], "progress": FIXTURES["progress"][0][1],
             "profile": FIXTURES["profile"][0][1], "exam_date": FIXTURES["examDate"][0][1]}
        once = merge.merge_state(a, b)
        twice = merge.merge_state(once, once)
        self.assertEqual(twice, once)

    def test_merge_state_handles_empty(self):
        r = merge.merge_state({}, {})
        self.assertEqual(set(r), {"srs", "progress", "profile", "exam_date"})

    def test_merge_state_handles_none(self):
        """Мусор вместо состояния не должен ронять сервер."""
        r = merge.merge_state(None, None)
        self.assertEqual(r["srs"], {})


class TestParityWithClient(unittest.TestCase):
    """Клиент и сервер обязаны сливать состояние одинаково."""

    def test_js_and_python_agree(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node не найден — проверка паритета пропущена")

        proc = subprocess.run(
            [node, str(BASE / "webapp" / "_sync_check.mjs"), "--dump"],
            capture_output=True, text=True, encoding="utf-8", cwd=str(BASE),
        )
        self.assertEqual(proc.returncode, 0, f"не удалось получить эталон: {proc.stderr}")
        js = json.loads(proc.stdout)
        py = python_results()

        self.assertEqual(set(js), set(py), "наборы проверяемых правил разошлись")

        for name in sorted(py):
            for i, (a, b) in enumerate(zip(py[name], js[name])):
                with self.subTest(rule=name, case=i):
                    self.assertEqual(
                        json.loads(json.dumps(a, sort_keys=True)),
                        json.loads(json.dumps(b, sort_keys=True)),
                        f"webapp/sync.js и api/merge.py разошлись в правиле "
                        f"'{name}', случай {i}",
                    )

    def test_limits_match(self):
        """Числовые лимиты продублированы в трёх местах — они обязаны совпадать."""
        sync_js = (BASE / "webapp" / "sync.js").read_text(encoding="utf-8")
        progress_js = (BASE / "webapp" / "progress.js").read_text(encoding="utf-8")
        self.assertIn(f"MAX_HISTORY_DAYS = {merge.MAX_HISTORY_DAYS}", sync_js)
        self.assertIn(f"MAX_ATTEMPTS = {merge.MAX_ATTEMPTS}", sync_js)
        self.assertIn(f"MAX_DAYS = {merge.MAX_HISTORY_DAYS}", progress_js)
        self.assertIn(f"MAX_ATTEMPTS = {merge.MAX_ATTEMPTS}", progress_js)


if __name__ == "__main__":
    unittest.main(verbosity=2)
