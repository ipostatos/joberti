#!/usr/bin/env python3
"""
Отчёт о состоянии учебного контента: покрытие тем, распределение сложности,
использование источников, пробелы.

Отвечает на вопрос «где контент тонкий» до того, как это заметит пользователь,
получивший на слабой теме пустой тест.

Запуск:
    python tools/generate_content_report.py
    python tools/generate_content_report.py --out docs/CONTENT_REPORT.md
"""
from __future__ import annotations

import argparse
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import BASE_DIR, load_all  # noqa: E402


def bar(n: int, total: int, width: int = 24) -> str:
    if total <= 0:
        return " " * width
    filled = round(width * n / total)
    return "#" * filled + "." * (width - filled)


def build(track_id: str | None = None) -> str:
    c = load_all()
    out: list[str] = []
    w = out.append

    w("# Отчёт о контенте\n")
    w("Сгенерирован `tools/generate_content_report.py` из `data/`.\n")

    w("## Количества\n")
    w("| Коллекция | Количество |")
    w("|---|---:|")
    for k, v in c.counts().items():
        w(f"| {k} | {v} |")
    w("")

    tracks = [t for t in c.tracks if not track_id or t["id"] == track_id]

    for t in tracks:
        w(f"## Трек: {t['title']} (`{t['id']}`) — статус `{t['status']}`\n")
        if t["status"] != "active":
            w("_Трек не заполнен. Готовность по нему не рассчитывается._\n")
            continue

        topics = c.topics_of(t["id"])
        q_by_topic = Counter(q["topic"] for q in c.questions if q["track_id"] == t["id"])
        l_by_topic = Counter(x["topic_id"] for x in c.lessons if x["track_id"] == t["id"])
        term_by_topic: Counter = Counter()
        for term in c.glossary:
            for tid in term.get("topic_ids") or []:
                term_by_topic[tid] += 1
        lib_by_topic: Counter = Counter()
        for r in c.library:
            for tid in r.get("topic_ids") or []:
                lib_by_topic[tid] += 1
        mock_by_topic: Counter = Counter()
        for m in c.mock_questions:
            for tid in m.get("topic_ids") or []:
                mock_by_topic[tid] += 1
        case_by_topic: Counter = Counter()
        for cs in c.cases:
            for tid in cs.get("topic_ids") or []:
                case_by_topic[tid] += 1

        critical = set(t.get("critical_topic_ids") or [])
        max_q = max(q_by_topic.values()) if q_by_topic else 1

        w("### Покрытие тем\n")
        w("| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |")
        w("|---|:-:|:-:|---:|---:|---:|---:|---:|---:|")
        for tp in topics:
            w(f"| {tp['title']} `{tp['id']}` "
              f"| {'да' if tp['id'] in critical else ''} "
              f"| {'да' if tp.get('required') else ''} "
              f"| {q_by_topic.get(tp['id'], 0)} "
              f"| {l_by_topic.get(tp['id'], 0)} "
              f"| {term_by_topic.get(tp['id'], 0)} "
              f"| {lib_by_topic.get(tp['id'], 0)} "
              f"| {mock_by_topic.get(tp['id'], 0)} "
              f"| {case_by_topic.get(tp['id'], 0)} |")
        w("")

        w("### Распределение вопросов по темам\n")
        w("```")
        for tp in topics:
            n = q_by_topic.get(tp["id"], 0)
            w(f"{tp['id']:22} {bar(n, max_q)} {n:3}")
        w("```\n")

        # ── пробелы ──
        gaps: list[str] = []
        for tp in topics:
            tid = tp["id"]
            if tp.get("required") and l_by_topic.get(tid, 0) == 0:
                gaps.append(f"обязательная тема `{tid}` без уроков")
            if tid in critical and q_by_topic.get(tid, 0) < 8:
                gaps.append(f"критическая тема `{tid}`: всего "
                            f"{q_by_topic.get(tid, 0)} вопросов (желательно от 8)")
            if term_by_topic.get(tid, 0) == 0:
                gaps.append(f"тема `{tid}` без терминов словаря")
            if lib_by_topic.get(tid, 0) == 0:
                gaps.append(f"тема `{tid}` без материалов библиотеки")
        w("### Пробелы\n")
        if gaps:
            for g in gaps:
                w(f"- {g}")
        else:
            w("Пробелов не обнаружено.")
        w("")

    # ── английский ──
    # Раздел сквозной, поэтому важна не сумма, а то, что видит каждый трек:
    # общая часть плюс своя лексика.
    w("## Английский для IT\n")
    w("| Трек | Фразы | Слова | Задания | Письмо | Своих записей |")
    w("|---|---:|---:|---:|---:|---:|")
    keys = ("english_phrases", "english_vocab", "english_drills", "english_writing")
    for t in c.tracks:
        seen = [len(c.english_of(k, t["id"])) for k in keys]
        own = sum(1 for k in keys for x in getattr(c, k)
                  if t["id"] in (x.get("track_ids") or []))
        w(f"| {t['title']} `{t['id']}` | " + " | ".join(str(n) for n in seen) +
          f" | {own} |")
    w("")

    # ── сложность ──
    w("## Распределение по сложности\n")
    w("| Коллекция | 1 | 2 | 3 |")
    w("|---|---:|---:|---:|")
    for name, items in (("Вопросы", c.questions), ("Термины", c.glossary),
                        ("Mock", c.mock_questions), ("Кейсы", c.cases),
                        ("Материалы", c.library)):
        d = Counter(x.get("difficulty") for x in items)
        w(f"| {name} | {d.get(1, 0)} | {d.get(2, 0)} | {d.get(3, 0)} |")
    w("")

    # ── источники ──
    usage: Counter = Counter()
    for coll in (c.lessons, c.questions, c.glossary):
        for x in coll:
            for r in x.get("source_refs") or []:
                usage[r] += 1
    for r in c.library:
        usage[r["source_ref"]] += 1

    unused = [s["id"] for s in c.sources if s["id"] not in usage]
    unverified = [s["id"] for s in c.sources if not s.get("verified")]
    needs_review = [r["id"] for r in c.library
                    if r.get("verification_status") != "verified"]

    w("## Источники\n")
    w(f"- всего: {len(c.sources)}")
    w(f"- проверено (`verified: true`): {len(c.sources) - len(unverified)}")
    w(f"- требуют ручной проверки: {len(unverified)}")
    w(f"- не используются нигде: {len(unused)}")
    w(f"- материалов библиотеки со статусом needs_review: {len(needs_review)}")
    if unused:
        w("\nНеиспользуемые источники: " + ", ".join(f"`{x}`" for x in unused))
    if unverified:
        w("\nНепроверенные источники: " + ", ".join(f"`{x}`" for x in unverified))
    w("")

    w("### Топ-10 самых цитируемых источников\n")
    w("| Источник | Ссылок |")
    w("|---|---:|")
    for sid, n in usage.most_common(10):
        title = c.sources_by_id.get(sid, {}).get("title", "?")
        w(f"| `{sid}` — {title} | {n} |")
    w("")

    # ── содержание без источников ──
    q_nosrc = [q["id"] for q in c.questions if not q.get("source_refs")]
    t_nosrc = [x["id"] for x in c.glossary if not x.get("source_refs")]
    w("## Записи без источника\n")
    w(f"- вопросов без `source_refs`: {len(q_nosrc)}")
    w(f"- терминов без `source_refs`: {len(t_nosrc)}")
    w("\nЧасть записей без источника — норма: вопросы про поведение на "
      "собеседовании и коммуникацию не опираются на документацию.\n")

    # ── свежесть ──
    # Отвечает на вопрос «что пора перечитать», пока это не спросил пользователь,
    # увидевший в приложении интерфейс GA4 позапрошлого года.
    vol = {t["id"]: t.get("volatility", "low") for t in c.topics}
    high_topics = sorted(tid for tid, v in vol.items() if v == "high")
    med_topics = sorted(tid for tid, v in vol.items() if v == "medium")

    def topics_of(kind, x):
        if kind == "lesson":
            return [x.get("topic_id")]
        if kind == "question":
            return [x.get("topic")]
        return x.get("topic_ids") or []

    collections = [
        ("lesson", c.lessons), ("question", c.questions), ("term", c.glossary),
        ("mock", c.mock_questions), ("case", c.cases),
    ]
    dates: Counter = Counter()
    missing = 0
    tracked = 0
    for kind, items in collections:
        for x in items:
            tids = [t for t in topics_of(kind, x) if t]
            if not any(vol.get(t) == "high" for t in tids):
                continue
            tracked += 1
            d = x.get("content_reviewed_at")
            if d:
                dates[d] += 1
            else:
                missing += 1

    w("## Свежесть контента\n")
    w("Волатильность объявлена на теме, дата сверки — на записи. Записи "
      "высоковолатильных тем обязаны нести `content_reviewed_at`.\n")
    w(f"- высоковолатильные темы: {', '.join(f'`{t}`' for t in high_topics) or '—'}")
    w(f"- среднего уровня: {', '.join(f'`{t}`' for t in med_topics) or '—'}")
    w(f"- записей под наблюдением: {tracked}, без даты сверки: {missing}")
    if dates:
        w("\n| Дата сверки | Записей |")
        w("|---|---:|")
        for d, n in sorted(dates.items()):
            w(f"| {d} | {n} |")
    vac_dates = [(v["id"], v.get("content_reviewed_at"))
                 for v in c.vacancies if v.get("volatility") == "high"]
    if vac_dates:
        w("\nВакансии под наблюдением: " +
          ", ".join(f"`{i}` — {d or 'нет даты'}" for i, d in vac_dates))
    w("")

    # ── план ──
    steps = c.roadmap
    required = [s for s in steps if s.get("required")]
    total_min = sum(s.get("estimated_minutes", 0) for s in steps)
    req_min = sum(s.get("estimated_minutes", 0) for s in required)
    w("## План подготовки\n")
    w(f"- шагов всего: {len(steps)}, обязательных: {len(required)}")
    w(f"- суммарная оценка времени: {total_min} мин "
      f"(~{total_min / 60:.1f} ч), из них обязательных {req_min} мин "
      f"(~{req_min / 60:.1f} ч)")
    w("")

    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="Отчёт о контенте")
    ap.add_argument("--out", help="записать в файл (по умолчанию печать в stdout)")
    ap.add_argument("--track", help="ограничить одним треком")
    args = ap.parse_args()

    text = build(args.track)
    if args.out:
        path = Path(args.out)
        if not path.is_absolute():
            path = BASE_DIR / path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8", newline="\n")
        print(f"OK: отчёт записан в {path.relative_to(BASE_DIR)}")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
