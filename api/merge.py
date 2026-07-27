"""
Слияние состояния пользователя между устройствами.

КОНТРАКТ: правила ниже обязаны давать тот же результат, что webapp/sync.js.
Дублирование намеренное — клиент должен уметь сливать состояние офлайн, — а
расхождение ловит тест паритета tests/test_sync.py на общих фикстурах.
При правке одного файла ОБЯЗАТЕЛЬНО править второй.

Общий принцип: merge(a, b), где a — состояние сервера, b — присланное клиентом.
Ни одна ветка не перезаписывает данные вслепую: везде максимум, объединение или
явное правило выбора.
"""
from __future__ import annotations

# ОБЯЗАНЫ совпадать с webapp/sync.js и webapp/progress.js.
MAX_HISTORY_DAYS = 365
MAX_ATTEMPTS = 100
MAX_BOX = 5

# Порядок статусов требования вакансии: при слиянии побеждает более продвинутый.
REQ_STATUS_RANK = ["not_started", "not_applicable", "learning", "partial", "confirmed"]

STORY_FIELDS = ("situation", "task", "action", "result", "reflection")


# ── вспомогательные ────────────────────────────────────────────────────────

def _d(x) -> dict:
    return x if isinstance(x, dict) else {}


def _num(o, k) -> int:
    try:
        n = int(_d(o).get(k))
    except (TypeError, ValueError):
        return 0
    return n


def _or(a, b, k) -> bool:
    return bool(_d(a).get(k)) or bool(_d(b).get(k))


def _pick(a, b, k):
    """Скаляр: побеждает значение из b, если оно задано; иначе из a."""
    vb = _d(b).get(k)
    if vb not in (None, "", []):
        return vb
    va = _d(a).get(k)
    return None if va is None else va


def _keys(a, b) -> list:
    return sorted(set(_d(a).keys()) | set(_d(b).keys()))


def _clamp(n, lo, hi):
    return lo if n < lo else hi if n > hi else n


# ── SRS ────────────────────────────────────────────────────────────────────

def _valid_srs(s) -> bool:
    return (
        isinstance(s, dict)
        and isinstance(s.get("box"), int)
        and not isinstance(s.get("box"), bool)
        and isinstance(s.get("due"), (int, float))
        and 0 <= s["box"] <= MAX_BOX
    )


def merge_srs(a, b) -> dict:
    """Побеждает более высокая коробка; при равной — более поздний срок повтора."""
    a, b = _d(a), _d(b)
    out = {}
    for qid in _keys(a, b):
        x = a.get(qid) if _valid_srs(a.get(qid)) else None
        y = b.get(qid) if _valid_srs(b.get(qid)) else None
        if x is None and y is None:
            continue
        if x is None:
            out[qid] = {"box": y["box"], "due": y["due"]}
        elif y is None:
            out[qid] = {"box": x["box"], "due": x["due"]}
        elif y["box"] > x["box"] or (y["box"] == x["box"] and y["due"] > x["due"]):
            out[qid] = {"box": y["box"], "due": y["due"]}
        else:
            out[qid] = {"box": x["box"], "due": x["due"]}
    return out


# ── прогресс ───────────────────────────────────────────────────────────────

def merge_progress(a, b) -> dict:
    a, b = _d(a), _d(b)
    days: dict = {}
    for src in (_d(a.get("days")), _d(b.get("days"))):
        for d, v in src.items():
            try:
                n = int(v)
            except (TypeError, ValueError):
                continue
            if n < 0:
                continue
            days[d] = max(days.get(d, 0), n)

    # Держим только последние MAX_HISTORY_DAYS дней — иначе состояние растёт вечно.
    ks = sorted(days.keys())
    while len(ks) > MAX_HISTORY_DAYS:
        del days[ks.pop(0)]

    streak = max(_num(a, "streak"), _num(b, "streak"))
    best = max(_num(a, "best"), _num(b, "best"), streak)
    goal = _num(b, "goal") or _num(a, "goal") or 15

    last_a = a.get("lastDay") or ""
    last_b = b.get("lastDay") or ""
    last = (last_a if last_a > last_b else last_b) or None

    out = {
        "goal": _clamp(goal, 5, 100),
        "days": days,
        "streak": streak,
        "best": best,
    }
    if last:
        out["lastDay"] = last
        # frozenUsed берём у источника с более свежим lastDay: иначе устройство,
        # не заходившее неделю, вернуло бы уже потраченную страховку серии.
        newer = b if last_b >= last_a else a
        out["frozenUsed"] = bool(_d(newer).get("frozenUsed"))

    flags = {}
    for src in (_d(a.get("flags")), _d(b.get("flags"))):
        for k, v in src.items():
            if v:
                flags[k] = True
    if flags:
        out["flags"] = flags
    return out


# ── элементы с самооценкой (mock, кейсы) ───────────────────────────────────

def _norm_rated(e) -> dict:
    e = _d(e)
    try:
        r = int(e.get("rating"))
    except (TypeError, ValueError):
        r = 0
    r = _clamp(r, 0, 4)
    try:
        c = int(e.get("count"))
    except (TypeError, ValueError):
        c = 1
    if c < 1:
        c = 1
    try:
        t = int(e.get("ts"))
    except (TypeError, ValueError):
        t = 0
    if t < 0:
        t = 0
    return {"rating": r, "count": c, "ts": t}


def merge_rated(a, b) -> dict:
    """Лучшая оценка и максимальное число заходов.

    Число заходов важно отдельно: расчёт готовности требует ПОДТВЕРЖДЕНИЯ —
    одна высокая самооценка без повтора даёт неполный балл (см. readiness.js).
    """
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = a.get(k), b.get(k)
        if x is None and y is None:
            continue
        if x is None:
            out[k] = _norm_rated(y)
        elif y is None:
            out[k] = _norm_rated(x)
        else:
            nx, ny = _norm_rated(x), _norm_rated(y)
            out[k] = {
                "rating": max(nx["rating"], ny["rating"]),
                "count": max(nx["count"], ny["count"]),
                "ts": max(nx["ts"], ny["ts"]),
            }
    return out


# ── план подготовки ────────────────────────────────────────────────────────

def merge_roadmap(a, b) -> dict:
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = _d(a.get(k)), _d(b.get(k))
        out[k] = {
            "lessonRead": _or(x, y, "lessonRead"),
            "quizBest": max(_num(x, "quizBest"), _num(y, "quizBest")),
            "casesDone": max(_num(x, "casesDone"), _num(y, "casesDone")),
            "mocksAnswered": max(_num(x, "mocksAnswered"), _num(y, "mocksAnswered")),
            "done": _or(x, y, "done"),
        }
    return out


# ── требования вакансии ────────────────────────────────────────────────────

def merge_requirements(a, b) -> dict:
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = _d(a.get(k)), _d(b.get(k))
        sx = x.get("status") or "not_started"
        sy = y.get("status") or "not_started"
        rx = REQ_STATUS_RANK.index(sx) if sx in REQ_STATUS_RANK else 0
        ry = REQ_STATUS_RANK.index(sy) if sy in REQ_STATUS_RANK else 0
        out[k] = {
            "status": (sy if ry >= rx else sx),
            "evidence": _pick(x, y, "evidence") or "",
            "gap": _pick(x, y, "gap") or "",
        }
    return out


# ── библиотека и истории STAR ──────────────────────────────────────────────

def merge_library(a, b) -> dict:
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = _d(a.get(k)), _d(b.get(k))
        out[k] = {"read": _or(x, y, "read"), "note": _pick(x, y, "note") or ""}
    return out


def merge_stories(a, b) -> dict:
    """Целиком побеждает более свежая версия истории.

    Смешивать поля из двух редакций нельзя: получился бы бессвязный рассказ,
    где ситуация из одной версии, а результат из другой.
    """
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = _d(a.get(k)), _d(b.get(k))
        w = y if _num(y, "updatedAt") >= _num(x, "updatedAt") else x
        rec = {f: (w.get(f) or "") for f in STORY_FIELDS}
        rec["updatedAt"] = max(_num(x, "updatedAt"), _num(y, "updatedAt"))
        out[k] = rec
    return out


# ── профиль ────────────────────────────────────────────────────────────────

def merge_profile(a, b) -> dict:
    a, b = _d(a), _d(b)

    sa = {}
    for k in _keys(a.get("selfAssessment"), b.get("selfAssessment")):
        vb = _d(b.get("selfAssessment")).get(k)
        va = _d(a.get("selfAssessment")).get(k)
        v = va if vb is None else vb
        try:
            n = int(v)
        except (TypeError, ValueError):
            continue
        if 0 <= n <= 5:
            sa[k] = n

    glossary = {}
    for k in _keys(a.get("glossary"), b.get("glossary")):
        x, y = _d(_d(a.get("glossary")).get(k)), _d(_d(b.get("glossary")).get(k))
        glossary[k] = {
            "favorite": _or(x, y, "favorite"),
            "checked": max(_num(x, "checked"), _num(y, "checked")),
        }

    out = {
        "trackId": _pick(a, b, "trackId"),
        "onboarded": _or(a, b, "onboarded"),
        "selfAssessment": sa,
        "requirements": merge_requirements(a.get("requirements"), b.get("requirements")),
        "roadmap": merge_roadmap(a.get("roadmap"), b.get("roadmap")),
        "glossary": glossary,
        "mock": merge_rated(a.get("mock"), b.get("mock")),
        "cases": merge_rated(a.get("cases"), b.get("cases")),
        "library": merge_library(a.get("library"), b.get("library")),
        "stories": merge_stories(a.get("stories"), b.get("stories")),
    }
    if out["trackId"] is None:
        del out["trackId"]
    return out


# ── дата собеседования ─────────────────────────────────────────────────────

def _norm_exam(e) -> dict:
    if not e:
        return {"value": None, "setAt": 0}
    if isinstance(e, str):
        return {"value": e, "setAt": 0}
    e = _d(e)
    try:
        t = int(e.get("setAt"))
    except (TypeError, ValueError):
        t = 0
    return {"value": e.get("value") or None, "setAt": max(0, t)}


def merge_exam_date(a, b) -> dict:
    """Побеждает более поздняя ПО ВРЕМЕНИ УСТАНОВКИ, а не более поздняя дата:
    собеседование можно перенести и вперёд, и назад."""
    x, y = _norm_exam(a), _norm_exam(b)
    if not x["value"] and not y["value"]:
        return {"value": None, "setAt": 0}
    if not x["value"]:
        return y
    if not y["value"]:
        return x
    return y if y["setAt"] >= x["setAt"] else x


# ── история попыток ────────────────────────────────────────────────────────

def merge_history(a, b) -> list:
    """Append-only: объединяем по id, сортируем по времени, режем до лимита."""
    seen = set()
    out = []
    for rec in list(a or []) + list(b or []):
        if not isinstance(rec, dict):
            continue
        rid = rec.get("id")
        if not rid or rid in seen:
            continue
        seen.add(rid)
        out.append(rec)
    # Стабильная сортировка: при равном времени — по id, чтобы порядок совпадал
    # с клиентским (иначе тест паритета ловил бы ложное расхождение).
    out.sort(key=lambda r: (-int(r.get("ts") or 0), str(r.get("id"))))
    return out[:MAX_ATTEMPTS]


# ── состояние целиком ──────────────────────────────────────────────────────

def merge_state(a, b) -> dict:
    a, b = _d(a), _d(b)
    return {
        "srs": merge_srs(a.get("srs"), b.get("srs")),
        "progress": merge_progress(a.get("progress"), b.get("progress")),
        "profile": merge_profile(a.get("profile"), b.get("profile")),
        "exam_date": merge_exam_date(a.get("exam_date"), b.get("exam_date")),
    }
