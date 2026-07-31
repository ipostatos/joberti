#!/usr/bin/env python3
"""
Генератор данных Mini App из источника правды data/*.json.

Зачем отдельный шаг: Mini App — статика без сборщика, ему нужен готовый объект
в JS, а не десяток JSON-запросов на старте. Источником правды при этом остаются
читаемые JSON, а не сгенерированные файлы.

Почему файлов несколько, а не один. Раньше весь контент лежал в одном
content_data.js, и человек на треке DevOps скачивал ещё и весь SEO-трек — 280 КБ
gzip вместо нужных ему 130 КБ. С каждым новым треком налог рос на всех сразу.
Теперь:

    content_core.js              — общее: список треков, источники, библиотека,
                                   ачивки, справочники категорий;
    content_track_<id>.js        — только один трек: темы, вопросы, уроки,
                                   мок-вопросы, глоссарий, кейсы, план, истории.

Трековый файл дописывает свои разделы в тот же объект window.CONTENT, поэтому
для страниц ничего не меняется: к моменту запуска app.js данные на месте.
Выбирает файл webapp/content-loader.js по треку из профиля.

CI проверяет, что сгенерированное не отстало от data/ — см. .github/workflows/ci.yml.
Поэтому вывод детерминирован: сортировка ключей, фиксированные разделители,
никакой даты генерации внутри.

Запуск:
    python tools/build_webapp_data.py
    python tools/build_webapp_data.py --check   # только сверить, не писать
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import BASE_DIR, load_all  # noqa: E402

OUT_DIR = BASE_DIR / "webapp" / "generated"
CORE_FILE = OUT_DIR / "content_core.js"

# Разделы, которые целиком принадлежат треку. Ключ — имя в CONTENT, значение —
# поле записи, по которому определяется принадлежность.
TRACK_SECTIONS = {
    "topics": "track_id",
    "vacancies": "track_id",
    "lessons": "track_id",
    "glossary": "track_ids",
    "questions": "track_id",
    "mockQuestions": "track_id",
    "cases": "track_id",
    "roadmap": "track_id",
    "stories": "track_id",
    # Английский сквозной: пустой track_ids значит «во всех треках», поэтому он
    # режется тем же правилом, что и глоссарий, и общая часть попадает в каждый
    # трековый файл. Класть его в core было бы дороже: тогда каждый скачивал бы
    # ещё и лексику чужих профессий.
    "englishPhrases": "track_ids",
    "englishVocab": "track_ids",
    "englishDrills": "track_ids",
    "englishWriting": "track_ids",
    "englishResources": "track_ids",
}

# Разделы, общие для всех треков. Источники — общий реестр цитирования, на него
# ссылаются source_refs обоих треков. Библиотека и ачивки сквозные по смыслу.
CORE_SECTIONS = (
    "tracks", "sources", "library", "achievements",
    "glossaryCategories", "mockCategories", "mockSessionFlow", "storyFramework",
    "englishPhraseCategories", "englishVocabCategories", "englishDrillCategories",
    "englishWritingCategories", "englishResourceCategories",
    "counts",
)

# Идентификатор трека попадает в имя файла, поэтому он обязан быть безопасным
# для пути. Проверяем на генерации, а не надеемся на дисциплину в data/.
SAFE_ID = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")

HEADER = """// ===========================================================================
// СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ РЕДАКТИРОВАТЬ РУКАМИ.
// Источник правды: data/*.json. Пересобрать:  python tools/build_webapp_data.py
// CI падает, если этот файл отстал от data/.
// ===========================================================================
"""


def track_file_name(track_id: str) -> str:
    return f"content_track_{track_id}.js"


def belongs(rec: dict, track_id: str, field: str) -> bool:
    if field == "track_ids":
        ids = rec.get("track_ids")
        # Пустой список трактуем как «во всех треках»: так глоссарий помечает
        # термины, не привязанные к конкретной профессии.
        return not ids or track_id in ids
    return rec.get(field) == track_id


def build_sections(c) -> dict:
    """Все разделы CONTENT одним словарём — дальше он режется на core и треки."""
    questions_by_topic: dict[str, list] = {}
    for q in c.questions:
        questions_by_topic.setdefault(q["topic"], []).append(q["id"])
    for ids in questions_by_topic.values():
        ids.sort()

    terms_by_topic: dict[str, list] = {}
    for t in c.glossary:
        for tid in t.get("topic_ids") or []:
            terms_by_topic.setdefault(tid, []).append(t["id"])
    for ids in terms_by_topic.values():
        ids.sort()

    return {
        "tracks": c.tracks,
        "topics": c.topics,
        "vacancies": c.vacancies,
        "sources": c.sources,
        "lessons": c.lessons,
        "glossary": c.glossary,
        "glossaryCategories": c.raw["glossary"].get("categories", []),
        "library": c.library,
        "questions": c.questions,
        "questionsByTopic": questions_by_topic,
        "termsByTopic": terms_by_topic,
        "mockQuestions": c.mock_questions,
        "mockCategories": c.raw["mock_questions"].get("categories", []),
        "mockSessionFlow": c.raw["mock_questions"].get("session_flow", []),
        "cases": c.cases,
        "roadmap": c.roadmap,
        "stories": c.stories,
        "storyFramework": c.raw["stories"].get("framework", {}),
        "achievements": c.achievements,
        "englishPhrases": c.english_phrases,
        "englishPhraseCategories": c.raw["english_phrases"].get("categories", []),
        "englishVocab": c.english_vocab,
        "englishVocabCategories": c.raw["english_vocab"].get("categories", []),
        "englishDrills": c.english_drills,
        "englishDrillCategories": c.raw["english_drills"].get("categories", []),
        "englishWriting": c.english_writing,
        "englishWritingCategories": c.raw["english_writing"].get("categories", []),
        "englishResources": c.english_resources,
        "englishResourceCategories": c.raw["english_resources"].get("categories", []),
        "counts": c.counts(),
    }


def build_core(sections: dict, track_ids: list[str]) -> dict:
    payload = {"schema": 2}
    for key in CORE_SECTIONS:
        payload[key] = sections[key]
    # Карта «трек → файл». Загрузчик берёт путь только отсюда и никогда не
    # склеивает его из идентификатора: trackId приходит из localStorage, то есть
    # из-под контроля пользователя, и в src его подставлять нельзя.
    payload["trackFiles"] = {
        tid: f"generated/{track_file_name(tid)}" for tid in track_ids
    }
    # Трековые разделы объявлены пустыми: страница, открытая без трекового
    # файла, покажет пустые списки, а не упадёт на первом же обращении.
    for key in TRACK_SECTIONS:
        payload[key] = []
    payload["questionsByTopic"] = {}
    payload["termsByTopic"] = {}
    payload["trackLoaded"] = None
    return payload


def build_track(sections: dict, track_id: str) -> dict:
    payload: dict = {}
    for key, field in TRACK_SECTIONS.items():
        payload[key] = [r for r in sections[key] if belongs(r, track_id, field)]

    # Индексы пересчитываем по урезанным наборам: иначе «тест по теме» ссылался
    # бы на вопросы чужого трека, которых в памяти нет.
    kept_q = {q["id"] for q in payload["questions"]}
    kept_t = {t["id"] for t in payload["glossary"]}
    payload["questionsByTopic"] = {
        topic: [i for i in ids if i in kept_q]
        for topic, ids in sections["questionsByTopic"].items()
        if any(i in kept_q for i in ids)
    }
    payload["termsByTopic"] = {
        topic: [i for i in ids if i in kept_t]
        for topic, ids in sections["termsByTopic"].items()
        if any(i in kept_t for i in ids)
    }
    return payload


def render_core(payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, sort_keys=True,
                      indent=1, separators=(",", ":"))
    return (
        HEADER
        + "(function (global) {\n"
        + '  "use strict";\n'
        + "  var CONTENT =\n"
        + body
        + ";\n"
        + "  global.CONTENT = CONTENT;\n"
        + '  if (typeof module !== "undefined" && module.exports) module.exports = CONTENT;\n'
        + "})(typeof window !== \"undefined\" ? window : globalThis);\n"
    )


def render_track(track_id: str, payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, sort_keys=True,
                      indent=1, separators=(",", ":"))
    return (
        HEADER
        + "(function (global) {\n"
        + '  "use strict";\n'
        + "  var DATA =\n"
        + body
        + ";\n"
        + "  var C = global.CONTENT || (global.CONTENT = {});\n"
        + "  Object.keys(DATA).forEach(function (k) { C[k] = DATA[k]; });\n"
        + "  C.trackLoaded = " + json.dumps(track_id, ensure_ascii=False) + ";\n"
        + '  if (typeof module !== "undefined" && module.exports) module.exports = DATA;\n'
        + "})(typeof window !== \"undefined\" ? window : globalThis);\n"
    )


def render_all() -> dict[Path, str]:
    """Путь → содержимое. Единственное место, где решается состав вывода."""
    c = load_all()
    sections = build_sections(c)

    track_ids = []
    for t in c.tracks:
        tid = t["id"]
        if not SAFE_ID.match(tid):
            raise SystemExit(
                f"ОШИБКА: идентификатор трека {tid!r} не годится для имени файла — "
                f"допустимы строчные латинские буквы, цифры и дефис"
            )
        track_ids.append(tid)

    out = {CORE_FILE: render_core(build_core(sections, track_ids))}
    for tid in track_ids:
        out[OUT_DIR / track_file_name(tid)] = render_track(tid, build_track(sections, tid))
    return out


def existing_generated() -> set[Path]:
    if not OUT_DIR.exists():
        return set()
    return {p for p in OUT_DIR.iterdir() if p.suffix == ".js"}


def main() -> int:
    ap = argparse.ArgumentParser(description="Сборка данных Mini App")
    ap.add_argument("--check", action="store_true",
                    help="не писать файлы, а проверить, что они актуальны")
    args = ap.parse_args()

    files = render_all()
    stale = existing_generated() - set(files)

    if args.check:
        bad = False
        for path, text in sorted(files.items()):
            rel = path.relative_to(BASE_DIR)
            if not path.exists():
                print(f"ОШИБКА: нет {rel} — запустите без --check")
                bad = True
            elif path.read_text(encoding="utf-8") != text:
                print(f"ОШИБКА: {rel} устарел относительно data/ — "
                      f"пересоберите: python tools/build_webapp_data.py")
                bad = True
        for path in sorted(stale):
            # Забытый файл удалённого трека продолжал бы отдаваться с сервера и
            # кэшироваться у пользователей.
            print(f"ОШИБКА: {path.relative_to(BASE_DIR)} лишний — трека с таким "
                  f"идентификатором больше нет, удалите файл")
            bad = True
        if bad:
            return 1
        print(f"OK: сгенерированные данные актуальны (файлов {len(files)})")
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for path, text in sorted(files.items()):
        # Пишем атомарно: частично записанный файл сломал бы Mini App при
        # одновременном чтении веб-сервером во время деплоя.
        tmp = path.with_suffix(".js.tmp")
        tmp.write_text(text, encoding="utf-8", newline="\n")
        tmp.replace(path)
    for path in sorted(stale):
        path.unlink()
        print(f"удалён устаревший {path.relative_to(BASE_DIR)}")

    total = sum(p.stat().st_size for p in files) / 1024
    core_kb = CORE_FILE.stat().st_size / 1024
    print(f"OK: собрано файлов {len(files)}, всего {total:.0f} КБ "
          f"(общая часть {core_kb:.0f} КБ)")
    for path in sorted(files):
        if path != CORE_FILE:
            print(f"     {path.name}  {path.stat().st_size / 1024:.0f} КБ")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
