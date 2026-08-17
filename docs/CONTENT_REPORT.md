# Отчёт о контенте

Сгенерирован `tools/generate_content_report.py` из `data/`.

## Количества

| Коллекция | Количество |
|---|---:|
| tracks | 4 |
| active_tracks | 4 |
| topics | 82 |
| vacancies | 4 |
| sources | 236 |
| lessons | 93 |
| glossary_terms | 277 |
| library_resources | 224 |
| questions | 493 |
| mock_questions | 139 |
| cases | 37 |
| roadmap_steps | 93 |
| story_templates | 31 |
| achievements | 24 |
| english_phrases | 64 |
| english_vocab | 81 |
| english_drills | 26 |
| english_writing | 41 |
| english_resources | 9 |

## Трек: Junior SEO Specialist (`redcore-junior-seo`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Как работает поиск `search-basics` | да | да | 12 | 2 | 5 | 8 | 3 | 0 |
| Поисковый интент `search-intent` | да | да | 10 | 1 | 6 | 1 | 2 | 0 |
| On-page SEO `on-page` | да | да | 18 | 3 | 15 | 11 | 2 | 2 |
| HTML и HTTP `html-http` |  | да | 12 | 2 | 9 | 10 | 1 | 1 |
| Технический SEO `technical-seo` | да | да | 24 | 3 | 24 | 24 | 10 | 6 |
| Индексация и Search Console `indexing-gsc` | да | да | 10 | 2 | 9 | 9 | 3 | 2 |
| Сбор семантики `keyword-research` | да | да | 12 | 1 | 4 | 4 | 1 | 1 |
| Кластеризация и mapping `clustering-mapping` |  | да | 0 | 1 | 3 | 1 | 1 | 2 |
| Аналитика и GA4 `analytics-ga4` |  | да | 8 | 1 | 9 | 6 | 1 | 1 |
| Инструменты SEO `seo-tools` |  | да | 8 | 2 | 6 | 6 | 2 | 0 |
| Скорость и Core Web Vitals `performance-cwv` |  | да | 0 | 1 | 6 | 10 | 1 | 1 |
| Внутренняя перелинковка `internal-linking` |  | да | 0 | 1 | 6 | 3 | 2 | 0 |
| Международное SEO `international-seo` |  |  | 0 | 1 | 3 | 2 | 1 | 1 |
| Контентные ТЗ `content-briefs` |  | да | 0 | 1 | 4 | 2 | 1 | 1 |
| Конкурентный анализ `competitor-analysis` |  | да | 0 | 1 | 7 | 2 | 2 | 1 |
| Google Sheets для SEO `sheets` |  | да | 0 | 1 | 4 | 1 | 1 | 0 |
| Отчётность `reporting` |  | да | 6 | 1 | 11 | 6 | 6 | 2 |
| Работа с разработчиками `dev-communication` |  | да | 0 | 1 | 4 | 4 | 3 | 3 |
| Вопросы SEO-интервью `interview-seo` |  | да | 0 | 1 | 5 | 2 | 14 | 0 |
| Behavioral interview `behavioral` |  | да | 0 | 1 | 3 | 3 | 3 | 0 |
| Off-page SEO и ссылки `off-page-seo` |  | да | 12 | 2 | 11 | 4 | 2 | 1 |
| Контекст iGaming `igaming-context` |  | да | 0 | 1 | 4 | 0 | 2 | 0 |

### Распределение вопросов по темам

```
search-basics          ############............  12
search-intent          ##########..............  10
on-page                ##################......  18
html-http              ############............  12
technical-seo          ########################  24
indexing-gsc           ##########..............  10
keyword-research       ############............  12
clustering-mapping     ........................   0
analytics-ga4          ########................   8
seo-tools              ########................   8
performance-cwv        ........................   0
internal-linking       ........................   0
international-seo      ........................   0
content-briefs         ........................   0
competitor-analysis    ........................   0
sheets                 ........................   0
reporting              ######..................   6
dev-communication      ........................   0
interview-seo          ........................   0
behavioral             ........................   0
off-page-seo           ############............  12
igaming-context        ........................   0
```

### Пробелы

- тема `igaming-context` без материалов библиотеки

## Трек: QA Engineer — платежи (`qa-payments`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Основы тестирования `qa-testing-basics` | да | да | 8 | 1 | 4 | 1 | 4 | 0 |
| Техники тест-дизайна `qa-test-design` | да | да | 8 | 1 | 6 | 2 | 1 | 0 |
| Тестовая документация `qa-test-docs` |  | да | 5 | 1 | 4 | 3 | 3 | 0 |
| Как устроен платёж `qa-payment-flow` | да | да | 8 | 1 | 10 | 4 | 3 | 2 |
| Способы оплаты `qa-payment-methods` |  | да | 5 | 1 | 4 | 2 | 0 | 1 |
| 3-D Secure и аутентификация `qa-3ds-auth` |  | да | 5 | 1 | 3 | 2 | 0 | 1 |
| Идемпотентность и повторы `qa-idempotency` | да | да | 8 | 1 | 2 | 2 | 1 | 1 |
| Возвраты, отмены, чарджбэки `qa-refunds` | да | да | 8 | 1 | 6 | 3 | 1 | 1 |
| Вебхуки и асинхронность `qa-webhooks` | да | да | 8 | 1 | 3 | 4 | 2 | 1 |
| Тестирование API `qa-api-testing` | да | да | 8 | 1 | 5 | 11 | 3 | 0 |
| Деньги и точность `qa-money-precision` | да | да | 8 | 1 | 7 | 4 | 2 | 2 |
| Безопасность данных карт `qa-card-security` |  | да | 5 | 1 | 7 | 5 | 1 | 1 |
| Интеграции и песочницы `qa-integrations` |  | да | 5 | 1 | 4 | 2 | 1 | 0 |
| Сверка и отчётность `qa-reconciliation` |  | да | 5 | 1 | 2 | 1 | 0 | 2 |
| SQL и проверка данных `qa-sql-data` |  | да | 5 | 1 | 1 | 4 | 1 | 1 |
| Логи и разбор проблем `qa-logs-incidents` |  | да | 5 | 1 | 4 | 2 | 1 | 1 |
| Регресс и релиз `qa-regression-release` |  | да | 5 | 1 | 3 | 1 | 3 | 1 |
| Автоматизация тестов `qa-automation` |  | да | 5 | 1 | 3 | 6 | 2 | 0 |
| Метрики качества `qa-metrics` |  |  | 5 | 1 | 1 | 1 | 2 | 1 |
| Behavioral interview `qa-behavioral` |  | да | 5 | 1 | 5 | 3 | 13 | 0 |

### Распределение вопросов по темам

```
qa-testing-basics      ########################   8
qa-test-design         ########################   8
qa-test-docs           ###############.........   5
qa-payment-flow        ########################   8
qa-payment-methods     ###############.........   5
qa-3ds-auth            ###############.........   5
qa-idempotency         ########################   8
qa-refunds             ########################   8
qa-webhooks            ########################   8
qa-api-testing         ########################   8
qa-money-precision     ########################   8
qa-card-security       ###############.........   5
qa-integrations        ###############.........   5
qa-reconciliation      ###############.........   5
qa-sql-data            ###############.........   5
qa-logs-incidents      ###############.........   5
qa-regression-release  ###############.........   5
qa-automation          ###############.........   5
qa-metrics             ###############.........   5
qa-behavioral          ###############.........   5
```

### Пробелы

Пробелов не обнаружено.

## Трек: Technical Engineer (`technical-engineer`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Роль инженера поддержки `ts-support-role` |  | да | 5 | 1 | 5 | 2 | 4 | 0 |
| Обращение от заявки до закрытия `ts-ticket-flow` | да | да | 8 | 1 | 7 | 1 | 2 | 0 |
| Воспроизведение проблемы `ts-reproduce` | да | да | 8 | 1 | 5 | 2 | 2 | 2 |
| Чтение логов `ts-logs` | да | да | 8 | 1 | 4 | 3 | 2 | 2 |
| HTTP и API `ts-http-api` | да | да | 8 | 1 | 8 | 3 | 3 | 1 |
| Сеть и доступность `ts-network` | да | да | 8 | 1 | 7 | 4 | 1 | 1 |
| Командная строка Linux `ts-linux` |  | да | 10 | 2 | 13 | 11 | 1 | 1 |
| SQL для поддержки `ts-sql` | да | да | 8 | 1 | 3 | 3 | 1 | 1 |
| Инструменты браузера `ts-devtools` |  | да | 5 | 1 | 4 | 2 | 1 | 1 |
| Интеграции и вебхуки `ts-integrations` |  | да | 5 | 1 | 4 | 1 | 1 | 2 |
| Инциденты и эскалация `ts-incidents` | да | да | 8 | 1 | 10 | 7 | 2 | 1 |
| Мониторинг и алерты `ts-monitoring` |  | да | 5 | 1 | 3 | 1 | 2 | 1 |
| Поиск первопричины `ts-rca` |  | да | 5 | 1 | 2 | 3 | 1 | 1 |
| Релизы, откаты и регрессии `ts-release` |  | да | 5 | 1 | 4 | 2 | 1 | 1 |
| Персональные данные и доступы `ts-privacy` |  | да | 5 | 1 | 4 | 1 | 1 | 1 |
| База знаний и runbook `ts-knowledge` |  | да | 5 | 1 | 4 | 2 | 1 | 0 |
| Общение с клиентом `ts-communication` | да | да | 8 | 1 | 5 | 3 | 3 | 2 |
| Метрики поддержки `ts-metrics` |  | да | 5 | 1 | 5 | 1 | 2 | 0 |
| Инструменты работы `ts-tools` |  | да | 5 | 1 | 3 | 3 | 2 | 0 |
| Поведенческие вопросы `ts-behavioral` |  | да | 5 | 1 | 8 | 2 | 7 | 0 |

### Распределение вопросов по темам

```
ts-support-role        ############............   5
ts-ticket-flow         ###################.....   8
ts-reproduce           ###################.....   8
ts-logs                ###################.....   8
ts-http-api            ###################.....   8
ts-network             ###################.....   8
ts-linux               ########################  10
ts-sql                 ###################.....   8
ts-devtools            ############............   5
ts-integrations        ############............   5
ts-incidents           ###################.....   8
ts-monitoring          ############............   5
ts-rca                 ############............   5
ts-release             ############............   5
ts-privacy             ############............   5
ts-knowledge           ############............   5
ts-communication       ###################.....   8
ts-metrics             ############............   5
ts-tools               ############............   5
ts-behavioral          ############............   5
```

### Пробелы

Пробелов не обнаружено.

## Трек: DevOps / Platform Engineer (`devops-platform`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Linux и командная строка `linux-basics` | да | да | 14 | 2 | 15 | 20 | 1 | 0 |
| Сети и протоколы `networking` | да | да | 8 | 1 | 5 | 8 | 2 | 1 |
| Git и работа с кодом `git-vcs` |  | да | 3 | 1 | 2 | 6 | 0 | 0 |
| CI/CD `ci-cd` | да | да | 8 | 1 | 4 | 5 | 2 | 1 |
| Контейнеры и Docker `containers` | да | да | 8 | 1 | 3 | 6 | 1 | 0 |
| Образы и реестры `images-registry` |  | да | 4 | 1 | 4 | 5 | 1 | 1 |
| Kubernetes `kubernetes` | да | да | 8 | 1 | 4 | 4 | 1 | 1 |
| Эксплуатация Kubernetes `k8s-operations` |  | да | 5 | 1 | 4 | 3 | 1 | 2 |
| Инфраструктура как код `iac` | да | да | 8 | 1 | 4 | 4 | 1 | 0 |
| Конфигурация и секреты `config-secrets` |  | да | 3 | 1 | 3 | 5 | 1 | 1 |
| Наблюдаемость `observability` | да | да | 8 | 1 | 5 | 8 | 2 | 1 |
| Надёжность и SLO `reliability-slo` | да | да | 8 | 1 | 4 | 4 | 1 | 1 |
| Инциденты и дежурства `incidents` |  | да | 3 | 1 | 4 | 5 | 1 | 1 |
| Стратегии выката `deployment-strategies` |  | да | 4 | 1 | 4 | 3 | 2 | 1 |
| Облачные основы `cloud-basics` |  | да | 2 | 1 | 2 | 3 | 0 | 0 |
| Безопасность конвейера `security-pipeline` |  | да | 3 | 1 | 5 | 11 | 1 | 1 |
| Базы данных в эксплуатации `databases-ops` |  | да | 3 | 1 | 3 | 4 | 2 | 2 |
| Скрипты и автоматизация `scripting` |  | да | 3 | 1 | 2 | 10 | 1 | 0 |
| Стоимость и ёмкость `cost-capacity` |  |  | 2 | 1 | 1 | 1 | 0 | 1 |
| Behavioral interview `behavioral-devops` |  | да | 3 | 1 | 6 | 5 | 8 | 0 |

### Распределение вопросов по темам

```
linux-basics           ########################  14
networking             ##############..........   8
git-vcs                #####...................   3
ci-cd                  ##############..........   8
containers             ##############..........   8
images-registry        #######.................   4
kubernetes             ##############..........   8
k8s-operations         #########...............   5
iac                    ##############..........   8
config-secrets         #####...................   3
observability          ##############..........   8
reliability-slo        ##############..........   8
incidents              #####...................   3
deployment-strategies  #######.................   4
cloud-basics           ###.....................   2
security-pipeline      #####...................   3
databases-ops          #####...................   3
scripting              #####...................   3
cost-capacity          ###.....................   2
behavioral-devops      #####...................   3
```

### Пробелы

Пробелов не обнаружено.

## Английский для IT

| Трек | Фразы | Слова | Задания | Письмо | Своих записей |
|---|---:|---:|---:|---:|---:|
| Junior SEO Specialist `redcore-junior-seo` | 64 | 51 | 16 | 39 | 23 |
| QA Engineer — платежи `qa-payments` | 64 | 49 | 13 | 38 | 17 |
| Technical Engineer `technical-engineer` | 64 | 47 | 14 | 37 | 15 |
| DevOps / Platform Engineer `devops-platform` | 64 | 46 | 13 | 38 | 14 |

## Распределение по сложности

| Коллекция | 1 | 2 | 3 |
|---|---:|---:|---:|
| Вопросы | 120 | 297 | 76 |
| Термины | 93 | 153 | 31 |
| Mock | 22 | 85 | 32 |
| Кейсы | 0 | 23 | 14 |
| Материалы | 64 | 126 | 34 |

## Источники

- всего: 236
- проверено (`verified: true`): 236
- требуют ручной проверки: 0
- не используются нигде: 9
- материалов библиотеки со статусом needs_review: 0

Неиспользуемые источники: `cisco-english-for-it1`, `cisco-english-for-it2`, `github-english-it-professionals`, `github-english-it-unhan`, `speak-tech-english`, `mdn-home`, `github-skills`, `youglish`, `cambridge-write-improve`

### Топ-10 самых цитируемых источников

| Источник | Ссылок |
|---|---:|
| `istqb-glossary` — ISTQB Glossary | 50 |
| `adyen-online-payments` — Online payments | 29 |
| `ahrefs-keyword-research` — Keyword Research: The Beginner's Guide | 28 |
| `stripe-payment-intents` — PaymentIntent lifecycle | 24 |
| `google-seo-starter-guide` — SEO Starter Guide | 23 |
| `google-spam-policies` — Spam policies for Google web search | 22 |
| `gsc-performance-report` — Performance report (Search results): Overview and basic setup | 21 |
| `google-helpful-content` — Creating helpful, reliable, people-first content | 20 |
| `stripe-webhooks` — Webhooks | 18 |
| `mdn-http-status` — HTTP response status codes | 17 |

## Записи без источника

- вопросов без `source_refs`: 136
- терминов без `source_refs`: 56

Часть записей без источника — норма: вопросы про поведение на собеседовании и коммуникацию не опираются на документацию.

## Свежесть контента

Волатильность объявлена на теме, дата сверки — на записи. Записи высоковолатильных тем обязаны нести `content_reviewed_at`.

- высоковолатильные темы: `analytics-ga4`, `igaming-context`, `indexing-gsc`, `seo-tools`
- среднего уровня: `off-page-seo`, `performance-cwv`, `technical-seo`
- записей под наблюдением: 71, без даты сверки: 0

| Дата сверки | Записей |
|---|---:|
| 2026-08-17 | 71 |

Вакансии под наблюдением: `redcore-junior-seo` — 2026-08-17

## План подготовки

- шагов всего: 93, обязательных: 90
- суммарная оценка времени: 5355 мин (~89.2 ч), из них обязательных 5225 мин (~87.1 ч)

