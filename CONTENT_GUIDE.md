# Руководство по контенту

Как устроены данные в `data/`, какие правила действуют и что проверяется
автоматически.

## Общие правила

**Каждый факт привязан к источнику.** Утверждение без `source_refs` допустимо
только там, где источника быть не может: поведение на собеседовании,
коммуникация, схема STAR.

**Не выдумывать ссылки.** Если проверить URL нечем, ставится
`verification_status: "needs_review"` и материал помечается как требующий
ручной проверки. Придуманный URL хуже отсутствующего: он выглядит достоверно.

**Не копировать защищённые тексты.** Формулировки свои, ссылка ведёт на
первоисточник. Книги в репозиторий не кладутся.

**Не придумывать за пользователя.** Доказательства из портфолио и истории STAR
пустые — их заполняет человек. Это проверяется тестом.

**Простые слова.** Определение, которое нельзя произнести вслух на
собеседовании, бесполезно.

## Что проверяется автоматически

`tools/validate_content.py` — более 2300 проверок. Основное:

* уникальность идентификаторов в каждой коллекции;
* существование всех перекрёстных ссылок;
* обязательные поля и их типы;
* допустимые значения перечислений;
* минимальные количества;
* отсутствие точных дублей и конфликтующих ответов;
* распределение позиции правильного ответа;
* правильный вариант не выделяется длиной;
* отсутствие циклов в зависимостях плана;
* предпосылка шага идёт раньше самого шага;
* обязательные темы покрыты уроками, критические — вопросами;
* нет морской предметной области и старых ключей хранилища.

Запуск: `python tools/validate_content.py`

## Форматы

### `tracks.json`

```json
{
  "id": "redcore-junior-seo",
  "title": "Junior SEO Specialist",
  "company": "RedCore",
  "status": "active",
  "language": "ru",
  "summary": "…",
  "vacancy_id": "redcore-junior-seo",
  "critical_topic_ids": ["search-basics", "…"],
  "self_assessment_areas": [
    { "id": "sa-gsc", "title": "Google Search Console", "hint": "…" }
  ]
}
```

`status`: `active` | `coming_soon` | `draft`.

Только `active` получает процент готовности. Неактивный трек **не должен**
объявлять критические темы или ссылаться на вакансию — иначе он выглядит
готовым, не будучи им.

### `topics.json`

```json
{
  "id": "technical-seo",
  "track_id": "redcore-junior-seo",
  "order": 5,
  "title": "Технический SEO",
  "short": "robots.txt, sitemap.xml, canonical, дубли, параметры, рендеринг",
  "required": true,
  "critical": true
}
```

`required` — тема входит в обязательное покрытие плана.
`critical` — слабая тема ограничивает готовность потолком 69%.
Критическая тема обязана быть обязательной; это проверяется.

### `sources.json`

```json
{
  "id": "google-canonicalization",
  "title": "What is URL canonicalization",
  "publisher": "Google Search Central",
  "url": "https://developers.google.com/…",
  "type": "official_documentation",
  "verified": true,
  "verified_at": "2026-07-27"
}
```

URL обязан быть https. `verified: true` требует `verified_at`.

Приоритет источников:

1. Google Search Central, Search Console Help, Analytics Help
2. MDN, web.dev, Chrome for Developers
3. Документация инструментов (Screaming Frog, Ahrefs, Semrush)
4. Спецификации (RFC, sitemaps.org, Schema.org)
5. Качественные вторичные источники — только когда первичного нет

### `lessons.json`

```json
{
  "id": "lesson-robots-sitemap-canonical",
  "track_id": "redcore-junior-seo",
  "topic_id": "technical-seo",
  "title": "…",
  "summary": "…",
  "why_it_matters": "…",
  "key_points": ["…"],
  "common_mistakes": ["…"],
  "example": "…",
  "interview_question": "…",
  "short_answer": "…",
  "practice_task": "…",
  "source_refs": ["…"],
  "related_question_ids": ["…"],
  "related_term_ids": ["…"],
  "estimated_minutes": 25
}
```

Минимум 3 пункта в `key_points` и 2 в `common_mistakes`.

`short_answer` — то, что человек реально скажет на собеседовании: связный
текст на 30–60 секунд, а не определение из учебника.

### `glossary.json`

```json
{
  "id": "t-canonical-url",
  "track_ids": ["redcore-junior-seo"],
  "topic_ids": ["technical-seo"],
  "category": "Technical SEO",
  "term": "Canonical URL",
  "aliases": ["rel=canonical", "canonical tag", "канонический адрес"],
  "definition_simple": "…",
  "definition_interview": "…",
  "example": "…",
  "common_confusion": "…",
  "question": "…",
  "answer": "…",
  "source_refs": ["…"],
  "difficulty": 2
}
```

Два определения намеренно: простое — чтобы понять, интервью — чтобы сказать.

`aliases` критичны для поиска: человек ищет и «canonical», и «канонический»,
и «rel=canonical».

`common_confusion` — самое ценное поле: большинство ошибок на собеседовании
это спутанные соседние понятия.

`category` обязана быть в списке `categories` в начале файла.

### `library.json`

```json
{
  "id": "lib-canonicalization",
  "source_ref": "google-canonicalization",
  "title": "…",
  "publisher": "…",
  "url": "…",
  "type": "official_documentation",
  "language": "en",
  "topic_ids": ["technical-seo"],
  "difficulty": 2,
  "estimated_minutes": 20,
  "why_read": "…",
  "read_before_interview": true,
  "verification_status": "verified",
  "last_verified": "2026-07-27"
}
```

`url` обязан совпадать с URL источника — иначе аудит ссылок проверяет не то,
что открывает пользователь. Это проверяется.

`why_read` — не пересказ, а ответ на вопрос «зачем это мне перед
собеседованием».

`read_before_interview: true` ставится экономно: список обязательного чтения
теряет смысл, если в нём всё.

### `questions.json`

```json
{
  "id": "q-technical-seo-004",
  "track_id": "redcore-junior-seo",
  "topic": "technical-seo",
  "question": "Canonical — это директива или подсказка для Google?",
  "options": ["…", "…", "…", "…"],
  "answer": 1,
  "explanation": "…",
  "why": ["…", "Верно: …", "…", "…"],
  "difficulty": 2,
  "source_refs": ["google-canonicalization"],
  "related_term_ids": ["t-canonical-url"],
  "related_lesson_ids": ["lesson-robots-sitemap-canonical"],
  "verification_status": "verified"
}
```

Правила:

* ровно четыре варианта, все различны по смыслу;
* `why[i]` объясняет вариант `options[i]` — разбирается каждый, а не только верный;
* правильный вариант **не должен** быть заметно длиннее остальных: иначе банк
  угадывается без знания предмета. Порог — не более 25% таких вопросов;
* позиция правильного ответа распределена равномерно (каждый индекс 15–35%);
* нет двух вопросов с одинаковым набором вариантов и разными правильными
  ответами — это прямое противоречие;
* `difficulty` 1–3.

При добавлении вопросов запускайте `tools/deduplicate_questions.py`: он ловит
почти-дубли, которые формально не совпадают.

### `mock_questions.json`

```json
{
  "id": "mock-technical-001",
  "track_id": "redcore-junior-seo",
  "category": "technical",
  "topic_ids": ["indexing-gsc"],
  "difficulty": 3,
  "question": "…",
  "intent": "Что проверяют этим вопросом",
  "expected_points": ["…"],
  "red_flags": ["…"],
  "answer_structure": ["…"],
  "model_answer_short": "…",
  "model_answer_full": "…",
  "rubric": { "0": "…", "1": "…", "2": "…", "3": "…", "4": "…" },
  "source_refs": []
}
```

Минимум 3 пункта в `expected_points`, 2 в `red_flags`. Рубрика обязана иметь
все уровни 0–4.

`model_answer_short` — то, что можно произнести за минуту.
`model_answer_full` — разбор для чтения: почему ответ устроен именно так, что
отличает сильный ответ от среднего.

`category` обязана быть в списке `categories`. Каждая категория из
`session_flow` должна иметь хотя бы один вопрос, иначе полная сессия окажется
неполной.

### `cases.json`

```json
{
  "id": "case-indexing-001",
  "track_id": "redcore-junior-seo",
  "title": "…",
  "topic_ids": ["indexing-gsc"],
  "difficulty": 2,
  "critical": true,
  "scenario": "…",
  "artifacts": ["…"],
  "questions": ["…"],
  "expected_process": ["…"],
  "must_mention": ["…"],
  "common_mistakes": ["…"],
  "solution": "…",
  "rubric": { "0": "…", "…": "…", "4": "…" }
}
```

Минимум 3 вопроса, 3 шага процесса, 2 обязательных упоминания, 2 частые ошибки.

`critical: true` — кейс входит в покрытие критических; влияет на блок кейсов
в расчёте готовности.

`scenario` описывает ситуацию так, как её увидел бы специалист на работе:
с цифрами и деталями, без подсказок к решению.

### `roadmap.json`

```json
{
  "id": "step-08-indexing-gsc",
  "track_id": "redcore-junior-seo",
  "order": 8,
  "title": "…",
  "goal": "…",
  "topic_ids": ["indexing-gsc"],
  "estimated_minutes": 60,
  "required": true,
  "prerequisites": ["step-07-robots-sitemap-canonical"],
  "study_items": ["lesson-indexing-diagnostics"],
  "practice_items": ["quiz:indexing-gsc", "case:case-indexing-001",
                     "mock:mock-technical-001"],
  "completion_rule": { "lesson_read": true, "quiz_score_min": 80,
                       "case_completed_min": 1 }
}
```

`practice_items` — префиксованные ссылки: `quiz:<topic_id>`, `case:<case_id>`,
`mock:<mock_id>`. Все проверяются на существование; тема в `quiz:` обязана
иметь вопросы.

`prerequisites` обязаны идти **раньше** по `order` и не образовывать циклов.

Возможные ключи `completion_rule`: `lesson_read`, `quiz_score_min`,
`case_completed_min`, `mock_answered_min`, `stories_filled_min`,
`full_mock_sessions_min`.

### `vacancies.json`

```json
{
  "id": "…", "track_id": "…", "title": "…", "company": "…",
  "level": "Junior", "work_format": "…", "summary": "…",
  "main_tasks": ["…"], "tools": ["…"], "interview_topics": ["topic-id"],
  "requirements": [
    {
      "id": "req-gsc",
      "requirement": "Google Search Console: отчёты, индексация, проверка URL",
      "importance": "required",
      "topic_ids": ["indexing-gsc"],
      "status": "not_started",
      "evidence": "",
      "evidence_hint": "Что именно засчитается как доказательство",
      "gap": "",
      "next_action": "Что сделать, чтобы закрыть требование"
    }
  ]
}
```

`importance`: `required` | `desirable` | `nice_to_have`.
`status`: `confirmed` | `partial` | `learning` | `not_started` | `not_applicable`.

**`evidence` и `gap` обязаны быть пустыми, `status` — всегда `not_started`.**
Их заполняет пользователь в приложении. Валидатор запрещает статус
`confirmed`/`partial` с пустым `evidence`: это выдуманное достижение.

`evidence_hint` — подсказка, что именно засчитается. Она от приложения,
поэтому заполнена.

### `stories.json`

Шаблоны историй STAR. Поля `situation`, `task`, `action`, `result`,
`reflection` обязаны быть пустыми — это проверяется тестом.

Заполнены только `title`, `prompt`, `checklist` и `for_questions` (ссылки на
вопросы mock interview, где история пригодится).

### Английский для IT: `english_phrases.json`, `english_vocab.json`, `english_drills.json`, `english_writing.json`

Раздел **сквозной**: он виден на всех треках. Пустой `track_ids` означает
«во всех треках», непустой — лексика конкретной профессии. Правило то же, что
у глоссария, и повторено ровно в одном месте кода (`App.englishOf`).

Источников у фраз и переписки нет намеренно: это речевые формулы, а не
проверяемые факты. У слов вместо источника — `dict_url` на словарную статью.

```json
// english_phrases.json → phrases[]
{ "id": "ph-clar-001", "category": "Если не понял или нужно время",
  "track_ids": [], "level": 1,
  "en": "Sorry, could you repeat that, please?",
  "ru": "Извините, можете повторить?",
  "when": "Когда говорить", "note": "Грабли", "variants": ["…"] }

// english_vocab.json → words[]
{ "id": "ev-queue", "term": "queue", "ipa": "/kjuː/", "ru_hint": "кью",
  "meaning": "очередь задач или сообщений",
  "wrong": "как произносят неверно",
  "example_en": "…", "example_ru": "…",
  "dict_url": "https://dictionary.cambridge.org/dictionary/english/queue" }

// english_drills.json → drills[]
{ "id": "ed-self-001", "prompt_en": "Tell me about yourself.",
  "prompt_ru": "…", "hint": "…", "keywords": ["…", "…"],
  "model_answer_en": "…", "model_answer_ru": "…",
  "rubric": { "0": "…", "4": "…" }, "seconds": 90 }

// english_writing.json → snippets[]
{ "id": "ew-doc-001", "kind": "pattern", "title": "MUST, SHOULD, MAY",
  "en": "…", "ru": "…", "note": "…" }

// english_writing.json → snippets[] с заданием (обязательно у kind = template)
{ "id": "ew-mail-001", "kind": "template", "title": "Письмо после собеседования",
  "en": "…заготовка с подстановками…", "ru": "…", "note": "…",
  "task": {
    "brief_ru": "Факты и обстоятельства по-русски: кому пишете и что произошло.",
    "min_words": 45,
    "must": [
      { "label": "Благодарность за разговор",
        "any": ["thank you for", "thanks for"],
        "why": "Зачем эта часть нужна — по-русски, объяснением, а не приказом." }
    ],
    "avoid": [
      { "label": "Безличное обращение", "any": ["dear sir or madam"],
        "why": "Почему так писать не стоит." }
    ],
    "model_en": "…готовый текст без подстановок…"
  } }
```

**Как устроена проверка письма.** Задание — не оценка языка, а чек-лист жанра:
приложение ищет в тексте человека обязательные конструкции и сообщает, чего не
хватает. Правило сопоставления одно: текст и искомая конструкция приводятся к
нижнему регистру, всё кроме латинских букв, цифр и апострофа становится
пробелом, строка обрамляется пробелами. Обрамление даёт **границы слов**: `at`
не найдётся внутри `that`, `impact` — внутри `impactful`. Варианты в `any`
пишутся строчными: сравнение регистронезависимо, и верхний регистр только
вводил бы в заблуждение.

Правило продублировано в `webapp/writing.js` (браузер) и
`tools/content_lib.py` (валидатор). Расхождение ловит паритет в
`tests/test_writing.py` против `node webapp/_writing_check.mjs --dump` — как это
сделано для правил слияния. **Новое поле задания добавляется в обе реализации.**

Что проверяется автоматически:

* поля `en`, `term`, `prompt_en`, `model_answer_en`, `example_en`, `task.model_en`
  **не содержат кириллицы** — она там означает копипаст из соседней строки;
* `ipa` записан в косых чертах, `dict_url` ведёт на Cambridge Dictionary;
* `kind` — `pattern` или `template`, `level` — 1..3, рубрика задания — уровни 0..4;
* у **каждой** заготовки (`kind = template`) есть `task`: заготовка без задания —
  экран, на котором нечего практиковать;
* `task.model_en` **сам проходит собственный чек-лист** — набирает `min_words`,
  содержит все `must` и не содержит ни одного `avoid`, и в нём не осталось
  подстановок в квадратных скобках. Правило, под которое не подходит даже
  образец, — сломанное задание, и глазами в тридцати конструкциях это не видно;
* **каждый активный трек** видит минимум записей в каждом из четырёх разделов
  и имеет свои, не сквозные, слова и задания. Общего количества мало: пробел
  появляется именно в трековой части.

Английский **не входит** в расчёт готовности к профессии: процент отражает
знание предметной области. В дневную цель и серию он идёт — это такая же
учебная работа, как повторение терминов.

### `english_resources.json`

Внешние ресурсы регулярной практики (вкладка «Ресурсы» раздела английского).
Это не учебные записи, а маршрут: каждая карточка отвечает и «что это» (`why`),
и «как этим пользоваться» (`how`) — оба поля на русском. У ресурса нет
состояния: ни SRS, ни отметок, поэтому раздел не трогает профиль и правила
слияния.

```json
// english_resources.json → resources[]
{ "id": "eres-youglish", "category": "Произношение",
  "title": "YouGlish", "publisher": "youglish.com",
  "url": "https://youglish.com/", "source_ref": "youglish",
  "level": 1, "track_ids": [],
  "why": "Что это и чем полезно.",
  "how": "Конкретная методика: как включить ресурс в подготовку.",
  "note": "Необязательная оговорка." }
```

Правило то же, что у библиотеки: `url` обязан совпадать с записью
`source_ref` в `sources.json` — иначе аудит ссылок проверяет не то, что видит
пользователь. Это контролирует валидатор.

### `achievements.json`

```json
{
  "id": "ach-full-mock",
  "title": "Полная сессия",
  "description": "…",
  "icon": "list-checks",
  "tier": "high",
  "rule": { "type": "full_mock_sessions", "value": 1 }
}
```

`icon` обязан существовать в `webapp/icons.js` — проверяется `_nav_check.mjs`.

Достижения **не участвуют** в расчёте готовности: они отражают факт
выполненной работы, а не знание.

Тон нейтральный и профессиональный: «Техническая база», а не «Мастер SEO».

## Порядок работы над контентом

```bash
# 1. Правка data/*.json

# 2. Проверка
python tools/validate_content.py

# 3. Дубли
python tools/deduplicate_questions.py

# 4. Пересборка данных приложения
python tools/build_webapp_data.py

# 5. Отчёт о покрытии и пробелах
python tools/generate_content_report.py --out docs/CONTENT_REPORT.md

# 6. Ссылки (по сети, перед релизом)
python tools/audit_sources.py

# 7. Тесты
python tests/test_content.py
node webapp/_search_check.mjs
node webapp/_readiness_check.mjs
```

Шаг 4 обязателен: без него приложение продолжит показывать старый контент,
а CI упадёт на проверке свежести.

## Частые ошибки при добавлении контента

| Ошибка | Что произойдёт |
|---|---|
| Забыли пересобрать `generated/content_*.js` | CI упадёт, приложение покажет старое |
| Ссылка на несуществующий id | валидатор укажет файл и запись |
| Правильный ответ длиннее остальных | валидатор посчитает долю и упадёт при превышении 25% |
| Все правильные ответы под одним индексом | валидатор проверяет распределение |
| Термин добавлен без `aliases` | его не найдут поиском по английскому написанию |
| Материал без `topic_ids` | не попадёт в фильтры библиотеки |
| Шаг плана ссылается на тему без вопросов | валидатор укажет на это |
| Предпосылка шага идёт позже него | план невозможно пройти по порядку |
| Заполнили `evidence` в вакансии | тест упадёт: приложение не выдумывает опыт |
