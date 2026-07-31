#!/usr/bin/env python3
"""
Проверка ссылок на источники: доступны ли URL и не устарела ли дата проверки.

Сеть нужна только этому скрипту, поэтому он НЕ входит в обязательный набор CI:
внешние сайты падают и меняют структуру по своим причинам, и красный CI из-за
чужого таймаута обесценивает сигнал. Запускать вручную перед релизом контента.

Запуск:
    python tools/audit_sources.py               # проверить все источники
    python tools/audit_sources.py --offline     # без сети: только метаданные
    python tools/audit_sources.py --stale-days 180
"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import load_all  # noqa: E402

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
TIMEOUT = 20


def fetch_status(url: str) -> tuple[int, str]:
    """Вернуть (код, примечание). GET, а не HEAD: часть площадок отдаёт на HEAD
    404, хотя страница существует — проверено на support.google.com."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            final = resp.geturl()
            note = "" if final == url else f"редирект → {final}"
            return resp.status, note
    except urllib.error.HTTPError as e:
        return e.code, "HTTP-ошибка"
    except Exception as e:                       # сеть, DNS, TLS, таймаут
        return 0, f"недоступно: {type(e).__name__}"


def main() -> int:
    ap = argparse.ArgumentParser(description="Аудит источников")
    ap.add_argument("--offline", action="store_true", help="не ходить в сеть")
    ap.add_argument("--stale-days", type=int, default=365,
                    help="через сколько дней проверка считается устаревшей")
    args = ap.parse_args()

    c = load_all()
    today = dt.date.today()
    problems = 0
    stale = 0

    # ── офлайн-часть: метаданные ──
    used_by_lessons = {r for l in c.lessons for r in (l.get("source_refs") or [])}
    used_by_questions = {r for q in c.questions for r in (q.get("source_refs") or [])}
    used_by_terms = {r for t in c.glossary for r in (t.get("source_refs") or [])}
    used_by_library = {x.get("source_ref") for x in c.library}
    used_by_english = {x.get("source_ref") for x in c.english_resources}
    used = (used_by_lessons | used_by_questions | used_by_terms
            | used_by_library | used_by_english)

    for s in c.sources:
        if s["id"] not in used:
            print(f"ПРЕДУПРЕЖДЕНИЕ: источник '{s['id']}' не используется нигде")

    for s in c.sources:
        va = s.get("verified_at")
        if not va:
            continue
        try:
            d = dt.date.fromisoformat(va)
        except ValueError:
            print(f"ОШИБКА: источник '{s['id']}': некорректная дата verified_at '{va}'")
            problems += 1
            continue
        age = (today - d).days
        if age > args.stale_days:
            print(f"ПРЕДУПРЕЖДЕНИЕ: источник '{s['id']}' проверялся {age} дней назад")
            stale += 1

    if args.offline:
        print(f"\nОфлайн-режим: источников {len(c.sources)}, "
              f"устаревших проверок {stale}, ошибок метаданных {problems}")
        return 1 if problems else 0

    # ── онлайн-часть ──
    print(f"Проверяю {len(c.sources)} источников по сети…\n")
    ok = 0
    for s in c.sources:
        code, note = fetch_status(s["url"])
        if code == 200:
            ok += 1
            if note:
                print(f"  200  {s['id']:34} {note}")
        else:
            problems += 1
            print(f"  {code or '---'}  {s['id']:34} {s['url']}  {note}")

    print(f"\nИтог: доступно {ok}/{len(c.sources)}, проблем {problems}, "
          f"устаревших проверок {stale}")
    if problems:
        print("Проблемные ссылки: проверьте вручную и либо обновите URL, "
              "либо переведите ресурс в verification_status: needs_review")
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
