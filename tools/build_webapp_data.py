#!/usr/bin/env python3
"""
Генератор данных Mini App из источника правды data/*.json.

Зачем отдельный шаг: Mini App — статика без сборщика, ему нужен один JS-файл с
готовым объектом, а не десяток JSON-запросов на старте. Источником правды при
этом остаются читаемые JSON, а не сгенерированный файл.

CI проверяет, что webapp/generated/content_data.js не отстал от data/ —
см. .github/workflows/ci.yml. Поэтому файл детерминирован: сортировка ключей,
фиксированные разделители, никакой даты генерации внутри.

Запуск:
    python tools/build_webapp_data.py
    python tools/build_webapp_data.py --check   # только сверить, не писать
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import BASE_DIR, load_all  # noqa: E402

OUT_DIR = BASE_DIR / "webapp" / "generated"
OUT_FILE = OUT_DIR / "content_data.js"

HEADER = """// ===========================================================================
// СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ РЕДАКТИРОВАТЬ РУКАМИ.
// Источник правды: data/*.json. Пересобрать:  python tools/build_webapp_data.py
// CI падает, если этот файл отстал от data/.
// ===========================================================================
"""


def build_payload() -> dict:
    """Собрать объект для Mini App.

    Сюда попадает только то, что реально нужно клиенту. Например, у mock-вопросов
    нужен полный разбор (пользователь читает его после ответа), а у источников —
    все поля: библиотека показывает издателя и дату проверки.
    """
    c = load_all()

    # Индекс: тема → id вопросов. Клиенту нужен для режима «тест по теме» и для
    # расчёта готовности без перебора всего банка на каждый рендер.
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
        "schema": 1,
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
        "counts": c.counts(),
    }


def render(payload: dict) -> str:
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


def main() -> int:
    ap = argparse.ArgumentParser(description="Сборка данных Mini App")
    ap.add_argument("--check", action="store_true",
                    help="не писать файл, а проверить, что он актуален")
    args = ap.parse_args()

    text = render(build_payload())

    if args.check:
        if not OUT_FILE.exists():
            print(f"ОШИБКА: {OUT_FILE} не существует — запустите без --check")
            return 1
        current = OUT_FILE.read_text(encoding="utf-8")
        if current != text:
            print(f"ОШИБКА: {OUT_FILE.relative_to(BASE_DIR)} устарел относительно data/ — "
                  f"пересоберите: python tools/build_webapp_data.py")
            return 1
        print(f"OK: {OUT_FILE.relative_to(BASE_DIR)} актуален")
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # Пишем атомарно: частично записанный файл сломал бы Mini App при
    # одновременном чтении веб-сервером во время деплоя.
    tmp = OUT_FILE.with_suffix(".js.tmp")
    tmp.write_text(text, encoding="utf-8", newline="\n")
    tmp.replace(OUT_FILE)
    size_kb = OUT_FILE.stat().st_size / 1024
    print(f"OK: {OUT_FILE.relative_to(BASE_DIR)} собран ({size_kb:.0f} КБ)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
