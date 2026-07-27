#!/usr/bin/env bash
# Быстрый выкат ТОЛЬКО статики Mini App, без перезапуска бота и API.
#
# Нужен, когда меняется контент или интерфейс: перезапускать бота ради правки
# формулировки в уроке незачем, а лишний рестарт рвёт активные диалоги.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/interview-trainer}"
SERVICE_USER="${SERVICE_USER:-interview}"
VENV="$APP_DIR/.venv"

cd "$APP_DIR"

echo "==> Забираем изменения"
git fetch --all
git reset --hard origin/main

echo "==> Пересборка данных Mini App"
"$VENV/bin/python" tools/build_webapp_data.py

echo "==> Валидация контента"
"$VENV/bin/python" tools/validate_content.py --quiet

if command -v node >/dev/null 2>&1; then
  echo "==> Проверки Mini App"
  node webapp/_sw_check.mjs
  node webapp/_nav_check.mjs
  node webapp/_readiness_check.mjs
  node webapp/_search_check.mjs
fi

echo "==> Права на файлы"
if [ "$(id -u)" -eq 0 ]; then
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR/webapp"
fi

echo "==> Готово"
echo "Статика обновлена. Перезапуск сервисов не требуется."
echo "Пользователям может потребоваться обновить страницу: service worker"
echo "работает по стратегии network-first и подтянет новую версию сам."
