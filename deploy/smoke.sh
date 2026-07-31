#!/usr/bin/env bash
# Проверка живости после выката.
#
# Проверяет ровно то, что ломается чаще всего: API отвечает (и напрямую, и
# через reverse-proxy), авторизация работает, статика отдаётся с правильными
# заголовками кэша, сгенерированные данные на месте, бэкап не протух.
#
# Запуск:
#   bash deploy/smoke.sh                       # только API на localhost
#   BASE=https://example.org bash deploy/smoke.sh   # плюс проверка Mini App
set -uo pipefail

API="${API:-http://127.0.0.1:${API_PORT:-4200}}"
BASE="${BASE:-}"
FAILED=0

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." 2>/dev/null && pwd || true)"
WEBAPP_DIR="$ROOT_DIR/webapp"
GEN_DIR="$ROOT_DIR/webapp/generated"

# Наполненные треки определяются по СТАТУСУ из data/tracks.json, а не по
# размеру файла: порог в байтах молча исключил бы легитимный маленький трек —
# ровно тот класс ошибки «проверка молчит о новом треке», который здесь уже
# чинили. Фолбэк по размеру остаётся только на случай, когда data/ недоступен.
FILLED_TRACKS=""
if [ -f "$ROOT_DIR/data/tracks.json" ] && command -v python3 >/dev/null 2>&1; then
  FILLED_TRACKS=$(python3 - "$ROOT_DIR/data/tracks.json" <<'PY'
import json, sys
tracks = json.load(open(sys.argv[1], encoding="utf-8"))["tracks"]
print(" ".join(f"content_track_{t['id']}.js" for t in tracks
               if t.get("status") == "active"))
PY
  )
elif [ -d "$GEN_DIR" ]; then
  for f in "$GEN_DIR"/content_track_*.js; do
    [ -e "$f" ] || continue
    SZ=$(wc -c <"$f")
    [ "$SZ" -gt 200000 ] && FILLED_TRACKS="$FILLED_TRACKS $(basename "$f")"
  done
fi
# Страховка от мусора в выводе python3 (например, заглушка Windows Store):
# в список попадают только имена настоящих трековых файлов.
FILLED_TRACKS=$(echo "$FILLED_TRACKS" | tr ' ' '\n' |
  grep -E '^content_track_[a-z0-9-]+\.js$' | tr '\n' ' ' || true)

check() {
  local name="$1" expected="$2" url="$3"
  shift 3
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$@" "$url" || echo "000")
  if [ "$code" = "$expected" ]; then
    printf "  OK   %-3s  %s\n" "$code" "$name"
  else
    printf "  FAIL %-3s  %s (ожидалось %s)\n" "$code" "$name" "$expected"
    FAILED=$((FAILED + 1))
  fi
}

check_header() {
  local name="$1" url="$2" header="$3" want="$4"
  local got
  got=$(curl -sI --max-time 10 "$url" | tr 'A-Z' 'a-z' | grep "^$header:" || echo "")
  if echo "$got" | grep -q "$want"; then
    echo "  OK   $name"
  else
    echo "  FAIL $name: '$got' не содержит '$want'"
    FAILED=$((FAILED + 1))
  fi
}

echo "==> API ($API)"
check "health отвечает" 200 "$API/api/health"
# Без initData доступ обязан быть закрыт: это главная проверка авторизации.
check "state без initData закрыт" 401 "$API/api/state"
check "attempts без initData закрыт" 401 "$API/api/attempts"
check "stats без initData закрыт" 401 "$API/api/stats"
# Пишущие ручки тоже: GET и POST проходят разные ветки FastAPI.
check "POST state без initData закрыт" 401 "$API/api/state" -X POST
check "DELETE me без initData закрыт" 401 "$API/api/me" -X DELETE
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

# ── бот ──
# Смоук проверял только API и статику, а живость самого бота — ничем: упавший
# polling-процесс оставался незамеченным до жалобы пользователя.
if command -v systemctl >/dev/null 2>&1 && \
   systemctl list-unit-files interview-trainer-bot.service >/dev/null 2>&1; then
  echo "==> Бот"
  if [ "$(systemctl is-active interview-trainer-bot 2>/dev/null)" = "active" ]; then
    echo "  OK   interview-trainer-bot активен"
  else
    echo "  FAIL interview-trainer-bot не активен"
    FAILED=$((FAILED + 1))
  fi
fi

# ── свежесть бэкапа ──
# Cron задаётся руками и может слететь незаметно: без сторожа первый сигнал —
# уже потерянные данные. Порог 48 ч — два пропущенных ежедневных запуска.
BACKUP_DIR="$ROOT_DIR/api/backups"
if [ -d "$BACKUP_DIR" ]; then
  echo "==> Бэкапы"
  NEWEST=$(ls -t "$BACKUP_DIR"/state-*.db.gz 2>/dev/null | head -1 || true)
  if [ -z "$NEWEST" ]; then
    echo "  WARN бэкапов ещё нет (первый создаст cron или deploy)"
  else
    AGE=$(( $(date +%s) - $(stat -c %Y "$NEWEST" 2>/dev/null || stat -f %m "$NEWEST") ))
    if [ "$AGE" -lt $((48 * 3600)) ]; then
      echo "  OK   свежий бэкап: $(basename "$NEWEST") ($((AGE / 3600)) ч назад)"
    else
      echo "  FAIL последний бэкап старше 48 ч: $(basename "$NEWEST")"
      FAILED=$((FAILED + 1))
    fi
  fi
fi

if [ -n "$BASE" ]; then
  echo "==> Mini App ($BASE)"
  # API через reverse-proxy: сломанный маршрут /api/* в Caddy не видел бы ни
  # один локальный чек — Mini App молча жил бы на одном localStorage.
  check "api/health через прокси" 200 "$BASE/api/health"
  check "api/state через прокси закрыт" 401 "$BASE/api/state"

  # Страницы перечисляются по каталогу, а не руками: список в коде уже отставал
  # от приложения — новый экран выкатывался, а смоук рапортовал «всё пройдено»,
  # не запросив его ни разу. Ровно та же ошибка, что была со списком треков.
  PAGES=""
  if [ -d "$WEBAPP_DIR" ]; then
    for p in "$WEBAPP_DIR"/*.html; do
      [ -e "$p" ] || continue
      PAGES="$PAGES $(basename "$p")"
    done
  fi
  if [ -z "$PAGES" ]; then
    echo "  FAIL рядом со скриптом нет webapp/ — нечего проверять"
    FAILED=$((FAILED + 1))
  fi
  for p in $PAGES; do
    check "страница $p" 200 "$BASE/$p"
  done
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

  echo "==> Заголовки кэша"
  # «После выката видна старая версия» — самая частая авария по DEPLOY.md,
  # и именно её смоук раньше не проверял.
  check_header "html не кэшируется" "$BASE/index.html" "cache-control" "no-cache"
  check_header "js не кэшируется" "$BASE/app.js" "cache-control" "no-cache"
  check_header "service worker: no-store" "$BASE/service-worker.js" "cache-control" "no-store"

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
