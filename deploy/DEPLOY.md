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

```bash
sudo -u interview git clone <адрес-репозитория> /opt/interview-trainer
cd /opt/interview-trainer

sudo -u interview python3.12 -m venv .venv
sudo -u interview .venv/bin/pip install -r requirements.txt
sudo -u interview .venv/bin/pip install -r api/requirements.txt
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

## 4. Сборка данных Mini App

```bash
sudo -u interview .venv/bin/python tools/build_webapp_data.py
sudo -u interview .venv/bin/python tools/validate_content.py
```

Без этого шага `webapp/generated/content_data.js` отсутствует, и приложение
открывается пустым.

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
help - Справка
stats - Статистика ответов в чате
privacy - Данные и приватность
```

## 8. Проверка после выката

```bash
BASE=https://ваш-домен bash deploy/smoke.sh
```

Скрипт проверяет: API отвечает, доступ без initData закрыт, страницы Mini App
отдаются, заголовки безопасности на месте, данные не пустые.

## Обновление

```bash
sudo -u interview bash deploy/update.sh
```

Скрипт сначала прогоняет тесты и делает бэкап базы и только потом
перезапускает сервисы.

Только контент или интерфейс, без рестарта сервисов:

```bash
sudo -u interview bash deploy/update_webapp.sh
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

```bash
cd /opt/interview-trainer
sudo -u interview git log --oneline -10
sudo -u interview git reset --hard <нужный-коммит>
sudo -u interview .venv/bin/python tools/build_webapp_data.py
sudo chown -R interview:interview /opt/interview-trainer
sudo systemctl restart interview-trainer-api interview-trainer-bot
bash deploy/smoke.sh
```

Данные пользователей при откате кода не страдают: они в `api/state.db`,
а схема базы обратно совместима. Если откат затрагивает схему, сначала
восстановите базу из `api/backups/`.

## Диагностика

| Симптом | Где смотреть |
|---|---|
| Бот не отвечает | `journalctl -u interview-trainer-bot -n 100` |
| Кнопка Mini App не появилась | `WEBAPP_BASE` в `.env`, обязательно https; перезапуск бота |
| Приложение открывается пустым | не собран `webapp/generated/content_data.js` |
| Прогресс не синхронизируется | `journalctl -u interview-trainer-api`, затем `curl -s localhost:4200/api/health` |
| «server misconfigured» от API | `BOT_TOKEN` не попал в окружение сервиса: проверьте `EnvironmentFile` |
| Сервис не стартует, код 226/NAMESPACE | каталог из `ReadWritePaths` не существует или принадлежит другому пользователю |
| После выката видна старая версия | проверьте заголовки кэша Caddy для `service-worker.js` |
