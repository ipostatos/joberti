#!/usr/bin/env python3
"""
Тесты Telegram-бота без обращения к сети.

Проверяется то, что реально может сломаться: разбор callback-данных, лимиты
Telegram на длину сообщений и кнопок, работа с прогрессом чата, поведение в
группах и наличие всех текстов.

Запуск:  python tests/test_bot.py
"""
from __future__ import annotations

import importlib
import os
import sys
import tempfile
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE))


def import_bot(**env):
    for k, v in env.items():
        os.environ[k] = str(v)
    if "bot" in sys.modules:
        del sys.modules["bot"]
    return importlib.import_module("bot")


class TestContentLoading(unittest.TestCase):
    """Бот обязан подниматься на реальных данных."""

    @classmethod
    def setUpClass(cls):
        cls.bot = import_bot(BOT_TOKEN="123:test")

    def test_data_loaded(self):
        self.assertGreaterEqual(len(self.bot.QUESTIONS), 120)
        self.assertGreaterEqual(len(self.bot.MOCKS), 40)
        self.assertGreaterEqual(len(self.bot.GLOSSARY), 100)
        self.assertGreaterEqual(len(self.bot.CASES), 12)

    def test_indexes_built(self):
        self.assertEqual(len(self.bot.QUESTIONS_BY_ID), len(self.bot.QUESTIONS))
        self.assertEqual(len(self.bot.MOCKS_BY_ID), len(self.bot.MOCKS))

    def test_topic_titles_resolve(self):
        for q in self.bot.QUESTIONS:
            with self.subTest(q=q["id"]):
                self.assertNotEqual(self.bot.topic_title(q["topic"]), q["topic"],
                                    "тема вопроса должна иметь читаемое название")


class TestTelegramLimits(unittest.TestCase):
    """Тексты обязаны укладываться в ограничения Telegram."""

    @classmethod
    def setUpClass(cls):
        cls.bot = import_bot(BOT_TOKEN="123:test")

    def test_cut_respects_limit(self):
        self.assertEqual(self.bot.cut("abcdef", 3), "ab…")
        self.assertEqual(self.bot.cut("ab", 10), "ab")
        self.assertLessEqual(len(self.bot.cut("x" * 5000, 4096)), 4096)

    def test_question_text_fits_message_limit(self):
        for q in self.bot.QUESTIONS:
            text = f"{q['question']}\n\n{q['explanation']}\n\n" + "\n".join(q["why"])
            with self.subTest(q=q["id"]):
                self.assertLess(len(text), self.bot.TG_MSG_LIMIT,
                                "разбор вопроса не влезет в одно сообщение")

    def test_options_fit_button_limit_after_cut(self):
        for q in self.bot.QUESTIONS:
            for i, opt in enumerate(q["options"]):
                label = self.bot.cut(f"{i + 1}. {opt}", self.bot.BTN_TEXT_LIMIT)
                with self.subTest(q=q["id"], opt=i):
                    self.assertLessEqual(len(label), self.bot.BTN_TEXT_LIMIT)

    def test_mock_reveal_fits_message_limit(self):
        for m in self.bot.MOCKS:
            points = "\n".join(f"• {p}" for p in m["expected_points"][:6])
            flags = "\n".join(f"• {p}" for p in m["red_flags"][:4])
            text = f"{m['question']}\n{points}\n{flags}\n{m['model_answer_short']}"
            with self.subTest(m=m["id"]):
                self.assertLess(len(text), self.bot.TG_MSG_LIMIT)

    def test_callback_data_within_64_bytes(self):
        """Telegram ограничивает callback_data 64 байтами. Длинный id вопроса
        молча ломал бы кнопку уже в проде."""
        for q in self.bot.QUESTIONS:
            for orig in range(4):
                data = f"a:{q['id']}:{orig}:mistakes"
                with self.subTest(q=q["id"]):
                    self.assertLessEqual(len(data.encode("utf-8")), 64, data)
        for m in self.bot.MOCKS:
            data = f"mr:{m['id']}"
            with self.subTest(m=m["id"]):
                self.assertLessEqual(len(data.encode("utf-8")), 64, data)


class TestProgress(unittest.TestCase):
    """Прогресс чат-режима: запись, ошибки, устойчивость к мусору."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="itb-bot-")
        self.bot = import_bot(BOT_TOKEN="123:test")
        self.bot.PROGRESS_DIR = Path(self.tmp)

    def test_empty_progress_for_new_user(self):
        p = self.bot.load_progress(1)
        self.assertEqual(
            p,
            {"answered": 0, "correct": 0, "wrong": [], "seen": [], "track": None},
        )

    def test_correct_answer_recorded(self):
        qid = self.bot.QUESTIONS[0]["id"]
        self.bot.record_answer(1, qid, True)
        p = self.bot.load_progress(1)
        self.assertEqual(p["answered"], 1)
        self.assertEqual(p["correct"], 1)
        self.assertEqual(p["wrong"], [])
        self.assertIn(qid, p["seen"])

    def test_wrong_answer_goes_to_mistakes(self):
        qid = self.bot.QUESTIONS[0]["id"]
        self.bot.record_answer(2, qid, False)
        self.assertEqual(self.bot.load_progress(2)["wrong"], [qid])

    def test_correcting_mistake_removes_it(self):
        qid = self.bot.QUESTIONS[0]["id"]
        self.bot.record_answer(3, qid, False)
        self.bot.record_answer(3, qid, True)
        p = self.bot.load_progress(3)
        self.assertEqual(p["wrong"], [], "исправленная ошибка должна уйти из списка")
        self.assertEqual(p["answered"], 2)

    def test_wrong_not_duplicated(self):
        qid = self.bot.QUESTIONS[0]["id"]
        self.bot.record_answer(4, qid, False)
        self.bot.record_answer(4, qid, False)
        self.assertEqual(self.bot.load_progress(4)["wrong"], [qid])

    def test_seen_list_is_capped(self):
        for q in self.bot.QUESTIONS:
            self.bot.record_answer(5, q["id"], True)
        self.assertLessEqual(len(self.bot.load_progress(5)["seen"]), 500)

    def test_corrupt_file_does_not_crash(self):
        path = Path(self.tmp) / "6.json"
        path.write_text("{это не json", encoding="utf-8")
        p = self.bot.load_progress(6)
        self.assertEqual(p["answered"], 0, "битый файл читается как пустой прогресс")

    def test_partial_file_is_repaired(self):
        path = Path(self.tmp) / "7.json"
        path.write_text('{"answered": 5}', encoding="utf-8")
        p = self.bot.load_progress(7)
        self.assertEqual(p["answered"], 5)
        self.assertEqual(p["wrong"], [], "недостающие поля дозаполняются")


class TestQuestionSelection(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="itb-bot-")
        self.bot = import_bot(BOT_TOKEN="123:test")
        self.bot.PROGRESS_DIR = Path(self.tmp)

    def test_random_returns_question(self):
        q = self.bot.pick_question(1, "random")
        self.assertIsNotNone(q)
        self.assertIn("options", q)

    def test_mistakes_empty_returns_none(self):
        self.assertIsNone(self.bot.pick_question(1, "mistakes"))

    def test_mistakes_returns_wrong_question(self):
        qid = self.bot.QUESTIONS[3]["id"]
        self.bot.record_answer(2, qid, False)
        q = self.bot.pick_question(2, "mistakes")
        self.assertEqual(q["id"], qid)

    def test_unseen_preferred(self):
        """Пока есть невиданные вопросы, повторять уже отвеченные бессмысленно."""
        for q in self.bot.QUESTIONS[:-1]:
            self.bot.record_answer(3, q["id"], True)
        picked = self.bot.pick_question(3, "random")
        self.assertEqual(picked["id"], self.bot.QUESTIONS[-1]["id"])

    def test_falls_back_when_all_seen(self):
        for q in self.bot.QUESTIONS:
            self.bot.record_answer(4, q["id"], True)
        self.assertIsNotNone(self.bot.pick_question(4, "random"),
                             "когда всё просмотрено, бот всё равно должен дать вопрос")

    def test_track_filters_questions(self):
        """С выбранным треком случайный вопрос приходит только из него:
        SEO-пользователь не должен получать вопрос про Kubernetes."""
        for t_ in self.bot.TRACKS:
            data = self.bot.load_progress(5)
            data["track"] = t_["id"]
            self.bot.save_progress(5, data)
            for _ in range(20):
                q = self.bot.pick_question(5, "random")
                self.assertEqual(q["track_id"], t_["id"])

    def test_track_filters_mocks(self):
        for t_ in self.bot.TRACKS:
            pool = self.bot.mocks_for(t_["id"])
            self.assertTrue(pool, f"у трека {t_['id']} нет mock-вопросов")
            self.assertTrue(all(m["track_id"] == t_["id"] for m in pool))

    def test_unknown_track_in_file_is_reset(self):
        """Трек, исчезнувший из контента, не должен ронять выборку."""
        data = self.bot.load_progress(6)
        data["track"] = "deleted-track"
        self.bot.save_progress(6, data)
        self.assertIsNone(self.bot.load_progress(6)["track"])
        self.assertIsNotNone(self.bot.pick_question(6, "random"))

    def test_track_callback_data_within_64_bytes(self):
        """Кнопки выбора трека тоже ограничены 64 байтами callback_data."""
        for t_ in self.bot.TRACKS:
            for mode in ("random", "mistakes", "mock", ""):
                data = f"tr:{t_['id']}:{mode}"
                self.assertLessEqual(len(data.encode("utf-8")), 64, data)


class TestKeyboards(unittest.TestCase):

    def test_fallback_mode_without_webapp(self):
        b = import_bot(BOT_TOKEN="123:test", WEBAPP_BASE="")
        self.assertFalse(b.HAS_WEBAPP)
        markup = b.main_keyboard()
        # В fallback-режиме не должно быть ни одной web_app-кнопки: она просто
        # не откроется и будет выглядеть сломанной.
        for row in markup.inline_keyboard:
            for btn in row:
                self.assertIsNone(btn.web_app)
                self.assertIsNotNone(btn.callback_data)

    def test_webapp_mode(self):
        b = import_bot(BOT_TOKEN="123:test", WEBAPP_BASE="https://example.org")
        self.assertTrue(b.HAS_WEBAPP)
        self.assertEqual(b.WEBAPP_HOME_URL, "https://example.org/index.html")
        markup = b.main_keyboard()
        self.assertTrue(any(btn.web_app for row in markup.inline_keyboard for btn in row))

    def test_http_base_is_not_accepted(self):
        """Telegram открывает Mini App только по https: незащищённый адрес
        должен переводить бота в fallback, а не давать нерабочую кнопку."""
        b = import_bot(BOT_TOKEN="123:test", WEBAPP_BASE="http://example.org")
        self.assertFalse(b.HAS_WEBAPP)

    def test_question_keyboard_maps_options(self):
        b = import_bot(BOT_TOKEN="123:test", WEBAPP_BASE="")
        q = b.QUESTIONS[0]
        markup = b.question_keyboard(q, [2, 0, 3, 1], "random")
        self.assertEqual(len(markup.inline_keyboard), 4)
        # callback_data обязан нести ИСХОДНЫЙ индекс, иначе перемешивание
        # вариантов приводило бы к неверной проверке ответа.
        origs = [int(row[0].callback_data.split(":")[2]) for row in markup.inline_keyboard]
        self.assertEqual(origs, [2, 0, 3, 1])


class TestTexts(unittest.TestCase):

    def test_all_keys_present(self):
        from bot_i18n import RU, t
        required = [
            "start_title", "start_body", "start_body_fallback", "menu_title",
            "help_title", "help_body", "privacy_title", "privacy_body",
            "stats_title", "stats_body", "err_stale", "group_notice",
        ]
        for key in required:
            with self.subTest(key=key):
                self.assertIn(key, RU)
                self.assertTrue(t(key).strip())

    def test_unknown_key_is_visible(self):
        from bot_i18n import t
        self.assertEqual(t("нет-такого-ключа"), "[нет-такого-ключа]")

    def test_missing_format_arg_does_not_crash(self):
        from bot_i18n import t
        self.assertIsInstance(t("stats_body", answered=1), str)

    def test_privacy_covers_required_topics(self):
        """Раздел приватности обязан отвечать на четыре вопроса."""
        from bot_i18n import t
        body = t("privacy_body").lower()
        for word in ("хранится", "удаление", "не передаются", "устройстве"):
            with self.subTest(word=word):
                self.assertIn(word, body)

    def test_help_mentions_honest_readiness(self):
        from bot_i18n import t
        self.assertIn("74", t("help_body"),
                      "справка должна честно объяснять ограничение готовности")


if __name__ == "__main__":
    unittest.main(verbosity=2)
