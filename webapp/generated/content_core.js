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
  "active_tracks":2,
  "cases":20,
  "glossary_terms":156,
  "lessons":48,
  "library_resources":125,
  "mock_questions":72,
  "questions":222,
  "roadmap_steps":46,
  "sources":126,
  "story_templates":18,
  "topics":40,
  "tracks":4,
  "vacancies":2
 },
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
  "Облако"
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
    "technical-seo"
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
    "content-briefs"
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
    "technical-seo"
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
    "html-http"
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
    "networking"
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
    "reliability-slo"
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
    "incidents"
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
    "incidents"
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
    "deployment-strategies"
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
    "linux-basics"
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
    "keyword-research"
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
   "critical_topic_ids":[],
   "id":"qa-payments",
   "language":"ru",
   "self_assessment_areas":[],
   "status":"coming_soon",
   "summary":"Тестирование платёжных сценариев: интеграции, идемпотентность, возвраты, безопасность данных карт.",
   "title":"QA Engineer — платежи",
   "vacancy_id":null
  },
  {
   "company":null,
   "critical_topic_ids":[],
   "id":"technical-engineer",
   "language":"ru",
   "self_assessment_areas":[],
   "status":"coming_soon",
   "summary":"Поддержка и диагностика технических продуктов: логи, сеть, воспроизведение проблем, эскалация.",
   "title":"Technical Engineer",
   "vacancy_id":null
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
