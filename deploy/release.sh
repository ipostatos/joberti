#!/usr/bin/env bash
# Выкат С РАБОЧЕЙ МАШИНЫ на сервер.
#
# На сервере нет git-репозитория, поэтому код уезжает архивом:
#   git archive HEAD | ssh … tar -x
#
# tar -x НЕ удаляет файлы, исчезнувшие из репозитория: переименованная
# страница или удалённый трек продолжили бы отдаваться со старым содержимым
# и кэшироваться у пользователей. Поэтому после распаковки серверное дерево
# сверяется с манифестом (git ls-files) и лишнее удаляется — кроме рабочих
# каталогов сервиса (.env, .venv, progress/, база, бэкапы).
#
# Запуск из корня репозитория:
#   HOST=root@сервер bash deploy/release.sh
set -euo pipefail

HOST="${HOST:-}"
APP_DIR="${APP_DIR:-/opt/interview-trainer}"
SERVICE_USER="${SERVICE_USER:-interview}"
BASE="${BASE:-}"

if [ -z "$HOST" ]; then
  echo "Использование: HOST=root@сервер [BASE=https://домен] bash deploy/release.sh" >&2
  exit 1
fi

if ! git diff --quiet HEAD 2>/dev/null; then
  echo "ОШИБКА: есть незакоммиченные изменения — выкатывается только HEAD" >&2
  exit 1
fi

echo "==> Локальная валидация перед выкатом"
python tools/validate_content.py --quiet
python tools/build_webapp_data.py --check

echo "==> Архив на сервер"
git archive --format=tar HEAD | ssh "$HOST" \
  "tar -x -C '$APP_DIR' && chown -R '$SERVICE_USER:$SERVICE_USER' '$APP_DIR'"

echo "==> Чистка файлов, исчезнувших из репозитория"
MANIFEST="$(mktemp)"
trap 'rm -f "$MANIFEST"' EXIT
git ls-files >"$MANIFEST"
# Манифест уезжает отдельным файлом, а НЕ через stdin: у `bash -s <<HEREDOC`
# stdin уже занят скриптом, и `sort` внутри молча съел бы остаток скрипта
# вместо манифеста (проверено живьём: чистка не выполнялась вовсе).
scp -q "$MANIFEST" "$HOST:/tmp/itb-manifest"
# Удаляем ТОЛЬКО внутри верхнеуровневых каталогов, которые есть в репозитории:
# APP_DIR одновременно является домашним каталогом сервисного пользователя
# (.bashrc, .cache/pip и т.п. — проверено живьём), и полная сверка дерева
# снесла бы его окружение. Плюс явные исключения для рабочего состояния.
ssh "$HOST" APP_DIR="$APP_DIR" bash -s <<'REMOTE'
set -euo pipefail
cd "$APP_DIR"
sort /tmp/itb-manifest >/tmp/itb-manifest.sorted
cut -d/ -f1 /tmp/itb-manifest.sorted | sort -u >/tmp/itb-top
find . -type f \
  ! -path './.venv/*' \
  ! -path './progress/*' \
  ! -path './api/backups/*' \
  ! -path '*/__pycache__/*' \
  ! -name '.env' \
  ! -name 'state.db' ! -name 'state.db-wal' ! -name 'state.db-shm' \
  ! -name '*.pyc' \
  -printf '%P\n' | sort |
awk -F/ 'NR==FNR { top[$0] = 1; next } NF > 1 && ($1 in top)' /tmp/itb-top - |
comm -23 - /tmp/itb-manifest.sorted |
while IFS= read -r f; do
  echo "  удаляю лишний: $f"
  rm -f -- "$f"
done
rm -f /tmp/itb-manifest /tmp/itb-manifest.sorted /tmp/itb-top
REMOTE

echo "==> Пост-деплой на сервере (тесты, бэкап, рестарт, смоук)"
ssh "$HOST" "APP_DIR='$APP_DIR' BASE='$BASE' bash '$APP_DIR/deploy/update.sh'"

echo "==> Выкат завершён"
