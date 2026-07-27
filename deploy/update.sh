#!/usr/bin/env bash
# Обновление бота и API на сервере.
#
# Порядок важен: сначала проверяем, что новая версия вообще собирается и
# проходит тесты, и только потом перезапускаем сервисы. Иначе выкат ломает
# работающий бот, а откатываться приходится под нагрузкой.
#
# Запуск (от пользователя сервиса, НЕ от root):
#   bash deploy/update.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/interview-trainer}"
SERVICE_USER="${SERVICE_USER:-interview}"
VENV="$APP_DIR/.venv"

cd "$APP_DIR"

echo "==> Проверка прав"
# Права на файлы — источник самых обидных аварий: после выката от чужого
# пользователя сервис не может писать в свои каталоги и падает при старте.
if [ "$(id -un)" != "$SERVICE_USER" ] && [ "$(id -u)" -ne 0 ]; then
  echo "ОШИБКА: запускайте от $SERVICE_USER или от root" >&2
  exit 1
fi

echo "==> Забираем изменения"
git fetch --all
git reset --hard origin/main

echo "==> Зависимости"
"$VENV/bin/pip" install -q -r requirements.txt
"$VENV/bin/pip" install -q -r api/requirements.txt

echo "==> Пересборка данных Mini App"
"$VENV/bin/python" tools/build_webapp_data.py

echo "==> Валидация контента"
"$VENV/bin/python" tools/validate_content.py --quiet

echo "==> Тесты"
"$VENV/bin/python" tests/test_content.py
"$VENV/bin/python" tests/test_sync.py
"$VENV/bin/python" tests/test_api.py
"$VENV/bin/python" tests/test_bot.py
"$VENV/bin/python" tests/test_security.py

if command -v node >/dev/null 2>&1; then
  echo "==> Проверки Mini App"
  for f in webapp/_*.mjs; do node "$f"; done
else
  echo "ПРЕДУПРЕЖДЕНИЕ: node не установлен, проверки Mini App пропущены"
fi

echo "==> Бэкап базы перед перезапуском"
bash deploy/backup_db.sh

echo "==> Права на файлы"
# Обязательный шаг: если выкат делался от другого пользователя, сервис не
# сможет писать в progress/ и api/ и упадёт при первом же обращении.
if [ "$(id -u)" -eq 0 ]; then
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
fi

echo "==> Перезапуск сервисов"
sudo systemctl restart interview-trainer-api
sudo systemctl restart interview-trainer-bot

sleep 2
echo "==> Проверка после выката"
bash deploy/smoke.sh

echo "==> Готово"
systemctl --no-pager --lines=5 status interview-trainer-api || true
systemctl --no-pager --lines=5 status interview-trainer-bot || true
