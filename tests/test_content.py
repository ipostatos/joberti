#!/usr/bin/env python3
"""
Тесты учебного контента.

Основную работу делает tools/validate_content.py — здесь он запускается как
тест, плюс проверяются вещи, которые важны именно для приёмки MVP:
обязательные количества, покрытие критических тем и отсутствие следов
референсного проекта.

Запуск:  python tests/test_content.py
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "tools"))

from content_lib import load_all, normalize_text  # noqa: E402
import validate_content  # noqa: E402


class TestValidator(unittest.TestCase):
    """Полная валидация должна проходить без ошибок."""

    def test_validator_passes(self):
        rep = validate_content.run()
        if rep.errors:
            self.fail("валидатор нашёл ошибки:\n" + "\n".join(rep.errors[:20]))
        self.assertGreater(rep.checks, 500, "проверок подозрительно мало")


class TestCounts(unittest.TestCase):
    """Минимальные количества из требований к MVP."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    def test_minimum_counts(self):
        counts = self.c.counts()
        expected = {
            "questions": 120,
            "glossary_terms": 100,
            "library_resources": 35,
            "mock_questions": 40,
            "cases": 12,
            "roadmap_steps": 24,
        }
        for key, minimum in expected.items():
            with self.subTest(collection=key):
                self.assertGreaterEqual(
                    counts[key], minimum,
                    f"{key}: {counts[key]}, требуется минимум {minimum}",
                )

    def test_question_distribution(self):
        """Распределение вопросов по темам SEO-трека.

        Проверка привязана к треку, а не к банку целиком: с появлением второго
        трека сумма по SEO перестала совпадать с размером банка, и глобальная
        проверка начала измерять не то, что задумано.
        """
        expected = {
            "search-basics": 11, "search-intent": 11, "on-page": 18,
            "technical-seo": 26, "html-http": 13, "keyword-research": 13,
            "indexing-gsc": 12, "analytics-ga4": 9, "seo-tools": 9, "reporting": 6,
            "off-page-seo": 12, "site-architecture": 8, "seo-audit": 8,
            "internal-linking": 8, "sheets": 6, "interview-seo": 4,
            "content-briefs": 3, "dev-communication": 3,
        }
        actual = {}
        seo = [q for q in self.c.questions if q["track_id"] == "redcore-junior-seo"]
        for q in seo:
            actual[q["topic"]] = actual.get(q["topic"], 0) + 1
        for topic, n in expected.items():
            with self.subTest(topic=topic):
                self.assertEqual(actual.get(topic, 0), n,
                                 f"тема {topic}: {actual.get(topic, 0)} вопросов, ожидалось {n}")
        self.assertEqual(sum(expected.values()), len(seo),
                         "сумма распределения должна совпадать с числом вопросов трека")

    def test_active_track_is_complete(self):
        """У КАЖДОГО активного трека есть всё необходимое для расчёта готовности."""
        active = self.c.active_tracks()
        self.assertTrue(active, "должен быть хотя бы один наполненный трек")
        for t in active:
            with self.subTest(track=t["id"]):
                self.assertTrue(t["critical_topic_ids"],
                                "активный трек обязан объявлять критические темы")
                self.assertTrue(t["self_assessment_areas"],
                                "активный трек обязан иметь области самооценки")
                self.assertTrue(any(v["id"] == t["vacancy_id"] for v in self.c.vacancies),
                                "активный трек обязан ссылаться на существующую вакансию")

    def test_draft_tracks_are_empty(self):
        """Незаполненный трек не должен притворяться готовым."""
        for t in self.c.tracks:
            if t["status"] == "active":
                continue
            with self.subTest(track=t["id"]):
                self.assertFalse(t.get("critical_topic_ids"),
                                 "неактивный трек не должен объявлять критические темы")
                self.assertIsNone(t.get("vacancy_id"),
                                  "неактивный трек не должен ссылаться на вакансию")
                self.assertEqual(
                    [q for q in self.c.questions if q["track_id"] == t["id"]], [],
                    "у неактивного трека не должно быть вопросов",
                )


class TestEnglish(unittest.TestCase):
    """Английский для IT — сквозной раздел, видимый на каждом активном треке."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    KEYS = ("english_phrases", "english_vocab", "english_drills", "english_writing")

    def test_minimum_counts(self):
        counts = self.c.counts()
        for key, minimum in validate_content.MIN_COUNTS.items():
            if not key.startswith("english"):
                continue
            with self.subTest(collection=key):
                self.assertGreaterEqual(counts[key], minimum)

    def test_every_active_track_sees_english(self):
        """Раздел общий, но пробел появляется в трековой части.

        Общего количества мало: у нового трека может не оказаться ни одного
        своего слова, и человек увидит английский без единого термина своей
        профессии. Это тот же класс ошибки, что уже ловился на втором и третьем
        треках, поэтому проверка идёт по всем активным.
        """
        for t in self.c.active_tracks():
            for key in self.KEYS:
                with self.subTest(track=t["id"], collection=key):
                    visible = self.c.english_of(key, t["id"])
                    self.assertGreaterEqual(
                        len(visible), validate_content.ENGLISH_MIN_PER_TRACK[key],
                        f"трек {t['id']}: видно {len(visible)} записей в {key}",
                    )
            for key, minimum in validate_content.ENGLISH_MIN_TRACK_OWN.items():
                with self.subTest(track=t["id"], own=key):
                    own = [x for x in getattr(self.c, key)
                           if t["id"] in (x.get("track_ids") or [])]
                    self.assertGreaterEqual(
                        len(own), minimum,
                        f"трек {t['id']}: своих записей в {key} — {len(own)}",
                    )

    def test_english_fields_have_no_cyrillic(self):
        """Кириллица в английском поле — след копипаста из соседней строки."""
        checks = [
            ("english_phrases", ["en"]),
            ("english_vocab", ["term", "example_en"]),
            ("english_drills", ["prompt_en", "model_answer_en"]),
            ("english_writing", ["en"]),
        ]
        for key, fields in checks:
            for x in getattr(self.c, key):
                for f in fields:
                    with self.subTest(item=x["id"], field=f):
                        self.assertFalse(
                            validate_content.CYRILLIC & set(x.get(f) or ""),
                            f"{x['id']}: в поле {f} есть кириллица",
                        )

    def test_drill_rubrics_are_complete(self):
        for d in self.c.english_drills:
            with self.subTest(drill=d["id"]):
                self.assertEqual(set(d["rubric"]), {"0", "1", "2", "3", "4"})

    def test_track_ids_resolve(self):
        known = set(self.c.tracks_by_id)
        for key in self.KEYS:
            for x in getattr(self.c, key):
                with self.subTest(item=x["id"]):
                    self.assertLessEqual(set(x.get("track_ids") or []), known)


class TestQuestionQuality(unittest.TestCase):
    """Качество банка: угадываемость, дубли, ссылки."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    def test_four_options_and_valid_answer(self):
        for q in self.c.questions:
            with self.subTest(q=q["id"]):
                self.assertEqual(len(q["options"]), 4)
                self.assertIsInstance(q["answer"], int)
                self.assertTrue(0 <= q["answer"] < 4)
                self.assertEqual(len(q["why"]), 4, "разбор нужен для каждого варианта")
                self.assertTrue(q["explanation"].strip())

    def test_answer_index_distribution(self):
        """Правильный ответ не должен систематически стоять на одном месте."""
        dist = {0: 0, 1: 0, 2: 0, 3: 0}
        for q in self.c.questions:
            dist[q["answer"]] += 1
        total = len(self.c.questions)
        for idx, n in dist.items():
            share = n / total
            with self.subTest(index=idx):
                self.assertGreater(share, 0.15, f"индекс {idx} встречается лишь в {share:.0%}")
                self.assertLess(share, 0.35, f"индекс {idx} встречается в {share:.0%}")

    def test_correct_answer_not_giveaway_by_length(self):
        """Правильный вариант не должен быть заметно длиннее остальных."""
        giveaway = 0
        for q in self.c.questions:
            lens = [len(o) for o in q["options"]]
            second = sorted(lens, reverse=True)[1]
            gap = lens[q["answer"]] - second
            if lens[q["answer"]] == max(lens) and gap >= 8 and gap / max(1, second) >= 0.15:
                giveaway += 1
        share = giveaway / len(self.c.questions)
        self.assertLess(share, 0.25,
                        f"правильный ответ заметно длиннее в {share:.0%} вопросов — "
                        f"банк угадывается без знания предмета")

    def test_no_duplicate_questions(self):
        seen = {}
        for q in self.c.questions:
            key = normalize_text(q["question"])
            with self.subTest(q=q["id"]):
                self.assertNotIn(key, seen, f"дубль вопроса {seen.get(key)}")
            seen[key] = q["id"]

    def test_no_conflicting_answers(self):
        """Одинаковый набор вариантов с разными правильными ответами —
        прямое противоречие внутри банка."""
        by_options = {}
        for q in self.c.questions:
            key = frozenset(normalize_text(o) for o in q["options"])
            by_options.setdefault(key, []).append(q)
        for group in by_options.values():
            if len(group) < 2:
                continue
            correct = {normalize_text(g["options"][g["answer"]]) for g in group}
            self.assertEqual(len(correct), 1,
                             "конфликт: " + ", ".join(g["id"] for g in group))

    def test_levels_are_valid_and_reach_diagnostics(self):
        """Уровни L1..L4 из спецификации.

        Поле необязательное: старый банк размечается постепенно. Но полностью
        размеченная тема обязана доходить до L4 — иначе разметка украшение, а
        банк остаётся на «узнал и объяснил».
        """
        by_topic = {}
        for q in self.c.questions:
            if "level" in q:
                with self.subTest(q=q["id"]):
                    self.assertIn(q["level"], validate_content.QUESTION_LEVELS)
            by_topic.setdefault(q["topic"], []).append(q)
        for topic, pool in by_topic.items():
            levelled = [q for q in pool if q.get("level")]
            if not levelled or len(levelled) != len(pool):
                continue
            with self.subTest(topic=topic):
                self.assertTrue(any(q["level"] == "L4" for q in levelled),
                                f"тема {topic} размечена по уровням, но без диагностики")

    def test_seo_bank_is_fully_levelled(self):
        """Трек под вакансию размечен целиком и каждая тема доходит до L4.

        Диагностика — целевой уровень трека: на собеседовании дают данные и
        спрашивают, что проверять первым. До этой разметки в банке не было ни
        одного вопроса уровня L4 ни в одной теме.
        """
        seo = [q for q in self.c.questions if q["track_id"] == "redcore-junior-seo"]
        by_topic = {}
        for q in seo:
            with self.subTest(q=q["id"]):
                self.assertIn(q.get("level"), validate_content.QUESTION_LEVELS,
                              "вопрос трека без уровня")
            by_topic.setdefault(q["topic"], []).append(q)
        for topic, pool in by_topic.items():
            with self.subTest(topic=topic):
                self.assertTrue(any(q["level"] == "L4" for q in pool),
                                "тема без диагностического вопроса")

    def test_options_are_distinct(self):
        for q in self.c.questions:
            with self.subTest(q=q["id"]):
                norm = [normalize_text(o) for o in q["options"]]
                self.assertEqual(len(set(norm)), 4, "варианты ответа повторяются")


class TestReferences(unittest.TestCase):
    """Целостность перекрёстных ссылок."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    def test_all_source_refs_resolve(self):
        src_ids = set(self.c.sources_by_id)
        collections = [
            ("questions", self.c.questions),
            ("lessons", self.c.lessons),
            ("glossary", self.c.glossary),
            ("mock", self.c.mock_questions),
        ]
        for name, items in collections:
            for item in items:
                for ref in item.get("source_refs") or []:
                    with self.subTest(collection=name, item=item["id"], ref=ref):
                        self.assertIn(ref, src_ids)

    def test_library_matches_sources(self):
        """URL в библиотеке обязан совпадать с источником: иначе аудит ссылок
        проверяет не то, что видит пользователь."""
        for r in self.c.library:
            with self.subTest(res=r["id"]):
                src = self.c.sources_by_id.get(r["source_ref"])
                self.assertIsNotNone(src)
                self.assertEqual(src["url"], r["url"])

    def test_roadmap_practice_items_resolve(self):
        topic_ids = set(self.c.topics_by_id)
        case_ids = set(self.c.cases_by_id)
        mock_ids = set(self.c.mock_by_id)
        for s in self.c.roadmap:
            for item in s.get("practice_items") or []:
                kind, _, ref = item.partition(":")
                with self.subTest(step=s["id"], item=item):
                    if kind == "quiz":
                        self.assertIn(ref, topic_ids)
                        self.assertTrue(any(q["topic"] == ref for q in self.c.questions),
                                        f"в теме {ref} нет вопросов")
                    elif kind == "case":
                        self.assertIn(ref, case_ids)
                    elif kind == "mock":
                        self.assertIn(ref, mock_ids)
                    else:
                        self.fail(f"неизвестный тип practice_item: {kind}")

    def test_roadmap_prerequisites_are_earlier(self):
        order = {s["id"]: s["order"] for s in self.c.roadmap}
        for s in self.c.roadmap:
            for dep in s.get("prerequisites") or []:
                with self.subTest(step=s["id"], dep=dep):
                    self.assertIn(dep, order)
                    self.assertLess(order[dep], s["order"],
                                    "предпосылка должна идти раньше шага")

    def test_required_topics_have_lessons(self):
        for t in self.c.active_tracks():
            covered = {l["topic_id"] for l in self.c.lessons if l["track_id"] == t["id"]}
            for topic in self.c.topics_of(t["id"]):
                if topic.get("required"):
                    with self.subTest(topic=topic["id"]):
                        self.assertIn(topic["id"], covered)

    def test_seo_lessons_say_how_to_check(self):
        """Урок трека под вакансию обязан отвечать «как проверить это руками».

        Без этого блока урок остаётся чтением: человек узнаёт правило и не
        умеет применить его к живому сайту. Поля идут парой — проверка без
        инструмента и инструмент без проверки одинаково бесполезны.
        """
        for l in self.c.lessons:
            if l["track_id"] != "redcore-junior-seo":
                continue
            with self.subTest(lesson=l["id"]):
                self.assertTrue((l.get("how_to_check") or "").strip(),
                                "урок без блока «как проверить руками»")
                self.assertTrue(l.get("tools"), "урок без списка инструментов")

    def test_seo_track_has_required_practice(self):
        """Практика руками не заменяется тестами и моком.

        У проекта намеренно нет собственного состояния: сделанным он считается
        через доказательство у требования вакансии. Поэтому проект без живой
        ссылки на требование закрыть нечем, а ограничитель готовности остался
        бы включённым навсегда.
        """
        track_id = "redcore-junior-seo"
        projects = [p for p in self.c.projects if p["track_id"] == track_id]
        self.assertGreaterEqual(len(projects), 3, "обязательной практики слишком мало")
        self.assertTrue(any(p["required"] for p in projects))
        t = next(x for x in self.c.tracks if x["id"] == track_id)
        vac = next(v for v in self.c.vacancies if v["id"] == t["vacancy_id"])
        req_ids = {r["id"] for r in vac["requirements"]}
        for p in projects:
            with self.subTest(project=p["id"]):
                self.assertIn(p["requirement_id"], req_ids)

    def test_seo_critical_topics_have_a_case(self):
        """У критической темы должен быть способ снять потолок практикой.

        Правило введено при переработке SEO-трека, поэтому проверяется на нём:
        на остальных треках пробел ещё открыт и виден предупреждением
        валидатора, а не падением чужого CI.
        """
        track_id = "redcore-junior-seo"
        t = next(x for x in self.c.tracks if x["id"] == track_id)
        covered = set()
        for case in self.c.cases:
            if case["track_id"] == track_id:
                covered.update(case.get("topic_ids") or [])
        for tid in t["critical_topic_ids"]:
            with self.subTest(topic=tid):
                self.assertIn(tid, covered, "критическая тема без единого кейса")

    def test_critical_lists_agree(self):
        """Трек объявляет критические темы, тема помечает себя сама."""
        for t in self.c.active_tracks():
            declared = set(t.get("critical_topic_ids") or [])
            marked = {x["id"] for x in self.c.topics
                      if x["track_id"] == t["id"] and x.get("critical")}
            with self.subTest(track=t["id"]):
                self.assertEqual(declared, marked)

    def test_critical_topics_have_enough_questions(self):
        for t in self.c.active_tracks():
            counts = {}
            for q in self.c.questions:
                if q["track_id"] == t["id"]:
                    counts[q["topic"]] = counts.get(q["topic"], 0) + 1
            for tid in t["critical_topic_ids"]:
                with self.subTest(topic=tid):
                    self.assertGreaterEqual(
                        counts.get(tid, 0), 8,
                        "у критической темы должно быть не меньше 8 вопросов",
                    )


class TestFreshness(unittest.TestCase):
    """Метки свежести: они должны работать, а не украшать схему."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()
        cls.vol = {t["id"]: t.get("volatility", validate_content.DEFAULT_VOLATILITY)
                   for t in cls.c.topics}

    def test_volatility_values_are_valid(self):
        for t in self.c.topics:
            with self.subTest(topic=t["id"]):
                self.assertIn(t.get("volatility", validate_content.DEFAULT_VOLATILITY),
                              validate_content.VOLATILITY_LEVELS)

    def test_ga4_gsc_and_tools_are_high_volatility(self):
        """Именно там формулировки и интерфейсы устаревают быстрее всего."""
        for tid in ("analytics-ga4", "indexing-gsc", "seo-tools"):
            with self.subTest(topic=tid):
                self.assertEqual(self.vol.get(tid), "high")

    def test_vacancy_data_is_watched(self):
        """Объявление правит работодатель, а не мы: дата сверки обязательна."""
        for t in self.c.active_tracks():
            v = next((x for x in self.c.vacancies if x["id"] == t.get("vacancy_id")), None)
            if v is None or v.get("volatility") != "high":
                continue
            with self.subTest(vacancy=v["id"]):
                self.assertTrue(v.get("content_reviewed_at"))

    def test_high_volatility_records_carry_review_date(self):
        high = {tid for tid, v in self.vol.items() if v == "high"}
        collections = [
            ("lesson", self.c.lessons, lambda x: [x.get("topic_id")]),
            ("question", self.c.questions, lambda x: [x.get("topic")]),
            ("term", self.c.glossary, lambda x: x.get("topic_ids") or []),
            ("mock", self.c.mock_questions, lambda x: x.get("topic_ids") or []),
            ("case", self.c.cases, lambda x: x.get("topic_ids") or []),
        ]
        for kind, items, topics_of in collections:
            for x in items:
                if not high & {t for t in topics_of(x) if t}:
                    continue
                with self.subTest(kind=kind, item=x["id"]):
                    self.assertTrue(x.get("content_reviewed_at"),
                                    "запись высоковолатильной темы без даты сверки")

    def test_review_dates_are_not_in_the_future(self):
        from datetime import date
        for key in ("lessons", "questions", "glossary", "mock_questions", "cases"):
            for x in getattr(self.c, key):
                d = x.get("content_reviewed_at")
                if not d:
                    continue
                with self.subTest(item=x["id"]):
                    self.assertRegex(d, r"^\d{4}-\d{2}-\d{2}$")
                    self.assertLessEqual(date.fromisoformat(d), date.today())


class TestNoUserDataInvented(unittest.TestCase):
    """Приложение не должно придумывать достижения пользователя."""

    @classmethod
    def setUpClass(cls):
        cls.c = load_all()

    def test_requirements_have_no_prefilled_evidence(self):
        for v in self.c.vacancies:
            for r in v["requirements"]:
                with self.subTest(req=r["id"]):
                    self.assertEqual(r.get("evidence", ""), "",
                                     "доказательство из портфолио заполняет пользователь")
                    self.assertEqual(r.get("status"), "not_started",
                                     "статус требования не может быть проставлен заранее")

    def test_model_answers_do_not_claim_experience(self):
        """Эталон мок-интервью не заявляет опыт кандидата.

        «Год занимаюсь SEO» в эталоне — выдуманное достижение: человек заучит
        чужую биографию и развалится на первом уточняющем вопросе. Личный
        материал живёт отдельным полем и заполняется пользователем.
        """
        for m in self.c.mock_questions:
            for field in ("model_answer_short", "model_answer_full"):
                blob = str(m.get(field) or "").lower()
                for marker in validate_content.FABRICATED_EXPERIENCE:
                    with self.subTest(mock=m["id"], field=field, marker=marker):
                        self.assertNotIn(marker, blob)

    def test_personal_answers_ask_for_own_material(self):
        """Каркас личного ответа обязан говорить, что вписать своё."""
        for m in self.c.mock_questions:
            kind = m.get("answer_kind")
            if kind is None:
                continue
            with self.subTest(mock=m["id"]):
                self.assertIn(kind, validate_content.ANSWER_KINDS)
                if kind == "personal":
                    self.assertTrue((m.get("personal_evidence_prompt") or "").strip(),
                                    "personal без personal_evidence_prompt")
                else:
                    self.assertIsNone(m.get("personal_evidence_prompt"))

    def test_active_track_mocks_are_classified(self):
        """Трек под конкретную вакансию размечен целиком.

        Частичная разметка хуже отсутствия: экран показал бы «каркас ответа»
        на одних вопросах и «эталон» на других без всякой логики.
        """
        for m in self.c.mock_questions:
            if m["track_id"] != "redcore-junior-seo":
                continue
            with self.subTest(mock=m["id"]):
                self.assertIn(m.get("answer_kind"), validate_content.ANSWER_KINDS)

    def test_story_templates_are_empty(self):
        for s in self.c.stories:
            for field in ("situation", "task", "action", "result", "reflection"):
                with self.subTest(story=s["id"], field=field):
                    self.assertEqual(s.get(field, ""), "",
                                     "истории пользователя не выдумываются")


class TestNoReferenceLeftovers(unittest.TestCase):
    """Ни морской предметной области, ни ключей хранилища референсного проекта."""

    def test_no_maritime_content(self):
        c = load_all()
        for key, raw in c.raw.items():
            blob = json.dumps(raw, ensure_ascii=False).lower()
            for marker in validate_content.MARITIME_MARKERS:
                with self.subTest(file=key, marker=marker):
                    self.assertNotIn(marker, blob)

    def test_no_old_namespaces_anywhere(self):
        """Старые ключи хранилища не должны встречаться ни в данных, ни в коде."""
        bad = ["issa_", "marine_", "pl_progress_"]
        targets = list((BASE / "data").glob("*.json"))
        targets += list((BASE / "webapp").glob("*.js"))
        targets += list((BASE / "webapp").glob("*.html"))
        targets += list((BASE / "api").glob("*.py"))
        targets += [BASE / "bot.py", BASE / "bot_i18n.py"]
        for path in targets:
            if not path.exists():
                continue
            text = path.read_text(encoding="utf-8").lower()
            for ns in bad:
                with self.subTest(file=path.name, ns=ns):
                    self.assertNotIn(ns, text)

    def test_new_namespace_is_used(self):
        """Новые ключи должны быть именно те, что объявлены в требованиях."""
        expected = [
            "interview_progress_v1", "interview_srs_v1", "interview_history_v1",
            "interview_profile_v1", "interview_exam_date_v1", "interview_sync_v1",
        ]
        text = ""
        for name in ("progress.js", "srs.js", "sync.js"):
            text += (BASE / "webapp" / name).read_text(encoding="utf-8")
        for key in expected:
            with self.subTest(key=key):
                self.assertIn(key, text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
