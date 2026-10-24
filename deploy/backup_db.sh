#!/usr/bin/env bash
# Бэкап базы синхронизации.
#
# Используется команда sqlite3 .backup, а не копирование файла: при включённом
# WAL простой cp даёт несогласованный снимок, который потом не открывается.
# После создания копия ПРОВЕРЯЕТСЯ — непроверенный бэкап не является бэкапом.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/interview-trainer}"
DB="${DATABASE_PATH:-$APP_DIR/api/state.db}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/api/backups}"
KEEP="${KEEP:-14}"

if [ ! -f "$DB" ]; then
  echo "Базы ещё нет ($DB) — бэкап не требуется"
  exit 0
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/state-$STAMP.db"

echo "==> Снимок базы"
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB" ".backup '$OUT'"
else
  echo "ПРЕДУПРЕЖДЕНИЕ: sqlite3 не установлен, используется python"
  python3 - "$DB" "$OUT" <<'PY'
import sqlite3, sys
src = sqlite3.connect(sys.argv[1])
dst = sqlite3.connect(sys.argv[2])
with dst:
    src.backup(dst)
dst.close()
src.close()
PY
fi

echo "==> Проверка восстановления"
# Проверяем, что копия открывается и данные читаются. Бэкап, который никто не
# пробовал восстановить, обнаруживается сломанным ровно в тот момент, когда он
# нужен.
python3 - "$OUT" <<'PY'
import sqlite3, sys
path = sys.argv[1]
conn = sqlite3.connect(path)
try:
    integrity = conn.execute("PRAGMA integrity_check").fetchone()[0]
    if integrity != "ok":
        raise SystemExit(f"ОШИБКА: проверка целостности не пройдена: {integrity}")
    users = conn.execute("SELECT COUNT(*) FROM state").fetchone()[0]
    attempts = conn.execute("SELECT COUNT(*) FROM attempts").fetchone()[0]
    print(f"    целостность ok, пользователей {users}, записей истории {attempts}")
finally:
    conn.close()
PY

gzip -f "$OUT"
echo "==> Готово: ${OUT}.gz"

echo "==> Чистка старых копий (оставляем $KEEP)"
ls -1t "$BACKUP_DIR"/state-*.db.gz 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
  rm -f "$old"
  echo "    удалено: $(basename "$old")"
done

echo "Копий в каталоге: $(ls -1 "$BACKUP_DIR"/state-*.db.gz 2>/dev/null | wc -l)"
