#!/usr/bin/env python3
"""
Валидация учебного контента: схемы, уникальность id, целостность ссылок,
дубли, минимальные количества и отсутствие следов референсного проекта.

Запуск:
    python tools/validate_content.py            # проверить всё
    python tools/validate_content.py --quiet    # только итог

Код возврата 0 — всё в порядке, 1 — есть ошибки. Предупреждения не роняют
проверку, но печатаются: они означают «посмотреть глазами», а не «сломано».
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_lib import (  # noqa: E402
    load_all, normalize_text, writing_check, writing_norm,
)

# ── правила ────────────────────────────────────────────────────────────────

MIN_COUNTS = {
    "questions": 120,
    "glossary_terms": 100,
    "library_resources": 35,
    "mock_questions": 40,
    "cases": 12,
    "roadmap_steps": 24,
    "english_phrases": 40,
    "english_vocab": 50,
    "english_drills": 12,
    "english_writing": 25,
}

# Минимумы на КАЖДЫЙ активный трек. Глобальные MIN_COUNTS суммируют банк
# целиком: пятый трек с 15 вопросами прошёл бы валидацию за счёт четырёх
# старых — последний крупный представитель класса «проверка молчит о новом
# треке». Значения чуть ниже фактических минимумов существующих треков:
# ловим пустоту, а не мешаем реструктуризации.
MIN_COUNTS_PER_TRACK = {
    "questions": 100,
    "mock_questions": 25,
    "cases": 8,
    "roadmap_steps": 20,
    "lessons": 18,
}

# Сколько записей английского обязан видеть КАЖДЫЙ активный трек — сквозные
# плюс свои. Раздел общий, поэтому пробел появляется не в нём, а в трековой
# части: у нового трека может не оказаться ни одного своего слова.
ENGLISH_MIN_PER_TRACK = {
    "english_phrases": 40,
    "english_vocab": 45,
    "english_drills": 10,
    "english_writing": 25,
}
# Свои, не сквозные записи: без них трек получает только общий английский.
ENGLISH_MIN_TRACK_OWN = {"english_vocab": 6, "english_drills": 2}

# То же, но предупреждением: правило введено при переработке SEO-трека, у
# которого своих фраз не было вовсе — раздел выглядел наполненным за счёт
# сквозных. На остальных треках пробел тот же, и ронять им CI неправильно.
ENGLISH_WARN_TRACK_OWN = {"english_phrases": 2}

# Уровни владения темой (docs/REDCORE_CONTENT_SPEC.md §3). Поле необязательное:
# старый банк размечается постепенно, но размеченная тема обязана доходить до
# диагностики — ради неё уровни и вводились.
QUESTION_LEVELS = {"L1", "L2", "L3", "L4"}

# ── свежесть контента ──────────────────────────────────────────────────────
#
# Факты стареют неравномерно, поэтому волатильность объявляется на ТЕМЕ:
# устаревает предметная область, а не отдельная формулировка. Дата сверки живёт
# на записи. Аннотировать всё подряд запрещено: поле без реального смысла
# превращается в шум, поэтому требуется оно только там, где тема помечена
# как high.
VOLATILITY_LEVELS = {"low", "medium", "high"}
DEFAULT_VOLATILITY = "low"

# Через сколько дней сверка считается просроченной. Это предупреждение, а не
# ошибка: CI не должен краснеть от того, что прошло время.
REVIEW_MAX_AGE_DAYS = {"high": 90, "medium": 180}

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

TRACK_STATUSES = {"active", "coming_soon", "draft"}
REQUIREMENT_STATUSES = {"confirmed", "partial", "learning", "not_started", "not_applicable"}
IMPORTANCE = {"required", "desirable", "nice_to_have"}
# Компетенция помечается в данных, а не выводится кодом из списка тем: расчёт
# готовности к вакансии не должен знать наизусть, какая тема «про инструменты».
COMPETENCIES = {"tools", "english"}
VERIFICATION = {"verified", "needs_review"}

# Эталонный ответ мок-интервью не имеет права заявлять опыт кандидата.
# «Год занимаюсь SEO» в model_answer — это выдуманное достижение: человек
# заучит чужую биографию и развалится на первом уточняющем вопросе.
# Список намеренно узкий и буквальный: широкая эвристика ловила бы обороты
# вроде «я бы проверил», которые описывают подход, а не опыт.
FABRICATED_EXPERIENCE = [
    "год занимаюсь", "года занимаюсь", "лет занимаюсь",
    "год работаю", "года работаю", "лет работаю",
    "начал с собственного", "начала с собственного",
    "я вёл проект", "я вела проект", "на прошлой работе я",
    "посмотрел ваши", "посмотрела ваши",
    "у меня опыт", "мой опыт работы",
    "i have been working", "for about a year", "i worked with clients",
]

# Каркас личного ответа против готового эталона. Значения объявляются рядом с
# данными, в mock_questions.json → answer_kinds.
ANSWER_KINDS = {"generic", "personal"}

# Морская предметная область референсного проекта. Ни одно из этих слов не
# должно попасть в новый контент — иначе где-то остался копипаст.
MARITIME_MARKERS = [
    "issa", "żeglarz", "zeglarz", "sternik", "colreg", "iala", "vhf", "src ",
    "яхт", "парус", "швартов", "морск", "буй", "прилив", "девиац",
    "оверштаг", "фордевинд", "шкипер", "маяк", "штурвал",
    "мореход", "бофорт", "судно", "судов ", "счисление", "фарватер",
    "кильватер", "лоция", "такелаж",
]
# «навигационный» намеренно НЕ в списке: навигационный интент и навигационные
# ссылки — обычная веб-терминология, а не след морского проекта.

# Ключи хранилища из референсного проекта — их не должно быть в контенте.
FORBIDDEN_NAMESPACES = ["issa_", "marine_", "pl_progress_"]


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.checks = 0

    def err(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def check(self, ok: bool, msg: str) -> bool:
        self.checks += 1
        if not ok:
            self.err(msg)
        return ok


def require_fields(rep: Report, item: dict, fields: list[str], where: str) -> None:
    for f in fields:
        if f not in item:
            rep.err(f"{where}: нет обязательного поля '{f}'")
        elif item[f] is None or (isinstance(item[f], str) and not item[f].strip()):
            # None и пустая строка допустимы только там, где это осмысленно
            # (например, company у пустого трека) — такие поля в списки не входят.
            rep.err(f"{where}: поле '{f}' пустое")


def check_unique_ids(rep: Report, items: list, name: str) -> None:
    seen: dict[str, int] = {}
    for i, item in enumerate(items):
        _id = item.get("id")
        if not _id:
            rep.err(f"{name}[{i}]: нет id")
            continue
        if _id in seen:
            rep.err(f"{name}: дублирующийся id '{_id}' (позиции {seen[_id]} и {i})")
        seen[_id] = i


def check_refs(rep: Report, refs, valid: set, where: str, kind: str) -> None:
    if refs is None:
        return
    if not isinstance(refs, list):
        rep.err(f"{where}: {kind} должен быть списком")
        return
    for r in refs:
        if r not in valid:
            rep.err(f"{where}: битая ссылка {kind} → '{r}'")


# ── проверки по коллекциям ─────────────────────────────────────────────────

def validate_tracks(rep: Report, c) -> None:
    check_unique_ids(rep, c.tracks, "tracks")
    topic_ids = set(c.topics_by_id)
    for t in c.tracks:
        where = f"track '{t.get('id')}'"
        require_fields(rep, t, ["id", "title", "status", "language", "summary"], where)
        rep.check(t.get("status") in TRACK_STATUSES,
                  f"{where}: недопустимый status '{t.get('status')}'")
        check_refs(rep, t.get("critical_topic_ids"), topic_ids, where, "critical_topic_ids")
        if t.get("status") == "active":
            rep.check(bool(t.get("vacancy_id")), f"{where}: активный трек без vacancy_id")
            rep.check(bool(t.get("self_assessment_areas")),
                      f"{where}: активный трек без областей самооценки")
            rep.check(bool(t.get("critical_topic_ids")),
                      f"{where}: активный трек без критических тем")
        else:
            # Незаполненный трек не должен притворяться готовым.
            rep.check(not t.get("critical_topic_ids"),
                      f"{where}: неактивный трек не должен объявлять критические темы")


def validate_topics(rep: Report, c) -> None:
    check_unique_ids(rep, c.topics, "topics")
    track_ids = set(c.tracks_by_id)
    orders: dict[str, set] = {}
    for t in c.topics:
        where = f"topic '{t.get('id')}'"
        require_fields(rep, t, ["id", "track_id", "title", "short"], where)
        rep.check(t.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(isinstance(t.get("required"), bool), f"{where}: required должен быть bool")
        rep.check(isinstance(t.get("critical"), bool), f"{where}: critical должен быть bool")
        o = orders.setdefault(t.get("track_id"), set())
        if t.get("order") in o:
            rep.err(f"{where}: повторяющийся order {t.get('order')}")
        o.add(t.get("order"))
        if t.get("critical") and not t.get("required"):
            rep.err(f"{where}: критическая тема обязана быть required")


def validate_sources(rep: Report, c) -> None:
    check_unique_ids(rep, c.sources, "sources")
    for s in c.sources:
        where = f"source '{s.get('id')}'"
        require_fields(rep, s, ["id", "title", "publisher", "url", "type"], where)
        rep.check(str(s.get("url", "")).startswith("https://"),
                  f"{where}: url должен быть https")
        rep.check(isinstance(s.get("verified"), bool), f"{where}: verified должен быть bool")
        if s.get("verified"):
            rep.check(bool(s.get("verified_at")), f"{where}: verified=true без verified_at")


def validate_lessons(rep: Report, c) -> None:
    check_unique_ids(rep, c.lessons, "lessons")
    topic_ids, src_ids = set(c.topics_by_id), set(c.sources_by_id)
    q_ids, t_ids, track_ids = set(c.questions_by_id), set(c.terms_by_id), set(c.tracks_by_id)
    for x in c.lessons:
        where = f"lesson '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "track_id", "topic_id", "title", "summary", "why_it_matters",
            "example", "interview_question", "short_answer", "practice_task",
        ], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(x.get("topic_id") in topic_ids, f"{where}: неизвестный topic_id")
        rep.check(len(x.get("key_points") or []) >= 3, f"{where}: меньше 3 key_points")
        rep.check(len(x.get("common_mistakes") or []) >= 2,
                  f"{where}: меньше 2 common_mistakes")
        rep.check(isinstance(x.get("estimated_minutes"), int) and x["estimated_minutes"] > 0,
                  f"{where}: некорректный estimated_minutes")

        # Блоки «как проверить руками» и «чем» из сетки урока. Поля
        # необязательные: старые треки размечаются постепенно. Но пустая
        # проверка или инструмент без проверки — это половина блока, и такая
        # запись хуже отсутствующей: на экране появится заголовок без смысла.
        how = x.get("how_to_check")
        tools = x.get("tools")
        if how is not None:
            rep.check(isinstance(how, str) and len(how.strip()) >= 40,
                      f"{where}: how_to_check пуст или слишком короткий, "
                      f"чтобы описать проверку руками")
        if tools is not None:
            rep.check(isinstance(tools, list) and tools and
                      all(isinstance(t, str) and t.strip() for t in tools),
                      f"{where}: tools должен быть непустым списком названий")
        if (how is None) != (tools is None):
            rep.err(f"{where}: how_to_check и tools заполняются вместе — "
                    f"проверка без инструмента и инструмент без проверки "
                    f"одинаково бесполезны")

        check_refs(rep, x.get("source_refs"), src_ids, where, "source_refs")
        check_refs(rep, x.get("related_question_ids"), q_ids, where, "related_question_ids")
        check_refs(rep, x.get("related_term_ids"), t_ids, where, "related_term_ids")


def validate_glossary(rep: Report, c) -> None:
    check_unique_ids(rep, c.glossary, "glossary")
    categories = set(c.raw["glossary"].get("categories", []))
    src_ids, topic_ids, track_ids = set(c.sources_by_id), set(c.topics_by_id), set(c.tracks_by_id)
    seen_terms: dict[str, str] = {}
    for x in c.glossary:
        where = f"term '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "category", "term", "definition_simple", "definition_interview",
            "example", "common_confusion", "question", "answer",
        ], where)
        rep.check(x.get("category") in categories,
                  f"{where}: категория '{x.get('category')}' не объявлена в categories")
        rep.check(isinstance(x.get("difficulty"), int) and 1 <= x["difficulty"] <= 3,
                  f"{where}: difficulty должен быть 1..3")
        check_refs(rep, x.get("source_refs"), src_ids, where, "source_refs")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")
        check_refs(rep, x.get("track_ids"), track_ids, where, "track_ids")
        key = normalize_text(x.get("term", ""))
        if key in seen_terms:
            rep.err(f"{where}: термин дублирует '{seen_terms[key]}'")
        seen_terms[key] = x.get("id")


def validate_library(rep: Report, c) -> None:
    check_unique_ids(rep, c.library, "library")
    src_ids, topic_ids = set(c.sources_by_id), set(c.topics_by_id)
    seen_urls: dict[str, str] = {}
    for x in c.library:
        where = f"library '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "source_ref", "title", "publisher", "url", "type",
            "language", "why_read", "verification_status",
        ], where)
        rep.check(x.get("source_ref") in src_ids, f"{where}: неизвестный source_ref")
        rep.check(x.get("verification_status") in VERIFICATION,
                  f"{where}: недопустимый verification_status")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")
        rep.check(isinstance(x.get("read_before_interview"), bool),
                  f"{where}: read_before_interview должен быть bool")
        if x.get("verification_status") == "verified":
            rep.check(bool(x.get("last_verified")), f"{where}: verified без last_verified")
        # URL ресурса обязан совпадать с URL источника: иначе библиотека и
        # список источников разъедутся и audit_sources проверит не то.
        src = c.sources_by_id.get(x.get("source_ref"))
        if src and src.get("url") != x.get("url"):
            rep.err(f"{where}: url не совпадает с source '{x.get('source_ref')}'")
        u = x.get("url")
        if u in seen_urls:
            rep.warn(f"{where}: url дублирует ресурс '{seen_urls[u]}'")
        seen_urls[u] = x.get("id")


def _correct_is_notably_longer(x) -> bool:
    """Правильный вариант заметно длиннее остальных — то есть подсказывает.

    Заметным считается превосходство и на 8+ символов, и на 15%+ одновременно:
    иначе метрика срабатывала бы на паре «Organic Search» — «Paid Search».
    """
    opts, ans = x.get("options") or [], x.get("answer")
    if not (isinstance(ans, int) and 0 <= ans < len(opts) and len(opts) > 1):
        return False
    lens = [len(o) for o in opts]
    second = sorted(lens, reverse=True)[1]
    gap = lens[ans] - second
    return lens[ans] == max(lens) and gap >= 8 and gap / max(1, second) >= 0.15


def validate_questions(rep: Report, c) -> None:
    check_unique_ids(rep, c.questions, "questions")
    topic_ids, src_ids = set(c.topics_by_id), set(c.sources_by_id)
    t_ids, l_ids, track_ids = set(c.terms_by_id), set(c.lessons_by_id), set(c.tracks_by_id)
    seen: dict[str, str] = {}
    longest_correct = 0

    for x in c.questions:
        where = f"question '{x.get('id')}'"
        require_fields(rep, x, ["id", "track_id", "topic", "question", "explanation"], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(x.get("topic") in topic_ids, f"{where}: неизвестная тема '{x.get('topic')}'")

        opts = x.get("options") or []
        rep.check(len(opts) == 4, f"{where}: должно быть ровно 4 варианта, получено {len(opts)}")
        rep.check(all(isinstance(o, str) and o.strip() for o in opts),
                  f"{where}: пустой вариант ответа")
        if len(set(normalize_text(o) for o in opts)) != len(opts):
            rep.err(f"{where}: варианты ответа повторяются")

        ans = x.get("answer")
        rep.check(isinstance(ans, int) and 0 <= ans < len(opts),
                  f"{where}: answer вне диапазона вариантов")

        why = x.get("why") or []
        rep.check(len(why) == len(opts),
                  f"{where}: why должен содержать {len(opts)} элементов, получено {len(why)}")

        rep.check(isinstance(x.get("difficulty"), int) and 1 <= x["difficulty"] <= 3,
                  f"{where}: difficulty должен быть 1..3")
        rep.check(x.get("verification_status") in VERIFICATION,
                  f"{where}: недопустимый verification_status")
        if "level" in x:
            rep.check(x["level"] in QUESTION_LEVELS,
                      f"{where}: недопустимый level '{x.get('level')}' "
                      f"(допустимы {', '.join(sorted(QUESTION_LEVELS))})")
        check_refs(rep, x.get("source_refs"), src_ids, where, "source_refs")
        check_refs(rep, x.get("related_term_ids"), t_ids, where, "related_term_ids")
        check_refs(rep, x.get("related_lesson_ids"), l_ids, where, "related_lesson_ids")

        key = normalize_text(x.get("question", ""))
        if key in seen:
            rep.err(f"{where}: точный дубль вопроса '{seen[key]}'")
        seen[key] = x.get("id")

        if _correct_is_notably_longer(x):
            longest_correct += 1

    # Если правильный вариант систематически заметно длиннее остальных,
    # банк угадывается без знания предмета.
    if c.questions:
        share = longest_correct / len(c.questions)
        if share > 0.25:
            rep.err(f"правильный ответ заметно длиннее остальных в {share:.0%} вопросов "
                    f"(допустимо до 25%): банк угадывается по длине варианта")
        elif share > 0.15:
            rep.warn(f"правильный ответ заметно длиннее остальных в {share:.0%} вопросов")

    # Распределение индекса правильного ответа не должно вырождаться.
    dist = {i: 0 for i in range(4)}
    for x in c.questions:
        a = x.get("answer")
        if isinstance(a, int) and a in dist:
            dist[a] += 1
    if c.questions:
        for i, n in dist.items():
            share = n / len(c.questions)
            if share > 0.45:
                rep.err(f"индекс правильного ответа {i} встречается в {share:.0%} вопросов")
            elif share < 0.10:
                rep.warn(f"индекс правильного ответа {i} встречается лишь в {share:.0%} вопросов")

    # Тема, размеченная по уровням, обязана доходить до диагностики. Без L4
    # разметка превращается в украшение: банк остаётся «узнал — объяснил», а
    # спрашивают на собеседовании именно «вот данные, что проверишь первым».
    by_topic: dict[str, list] = {}
    for x in c.questions:
        by_topic.setdefault(x.get("topic"), []).append(x)
    for topic, pool in sorted(by_topic.items()):
        levelled = [x for x in pool if x.get("level")]
        if not levelled or len(levelled) != len(pool):
            continue                      # тема размечена частично — ещё в работе
        rep.check(any(x["level"] == "L4" for x in levelled),
                  f"тема '{topic}': все вопросы размечены по уровням, но нет ни "
                  f"одного уровня L4 — тема не доходит до диагностики")

    # ── те же метрики ПО КАЖДОМУ АКТИВНОМУ ТРЕКУ ──
    # Пользователь видит вопросы только своего трека, поэтому общая доля по
    # банку ничего не гарантирует: наполненный трек разбавляет перекос в новом.
    # Проверено на живых данных — в банке из двух треков доля «длинного
    # верного» была 13% суммарно и 31% внутри одного из треков.
    for t in c.active_tracks():
        pool = [q for q in c.questions if q.get("track_id") == t["id"]]
        if len(pool) < 20:          # на малой выборке доли шумят
            continue
        long_in_track = sum(1 for q in pool if _correct_is_notably_longer(q))
        share = long_in_track / len(pool)
        if share > 0.25:
            rep.err(f"track '{t['id']}': правильный ответ заметно длиннее остальных "
                    f"в {share:.0%} вопросов трека (допустимо до 25%)")
        tdist = {i: 0 for i in range(4)}
        for q in pool:
            a = q.get("answer")
            if isinstance(a, int) and a in tdist:
                tdist[a] += 1
        for i, n in tdist.items():
            s = n / len(pool)
            if s > 0.45:
                rep.err(f"track '{t['id']}': индекс правильного ответа {i} "
                        f"встречается в {s:.0%} вопросов трека")


def validate_mock(rep: Report, c) -> None:
    check_unique_ids(rep, c.mock_questions, "mock_questions")
    categories = set(c.raw["mock_questions"].get("categories", []))
    topic_ids, src_ids, track_ids = set(c.topics_by_id), set(c.sources_by_id), set(c.tracks_by_id)
    seen: dict[str, str] = {}
    for x in c.mock_questions:
        where = f"mock '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "track_id", "category", "question", "intent",
            "model_answer_short", "model_answer_full",
        ], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(x.get("category") in categories,
                  f"{where}: категория '{x.get('category')}' не объявлена")
        rep.check(len(x.get("expected_points") or []) >= 3, f"{where}: меньше 3 expected_points")
        rep.check(len(x.get("red_flags") or []) >= 2, f"{where}: меньше 2 red_flags")
        rubric = x.get("rubric") or {}
        rep.check(set(rubric.keys()) == {"0", "1", "2", "3", "4"},
                  f"{where}: rubric должен содержать уровни 0..4")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")
        check_refs(rep, x.get("source_refs"), src_ids, where, "source_refs")

        # Эталон против личного материала. Поле необязательное: разметка идёт
        # трек за треком. Но «personal» без подсказки о личном материале
        # означает пустой экран там, где человек должен вписать своё.
        kind = x.get("answer_kind")
        if kind is not None:
            rep.check(kind in ANSWER_KINDS,
                      f"{where}: недопустимый answer_kind '{kind}'")
            if kind == "personal":
                rep.check(bool((x.get("personal_evidence_prompt") or "").strip()),
                          f"{where}: answer_kind=personal без personal_evidence_prompt — "
                          f"каркас есть, а куда вписать своё, человеку не сказано")
            elif kind == "generic" and x.get("personal_evidence_prompt"):
                rep.err(f"{where}: personal_evidence_prompt у generic-ответа — "
                        f"либо ответ личный, либо подсказка лишняя")

        # Приложение не придумывает опыт пользователя. Проверяется по обоим
        # эталонам: короткий заучивают, развёрнутый читают.
        for field in ("model_answer_short", "model_answer_full"):
            blob = str(x.get(field) or "").lower()
            for marker in FABRICATED_EXPERIENCE:
                if marker in blob:
                    rep.err(f"{where}: в {field} заявлен опыт кандидата "
                            f"(«{marker}») — приложение не выдумывает достижения, "
                            f"личный материал живёт в personal_evidence_prompt")

        key = normalize_text(x.get("question", ""))
        if key in seen:
            rep.err(f"{where}: дубль вопроса '{seen[key]}'")
        seen[key] = x.get("id")

    # Уточняющие вопросы и три глубины ответа — необязательные блоки, но
    # заполненные наполовину они хуже отсутствующих: экран покажет заголовок
    # без содержания.
    for x in c.mock_questions:
        where = f"mock '{x.get('id')}'"
        for i, u in enumerate(x.get("follow_ups") or []):
            at = f"{where} follow_ups[{i}]"
            if not isinstance(u, dict):
                rep.err(f"{at}: уточняющий вопрос должен быть объектом")
                continue
            require_fields(rep, u, ["question", "expect"], at)
        depths = x.get("answer_depths")
        if depths is not None:
            rep.check(isinstance(depths, dict) and set(depths) == {"30", "60", "120"},
                      f"{where}: answer_depths должен содержать ровно 30, 60 и 120")
            if isinstance(depths, dict):
                for k, v in depths.items():
                    rep.check(isinstance(v, str) and v.strip(),
                              f"{where}: пустой ответ на {k} секунд")
                # Длиннее — значит подробнее. Если тридцатисекундный ответ не
                # короче двухминутного, глубины перепутаны местами.
                if set(depths) == {"30", "60", "120"}:
                    rep.check(len(depths["30"]) < len(depths["60"]) < len(depths["120"]),
                              f"{where}: глубины ответа не возрастают по объёму — "
                              f"похоже, перепутаны местами")
        if x.get("explain_to") is not None:
            rep.check(isinstance(x["explain_to"], str) and x["explain_to"].strip(),
                      f"{where}: explain_to пуст")

    # Режимы сессии: состав блоков — это контент, а не разметка экрана.
    modes = c.raw["mock_questions"].get("session_modes", [])
    mode_ids = set()
    for i, m in enumerate(modes):
        at = f"session_modes[{i}]"
        require_fields(rep, m, ["id", "title", "hint", "flow"], at)
        if m.get("id") in mode_ids:
            rep.err(f"{at}: дублирующийся id режима '{m.get('id')}'")
        mode_ids.add(m.get("id"))
        for cat in m.get("flow") or []:
            rep.check(cat in categories,
                      f"{at}: категория '{cat}' не объявлена в categories")
        if m.get("closing"):
            rep.check(m["closing"] in {q["id"] for q in c.mock_questions},
                      f"{at}: закрывающий вопрос '{m['closing']}' не найден")
    if modes:
        rep.check("full" in mode_ids,
                  "session_modes: нет режима 'full' — по нему считаются полные "
                  "сессии в готовности и достижениях")
        # Пустой блок режим просто пропускает, но знать о пробеле нужно.
        for t in c.active_tracks():
            have_cats = {q.get("category") for q in c.mock_questions
                         if q.get("track_id") == t["id"]}
            for m in modes:
                empty = [cat for cat in m.get("flow") or [] if cat not in have_cats]
                if empty:
                    rep.warn(f"track '{t['id']}': режим '{m.get('id')}' пропустит "
                             f"блоки {empty} — вопросов этих категорий нет")

    # Полная сессия mock interview собирается по категориям из session_flow.
    flow = c.raw["mock_questions"].get("session_flow", [])
    have = {q.get("category") for q in c.mock_questions}
    for cat in flow:
        if cat == "candidate_questions":
            continue
        rep.check(cat in have, f"session_flow: нет ни одного вопроса категории '{cat}'")

    # Сессия собирается из вопросов ОДНОГО трека: приложение фильтрует mock по
    # track_id. Поэтому общая проверка выше ничего не гарантирует — пробел в
    # новом треке она не увидит, пока категорию закрывает какой-то другой трек.
    for t in c.active_tracks():
        have_in_track = {q.get("category") for q in c.mock_questions
                         if q.get("track_id") == t["id"]}
        for cat in flow:
            if cat == "candidate_questions":
                continue
            rep.check(cat in have_in_track,
                      f"track '{t['id']}': нет ни одного mock-вопроса категории '{cat}' — "
                      f"полная сессия для этого трека будет неполной")


def validate_cases(rep: Report, c) -> None:
    check_unique_ids(rep, c.cases, "cases")
    topic_ids, track_ids = set(c.topics_by_id), set(c.tracks_by_id)
    for x in c.cases:
        where = f"case '{x.get('id')}'"
        require_fields(rep, x, ["id", "track_id", "title", "scenario", "solution"], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(len(x.get("questions") or []) >= 3, f"{where}: меньше 3 вопросов")
        rep.check(len(x.get("expected_process") or []) >= 3,
                  f"{where}: меньше 3 шагов expected_process")
        rep.check(len(x.get("must_mention") or []) >= 2, f"{where}: меньше 2 must_mention")
        rep.check(len(x.get("common_mistakes") or []) >= 2,
                  f"{where}: меньше 2 common_mistakes")
        rubric = x.get("rubric") or {}
        rep.check(set(rubric.keys()) == {"0", "1", "2", "3", "4"},
                  f"{where}: rubric должен содержать уровни 0..4")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")
        rep.check(isinstance(x.get("critical"), bool), f"{where}: critical должен быть bool")
    rep.check(any(x.get("critical") for x in c.cases),
              "cases: ни один кейс не отмечен как критический")


def validate_roadmap(rep: Report, c) -> None:
    check_unique_ids(rep, c.roadmap, "roadmap")
    step_ids = set(c.steps_by_id)
    topic_ids, lesson_ids = set(c.topics_by_id), set(c.lessons_by_id)
    case_ids, mock_ids, track_ids = set(c.cases_by_id), set(c.mock_by_id), set(c.tracks_by_id)
    # order уникален В ПРЕДЕЛАХ ТРЕКА, как и у тем. Глобальная проверка была
    # ошибкой: приложение показывает «Шаг {order} из {число шагов трека}», и
    # сквозная нумерация во втором треке дала бы «Шаг 101 из 22».
    orders: dict[str, set] = {}

    for x in c.roadmap:
        where = f"step '{x.get('id')}'"
        require_fields(rep, x, ["id", "track_id", "title", "goal"], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(isinstance(x.get("order"), int), f"{where}: order должен быть числом")
        seen_orders = orders.setdefault(x.get("track_id"), set())
        if x.get("order") in seen_orders:
            rep.err(f"{where}: повторяющийся order {x.get('order')} внутри трека")
        seen_orders.add(x.get("order"))
        rep.check(isinstance(x.get("required"), bool), f"{where}: required должен быть bool")
        rep.check(isinstance(x.get("estimated_minutes"), int) and x["estimated_minutes"] > 0,
                  f"{where}: некорректный estimated_minutes")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")
        check_refs(rep, x.get("prerequisites"), step_ids, where, "prerequisites")
        check_refs(rep, x.get("study_items"), lesson_ids, where, "study_items")
        rep.check(bool(x.get("completion_rule")), f"{where}: нет completion_rule")

        for item in x.get("practice_items") or []:
            if ":" not in item:
                rep.err(f"{where}: practice_item '{item}' без префикса вида quiz:/case:/mock:")
                continue
            kind, ref = item.split(":", 1)
            if kind == "quiz":
                if ref not in topic_ids:
                    rep.err(f"{where}: quiz по неизвестной теме '{ref}'")
                elif not any(q.get("topic") == ref for q in c.questions):
                    rep.err(f"{where}: quiz по теме '{ref}', в которой нет вопросов")
            elif kind == "case":
                if ref not in case_ids:
                    rep.err(f"{where}: неизвестный кейс '{ref}'")
            elif kind == "mock":
                if ref not in mock_ids:
                    rep.err(f"{where}: неизвестный mock-вопрос '{ref}'")
            else:
                rep.err(f"{where}: неизвестный тип practice_item '{kind}'")

    # Циклы в prerequisites сделали бы план невыполнимым.
    graph = {s["id"]: list(s.get("prerequisites") or []) for s in c.roadmap}
    state: dict[str, int] = {}

    def visit(node: str, path: list[str]) -> None:
        if state.get(node) == 2:
            return
        if state.get(node) == 1:
            rep.err(f"roadmap: цикл в prerequisites: {' → '.join(path + [node])}")
            return
        state[node] = 1
        for dep in graph.get(node, []):
            visit(dep, path + [node])
        state[node] = 2

    for sid in graph:
        visit(sid, [])

    # Шаг не может зависеть от более позднего шага — иначе план не пройти по порядку.
    order_of = {s["id"]: s.get("order", 0) for s in c.roadmap}
    for s in c.roadmap:
        for dep in s.get("prerequisites") or []:
            if dep in order_of and order_of[dep] >= s.get("order", 0):
                rep.err(f"step '{s['id']}' (order {s.get('order')}) зависит от "
                        f"'{dep}' (order {order_of[dep]}) — предпосылка идёт не раньше")


def validate_projects(rep: Report, c) -> None:
    """Практические проекты.

    У проекта намеренно НЕТ собственного состояния: сделанным он считается
    тогда, когда человек описал доказательство у связанного требования
    вакансии. Вторая отметка «выполнено» рядом с доказательством была бы
    вторым источником правды об одном и том же факте — и они бы разъехались.
    """
    check_unique_ids(rep, c.projects, "projects")
    topic_ids, track_ids = set(c.topics_by_id), set(c.tracks_by_id)
    orders: dict[str, set] = {}
    for x in c.projects:
        where = f"project '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "track_id", "title", "goal", "why_it_matters",
            "deliverable", "evidence_hint", "requirement_id",
        ], where)
        rep.check(x.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        rep.check(isinstance(x.get("order"), int), f"{where}: order должен быть числом")
        seen = orders.setdefault(x.get("track_id"), set())
        if x.get("order") in seen:
            rep.err(f"{where}: повторяющийся order {x.get('order')} внутри трека")
        seen.add(x.get("order"))
        rep.check(isinstance(x.get("required"), bool), f"{where}: required должен быть bool")
        rep.check(isinstance(x.get("estimated_minutes"), int) and x["estimated_minutes"] > 0,
                  f"{where}: некорректный estimated_minutes")
        rep.check(len(x.get("steps") or []) >= 3, f"{where}: меньше 3 шагов")
        rep.check(len(x.get("checklist") or []) >= 3, f"{where}: меньше 3 пунктов чек-листа")
        check_refs(rep, x.get("topic_ids"), topic_ids, where, "topic_ids")

        # Требование вакансии, которым подтверждается проект, обязано
        # существовать: иначе проект нечем закрыть, а ограничитель готовности
        # останется включённым навсегда.
        track = c.tracks_by_id.get(x.get("track_id")) or {}
        vac = next((v for v in c.vacancies if v.get("id") == track.get("vacancy_id")), None)
        if vac is None:
            rep.err(f"{where}: у трека нет вакансии, подтвердить проект нечем")
            continue
        req_ids = {r.get("id") for r in vac.get("requirements") or []}
        rep.check(x.get("requirement_id") in req_ids,
                  f"{where}: requirement_id '{x.get('requirement_id')}' не найден "
                  f"в вакансии '{vac.get('id')}'")


def validate_vacancies(rep: Report, c) -> None:
    check_unique_ids(rep, c.vacancies, "vacancies")
    topic_ids, track_ids = set(c.topics_by_id), set(c.tracks_by_id)
    for v in c.vacancies:
        where = f"vacancy '{v.get('id')}'"
        require_fields(rep, v, ["id", "track_id", "title", "company", "level", "summary"], where)
        rep.check(v.get("track_id") in track_ids, f"{where}: неизвестный track_id")
        check_refs(rep, v.get("interview_topics"), topic_ids, where, "interview_topics")
        rep.check(len(v.get("requirements") or []) >= 5, f"{where}: меньше 5 требований")
        req_ids = set()
        for r in v.get("requirements") or []:
            rw = f"{where} / requirement '{r.get('id')}'"
            require_fields(rep, r, ["id", "requirement", "importance", "status"], rw)
            if r.get("id") in req_ids:
                rep.err(f"{rw}: дублирующийся id требования")
            req_ids.add(r.get("id"))
            rep.check(r.get("importance") in IMPORTANCE, f"{rw}: недопустимый importance")
            rep.check(r.get("status") in REQUIREMENT_STATUSES, f"{rw}: недопустимый status")
            check_refs(rep, r.get("topic_ids"), topic_ids, rw, "topic_ids")
            # Доказательство из портфолио заполняет пользователь. Заранее
            # проставленный статус с пустым evidence — выдуманное достижение.
            if r.get("status") in {"confirmed", "partial"} and not (r.get("evidence") or "").strip():
                rep.err(f"{rw}: статус '{r['status']}' без evidence — "
                        f"приложение не должно выдумывать достижения пользователя")
            if r.get("competency") is not None:
                rep.check(r["competency"] in COMPETENCIES,
                          f"{rw}: недопустимая competency '{r['competency']}'")

        # Языковое требование живёт отдельным блоком: расчёт готовности к
        # вакансии обязан отличать обязательный язык от желательного, а
        # разбирать это из текста требования означало бы гадать по строке.
        for i, lang in enumerate(v.get("language_requirements") or []):
            lw = f"{where} / language_requirements[{i}]"
            require_fields(rep, lang, ["language", "importance", "requirement_id"], lw)
            rep.check(lang.get("importance") in IMPORTANCE,
                      f"{lw}: недопустимый importance")
            linked = lang.get("requirement_id")
            rep.check(linked in req_ids,
                      f"{lw}: requirement_id '{linked}' не найден среди требований")
            if lang.get("importance") == "required" and linked in req_ids:
                target = next(r for r in v["requirements"] if r["id"] == linked)
                rep.check(target.get("importance") == "required",
                          f"{lw}: язык объявлен обязательным, а требование "
                          f"'{linked}' помечено как '{target.get('importance')}' — "
                          f"вакансия противоречит сама себе")

    # У активного трека обязана быть вакансия.
    for t in c.active_tracks():
        rep.check(any(v.get("id") == t.get("vacancy_id") for v in c.vacancies),
                  f"track '{t['id']}': vacancy_id '{t.get('vacancy_id')}' не найден")


def validate_stories(rep: Report, c) -> None:
    check_unique_ids(rep, c.stories, "stories")
    mock_ids = set(c.mock_by_id)
    fields = {f["key"] for f in c.raw["stories"]["framework"]["fields"]}
    for x in c.stories:
        where = f"story '{x.get('id')}'"
        require_fields(rep, x, ["id", "track_id", "title", "prompt"], where)
        check_refs(rep, x.get("for_questions"), mock_ids, where, "for_questions")
        rep.check(len(x.get("checklist") or []) >= 3, f"{where}: меньше 3 пунктов checklist")
        for f in fields:
            if f not in x:
                rep.err(f"{where}: нет поля STAR '{f}'")
            elif str(x.get(f) or "").strip():
                rep.err(f"{where}: поле '{f}' предзаполнено — "
                        f"истории пользователя не выдумываются")


def validate_achievements(rep: Report, c) -> None:
    check_unique_ids(rep, c.achievements, "achievements")
    topic_ids = set(c.topics_by_id)
    for x in c.achievements:
        where = f"achievement '{x.get('id')}'"
        require_fields(rep, x, ["id", "title", "description", "icon", "tier"], where)
        rule = x.get("rule") or {}
        rep.check(bool(rule.get("type")), f"{where}: нет rule.type")
        if rule.get("topic_id"):
            rep.check(rule["topic_id"] in topic_ids, f"{where}: неизвестный topic_id в rule")


# ── английский для IT ──────────────────────────────────────────────────────

# Кириллица в поле, которое обязано быть английским, — почти всегда следствие
# копипаста из соседней строки. Глазами это не ловится: строки похожи.
CYRILLIC = set("абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ")


def _check_english_text(rep: Report, value, where: str, field: str) -> None:
    if not isinstance(value, str) or not value.strip():
        rep.err(f"{where}: поле '{field}' пустое")
        return
    if CYRILLIC & set(value):
        rep.err(f"{where}: в поле '{field}' есть кириллица — это поле на английском")


def _check_english_common(rep: Report, x: dict, where: str, categories: set,
                          track_ids: set) -> None:
    rep.check(x.get("category") in categories,
              f"{where}: категория '{x.get('category')}' не объявлена в categories")
    rep.check(isinstance(x.get("level"), int) and 1 <= x["level"] <= 3,
              f"{where}: level должен быть 1..3")
    tids = x.get("track_ids")
    if not isinstance(tids, list):
        rep.err(f"{where}: track_ids должен быть списком (пустой = во всех треках)")
    else:
        check_refs(rep, tids, track_ids, where, "track_ids")


def _check_writing_task(rep: Report, x: dict, where: str) -> None:
    """Задание к заготовке письма: чек-лист жанра плюс эталон.

    Главная проверка здесь последняя: эталонный ответ обязан сам пройти
    собственный чек-лист. Правило, под которое не подходит даже образец, —
    сломанное задание, и глазами в тридцати конструкциях это не видно.
    """
    task = x.get("task")
    if x.get("kind") == "template":
        if not isinstance(task, dict):
            rep.err(f"{where}: у заготовки (kind=template) должен быть блок task "
                    f"— иначе на экране письма нечего практиковать")
            return
    elif task is None:
        return
    elif not isinstance(task, dict):
        rep.err(f"{where}: task должен быть объектом")
        return

    require_fields(rep, task, ["brief_ru", "min_words", "must", "model_en"],
                   f"{where} task")

    brief = task.get("brief_ru")
    if not isinstance(brief, str) or not brief.strip():
        rep.err(f"{where}: task.brief_ru пустой")
    elif not (CYRILLIC & set(brief)):
        # Условие задания — на русском: это постановка, а не материал для чтения.
        rep.err(f"{where}: task.brief_ru должен быть на русском")

    mw = task.get("min_words")
    rep.check(isinstance(mw, int) and 20 <= mw <= 200,
              f"{where}: task.min_words должен быть 20..200")

    for field in ("must", "avoid"):
        rules = task.get(field)
        if rules is None and field == "avoid":
            continue
        if not isinstance(rules, list):
            rep.err(f"{where}: task.{field} должен быть списком")
            continue
        if field == "must":
            rep.check(2 <= len(rules) <= 8,
                      f"{where}: task.must должен содержать 2..8 правил")
        for i, r in enumerate(rules):
            at = f"{where} task.{field}[{i}]"
            if not isinstance(r, dict):
                rep.err(f"{at}: правило должно быть объектом")
                continue
            require_fields(rep, r, ["label", "any", "why"], at)
            for key in ("label", "why"):
                v = r.get(key)
                if not isinstance(v, str) or not v.strip():
                    rep.err(f"{at}: поле '{key}' пустое")
                elif not (CYRILLIC & set(v)):
                    rep.err(f"{at}: поле '{key}' должно быть на русском")
            variants = r.get("any")
            if not isinstance(variants, list) or not variants:
                rep.err(f"{at}: 'any' должен быть непустым списком вариантов")
                continue
            for v in variants:
                if not isinstance(v, str) or not v.strip():
                    rep.err(f"{at}: пустой вариант в 'any'")
                    continue
                if CYRILLIC & set(v):
                    rep.err(f"{at}: вариант '{v}' содержит кириллицу — "
                            f"проверка идёт по английскому тексту")
                if v != v.lower():
                    rep.err(f"{at}: вариант '{v}' должен быть в нижнем регистре — "
                            f"сравнение регистронезависимо, верхний регистр вводит в заблуждение")
                if not writing_norm(v).strip():
                    rep.err(f"{at}: вариант '{v}' после нормализации пуст — "
                            f"он совпадёт с чем угодно")

    model = task.get("model_en")
    if not isinstance(model, str) or not model.strip():
        rep.err(f"{where}: task.model_en пустой")
        return
    _check_english_text(rep, model, f"{where} task", "model_en")
    if "[" in model or "]" in model:
        rep.err(f"{where}: в task.model_en остались подстановки в скобках — "
                f"эталон должен быть готовым текстом, а не заготовкой")

    # Эталон обязан проходить собственный чек-лист.
    res = writing_check(model, task)
    if not res["passed"]:
        gaps = [m["label"] for m in res["must"] if not m["ok"]]
        hits = [a["label"] for a in res["avoid"] if not a["ok"]]
        detail = []
        if not res["enough"]:
            detail.append(f"слов {res['words']} при минимуме {res['minWords']}")
        if gaps:
            detail.append("не найдено обязательное: " + ", ".join(gaps))
        if hits:
            detail.append("встретилось запрещённое: " + ", ".join(hits))
        rep.err(f"{where}: task.model_en не проходит собственный чек-лист "
                f"({'; '.join(detail)})")


def validate_english(rep: Report, c) -> None:
    track_ids = set(c.tracks_by_id)

    # ── фразы ──
    check_unique_ids(rep, c.english_phrases, "english_phrases")
    cats = set(c.raw["english_phrases"].get("categories", []))
    seen: dict[str, str] = {}
    for x in c.english_phrases:
        where = f"phrase '{x.get('id')}'"
        require_fields(rep, x, ["id", "category", "en", "ru", "when"], where)
        _check_english_common(rep, x, where, cats, track_ids)
        _check_english_text(rep, x.get("en"), where, "en")
        for v in x.get("variants") or []:
            _check_english_text(rep, v, where, "variants[]")
        key = normalize_text(x.get("en", ""))
        if key in seen:
            rep.err(f"{where}: фраза дублирует '{seen[key]}'")
        seen[key] = x.get("id")

    # ── слова ──
    check_unique_ids(rep, c.english_vocab, "english_vocab")
    cats = set(c.raw["english_vocab"].get("categories", []))
    seen = {}
    for x in c.english_vocab:
        where = f"word '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "category", "term", "ipa", "ru_hint", "meaning", "wrong",
            "example_en", "example_ru",
        ], where)
        _check_english_common(rep, x, where, cats, track_ids)
        _check_english_text(rep, x.get("term"), where, "term")
        _check_english_text(rep, x.get("example_en"), where, "example_en")
        # Транскрипция без косых черт — почти наверняка не транскрипция.
        rep.check("/" in str(x.get("ipa", "")),
                  f"{where}: ipa должен быть транскрипцией в косых чертах")
        url = x.get("dict_url")
        if url:
            rep.check(str(url).startswith("https://dictionary.cambridge.org/"),
                      f"{where}: dict_url должен вести на dictionary.cambridge.org")
        key = normalize_text(x.get("term", ""))
        if key in seen:
            rep.err(f"{where}: слово дублирует '{seen[key]}'")
        seen[key] = x.get("id")

    # ── тренажёр ответов ──
    check_unique_ids(rep, c.english_drills, "english_drills")
    cats = set(c.raw["english_drills"].get("categories", []))
    seen = {}
    for x in c.english_drills:
        where = f"drill '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "category", "prompt_en", "prompt_ru", "hint",
            "model_answer_en", "model_answer_ru",
        ], where)
        _check_english_common(rep, x, where, cats, track_ids)
        _check_english_text(rep, x.get("prompt_en"), where, "prompt_en")
        _check_english_text(rep, x.get("model_answer_en"), where, "model_answer_en")
        rep.check(len(x.get("keywords") or []) >= 2, f"{where}: меньше 2 keywords")
        rubric = x.get("rubric") or {}
        rep.check(set(rubric.keys()) == {"0", "1", "2", "3", "4"},
                  f"{where}: rubric должен содержать уровни 0..4")
        rep.check(isinstance(x.get("seconds"), int) and 15 <= x["seconds"] <= 300,
                  f"{where}: seconds должен быть 15..300")
        key = normalize_text(x.get("prompt_en", ""))
        if key in seen:
            rep.err(f"{where}: задание дублирует '{seen[key]}'")
        seen[key] = x.get("id")

    # ── документация и переписка ──
    check_unique_ids(rep, c.english_writing, "english_writing")
    cats = set(c.raw["english_writing"].get("categories", []))
    seen = {}
    for x in c.english_writing:
        where = f"writing '{x.get('id')}'"
        require_fields(rep, x, ["id", "category", "kind", "title", "en", "ru"], where)
        _check_english_common(rep, x, where, cats, track_ids)
        rep.check(x.get("kind") in {"pattern", "template"},
                  f"{where}: kind должен быть pattern или template")
        _check_english_text(rep, x.get("en"), where, "en")
        key = normalize_text(x.get("title", ""))
        if key in seen:
            rep.err(f"{where}: заголовок дублирует '{seen[key]}'")
        seen[key] = x.get("id")
        _check_writing_task(rep, x, where)

    # ── внешние ресурсы практики ──
    # Правила те же, что у библиотеки: каждый ресурс обязан ссылаться на
    # источник с тем же URL — иначе аудит ссылок проверяет не то, что видит
    # пользователь. Поля why/how — на русском: это методика, а не материал.
    check_unique_ids(rep, c.english_resources, "english_resources")
    cats = set(c.raw["english_resources"].get("categories", []))
    for x in c.english_resources:
        where = f"eng resource '{x.get('id')}'"
        require_fields(rep, x, [
            "id", "category", "title", "publisher", "url", "source_ref",
            "why", "how",
        ], where)
        _check_english_common(rep, x, where, cats, track_ids)
        rep.check(x.get("source_ref") in c.sources_by_id,
                  f"{where}: неизвестный source_ref")
        src = c.sources_by_id.get(x.get("source_ref"))
        if src and src.get("url") != x.get("url"):
            rep.err(f"{where}: url не совпадает с source '{x.get('source_ref')}'")

    # ── что видит каждый активный трек ──
    # Раздел сквозной, поэтому общего количества мало: у нового трека может не
    # оказаться ни одной своей записи, и человек увидит английский без единого
    # слова своей профессии.
    for t in c.active_tracks():
        for key, minimum in ENGLISH_MIN_PER_TRACK.items():
            got = len(c.english_of(key, t["id"]))
            rep.check(got >= minimum,
                      f"track '{t['id']}': английский, раздел '{key}' — видно {got} "
                      f"записей, требуется минимум {minimum}")
        for key, minimum in ENGLISH_MIN_TRACK_OWN.items():
            own = [x for x in getattr(c, key) if t["id"] in (x.get("track_ids") or [])]
            rep.check(len(own) >= minimum,
                      f"track '{t['id']}': своих записей в '{key}' — {len(own)}, "
                      f"требуется минимум {minimum}: без них раздел одинаков для всех профессий")
        for key, minimum in ENGLISH_WARN_TRACK_OWN.items():
            own = [x for x in getattr(c, key) if t["id"] in (x.get("track_ids") or [])]
            if len(own) < minimum:
                rep.warn(f"track '{t['id']}': своих записей в '{key}' — {len(own)} "
                         f"при желаемых {minimum}: раздел наполнен только сквозными")


def validate_counts(rep: Report, c) -> None:
    counts = c.counts()
    for key, minimum in MIN_COUNTS.items():
        got = counts.get(key, 0)
        rep.check(got >= minimum,
                  f"количество '{key}' = {got}, требуется минимум {minimum}")

    # Минимумы КАЖДОГО активного трека: глобальная сумма прячет пустой трек
    # за объёмом остальных.
    per_track_sources = {
        "questions": c.questions,
        "mock_questions": c.mock_questions,
        "cases": c.cases,
        "roadmap_steps": c.roadmap,
        "lessons": c.lessons,
    }
    for t in c.active_tracks():
        for key, minimum in MIN_COUNTS_PER_TRACK.items():
            got = sum(1 for x in per_track_sources[key]
                      if x.get("track_id") == t["id"])
            rep.check(got >= minimum,
                      f"track '{t['id']}': '{key}' = {got}, "
                      f"требуется минимум {minimum} на активный трек")

    # Покрытие тем активного трека.
    for t in c.active_tracks():
        topics = c.topics_of(t["id"])
        with_lesson = {l["topic_id"] for l in c.lessons if l.get("track_id") == t["id"]}
        for topic in topics:
            if topic.get("required") and topic["id"] not in with_lesson:
                rep.err(f"track '{t['id']}': обязательная тема '{topic['id']}' без уроков")
        # Критическая тема обязана иметь и вопросы, и уроки.
        q_topics = {q["topic"] for q in c.questions if q.get("track_id") == t["id"]}
        # Кейсы критических тем: критическая тема ограничивает готовность
        # потолком, поэтому у человека должен быть способ её проработать не
        # только тестом. Без практики потолок становится тупиком.
        case_topics = set()
        for x in c.cases:
            if x.get("track_id") == t["id"]:
                case_topics.update(x.get("topic_ids") or [])
        for tid in t.get("critical_topic_ids") or []:
            if tid not in q_topics:
                rep.err(f"track '{t['id']}': критическая тема '{tid}' без вопросов теста")
            if tid not in case_topics:
                # Предупреждение, а не ошибка: правило введено при переработке
                # SEO-трека, и на остальных треках пробел ещё не закрыт. Ронять
                # им CI значило бы либо блокировать чужую работу, либо тихо
                # выключить проверку — оба варианта хуже видимого долга.
                rep.warn(f"track '{t['id']}': критическая тема '{tid}' без единого "
                         f"кейса — потолок готовности снять нечем")

        # Списки критических тем в двух местах обязаны совпадать: трек объявляет
        # их для расчёта, тема помечает себя сама. Разъехавшись, они дают
        # ограничитель по теме, которая себя критической не считает.
        declared = set(t.get("critical_topic_ids") or [])
        marked = {x["id"] for x in c.topics
                  if x.get("track_id") == t["id"] and x.get("critical")}
        if declared != marked:
            rep.err(f"track '{t['id']}': critical_topic_ids и темы с critical:true "
                    f"расходятся — только в треке {sorted(declared - marked)}, "
                    f"только в темах {sorted(marked - declared)}")


def _parse_review_date(rep: Report, value, where: str):
    """Разобрать content_reviewed_at. Возвращает date или None при ошибке."""
    if not DATE_RE.match(str(value)):
        rep.err(f"{where}: content_reviewed_at '{value}' не в формате ГГГГ-ММ-ДД")
        return None
    try:
        d = date.fromisoformat(str(value))
    except ValueError:
        rep.err(f"{where}: content_reviewed_at '{value}' не является датой")
        return None
    if d > date.today():
        rep.err(f"{where}: content_reviewed_at '{value}' в будущем — "
                f"сверка не могла состояться")
        return None
    return d


def validate_freshness(rep: Report, c) -> None:
    """Метки свежести: формат, обязательность и просрочка.

    Волатильность объявляется на теме, дата сверки — на записи. Запись,
    относящаяся к высоковолатильной теме, обязана нести дату: без неё нельзя
    ответить на вопрос «когда это последний раз сверяли с документацией», а
    именно в GA4 и Search Console формулировки устаревают быстрее всего.
    """
    volatility = {}
    for t in c.topics:
        v = t.get("volatility", DEFAULT_VOLATILITY)
        rep.check(v in VOLATILITY_LEVELS,
                  f"topic '{t.get('id')}': недопустимая volatility '{v}'")
        volatility[t["id"]] = v

    high = {tid for tid, v in volatility.items() if v == "high"}
    today = date.today()

    def worst_level(topic_ids):
        levels = [volatility.get(t, DEFAULT_VOLATILITY) for t in topic_ids]
        for lvl in ("high", "medium"):
            if lvl in levels:
                return lvl
        return DEFAULT_VOLATILITY

    # Коллекция → как достать темы записи.
    collections = [
        ("lesson", c.lessons, lambda x: [x.get("topic_id")]),
        ("question", c.questions, lambda x: [x.get("topic")]),
        ("term", c.glossary, lambda x: x.get("topic_ids") or []),
        ("mock", c.mock_questions, lambda x: x.get("topic_ids") or []),
        ("case", c.cases, lambda x: x.get("topic_ids") or []),
    ]

    stale = []
    for kind, items, topics_of in collections:
        for x in items:
            where = f"{kind} '{x.get('id')}'"
            tids = [t for t in topics_of(x) if t]
            value = x.get("content_reviewed_at")
            if value is None:
                if high & set(tids):
                    rep.err(f"{where}: тема высоковолатильна, но нет "
                            f"content_reviewed_at — непонятно, когда запись "
                            f"последний раз сверяли с документацией")
                continue
            d = _parse_review_date(rep, value, where)
            if d is None:
                continue
            limit = REVIEW_MAX_AGE_DAYS.get(worst_level(tids))
            if limit and (today - d).days > limit:
                stale.append((where, value, (today - d).days, limit))

    # Вакансия высоковолатильна по определению: объявление правят без нас.
    for v in c.vacancies:
        where = f"vacancy '{v.get('id')}'"
        level = v.get("volatility")
        if level is not None:
            rep.check(level in VOLATILITY_LEVELS,
                      f"{where}: недопустимая volatility '{level}'")
        value = v.get("content_reviewed_at")
        if value is None:
            if level == "high":
                rep.err(f"{where}: volatility=high без content_reviewed_at")
            continue
        d = _parse_review_date(rep, value, where)
        if d is not None:
            limit = REVIEW_MAX_AGE_DAYS.get(level or DEFAULT_VOLATILITY)
            if limit and (today - d).days > limit:
                stale.append((where, value, (today - d).days, limit))

    for where, value, age, limit in stale:
        rep.warn(f"{where}: сверено {value} — {age} дней назад при норме {limit}")


def validate_no_reference_leftovers(rep: Report, c) -> None:
    """Ни морской предметной области, ни ключей хранилища референса."""
    import json as _json
    for key, raw in c.raw.items():
        blob = _json.dumps(raw, ensure_ascii=False).lower()
        for marker in MARITIME_MARKERS:
            if marker in blob:
                rep.err(f"data/{key}: найден морской маркер '{marker.strip()}' — "
                        f"остался контент референсного проекта")
        for ns in FORBIDDEN_NAMESPACES:
            if ns in blob:
                rep.err(f"data/{key}: найден запрещённый namespace '{ns}'")


# ── запуск ─────────────────────────────────────────────────────────────────

def run() -> Report:
    rep = Report()
    c = load_all()
    validate_tracks(rep, c)
    validate_topics(rep, c)
    validate_sources(rep, c)
    validate_lessons(rep, c)
    validate_glossary(rep, c)
    validate_library(rep, c)
    validate_questions(rep, c)
    validate_mock(rep, c)
    validate_cases(rep, c)
    validate_roadmap(rep, c)
    validate_vacancies(rep, c)
    validate_projects(rep, c)
    validate_stories(rep, c)
    validate_achievements(rep, c)
    validate_english(rep, c)
    validate_counts(rep, c)
    validate_freshness(rep, c)
    validate_no_reference_leftovers(rep, c)
    return rep


def main() -> int:
    ap = argparse.ArgumentParser(description="Валидация учебного контента")
    ap.add_argument("--quiet", action="store_true", help="печатать только итог")
    args = ap.parse_args()

    rep = run()
    c = load_all()

    if not args.quiet:
        print("Содержимое:")
        for k, v in c.counts().items():
            print(f"  {k:22} {v}")
        print()

    for w in rep.warnings:
        print(f"ПРЕДУПРЕЖДЕНИЕ: {w}")
    for e in rep.errors:
        print(f"ОШИБКА: {e}")

    if rep.errors:
        print(f"\nПРОВАЛЕНО: ошибок {len(rep.errors)}, "
              f"предупреждений {len(rep.warnings)}, проверок {rep.checks}")
        return 1
    print(f"\nOK: проверок {rep.checks}, предупреждений {len(rep.warnings)}, ошибок нет")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
