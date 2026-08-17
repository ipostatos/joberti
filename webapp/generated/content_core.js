// ===========================================================================
// СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ РЕДАКТИРОВАТЬ РУКАМИ.
// Источник правды: data/*.json. Пересобрать:  python tools/build_webapp_data.py
// CI падает, если этот файл отстал от data/.
// ===========================================================================
(function (global) {
  "use strict";
  var CONTENT =
{
 "achievements":[
  {
   "description":"Первое выполненное действие: ответ, карточка, вопрос или кейс",
   "icon":"flag",
   "id":"ach-first-step",
   "rule":{
    "type":"actions_total",
    "value":1
   },
   "tier":"base",
   "title":"Первый шаг"
  },
  {
   "description":"Завершён первый тест",
   "icon":"clipboard-list",
   "id":"ach-first-quiz",
   "rule":{
    "type":"quiz_sessions",
    "value":1
   },
   "tier":"base",
   "title":"Первый тест"
  },
  {
   "description":"Семь дней активности подряд",
   "icon":"calendar-check",
   "id":"ach-week-streak",
   "rule":{
    "type":"streak",
    "value":7
   },
   "tier":"base",
   "title":"7 дней подготовки"
  },
  {
   "description":"Тридцать дней активности подряд",
   "icon":"calendar-check",
   "id":"ach-month-streak",
   "rule":{
    "type":"streak",
    "value":30
   },
   "tier":"high",
   "title":"30 дней подготовки"
  },
  {
   "description":"Пятьдесят терминов подтверждены проверкой",
   "icon":"book-open",
   "id":"ach-glossary-50",
   "rule":{
    "type":"glossary_mastered",
    "value":50
   },
   "tier":"base",
   "title":"50 терминов"
  },
  {
   "description":"Сто терминов подтверждены проверкой",
   "icon":"book-open",
   "id":"ach-glossary-100",
   "rule":{
    "type":"glossary_mastered",
    "value":100
   },
   "tier":"high",
   "title":"100 терминов"
  },
  {
   "description":"Отвечен первый открытый вопрос интервью",
   "icon":"message-square",
   "id":"ach-first-mock",
   "rule":{
    "type":"mock_answered",
    "value":1
   },
   "tier":"base",
   "title":"Первый mock"
  },
  {
   "description":"Пройдено полное mock interview от начала до конца",
   "icon":"list-checks",
   "id":"ach-full-mock",
   "rule":{
    "type":"full_mock_sessions",
    "value":1
   },
   "tier":"high",
   "title":"Полная сессия"
  },
  {
   "description":"Пройдено три полных mock interview",
   "icon":"list-checks",
   "id":"ach-three-mocks",
   "rule":{
    "type":"full_mock_sessions",
    "value":3
   },
   "tier":"high",
   "title":"Три сессии"
  },
  {
   "description":"Завершён первый практический кейс",
   "icon":"briefcase",
   "id":"ach-first-case",
   "rule":{
    "type":"cases_completed",
    "value":1
   },
   "tier":"base",
   "title":"Первый кейс"
  },
  {
   "description":"Пройдены все кейсы, отмеченные как критические",
   "icon":"briefcase",
   "id":"ach-all-critical-cases",
   "rule":{
    "type":"critical_cases_completed_all",
    "value":1
   },
   "tier":"high",
   "title":"Критические кейсы"
  },
  {
   "description":"Тема «Технический SEO» освоена не ниже 70%",
   "icon":"settings",
   "id":"ach-technical-base",
   "rule":{
    "topic_id":"technical-seo",
    "type":"topic_mastery",
    "value":70
   },
   "tier":"mid",
   "title":"Техническая база"
  },
  {
   "description":"Тема «Как работает поиск» освоена не ниже 70%",
   "icon":"search",
   "id":"ach-search-base",
   "rule":{
    "topic_id":"search-basics",
    "type":"topic_mastery",
    "value":70
   },
   "tier":"mid",
   "title":"Основы поиска"
  },
  {
   "description":"Тест из 25 и более вопросов пройден без единой ошибки",
   "icon":"check-circle",
   "id":"ach-flawless-quiz",
   "rule":{
    "type":"flawless_quiz_min_size",
    "value":25
   },
   "tier":"mid",
   "title":"Без ошибок"
  },
  {
   "description":"Тема, бывшая ниже 40%, доведена до 70% и выше",
   "icon":"trending-up",
   "id":"ach-fixed-weak-topic",
   "rule":{
    "type":"weak_topic_recovered",
    "value":1
   },
   "tier":"mid",
   "title":"Исправил слабую тему"
  },
  {
   "description":"Все накопленные ошибки закрыты повторным верным ответом",
   "icon":"refresh-cw",
   "id":"ach-mistakes-cleared",
   "rule":{
    "type":"mistakes_cleared",
    "value":1
   },
   "tier":"mid",
   "title":"Работа над ошибками"
  },
  {
   "description":"Выполнена половина обязательных шагов плана подготовки",
   "icon":"map",
   "id":"ach-roadmap-half",
   "rule":{
    "type":"roadmap_required_percent",
    "value":50
   },
   "tier":"mid",
   "title":"Половина плана"
  },
  {
   "description":"Выполнены все обязательные шаги плана подготовки",
   "icon":"map",
   "id":"ach-roadmap-done",
   "rule":{
    "type":"roadmap_required_percent",
    "value":100
   },
   "tier":"high",
   "title":"План закрыт"
  },
  {
   "description":"Прочитаны все материалы библиотеки с пометкой «до собеседования»",
   "icon":"library",
   "id":"ach-library-must-read",
   "rule":{
    "type":"library_must_read_all",
    "value":1
   },
   "tier":"mid",
   "title":"Обязательное чтение"
  },
  {
   "description":"Заполнены пять историй в story bank",
   "icon":"file-text",
   "id":"ach-story-bank",
   "rule":{
    "type":"stories_filled",
    "value":5
   },
   "tier":"mid",
   "title":"Истории готовы"
  },
  {
   "description":"Все обязательные требования вакансии переведены в статус confirmed или partial",
   "icon":"target",
   "id":"ach-gap-analysis",
   "rule":{
    "type":"required_requirements_addressed",
    "value":1
   },
   "tier":"high",
   "title":"Разрыв закрыт"
  },
  {
   "description":"Достигнут уровень готовности 50%",
   "icon":"gauge",
   "id":"ach-readiness-50",
   "rule":{
    "type":"readiness",
    "value":50
   },
   "tier":"mid",
   "title":"Готовность 50%"
  },
  {
   "description":"Достигнут уровень готовности 70%",
   "icon":"gauge",
   "id":"ach-readiness-70",
   "rule":{
    "type":"readiness",
    "value":70
   },
   "tier":"high",
   "title":"Готовность 70%"
  },
  {
   "description":"Достигнут уровень готовности 85%",
   "icon":"gauge",
   "id":"ach-readiness-85",
   "rule":{
    "type":"readiness",
    "value":85
   },
   "tier":"high",
   "title":"Готовность 85%"
  }
 ],
 "cases":[],
 "counts":{
  "achievements":24,
  "active_tracks":4,
  "cases":42,
  "english_drills":26,
  "english_phrases":68,
  "english_resources":9,
  "english_vocab":81,
  "english_writing":41,
  "glossary_terms":282,
  "lessons":95,
  "library_resources":224,
  "mock_questions":142,
  "projects":4,
  "questions":541,
  "roadmap_steps":95,
  "sources":236,
  "story_templates":31,
  "topics":84,
  "tracks":4,
  "vacancies":4
 },
 "englishDrillCategories":[
  "О себе",
  "Опыт и проекты",
  "Технический вопрос",
  "Ситуация на работе",
  "Вопросы работодателю"
 ],
 "englishDrills":[],
 "englishPhraseCategories":[
  "Начало разговора",
  "Рассказ о себе",
  "Опыт и проекты",
  "Технические объяснения",
  "Если не понял или нужно время",
  "Когда не знаешь ответа",
  "Вопросы работодателю",
  "Условия и финал"
 ],
 "englishPhrases":[],
 "englishResourceCategories":[
  "Курс с нуля",
  "Речь и рассказ о работе",
  "Чтение и практика",
  "Произношение",
  "Письмо"
 ],
 "englishResources":[],
 "englishVocab":[],
 "englishVocabCategories":[
  "Базовая лексика",
  "Процесс и команда",
  "Данные и API",
  "Инфраструктура",
  "SEO",
  "DevOps",
  "QA и платежи",
  "Поддержка"
 ],
 "englishWriting":[],
 "englishWritingCategories":[
  "Документация",
  "Письма",
  "Тикеты и баг-репорты",
  "Код-ревью и чат",
  "Созвоны и статусы"
 ],
 "glossary":[],
 "glossaryCategories":[
  "Search basics",
  "Crawling and indexing",
  "On-page SEO",
  "Technical SEO",
  "HTML and HTTP",
  "Keywords and intent",
  "Content",
  "Links",
  "Performance",
  "Google Search Console",
  "Analytics",
  "SEO tools",
  "Reporting",
  "Отрасль и контекст",
  "Interview English",
  "Linux и системы",
  "Сети",
  "Контейнеры",
  "Kubernetes",
  "CI/CD",
  "Инфраструктура как код",
  "Наблюдаемость",
  "Надёжность",
  "Безопасность",
  "Базы данных",
  "Облако",
  "Тестирование",
  "Тест-дизайн",
  "Платежи",
  "Возвраты и споры",
  "Деньги и валюты",
  "Данные карт и PCI DSS",
  "Интеграции и API",
  "Работа в команде",
  "Поддержка и обращения"
 ],
 "lessons":[],
 "library":[
  {
   "difficulty":1,
   "estimated_minutes":90,
   "id":"lib-seo-starter-guide",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-seo-starter-guide",
   "title":"SEO Starter Guide",
   "topic_ids":[
    "search-basics",
    "on-page",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
   "verification_status":"verified",
   "why_read":"Единственный документ, который стоит прочесть целиком до собеседования: официальная база по всем разделам сразу."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-how-search-works",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-how-search-works",
   "title":"In-depth guide to how Google Search works",
   "topic_ids":[
    "search-basics"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/how-search-works",
   "verification_status":"verified",
   "why_read":"Первоисточник ответа на самый частый вопрос собеседования: чем отличаются crawling, indexing и ranking."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-search-essentials",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-search-essentials",
   "title":"Google Search Essentials",
   "topic_ids":[
    "search-basics",
    "technical-seo",
    "interview-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/essentials",
   "verification_status":"verified",
   "why_read":"Минимальные требования Google к сайту. Полезно как чек-лист «что вообще обязательно»."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-spam-policies",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-spam-policies",
   "title":"Spam policies for Google web search",
   "topic_ids":[
    "search-basics",
    "content-briefs",
    "off-page-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/essentials/spam-policies",
   "verification_status":"verified",
   "why_read":"Понимание границы между оптимизацией и нарушением. Уберегает от советов, за которые на собеседовании ставят минус."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-helpful-content",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-helpful-content",
   "title":"Creating helpful, reliable, people-first content",
   "topic_ids":[
    "content-briefs",
    "search-intent"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
   "verification_status":"verified",
   "why_read":"Источник, на который можно ссылаться в ответах про качество контента и E-E-A-T вместо пересказа чужих статей."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-crawlers-overview",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-crawlers-overview",
   "title":"Overview of Google crawlers and fetchers",
   "topic_ids":[
    "search-basics",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers",
   "verification_status":"verified",
   "why_read":"Какие роботы существуют и как проверить подлинность Googlebot — вопрос, который иногда задают на технической части."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-robots-intro",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-robots-intro",
   "title":"Introduction to robots.txt",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/robots/intro",
   "verification_status":"verified",
   "why_read":"Обязательное чтение: robots.txt спрашивают почти всегда, и почти всегда путают с noindex."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-robots-spec",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-robots-spec",
   "title":"robots.txt specification",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
   "verification_status":"verified",
   "why_read":"Точные правила приоритета директив. Нужно, когда придётся разбирать чужой robots.txt со спорными правилами."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-rfc-9309",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"RFC Editor",
   "read_before_interview":false,
   "source_ref":"rfc-9309-rep",
   "title":"RFC 9309: Robots Exclusion Protocol",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9309.html",
   "verification_status":"verified",
   "why_read":"Формальный стандарт протокола. Читать не обязательно, но полезно знать, что robots.txt — это RFC, а не соглашение Google."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-robots-meta-tag",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-robots-meta-tag",
   "title":"Robots meta tag, data-nosnippet, and X-Robots-Tag specifications",
   "topic_ids":[
    "technical-seo",
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
   "verification_status":"verified",
   "why_read":"Полный список директив индексации и единственный корректный способ убрать страницу из поиска."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-canonicalization",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-canonicalization",
   "title":"What is URL canonicalization",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/canonicalization",
   "verification_status":"verified",
   "why_read":"Объясняет, что canonical — подсказка, а не команда. Этот нюанс отличает подготовленного кандидата."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-consolidate-duplicate-urls",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-consolidate-duplicate-urls",
   "title":"How to specify a canonical URL",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
   "verification_status":"verified",
   "why_read":"Практическая инструкция: какими способами задаётся канонический URL и какие комбинации противоречивы."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-sitemaps-overview",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-sitemaps-overview",
   "title":"Learn about sitemaps",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
   "verification_status":"verified",
   "why_read":"Когда sitemap нужен, а когда бесполезен. Помогает не отвечать «sitemap ускоряет индексацию»."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-build-sitemap",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-build-sitemap",
   "title":"Build and submit a sitemap",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
   "verification_status":"verified",
   "why_read":"Форматы, лимиты и требования к URL внутри карты — практическая часть, которую спрашивают на практике."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-sitemaps-protocol",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"sitemaps.org",
   "read_before_interview":false,
   "source_ref":"sitemaps-protocol",
   "title":"Sitemaps XML format",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"specification",
   "url":"https://www.sitemaps.org/protocol.html",
   "verification_status":"verified",
   "why_read":"Первоисточник формата: лимит 50 000 URL и 50 МБ, назначение тегов lastmod, changefreq, priority."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-301-redirects",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-301-redirects",
   "title":"Redirects and Google Search",
   "topic_ids":[
    "html-http",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/301-redirects",
   "verification_status":"verified",
   "why_read":"Разница 301 и 302 глазами Google и правила переезда сайта. Спрашивают почти на каждом собеседовании."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-http-status-codes",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-http-status-codes",
   "title":"How HTTP status codes affect Google Search",
   "topic_ids":[
    "html-http",
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
   "verification_status":"verified",
   "why_read":"Что Google делает при каждом коде ответа, включая soft 404 и длительные 5xx."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-url-structure",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-url-structure",
   "title":"Keep a simple URL structure",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/url-structure",
   "verification_status":"verified",
   "why_read":"Официальная позиция по параметрам, идентификаторам сессий и бесконечным пространствам URL."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-crawl-budget",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-crawl-budget",
   "title":"Large site owner's guide to managing your crawl budget",
   "topic_ids":[
    "technical-seo",
    "search-basics"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/crawl-budget",
   "verification_status":"verified",
   "why_read":"Единственный официальный текст про краулинговый бюджет. Помогает не сочинять про него мифы."
  },
  {
   "difficulty":3,
   "estimated_minutes":35,
   "id":"lib-javascript-seo",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-javascript-seo",
   "title":"Understand JavaScript SEO basics",
   "topic_ids":[
    "technical-seo",
    "dev-communication"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
   "verification_status":"verified",
   "why_read":"Как Google обрабатывает JavaScript и что делать, если контент не виден в исходном HTML."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-title-link",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-title-link",
   "title":"Influencing your title links in search results",
   "topic_ids":[
    "on-page"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/title-link",
   "verification_status":"verified",
   "why_read":"Почему Google переписывает title и как этого избежать. Готовый ответ на частый вопрос."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-snippet",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-snippet",
   "title":"Control your snippets in search results",
   "topic_ids":[
    "on-page"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/snippet",
   "verification_status":"verified",
   "why_read":"Роль meta description и управление сниппетом. Закрывает вопрос «влияет ли описание на позиции»."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-structured-data-intro",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-structured-data-intro",
   "title":"Intro to how structured data markup works",
   "topic_ids":[
    "on-page"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
   "verification_status":"verified",
   "why_read":"Что даёт микроразметка и почему она не является фактором ранжирования."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-rich-results-test",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google",
   "read_before_interview":false,
   "source_ref":"google-rich-results-test",
   "title":"Rich Results Test",
   "topic_ids":[
    "on-page"
   ],
   "type":"tool",
   "url":"https://search.google.com/test/rich-results",
   "verification_status":"verified",
   "why_read":"Инструмент, которым проверяют разметку. Стоит прогнать пару страниц до собеседования, чтобы говорить из опыта."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-schema-org",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Schema.org",
   "read_before_interview":false,
   "source_ref":"schema-org-getting-started",
   "title":"Getting started with schema.org",
   "topic_ids":[
    "on-page"
   ],
   "type":"specification",
   "url":"https://schema.org/docs/gs.html",
   "verification_status":"verified",
   "why_read":"Первоисточник словаря типов. Полезно понимать, что Schema.org и Google — не одно и то же."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-images-seo",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-images-seo",
   "title":"Google Images SEO best practices",
   "topic_ids":[
    "on-page",
    "performance-cwv"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/google-images",
   "verification_status":"verified",
   "why_read":"Правила для alt, имён файлов и форматов. Практическая задача, которую часто дают junior."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-localized-versions",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-localized-versions",
   "title":"Tell Google about localized versions of your page",
   "topic_ids":[
    "international-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/specialty/international/localized-versions",
   "verification_status":"verified",
   "why_read":"Полные правила hreflang с примерами ошибок. Нужен, если у компании есть версии на несколько стран."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-multi-regional",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-multi-regional",
   "title":"Managing multi-regional and multilingual sites",
   "topic_ids":[
    "international-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
   "verification_status":"verified",
   "why_read":"Выбор структуры для международного сайта: домены, папки, поддомены и их последствия."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-search-console-start",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-search-console-start",
   "title":"Get started with Search Console",
   "topic_ids":[
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/monitor-debug/search-console-start",
   "verification_status":"verified",
   "why_read":"Быстрый вход в инструмент, если своего проекта в GSC ещё нет."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-gsc-performance",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Console Help",
   "read_before_interview":true,
   "source_ref":"gsc-performance-report",
   "title":"Performance report: overview and basic setup",
   "topic_ids":[
    "indexing-gsc",
    "reporting"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/7576553",
   "verification_status":"verified",
   "why_read":"Точные определения показов, кликов, CTR и средней позиции — чтобы не путать их в отчёте и в ответе."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-gsc-url-inspection",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Console Help",
   "read_before_interview":true,
   "source_ref":"gsc-url-inspection",
   "title":"URL Inspection tool",
   "topic_ids":[
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/9012289",
   "verification_status":"verified",
   "why_read":"Главный инструмент диагностики индексации. Знать его наизусть — половина технического блока."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-gsc-page-indexing",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Console Help",
   "read_before_interview":true,
   "source_ref":"gsc-page-indexing-report",
   "title":"Page indexing report",
   "topic_ids":[
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/7440203",
   "verification_status":"verified",
   "why_read":"Расшифровка всех статусов индексации. Без неё легко перепутать «Обнаружена» и «Просканирована»."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-traffic-drops",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-traffic-drops",
   "title":"Debugging drops in Google Search traffic",
   "topic_ids":[
    "indexing-gsc",
    "reporting"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops",
   "verification_status":"verified",
   "why_read":"Готовая схема разбора падения трафика — типовой практический кейс на собеседовании."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-ga4-setup",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Analytics Help",
   "read_before_interview":false,
   "source_ref":"ga4-setup",
   "title":"Set up Analytics for a website and/or app",
   "topic_ids":[
    "analytics-ga4"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9304153",
   "verification_status":"verified",
   "why_read":"Если своего доступа к GA4 нет, здесь описано, как поднять собственный ресурс для практики."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-ga4-channels",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Analytics Help",
   "read_before_interview":true,
   "source_ref":"ga4-default-channel-group",
   "title":"Default channel group",
   "topic_ids":[
    "analytics-ga4"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9756891",
   "verification_status":"verified",
   "why_read":"Как именно определяется канал Organic Search — знание, которое сразу выделяет кандидата."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-ga4-events",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Analytics Help",
   "read_before_interview":true,
   "source_ref":"ga4-about-events",
   "title":"About events",
   "topic_ids":[
    "analytics-ga4"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9322688",
   "verification_status":"verified",
   "why_read":"Событийная модель GA4 и ключевые события. Без этого невозможно говорить о конверсиях."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-ga4-dimensions",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Analytics Help",
   "read_before_interview":false,
   "source_ref":"ga4-dimensions-metrics",
   "title":"Analytics dimensions and metrics",
   "topic_ids":[
    "analytics-ga4",
    "reporting"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9143382",
   "verification_status":"verified",
   "why_read":"Справочник измерений и метрик: страница входа, сессии, вовлечённость. Пригодится при построении отчётов."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-keyword-planner",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Ads Help",
   "read_before_interview":false,
   "source_ref":"google-keyword-planner",
   "title":"Use Keyword Planner",
   "topic_ids":[
    "keyword-research"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/google-ads/answer/7337243",
   "verification_status":"verified",
   "why_read":"Бесплатный источник данных о спросе. Стоит уметь пользоваться, даже если основной инструмент другой."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-google-trends",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google",
   "read_before_interview":false,
   "source_ref":"google-trends",
   "title":"Google Trends",
   "topic_ids":[
    "keyword-research",
    "reporting"
   ],
   "type":"tool",
   "url":"https://trends.google.com/trends/",
   "verification_status":"verified",
   "why_read":"Проверка сезонности перед выводом о падении трафика. Простой аргумент в отчёте."
  },
  {
   "difficulty":2,
   "estimated_minutes":45,
   "id":"lib-ahrefs-keyword-research",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Ahrefs",
   "read_before_interview":true,
   "source_ref":"ahrefs-keyword-research",
   "title":"Keyword Research: The Beginner's Guide",
   "topic_ids":[
    "keyword-research",
    "clustering-mapping"
   ],
   "type":"guide",
   "url":"https://ahrefs.com/blog/keyword-research/",
   "verification_status":"verified",
   "why_read":"Развёрнутый практический разбор сбора семантики с примерами отчётов."
  },
  {
   "difficulty":1,
   "estimated_minutes":40,
   "id":"lib-ahrefs-seo-basics",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Ahrefs",
   "read_before_interview":false,
   "source_ref":"ahrefs-seo-basics",
   "title":"SEO Basics",
   "topic_ids":[
    "search-basics",
    "competitor-analysis"
   ],
   "type":"guide",
   "url":"https://ahrefs.com/seo/seo-basics",
   "verification_status":"verified",
   "why_read":"Обзорный материал для восполнения пробелов, если база собрана несистемно."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-ahrefs-help",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Ahrefs",
   "read_before_interview":false,
   "source_ref":"ahrefs-help",
   "title":"Ahrefs Help Center",
   "topic_ids":[
    "seo-tools"
   ],
   "type":"tool_documentation",
   "url":"https://help.ahrefs.com/en/",
   "verification_status":"verified",
   "why_read":"Документация по отчётам: что именно считает Site Explorer и Content Gap. Полезно, чтобы не выдавать оценки за факты."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-semrush-kb",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Semrush",
   "read_before_interview":false,
   "source_ref":"semrush-kb",
   "title":"Semrush Knowledge Base",
   "topic_ids":[
    "seo-tools",
    "competitor-analysis"
   ],
   "type":"tool_documentation",
   "url":"https://www.semrush.com/kb/",
   "verification_status":"verified",
   "why_read":"Официальная документация второго распространённого инструмента. Пригодится, если в компании используют именно его."
  },
  {
   "difficulty":2,
   "estimated_minutes":40,
   "id":"lib-semrush-keyword-research",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Semrush",
   "read_before_interview":false,
   "source_ref":"semrush-keyword-research",
   "title":"Keyword Research Guide",
   "topic_ids":[
    "keyword-research"
   ],
   "type":"guide",
   "url":"https://www.semrush.com/blog/keyword-research/",
   "verification_status":"verified",
   "why_read":"Второй взгляд на сбор семантики. Полезно сравнить подходы двух инструментов."
  },
  {
   "difficulty":2,
   "estimated_minutes":60,
   "id":"lib-screamingfrog-guide",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Screaming Frog",
   "read_before_interview":true,
   "source_ref":"screamingfrog-user-guide",
   "title":"SEO Spider User Guide",
   "topic_ids":[
    "seo-tools",
    "technical-seo"
   ],
   "type":"tool_documentation",
   "url":"https://www.screamingfrog.co.uk/seo-spider/user-guide/",
   "verification_status":"verified",
   "why_read":"Основной инструмент технического SEO. Достаточно разобрать вкладки отчётов и настройки обхода."
  },
  {
   "difficulty":2,
   "estimated_minutes":60,
   "id":"lib-screamingfrog-tutorials",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Screaming Frog",
   "read_before_interview":false,
   "source_ref":"screamingfrog-tutorials",
   "title":"SEO Spider Tutorials",
   "topic_ids":[
    "seo-tools"
   ],
   "type":"practical_task",
   "url":"https://www.screamingfrog.co.uk/seo-spider/tutorials/",
   "verification_status":"verified",
   "why_read":"Пошаговые сценарии: поиск битых ссылок, разбор редиректов, аудит метаданных. Лучший способ получить практику без реального проекта."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-webdev-vitals",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"web.dev",
   "read_before_interview":true,
   "source_ref":"webdev-vitals",
   "title":"Web Vitals",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"guide",
   "url":"https://web.dev/articles/vitals",
   "verification_status":"verified",
   "why_read":"Определения LCP, INP и CLS с пороговыми значениями. Достаточно, чтобы уверенно ответить на вопрос про CWV."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-webdev-lcp",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"web.dev",
   "read_before_interview":false,
   "source_ref":"webdev-lcp",
   "title":"Largest Contentful Paint (LCP)",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"guide",
   "url":"https://web.dev/articles/lcp",
   "verification_status":"verified",
   "why_read":"Что именно измеряется и какие элементы считаются крупнейшими. Помогает не путать LCP с полной загрузкой."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-webdev-inp",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"web.dev",
   "read_before_interview":true,
   "source_ref":"webdev-inp",
   "title":"Interaction to Next Paint (INP)",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"guide",
   "url":"https://web.dev/articles/inp",
   "verification_status":"verified",
   "why_read":"Метрика, заменившая FID. Знание этого факта показывает, что вы следите за изменениями."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-webdev-cls",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"web.dev",
   "read_before_interview":false,
   "source_ref":"webdev-cls",
   "title":"Cumulative Layout Shift (CLS)",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"guide",
   "url":"https://web.dev/articles/cls",
   "verification_status":"verified",
   "why_read":"Причины сдвигов вёрстки и как их формулировать разработчику."
  },
  {
   "difficulty":3,
   "estimated_minutes":35,
   "id":"lib-webdev-optimize-lcp",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"web.dev",
   "read_before_interview":false,
   "source_ref":"webdev-optimize-lcp",
   "title":"Optimize Largest Contentful Paint",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"checklist",
   "url":"https://web.dev/articles/optimize-lcp",
   "verification_status":"verified",
   "why_read":"Конкретные приёмы улучшения LCP — готовый список рекомендаций для задачи разработчику."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-crux",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Chrome for Developers",
   "read_before_interview":false,
   "source_ref":"chrome-crux",
   "title":"Chrome UX Report",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/crux",
   "verification_status":"verified",
   "why_read":"Различие полевых и лабораторных данных. Ключевой нюанс в разговоре о скорости."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-lighthouse",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Chrome for Developers",
   "read_before_interview":false,
   "source_ref":"chrome-lighthouse",
   "title":"Lighthouse overview",
   "topic_ids":[
    "performance-cwv",
    "seo-tools"
   ],
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/lighthouse/overview",
   "verification_status":"verified",
   "why_read":"Что такое лабораторный аудит и почему балл 100 не гарантирует хороших полевых метрик."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-psi",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google for Developers",
   "read_before_interview":true,
   "source_ref":"psi-about",
   "title":"About PageSpeed Insights",
   "topic_ids":[
    "performance-cwv"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/speed/docs/insights/v5/about",
   "verification_status":"verified",
   "why_read":"Объясняет, откуда в отчёте два блока данных — самый частый источник путаницы."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-mdn-http-status",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":true,
   "source_ref":"mdn-http-status",
   "title":"HTTP response status codes",
   "topic_ids":[
    "html-http",
    "qa-api-testing",
    "ts-http-api"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
   "verification_status":"verified",
   "why_read":"Справочник кодов ответа. Держать под рукой при разборе выгрузки краулера."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-mdn-redirections",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-redirections",
   "title":"Redirections in HTTP",
   "topic_ids":[
    "html-http"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections",
   "verification_status":"verified",
   "why_read":"Механика редиректов на уровне протокола, включая 307 и 308."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-mdn-headings",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-headings",
   "title":"The HTML Section Heading elements",
   "topic_ids":[
    "html-http",
    "on-page"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements",
   "verification_status":"verified",
   "why_read":"Как правильно строить иерархию заголовков — с точки зрения стандарта, а не SEO-мифов."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-mdn-meta",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-meta-element",
   "title":"The metadata element",
   "topic_ids":[
    "html-http",
    "on-page"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta",
   "verification_status":"verified",
   "why_read":"Справочник по мета-тегам, включая robots и viewport."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-mdn-link",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-link-element",
   "title":"The External Resource Link element",
   "topic_ids":[
    "html-http",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link",
   "verification_status":"verified",
   "why_read":"Синтаксис rel=canonical и rel=alternate hreflang в первоисточнике."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-mdn-semantics",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-semantics",
   "title":"Semantics",
   "topic_ids":[
    "html-http"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Glossary/Semantics",
   "verification_status":"verified",
   "why_read":"Короткое объяснение, зачем нужны семантические теги — вопрос на стыке HTML и SEO."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-sheets-query",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Docs Editors Help",
   "read_before_interview":false,
   "source_ref":"sheets-query-function",
   "title":"QUERY function",
   "topic_ids":[
    "sheets",
    "reporting"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/docs/answer/3093343",
   "verification_status":"verified",
   "why_read":"Самый мощный инструмент обработки выгрузок в Sheets. Одна формула заменяет десяток ручных шагов."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-search-blog",
   "language":"en",
   "last_verified":"2026-07-27",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-search-blog",
   "title":"Google Search Central Blog",
   "topic_ids":[
    "search-basics"
   ],
   "type":"article",
   "url":"https://developers.google.com/search/blog",
   "verification_status":"verified",
   "why_read":"Источник новостей об изменениях алгоритмов. Просмотреть последние записи перед собеседованием — недорогой способ выглядеть в теме."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-systemd-unit",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":true,
   "source_ref":"systemd-unit",
   "title":"systemd.unit(5) — файлы юнитов",
   "topic_ids":[
    "linux-basics"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man5/systemd.unit.5.html",
   "verification_status":"verified",
   "why_read":"Юнит-файл — первое, что вас попросят прочитать и объяснить на позиции с Linux. Нужны хотя бы Type, ExecStart, Restart и EnvironmentFile."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-systemctl-man",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"systemctl-man",
   "title":"systemctl(1) — управление службами",
   "topic_ids":[
    "linux-basics"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/systemctl.1.html",
   "verification_status":"verified",
   "why_read":"Команды, которыми вы будете показывать состояние службы прямо на собеседовании: status, restart, enable, is-active."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-journalctl-man",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":true,
   "source_ref":"journalctl-man",
   "title":"journalctl(1) — чтение журнала",
   "topic_ids":[
    "linux-basics",
    "observability"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/journalctl.1.html",
   "verification_status":"verified",
   "why_read":"Чтение журнала — половина диагностики на Linux. Ключи -u, -n, --since спрашивают часто."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-man-signal",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"man-signal",
   "title":"signal(7) — сигналы",
   "topic_ids":[
    "linux-basics",
    "containers"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man7/signal.7.html",
   "verification_status":"verified",
   "why_read":"Разница между SIGTERM и SIGKILL объясняет, почему контейнер убивают через 10 секунд и почему приложение обязано корректно завершаться."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-man-ps",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"man-ps",
   "title":"ps(1) — процессы в системе",
   "topic_ids":[
    "linux-basics"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/ps.1.html",
   "verification_status":"verified",
   "why_read":"Базовый вопрос «как посмотреть, что съело процессор» решается здесь."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-man-chmod",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"man-chmod",
   "title":"chmod(1) — права доступа",
   "topic_ids":[
    "linux-basics",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/chmod.1.html",
   "verification_status":"verified",
   "why_read":"Права на файлы — источник половины аварий с доступом. Восьмеричная запись должна читаться сходу."
  },
  {
   "difficulty":3,
   "estimated_minutes":60,
   "id":"lib-rfc-9110-http",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"RFC Editor",
   "read_before_interview":false,
   "source_ref":"rfc-9110-http",
   "title":"RFC 9110: HTTP Semantics",
   "topic_ids":[
    "networking"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html",
   "verification_status":"verified",
   "why_read":"Первоисточник по кодам ответа и методам. Читать не целиком: разделы про методы и статусы снимают спор «404 или 410» раз и навсегда."
  },
  {
   "difficulty":3,
   "estimated_minutes":50,
   "id":"lib-rfc-1035-dns",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"RFC Editor",
   "read_before_interview":false,
   "source_ref":"rfc-1035-dns",
   "title":"RFC 1035: Domain Names — Implementation and Specification",
   "topic_ids":[
    "networking"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc1035.html",
   "verification_status":"verified",
   "why_read":"Что такое запись, зона и TTL. Помогает объяснить, почему изменение DNS «не доехало» за минуту."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-cloudflare-dns-intro",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Cloudflare Learning",
   "read_before_interview":true,
   "source_ref":"cloudflare-dns-intro",
   "title":"What is DNS?",
   "topic_ids":[
    "networking",
    "ts-network"
   ],
   "type":"guide",
   "url":"https://www.cloudflare.com/learning/dns/what-is-dns/",
   "verification_status":"verified",
   "why_read":"Понятный разбор пути DNS-запроса. Хватает, чтобы уверенно ответить на вопрос про резолвинг."
  },
  {
   "difficulty":3,
   "estimated_minutes":60,
   "id":"lib-rfc-8446-tls13",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"RFC Editor",
   "read_before_interview":false,
   "source_ref":"rfc-8446-tls13",
   "title":"RFC 8446: TLS 1.3",
   "topic_ids":[
    "networking",
    "security-pipeline"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc8446.html",
   "verification_status":"verified",
   "why_read":"Рукопожатие TLS и версии протокола. Нужен, когда спрашивают про сертификаты и их срок."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-mdn-tls",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"MDN Web Docs",
   "read_before_interview":false,
   "source_ref":"mdn-tls",
   "title":"Transport Layer Security",
   "topic_ids":[
    "networking",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security",
   "verification_status":"verified",
   "why_read":"Короткое объяснение TLS без математики: что защищает, от чего и где живёт сертификат."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-git-branching",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Pro Git",
   "read_before_interview":true,
   "source_ref":"git-branching",
   "title":"Basic Branching and Merging",
   "topic_ids":[
    "git-vcs"
   ],
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
   "verification_status":"verified",
   "why_read":"Ветвление и слияние — база командной работы. Спрашивают почти всегда."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-git-rebase",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Pro Git",
   "read_before_interview":true,
   "source_ref":"git-rebase",
   "title":"Git Branching — Rebasing",
   "topic_ids":[
    "git-vcs"
   ],
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
   "verification_status":"verified",
   "why_read":"Классический вопрос «merge или rebase и почему». Здесь и ответ, и граница применимости."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-git-tag",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Pro Git",
   "read_before_interview":false,
   "source_ref":"git-tag",
   "title":"Git Basics — Tagging",
   "topic_ids":[
    "git-vcs",
    "ci-cd"
   ],
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Basics-Tagging",
   "verification_status":"verified",
   "why_read":"Теги — то, чем помечают релиз. Нужны, когда рассказываете про версионирование сборок."
  },
  {
   "difficulty":2,
   "estimated_minutes":40,
   "id":"lib-dockerfile-reference",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Docker Docs",
   "read_before_interview":true,
   "source_ref":"dockerfile-reference",
   "title":"Dockerfile reference",
   "topic_ids":[
    "containers",
    "images-registry"
   ],
   "type":"official_documentation",
   "url":"https://docs.docker.com/reference/dockerfile/",
   "verification_status":"verified",
   "why_read":"Справочник инструкций Dockerfile. Порядок инструкций напрямую влияет на кэш сборки — об этом спрашивают."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-docker-multistage",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Docker Docs",
   "read_before_interview":true,
   "source_ref":"docker-multistage",
   "title":"Multi-stage builds",
   "topic_ids":[
    "images-registry"
   ],
   "type":"official_documentation",
   "url":"https://docs.docker.com/build/building/multi-stage/",
   "verification_status":"verified",
   "why_read":"Главный ответ на вопрос «как уменьшить образ». Компилируем в одной стадии, копируем в другую."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-docker-build-cache",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Docker Docs",
   "read_before_interview":false,
   "source_ref":"docker-build-cache",
   "title":"Docker build cache",
   "topic_ids":[
    "images-registry",
    "ci-cd"
   ],
   "type":"official_documentation",
   "url":"https://docs.docker.com/build/cache/",
   "verification_status":"verified",
   "why_read":"Почему сборка идёт 12 минут вместо одной. Понимание кэша слоёв заметно отличает кандидата от новичка."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-docker-storage-volumes",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Docker Docs",
   "read_before_interview":false,
   "source_ref":"docker-storage-volumes",
   "title":"Volumes",
   "topic_ids":[
    "containers"
   ],
   "type":"official_documentation",
   "url":"https://docs.docker.com/engine/storage/volumes/",
   "verification_status":"verified",
   "why_read":"Где живут данные, когда контейнер пересоздают. Тома против bind mount."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-docker-networking",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Docker Docs",
   "read_before_interview":false,
   "source_ref":"docker-networking",
   "title":"Network overview",
   "topic_ids":[
    "containers",
    "networking"
   ],
   "type":"official_documentation",
   "url":"https://docs.docker.com/engine/network/",
   "verification_status":"verified",
   "why_read":"Как контейнеры видят друг друга и внешний мир. Нужно для вопросов про проброс портов."
  },
  {
   "difficulty":3,
   "estimated_minutes":40,
   "id":"lib-oci-image-spec",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Open Container Initiative",
   "read_before_interview":false,
   "source_ref":"oci-image-spec",
   "title":"OCI Image Format Specification",
   "topic_ids":[
    "images-registry"
   ],
   "type":"specification",
   "url":"https://github.com/opencontainers/image-spec/blob/main/spec.md",
   "verification_status":"verified",
   "why_read":"Спецификация формата образа: слои, манифест, дайджест. Объясняет, чем тег отличается от дайджеста."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-k8s-pods",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-pods",
   "title":"Pods",
   "topic_ids":[
    "kubernetes"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/pods/",
   "verification_status":"verified",
   "why_read":"Pod — единица запуска. Без чёткого определения дальше разговор не идёт."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-k8s-deployment",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-deployment",
   "title":"Deployments",
   "topic_ids":[
    "kubernetes",
    "deployment-strategies"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
   "verification_status":"verified",
   "why_read":"Deployment и ReplicaSet: как происходит выкат и откат в Kubernetes."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-k8s-service",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-service",
   "title":"Service",
   "topic_ids":[
    "kubernetes",
    "networking"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/services-networking/service/",
   "verification_status":"verified",
   "why_read":"Как трафик попадает в поды и зачем нужен ClusterIP против NodePort и LoadBalancer."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-k8s-probes",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-probes",
   "title":"Configure Liveness, Readiness and Startup Probes",
   "topic_ids":[
    "k8s-operations"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
   "verification_status":"verified",
   "why_read":"liveness против readiness — типовой вопрос. Путаница здесь приводит к выкату, который убивает живой трафик."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-k8s-resources",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-resources",
   "title":"Resource Management for Pods and Containers",
   "topic_ids":[
    "k8s-operations"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
   "verification_status":"verified",
   "why_read":"requests и limits: откуда берётся OOMKilled и почему под не планируется."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-k8s-debug-pods",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-debug-pods",
   "title":"Debug Pods",
   "topic_ids":[
    "k8s-operations"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
   "verification_status":"verified",
   "why_read":"Практический разбор CrashLoopBackOff и Pending. Готовый алгоритм для вопроса «под не поднимается, ваши действия»."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-k8s-configmap",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":false,
   "source_ref":"k8s-configmap",
   "title":"ConfigMaps",
   "topic_ids":[
    "config-secrets"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/configmap/",
   "verification_status":"verified",
   "why_read":"Конфигурация отдельно от образа — требование, которое проверяют почти на каждом интервью."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-k8s-secrets",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":true,
   "source_ref":"k8s-secrets",
   "title":"Secrets",
   "topic_ids":[
    "config-secrets",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/secret/",
   "verification_status":"verified",
   "why_read":"Важная деталь: Secret по умолчанию только закодирован base64, а не зашифрован. Ответ на это отличает внимательного кандидата."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-k8s-hpa",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":false,
   "source_ref":"k8s-hpa",
   "title":"Horizontal Pod Autoscaling",
   "topic_ids":[
    "cost-capacity",
    "kubernetes"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
   "verification_status":"verified",
   "why_read":"Автомасштабирование по метрикам: как и когда добавляются поды."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-k8s-rbac",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Kubernetes Documentation",
   "read_before_interview":false,
   "source_ref":"k8s-rbac",
   "title":"Using RBAC Authorization",
   "topic_ids":[
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
   "verification_status":"verified",
   "why_read":"Права по минимуму в кластере. Пригодится в вопросах про доступы сервисов."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-terraform-state",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"HashiCorp Developer",
   "read_before_interview":true,
   "source_ref":"terraform-state",
   "title":"State",
   "topic_ids":[
    "iac"
   ],
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/language/state",
   "verification_status":"verified",
   "why_read":"Состояние — центральное понятие Terraform и источник большинства аварий: блокировка, дрейф, общий доступ команды."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-terraform-plan",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"HashiCorp Developer",
   "read_before_interview":true,
   "source_ref":"terraform-plan",
   "title":"Command: plan",
   "topic_ids":[
    "iac"
   ],
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/cli/commands/plan",
   "verification_status":"verified",
   "why_read":"Почему сначала plan, потом apply. Отсюда берётся ответ про безопасность изменений."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-terraform-modules",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"HashiCorp Developer",
   "read_before_interview":false,
   "source_ref":"terraform-modules",
   "title":"Modules",
   "topic_ids":[
    "iac"
   ],
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/language/modules",
   "verification_status":"verified",
   "why_read":"Как не копировать один и тот же кусок инфраструктуры между средами."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-terraform-import",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"HashiCorp Developer",
   "read_before_interview":false,
   "source_ref":"terraform-import",
   "title":"Import",
   "topic_ids":[
    "iac"
   ],
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/cli/import",
   "verification_status":"verified",
   "why_read":"Что делать с ресурсами, созданными руками. Частый вопрос про переход к IaC на живой системе."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-github-actions-workflow",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"GitHub Docs",
   "read_before_interview":true,
   "source_ref":"github-actions-workflow",
   "title":"Workflows",
   "topic_ids":[
    "ci-cd"
   ],
   "type":"official_documentation",
   "url":"https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows",
   "verification_status":"verified",
   "why_read":"Устройство конвейера: события, задания, шаги. Даже если у работодателя GitLab, модель та же самая."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-github-actions-secrets",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"GitHub Docs",
   "read_before_interview":true,
   "source_ref":"github-actions-secrets",
   "title":"Use secrets in GitHub Actions",
   "topic_ids":[
    "ci-cd",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets",
   "verification_status":"verified",
   "why_read":"Как секрет попадает в сборку и почему его нельзя печатать в лог."
  },
  {
   "difficulty":2,
   "estimated_minutes":35,
   "id":"lib-gitlab-ci-yaml",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"GitLab Docs",
   "read_before_interview":false,
   "source_ref":"gitlab-ci-yaml",
   "title":"GitLab CI/CD YAML syntax reference",
   "topic_ids":[
    "ci-cd"
   ],
   "type":"official_documentation",
   "url":"https://docs.gitlab.com/ci/yaml/",
   "verification_status":"verified",
   "why_read":"Справочник .gitlab-ci.yml: стадии, артефакты, кэш, правила запуска."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-otel-observability",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OpenTelemetry Documentation",
   "read_before_interview":true,
   "source_ref":"otel-observability",
   "title":"Observability primer",
   "topic_ids":[
    "observability"
   ],
   "type":"official_documentation",
   "url":"https://opentelemetry.io/docs/concepts/observability-primer/",
   "verification_status":"verified",
   "why_read":"Короткое введение в три сигнала. Отсюда берётся внятный ответ на вопрос «чем логи отличаются от метрик»."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-prometheus-metric-types",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Prometheus Documentation",
   "read_before_interview":true,
   "source_ref":"prometheus-metric-types",
   "title":"Metric types",
   "topic_ids":[
    "observability"
   ],
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/concepts/metric_types/",
   "verification_status":"verified",
   "why_read":"Counter, gauge, histogram: какой тип для чего. Путаница здесь видна сразу."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-prometheus-histograms",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Prometheus Documentation",
   "read_before_interview":true,
   "source_ref":"prometheus-histograms",
   "title":"Histograms and summaries",
   "topic_ids":[
    "observability",
    "reliability-slo"
   ],
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/practices/histograms/",
   "verification_status":"verified",
   "why_read":"Почему среднее время ответа врёт и как считать перцентили."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-prometheus-alerting-rules",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Prometheus Documentation",
   "read_before_interview":false,
   "source_ref":"prometheus-alerting-rules",
   "title":"Alerting rules",
   "topic_ids":[
    "observability",
    "incidents"
   ],
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/",
   "verification_status":"verified",
   "why_read":"Как устроено правило алерта и почему важен for: шум будит людей зря."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-otel-traces",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OpenTelemetry Documentation",
   "read_before_interview":false,
   "source_ref":"otel-traces",
   "title":"Traces",
   "topic_ids":[
    "observability"
   ],
   "type":"official_documentation",
   "url":"https://opentelemetry.io/docs/concepts/signals/traces/",
   "verification_status":"verified",
   "why_read":"Трассировки: как найти медленное звено в цепочке сервисов."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-grafana-loki-intro",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Grafana Labs Documentation",
   "read_before_interview":false,
   "source_ref":"grafana-loki-intro",
   "title":"Loki overview",
   "topic_ids":[
    "observability"
   ],
   "type":"official_documentation",
   "url":"https://grafana.com/docs/loki/latest/get-started/overview/",
   "verification_status":"verified",
   "why_read":"Сбор логов без полнотекстового индекса — распространённая связка с Prometheus."
  },
  {
   "difficulty":2,
   "estimated_minutes":40,
   "id":"lib-sre-slo",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE Book",
   "read_before_interview":true,
   "source_ref":"sre-slo",
   "title":"Service Level Objectives",
   "topic_ids":[
    "reliability-slo"
   ],
   "type":"guide",
   "url":"https://sre.google/sre-book/service-level-objectives/",
   "verification_status":"verified",
   "why_read":"SLI, SLO и почему 100% доступности не бывает целью. Первоисточник термина."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-sre-error-budget",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE Workbook",
   "read_before_interview":true,
   "source_ref":"sre-error-budget",
   "title":"Error Budget Policy",
   "topic_ids":[
    "reliability-slo"
   ],
   "type":"guide",
   "url":"https://sre.google/workbook/error-budget-policy/",
   "verification_status":"verified",
   "why_read":"Бюджет ошибок переводит спор «релизить или чинить» в цифры. Сильный ответ на вопрос про баланс скорости и надёжности."
  },
  {
   "difficulty":2,
   "estimated_minutes":35,
   "id":"lib-sre-monitoring",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE Book",
   "read_before_interview":true,
   "source_ref":"sre-monitoring",
   "title":"Monitoring Distributed Systems",
   "topic_ids":[
    "observability",
    "reliability-slo",
    "ts-monitoring"
   ],
   "type":"guide",
   "url":"https://sre.google/sre-book/monitoring-distributed-systems/",
   "verification_status":"verified",
   "why_read":"Четыре золотых сигнала: задержка, трафик, ошибки, насыщение. Готовый каркас ответа."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-sre-postmortem",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE Book",
   "read_before_interview":true,
   "source_ref":"sre-postmortem",
   "title":"Postmortem Culture: Learning from Failure",
   "topic_ids":[
    "incidents",
    "behavioral-devops",
    "ts-rca"
   ],
   "type":"guide",
   "url":"https://sre.google/sre-book/postmortem-culture/",
   "verification_status":"verified",
   "why_read":"Постмортем без поиска виноватых. На вопрос «расскажите про свою аварию» это база."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-sre-oncall",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE Book",
   "read_before_interview":false,
   "source_ref":"sre-oncall",
   "title":"Being On-Call",
   "topic_ids":[
    "incidents",
    "ts-incidents"
   ],
   "type":"guide",
   "url":"https://sre.google/sre-book/being-on-call/",
   "verification_status":"verified",
   "why_read":"Как устроено дежурство: нагрузка, эскалация, что считать нормой."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-martin-fowler-bluegreen",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"martinfowler.com",
   "read_before_interview":true,
   "source_ref":"martin-fowler-bluegreen",
   "title":"BlueGreenDeployment",
   "topic_ids":[
    "deployment-strategies"
   ],
   "type":"guide",
   "url":"https://martinfowler.com/bliki/BlueGreenDeployment.html",
   "verification_status":"verified",
   "why_read":"Blue-green в первоисточнике: две среды, мгновенное переключение и откат."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-martin-fowler-canary",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"martinfowler.com",
   "read_before_interview":true,
   "source_ref":"martin-fowler-canary",
   "title":"CanaryRelease",
   "topic_ids":[
    "deployment-strategies",
    "ts-release"
   ],
   "type":"guide",
   "url":"https://martinfowler.com/bliki/CanaryRelease.html",
   "verification_status":"verified",
   "why_read":"Канареечный выкат: небольшая доля трафика на новую версию до полного перехода."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-twelve-factor-config",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"12factor.net",
   "read_before_interview":true,
   "source_ref":"twelve-factor-config",
   "title":"The Twelve-Factor App: Config",
   "topic_ids":[
    "config-secrets"
   ],
   "type":"guide",
   "url":"https://12factor.net/config",
   "verification_status":"verified",
   "why_read":"Конфигурация в окружении, а не в коде. Короткий текст, который часто цитируют на интервью."
  },
  {
   "difficulty":2,
   "estimated_minutes":40,
   "id":"lib-twelve-factor",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"12factor.net",
   "read_before_interview":false,
   "source_ref":"twelve-factor",
   "title":"The Twelve-Factor App",
   "topic_ids":[
    "config-secrets",
    "containers"
   ],
   "type":"guide",
   "url":"https://12factor.net/",
   "verification_status":"verified",
   "why_read":"Двенадцать принципов приложения, пригодного к эксплуатации. Общий язык с разработчиками."
  },
  {
   "difficulty":3,
   "estimated_minutes":40,
   "id":"lib-owasp-cicd-top10",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP",
   "read_before_interview":false,
   "source_ref":"owasp-cicd-top10",
   "title":"OWASP Top 10 CI/CD Security Risks",
   "topic_ids":[
    "security-pipeline"
   ],
   "type":"guide",
   "url":"https://owasp.org/www-project-top-10-ci-cd-security-risks/",
   "verification_status":"verified",
   "why_read":"Типовые дыры конвейера: от прав на репозиторий до подмены зависимостей."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-owasp-secrets-cheatsheet",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP Cheat Sheet Series",
   "read_before_interview":true,
   "source_ref":"owasp-secrets-cheatsheet",
   "title":"Secrets Management Cheat Sheet",
   "topic_ids":[
    "security-pipeline",
    "config-secrets"
   ],
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
   "verification_status":"verified",
   "why_read":"Что делать с секретами: хранение, ротация, что делать после утечки."
  },
  {
   "difficulty":1,
   "estimated_minutes":5,
   "id":"lib-nist-least-privilege",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"NIST Computer Security Resource Center",
   "read_before_interview":false,
   "source_ref":"nist-least-privilege",
   "title":"Least privilege",
   "topic_ids":[
    "security-pipeline"
   ],
   "type":"specification",
   "url":"https://csrc.nist.gov/glossary/term/least_privilege",
   "verification_status":"verified",
   "why_read":"Формальное определение принципа наименьших привилегий — удобно процитировать."
  },
  {
   "difficulty":2,
   "estimated_minutes":35,
   "id":"lib-postgres-backup",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":true,
   "source_ref":"postgres-backup",
   "title":"Backup and Restore",
   "topic_ids":[
    "databases-ops"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/backup.html",
   "verification_status":"verified",
   "why_read":"Резервные копии и восстановление. Ключевая мысль для интервью: бэкап, который не пробовали восстановить, бэкапом не является."
  },
  {
   "difficulty":3,
   "estimated_minutes":35,
   "id":"lib-postgres-explicit-locking",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":false,
   "source_ref":"postgres-explicit-locking",
   "title":"Explicit Locking",
   "topic_ids":[
    "databases-ops"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/explicit-locking.html",
   "verification_status":"verified",
   "why_read":"Блокировки при миграциях: почему ALTER TABLE может положить продакшен."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-postgres-hot-standby",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":false,
   "source_ref":"postgres-hot-standby",
   "title":"Hot Standby",
   "topic_ids":[
    "databases-ops"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/hot-standby.html",
   "verification_status":"verified",
   "why_read":"Реплики и отставание. Нужно для вопросов про масштабирование чтения."
  },
  {
   "difficulty":2,
   "estimated_minutes":45,
   "id":"lib-bash-manual",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"bash-manual",
   "title":"bash(1) — GNU Bourne-Again Shell",
   "topic_ids":[
    "scripting"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/bash.1.html",
   "verification_status":"verified",
   "why_read":"Справочник Bash. Смотреть точечно: коды возврата, set -e, кавычки, подстановки."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-shellcheck",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"ShellCheck",
   "read_before_interview":false,
   "source_ref":"shellcheck",
   "title":"ShellCheck — статический анализ shell-скриптов",
   "topic_ids":[
    "scripting"
   ],
   "type":"tool",
   "url":"https://www.shellcheck.net/",
   "verification_status":"verified",
   "why_read":"Статический анализатор shell-скриптов. Упоминание его на интервью показывает привычку к безопасным скриптам."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-linux-man-pages",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"linux-man-pages",
   "title":"Linux man-pages",
   "topic_ids":[
    "linux-basics"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/index.html",
   "verification_status":"verified",
   "why_read":"Точка входа во все man-страницы: куда идти за первоисточником вместо случайной статьи."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-systemd-man",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"systemd-man",
   "title":"systemd(1) — система инициализации",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/systemd.1.html",
   "verification_status":"verified",
   "why_read":"Общий обзор systemd: цели, зависимости, порядок запуска."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-systemd-exec",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"systemd-exec",
   "title":"systemd.exec(5) — окружение и песочница службы",
   "topic_ids":[
    "linux-basics",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man5/systemd.exec.5.html",
   "verification_status":"verified",
   "why_read":"Песочница службы: ProtectSystem, ReadWritePaths и почему служба падает с отказом в доступе."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-stripe-payment-intents",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-payment-intents",
   "title":"PaymentIntent lifecycle",
   "topic_ids":[
    "qa-payment-flow"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/payments/paymentintents/lifecycle",
   "verification_status":"verified",
   "why_read":"Жизненный цикл платежа по состояниям: какие переходы возможны, а какие нет. Из этого напрямую вырастает чек-лист проверок."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-adyen-online-payments",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Adyen Docs",
   "read_before_interview":false,
   "source_ref":"adyen-online-payments",
   "title":"Online payments",
   "topic_ids":[
    "qa-payment-flow",
    "qa-payment-methods"
   ],
   "type":"official_documentation",
   "url":"https://docs.adyen.com/online-payments/",
   "verification_status":"verified",
   "why_read":"Второй взгляд на ту же схему у другого провайдера. Полезно увидеть, что общее в устройстве платежа, а что особенность конкретного поставщика."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-qa-stripe-idempotency",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-idempotency",
   "title":"Idempotent requests",
   "topic_ids":[
    "qa-idempotency"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/api/idempotent_requests",
   "verification_status":"verified",
   "why_read":"Ключ идемпотентности в первоисточнике: как повторный запрос возвращает прежний результат вместо второго списания. Спрашивают почти всегда."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-qa-rfc-9110-idempotent",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"RFC Editor",
   "read_before_interview":true,
   "source_ref":"rfc-9110-idempotent",
   "title":"RFC 9110: Idempotent Methods",
   "topic_ids":[
    "qa-idempotency",
    "qa-api-testing"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods",
   "verification_status":"verified",
   "why_read":"Формальное определение идемпотентности метода. Помогает объяснить, почему POST по умолчанию неидемпотентен и что с этим делают."
  },
  {
   "difficulty":3,
   "estimated_minutes":40,
   "id":"lib-qa-rfc-9110-methods",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"RFC Editor",
   "read_before_interview":false,
   "source_ref":"rfc-9110-methods",
   "title":"RFC 9110: Method Definitions",
   "topic_ids":[
    "qa-api-testing"
   ],
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html#name-method-definitions",
   "verification_status":"verified",
   "why_read":"Методы HTTP и их семантика. Нужен, когда спорите, какой код и метод правильны."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-qa-mdn-http-methods",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"MDN Web Docs",
   "read_before_interview":true,
   "source_ref":"mdn-http-methods",
   "title":"HTTP request methods",
   "topic_ids":[
    "qa-api-testing"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
   "verification_status":"verified",
   "why_read":"Быстрая шпаргалка по методам: что безопасно, что идемпотентно, что кэшируется."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-stripe-errors",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-errors",
   "title":"Error handling",
   "topic_ids":[
    "qa-api-testing",
    "qa-integrations"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/error-handling",
   "verification_status":"verified",
   "why_read":"Типы ошибок платёжного API: отказ карты, ошибка запроса, сбой на стороне сети. Разные типы требуют разного поведения приложения."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-stripe-webhooks",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-webhooks",
   "title":"Webhooks",
   "topic_ids":[
    "qa-webhooks",
    "ts-integrations"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/webhooks",
   "verification_status":"verified",
   "why_read":"Вебхуки: доставка не гарантирует порядок и может повториться. Ключевая мысль для тестирования асинхронных сценариев."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-adyen-webhooks",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Adyen Docs",
   "read_before_interview":false,
   "source_ref":"adyen-webhooks",
   "title":"Webhooks",
   "topic_ids":[
    "qa-webhooks"
   ],
   "type":"official_documentation",
   "url":"https://docs.adyen.com/development-resources/webhooks/",
   "verification_status":"verified",
   "why_read":"Тот же механизм у другого провайдера: подтверждение приёма, повторные попытки."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-qa-adyen-webhook-types",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Adyen Docs",
   "read_before_interview":false,
   "source_ref":"adyen-webhook-types",
   "title":"Webhook types",
   "topic_ids":[
    "qa-webhooks"
   ],
   "type":"official_documentation",
   "url":"https://docs.adyen.com/development-resources/webhooks/webhook-types/",
   "verification_status":"verified",
   "why_read":"Перечень событий, которые приходят по вебхукам. Готовая основа для чек-листа асинхронных сценариев."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-qa-paypal-webhooks",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PayPal Developer",
   "read_before_interview":false,
   "source_ref":"paypal-webhooks",
   "title":"Webhooks",
   "topic_ids":[
    "qa-webhooks"
   ],
   "type":"official_documentation",
   "url":"https://developer.paypal.com/api/rest/webhooks/",
   "verification_status":"verified",
   "why_read":"Третий взгляд на вебхуки. Полезен, чтобы отделить общее от частного."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-stripe-refunds",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-refunds",
   "title":"Refunds",
   "topic_ids":[
    "qa-refunds"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/refunds",
   "verification_status":"verified",
   "why_read":"Возвраты: полный и частичный, сроки, состояния. Разбор того, чем возврат отличается от отмены до списания."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-qa-stripe-disputes",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-disputes",
   "title":"Disputes and fraud",
   "topic_ids":[
    "qa-refunds"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/disputes",
   "verification_status":"verified",
   "why_read":"Спор и чарджбэк: как это выглядит со стороны продавца и какие есть сроки. Вопрос про разницу возврата и чарджбэка задают часто."
  },
  {
   "difficulty":3,
   "estimated_minutes":25,
   "id":"lib-qa-adyen-disputes",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Adyen Docs",
   "read_before_interview":false,
   "source_ref":"adyen-disputes",
   "title":"Disputes API",
   "topic_ids":[
    "qa-refunds"
   ],
   "type":"official_documentation",
   "url":"https://docs.adyen.com/risk-management/disputes-api/",
   "verification_status":"verified",
   "why_read":"Работа со спорами через API: стадии, документы, сроки ответа."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-stripe-3ds",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-3ds",
   "title":"3D Secure authentication",
   "topic_ids":[
    "qa-3ds-auth"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/payments/3d-secure",
   "verification_status":"verified",
   "why_read":"3-D Secure: когда запускается, что происходит при отказе и как это влияет на ответственность за мошенническую операцию."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-qa-emvco-3ds",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"EMVCo",
   "read_before_interview":false,
   "source_ref":"emvco-3ds",
   "title":"EMV 3-D Secure",
   "topic_ids":[
    "qa-3ds-auth"
   ],
   "type":"specification",
   "url":"https://www.emvco.com/emv-technologies/3-d-secure/",
   "verification_status":"verified",
   "why_read":"Первоисточник стандарта. Нужен, чтобы говорить о 3-D Secure точно, а не по слухам."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-qa-stripe-testing",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-testing",
   "title":"Testing",
   "topic_ids":[
    "qa-integrations"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/testing",
   "verification_status":"verified",
   "why_read":"Тестовые карты и сценарии: как воспроизвести отказ, требование аутентификации, недостаток средств. Это ежедневный инструмент тестировщика платежей."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-qa-stripe-currencies",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-currencies",
   "title":"Supported currencies",
   "topic_ids":[
    "qa-money-precision"
   ],
   "type":"official_documentation",
   "url":"https://docs.stripe.com/currencies",
   "verification_status":"verified",
   "why_read":"Минорные единицы и валюты без дробной части. Отсюда классическая ошибка: сумма в 100 единиц означает разное в разных валютах."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-qa-iso-4217-registry",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"SIX Group",
   "read_before_interview":false,
   "source_ref":"iso-4217-registry",
   "title":"ISO 4217 Currency Codes — реестр",
   "topic_ids":[
    "qa-money-precision"
   ],
   "type":"specification",
   "url":"https://www.six-group.com/en/products-services/financial-information/data-standards.html",
   "verification_status":"verified",
   "why_read":"Реестр валютных кодов и числа знаков после запятой — то, на что опираются платёжные системы."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-postgres-numeric",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":true,
   "source_ref":"postgres-numeric",
   "title":"Numeric Types",
   "topic_ids":[
    "qa-money-precision",
    "qa-sql-data"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/datatype-numeric.html",
   "verification_status":"verified",
   "why_read":"Почему деньги хранят в точных типах, а не в числах с плавающей точкой."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-qa-mdn-numbers-floats",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"MDN Web Docs",
   "read_before_interview":true,
   "source_ref":"mdn-numbers-floats",
   "title":"Numbers and strings",
   "topic_ids":[
    "qa-money-precision"
   ],
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_strings",
   "verification_status":"verified",
   "why_read":"Наглядно про то, откуда берётся 0,1 + 0,2 ≠ 0,3 и почему это проблема для сумм."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-pci-dss-standards",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PCI Security Standards Council",
   "read_before_interview":true,
   "source_ref":"pci-dss-standards",
   "title":"PCI DSS",
   "topic_ids":[
    "qa-card-security"
   ],
   "type":"specification",
   "url":"https://www.pcisecuritystandards.org/standards/pci-dss/",
   "verification_status":"verified",
   "why_read":"Что вообще требует стандарт по данным карт. Тестировщику важна применимая часть: что нельзя хранить и что нельзя показывать."
  },
  {
   "difficulty":3,
   "estimated_minutes":20,
   "id":"lib-qa-pci-ssc-documents",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PCI Security Standards Council",
   "read_before_interview":false,
   "source_ref":"pci-ssc-documents",
   "title":"PCI SSC Document Library",
   "topic_ids":[
    "qa-card-security"
   ],
   "type":"specification",
   "url":"https://www.pcisecuritystandards.org/document_library/",
   "verification_status":"verified",
   "why_read":"Библиотека документов совета: куда идти за точной формулировкой требования."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-owasp-logging-cheatsheet",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP Cheat Sheet Series",
   "read_before_interview":true,
   "source_ref":"owasp-logging-cheatsheet",
   "title":"Logging Cheat Sheet",
   "topic_ids":[
    "qa-card-security",
    "qa-logs-incidents"
   ],
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
   "verification_status":"verified",
   "why_read":"Что нельзя писать в логи. Для платежей это номер карты, код проверки и токены."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-owasp-input-validation",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP Cheat Sheet Series",
   "read_before_interview":false,
   "source_ref":"owasp-input-validation",
   "title":"Input Validation Cheat Sheet",
   "topic_ids":[
    "qa-test-design",
    "qa-api-testing"
   ],
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
   "verification_status":"verified",
   "why_read":"Проверка ввода: готовый список того, что стоит попробовать в полях формы оплаты."
  },
  {
   "difficulty":3,
   "estimated_minutes":45,
   "id":"lib-qa-owasp-testing-guide",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP",
   "read_before_interview":false,
   "source_ref":"owasp-testing-guide",
   "title":"Web Security Testing Guide",
   "topic_ids":[
    "qa-card-security",
    "qa-api-testing"
   ],
   "type":"guide",
   "url":"https://owasp.org/www-project-web-security-testing-guide/",
   "verification_status":"verified",
   "why_read":"Подробное руководство по проверке безопасности. Читать выборочно под свои сценарии."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-owasp-top-ten",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OWASP",
   "read_before_interview":false,
   "source_ref":"owasp-top-ten",
   "title":"OWASP Top 10",
   "topic_ids":[
    "qa-card-security"
   ],
   "type":"guide",
   "url":"https://owasp.org/www-project-top-ten/",
   "verification_status":"verified",
   "why_read":"Основные классы уязвимостей. Нужен, чтобы понимать, о чём вас спросят из безопасности на позиции с платежами."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-qa-istqb-glossary",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"ISTQB",
   "read_before_interview":true,
   "source_ref":"istqb-glossary",
   "title":"ISTQB Glossary",
   "topic_ids":[
    "qa-testing-basics",
    "qa-test-design"
   ],
   "type":"official_documentation",
   "url":"https://glossary.istqb.org/",
   "verification_status":"verified",
   "why_read":"Словарь терминов тестирования. Полезен, чтобы называть вещи так же, как их называет интервьюер."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-martin-fowler-test-pyramid",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"martinfowler.com",
   "read_before_interview":true,
   "source_ref":"martin-fowler-test-pyramid",
   "title":"The Practical Test Pyramid",
   "topic_ids":[
    "qa-automation"
   ],
   "type":"guide",
   "url":"https://martinfowler.com/articles/practical-test-pyramid.html",
   "verification_status":"verified",
   "why_read":"Пирамида тестов: почему модульных тестов много, а сквозных мало. Классический вопрос про стратегию автоматизации."
  },
  {
   "difficulty":3,
   "estimated_minutes":30,
   "id":"lib-qa-martin-fowler-flaky",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"martinfowler.com",
   "read_before_interview":true,
   "source_ref":"martin-fowler-flaky",
   "title":"Eradicating Non-Determinism in Tests",
   "topic_ids":[
    "qa-automation",
    "qa-regression-release"
   ],
   "type":"guide",
   "url":"https://martinfowler.com/articles/nonDeterminism.html",
   "verification_status":"verified",
   "why_read":"Нестабильные тесты и что с ними делать. Ответ «перезапустить» считается слабым."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-qa-google-test-sizes",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google Testing Blog",
   "read_before_interview":false,
   "source_ref":"google-test-sizes",
   "title":"Test Sizes",
   "topic_ids":[
    "qa-automation"
   ],
   "type":"guide",
   "url":"https://testing.googleblog.com/2010/12/test-sizes.html",
   "verification_status":"verified",
   "why_read":"Размеры тестов вместо споров о названиях. Удобная рамка для ответа про уровни."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-qa-playwright-docs",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Playwright",
   "read_before_interview":false,
   "source_ref":"playwright-docs",
   "title":"Playwright — Getting started",
   "topic_ids":[
    "qa-automation"
   ],
   "type":"tool_documentation",
   "url":"https://playwright.dev/docs/intro",
   "verification_status":"verified",
   "why_read":"Современный инструмент сквозных тестов. Достаточно понимать модель работы."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-qa-postman-docs",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Postman Learning Center",
   "read_before_interview":true,
   "source_ref":"postman-docs",
   "title":"Postman — Overview",
   "topic_ids":[
    "qa-api-testing",
    "ts-tools",
    "ts-http-api"
   ],
   "type":"tool_documentation",
   "url":"https://learning.postman.com/docs/getting-started/overview/",
   "verification_status":"verified",
   "why_read":"Базовый инструмент ручного тестирования API. На интервью просят показать, как вы проверяете запрос."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-charles-proxy",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Charles",
   "read_before_interview":false,
   "source_ref":"charles-proxy",
   "title":"Charles Proxy Documentation",
   "topic_ids":[
    "qa-api-testing",
    "qa-logs-incidents"
   ],
   "type":"tool_documentation",
   "url":"https://www.charlesproxy.com/documentation/",
   "verification_status":"verified",
   "why_read":"Перехват трафика: как посмотреть, что реально уходит от мобильного клиента."
  },
  {
   "difficulty":3,
   "estimated_minutes":35,
   "id":"lib-qa-openapi-spec",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"OpenAPI Initiative",
   "read_before_interview":false,
   "source_ref":"openapi-spec",
   "title":"OpenAPI Specification",
   "topic_ids":[
    "qa-api-testing"
   ],
   "type":"specification",
   "url":"https://spec.openapis.org/oas/latest.html",
   "verification_status":"verified",
   "why_read":"Формат описания API. Нужен, чтобы проверять соответствие ответа контракту."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-json-schema",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"JSON Schema",
   "read_before_interview":false,
   "source_ref":"json-schema",
   "title":"Understanding JSON Schema",
   "topic_ids":[
    "qa-api-testing"
   ],
   "type":"specification",
   "url":"https://json-schema.org/understanding-json-schema/reference",
   "verification_status":"verified",
   "why_read":"Проверка структуры ответа схемой вместо сравнения глазами."
  },
  {
   "difficulty":1,
   "estimated_minutes":30,
   "id":"lib-qa-postgres-sql-select",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":true,
   "source_ref":"postgres-sql-select",
   "title":"SELECT",
   "topic_ids":[
    "qa-sql-data",
    "ts-sql"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/sql-select.html",
   "verification_status":"verified",
   "why_read":"Выборки для проверки данных после операции. Базовый навык на любой позиции QA."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-qa-postgres-transactions",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL Documentation",
   "read_before_interview":true,
   "source_ref":"postgres-transactions",
   "title":"Transactions",
   "topic_ids":[
    "qa-sql-data",
    "qa-payment-flow"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/tutorial-transactions.html",
   "verification_status":"verified",
   "why_read":"Транзакции: почему платёж либо целиком применяется, либо целиком откатывается."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-mozilla-bug-writing",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Mozilla",
   "read_before_interview":true,
   "source_ref":"mozilla-bug-writing",
   "title":"Bug Writing Guidelines",
   "topic_ids":[
    "qa-test-docs"
   ],
   "type":"guide",
   "url":"https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html",
   "verification_status":"verified",
   "why_read":"Разбор того, что делает баг-репорт воспроизводимым: шаги, а не выводы. Классика, на которую ссылаются до сих пор."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-stripe-payout-reconciliation",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":true,
   "source_ref":"stripe-payout-reconciliation",
   "title":"Payout reconciliation",
   "topic_ids":[
    "qa-reconciliation"
   ],
   "type":"documentation",
   "url":"https://docs.stripe.com/payouts/reconciliation",
   "verification_status":"verified",
   "why_read":"Показывает, из чего складывается выплата магазину и как сопоставить её с операциями — база для разговора о сверке."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-stripe-payments-analytics",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Stripe Docs",
   "read_before_interview":false,
   "source_ref":"stripe-payments-analytics",
   "title":"Payments analytics",
   "topic_ids":[
    "qa-metrics"
   ],
   "type":"documentation",
   "url":"https://docs.stripe.com/payments/analytics",
   "verification_status":"verified",
   "why_read":"Какие метрики платежей смотрят на практике: доля успешных, причины отказов, влияние аутентификации, споры."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-links-crawlable",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-links-crawlable",
   "title":"Make your links crawlable",
   "topic_ids":[
    "internal-linking",
    "technical-seo",
    "off-page-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
   "verification_status":"verified",
   "why_read":"Отвечает на вопрос, который спрашивают почти всегда: какую ссылку робот вообще считает ссылкой. Здесь же — почему кнопка с обработчиком клика ссылкой не является."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-qualify-links",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-qualify-links",
   "title":"Qualify your outbound links to Google",
   "topic_ids":[
    "internal-linking",
    "on-page",
    "off-page-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
   "verification_status":"verified",
   "why_read":"Три значения rel — nofollow, sponsored, ugc — и что Google с ними делает сейчас, а не десять лет назад. Частый вопрос про рекламные и пользовательские ссылки."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-breadcrumb-structured-data",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google Search Central",
   "read_before_interview":false,
   "source_ref":"google-breadcrumb-structured-data",
   "title":"Breadcrumb structured data",
   "topic_ids":[
    "internal-linking",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
   "verification_status":"verified",
   "why_read":"Хлебные крошки — самый дешёвый способ показать поиску структуру сайта. Разметка простая, а в выдаче видна сразу."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-user-stories",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":false,
   "source_ref":"atlassian-user-stories",
   "title":"User stories with examples and a template",
   "topic_ids":[
    "dev-communication",
    "qa-test-docs",
    "ts-knowledge"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/agile/project-management/user-stories",
   "verification_status":"verified",
   "why_read":"Формат задачи, который разработчик берёт в спринт без переспрашивания: кто, что и зачем плюс критерии приёмки. То же самое спрашивают на собеседовании про работу с командой."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-gitlab-communication",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"GitLab",
   "read_before_interview":false,
   "source_ref":"gitlab-communication",
   "title":"GitLab Communication handbook",
   "topic_ids":[
    "dev-communication",
    "behavioral",
    "behavioral-devops",
    "ts-communication"
   ],
   "type":"guide",
   "url":"https://handbook.gitlab.com/handbook/communication/",
   "verification_status":"verified",
   "why_read":"Как устроено общение в распределённой команде: письменно, асинхронно, с фиксацией решений. Полезно, когда на собеседовании спрашивают про удалённую работу и договорённости."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-bug-reports",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Simon Tatham",
   "read_before_interview":true,
   "source_ref":"sgtatham-bug-reports",
   "title":"How to Report Bugs Effectively",
   "topic_ids":[
    "qa-behavioral",
    "qa-test-docs",
    "dev-communication",
    "ts-reproduce",
    "ts-communication"
   ],
   "type":"guide",
   "url":"https://www.chiark.greenend.org.uk/~sgtatham/bugs.html",
   "verification_status":"verified",
   "why_read":"Классический текст о том, почему баг-репорт — это факты и шаги, а не выводы и эмоции. Прямо ложится на вопрос «как вы сообщаете о найденной проблеме»."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-structured-interviewing",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google re:Work",
   "read_before_interview":true,
   "source_ref":"rework-structured-interviewing",
   "title":"Guide: Use structured interviewing",
   "topic_ids":[
    "interview-seo",
    "behavioral",
    "qa-behavioral",
    "behavioral-devops",
    "ts-behavioral"
   ],
   "type":"guide",
   "url":"https://rework.withgoogle.com/guides/hiring-use-structured-interviewing/steps/introduction/",
   "verification_status":"verified",
   "why_read":"Взгляд с другой стороны стола: как компании строят интервью и по какой шкале оценивают ответы. Понимая шкалу, легче говорить то, что действительно засчитывается."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-amazon-leadership-principles",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Amazon",
   "read_before_interview":false,
   "source_ref":"amazon-leadership-principles",
   "title":"Amazon Leadership Principles",
   "topic_ids":[
    "behavioral",
    "qa-behavioral",
    "behavioral-devops",
    "ts-behavioral"
   ],
   "type":"documentation",
   "url":"https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
   "verification_status":"verified",
   "why_read":"Список принципов, по которым в крупных компаниях разбирают поведенческие ответы. Даже если вы идёте не в Amazon, формулировки историй по этим принципам сильнее обычных."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-blameless-postmortem",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":true,
   "source_ref":"atlassian-blameless-postmortem",
   "title":"Blameless postmortems: how to run them",
   "topic_ids":[
    "behavioral-devops",
    "incidents",
    "ts-incidents"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/postmortem/blameless",
   "verification_status":"verified",
   "why_read":"Практическая инструкция к разбору без поиска виноватых. На собеседовании про инциденты именно это отличает зрелый ответ от рассказа «кто нажал не туда»."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-aws-what-is-cloud",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Amazon Web Services",
   "read_before_interview":true,
   "source_ref":"aws-what-is-cloud-computing",
   "title":"What is cloud computing?",
   "topic_ids":[
    "cloud-basics"
   ],
   "type":"official_documentation",
   "url":"https://aws.amazon.com/what-is-cloud-computing/",
   "verification_status":"verified",
   "why_read":"База: модели обслуживания и развёртывания своими словами, без маркетинга. С неё удобно начинать, если облако для вас пока набор слов."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-azure-shared-responsibility",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Microsoft Learn",
   "read_before_interview":true,
   "source_ref":"azure-shared-responsibility",
   "title":"Shared responsibility in the cloud",
   "topic_ids":[
    "cloud-basics",
    "security-pipeline"
   ],
   "type":"official_documentation",
   "url":"https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility",
   "verification_status":"verified",
   "why_read":"Кто за что отвечает — провайдер или вы. Вопрос «а кто отвечает за резервные копии в облаке» задают часто, и ошибка здесь стоит дорого не только на собеседовании."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-gcp-what-is-cloud",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google Cloud",
   "read_before_interview":false,
   "source_ref":"gcp-what-is-cloud-computing",
   "title":"What is cloud computing? (Google Cloud)",
   "topic_ids":[
    "cloud-basics"
   ],
   "type":"official_documentation",
   "url":"https://cloud.google.com/learn/what-is-cloud-computing",
   "verification_status":"verified",
   "why_read":"Второй взгляд на ту же базу: полезно увидеть, что модели одинаковы, а названия сервисов у провайдеров разные."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-ts-slas",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":true,
   "source_ref":"atlassian-slas",
   "title":"SLAs: what they are and how to use them",
   "topic_ids":[
    "ts-support-role",
    "ts-ticket-flow",
    "ts-metrics"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/itsm/service-request-management/slas",
   "verification_status":"verified",
   "why_read":"Разбирает, из чего состоит обещание по времени и почему реакция и решение считаются отдельно. Ровно то, что спрашивают в первые минуты собеседования."
  },
  {
   "difficulty":2,
   "estimated_minutes":60,
   "id":"lib-ts-incident-handbook",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":true,
   "source_ref":"atlassian-incident-handbook",
   "title":"Incident management handbook",
   "topic_ids":[
    "ts-incidents",
    "ts-support-role"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/handbook",
   "verification_status":"verified",
   "why_read":"Готовый процесс инцидента: роли, пороги, хронология, коммуникация. Читать по диагонали, но знать структуру наизусть."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-ts-incident-communication",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":true,
   "source_ref":"atlassian-incident-communication",
   "title":"Incident communication best practices",
   "topic_ids":[
    "ts-communication",
    "ts-incidents"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/incident-communication",
   "verification_status":"verified",
   "why_read":"Шаблоны сообщений во время сбоя: что писать в первые пять минут и как обещать следующее обновление. Половина работы поддержки в инциденте — это текст."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-ts-knowledge-management",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":false,
   "source_ref":"atlassian-knowledge-management",
   "title":"Knowledge management in ITSM",
   "topic_ids":[
    "ts-knowledge"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/itsm/knowledge-management",
   "verification_status":"verified",
   "why_read":"Почему база знаний окупается и как не превратить её в кладбище устаревших статей."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-ts-5-whys",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Atlassian",
   "read_before_interview":false,
   "source_ref":"atlassian-5-whys",
   "title":"5 Whys play",
   "topic_ids":[
    "ts-rca"
   ],
   "type":"guide",
   "url":"https://www.atlassian.com/team-playbook/plays/5-whys",
   "verification_status":"verified",
   "why_read":"Короткая инструкция к методу поиска причины, с примером и с предупреждением о догадках вместо данных."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-ts-devtools-network",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Chrome for Developers",
   "read_before_interview":true,
   "source_ref":"chrome-devtools-network",
   "title":"Inspect network activity",
   "topic_ids":[
    "ts-devtools",
    "ts-reproduce"
   ],
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/devtools/network",
   "verification_status":"verified",
   "why_read":"Официальное руководство по вкладке «Сеть»: фильтры, тайминги и сохранение HAR. Это инструмент номер один, когда проблема видна только у клиента."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-ts-curl-manual",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"curl",
   "read_before_interview":false,
   "source_ref":"curl-manual",
   "title":"curl manual",
   "topic_ids":[
    "ts-http-api",
    "ts-tools"
   ],
   "type":"tool_documentation",
   "url":"https://curl.se/docs/manual.html",
   "verification_status":"verified",
   "why_read":"Как повторить запрос клиента руками: методы, заголовки, тело, вывод заголовков ответа. Читать выборочно, но уметь собрать запрос с нуля."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-ts-elastic-discover",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Elastic",
   "read_before_interview":true,
   "source_ref":"elastic-discover",
   "title":"Discover: explore your data",
   "topic_ids":[
    "ts-logs",
    "ts-tools"
   ],
   "type":"official_documentation",
   "url":"https://www.elastic.co/docs/explore-analyze/discover",
   "verification_status":"verified",
   "why_read":"Как искать в логах осмысленно: фильтры по полям, временное окно, сохранённые запросы. Названия систем разные, приёмы одинаковые."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-ts-tls-concepts",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Cloudflare",
   "read_before_interview":false,
   "source_ref":"cloudflare-ssl-concepts",
   "title":"SSL/TLS concepts",
   "topic_ids":[
    "ts-network"
   ],
   "type":"official_documentation",
   "url":"https://developers.cloudflare.com/ssl/concepts/",
   "verification_status":"verified",
   "why_read":"Что проверяет браузер в сертификате и почему ошибка бывает у всех сразу. Помогает не путать просроченный сертификат с недоступностью сервиса."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-ts-cert-expiration",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Let's Encrypt",
   "read_before_interview":false,
   "source_ref":"letsencrypt-expiration",
   "title":"Expiration emails and certificate lifetime",
   "topic_ids":[
    "ts-network",
    "ts-incidents"
   ],
   "type":"official_documentation",
   "url":"https://letsencrypt.org/docs/expiration-emails/",
   "verification_status":"verified",
   "why_read":"Короткая заметка о сроке жизни сертификата: половина внезапных «сайт недоступен» — это он."
  },
  {
   "difficulty":3,
   "estimated_minutes":45,
   "id":"lib-ts-feature-toggles",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Martin Fowler",
   "read_before_interview":false,
   "source_ref":"martin-fowler-feature-toggles",
   "title":"Feature Toggles (aka Feature Flags)",
   "topic_ids":[
    "ts-release"
   ],
   "type":"guide",
   "url":"https://martinfowler.com/articles/feature-toggles.html",
   "verification_status":"verified",
   "why_read":"Объясняет, почему у одних клиентов новая функция, а у других старая при одной и той же версии. Читать первую половину."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-ts-gdpr-overview",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Microsoft Learn",
   "read_before_interview":false,
   "source_ref":"microsoft-gdpr",
   "title":"GDPR overview for organisations",
   "topic_ids":[
    "ts-privacy"
   ],
   "type":"official_documentation",
   "url":"https://learn.microsoft.com/en-us/compliance/regulatory/gdpr",
   "verification_status":"verified",
   "why_read":"Зачем поддержке правила о персональных данных и что значит минимально необходимый доступ. Не юридический разбор, а рабочие рамки."
  },
  {
   "difficulty":3,
   "estimated_minutes":40,
   "id":"lib-ts-managing-incidents",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"Google SRE",
   "read_before_interview":true,
   "source_ref":"sre-managing-incidents",
   "title":"Managing Incidents",
   "topic_ids":[
    "ts-incidents",
    "ts-rca"
   ],
   "type":"guide",
   "url":"https://sre.google/sre-book/managing-incidents/",
   "verification_status":"verified",
   "why_read":"Классическая глава о ролях в инциденте: кто чинит, кто координирует, кто говорит наружу. Отвечает на вопрос, зачем нужен отдельный координатор."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-ts-postgres-limit",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"PostgreSQL",
   "read_before_interview":false,
   "source_ref":"postgres-limit",
   "title":"LIMIT and OFFSET",
   "topic_ids":[
    "ts-sql"
   ],
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/queries-limit.html",
   "verification_status":"verified",
   "why_read":"Две страницы про ограничение выборки. Правило «любой запрос к боевой базе с LIMIT» начинается отсюда."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-ts-grep",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"man-grep",
   "title":"grep(1) manual page",
   "topic_ids":[
    "ts-linux",
    "ts-logs"
   ],
   "type":"documentation",
   "url":"https://man7.org/linux/man-pages/man1/grep.1.html",
   "verification_status":"verified",
   "why_read":"Поиск по файлам и логам: контекст вокруг совпадения, регистронезависимость, инверсия. Три флага закрывают почти все задачи поддержки."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-ts-df",
   "language":"en",
   "last_verified":"2026-07-28",
   "publisher":"man7.org",
   "read_before_interview":false,
   "source_ref":"man-df",
   "title":"df(1) manual page",
   "topic_ids":[
    "ts-linux"
   ],
   "type":"documentation",
   "url":"https://man7.org/linux/man-pages/man1/df.1.html",
   "verification_status":"verified",
   "why_read":"Переполненный диск выглядит как случайные ошибки в самых разных местах. Проверка занимает одну команду."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-overapi-linux",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-linux",
   "title":"Linux Cheat Sheet",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/linux",
   "verification_status":"verified",
   "why_read":"Все базовые команды Linux на одной странице: файлы, права, процессы, поиск, перенаправление ввода-вывода. Открыть за день до собеседования и пробежать глазами вместо перечитывания учебника."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-overapi-git",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-git",
   "title":"Git Cheat Sheet",
   "topic_ids":[
    "git-vcs"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/git",
   "verification_status":"verified",
   "why_read":"Сводка команд Git по сценариям: ветки, слияния, откат изменений, работа с удалённым репозиторием. Удобна, чтобы быстро восстановить в памяти редкие команды перед техническим интервью."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-overapi-docker",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-docker",
   "title":"Docker Cheat Sheet",
   "topic_ids":[
    "containers",
    "images-registry"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/docker",
   "verification_status":"verified",
   "why_read":"Команды Docker одной страницей: жизненный цикл контейнера, образы, тома, сети. Помогает отвечать на вопросы «какой командой вы бы…» без запинки."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-overapi-mysql",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-mysql",
   "title":"MySQL Cheat Sheet",
   "topic_ids":[
    "qa-sql-data",
    "ts-sql",
    "databases-ops"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/mysql",
   "verification_status":"verified",
   "why_read":"Полный справочник SQL-синтаксиса MySQL: SELECT и JOIN, агрегаты, работа со строками и датами. Пригодится перед практической частью с запросами к данным."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-overapi-regex",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-regex",
   "title":"Regular Expressions Cheat Sheet",
   "topic_ids":[
    "scripting",
    "qa-automation",
    "ts-logs",
    "seo-tools"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/regex",
   "verification_status":"verified",
   "why_read":"Синтаксис регулярных выражений одной страницей: классы символов, квантификаторы, группы, якоря. Регулярки нужны везде — от grep по логам до фильтров в Search Console."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-overapi-python",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-python",
   "title":"Python Cheat Sheet",
   "topic_ids":[
    "scripting",
    "qa-automation"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/python",
   "verification_status":"verified",
   "why_read":"Справочник стандартной библиотеки Python: строки, списки, словари, файлы, встроенные функции. Быстрое повторение синтаксиса перед задачей на скрипт."
  },
  {
   "difficulty":1,
   "estimated_minutes":20,
   "id":"lib-overapi-html",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-html",
   "title":"HTML Cheat Sheet",
   "topic_ids":[
    "html-http",
    "on-page"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/html",
   "verification_status":"verified",
   "why_read":"Все теги HTML со сжатым описанием и атрибутами. Для SEO-собеседования достаточно уверенно ориентироваться в семантике — эта страница закрывает вопрос повторения."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-overapi-css",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-css",
   "title":"CSS Cheat Sheet",
   "topic_ids":[
    "html-http",
    "performance-cwv"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/css",
   "verification_status":"verified",
   "why_read":"Свойства CSS одной страницей: селекторы, box model, типографика, позиционирование. Помогает понимать разговоры о render-blocking стилях и устройстве страницы."
  },
  {
   "difficulty":2,
   "estimated_minutes":30,
   "id":"lib-overapi-javascript",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-javascript",
   "title":"JavaScript Cheat Sheet",
   "topic_ids":[
    "technical-seo",
    "ts-devtools"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/javascript",
   "verification_status":"verified",
   "why_read":"Справочник JavaScript: объекты, массивы, строки, DOM, события. Полезен, чтобы понимать, что именно делает скрипт на странице, — от JS-рендеринга в SEO до отладки в DevTools."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-overapi-mod-rewrite",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverAPI.com",
   "read_before_interview":false,
   "source_ref":"overapi-mod-rewrite",
   "title":"mod_rewrite Cheat Sheet",
   "topic_ids":[
    "technical-seo"
   ],
   "type":"cheatsheet",
   "url":"https://overapi.com/mod_rewrite",
   "verification_status":"verified",
   "why_read":"Флаги и переменные mod_rewrite одной страницей: как читать и писать правила редиректов в .htaccess. Частая практическая задача SEO-специалиста при переездах сайта."
  },
  {
   "difficulty":2,
   "estimated_minutes":120,
   "id":"lib-ubuntu-server-docs",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"Canonical",
   "read_before_interview":false,
   "source_ref":"ubuntu-server-docs",
   "title":"Ubuntu Server documentation",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"official_documentation",
   "url":"https://ubuntu.com/server/docs/",
   "verification_status":"verified",
   "why_read":"Официальная документация самого распространённого серверного дистрибутива: пакеты, службы, сеть, обновления. Отвечает на вопросы «а как это устроено именно в Ubuntu», на которых сыпятся общие ответы."
  },
  {
   "difficulty":1,
   "estimated_minutes":45,
   "id":"lib-ubuntu-cli-tutorial",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"Canonical",
   "read_before_interview":false,
   "source_ref":"ubuntu-cli-tutorial",
   "title":"The Linux command line for beginners",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"guide",
   "url":"https://ubuntu.com/tutorials/command-line-for-beginners",
   "verification_status":"verified",
   "why_read":"Вводный курс Canonical по командной строке: файлы, каталоги, права, sudo. Быстрый способ закрыть пробелы в самых основах перед собеседованием."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-tldr-pages",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"tldr-pages community",
   "read_before_interview":false,
   "source_ref":"tldr-pages",
   "title":"tldr pages",
   "topic_ids":[
    "linux-basics",
    "ts-linux",
    "scripting"
   ],
   "type":"tool",
   "url":"https://tldr.sh/",
   "verification_status":"verified",
   "why_read":"Краткие примеры вместо длинных man-страниц: для каждой команды — пять типовых вызовов, которыми реально пользуются. Идеально для повторения команд накануне интервью."
  },
  {
   "difficulty":1,
   "estimated_minutes":10,
   "id":"lib-explainshell",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"explainshell.com",
   "read_before_interview":false,
   "source_ref":"explainshell",
   "title":"explainshell",
   "topic_ids":[
    "scripting",
    "ts-linux"
   ],
   "type":"tool",
   "url":"https://explainshell.com/",
   "verification_status":"verified",
   "why_read":"Вставляете команду целиком — сервис разбирает каждый флаг по man-страницам. Лучший способ понять чужой однострочник и проверить свой перед запуском."
  },
  {
   "difficulty":1,
   "estimated_minutes":30,
   "id":"lib-habr-bash-21",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хабр · RUVDS",
   "read_before_interview":false,
   "source_ref":"habr-bash-21",
   "title":"Bash для начинающих: 21 полезная команда",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/445270/",
   "verification_status":"verified",
   "why_read":"Компактный разбор 21 команды с примерами на русском: от навигации до перенаправления потоков. Хорош как первое повторение перед интервью — быстро возвращает в форму без чтения учебника."
  },
  {
   "difficulty":1,
   "estimated_minutes":25,
   "id":"lib-habr-cli-20-tricks",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хабр · RUVDS",
   "read_before_interview":false,
   "source_ref":"habr-cli-20-tricks",
   "title":"20 приёмов работы в командной строке Linux",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/339820/",
   "verification_status":"verified",
   "why_read":"Ровно те «фишки», которые отличают уверенного пользователя: подстановки истории, горячие клавиши, работа с каталогами. Половина приёмов экономит время каждый день."
  },
  {
   "difficulty":2,
   "estimated_minutes":20,
   "id":"lib-habr-linux-oneliners",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хабр · RUVDS",
   "read_before_interview":false,
   "source_ref":"habr-linux-oneliners",
   "title":"18 отборных однострочных команд Linux",
   "topic_ids":[
    "linux-basics",
    "scripting"
   ],
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/671428/",
   "verification_status":"verified",
   "why_read":"Готовые однострочники из конвейеров: поиск, подсчёт, массовые операции. Полезно разобрать каждый по частям — это готовые ответы на вопрос «соберите команду, которая…»."
  },
  {
   "difficulty":1,
   "estimated_minutes":40,
   "id":"lib-habr-bash-scripts",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хабр · RUVDS",
   "read_before_interview":false,
   "source_ref":"habr-bash-scripts",
   "title":"Bash-скрипты: начало",
   "topic_ids":[
    "scripting"
   ],
   "type":"guide",
   "url":"https://habr.com/ru/companies/ruvds/articles/325522/",
   "verification_status":"verified",
   "why_read":"Первая часть большой серии про Bash-скрипты на русском: переменные, условия, циклы. Если скрипты пока «по образцу» — серия выстраивает системное понимание."
  },
  {
   "difficulty":2,
   "estimated_minutes":25,
   "id":"lib-habr-payment-testing",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хабр",
   "read_before_interview":false,
   "source_ref":"habr-payment-testing",
   "title":"Как протестировать международный платёжный сервис без боли и нервов",
   "topic_ids":[
    "qa-payment-flow",
    "qa-payment-methods"
   ],
   "type":"article",
   "url":"https://habr.com/ru/articles/517658/",
   "verification_status":"verified",
   "why_read":"Живой опыт тестирования платёжного сервиса: региональные методы оплаты, вспомогательные сервисы, где прячутся дефекты. Даёт фактуру для ответов «как бы вы тестировали платежи»."
  },
  {
   "difficulty":2,
   "estimated_minutes":60,
   "id":"lib-linkmeup-sdsm",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"linkmeup",
   "read_before_interview":false,
   "source_ref":"linkmeup-sdsm",
   "title":"Сети для самых маленьких. Часть нулевая. Планирование",
   "topic_ids":[
    "networking",
    "ts-network"
   ],
   "type":"guide",
   "url":"https://linkmeup.ru/blog/1188/",
   "verification_status":"verified",
   "why_read":"Вход в легендарный цикл о сетях на русском: от планирования до маршрутизации, на живом сквозном примере. Если сети — слабое место, это самый человечный способ их закрыть."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-xakep-bash-tricks",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"Хакер",
   "read_before_interview":false,
   "source_ref":"xakep-bash-tricks",
   "title":"10 простых и полезных трюков для командной строки",
   "topic_ids":[
    "linux-basics",
    "ts-linux"
   ],
   "type":"article",
   "url":"https://xakep.ru/2016/09/26/faq-10-bash-tricks/",
   "verification_status":"verified",
   "why_read":"Короткая бесплатная подборка трюков: пробел перед командой прячет её из истории, Alt+точка подставляет аргумент прошлой команды. Мелочи, которые запоминаются с первого раза."
  },
  {
   "difficulty":2,
   "estimated_minutes":120,
   "id":"lib-sadservers",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"sadservers.com",
   "read_before_interview":false,
   "source_ref":"sadservers",
   "title":"SadServers",
   "topic_ids":[
    "linux-basics",
    "incidents",
    "ts-incidents"
   ],
   "type":"practical_task",
   "url":"https://sadservers.com/",
   "verification_status":"verified",
   "why_read":"«Сломанные серверы» в браузере: реальная машина, описание симптома и ограничение по времени — почините. Самая близкая к собеседованию и к работе практика диагностики; начните со сценариев уровня easy."
  },
  {
   "difficulty":1,
   "estimated_minutes":180,
   "id":"lib-otw-bandit",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"OverTheWire",
   "read_before_interview":false,
   "source_ref":"otw-bandit",
   "title":"OverTheWire: Bandit",
   "topic_ids":[
    "linux-basics",
    "scripting"
   ],
   "type":"practical_task",
   "url":"https://overthewire.org/wargames/bandit/",
   "verification_status":"verified",
   "why_read":"Игра-лестница из 30 уровней: на каждом нужно командной строкой добыть пароль к следующему. Ненавязчиво прокачивает ssh, find, grep, перенос файлов — команды запоминаются руками, а не глазами."
  },
  {
   "difficulty":1,
   "estimated_minutes":15,
   "id":"lib-dangitgit-ru",
   "language":"ru",
   "last_verified":"2026-08-01",
   "publisher":"dangitgit.com",
   "read_before_interview":false,
   "source_ref":"dangitgit-ru",
   "title":"Чёрт побери, Git!?!",
   "topic_ids":[
    "git-vcs"
   ],
   "type":"guide",
   "url":"https://dangitgit.com/ru",
   "verification_status":"verified",
   "why_read":"Шпаргалка «как выбраться» из типовых неприятностей Git простым языком и по-русски: закоммитил не туда, нужно переписать сообщение, вернуть файл. Идеальный ответ на интервью-вопросы формата «что будете делать, если…»."
  },
  {
   "difficulty":2,
   "estimated_minutes":300,
   "id":"lib-mit-missing-semester",
   "language":"en",
   "last_verified":"2026-08-01",
   "publisher":"MIT",
   "read_before_interview":false,
   "source_ref":"mit-missing-semester",
   "title":"The Missing Semester of Your CS Education",
   "topic_ids":[
    "linux-basics",
    "scripting",
    "git-vcs"
   ],
   "type":"guide",
   "url":"https://missing.csail.mit.edu/",
   "verification_status":"verified",
   "why_read":"Курс MIT о том, чему «не учат»: шелл, скрипты, редакторы, Git, отладка, профилирование. Один вечер на лекцию — и инструменты перестают быть магией. Есть видео и конспекты."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-ga4-sessions",
   "language":"en",
   "last_verified":"2026-08-17",
   "publisher":"Google Analytics Help",
   "read_before_interview":true,
   "source_ref":"ga4-sessions",
   "title":"[GA4] About Analytics sessions",
   "topic_ids":[
    "analytics-ga4"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9191807",
   "verification_status":"verified",
   "why_read":"Первоисточник о том, когда GA4 начинает и заканчивает сессию и что несёт событие session_start. Снимает самый живучий миф про utm-метки и «обрыв сессии»."
  },
  {
   "difficulty":3,
   "estimated_minutes":20,
   "id":"lib-ga4-traffic-source-scopes",
   "language":"en",
   "last_verified":"2026-08-17",
   "publisher":"Google Analytics Help",
   "read_before_interview":false,
   "source_ref":"ga4-traffic-source-scopes",
   "title":"[GA4] Scopes of traffic-source dimensions",
   "topic_ids":[
    "analytics-ga4",
    "reporting"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/11080067",
   "verification_status":"verified",
   "why_read":"Разводит «первый источник пользователя», источник сессии и атрибуцию события. Без этого разбор искажённой атрибуции превращается в гадание."
  },
  {
   "difficulty":2,
   "estimated_minutes":15,
   "id":"lib-remove-information",
   "language":"en",
   "last_verified":"2026-08-17",
   "publisher":"Google Search Central",
   "read_before_interview":true,
   "source_ref":"google-remove-information",
   "title":"Remove a page hosted on your site from Google",
   "topic_ids":[
    "technical-seo",
    "indexing-gsc"
   ],
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/remove-information",
   "verification_status":"verified",
   "why_read":"Разбирает не один «правильный» способ убрать страницу, а сценарии: удаление содержимого, 404 и 410, доступ по паролю, noindex. Именно этого различения ждут на собеседовании."
  },
  {
   "difficulty":2,
   "estimated_minutes":10,
   "id":"lib-gsc-removals-tool",
   "language":"en",
   "last_verified":"2026-08-17",
   "publisher":"Google Search Console Help",
   "read_before_interview":false,
   "source_ref":"gsc-removals-tool",
   "title":"Removals and SafeSearch reports tool",
   "topic_ids":[
    "indexing-gsc",
    "technical-seo"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/9689846",
   "verification_status":"verified",
   "why_read":"Инструмент удаления даёт примерно полгода, а не навсегда. Это ровно та деталь, на которой видно, читал ли кандидат документацию."
  },
  {
   "difficulty":3,
   "estimated_minutes":15,
   "id":"lib-disavow-links",
   "language":"en",
   "last_verified":"2026-08-17",
   "publisher":"Google Search Console Help",
   "read_before_interview":false,
   "source_ref":"gsc-disavow-links",
   "title":"Disavow links to your site",
   "topic_ids":[
    "off-page-seo"
   ],
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/2648487",
   "verification_status":"verified",
   "why_read":"Google прямо пишет, что большинству сайтов инструмент не нужен и что он для случаев с ручными мерами. Хорошая прививка от совета «давайте отклоним все плохие ссылки»."
  }
 ],
 "mockCategories":[
  "intro",
  "motivation",
  "fundamentals",
  "technical",
  "tools",
  "practical",
  "portfolio",
  "communication",
  "behavioral",
  "english"
 ],
 "mockQuestions":[],
 "mockSessionFlow":[
  "intro",
  "motivation",
  "fundamentals",
  "technical",
  "tools",
  "practical",
  "behavioral",
  "candidate_questions"
 ],
 "mockSessionModes":[
  {
   "flow":[
    "intro",
    "motivation",
    "portfolio"
   ],
   "hint":"Первый разговор: о себе, мотивация, ожидания",
   "id":"recruiter",
   "minutes":15,
   "per_category":2,
   "title":"Рекрутер"
  },
  {
   "flow":[
    "fundamentals",
    "tools",
    "practical",
    "english"
   ],
   "hint":"Профильный блок: основы, инструменты, практика, английский",
   "id":"junior",
   "minutes":25,
   "per_category":2,
   "title":"Junior SEO"
  },
  {
   "flow":[
    "technical"
   ],
   "hint":"Технический блок без пощады: HTTP, robots, canonical, индексация",
   "id":"technical",
   "minutes":25,
   "per_category":5,
   "title":"Technical SEO"
  },
  {
   "closing":"mock-practical-006",
   "flow":[
    "intro",
    "motivation",
    "fundamentals",
    "technical",
    "tools",
    "practical",
    "behavioral"
   ],
   "hint":"Все блоки по порядку, как на настоящем собеседовании",
   "id":"full",
   "minutes":45,
   "per_category":1,
   "title":"Финальная сессия"
  }
 ],
 "projects":[],
 "questions":[],
 "questionsByTopic":{},
 "roadmap":[],
 "schema":2,
 "sources":[
  {
   "id":"google-seo-starter-guide",
   "publisher":"Google Search Central",
   "title":"SEO Starter Guide",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-how-search-works",
   "publisher":"Google Search Central",
   "title":"In-depth guide to how Google Search works",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/how-search-works",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-helpful-content",
   "publisher":"Google Search Central",
   "title":"Creating helpful, reliable, people-first content",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-search-essentials",
   "publisher":"Google Search Central",
   "title":"Google Search Essentials",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/essentials",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-spam-policies",
   "publisher":"Google Search Central",
   "title":"Spam policies for Google web search",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/essentials/spam-policies",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-crawlers-overview",
   "publisher":"Google Search Central",
   "title":"Overview of Google crawlers and fetchers",
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-robots-intro",
   "publisher":"Google Search Central",
   "title":"Introduction to robots.txt",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/robots/intro",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-robots-spec",
   "publisher":"Google Search Central",
   "title":"robots.txt specification",
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"rfc-9309-rep",
   "publisher":"RFC Editor",
   "title":"RFC 9309: Robots Exclusion Protocol",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9309.html",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-robots-meta-tag",
   "publisher":"Google Search Central",
   "title":"Robots meta tag, data-nosnippet, and X-Robots-Tag specifications",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-canonicalization",
   "publisher":"Google Search Central",
   "title":"What is URL canonicalization",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/canonicalization",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-consolidate-duplicate-urls",
   "publisher":"Google Search Central",
   "title":"How to specify a canonical URL with rel=\"canonical\" and other methods",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-sitemaps-overview",
   "publisher":"Google Search Central",
   "title":"Learn about sitemaps",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-build-sitemap",
   "publisher":"Google Search Central",
   "title":"Build and submit a sitemap",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"sitemaps-protocol",
   "publisher":"sitemaps.org",
   "title":"Sitemaps XML format",
   "type":"specification",
   "url":"https://www.sitemaps.org/protocol.html",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-301-redirects",
   "publisher":"Google Search Central",
   "title":"Redirects and Google Search",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/301-redirects",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-http-status-codes",
   "publisher":"Google Search Central",
   "title":"How HTTP status codes, and network and DNS errors affect Google Search",
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-url-structure",
   "publisher":"Google Search Central",
   "title":"Keep a simple URL structure",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/url-structure",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-crawl-budget",
   "publisher":"Google Search Central",
   "title":"Large site owner's guide to managing your crawl budget",
   "type":"official_documentation",
   "url":"https://developers.google.com/crawling/docs/crawl-budget",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-javascript-seo",
   "publisher":"Google Search Central",
   "title":"Understand JavaScript SEO basics",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-title-link",
   "publisher":"Google Search Central",
   "title":"Influencing your title links in search results",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/title-link",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-snippet",
   "publisher":"Google Search Central",
   "title":"Control your snippets in search results",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/snippet",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-structured-data-intro",
   "publisher":"Google Search Central",
   "title":"Intro to how structured data markup works",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-images-seo",
   "publisher":"Google Search Central",
   "title":"Google Images SEO best practices",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/google-images",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-localized-versions",
   "publisher":"Google Search Central",
   "title":"Tell Google about localized versions of your page",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/specialty/international/localized-versions",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-multi-regional",
   "publisher":"Google Search Central",
   "title":"Managing multi-regional and multilingual sites",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-search-console-start",
   "publisher":"Google Search Central",
   "title":"Get started with Search Console",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/monitor-debug/search-console-start",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-traffic-drops",
   "publisher":"Google Search Central",
   "title":"Debugging drops in Google Search traffic",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"gsc-performance-report",
   "publisher":"Google Search Console Help",
   "title":"Performance report (Search results): Overview and basic setup",
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/7576553",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"gsc-url-inspection",
   "publisher":"Google Search Console Help",
   "title":"URL Inspection tool",
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/9012289",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"gsc-page-indexing-report",
   "publisher":"Google Search Console Help",
   "title":"Page indexing report",
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/7440203",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ga4-setup",
   "publisher":"Google Analytics Help",
   "title":"Set up Analytics for a website and/or app",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9304153",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ga4-dimensions-metrics",
   "publisher":"Google Analytics Help",
   "title":"Analytics dimensions and metrics",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9143382",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ga4-default-channel-group",
   "publisher":"Google Analytics Help",
   "title":"Default channel group",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9756891",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ga4-about-events",
   "publisher":"Google Analytics Help",
   "title":"About events",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9322688",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ga4-devguide",
   "publisher":"Google for Developers",
   "title":"Google Analytics 4 developer guide",
   "type":"official_documentation",
   "url":"https://developers.google.com/analytics/devguides/collection/ga4",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-keyword-planner",
   "publisher":"Google Ads Help",
   "title":"Use Keyword Planner",
   "type":"official_documentation",
   "url":"https://support.google.com/google-ads/answer/7337243",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-trends",
   "publisher":"Google",
   "title":"Google Trends",
   "type":"tool",
   "url":"https://trends.google.com/trends/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"webdev-vitals",
   "publisher":"web.dev",
   "title":"Web Vitals",
   "type":"guide",
   "url":"https://web.dev/articles/vitals",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"webdev-lcp",
   "publisher":"web.dev",
   "title":"Largest Contentful Paint (LCP)",
   "type":"guide",
   "url":"https://web.dev/articles/lcp",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"webdev-inp",
   "publisher":"web.dev",
   "title":"Interaction to Next Paint (INP)",
   "type":"guide",
   "url":"https://web.dev/articles/inp",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"webdev-cls",
   "publisher":"web.dev",
   "title":"Cumulative Layout Shift (CLS)",
   "type":"guide",
   "url":"https://web.dev/articles/cls",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"webdev-optimize-lcp",
   "publisher":"web.dev",
   "title":"Optimize Largest Contentful Paint",
   "type":"guide",
   "url":"https://web.dev/articles/optimize-lcp",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"chrome-crux",
   "publisher":"Chrome for Developers",
   "title":"Chrome UX Report",
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/crux",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"chrome-lighthouse",
   "publisher":"Chrome for Developers",
   "title":"Lighthouse overview",
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/lighthouse/overview",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"psi-about",
   "publisher":"Google for Developers",
   "title":"About PageSpeed Insights",
   "type":"official_documentation",
   "url":"https://developers.google.com/speed/docs/insights/v5/about",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-headings",
   "publisher":"MDN Web Docs",
   "title":"The HTML Section Heading elements",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-http-status",
   "publisher":"MDN Web Docs",
   "title":"HTTP response status codes",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-redirections",
   "publisher":"MDN Web Docs",
   "title":"Redirections in HTTP",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-semantics",
   "publisher":"MDN Web Docs",
   "title":"Semantics",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Glossary/Semantics",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-link-element",
   "publisher":"MDN Web Docs",
   "title":"The External Resource Link element",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"mdn-meta-element",
   "publisher":"MDN Web Docs",
   "title":"The metadata element",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"screamingfrog-user-guide",
   "publisher":"Screaming Frog",
   "title":"SEO Spider User Guide",
   "type":"tool_documentation",
   "url":"https://www.screamingfrog.co.uk/seo-spider/user-guide/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"screamingfrog-tutorials",
   "publisher":"Screaming Frog",
   "title":"SEO Spider Tutorials",
   "type":"tool_documentation",
   "url":"https://www.screamingfrog.co.uk/seo-spider/tutorials/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ahrefs-seo-basics",
   "publisher":"Ahrefs",
   "title":"SEO Basics",
   "type":"guide",
   "url":"https://ahrefs.com/seo/seo-basics",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ahrefs-keyword-research",
   "publisher":"Ahrefs",
   "title":"Keyword Research: The Beginner's Guide",
   "type":"guide",
   "url":"https://ahrefs.com/blog/keyword-research/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"ahrefs-help",
   "publisher":"Ahrefs",
   "title":"Ahrefs Help Center",
   "type":"tool_documentation",
   "url":"https://help.ahrefs.com/en/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"semrush-kb",
   "publisher":"Semrush",
   "title":"Semrush Knowledge Base",
   "type":"tool_documentation",
   "url":"https://www.semrush.com/kb/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"semrush-keyword-research",
   "publisher":"Semrush",
   "title":"Keyword Research Guide",
   "type":"guide",
   "url":"https://www.semrush.com/blog/keyword-research/",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"schema-org-getting-started",
   "publisher":"Schema.org",
   "title":"Getting started with schema.org using Microdata",
   "type":"specification",
   "url":"https://schema.org/docs/gs.html",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-rich-results-test",
   "publisher":"Google",
   "title":"Rich Results Test",
   "type":"tool",
   "url":"https://search.google.com/test/rich-results",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"google-search-blog",
   "publisher":"Google Search Central",
   "title":"Google Search Central Blog",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/blog",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"sheets-query-function",
   "publisher":"Google Docs Editors Help",
   "title":"QUERY function",
   "type":"official_documentation",
   "url":"https://support.google.com/docs/answer/3093343",
   "verified":true,
   "verified_at":"2026-07-27"
  },
  {
   "id":"linux-man-pages",
   "publisher":"man7.org",
   "title":"Linux man-pages",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/index.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"man-ps",
   "publisher":"man7.org",
   "title":"ps(1) — процессы в системе",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/ps.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"man-chmod",
   "publisher":"man7.org",
   "title":"chmod(1) — права доступа",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/chmod.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"man-signal",
   "publisher":"man7.org",
   "title":"signal(7) — сигналы",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man7/signal.7.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"systemd-man",
   "publisher":"man7.org",
   "title":"systemd(1) — система инициализации",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/systemd.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"systemd-unit",
   "publisher":"man7.org",
   "title":"systemd.unit(5) — файлы юнитов",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man5/systemd.unit.5.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"systemd-exec",
   "publisher":"man7.org",
   "title":"systemd.exec(5) — окружение и песочница службы",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man5/systemd.exec.5.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"systemctl-man",
   "publisher":"man7.org",
   "title":"systemctl(1) — управление службами",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/systemctl.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"journalctl-man",
   "publisher":"man7.org",
   "title":"journalctl(1) — чтение журнала",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/journalctl.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-9110-http",
   "publisher":"RFC Editor",
   "title":"RFC 9110: HTTP Semantics",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-1035-dns",
   "publisher":"RFC Editor",
   "title":"RFC 1035: Domain Names — Implementation and Specification",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc1035.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-8446-tls13",
   "publisher":"RFC Editor",
   "title":"RFC 8446: TLS 1.3",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc8446.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"mdn-tls",
   "publisher":"MDN Web Docs",
   "title":"Transport Layer Security",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"cloudflare-dns-intro",
   "publisher":"Cloudflare Learning",
   "title":"What is DNS?",
   "type":"guide",
   "url":"https://www.cloudflare.com/learning/dns/what-is-dns/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"git-branching",
   "publisher":"Pro Git",
   "title":"Basic Branching and Merging",
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"git-rebase",
   "publisher":"Pro Git",
   "title":"Git Branching — Rebasing",
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"git-tag",
   "publisher":"Pro Git",
   "title":"Git Basics — Tagging",
   "type":"official_documentation",
   "url":"https://git-scm.com/book/en/v2/Git-Basics-Tagging",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"dockerfile-reference",
   "publisher":"Docker Docs",
   "title":"Dockerfile reference",
   "type":"official_documentation",
   "url":"https://docs.docker.com/reference/dockerfile/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"docker-multistage",
   "publisher":"Docker Docs",
   "title":"Multi-stage builds",
   "type":"official_documentation",
   "url":"https://docs.docker.com/build/building/multi-stage/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"docker-storage-volumes",
   "publisher":"Docker Docs",
   "title":"Volumes",
   "type":"official_documentation",
   "url":"https://docs.docker.com/engine/storage/volumes/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"docker-networking",
   "publisher":"Docker Docs",
   "title":"Network overview",
   "type":"official_documentation",
   "url":"https://docs.docker.com/engine/network/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"docker-build-cache",
   "publisher":"Docker Docs",
   "title":"Docker build cache",
   "type":"official_documentation",
   "url":"https://docs.docker.com/build/cache/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"oci-image-spec",
   "publisher":"Open Container Initiative",
   "title":"OCI Image Format Specification",
   "type":"specification",
   "url":"https://github.com/opencontainers/image-spec/blob/main/spec.md",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-pods",
   "publisher":"Kubernetes Documentation",
   "title":"Pods",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/pods/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-deployment",
   "publisher":"Kubernetes Documentation",
   "title":"Deployments",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-service",
   "publisher":"Kubernetes Documentation",
   "title":"Service",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/services-networking/service/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-configmap",
   "publisher":"Kubernetes Documentation",
   "title":"ConfigMaps",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/configmap/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-secrets",
   "publisher":"Kubernetes Documentation",
   "title":"Secrets",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/secret/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-probes",
   "publisher":"Kubernetes Documentation",
   "title":"Configure Liveness, Readiness and Startup Probes",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-resources",
   "publisher":"Kubernetes Documentation",
   "title":"Resource Management for Pods and Containers",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-debug-pods",
   "publisher":"Kubernetes Documentation",
   "title":"Debug Pods",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-hpa",
   "publisher":"Kubernetes Documentation",
   "title":"Horizontal Pod Autoscaling",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"k8s-rbac",
   "publisher":"Kubernetes Documentation",
   "title":"Using RBAC Authorization",
   "type":"official_documentation",
   "url":"https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"terraform-state",
   "publisher":"HashiCorp Developer",
   "title":"State",
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/language/state",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"terraform-plan",
   "publisher":"HashiCorp Developer",
   "title":"Command: plan",
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/cli/commands/plan",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"terraform-import",
   "publisher":"HashiCorp Developer",
   "title":"Import",
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/cli/import",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"terraform-modules",
   "publisher":"HashiCorp Developer",
   "title":"Modules",
   "type":"official_documentation",
   "url":"https://developer.hashicorp.com/terraform/language/modules",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"github-actions-workflow",
   "publisher":"GitHub Docs",
   "title":"Workflows",
   "type":"official_documentation",
   "url":"https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"github-actions-secrets",
   "publisher":"GitHub Docs",
   "title":"Use secrets in GitHub Actions",
   "type":"official_documentation",
   "url":"https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"gitlab-ci-yaml",
   "publisher":"GitLab Docs",
   "title":"GitLab CI/CD YAML syntax reference",
   "type":"official_documentation",
   "url":"https://docs.gitlab.com/ci/yaml/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"prometheus-metric-types",
   "publisher":"Prometheus Documentation",
   "title":"Metric types",
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/concepts/metric_types/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"prometheus-alerting-rules",
   "publisher":"Prometheus Documentation",
   "title":"Alerting rules",
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"prometheus-histograms",
   "publisher":"Prometheus Documentation",
   "title":"Histograms and summaries",
   "type":"official_documentation",
   "url":"https://prometheus.io/docs/practices/histograms/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"otel-traces",
   "publisher":"OpenTelemetry Documentation",
   "title":"Traces",
   "type":"official_documentation",
   "url":"https://opentelemetry.io/docs/concepts/signals/traces/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"otel-observability",
   "publisher":"OpenTelemetry Documentation",
   "title":"Observability primer",
   "type":"official_documentation",
   "url":"https://opentelemetry.io/docs/concepts/observability-primer/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"grafana-loki-intro",
   "publisher":"Grafana Labs Documentation",
   "title":"Loki overview",
   "type":"official_documentation",
   "url":"https://grafana.com/docs/loki/latest/get-started/overview/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-slo",
   "publisher":"Google SRE Book",
   "title":"Service Level Objectives",
   "type":"guide",
   "url":"https://sre.google/sre-book/service-level-objectives/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-error-budget",
   "publisher":"Google SRE Workbook",
   "title":"Error Budget Policy",
   "type":"guide",
   "url":"https://sre.google/workbook/error-budget-policy/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-postmortem",
   "publisher":"Google SRE Book",
   "title":"Postmortem Culture: Learning from Failure",
   "type":"guide",
   "url":"https://sre.google/sre-book/postmortem-culture/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-oncall",
   "publisher":"Google SRE Book",
   "title":"Being On-Call",
   "type":"guide",
   "url":"https://sre.google/sre-book/being-on-call/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-monitoring",
   "publisher":"Google SRE Book",
   "title":"Monitoring Distributed Systems",
   "type":"guide",
   "url":"https://sre.google/sre-book/monitoring-distributed-systems/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-cicd-top10",
   "publisher":"OWASP",
   "title":"OWASP Top 10 CI/CD Security Risks",
   "type":"guide",
   "url":"https://owasp.org/www-project-top-10-ci-cd-security-risks/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-secrets-cheatsheet",
   "publisher":"OWASP Cheat Sheet Series",
   "title":"Secrets Management Cheat Sheet",
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"nist-least-privilege",
   "publisher":"NIST Computer Security Resource Center",
   "title":"Least privilege",
   "type":"specification",
   "url":"https://csrc.nist.gov/glossary/term/least_privilege",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-backup",
   "publisher":"PostgreSQL Documentation",
   "title":"Backup and Restore",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/backup.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-explicit-locking",
   "publisher":"PostgreSQL Documentation",
   "title":"Explicit Locking",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/explicit-locking.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-hot-standby",
   "publisher":"PostgreSQL Documentation",
   "title":"Hot Standby",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/hot-standby.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"twelve-factor",
   "publisher":"12factor.net",
   "title":"The Twelve-Factor App",
   "type":"guide",
   "url":"https://12factor.net/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"twelve-factor-config",
   "publisher":"12factor.net",
   "title":"The Twelve-Factor App: Config",
   "type":"guide",
   "url":"https://12factor.net/config",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"martin-fowler-bluegreen",
   "publisher":"martinfowler.com",
   "title":"BlueGreenDeployment",
   "type":"guide",
   "url":"https://martinfowler.com/bliki/BlueGreenDeployment.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"martin-fowler-canary",
   "publisher":"martinfowler.com",
   "title":"CanaryRelease",
   "type":"guide",
   "url":"https://martinfowler.com/bliki/CanaryRelease.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"bash-manual",
   "publisher":"man7.org",
   "title":"bash(1) — GNU Bourne-Again Shell",
   "type":"official_documentation",
   "url":"https://man7.org/linux/man-pages/man1/bash.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"shellcheck",
   "publisher":"ShellCheck",
   "title":"ShellCheck — статический анализ shell-скриптов",
   "type":"tool",
   "url":"https://www.shellcheck.net/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"pci-dss-standards",
   "publisher":"PCI Security Standards Council",
   "title":"PCI DSS",
   "type":"specification",
   "url":"https://www.pcisecuritystandards.org/standards/pci-dss/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"pci-ssc-documents",
   "publisher":"PCI Security Standards Council",
   "title":"PCI SSC Document Library",
   "type":"specification",
   "url":"https://www.pcisecuritystandards.org/document_library/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"iso-4217-registry",
   "publisher":"SIX Group",
   "title":"ISO 4217 Currency Codes — реестр",
   "type":"specification",
   "url":"https://www.six-group.com/en/products-services/financial-information/data-standards.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-9110-idempotent",
   "publisher":"RFC Editor",
   "title":"RFC 9110: Idempotent Methods",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-9110-methods",
   "publisher":"RFC Editor",
   "title":"RFC 9110: Method Definitions",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc9110.html#name-method-definitions",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rfc-4122-uuid",
   "publisher":"RFC Editor",
   "title":"RFC 4122: UUID",
   "type":"specification",
   "url":"https://www.rfc-editor.org/rfc/rfc4122.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"emvco-3ds",
   "publisher":"EMVCo",
   "title":"EMV 3-D Secure",
   "type":"specification",
   "url":"https://www.emvco.com/emv-technologies/3-d-secure/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"w3c-payment-request",
   "publisher":"W3C",
   "title":"Payment Request API",
   "type":"specification",
   "url":"https://w3c.github.io/payment-request/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"openapi-spec",
   "publisher":"OpenAPI Initiative",
   "title":"OpenAPI Specification",
   "type":"specification",
   "url":"https://spec.openapis.org/oas/latest.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"json-schema",
   "publisher":"JSON Schema",
   "title":"Understanding JSON Schema",
   "type":"specification",
   "url":"https://json-schema.org/understanding-json-schema/reference",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-idempotency",
   "publisher":"Stripe Docs",
   "title":"Idempotent requests",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/api/idempotent_requests",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-webhooks",
   "publisher":"Stripe Docs",
   "title":"Webhooks",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/webhooks",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-testing",
   "publisher":"Stripe Docs",
   "title":"Testing",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/testing",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-disputes",
   "publisher":"Stripe Docs",
   "title":"Disputes and fraud",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/disputes",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-refunds",
   "publisher":"Stripe Docs",
   "title":"Refunds",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/refunds",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-payment-intents",
   "publisher":"Stripe Docs",
   "title":"PaymentIntent lifecycle",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/payments/paymentintents/lifecycle",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-3ds",
   "publisher":"Stripe Docs",
   "title":"3D Secure authentication",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/payments/3d-secure",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-currencies",
   "publisher":"Stripe Docs",
   "title":"Supported currencies",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/currencies",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-errors",
   "publisher":"Stripe Docs",
   "title":"Error handling",
   "type":"official_documentation",
   "url":"https://docs.stripe.com/error-handling",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"adyen-online-payments",
   "publisher":"Adyen Docs",
   "title":"Online payments",
   "type":"official_documentation",
   "url":"https://docs.adyen.com/online-payments/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"adyen-webhooks",
   "publisher":"Adyen Docs",
   "title":"Webhooks",
   "type":"official_documentation",
   "url":"https://docs.adyen.com/development-resources/webhooks/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"adyen-webhook-types",
   "publisher":"Adyen Docs",
   "title":"Webhook types",
   "type":"official_documentation",
   "url":"https://docs.adyen.com/development-resources/webhooks/webhook-types/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"adyen-disputes",
   "publisher":"Adyen Docs",
   "title":"Disputes API",
   "type":"official_documentation",
   "url":"https://docs.adyen.com/risk-management/disputes-api/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"paypal-webhooks",
   "publisher":"PayPal Developer",
   "title":"Webhooks",
   "type":"official_documentation",
   "url":"https://developer.paypal.com/api/rest/webhooks/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"istqb-glossary",
   "publisher":"ISTQB",
   "title":"ISTQB Glossary",
   "type":"official_documentation",
   "url":"https://glossary.istqb.org/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-testing-guide",
   "publisher":"OWASP",
   "title":"Web Security Testing Guide",
   "type":"guide",
   "url":"https://owasp.org/www-project-web-security-testing-guide/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-top-ten",
   "publisher":"OWASP",
   "title":"OWASP Top 10",
   "type":"guide",
   "url":"https://owasp.org/www-project-top-ten/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-logging-cheatsheet",
   "publisher":"OWASP Cheat Sheet Series",
   "title":"Logging Cheat Sheet",
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"owasp-input-validation",
   "publisher":"OWASP Cheat Sheet Series",
   "title":"Input Validation Cheat Sheet",
   "type":"guide",
   "url":"https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"martin-fowler-test-pyramid",
   "publisher":"martinfowler.com",
   "title":"The Practical Test Pyramid",
   "type":"guide",
   "url":"https://martinfowler.com/articles/practical-test-pyramid.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"martin-fowler-flaky",
   "publisher":"martinfowler.com",
   "title":"Eradicating Non-Determinism in Tests",
   "type":"guide",
   "url":"https://martinfowler.com/articles/nonDeterminism.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"google-test-sizes",
   "publisher":"Google Testing Blog",
   "title":"Test Sizes",
   "type":"guide",
   "url":"https://testing.googleblog.com/2010/12/test-sizes.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"playwright-docs",
   "publisher":"Playwright",
   "title":"Playwright — Getting started",
   "type":"tool_documentation",
   "url":"https://playwright.dev/docs/intro",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postman-docs",
   "publisher":"Postman Learning Center",
   "title":"Postman — Overview",
   "type":"tool_documentation",
   "url":"https://learning.postman.com/docs/getting-started/overview/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"charles-proxy",
   "publisher":"Charles",
   "title":"Charles Proxy Documentation",
   "type":"tool_documentation",
   "url":"https://www.charlesproxy.com/documentation/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"mdn-http-methods",
   "publisher":"MDN Web Docs",
   "title":"HTTP request methods",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"mdn-numbers-floats",
   "publisher":"MDN Web Docs",
   "title":"Numbers and strings",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_strings",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-numeric",
   "publisher":"PostgreSQL Documentation",
   "title":"Numeric Types",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/datatype-numeric.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-transactions",
   "publisher":"PostgreSQL Documentation",
   "title":"Transactions",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/tutorial-transactions.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-sql-select",
   "publisher":"PostgreSQL Documentation",
   "title":"SELECT",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/sql-select.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"mozilla-bug-writing",
   "publisher":"Mozilla",
   "title":"Bug Writing Guidelines",
   "type":"guide",
   "url":"https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-payout-reconciliation",
   "publisher":"Stripe Docs",
   "title":"Payout reconciliation",
   "type":"documentation",
   "url":"https://docs.stripe.com/payouts/reconciliation",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"stripe-payments-analytics",
   "publisher":"Stripe Docs",
   "title":"Payments analytics",
   "type":"documentation",
   "url":"https://docs.stripe.com/payments/analytics",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"google-links-crawlable",
   "publisher":"Google Search Central",
   "title":"Make your links crawlable",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"google-qualify-links",
   "publisher":"Google Search Central",
   "title":"Qualify your outbound links to Google",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"google-breadcrumb-structured-data",
   "publisher":"Google Search Central",
   "title":"Breadcrumb (BreadcrumbList) structured data",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-user-stories",
   "publisher":"Atlassian",
   "title":"User stories with examples and a template",
   "type":"guide",
   "url":"https://www.atlassian.com/agile/project-management/user-stories",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"gitlab-communication",
   "publisher":"GitLab",
   "title":"GitLab Communication handbook",
   "type":"guide",
   "url":"https://handbook.gitlab.com/handbook/communication/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sgtatham-bug-reports",
   "publisher":"Simon Tatham",
   "title":"How to Report Bugs Effectively",
   "type":"guide",
   "url":"https://www.chiark.greenend.org.uk/~sgtatham/bugs.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"rework-structured-interviewing",
   "publisher":"Google re:Work",
   "title":"Guide: Use structured interviewing",
   "type":"guide",
   "url":"https://rework.withgoogle.com/guides/hiring-use-structured-interviewing/steps/introduction/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"amazon-leadership-principles",
   "publisher":"Amazon",
   "title":"Amazon Leadership Principles",
   "type":"documentation",
   "url":"https://www.amazon.jobs/content/en/our-workplace/leadership-principles",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-blameless-postmortem",
   "publisher":"Atlassian",
   "title":"Blameless postmortems: how to run them",
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/postmortem/blameless",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"aws-what-is-cloud-computing",
   "publisher":"Amazon Web Services",
   "title":"What is cloud computing?",
   "type":"official_documentation",
   "url":"https://aws.amazon.com/what-is-cloud-computing/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"azure-shared-responsibility",
   "publisher":"Microsoft Learn",
   "title":"Shared responsibility in the cloud",
   "type":"official_documentation",
   "url":"https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"gcp-what-is-cloud-computing",
   "publisher":"Google Cloud",
   "title":"What is cloud computing?",
   "type":"official_documentation",
   "url":"https://cloud.google.com/learn/what-is-cloud-computing",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-slas",
   "publisher":"Atlassian",
   "title":"SLAs: what they are and how to use them",
   "type":"guide",
   "url":"https://www.atlassian.com/itsm/service-request-management/slas",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-incident-handbook",
   "publisher":"Atlassian",
   "title":"Incident management handbook",
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/handbook",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-incident-communication",
   "publisher":"Atlassian",
   "title":"Incident communication best practices",
   "type":"guide",
   "url":"https://www.atlassian.com/incident-management/incident-communication",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-knowledge-management",
   "publisher":"Atlassian",
   "title":"Knowledge management in ITSM",
   "type":"guide",
   "url":"https://www.atlassian.com/itsm/knowledge-management",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"atlassian-5-whys",
   "publisher":"Atlassian",
   "title":"5 Whys play",
   "type":"guide",
   "url":"https://www.atlassian.com/team-playbook/plays/5-whys",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"chrome-devtools-network",
   "publisher":"Chrome for Developers",
   "title":"Inspect network activity",
   "type":"official_documentation",
   "url":"https://developer.chrome.com/docs/devtools/network",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"curl-manual",
   "publisher":"curl",
   "title":"curl manual",
   "type":"tool_documentation",
   "url":"https://curl.se/docs/manual.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"elastic-discover",
   "publisher":"Elastic",
   "title":"Discover: explore your data",
   "type":"official_documentation",
   "url":"https://www.elastic.co/docs/explore-analyze/discover",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"cloudflare-ssl-concepts",
   "publisher":"Cloudflare",
   "title":"SSL/TLS concepts",
   "type":"official_documentation",
   "url":"https://developers.cloudflare.com/ssl/concepts/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"letsencrypt-expiration",
   "publisher":"Let's Encrypt",
   "title":"Expiration emails and certificate lifetime",
   "type":"official_documentation",
   "url":"https://letsencrypt.org/docs/expiration-emails/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"martin-fowler-feature-toggles",
   "publisher":"Martin Fowler",
   "title":"Feature Toggles (aka Feature Flags)",
   "type":"guide",
   "url":"https://martinfowler.com/articles/feature-toggles.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"microsoft-gdpr",
   "publisher":"Microsoft Learn",
   "title":"GDPR overview for organisations",
   "type":"official_documentation",
   "url":"https://learn.microsoft.com/en-us/compliance/regulatory/gdpr",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"sre-managing-incidents",
   "publisher":"Google SRE",
   "title":"Managing Incidents",
   "type":"guide",
   "url":"https://sre.google/sre-book/managing-incidents/",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"postgres-limit",
   "publisher":"PostgreSQL",
   "title":"LIMIT and OFFSET",
   "type":"official_documentation",
   "url":"https://www.postgresql.org/docs/current/queries-limit.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"man-grep",
   "publisher":"man7.org",
   "title":"grep(1) manual page",
   "type":"documentation",
   "url":"https://man7.org/linux/man-pages/man1/grep.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"man-df",
   "publisher":"man7.org",
   "title":"df(1) manual page",
   "type":"documentation",
   "url":"https://man7.org/linux/man-pages/man1/df.1.html",
   "verified":true,
   "verified_at":"2026-07-28"
  },
  {
   "id":"cisco-english-for-it1",
   "publisher":"Cisco Networking Academy",
   "title":"English for IT 1",
   "type":"course",
   "url":"https://www.netacad.com/courses/english-for-it1",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"cisco-english-for-it2",
   "publisher":"Cisco Networking Academy",
   "title":"English for IT 2",
   "type":"course",
   "url":"https://www.netacad.com/courses/english-for-it2",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"github-english-it-professionals",
   "publisher":"GitHub · LucianoMoliterno",
   "title":"English for IT Professionals",
   "type":"course",
   "url":"https://github.com/LucianoMoliterno/English-for-IT-Professionals",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"github-english-it-unhan",
   "publisher":"GitHub · informatikaunhan",
   "title":"English for IT (EIT-201)",
   "type":"course",
   "url":"https://github.com/informatikaunhan/english-it",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"speak-tech-english",
   "publisher":"speaktechenglish.com",
   "title":"Speak Tech English",
   "type":"practice",
   "url":"https://speaktechenglish.com/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"mdn-home",
   "publisher":"Mozilla",
   "title":"MDN Web Docs",
   "type":"official_documentation",
   "url":"https://developer.mozilla.org/en-US/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"github-skills",
   "publisher":"GitHub",
   "title":"GitHub Skills",
   "type":"practice",
   "url":"https://learn.github.com/skills",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"youglish",
   "publisher":"youglish.com",
   "title":"YouGlish",
   "type":"tool",
   "url":"https://youglish.com/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"cambridge-write-improve",
   "publisher":"Cambridge",
   "title":"Write & Improve",
   "type":"tool",
   "url":"https://writeandimprove.com/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-linux",
   "publisher":"OverAPI.com",
   "title":"Linux Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/linux",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-git",
   "publisher":"OverAPI.com",
   "title":"Git Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/git",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-docker",
   "publisher":"OverAPI.com",
   "title":"Docker Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/docker",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-mysql",
   "publisher":"OverAPI.com",
   "title":"MySQL Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/mysql",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-regex",
   "publisher":"OverAPI.com",
   "title":"Regular Expressions Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/regex",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-python",
   "publisher":"OverAPI.com",
   "title":"Python Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/python",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-html",
   "publisher":"OverAPI.com",
   "title":"HTML Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/html",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-css",
   "publisher":"OverAPI.com",
   "title":"CSS Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/css",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-javascript",
   "publisher":"OverAPI.com",
   "title":"JavaScript Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/javascript",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"overapi-mod-rewrite",
   "publisher":"OverAPI.com",
   "title":"mod_rewrite Cheat Sheet",
   "type":"cheatsheet",
   "url":"https://overapi.com/mod_rewrite",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"ubuntu-server-docs",
   "publisher":"Canonical",
   "title":"Ubuntu Server documentation",
   "type":"official_documentation",
   "url":"https://ubuntu.com/server/docs/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"ubuntu-cli-tutorial",
   "publisher":"Canonical",
   "title":"The Linux command line for beginners",
   "type":"guide",
   "url":"https://ubuntu.com/tutorials/command-line-for-beginners",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"tldr-pages",
   "publisher":"tldr-pages community",
   "title":"tldr pages",
   "type":"tool",
   "url":"https://tldr.sh/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"explainshell",
   "publisher":"explainshell.com",
   "title":"explainshell",
   "type":"tool",
   "url":"https://explainshell.com/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"habr-bash-21",
   "publisher":"Хабр · RUVDS",
   "title":"Bash для начинающих: 21 полезная команда",
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/445270/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"habr-cli-20-tricks",
   "publisher":"Хабр · RUVDS",
   "title":"20 приёмов работы в командной строке Linux",
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/339820/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"habr-linux-oneliners",
   "publisher":"Хабр · RUVDS",
   "title":"18 отборных однострочных команд Linux",
   "type":"article",
   "url":"https://habr.com/ru/companies/ruvds/articles/671428/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"habr-bash-scripts",
   "publisher":"Хабр · RUVDS",
   "title":"Bash-скрипты: начало",
   "type":"guide",
   "url":"https://habr.com/ru/companies/ruvds/articles/325522/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"habr-payment-testing",
   "publisher":"Хабр",
   "title":"Как протестировать международный платёжный сервис без боли и нервов",
   "type":"article",
   "url":"https://habr.com/ru/articles/517658/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"linkmeup-sdsm",
   "publisher":"linkmeup",
   "title":"Сети для самых маленьких. Часть нулевая. Планирование",
   "type":"guide",
   "url":"https://linkmeup.ru/blog/1188/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"xakep-bash-tricks",
   "publisher":"Хакер",
   "title":"10 простых и полезных трюков для командной строки",
   "type":"article",
   "url":"https://xakep.ru/2016/09/26/faq-10-bash-tricks/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"sadservers",
   "publisher":"sadservers.com",
   "title":"SadServers",
   "type":"practice",
   "url":"https://sadservers.com/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"otw-bandit",
   "publisher":"OverTheWire",
   "title":"OverTheWire: Bandit",
   "type":"practice",
   "url":"https://overthewire.org/wargames/bandit/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"dangitgit-ru",
   "publisher":"dangitgit.com",
   "title":"Чёрт побери, Git!?!",
   "type":"guide",
   "url":"https://dangitgit.com/ru",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"mit-missing-semester",
   "publisher":"MIT",
   "title":"The Missing Semester of Your CS Education",
   "type":"course",
   "url":"https://missing.csail.mit.edu/",
   "verified":true,
   "verified_at":"2026-08-01"
  },
  {
   "id":"ga4-sessions",
   "publisher":"Google Analytics Help",
   "title":"[GA4] About Analytics sessions",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/9191807",
   "verified":true,
   "verified_at":"2026-08-17"
  },
  {
   "id":"ga4-traffic-source-scopes",
   "publisher":"Google Analytics Help",
   "title":"[GA4] Scopes of traffic-source dimensions",
   "type":"official_documentation",
   "url":"https://support.google.com/analytics/answer/11080067",
   "verified":true,
   "verified_at":"2026-08-17"
  },
  {
   "id":"google-remove-information",
   "publisher":"Google Search Central",
   "title":"Remove a page hosted on your site from Google",
   "type":"official_documentation",
   "url":"https://developers.google.com/search/docs/crawling-indexing/remove-information",
   "verified":true,
   "verified_at":"2026-08-17"
  },
  {
   "id":"gsc-removals-tool",
   "publisher":"Google Search Console Help",
   "title":"Removals and SafeSearch reports tool",
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/9689846",
   "verified":true,
   "verified_at":"2026-08-17"
  },
  {
   "id":"gsc-disavow-links",
   "publisher":"Google Search Console Help",
   "title":"Disavow links to your site",
   "type":"official_documentation",
   "url":"https://support.google.com/webmasters/answer/2648487",
   "verified":true,
   "verified_at":"2026-08-17"
  }
 ],
 "stories":[],
 "storyFramework":{
  "fields":[
   {
    "hint":"Контекст в одном-двух предложениях: где, когда, какой был исходный расклад",
    "key":"situation",
    "title":"Situation"
   },
   {
    "hint":"Что конкретно требовалось именно от вас",
    "key":"task",
    "title":"Task"
   },
   {
    "hint":"Что сделали вы лично. Говорите «я», а не «мы»",
    "key":"action",
    "title":"Action"
   },
   {
    "hint":"Что получилось. По возможности измеримо, с указанием источника данных",
    "key":"result",
    "title":"Result"
   },
   {
    "hint":"Что сделали бы иначе и что изменили в своём процессе после",
    "key":"reflection",
    "title":"Reflection"
   }
  ],
  "name":"STAR + Reflection"
 },
 "termsByTopic":{},
 "topics":[],
 "trackFiles":{
  "devops-platform":"generated/content_track_devops-platform.js",
  "qa-payments":"generated/content_track_qa-payments.js",
  "redcore-junior-seo":"generated/content_track_redcore-junior-seo.js",
  "technical-engineer":"generated/content_track_technical-engineer.js"
 },
 "trackLoaded":null,
 "tracks":[
  {
   "company":"RedCore",
   "critical_topic_ids":[
    "search-basics",
    "search-intent",
    "on-page",
    "technical-seo",
    "indexing-gsc",
    "keyword-research",
    "html-http",
    "seo-tools",
    "site-architecture",
    "internal-linking"
   ],
   "id":"redcore-junior-seo",
   "language":"ru",
   "self_assessment_areas":[
    {
     "hint":"Работали ли вы с продвижением сайтов на практике",
     "id":"sa-seo-experience",
     "title":"Опыт SEO"
    },
    {
     "hint":"Читаете ли вы разметку страницы и понимаете структуру документа",
     "id":"sa-html-css",
     "title":"HTML и CSS"
    },
    {
     "hint":"robots.txt, sitemap, canonical, коды ответа, индексация",
     "id":"sa-technical-seo",
     "title":"Технический SEO"
    },
    {
     "hint":"Отчёты, проверка URL, индексация, показы и клики",
     "id":"sa-gsc",
     "title":"Google Search Console"
    },
    {
     "hint":"Отчёты по трафику, каналы, события, конверсии",
     "id":"sa-ga4",
     "title":"GA4"
    },
    {
     "hint":"Подбор запросов, частотность, интент, кластеризация",
     "id":"sa-keyword-research",
     "title":"Сбор семантики"
    },
    {
     "hint":"Краул сайта, поиск ошибок, выгрузки",
     "id":"sa-screaming-frog",
     "title":"Screaming Frog"
    },
    {
     "hint":"Анализ конкурентов, ссылки, видимость, ключевые слова",
     "id":"sa-ahrefs-semrush",
     "title":"Ahrefs / Semrush"
    },
    {
     "hint":"Формулы, сводные, обработка выгрузок",
     "id":"sa-sheets",
     "title":"Google Sheets"
    },
    {
     "hint":"Разбор ссылочного профиля, оценка доноров, анкоры, аутрич",
     "id":"sa-off-page",
     "title":"Ссылки и off-page"
    },
    {
     "hint":"Понимаете ли специфику партнёрских сайтов, рынков и регулирования",
     "id":"sa-igaming",
     "title":"Ниша iGaming"
    },
    {
     "hint":"Чтение документации и короткий устный ответ",
     "id":"sa-english",
     "title":"Английский язык"
    },
    {
     "hint":"Можете ли внятно объяснить, что делали и какой был результат",
     "id":"sa-storytelling",
     "title":"Рассказ о своих проектах"
    }
   ],
   "status":"active",
   "summary":"Подготовка к собеседованию на позицию Junior SEO Specialist: как работает поиск, технический SEO, семантика, аналитика, инструменты и разбор своих кейсов.",
   "title":"Junior SEO Specialist",
   "vacancy_id":"redcore-junior-seo"
  },
  {
   "company":null,
   "critical_topic_ids":[
    "qa-testing-basics",
    "qa-test-design",
    "qa-payment-flow",
    "qa-idempotency",
    "qa-refunds",
    "qa-webhooks",
    "qa-api-testing",
    "qa-money-precision"
   ],
   "id":"qa-payments",
   "language":"ru",
   "self_assessment_areas":[
    {
     "hint":"Виды и уровни проверок, приоритет и серьёзность",
     "id":"sa-qa-basics",
     "title":"Основы тестирования"
    },
    {
     "hint":"Классы эквивалентности, границы, таблицы решений",
     "id":"sa-qa-design",
     "title":"Тест-дизайн"
    },
    {
     "hint":"Чек-листы, тест-кейсы, баг-репорты",
     "id":"sa-qa-docs",
     "title":"Тестовая документация"
    },
    {
     "hint":"Авторизация, списание, расчёт, участники",
     "id":"sa-qa-payments",
     "title":"Устройство платежа"
    },
    {
     "hint":"Проверка держателя карты и сценарии отказа",
     "id":"sa-qa-3ds",
     "title":"Аутентификация и 3-D Secure"
    },
    {
     "hint":"Ключи, повторы, защита от двойных списаний",
     "id":"sa-qa-idempotency",
     "title":"Идемпотентность"
    },
    {
     "hint":"Отмена, возврат, частичный возврат, чарджбэк",
     "id":"sa-qa-refunds",
     "title":"Возвраты и споры"
    },
    {
     "hint":"Повторы, порядок событий, подпись",
     "id":"sa-qa-webhooks",
     "title":"Вебхуки и асинхронность"
    },
    {
     "hint":"Коды ответа, контракт, отказы и таймауты",
     "id":"sa-qa-api",
     "title":"Тестирование API"
    },
    {
     "hint":"Минорные единицы, округление, конвертация",
     "id":"sa-qa-money",
     "title":"Деньги и валюты"
    },
    {
     "hint":"Маскирование, токенизация, требования к хранению",
     "id":"sa-qa-cards",
     "title":"Данные карт"
    },
    {
     "hint":"Выборки, соединения, группировки для проверки данных",
     "id":"sa-qa-sql",
     "title":"SQL"
    },
    {
     "hint":"Проверки на уровне API и работа с нестабильными тестами",
     "id":"sa-qa-automation",
     "title":"Автоматизация"
    },
    {
     "hint":"Чтение документации и короткий устный ответ",
     "id":"sa-qa-english",
     "title":"Английский язык"
    },
    {
     "hint":"Можете ли внятно объяснить, что делали и какой был результат",
     "id":"sa-qa-storytelling",
     "title":"Рассказ о своих проектах"
    }
   ],
   "status":"active",
   "summary":"Подготовка к собеседованию на позицию QA Engineer в платежах: основы тестирования и тест-дизайн, устройство платежа, идемпотентность и возвраты, вебхуки и API, деньги и точность, данные карт, сверка и поведение в инциденте.",
   "title":"QA Engineer — платежи",
   "vacancy_id":"qa-payments-generic"
  },
  {
   "company":"Профиль рынка",
   "critical_topic_ids":[
    "ts-ticket-flow",
    "ts-reproduce",
    "ts-logs",
    "ts-http-api",
    "ts-network",
    "ts-sql",
    "ts-incidents",
    "ts-communication"
   ],
   "id":"technical-engineer",
   "language":"ru",
   "self_assessment_areas":[
    {
     "hint":"Разбирали ли вы обращения второй линии самостоятельно",
     "id":"sa-ts-support",
     "title":"Опыт поддержки"
    },
    {
     "hint":"Считаете ли приоритет по влиянию и срочности",
     "id":"sa-ts-priority",
     "title":"Приоритеты и SLA"
    },
    {
     "hint":"Сводите ли жалобу к минимальному сценарию",
     "id":"sa-ts-repro",
     "title":"Воспроизведение"
    },
    {
     "hint":"Ищете ли по идентификатору запроса и читаете ли контекст",
     "id":"sa-ts-logs",
     "title":"Логи"
    },
    {
     "hint":"Понимаете ли коды ответов и умеете повторить запрос",
     "id":"sa-ts-http",
     "title":"HTTP и API"
    },
    {
     "hint":"DNS, TLS, порты, прокси и диагностика доступности",
     "id":"sa-ts-network",
     "title":"Сеть"
    },
    {
     "hint":"Смотрите ли журнал службы, место на диске и права",
     "id":"sa-ts-linux",
     "title":"Командная строка"
    },
    {
     "hint":"Пишете ли выборки с соединениями и ограничением",
     "id":"sa-ts-sql",
     "title":"SQL"
    },
    {
     "hint":"Читаете ли вкладку «Сеть» и HAR-файл",
     "id":"sa-ts-devtools",
     "title":"Инструменты браузера"
    },
    {
     "hint":"Разбирали ли доставку событий, повторы и дубли",
     "id":"sa-ts-integrations",
     "title":"Интеграции"
    },
    {
     "hint":"Участвовали ли в массовых сбоях и эскалации",
     "id":"sa-ts-incidents",
     "title":"Инциденты"
    },
    {
     "hint":"Читаете ли дашборды и понимаете ли процентили",
     "id":"sa-ts-monitoring",
     "title":"Мониторинг"
    },
    {
     "hint":"Знаете ли правила работы с персональными данными",
     "id":"sa-ts-privacy",
     "title":"Данные клиентов"
    },
    {
     "hint":"Пишете ли ответы со следующим шагом и сроком",
     "id":"sa-ts-communication",
     "title":"Общение с клиентом"
    },
    {
     "hint":"Переписка и созвоны на английском в рабочих задачах",
     "id":"sa-ts-english",
     "title":"Английский"
    }
   ],
   "status":"active",
   "summary":"Подготовка к собеседованию на позицию инженера технической поддержки: обращения и приоритеты, воспроизведение проблем, логи и HTTP, сетевая диагностика, SQL, интеграции, инциденты и общение с клиентом.",
   "title":"Technical Engineer",
   "vacancy_id":"technical-engineer-generic"
  },
  {
   "company":null,
   "critical_topic_ids":[
    "linux-basics",
    "networking",
    "ci-cd",
    "containers",
    "kubernetes",
    "iac",
    "observability",
    "reliability-slo"
   ],
   "id":"devops-platform",
   "language":"ru",
   "self_assessment_areas":[
    {
     "hint":"Работа в командной строке, службы, права, чтение журнала",
     "id":"sa-dv-linux",
     "title":"Linux"
    },
    {
     "hint":"DNS, TCP, HTTP, TLS и диагностика доступности",
     "id":"sa-dv-networking",
     "title":"Сети"
    },
    {
     "hint":"Ветвление, слияние, разрешение конфликтов, теги",
     "id":"sa-dv-git",
     "title":"Git"
    },
    {
     "hint":"Сборка образов, контейнеры, тома, сети",
     "id":"sa-dv-docker",
     "title":"Docker"
    },
    {
     "hint":"Основные объекты и разбор проблем с подами",
     "id":"sa-dv-kubernetes",
     "title":"Kubernetes"
    },
    {
     "hint":"Настройка конвейеров сборки, тестов и выката",
     "id":"sa-dv-cicd",
     "title":"CI/CD"
    },
    {
     "hint":"Описание инфраструктуры кодом, состояние, дрейф",
     "id":"sa-dv-iac",
     "title":"Terraform и IaC"
    },
    {
     "hint":"Метрики, тревоги, разбор по логам",
     "id":"sa-dv-observability",
     "title":"Мониторинг и логи"
    },
    {
     "hint":"Ресурсы, зоны доступности, права доступа",
     "id":"sa-dv-cloud",
     "title":"Облака"
    },
    {
     "hint":"Скрипты автоматизации и обработка ошибок",
     "id":"sa-dv-scripting",
     "title":"Bash и Python"
    },
    {
     "hint":"Резервные копии, миграции, реплики",
     "id":"sa-dv-databases",
     "title":"Базы данных"
    },
    {
     "hint":"Участие в дежурствах и разборах инцидентов",
     "id":"sa-dv-oncall",
     "title":"Дежурства и аварии"
    },
    {
     "hint":"Чтение документации и короткий устный ответ",
     "id":"sa-dv-english",
     "title":"Английский язык"
    },
    {
     "hint":"Можете ли внятно объяснить, что делали и какой был результат",
     "id":"sa-dv-storytelling",
     "title":"Рассказ о своих проектах"
    }
   ],
   "status":"active",
   "summary":"Подготовка к собеседованию на позицию DevOps / Platform Engineer: Linux и сети, контейнеры и Kubernetes, конвейеры сборки, инфраструктура как код, наблюдаемость и надёжность, поведение в аварии.",
   "title":"DevOps / Platform Engineer",
   "vacancy_id":"devops-platform-generic"
  }
 ],
 "vacancies":[]
};
  global.CONTENT = CONTENT;
  if (typeof module !== "undefined" && module.exports) module.exports = CONTENT;
})(typeof window !== "undefined" ? window : globalThis);
