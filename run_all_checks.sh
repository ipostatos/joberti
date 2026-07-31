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
# По каталогу, а не списком: новый tests/test_*.py попадает в прогон сам —
# перечисленный руками файл уже отставал от реальности в других местах.
for f in tests/test_*.py; do
  run "Тесты: $(basename "$f")" $PY "$f"
done

# ── Mini App ──
if command -v node >/dev/null 2>&1; then
  for f in webapp/*.js; do
    node --check "$f" || { echo "синтаксическая ошибка в $f"; FAILED=$((FAILED + 1)); }
  done
  # Тоже по каталогу: новый _*_check.mjs подхватывается автоматически.
  for f in webapp/_*.mjs; do
    run "Mini App: $(basename "$f")" node "$f"
  done
else
  echo
  echo "ПРЕДУПРЕЖДЕНИЕ: node не найден — проверки Mini App пропущены"
fi

echo
echo "=========================================="
printf " Пройдено: %d, провалено: %d\n" "$PASSED" "$FAILED"
echo "=========================================="

[ "$FAILED" -eq 0 ] || exit 1
