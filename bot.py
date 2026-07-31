#!/usr/bin/env python3
"""
Interview Trainer — Telegram-бот.

Роль бота: launcher для Mini App. Основная работа происходит в приложении,
поэтому чат намеренно остаётся тонким. Превращать его в сложный интерфейс
не нужно: в чате нельзя нормально показать план, кольцо готовности и разбор
кейса, а дублирование логики в двух местах гарантированно разъедется.

Fallback без Mini App (не задан WEBAPP_BASE) даёт минимум, который реально
работает в чате: случайный вопрос с разбором, работа над ошибками, вопрос для
mock interview и статистика.

Команды: /start /menu /track /help /stats /privacy

Запуск:  python bot.py     (нужен BOT_TOKEN в .env или в окружении)
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import random
import sys
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ChatType, ParseMode
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    Message,
    WebAppInfo,
)

from bot_i18n import t

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PROGRESS_DIR = BASE_DIR / "progress"

TG_MSG_LIMIT = 4096          # ограничение Telegram на длину сообщения
BTN_TEXT_LIMIT = 64          # ограничение на текст кнопки

logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("interview-bot")


# ── конфигурация ───────────────────────────────────────────────────────────

def load_env_value(name: str) -> str:
    """Значение из окружения, иначе из .env рядом с ботом.

    Переменная, ЗАДАННАЯ в окружении, перебивает файл — даже если она пустая.
    Пустое значение здесь означает «выключено», а не «посмотри в .env»: иначе
    невозможно отключить настройку, не редактируя файл, и любой запуск рядом
    с боевым .env молча подхватывает боевые значения (на этом падал
    tests/test_bot.py прямо на сервере).
    """
    if name in os.environ:
        return os.environ[name].strip()
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith(name) and "=" in line:
                key, val = line.split("=", 1)
                if key.strip() == name:
                    return val.strip().strip('"').strip("'")
    return ""


def load_token() -> str:
    token = load_env_value("BOT_TOKEN")
    if not token:
        raise SystemExit(
            "Не задан BOT_TOKEN. Создайте .env со строкой BOT_TOKEN=... "
            "или задайте переменную окружения."
        )
    return token


WEBAPP_BASE = load_env_value("WEBAPP_BASE").rstrip("/")


def webapp_url(env_name: str, path: str) -> str:
    """URL страницы Mini App с возможностью точечного переопределения."""
    override = load_env_value(env_name)
    if override:
        return override
    return f"{WEBAPP_BASE}{path}" if WEBAPP_BASE else ""


WEBAPP_HOME_URL = webapp_url("WEBAPP_HOME_URL", "/index.html")
WEBAPP_QUIZ_URL = webapp_url("WEBAPP_QUIZ_URL", "/quiz.html")
WEBAPP_MOCK_URL = webapp_url("WEBAPP_MOCK_URL", "/mock.html")
WEBAPP_ROADMAP_URL = webapp_url("WEBAPP_ROADMAP_URL", "/roadmap.html")
WEBAPP_ENGLISH_URL = webapp_url("WEBAPP_ENGLISH_URL", "/english.html")

HAS_WEBAPP = bool(WEBAPP_HOME_URL.startswith("https://"))


# ── контент ────────────────────────────────────────────────────────────────

def load_json(name: str) -> dict:
    with open(DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


QUESTIONS: list[dict] = load_json("questions.json")["questions"]
MOCKS: list[dict] = load_json("mock_questions.json")["questions"]
TOPICS: dict[str, dict] = {t_["id"]: t_ for t_ in load_json("topics.json")["topics"]}
SOURCES: dict[str, dict] = {s["id"]: s for s in load_json("sources.json")["sources"]}
GLOSSARY: list[dict] = load_json("glossary.json")["terms"]
LESSONS: list[dict] = load_json("lessons.json")["lessons"]
CASES: list[dict] = load_json("cases.json")["cases"]

QUESTIONS_BY_ID = {q["id"]: q for q in QUESTIONS}
MOCKS_BY_ID = {m["id"]: m for m in MOCKS}

# Треки нужны и чату: без них случайный вопрос приходит из ЧУЖОЙ профессии —
# SEO-специалист получает вопрос про CrashLoopBackOff.
TRACKS: list[dict] = [
    t_ for t_ in load_json("tracks.json")["tracks"] if t_.get("status") == "active"
]
TRACKS_BY_ID: dict[str, dict] = {t_["id"]: t_ for t_ in TRACKS}

# Категории mock общие для всех треков, поэтому названия — нейтральные:
# «Основы SEO» на треке QA выглядели бы ошибкой.
MOCK_CATEGORY_TITLES = {
    "intro": "Рассказ о себе", "motivation": "Мотивация",
    "fundamentals": "Основы профессии", "technical": "Технический блок",
    "tools": "Инструменты", "practical": "Практика",
    "portfolio": "Портфолио", "communication": "Коммуникация",
    "behavioral": "Behavioral", "english": "English",
}


def topic_title(topic_id: str) -> str:
    tp = TOPICS.get(topic_id)
    return tp["title"] if tp else topic_id


# ── лёгкий прогресс для чат-режима ─────────────────────────────────────────
#
# В чате хранится минимум: что отвечено и где ошибся. Настоящий прогресс,
# SRS и готовность живут в приложении и синхронизируются через API — дублировать
# их здесь означало бы завести второй источник правды.

def _progress_path(user_id: int) -> Path:
    return PROGRESS_DIR / f"{user_id}.json"


def load_progress(user_id: int) -> dict:
    path = _progress_path(user_id)
    if not path.exists():
        return {"answered": 0, "correct": 0, "wrong": [], "seen": [], "track": None}
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError):
        return {"answered": 0, "correct": 0, "wrong": [], "seen": [], "track": None}
    data.setdefault("answered", 0)
    data.setdefault("correct", 0)
    data.setdefault("wrong", [])
    data.setdefault("seen", [])
    data.setdefault("track", None)
    # Трек мог исчезнуть из контента между релизами — тогда спросим заново.
    if data["track"] not in TRACKS_BY_ID:
        data["track"] = None
    return data


def save_progress(user_id: int, data: dict) -> None:
    """Атомарная запись: частично записанный файл сломал бы следующий запуск."""
    PROGRESS_DIR.mkdir(parents=True, exist_ok=True)
    path = _progress_path(user_id)
    tmp = path.with_suffix(".json.tmp")
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        tmp.replace(path)
    except OSError as e:
        log.warning("не удалось сохранить прогресс %s: %s", user_id, e)


def record_answer(user_id: int, question_id: str, correct: bool) -> None:
    """Гонок здесь нет: aiogram работает в одном потоке, а вся мутация ниже
    синхронна — между чтением и записью нет ни одного await."""
    data = load_progress(user_id)
    data["answered"] += 1
    if correct:
        data["correct"] += 1
        if question_id in data["wrong"]:
            data["wrong"].remove(question_id)
    elif question_id not in data["wrong"]:
        data["wrong"].append(question_id)
    if question_id not in data["seen"]:
        data["seen"].append(question_id)
        # Не даём файлу расти бесконечно: держим окно последних вопросов.
        if len(data["seen"]) > 500:
            data["seen"] = data["seen"][-500:]
    save_progress(user_id, data)


# ── клавиатуры ─────────────────────────────────────────────────────────────

def kb(rows: list[list[InlineKeyboardButton]]) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=rows)


def main_keyboard() -> InlineKeyboardMarkup:
    if HAS_WEBAPP:
        rows = [
            [InlineKeyboardButton(text=t("btn_open_app"),
                                  web_app=WebAppInfo(url=WEBAPP_HOME_URL))],
            [
                InlineKeyboardButton(text=t("btn_plan"),
                                     web_app=WebAppInfo(url=WEBAPP_ROADMAP_URL)),
                InlineKeyboardButton(text=t("btn_quiz"),
                                     web_app=WebAppInfo(url=WEBAPP_QUIZ_URL)),
            ],
            [InlineKeyboardButton(text=t("btn_mock"),
                                  web_app=WebAppInfo(url=WEBAPP_MOCK_URL))],
            [InlineKeyboardButton(text=t("btn_english"),
                                  web_app=WebAppInfo(url=WEBAPP_ENGLISH_URL))],
        ]
        return kb(rows)
    return fallback_keyboard()


def fallback_keyboard() -> InlineKeyboardMarkup:
    return kb([
        [InlineKeyboardButton(text=t("btn_random"), callback_data="q:random")],
        [InlineKeyboardButton(text=t("btn_mistakes"), callback_data="q:mistakes")],
        [InlineKeyboardButton(text=t("btn_mock_q"), callback_data="m:random")],
        [InlineKeyboardButton(text=t("btn_track"), callback_data="tr")],
        [InlineKeyboardButton(text=t("btn_stats"), callback_data="stats")],
    ])


def track_keyboard(mode: str) -> InlineKeyboardMarkup:
    """Выбор трека. mode — что сделать после выбора: q-режим, mock или ничего."""
    return kb([
        [InlineKeyboardButton(text=t_["title"], callback_data=f"tr:{t_['id']}:{mode}")]
        for t_ in TRACKS
    ])


def cut(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[: limit - 1] + "…"


# ── бот ────────────────────────────────────────────────────────────────────

dp = Dispatcher()


def private_only(message: Message) -> bool:
    return message.chat.type == ChatType.PRIVATE


@dp.message(CommandStart())
async def cmd_start(message: Message) -> None:
    if not private_only(message):
        await message.answer(t("group_notice"))
        return
    body = t("start_body") if HAS_WEBAPP else t("start_body_fallback")
    stats_line = t(
        "content_stats",
        questions=len(QUESTIONS), terms=len(GLOSSARY), lessons=len(LESSONS),
        mocks=len(MOCKS), cases=len(CASES),
    )
    await message.answer(
        f"{t('start_title')}\n\n{body}\n\n<i>{stats_line}</i>",
        reply_markup=main_keyboard(),
    )


@dp.message(Command("menu"))
async def cmd_menu(message: Message) -> None:
    if not private_only(message):
        await message.answer(t("group_notice"))
        return
    await message.answer(
        f"{t('menu_title')}\n\n{t('menu_body')}",
        reply_markup=fallback_keyboard(),
    )


@dp.message(Command("help"))
async def cmd_help(message: Message) -> None:
    await message.answer(f"{t('help_title')}\n\n{t('help_body')}",
                         reply_markup=main_keyboard())


@dp.message(Command("privacy"))
async def cmd_privacy(message: Message) -> None:
    await message.answer(f"{t('privacy_title')}\n\n{t('privacy_body')}")


@dp.message(Command("track"))
async def cmd_track(message: Message) -> None:
    if not private_only(message):
        await message.answer(t("group_notice"))
        return
    p = load_progress(message.from_user.id)
    current = TRACKS_BY_ID.get(p["track"])
    head = t("track_current", track=current["title"]) if current else t("track_choose")
    await message.answer(head, reply_markup=track_keyboard(""))


@dp.message(Command("stats"))
async def cmd_stats(message: Message) -> None:
    if not private_only(message):
        await message.answer(t("group_notice"))
        return
    await send_stats(message.from_user.id, message.answer)


async def send_stats(user_id: int, sender) -> None:
    p = load_progress(user_id)
    if not p["answered"]:
        await sender(f"{t('stats_title')}\n\n{t('stats_empty')}",
                     reply_markup=main_keyboard())
        return
    pct = round(p["correct"] / p["answered"] * 100)
    await sender(
        t("stats_title") + "\n\n" + t(
            "stats_body",
            answered=p["answered"], correct=p["correct"], pct=pct,
            mistakes=len(p["wrong"]),
        ),
        reply_markup=main_keyboard(),
    )


# ── тест в чате ────────────────────────────────────────────────────────────

def questions_for(track_id: str | None) -> list[dict]:
    """Вопросы трека пользователя; без выбранного трека — весь банк."""
    if track_id in TRACKS_BY_ID:
        return [q for q in QUESTIONS if q.get("track_id") == track_id]
    return QUESTIONS


def mocks_for(track_id: str | None) -> list[dict]:
    if track_id in TRACKS_BY_ID:
        return [m for m in MOCKS if m.get("track_id") == track_id]
    return MOCKS


def pick_question(user_id: int, mode: str) -> dict | None:
    p = load_progress(user_id)
    if mode == "mistakes":
        pool = [QUESTIONS_BY_ID[q] for q in p["wrong"] if q in QUESTIONS_BY_ID]
        return random.choice(pool) if pool else None
    bank = questions_for(p["track"])
    # Сначала показываем невиданные: повторять одно и то же в чате бессмысленно.
    unseen = [q for q in bank if q["id"] not in p["seen"]]
    pool = unseen or bank
    return random.choice(pool) if pool else None


def question_keyboard(q: dict, order: list[int], mode: str) -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(
            text=cut(f"{i + 1}. {q['options'][orig]}", BTN_TEXT_LIMIT),
            callback_data=f"a:{q['id']}:{orig}:{mode}",
        )]
        for i, orig in enumerate(order)
    ]
    return kb(rows)


async def send_question(user_id: int, mode: str, sender) -> None:
    # Без выбранного трека случайный вопрос пришёл бы из чужой профессии —
    # сначала спрашиваем трек, потом продолжаем тот же режим.
    if mode != "mistakes" and load_progress(user_id)["track"] is None:
        await sender(t("track_choose"), reply_markup=track_keyboard(mode))
        return
    q = pick_question(user_id, mode)
    if not q:
        if mode == "mistakes":
            await sender(t("mistakes_empty"), reply_markup=main_keyboard())
        else:
            await sender(t("quiz_no_questions"))
        return

    # Варианты перемешиваются, как и в приложении: позицию верного ответа
    # заучить нельзя.
    order = list(range(len(q["options"])))
    random.shuffle(order)

    text = (
        f"<i>{t('quiz_topic', topic=topic_title(q['topic']))}</i>\n\n"
        f"<b>{q['question']}</b>"
    )
    await sender(cut(text, TG_MSG_LIMIT), reply_markup=question_keyboard(q, order, mode))


@dp.callback_query(F.data.startswith("q:"))
async def cb_question(call: CallbackQuery) -> None:
    mode = call.data.split(":", 1)[1]
    await call.answer()
    await send_question(call.from_user.id, mode, call.message.answer)


@dp.callback_query(F.data.startswith("a:"))
async def cb_answer(call: CallbackQuery) -> None:
    parts = call.data.split(":")
    if len(parts) != 4:
        await call.answer(t("err_stale"), show_alert=True)
        return
    _, qid, chosen_raw, mode = parts
    q = QUESTIONS_BY_ID.get(qid)
    if not q:
        await call.answer(t("err_stale"), show_alert=True)
        return
    try:
        chosen = int(chosen_raw)
    except ValueError:
        await call.answer(t("err_stale"), show_alert=True)
        return
    if not 0 <= chosen < len(q["options"]):
        await call.answer(t("err_stale"), show_alert=True)
        return

    correct = chosen == q["answer"]
    record_answer(call.from_user.id, qid, correct)
    await call.answer(t("quiz_correct") if correct else "✗", show_alert=False)

    head = t("quiz_correct") if correct else t("quiz_wrong", answer=q["options"][q["answer"]])
    parts_out = [
        f"<b>{q['question']}</b>",
        "",
        head,
        "",
        t("quiz_explanation", text=q["explanation"]),
    ]

    # Разбор варианта, который выбрал пользователь: самое полезное место,
    # если он ошибся.
    if not correct and q.get("why") and chosen < len(q["why"]):
        parts_out += ["", f"<i>{q['why'][chosen]}</i>"]

    src_ids = q.get("source_refs") or []
    if src_ids:
        s = SOURCES.get(src_ids[0])
        if s:
            parts_out += ["", t("quiz_source", title=s["title"], publisher=s["publisher"])]

    rows = [[InlineKeyboardButton(text=t("btn_more"), callback_data=f"q:{mode}")]]
    if HAS_WEBAPP:
        rows.append([InlineKeyboardButton(
            text=t("btn_open_app"), web_app=WebAppInfo(url=WEBAPP_QUIZ_URL))])
    rows.append([InlineKeyboardButton(text=t("btn_stats"), callback_data="stats")])

    try:
        await call.message.edit_text(cut("\n".join(parts_out), TG_MSG_LIMIT),
                                     reply_markup=kb(rows))
    except Exception:
        # Сообщение могло быть удалено или слишком старым для правки —
        # тогда просто отправляем новое, а не роняем обработчик.
        await call.message.answer(cut("\n".join(parts_out), TG_MSG_LIMIT),
                                  reply_markup=kb(rows))


# ── mock в чате ────────────────────────────────────────────────────────────

async def send_mock(user_id: int, sender) -> None:
    p = load_progress(user_id)
    if p["track"] is None:
        await sender(t("track_choose"), reply_markup=track_keyboard("mock"))
        return
    pool = mocks_for(p["track"]) or MOCKS
    m = random.choice(pool)
    cat = MOCK_CATEGORY_TITLES.get(m["category"], m["category"])
    text = (
        t("mock_q", category=cat, question=m["question"]) + "\n\n" +
        t("mock_intent", intent=m["intent"]) + "\n\n" +
        t("mock_hint")
    )
    rows = [[InlineKeyboardButton(text=t("btn_reveal"), callback_data=f"mr:{m['id']}")]]
    if HAS_WEBAPP:
        rows.append([InlineKeyboardButton(
            text=t("btn_mock"), web_app=WebAppInfo(url=WEBAPP_MOCK_URL))])
    await sender(cut(text, TG_MSG_LIMIT), reply_markup=kb(rows))


@dp.callback_query(F.data.startswith("m:"))
async def cb_mock(call: CallbackQuery) -> None:
    await call.answer()
    await send_mock(call.from_user.id, call.message.answer)


@dp.callback_query(F.data.startswith("mr:"))
async def cb_mock_reveal(call: CallbackQuery) -> None:
    mid = call.data.split(":", 1)[1]
    m = MOCKS_BY_ID.get(mid)
    if not m:
        await call.answer(t("err_stale"), show_alert=True)
        return
    await call.answer()

    points = "\n".join(f"• {p}" for p in (m.get("expected_points") or [])[:6])
    flags = "\n".join(f"• {p}" for p in (m.get("red_flags") or [])[:4])
    text = (
        f"<b>{m['question']}</b>\n\n" +
        t("mock_reveal", points=points, flags=flags, answer=m["model_answer_short"]) +
        "\n\n" + t("mock_selfcheck")
    )
    rows = [[InlineKeyboardButton(text=t("btn_mock_q"), callback_data="m:random")]]
    if HAS_WEBAPP:
        rows.append([InlineKeyboardButton(
            text=t("btn_mock"), web_app=WebAppInfo(url=WEBAPP_MOCK_URL))])
    await call.message.answer(cut(text, TG_MSG_LIMIT), reply_markup=kb(rows))


@dp.callback_query(F.data == "stats")
async def cb_stats(call: CallbackQuery) -> None:
    await call.answer()
    await send_stats(call.from_user.id, call.message.answer)


# ── выбор трека ────────────────────────────────────────────────────────────

@dp.callback_query(F.data == "tr")
async def cb_track_menu(call: CallbackQuery) -> None:
    await call.answer()
    await call.message.answer(t("track_choose"), reply_markup=track_keyboard(""))


@dp.callback_query(F.data.startswith("tr:"))
async def cb_track_set(call: CallbackQuery) -> None:
    parts = call.data.split(":")
    if len(parts) != 3 or parts[1] not in TRACKS_BY_ID:
        await call.answer(t("err_stale"), show_alert=True)
        return
    _, track_id, mode = parts
    data = load_progress(call.from_user.id)
    data["track"] = track_id
    save_progress(call.from_user.id, data)
    await call.answer()
    await call.message.answer(
        t("track_set", track=TRACKS_BY_ID[track_id]["title"]))
    # Продолжаем то, ради чего спрашивали трек.
    if mode == "mock":
        await send_mock(call.from_user.id, call.message.answer)
    elif mode:
        await send_question(call.from_user.id, mode, call.message.answer)


@dp.callback_query()
async def cb_unknown(call: CallbackQuery) -> None:
    """Ловим всё, что не разобрали выше: устаревшая кнопка не должна молчать."""
    await call.answer(t("err_stale"), show_alert=True)


@dp.message(F.chat.type != ChatType.PRIVATE)
async def any_group_message(message: Message) -> None:
    """В группах бот не работает: он хранит персональный прогресс. Отвечаем
    только на упоминание команд, чтобы не шуметь в чужой переписке."""
    if message.text and message.text.startswith("/"):
        await message.answer(t("group_notice"))


@dp.message()
async def any_message(message: Message) -> None:
    if not private_only(message):
        return
    await message.answer(
        f"{t('menu_title')}\n\n{t('menu_body')}",
        reply_markup=main_keyboard(),
    )


# ── запуск ─────────────────────────────────────────────────────────────────

async def main() -> None:
    token = load_token()
    bot = Bot(token=token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    PROGRESS_DIR.mkdir(parents=True, exist_ok=True)

    if HAS_WEBAPP:
        try:
            await bot.set_chat_menu_button(
                menu_button=MenuButtonWebApp(
                    text=t("btn_open_app"), web_app=WebAppInfo(url=WEBAPP_HOME_URL))
            )
            log.info("кнопка меню настроена на %s", WEBAPP_HOME_URL)
        except Exception as e:
            # Не критично: бот работает и без кнопки меню.
            log.warning("не удалось настроить кнопку меню: %s", e)
    else:
        log.warning(
            "WEBAPP_BASE не задан или не https — бот работает в упрощённом чат-режиме"
        )

    log.info(
        "загружено: вопросов %d, mock %d, терминов %d, уроков %d, кейсов %d",
        len(QUESTIONS), len(MOCKS), len(GLOSSARY), len(LESSONS), len(CASES),
    )
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit) as e:
        if isinstance(e, SystemExit) and e.code:
            print(e, file=sys.stderr)
            raise
        log.info("остановлено")
