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

    goal = _num(b, "goal") or _num(a, "goal") or 15

    last_a = a.get("lastDay") or ""
    last_b = b.get("lastDay") or ""
    last = (last_a if last_a > last_b else last_b) or None

    # Серию берём у источника с более свежим lastDay (как frozenUsed): max
    # воскрешал бы мёртвую серию с заброшенного устройства — она показывалась
    # бы живой, потому что lastDay при этом берётся самый поздний. При равной
    # свежести серии считались через один и тот же день — берём максимум.
    if last_a == last_b:
        streak = max(_num(a, "streak"), _num(b, "streak"))
    else:
        streak = _num(b if last_b > last_a else a, "streak")
    best = max(_num(a, "best"), _num(b, "best"), streak)

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
    """Оценка — у более свежей записи, число заходов — максимум.

    Локально последняя самооценка перезаписывает предыдущую
    (recordMock/recordCase в app.js), и слияние обязано уважать то же правило:
    max воскрешал бы честно пониженную оценку со старого устройства, и
    готовность завышалась бы навсегда. При равном ts свежести нет — берём
    лучшую. Число заходов важно отдельно: расчёт готовности требует
    ПОДТВЕРЖДЕНИЯ — одна высокая самооценка без повтора даёт неполный балл
    (см. readiness.js).
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
            if nx["ts"] == ny["ts"]:
                winner = nx if nx["rating"] >= ny["rating"] else ny
            else:
                winner = nx if nx["ts"] > ny["ts"] else ny
            out[k] = {
                "rating": winner["rating"],
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


# ── прочитанные уроки и лучшие результаты тестов ───────────────────────────
# Эти разделы профиля долго отсутствовали в белом списке слияния, а клиент
# заменяет профиль целиком тем, что вернул сервер. После первого же обмена
# отметки «урок прочитан» и лучший процент по теме обнулялись, а шаги плана с
# правилами lesson_read и quiz_score_min откатывались в невыполненные.

def merge_lessons(a, b) -> dict:
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        x, y = _d(a.get(k)), _d(b.get(k))
        out[k] = {"read": _or(x, y, "read"), "ts": max(_num(x, "ts"), _num(y, "ts"))}
    return out


def merge_quiz_best(a, b) -> dict:
    a, b = _d(a), _d(b)
    out = {}
    for k in _keys(a, b):
        out[k] = _clamp(max(_num(a, k), _num(b, k)), 0, 100)
    return out


def merge_seen(a, b) -> dict:
    """Множество «тема была слабой» — только по ИЛИ."""
    a, b = _d(a), _d(b)
    return {k: True for k in _keys(a, b) if a.get(k) or b.get(k)}


# ── английский для IT ──────────────────────────────────────────────────────

def merge_english(a, b) -> dict:
    """Зеркало mergeEnglish из webapp/sync.js — паритет ловит tests/test_sync.py."""
    a, b = _d(a), _d(b)
    words = {}
    for k in _keys(a.get("words"), b.get("words")):
        x, y = _d(_d(a.get("words")).get(k)), _d(_d(b.get("words")).get(k))
        words[k] = {
            "favorite": _or(x, y, "favorite"),
            "checked": max(_num(x, "checked"), _num(y, "checked")),
        }
    phrases = {}
    for k in _keys(a.get("phrases"), b.get("phrases")):
        x, y = _d(_d(a.get("phrases")).get(k)), _d(_d(b.get("phrases")).get(k))
        phrases[k] = {
            "learned": _or(x, y, "learned"),
            "checked": max(_num(x, "checked"), _num(y, "checked")),
        }
    # Письменные задания: попытки — максимум, «прошло» — ИЛИ. Один раз
    # выполненное задание не разучивается обратно из-за устройства, на котором
    # его не открывали. Текст письма не хранится и не синхронизируется.
    writing = {}
    for k in _keys(a.get("writing"), b.get("writing")):
        x, y = _d(_d(a.get("writing")).get(k)), _d(_d(b.get("writing")).get(k))
        writing[k] = {
            "attempts": max(_num(x, "attempts"), _num(y, "attempts")),
            "passed": _or(x, y, "passed"),
            "ts": max(_num(x, "ts"), _num(y, "ts")),
        }
    return {
        "words": words,
        "drills": merge_rated(a.get("drills"), b.get("drills")),
        "phrases": phrases,
        "writing": writing,
    }


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
        "lessons": merge_lessons(a.get("lessons"), b.get("lessons")),
        "quizBest": merge_quiz_best(a.get("quizBest"), b.get("quizBest")),
        "weakTopicsSeen": merge_seen(a.get("weakTopicsSeen"), b.get("weakTopicsSeen")),
        "english": merge_english(a.get("english"), b.get("english")),
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
