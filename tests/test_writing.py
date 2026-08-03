#!/usr/bin/env python3
"""
Тесты проверки письменного задания + ПАРИТЕТ с браузерной реализацией.

Правило сопоставления продублировано в webapp/writing.js и
tools/content_lib.py. В браузере оно решает, засчитать ли человеку
конструкцию; в валидаторе — проходит ли эталонный ответ собственный чек-лист.
Расхождение означает, что валидатор пропускает задание, на котором пользователь
получит «конструкция не найдена» в тексте, где она есть.

Паритет устроен иначе, чем в test_sync.py: вход берётся из дампа
`node webapp/_writing_check.mjs --dump`, а не дублируется здесь. Сравнивается
одна чистая функция, поэтому единственный источник входа строго лучше — он
исключает расхождение самих фикстур. Если Node недоступен, паритет
пропускается, но собственные проверки Python всё равно выполняются.

Запуск:  python tests/test_writing.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "tools"))

from content_lib import (  # noqa: E402
    load_all, writing_check, writing_count_words, writing_hit, writing_norm,
)


class TestNorm(unittest.TestCase):
    def test_padded_with_spaces(self):
        """Обрамление пробелами — то, на чём держатся границы слов."""
        for text in ["hello", "", "  x  ", None, "!!!"]:
            n = writing_norm(text)
            self.assertTrue(n.startswith(" ") and n.endswith(" "), repr(n))

    def test_collapses_punctuation_and_case(self):
        self.assertEqual(writing_norm("Summary: card DECLINED!"), " summary card declined ")

    def test_apostrophes_unified(self):
        self.assertEqual(writing_norm("I’m"), writing_norm("I'm"))

    def test_cyrillic_becomes_spaces(self):
        self.assertEqual(writing_norm("Спасибо"), "  ")


class TestHit(unittest.TestCase):
    def test_word_boundaries(self):
        """«at» не должен находиться внутри «that» — класс ошибки, на котором
        раздел уже обжигался с русскими маркерами."""
        self.assertIsNone(writing_hit("I know that already.", ["at"]))
        self.assertEqual(writing_hit("We meet at noon.", ["at"]), "at")
        self.assertIsNone(writing_hit("This is impactful work.", ["impact"]))
        self.assertEqual(writing_hit("Impact: all users.", ["impact"]), "impact")

    def test_returns_first_matching_variant(self):
        self.assertEqual(
            writing_hit("Thanks for the offer.",
                        ["thank you for the offer", "thanks for the offer"]),
            "thanks for the offer",
        )

    def test_empty_variant_never_matches(self):
        self.assertIsNone(writing_hit("Some text", [""]))
        self.assertIsNone(writing_hit("Some text", []))

    def test_multiword_matched_whole(self):
        self.assertIsNone(writing_hit("Sorry for the notice.", ["sorry for the short notice"]))


class TestCountWords(unittest.TestCase):
    def test_counts(self):
        self.assertEqual(writing_count_words(""), 0)
        self.assertEqual(writing_count_words("   "), 0)
        self.assertEqual(writing_count_words("one two three"), 3)
        self.assertEqual(writing_count_words("non-blocking"), 2)
        self.assertEqual(writing_count_words("I'm fine"), 2)

    def test_russian_text_does_not_count(self):
        """Письмо по-русски обязано не набрать объём английского задания."""
        self.assertEqual(writing_count_words("Спасибо за ваше предложение"), 0)


class TestCheck(unittest.TestCase):
    TASK = {
        "min_words": 10,
        "must": [
            {"label": "Благодарность", "any": ["thank you for", "thanks for"], "why": "..."},
            {"label": "Срок", "any": ["by friday"], "why": "..."},
        ],
        "avoid": [{"label": "Ложная срочность", "any": ["asap", "urgent"], "why": "..."}],
    }

    def test_full_answer_passes(self):
        r = writing_check(
            "Thank you for the review. I will send the corrected version by Friday morning.",
            self.TASK)
        self.assertTrue(r["passed"])
        self.assertEqual((r["mustDone"], r["mustTotal"], r["avoidHit"]), (2, 2, 0))

    def test_missing_rule_is_named(self):
        r = writing_check("Thank you for the review. I will send the corrected version soon.",
                          self.TASK)
        self.assertFalse(r["passed"])
        self.assertEqual([m["ok"] for m in r["must"]], [True, False])

    def test_avoided_construction_blocks(self):
        r = writing_check(
            "Thanks for the review, I need your answer ASAP, and I will send it by Friday.",
            self.TASK)
        self.assertFalse(r["passed"])
        self.assertEqual(r["avoid"][0]["matched"], "asap")

    def test_too_short_does_not_pass(self):
        r = writing_check("Thanks for it by Friday.", self.TASK)
        self.assertFalse(r["enough"])
        self.assertFalse(r["passed"])

    def test_empty_never_passes(self):
        self.assertFalse(writing_check("", self.TASK)["passed"])
        self.assertFalse(writing_check("", {"min_words": 5})["passed"])


class TestContent(unittest.TestCase):
    """Каждый эталон в данных обязан проходить собственный чек-лист."""

    def test_model_answers_pass_their_own_checklist(self):
        c = load_all()
        tasks = [x for x in c.english_writing if x.get("task")]
        self.assertGreaterEqual(len(tasks), 10, "заданий с эталоном подозрительно мало")
        for x in tasks:
            with self.subTest(writing=x["id"]):
                r = writing_check(x["task"]["model_en"], x["task"])
                gaps = [m["label"] for m in r["must"] if not m["ok"]]
                hits = [a["label"] for a in r["avoid"] if not a["ok"]]
                self.assertTrue(
                    r["passed"],
                    f"{x['id']}: эталон не проходит свой чек-лист "
                    f"(слов {r['words']}/{r['minWords']}, не найдено {gaps}, "
                    f"запрещённое {hits})",
                )

    def test_every_template_has_a_task(self):
        """Заготовка без задания — экран, на котором нечего практиковать."""
        c = load_all()
        for x in c.english_writing:
            if x.get("kind") == "template":
                with self.subTest(writing=x["id"]):
                    self.assertIsInstance(x.get("task"), dict)


class TestParityWithClient(unittest.TestCase):
    """Браузер и валидатор обязаны сопоставлять текст одинаково."""

    def test_js_and_python_agree(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("node не найден — проверка паритета пропущена")

        proc = subprocess.run(
            [node, str(BASE / "webapp" / "_writing_check.mjs"), "--dump"],
            capture_output=True, text=True, encoding="utf-8", cwd=str(BASE),
        )
        self.assertEqual(proc.returncode, 0, f"не удалось получить эталон: {proc.stderr}")
        js = json.loads(proc.stdout)

        self.assertEqual(
            set(js), {"hit", "words", "check", "content"},
            "набор проверяемых правил в _writing_check.mjs изменился — "
            "обновите паритет",
        )
        for name in ("hit", "words", "check", "content"):
            self.assertTrue(js[name], f"дамп правила '{name}' пуст")

        for i, case in enumerate(js["hit"]):
            with self.subTest(rule="hit", case=i):
                got = writing_hit(case["input"]["text"], case["input"]["variants"])
                self.assertEqual(got, case["result"],
                                 f"writing.js и content_lib.py разошлись: {case['input']}")

        for i, case in enumerate(js["words"]):
            with self.subTest(rule="words", case=i):
                self.assertEqual(writing_count_words(case["input"]["text"]), case["result"],
                                 f"счёт слов разошёлся: {case['input']}")

        for name in ("check", "content"):
            for i, case in enumerate(js[name]):
                with self.subTest(rule=name, case=i):
                    got = writing_check(case["input"]["text"], case["input"]["task"])
                    self.assertEqual(
                        json.loads(json.dumps(got, sort_keys=True)),
                        json.loads(json.dumps(case["result"], sort_keys=True)),
                        f"разбор задания разошёлся в случае {i} правила '{name}'",
                    )


if __name__ == "__main__":
    unittest.main(verbosity=2)
