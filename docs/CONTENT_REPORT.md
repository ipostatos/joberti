# Отчёт о контенте

Сгенерирован `tools/generate_content_report.py` из `data/`.

## Количества

| Коллекция | Количество |
|---|---:|
| tracks | 4 |
| active_tracks | 2 |
| topics | 40 |
| vacancies | 2 |
| sources | 126 |
| lessons | 48 |
| glossary_terms | 156 |
| library_resources | 125 |
| questions | 222 |
| mock_questions | 72 |
| cases | 20 |
| roadmap_steps | 46 |
| story_templates | 18 |
| achievements | 24 |

## Трек: Junior SEO Specialist (`redcore-junior-seo`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Как работает поиск `search-basics` | да | да | 12 | 2 | 5 | 8 | 3 | 0 |
| Поисковый интент `search-intent` | да | да | 10 | 1 | 6 | 1 | 1 | 0 |
| On-page SEO `on-page` | да | да | 18 | 3 | 15 | 9 | 2 | 2 |
| HTML и HTTP `html-http` |  | да | 12 | 2 | 9 | 8 | 1 | 1 |
| Технический SEO `technical-seo` | да | да | 24 | 3 | 24 | 18 | 9 | 6 |
| Индексация и Search Console `indexing-gsc` | да | да | 10 | 2 | 9 | 7 | 3 | 2 |
| Сбор семантики `keyword-research` | да | да | 12 | 1 | 4 | 4 | 1 | 1 |
| Кластеризация и mapping `clustering-mapping` |  | да | 0 | 1 | 3 | 1 | 1 | 2 |
| Аналитика и GA4 `analytics-ga4` |  | да | 8 | 1 | 9 | 4 | 1 | 1 |
| Инструменты SEO `seo-tools` |  | да | 8 | 2 | 7 | 5 | 2 | 0 |
| Скорость и Core Web Vitals `performance-cwv` |  | да | 0 | 1 | 6 | 9 | 1 | 1 |
| Внутренняя перелинковка `internal-linking` |  | да | 0 | 1 | 6 | 0 | 2 | 0 |
| Международное SEO `international-seo` |  |  | 0 | 1 | 2 | 2 | 1 | 1 |
| Контентные ТЗ `content-briefs` |  | да | 0 | 1 | 3 | 2 | 1 | 1 |
| Конкурентный анализ `competitor-analysis` |  | да | 0 | 1 | 6 | 2 | 1 | 0 |
| Google Sheets для SEO `sheets` |  | да | 0 | 1 | 4 | 1 | 1 | 0 |
| Отчётность `reporting` |  | да | 6 | 1 | 11 | 5 | 6 | 2 |
| Работа с разработчиками `dev-communication` |  | да | 0 | 1 | 4 | 0 | 3 | 3 |
| Вопросы SEO-интервью `interview-seo` |  | да | 0 | 1 | 5 | 0 | 13 | 0 |
| Behavioral interview `behavioral` |  | да | 0 | 1 | 3 | 0 | 3 | 0 |

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
```

### Пробелы

- тема `internal-linking` без материалов библиотеки
- тема `dev-communication` без материалов библиотеки
- тема `interview-seo` без материалов библиотеки
- тема `behavioral` без материалов библиотеки

## Трек: QA Engineer — платежи (`qa-payments`) — статус `coming_soon`

_Трек не заполнен. Готовность по нему не рассчитывается._

## Трек: Technical Engineer (`technical-engineer`) — статус `coming_soon`

_Трек не заполнен. Готовность по нему не рассчитывается._

## Трек: DevOps / Platform Engineer (`devops-platform`) — статус `active`

### Покрытие тем

| Тема | Крит. | Обяз. | Тесты | Уроки | Термины | Материалы | Mock | Кейсы |
|---|:-:|:-:|---:|---:|---:|---:|---:|---:|
| Linux и командная строка `linux-basics` | да | да | 8 | 1 | 5 | 9 | 1 | 0 |
| Сети и протоколы `networking` | да | да | 8 | 1 | 5 | 7 | 2 | 1 |
| Git и работа с кодом `git-vcs` |  | да | 3 | 1 | 2 | 3 | 0 | 0 |
| CI/CD `ci-cd` | да | да | 8 | 1 | 4 | 5 | 2 | 1 |
| Контейнеры и Docker `containers` | да | да | 8 | 1 | 3 | 5 | 1 | 0 |
| Образы и реестры `images-registry` |  | да | 4 | 1 | 4 | 4 | 1 | 1 |
| Kubernetes `kubernetes` | да | да | 8 | 1 | 4 | 4 | 1 | 1 |
| Эксплуатация Kubernetes `k8s-operations` |  | да | 5 | 1 | 4 | 3 | 1 | 2 |
| Инфраструктура как код `iac` | да | да | 8 | 1 | 4 | 4 | 1 | 0 |
| Конфигурация и секреты `config-secrets` |  | да | 3 | 1 | 3 | 5 | 1 | 1 |
| Наблюдаемость `observability` | да | да | 8 | 1 | 5 | 8 | 2 | 1 |
| Надёжность и SLO `reliability-slo` | да | да | 8 | 1 | 4 | 4 | 1 | 1 |
| Инциденты и дежурства `incidents` |  | да | 3 | 1 | 1 | 3 | 1 | 1 |
| Стратегии выката `deployment-strategies` |  | да | 4 | 1 | 4 | 3 | 2 | 1 |
| Облачные основы `cloud-basics` |  | да | 2 | 1 | 2 | 0 | 0 | 0 |
| Безопасность конвейера `security-pipeline` |  | да | 3 | 1 | 5 | 10 | 1 | 1 |
| Базы данных в эксплуатации `databases-ops` |  | да | 3 | 1 | 3 | 3 | 2 | 2 |
| Скрипты и автоматизация `scripting` |  | да | 3 | 1 | 2 | 2 | 1 | 0 |
| Стоимость и ёмкость `cost-capacity` |  |  | 2 | 1 | 1 | 1 | 0 | 1 |
| Behavioral interview `behavioral-devops` |  | да | 3 | 1 | 0 | 0 | 8 | 0 |

### Распределение вопросов по темам

```
linux-basics           ########################   8
networking             ########################   8
git-vcs                #########...............   3
ci-cd                  ########################   8
containers             ########################   8
images-registry        ############............   4
kubernetes             ########################   8
k8s-operations         ###############.........   5
iac                    ########################   8
config-secrets         #########...............   3
observability          ########################   8
reliability-slo        ########################   8
incidents              #########...............   3
deployment-strategies  ############............   4
cloud-basics           ######..................   2
security-pipeline      #########...............   3
databases-ops          #########...............   3
scripting              #########...............   3
cost-capacity          ######..................   2
behavioral-devops      #########...............   3
```

### Пробелы

- тема `cloud-basics` без материалов библиотеки
- тема `behavioral-devops` без терминов словаря
- тема `behavioral-devops` без материалов библиотеки

## Распределение по сложности

| Коллекция | 1 | 2 | 3 |
|---|---:|---:|---:|
| Вопросы | 48 | 132 | 42 |
| Термины | 47 | 90 | 19 |
| Mock | 11 | 41 | 20 |
| Кейсы | 0 | 12 | 8 |
| Материалы | 32 | 72 | 21 |

## Источники

- всего: 126
- проверено (`verified: true`): 126
- требуют ручной проверки: 0
- не используются нигде: 0
- материалов библиотеки со статусом needs_review: 0

### Топ-10 самых цитируемых источников

| Источник | Ссылок |
|---|---:|
| `ahrefs-keyword-research` — Keyword Research: The Beginner's Guide | 28 |
| `google-seo-starter-guide` — SEO Starter Guide | 23 |
| `gsc-performance-report` — Performance report (Search results): Overview and basic setup | 21 |
| `google-helpful-content` — Creating helpful, reliable, people-first content | 18 |
| `google-crawl-budget` — Large site owner's guide to managing your crawl budget | 14 |
| `google-javascript-seo` — Understand JavaScript SEO basics | 14 |
| `google-how-search-works` — In-depth guide to how Google Search works | 13 |
| `google-canonicalization` — What is URL canonicalization | 13 |
| `google-301-redirects` — Redirects and Google Search | 12 |
| `ga4-dimensions-metrics` — Analytics dimensions and metrics | 12 |

## Записи без источника

- вопросов без `source_refs`: 1
- терминов без `source_refs`: 9

Часть записей без источника — норма: вопросы про поведение на собеседовании и коммуникацию не опираются на документацию.

## План подготовки

- шагов всего: 46, обязательных: 44
- суммарная оценка времени: 2355 мин (~39.2 ч), из них обязательных 2270 мин (~37.8 ч)

