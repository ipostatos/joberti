#!/usr/bin/env bash
# Полный прогон всех проверок проекта — то же, что делает CI.
#
# Запуск:  bash run_all_checks.sh
set -uo pipefail

PY="${PY:-python}"
FAILED=0
PASSED=0

run() {
  local name="$1"; shift
  printf "\n\033[1m==> %s\033[0m\n" "$name"
  if "$@"; then
    PASSED=$((PASSED + 1))
    printf "    OK\n"
  else
    FAILED=$((FAILED + 1))
    printf "    ПРОВАЛЕНО\n"
  fi
}

echo "=========================================="
echo " Interview Trainer — полная проверка"
echo "=========================================="

# ── Python: синтаксис ──
run "Компиляция модулей" $PY -m compileall -q bot.py bot_i18n.py api tools tests

# ── контент ──
run "Валидация контента" $PY tools/validate_content.py --quiet
run "Поиск дублей в банке вопросов" $PY tools/deduplicate_questions.py --strict
run "Свежесть сгенерированных данных" $PY tools/build_webapp_data.py --check
run "Аудит источников (офлайн)" $PY tools/audit_sources.py --offline

# ── тесты Python ──
run "Тесты контента" $PY tests/test_content.py
run "Тесты слияния и паритета JS/Python" $PY tests/test_sync.py
run "Тесты API" $PY tests/test_api.py
run "Тесты бота" $PY tests/test_bot.py
run "Тесты безопасности" $PY tests/test_security.py
run "Нагрузочный тест" $PY tests/test_load.py

# ── Mini App ──
if command -v node >/dev/null 2>&1; then
  for f in webapp/*.js; do
    node --check "$f" || { echo "синтаксическая ошибка в $f"; FAILED=$((FAILED + 1)); }
  done
  run "SRS"                   node webapp/_srs_check.mjs
  run "Прогресс и серия"      node webapp/_progress_check.mjs
  run "Готовность"            node webapp/_readiness_check.mjs
  run "Правила слияния"       node webapp/_sync_check.mjs
  run "Поиск"                 node webapp/_search_check.mjs
  run "Service worker"        node webapp/_sw_check.mjs
  run "Навигация и ссылки"    node webapp/_nav_check.mjs
else
  echo
  echo "ПРЕДУПРЕЖДЕНИЕ: node не найден — проверки Mini App пропущены"
fi

echo
echo "=========================================="
printf " Пройдено: %d, провалено: %d\n" "$PASSED" "$FAILED"
echo "=========================================="

[ "$FAILED" -eq 0 ] || exit 1
