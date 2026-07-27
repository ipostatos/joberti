#!/usr/bin/env python3
"""
Поиск дублей и почти-дублей в банке вопросов.

Точные дубли ловит validate_content.py и роняет проверку. Этот скрипт ищет то,
что формально дублем не является, но означает ту же проверяемую мысль: близкие
формулировки, одинаковый набор вариантов, конфликтующие ответы на один вопрос.
Такие пары решает человек, поэтому по умолчанию скрипт только сообщает.

Запуск:
    python tools/deduplicate_questions.py
    python tools/deduplicate_questions.py --threshold 0.75
    python tools/deduplicate_questions.py --strict   # ненулевой код при находках
"""
from __future__ import annotations

import argparse
import sys
from itertools import combinations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import load_all, normalize_text  # noqa: E402

# Слова, которые есть почти в каждом вопросе и потому ничего не различают.
STOP = {
    "что", "как", "для", "чего", "это", "при", "если", "или", "и", "в", "на",
    "с", "по", "не", "из", "к", "у", "о", "от", "до", "за", "the", "a", "of",
    "вы", "вас", "ваш", "будет", "может", "нужно", "какой", "какая", "какие",
}


def tokens(text: str) -> set:
    return {w for w in normalize_text(text).split() if w not in STOP and len(w) > 2}


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def main() -> int:
    ap = argparse.ArgumentParser(description="Поиск дублей в банке вопросов")
    ap.add_argument("--threshold", type=float, default=0.70,
                    help="порог схожести формулировок (0..1)")
    ap.add_argument("--strict", action="store_true",
                    help="вернуть код 1, если найдены подозрительные пары")
    args = ap.parse_args()

    c = load_all()
    qs = c.questions
    print(f"Вопросов в банке: {len(qs)}\n")

    findings = 0

    # 1. Точные дубли текста вопроса.
    by_text: dict[str, list] = {}
    for q in qs:
        by_text.setdefault(normalize_text(q["question"]), []).append(q["id"])
    for text, ids in by_text.items():
        if len(ids) > 1:
            findings += 1
            print(f"ТОЧНЫЙ ДУБЛЬ: {', '.join(ids)}")
            print(f"    «{text[:90]}»")

    # 2. Одинаковый набор вариантов ответа. Сам по себе не ошибка (бывают
    #    вопросы-близнецы по разным аспектам), но если при этом различается
    #    правильный ответ — это прямое противоречие в банке.
    by_opts: dict[frozenset, list] = {}
    for q in qs:
        key = frozenset(normalize_text(o) for o in q.get("options", []))
        by_opts.setdefault(key, []).append(q)
    for key, group in by_opts.items():
        if len(group) < 2:
            continue
        correct = {normalize_text(g["options"][g["answer"]]) for g in group}
        ids = ", ".join(g["id"] for g in group)
        findings += 1
        if len(correct) > 1:
            print(f"КОНФЛИКТ: одинаковые варианты, РАЗНЫЕ правильные ответы: {ids}")
        else:
            print(f"ПОВТОР ВАРИАНТОВ: одинаковый набор ответов: {ids}")

    # 3. Близкие формулировки внутри одной темы. Между темами совпадения
    #    лексики нормальны, поэтому сравниваем только внутри темы.
    by_topic: dict[str, list] = {}
    for q in qs:
        by_topic.setdefault(q["topic"], []).append(q)

    for topic, group in sorted(by_topic.items()):
        toks = {q["id"]: tokens(q["question"]) for q in group}
        for a, b in combinations(group, 2):
            sim = jaccard(toks[a["id"]], toks[b["id"]])
            if sim >= args.threshold:
                findings += 1
                print(f"ПОХОЖИ ({sim:.0%}) в теме '{topic}': {a['id']} / {b['id']}")
                print(f"    A: {a['question']}")
                print(f"    B: {b['question']}")

    print()
    if findings:
        print(f"Найдено подозрительных мест: {findings}. "
              f"Решение принимает человек: объединить, переформулировать или оставить.")
        return 1 if args.strict else 0
    print("Дублей и конфликтов не найдено")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
