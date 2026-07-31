#!/usr/bin/env bash
# Пост-деплойная проверка и перезапуск НА СЕРВЕРЕ.
#
# ВАЖНО: на сервере НЕТ git-репозитория — код туда попадает архивом с рабочей
# машины (см. deploy/release.sh). Этот скрипт выполняет всё, что должно
# происходить ПОСЛЕ распаковки: зависимости, валидация, тесты, бэкап,
# перезапуск, смоук. Порядок важен: сначала убеждаемся, что новая версия
# собирается и проходит тесты, и только потом трогаем работающие сервисы.
#
# Запуск (на сервере, от root или от пользователя сервиса):
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

echo "==> Зависимости"
"$VENV/bin/pip" install -q -r requirements.txt
"$VENV/bin/pip" install -q -r api/requirements.txt

echo "==> Данные Mini App актуальны"
# Сгенерированные файлы лежат в репозитории и приезжают архивом; здесь только
# сверяем, что они не отстали от data/ (и что лишние файлы не остались).
"$VENV/bin/python" tools/build_webapp_data.py --check

echo "==> Валидация контента"
"$VENV/bin/python" tools/validate_content.py --quiet

echo "==> Тесты"
# По каталогу, а не списком: перечисление руками уже отставало от реальности
# в других местах этого проекта (страницы в смоуке, треки в проверках).
for f in tests/test_*.py; do
  "$VENV/bin/python" "$f"
done

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
if [ "$(id -u)" -eq 0 ]; then
  systemctl restart interview-trainer-api
  systemctl restart interview-trainer-bot
else
  sudo systemctl restart interview-trainer-api
  sudo systemctl restart interview-trainer-bot
fi

sleep 2
echo "==> Проверка после выката"
API_PORT="$(grep -s '^API_PORT=' .env | cut -d= -f2 || true)"
API_PORT="${API_PORT:-4200}" BASE="${BASE:-}" bash deploy/smoke.sh

echo "==> Готово"
systemctl --no-pager --lines=5 status interview-trainer-api || true
systemctl --no-pager --lines=5 status interview-trainer-bot || true
