#!/usr/bin/env bash
# Проверка живости после выката.
#
# Проверяет ровно то, что ломается чаще всего: API отвечает, авторизация
# работает, статика отдаётся, сгенерированные данные на месте.
#
# Запуск:
#   bash deploy/smoke.sh                       # только API на localhost
#   BASE=https://example.org bash deploy/smoke.sh   # плюс проверка Mini App
set -uo pipefail

API="${API:-http://127.0.0.1:${API_PORT:-4200}}"
BASE="${BASE:-}"
FAILED=0

# Список наполненных треков берётся из собранных данных рядом со скриптом, а не
# записан руками: перечисление в коде уже отставало от контента — новый трек
# выкатывался, а смоук проверял два прежних и молчал. Пустышки незаполненных
# треков отсекаются по размеру.
GEN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../webapp/generated" 2>/dev/null && pwd || true)"
FILLED_TRACKS=""
if [ -n "$GEN_DIR" ]; then
  for f in "$GEN_DIR"/content_track_*.js; do
    [ -e "$f" ] || continue
    SZ=$(wc -c <"$f")
    [ "$SZ" -gt 200000 ] && FILLED_TRACKS="$FILLED_TRACKS $(basename "$f")"
  done
fi

check() {
  local name="$1" expected="$2" url="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
  if [ "$code" = "$expected" ]; then
    printf "  OK   %-3s  %s\n" "$code" "$name"
  else
    printf "  FAIL %-3s  %s (ожидалось %s)\n" "$code" "$name" "$expected"
    FAILED=$((FAILED + 1))
  fi
}

echo "==> API ($API)"
check "health отвечает" 200 "$API/api/health"
# Без initData доступ обязан быть закрыт: это главная проверка авторизации.
check "state без initData закрыт" 401 "$API/api/state"
check "attempts без initData закрыт" 401 "$API/api/attempts"
check "stats без initData закрыт" 401 "$API/api/stats"
# Публичная документация API отключена намеренно.
check "docs отключены" 404 "$API/docs"
check "openapi отключён" 404 "$API/openapi.json"

echo "==> health содержит токен-флаг"
HEALTH=$(curl -s --max-time 10 "$API/api/health" || echo "")
if echo "$HEALTH" | grep -q '"token_configured":true'; then
  echo "  OK   BOT_TOKEN настроен"
else
  echo "  FAIL BOT_TOKEN не настроен — авторизация работать не будет"
  FAILED=$((FAILED + 1))
fi

if [ -n "$BASE" ]; then
  echo "==> Mini App ($BASE)"
  check "главная" 200 "$BASE/index.html"
  check "план" 200 "$BASE/roadmap.html"
  check "тесты" 200 "$BASE/quiz.html"
  check "mock interview" 200 "$BASE/mock.html"
  check "кейсы" 200 "$BASE/cases.html"
  check "словарь" 200 "$BASE/glossary.html"
  check "тема" 200 "$BASE/theme.css"
  check "данные (общая часть)" 200 "$BASE/generated/content_core.js"
  check "загрузчик трека" 200 "$BASE/content-loader.js"
  for f in $FILLED_TRACKS; do
    check "данные трека ${f#content_track_}" 200 "$BASE/generated/$f"
  done
  check "service worker" 200 "$BASE/service-worker.js"
  check "манифест" 200 "$BASE/manifest.webmanifest"

  echo "==> Заголовки безопасности"
  HEADERS=$(curl -sI --max-time 10 "$BASE/index.html" || echo "")
  for h in "content-security-policy" "x-content-type-options"; do
    if echo "$HEADERS" | tr 'A-Z' 'a-z' | grep -q "$h"; then
      echo "  OK   заголовок $h"
    else
      echo "  FAIL нет заголовка $h"
      FAILED=$((FAILED + 1))
    fi
  done

  echo "==> Данные не пустые"
  # Порог на каждый файл свой: общая часть — это реестры и список треков,
  # трековый файл — весь учебный материал профессии. КАЖДЫЙ наполненный трек
  # проверяется отдельно: пустой файл одного из них прячется за общим объёмом.
  PAIRS="generated/content_core.js:50000"
  for f in $FILLED_TRACKS; do
    PAIRS="$PAIRS generated/$f:200000"
  done
  for pair in $PAIRS; do
    FILE=${pair%:*}
    MIN=${pair##*:}
    SIZE=$(curl -s -o /dev/null -w "%{size_download}" --max-time 20 "$BASE/$FILE" || echo 0)
    if [ "$SIZE" -gt "$MIN" ]; then
      echo "  OK   $(basename "$FILE"): $((SIZE / 1024)) КБ"
    else
      echo "  FAIL $(basename "$FILE") подозрительно мал: $SIZE байт"
      FAILED=$((FAILED + 1))
    fi
  done
else
  echo "==> BASE не задан — проверка Mini App пропущена"
fi

echo
if [ "$FAILED" -gt 0 ]; then
  echo "ПРОВАЛЕНО: проблем $FAILED"
  exit 1
fi
echo "OK: все проверки пройдены"
