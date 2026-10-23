# Сторонние материалы

## milanm/DevOps-Roadmap

| | |
|---|---|
| Репозиторий | https://github.com/milanm/DevOps-Roadmap |
| Ветка | `master` |
| Reference commit | `d7499e6dabe2fc54be85a28952080c0b6be857b3` (2026-07-14) |
| Лицензия | Apache License 2.0 |
| Автор | Milan Milanović и соавторы репозитория |

**Как используется.** Трек `devops-platform` (RedCore Junior DevOps / DutyOps)
опирается на DevOps-Roadmap как на **карту тем** и **каталог дополнительных
материалов**: разделы roadmap (Git, язык программирования, Linux и скрипты, сеть
и безопасность, управление серверами, контейнеры, оркестрация, IaC, CI/CD,
мониторинг, облако, инженерные практики, DevSecOps) сопоставлены с требованиями
вакансии в `data/vacancies.json` (поле `skill_matrix[].roadmap_ref`) и в
`docs/REDCORE_DEVOPS_TRACK.md`.

**Что НЕ заимствовано.** Текст README, иллюстрации и PDF roadmap в Joberti не
копируются. Уроки, вопросы, лабораторные, кейсы, DutyOps-упражнения и словарь
написаны отдельно; для фактов приоритет у официальной документации (nginx.org,
prometheus.io, grafana.com, postgresql.org, mongodb.com, clickhouse.com,
docs.ansible.com, developer.hashicorp.com, kubernetes.io, docs.aws.amazon.com,
cloud.google.com, developers.cloudflare.com, docs.nats.io, redis.io, man-страницы).

**Ссылки из roadmap.** Часть материалов библиотеки взята из списка ресурсов
roadmap. Такие записи помечены в `data/library.json` полями
`"source_origin": "milanm-devops-roadmap"` и `"reference_commit"`. Ссылка ведёт на
исходный ресурс его автора; права на сам ресурс принадлежат его автору.

**Порядок изучения** в Joberti задаёт вакансия, а не порядок разделов README:
сначала то, без чего ломается интервью DutyOps (Linux, сеть, Nginx, Bash, Docker,
CI/CD, разбор инцидентов), затем технический стек вакансии, затем плюсы.

Текст лицензии Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0

## Иконки

Контуры иконок — [Lucide](https://lucide.dev), лицензия ISC. Пути встроены в
`webapp/icons.js`, внешние CDN не используются.
