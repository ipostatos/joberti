# Развёртывание бота и Mini App

Инструкция для Linux-сервера с systemd и Caddy. API описан отдельно —
см. [DEPLOY_API.md](DEPLOY_API.md).

## 1. Отдельный пользователь

Сервис не должен работать от root: при компрометации бота это означало бы
компрометацию всей машины.

```bash
sudo useradd --system --create-home --home-dir /opt/interview-trainer \
             --shell /usr/sbin/nologin interview
```

## 2. Код и окружение

**На сервере НЕТ git-репозитория** — код попадает туда архивом с рабочей
машины (см. раздел «Обновление»). Первичная установка:

```bash
# на рабочей машине, из корня репозитория:
git archive --format=tar HEAD | ssh root@сервер \
  "tar -x -C /opt/interview-trainer && chown -R interview:interview /opt/interview-trainer"

# дальше на сервере:
cd /opt/interview-trainer

sudo -u interview python3.12 -m venv .venv
sudo -u interview .venv/bin/pip install -r requirements.txt
sudo -u interview .venv/bin/pip install -r api/requirements.txt

# progress/ в .gitignore, поэтому его нет ни в клоне, ни в архиве. Сам бот его
# не создаст: юнит работает с ProtectSystem=strict, и всё, чего нет в
# ReadWritePaths на момент старта, остаётся только для чтения.
sudo -u interview mkdir -p progress
```

## 3. Конфигурация

```bash
sudo -u interview cp .env.example .env
sudo -u interview nano .env
sudo chmod 600 /opt/interview-trainer/.env
```

Минимум для работы:

```dotenv
BOT_TOKEN=<токен от @BotFather>
WEBAPP_BASE=https://ваш-домен
SYNC_ENABLED=true
DATABASE_PATH=api/state.db
```

`WEBAPP_BASE` обязан быть **https**: Telegram не открывает Mini App по http.
Если адрес не https, бот сам уходит в упрощённый чат-режим и пишет об этом
в лог — это защита от нерабочей кнопки, а не ошибка.

## 4. Данные Mini App

Сгенерированные данные (`webapp/generated/content_core.js` и
`content_track_<id>.js`) лежат в репозитории и приезжают вместе с архивом.
На сервере достаточно сверить их с data/:

```bash
sudo -u interview .venv/bin/python tools/build_webapp_data.py --check
sudo -u interview .venv/bin/python tools/validate_content.py
```

## 5. systemd

```bash
sudo cp deploy/interview-trainer-bot.service /etc/systemd/system/
sudo cp deploy/interview-trainer-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now interview-trainer-api
sudo systemctl enable --now interview-trainer-bot
```

Проверка:

```bash
systemctl status interview-trainer-bot
journalctl -u interview-trainer-bot -n 50 --no-pager
```

## 6. Caddy

```bash
sudo cp deploy/Caddyfile.example /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile      # заменить example.org на свой домен
sudo systemctl reload caddy
```

## 7. BotFather

1. `/setmenubutton` → выбрать бота → указать `https://ваш-домен/index.html`.
   Бот делает это и сам при старте, но ручная настройка надёжнее.
2. `/setprivacy` → **Enable**. Бот работает только в личных чатах и не должен
   видеть сообщения групп.
3. `/setcommands`:

```
start - Начать и открыть тренажёр
menu - Что доступно в чате
track - Выбрать трек подготовки
help - Справка
stats - Статистика ответов в чате
privacy - Данные и приватность
```

## 8. Проверка после выката

```bash
# API_PORT обязателен, если в .env он не 4200 (на проде — 4500):
API_PORT=$(grep ^API_PORT= .env | cut -d= -f2) \
  BASE=https://ваш-домен bash deploy/smoke.sh
```

Скрипт проверяет: API отвечает (локально И через reverse-proxy), доступ без
initData закрыт (включая POST и DELETE), бот-сервис активен, бэкап не старше
48 часов, страницы Mini App отдаются, заголовки безопасности и кэша на месте,
данные не пустые.

## Обновление

С рабочей машины, из корня репозитория:

```bash
HOST=root@сервер BASE=https://ваш-домен bash deploy/release.sh
```

`release.sh` делает всё сам: архивирует HEAD, распаковывает на сервере с
правильным владельцем, **удаляет файлы, исчезнувшие из репозитория** (tar -x
сам этого не делает — переименованная страница продолжала бы отдаваться со
старым содержимым), затем запускает на сервере `deploy/update.sh`: зависимости,
валидация, тесты, бэкап базы, перезапуск сервисов и смоук.

Если код уже доставлен на сервер другим способом, пост-деплойную часть можно
запустить отдельно (на сервере):

```bash
bash deploy/update.sh
```

### ⚠️ Права на файлы

Самая частая авария при выкате — файлы, оказавшиеся во владении другого
пользователя: сервис перестаёт писать в свои каталоги и падает при старте.
Если выкат делался от root или по rsync, обязательно:

```bash
sudo chown -R interview:interview /opt/interview-trainer
```

`update.sh` делает это сам, когда запущен от root.

## Откат

Откат — это выкат старого коммита с рабочей машины (на сервере git нет):

```bash
git log --oneline -10                # найти нужный коммит
git checkout <нужный-коммит>
HOST=root@сервер BASE=https://ваш-домен bash deploy/release.sh
git checkout main                    # вернуть рабочую копию
```

Данные пользователей при откате кода не страдают: они в `api/state.db`,
а схема базы обратно совместима. Если откат затрагивает схему, сначала
восстановите базу из `api/backups/`.

## Диагностика

| Симптом | Где смотреть |
|---|---|
| Бот не отвечает | `journalctl -u interview-trainer-bot -n 100` |
| Кнопка Mini App не появилась | `WEBAPP_BASE` в `.env`, обязательно https; перезапуск бота |
| Приложение открывается пустым | `webapp/generated/` отстал от data/: `build_webapp_data.py --check` |
| Прогресс не синхронизируется | `journalctl -u interview-trainer-api`, затем `curl -s localhost:$API_PORT/api/health` (порт в `.env`, НЕ 4200 по умолчанию) |
| «server misconfigured» от API | `BOT_TOKEN` не попал в окружение сервиса: проверьте `EnvironmentFile` |
| Сервис не стартует, код 226/NAMESPACE | каталог из `ReadWritePaths` не существует или принадлежит другому пользователю |
| После выката видна старая версия | проверьте заголовки кэша Caddy для `service-worker.js` |
