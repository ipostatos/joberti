# RedCore Junior DevOps / DutyOps — устройство трека

Трек `devops-platform` готовит к одной конкретной вакансии и честно отделяет
«готов к собеседованию» от «закрываю требования вакансии». Этот документ —
для того, кто будет обновлять вакансию, контент или правила оценки.

## 1. Вакансия

| | |
|---|---|
| ID в данных | `redcore-junior-devops-tatech-23211` (`data/vacancies.json`) |
| Название | Tech / DevOps Engineer, Junior, PL COM, Remote |
| Компания | RedCore |
| Код | TATECH-23211 |
| Ссылка | https://redcore.group/vacancy/tatech-23211/ |
| `source_status` | **`needs_review`** |
| `source_verified_at` | `null` |
| `source_snapshot_at` | 2026-10-23 |

**Почему `needs_review`.** Текст требований перенесён из постановки задачи.
При обновлении трека 2026-10-23 страницу вакансии не удалось открыть из рабочей
среды: загрузчик страниц вернул ошибку, исходящий HTTP из оболочки закрыт
списком разрешённых адресов, браузер не был подключён. Сверки с живой страницей
не было, поэтому вакансия не помечена как проверенная. Mini App показывает это
прямо на экране вакансии.

**Основные задачи роли (DutyOps):** дежурный мониторинг инфраструктуры; разбор
и устранение сбоев по runbook; мониторинг доставки трафика к продукту через
зеркала; восстановление доставки трафика в пределах полномочий DutyOps;
коммуникация в инцидентных и SOS-каналах; оптимизация процессов DutyOps.

**Чего мы не знаем.** Внутреннее устройство инфраструктуры RedCore публично не
описано. Всё, что касается их зеркал, схемы дежурств, инструментов алертинга,
SLA и границ полномочий, в тренажёре помечено как «неизвестно — уточнить у
интервьюера» и вынесено в вопросы, которые стоит задать на собеседовании.
Контент не выдумывает «как у них устроено».

### Как обновить вакансию

1. Откройте страницу вакансии и сравните требования с
   `requirements[].requirement` в `data/vacancies.json`.
2. Если текст совпадает — поставьте `source_status: "verified"` и
   `source_verified_at: "<YYYY-MM-DD>"`, обновите `source_snapshot_at`.
3. Если требования изменились — правьте `requirements` (новый `id` с префиксом
   `rc-req-`, `importance`: `required`/`desirable`, `kind`: `skill` или
   `experience`), привяжите `topic_ids` и `lab_ids`; валидатор проверит, что
   каждое обязательное требование связано с темой и лабораторной (кроме
   требований к опыту) и что у каждой ссылки есть адресат.
4. `python tools/validate_content.py && python tools/build_webapp_data.py`,
   затем `bash run_all_checks.sh`.

## 2. Требования и их покрытие

Вес в Requirement Coverage: required 3, plus (`desirable`) 2, nice 1. Статусы:
`confirmed` 1.0, `partial` 0.55, `learning` 0.25, `not_started` 0,
`unverified_experience` 0. `confirmed` засчитывается только при заполненном
доказательстве пользователя; без него экран показывает «заявлено без
доказательств». Требование к опыту (`kind: experience`) нельзя «выучить»:
пройденные лабораторные видны отдельной колонкой «учебное покрытие», но в
процент покрытия не идут.

| Требование | Вес | Вид | Темы | Лабораторные |
|---|---|---|---|---|
| Опыт администрирования Linux от 2 лет | required (3) | опыт | `linux-basics` | — |
| Установка и настройка ПО из командной строки Linux | required (3) | навык | `linux-basics` | `lab-linux-systemd-002`, `lab-linux-permissions-003`, `lab-linux-disk-004` |
| TCP/IP | required (3) | навык | `networking` | `lab-net-port-009`, `lab-net-routing-011` |
| HTTP и HTTPS | required (3) | навык | `networking`, `nginx-proxy` | `lab-net-chain-007`, `lab-net-tls-010` |
| DNS | required (3) | навык | `networking`, `traffic-delivery` | `lab-net-dns-008` |
| Проксирование через Nginx | required (3) | навык | `nginx-proxy` | `lab-nginx-proxy-012`, `lab-nginx-502-013`, `lab-nginx-upstream-014` |
| Prometheus | required (3) | навык | `monitoring-prometheus`, `observability` | `lab-mon-scrape-024`, `lab-mon-alert-025` |
| Grafana | required (3) | навык | `monitoring-prometheus` | `lab-mon-grafana-026` |
| Язык запросов к логам (LogQL) | required (3) | навык | `logging-loki` | `lab-log-loki-027` |
| PostgreSQL | required (3) | навык | `databases-ops` | `lab-db-pg-backup-028`, `lab-db-pg-connections-029` |
| MongoDB | required (3) | навык | `mongodb-ops` | `lab-db-mongo-rs-030` |
| ClickHouse | required (3) | навык | `clickhouse-ops` | `lab-db-clickhouse-031` |
| Установка, поддержка и кластеризация СУБД | required (3) | навык | `databases-ops`, `mongodb-ops`, `clickhouse-ops` | `lab-db-mongo-rs-030`, `lab-db-pg-backup-028` |
| Понимание CI/CD | required (3) | навык | `ci-cd`, `security-pipeline` | `lab-ci-gitlab-019`, `lab-ci-failure-020` |
| Понимание Terraform | required (3) | навык | `iac` | `lab-iac-tf-state-032`, `lab-iac-tf-drift-033` |
| Понимание Ansible | required (3) | навык | `ansible-config` | `lab-iac-ansible-034` |
| Git: ветвление и Git Flow | required (3) | навык | `git-vcs` | `lab-git-conflict-018` |
| AWS | required (3) | навык | `aws-eks`, `cloud-basics` | `lab-cloud-aws-arch-041`, `lab-cloud-aws-iam-042` |
| GCP | required (3) | навык | `gcp-basics`, `cloud-basics` | `lab-cloud-gcp-044` |
| Kubernetes | required (3) | навык | `kubernetes`, `k8s-operations` | `lab-k8s-deploy-035`, `lab-k8s-crashloop-036`, `lab-k8s-oom-probes-037`, `lab-k8s-pending-038` |
| EKS | required (3) | навык | `aws-eks`, `kubernetes` | `lab-cloud-eks-043` |
| Docker | required (3) | навык | `containers`, `images-registry` | `lab-docker-multistage-021`, `lab-docker-network-022`, `lab-docker-restart-023` |
| Простые скрипты автоматизации на Bash и Python | required (3) | навык | `scripting` | `lab-script-healthcheck-015`, `lab-script-idempotent-016`, `lab-script-python-017` |
| Cloudflare | plus (2) | навык | `edge-cloudflare`, `traffic-delivery` | `lab-edge-cloudflare-045` |
| Cloudflare Custom Hostnames | plus (2) | навык | `edge-cloudflare`, `traffic-delivery` | `lab-edge-cloudflare-045` |
| DNS, WAF и CDN на периметре | plus (2) | навык | `edge-cloudflare`, `traffic-delivery`, `networking` | `lab-edge-cloudflare-045` |
| NATS | plus (2) | навык | `redis-nats` | `lab-msg-nats-046` |
| Redis | plus (2) | навык | `redis-nats` | `lab-cache-redis-047` |
| Jira | plus (2) | навык | `dutyops-runbooks` | — |

## 3. Матрица навыков и связь с DevOps-Roadmap

Уровни: L0 — слышал; L1 — объясню назначение; L2 — могу установить и настроить
базово; L3 — могу диагностировать типовой сбой; L4 — могу самостоятельно
эксплуатировать. Цель — минимальный уровень, с которым идти на это
собеседование. Приоритет: P0 — без этого DutyOps-интервью не пройти, P1 —
стек вакансии, P2 — плюсы.

Колонка «Раздел DevOps-Roadmap» — ссылка на раздел
[milanm/DevOps-Roadmap](https://github.com/milanm/DevOps-Roadmap) (коммит
`d7499e6`, Apache-2.0). Roadmap использован как карта тем и каталог
дополнительных материалов; порядок изучения задаёт вакансия. Текст README
roadmap не копировался. Материалы библиотеки, взятые из его списка ресурсов,
помечены `source_origin: "milanm-devops-roadmap"` и `reference_commit`.
Подробности — в [THIRD_PARTY.md](../THIRD_PARTY.md).

| Домен | Приоритет | Цель | Раздел DevOps-Roadmap |
|---|---|---|---|
| Linux | P0 | L4 | 3. Linux & Scripting; 5. Server Management |
| Сеть: TCP/IP, DNS, HTTP, TLS | P0 | L3 | 4. Networking & Security |
| Nginx | P0 | L3 | 5. Server Management |
| Bash и Python | P0 | L3 | 2. Programming language; 3. Linux & Scripting |
| Git и CI/CD | P0 | L3 | 1. Git; 9. CI/CD; Bonus: DevSecOps |
| Docker | P0 | L3 | 6. Containers |
| DutyOps и инциденты | P0 | L3 | 10. Monitoring & Observability; 12. Software Engineering Practices |
| Prometheus и Grafana | P1 | L3 | 10. Monitoring & Observability |
| Логи: Loki и LogQL | P1 | L3 | 10. Monitoring & Observability |
| PostgreSQL | P1 | L3 | 5. Server Management |
| MongoDB | P1 | L2 | 5. Server Management |
| ClickHouse | P1 | L2 | 5. Server Management |
| Terraform | P1 | L2–L3 | 8. Infrastructure as Code |
| Ansible | P1 | L2–L3 | 8. Infrastructure as Code |
| Kubernetes | P1 | L3 | 7. Container Orchestration |
| EKS | P1 | L2 | 7. Container Orchestration; 11. Cloud provider |
| AWS | P1 | L2–L3 | 11. Cloud provider |
| GCP | P1 | L2 | 11. Cloud provider |
| Cloudflare: DNS, CDN, WAF | P2 | L2 | 4. Networking & Security |
| Redis | P2 | L2–L3 | 5. Server Management |
| NATS | P2 | L1–L2 | — |

## 4. Лабораторные

48 заданий в `data/labs.json`. Выполняются на своей машине, в одноразовой VM
или в контейнерах; облачные (`environment: cloud-optional`) необязательны и
всегда идут с `cost_warning`, `cleanup_steps` и `local_alternative`. Для базовой
готовности платный аккаунт не нужен.

Mini App не проверяет чужую среду. Выполнение = все критерии успеха отмечены +
заметка-доказательство (до 1000 символов) + post-check из двух вопросов
банка. Уверенность лабораторной: выполнена 0.4, плюс 0.4 × лучший результат
post-check, плюс 0.2 за повторное прохождение. Синхронизация не теряет
попытки, выполнение и лучший post-check; заметка берётся с более свежего
устройства.

Деструктивные команды (`rm -rf`, `dd`, `mkfs`, `terraform destroy`,
`kubectl delete`, `DROP DATABASE`) встречаются только в лабораторных, где в
`safety_notes` сказано, что стенд одноразовый; это проверяет валидатор.

| Домен лабораторных | core | important | optional |
|---|---:|---:|---:|
| cloud | 0 | 2 | 2 |
| databases | 1 | 3 | 0 |
| docker | 3 | 0 | 0 |
| dutyops | 1 | 0 | 0 |
| edge | 0 | 1 | 0 |
| git-cicd | 2 | 1 | 0 |
| iac | 2 | 1 | 0 |
| kubernetes | 2 | 2 | 2 |
| linux | 4 | 2 | 0 |
| messaging | 0 | 1 | 1 |
| monitoring | 3 | 1 | 0 |
| networking | 3 | 1 | 1 |
| nginx | 2 | 1 | 0 |
| scripting | 1 | 2 | 0 |

Core-домены (без лабораторной в каждом из них готовность ограничена 69%):
linux, networking, nginx, docker, monitoring, databases, iac, kubernetes.

## 5. DutyOps

`data/dutyops.json`: 8 drills и 7 runbook-разборов. Drill — пошаговый сценарий
дежурства: на каждом шаге 3–4 варианта, лучший оценивается в 2 балла,
допустимый в 1, вредный в 0. Оценивается последовательность решений: первая
проверка, сдерживание, эскалация, коммуникация. После прохождения показываются
эталонная последовательность, граница полномочий («что дежурный делает сам, а
что эскалирует») и пример сообщения в инцидентный канал. Runbook-разбор идёт по
фазам в фиксированном порядке: trigger → scope → first checks → safe actions →
escalation boundary → rollback/recovery → verification → communication →
aftercare.

## 6. Готовность

Профиль `devops-platform` в `webapp/readiness.js`:

| Блок | Вес |
|---|---:|
| Знания (тесты, SRS) | 25 |
| Лабораторные | 30 |
| Инциденты (кейсы + drills) | 20 |
| Mock interview | 15 |
| Словарь | 5 |
| План | 5 |

Потолки срабатывают, только если действительно снижают процент; экран
объясняет «Почему сейчас максимум X%»:

| Условие | Потолок |
|---|---:|
| Не пройдена диагностика | 59% |
| Меньше 6 лабораторных | 64% |
| Покрытие обязательных тем < 65% | 64% |
| Нет лабораторной в core-домене | 69% |
| Критическая тема < 50% | 69% |
| Меньше 5 разобранных инцидентов | 74% |
| Нет полной mock-сессии | 79% |

У остальных треков профиль `default`, их готовность не изменилась (эталон —
`webapp/_readiness_legacy_golden.json`, проверка — `_readiness_legacy.mjs`).

**Диагностика** «Проверить мой текущий уровень»: 56 вопросов — 48 вперемешку по всем
доменам и 8 сценарных, выборка детерминированная, без подсказок по ходу.
Итог: сильные домены (≥ 75%), слабые (< 50%), критические пробелы (слабые P0),
5 следующих действий и быстрый путь по плану. Отметки «делал руками» в
диагностике на процент готовности не влияют.

**План на день** в единицах: повторение 1, mock 3, drill 5, кейс 8, лабораторная
10, шаг плана 4. На главном экране — не больше 4 действий.

## 7. План подготовки

36 шагов (34 обязательных) в шести фазах: Основа → Доставка → Наблюдаемость и
данные → Инфраструктура → DutyOps → Интервью. Все 22 прежних ID шагов
сохранены с тем же смыслом (`tests/fixtures/devops_baseline_ids.json`). Условия
завершения могут требовать выполненных лабораторных (`lab_completed_min`),
drills (`drill_completed_min`) и диагностики (`diagnostic_done`).

## 8. Объём контента

| | До (b5a6fd1) | После |
|---|---:|---:|
| Уроки | 21 | 39 |
| Вопросы | 108 | 260 |
| — scenario | — | 32% |
| — command_output | — | 21% |
| — troubleshooting_order | — | 12% |
| Термины | 61 | 149 |
| Mock | 26 | 56 |
| Кейсы | 8 | 32 |
| Лабораторные | 0 | 48 |
| DutyOps drills + runbooks | 0 | 15 |
| Шаги плана | 22 | 36 |
| Истории STAR | 6 | 12 |
| Темы | 20 | 32 |

## 9. Известные пробелы и допущения

* Текст вакансии не сверен с живой страницей (`needs_review`).
* Лабораторные написаны и вычитаны, но не прогонялись целиком на чистой VM:
  версии образов и вывод команд могут разойтись с описанием.
* Требование «опыт администрирования Linux от 2 лет» тренажёр закрыть не
  может; в mock есть честные ответы на неудобные вопросы о нехватке опыта.
* В drills лучший вариант нередко самый развёрнутый — угадывать по длине
  можно; варианты перемешиваются, но не выравниваются по длине.
* Jira не имеет лабораторной: это инструмент процесса, а не навык настройки.
* Сгенерированный файл трека — около 2,5 МБ (≈600 КБ в gzip).
