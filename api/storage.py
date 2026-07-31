"""
Хранилище состояния: SQLite.

Ключевые решения и почему они такие:

* WAL — чтобы чтение не блокировалось записью при нескольких устройствах.
* busy_timeout — при конкурентной записи SQLite ждёт, а не отдаёт сразу
  «database is locked» (иначе получаем неперехваченный HTTP 500).
* Соединение закрывается ВСЕГДА через try/finally. `with sqlite3.connect(...)`
  коммитит, но НЕ закрывает: соединения копятся до сборки мусора и под нагрузкой
  дают «too many open files».
* read-merge-write выполняется в одной транзакции BEGIN IMMEDIATE. Без неё два
  устройства читают одно состояние и второе затирает первое — классическая
  потеря обновления.
* Все запросы параметризованы.
"""
from __future__ import annotations

import contextlib
import json
import os
import sqlite3
import time
from collections.abc import Iterator
from pathlib import Path

from merge import MAX_ATTEMPTS, merge_history, merge_state

SCHEMA_VERSION = 1
HISTORY_LIMIT = MAX_ATTEMPTS
BUSY_TIMEOUT_MS = 3000

# Потолок суммарного размера состояния одного пользователя. Лимит тела запроса
# (MAX_BODY) ограничивает один POST, но merge объединяет ключи клиента и
# сервера, и серией запросов состояние можно наращивать без предела — до
# заполнения диска. Реальный профиль на порядки меньше потолка.
MAX_STATE_BYTES = 1024 * 1024


class StateTooLarge(Exception):
    """Слитое состояние превысило MAX_STATE_BYTES — запись отвергнута."""

_BASE = Path(__file__).resolve().parent


def db_path() -> Path:
    """Путь к файлу БД. Берём из окружения, иначе рядом с модулем.

    Читаем при каждом вызове, а не один раз на импорт: тесты подменяют
    переменную окружения между кейсами.
    """
    raw = os.environ.get("DATABASE_PATH") or os.environ.get("INTERVIEW_API_DB")
    if raw:
        p = Path(raw)
        return p if p.is_absolute() else (_BASE.parent / p)
    return _BASE / "state.db"


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(db_path())
    conn.execute(f"PRAGMA busy_timeout={BUSY_TIMEOUT_MS}")
    return conn


@contextlib.contextmanager
def get_db() -> Iterator[sqlite3.Connection]:
    conn = _connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Создать схему. Вызывается один раз при старте приложения.

    Раньше в подобных сервисах DDL выполнялся в каждом запросе — лишняя дисковая
    работа и заметный TTFB. Здесь — единожды.
    """
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with contextlib.closing(_connect()) as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute(
            """CREATE TABLE IF NOT EXISTS state(
                 user_id        INTEGER PRIMARY KEY,
                 srs            TEXT NOT NULL DEFAULT '{}',
                 progress       TEXT NOT NULL DEFAULT '{}',
                 profile        TEXT NOT NULL DEFAULT '{}',
                 exam_date      TEXT NOT NULL DEFAULT '{}',
                 schema_version INTEGER NOT NULL DEFAULT 1,
                 created_at     INTEGER NOT NULL,
                 updated_at     INTEGER NOT NULL
               )"""
        )
        conn.execute(
            """CREATE TABLE IF NOT EXISTS attempts(
                 id         TEXT NOT NULL,
                 user_id    INTEGER NOT NULL,
                 ts         INTEGER NOT NULL,
                 kind       TEXT NOT NULL DEFAULT 'quiz',
                 mode       TEXT NOT NULL DEFAULT '',
                 total      INTEGER NOT NULL DEFAULT 0,
                 correct    INTEGER NOT NULL DEFAULT 0,
                 pct        INTEGER NOT NULL DEFAULT 0,
                 secs       INTEGER NOT NULL DEFAULT 0,
                 payload    TEXT NOT NULL DEFAULT '{}',
                 PRIMARY KEY (user_id, id)
               )"""
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, ts DESC)"
        )
        conn.commit()


EMPTY_STATE = {"srs": {}, "progress": {}, "profile": {}, "exam_date": {"value": None, "setAt": 0}}


def _row_to_state(row) -> dict:
    if not row:
        return dict(EMPTY_STATE)
    try:
        return {
            "srs": json.loads(row[0] or "{}"),
            "progress": json.loads(row[1] or "{}"),
            "profile": json.loads(row[2] or "{}"),
            "exam_date": json.loads(row[3] or "{}"),
        }
    except json.JSONDecodeError:
        # Повреждённая запись не должна ронять запрос: возвращаем пустое
        # состояние, следующая запись перезапишет его корректным.
        return dict(EMPTY_STATE)


def load_state(user_id: int) -> dict:
    with get_db() as conn:
        row = conn.execute(
            "SELECT srs, progress, profile, exam_date FROM state WHERE user_id=?",
            (user_id,),
        ).fetchone()
    return _row_to_state(row)


def merge_and_save_state(user_id: int, incoming: dict) -> dict:
    """Атомарный read-merge-write.

    BEGIN IMMEDIATE берёт write-lock сразу: конкурент ждёт (busy_timeout) и
    читает уже слитое состояние, а не затирает его.
    """
    now = int(time.time())
    conn = _connect()
    try:
        conn.execute("BEGIN IMMEDIATE")
        row = conn.execute(
            "SELECT srs, progress, profile, exam_date FROM state WHERE user_id=?",
            (user_id,),
        ).fetchone()
        server = _row_to_state(row)
        merged = merge_state(server, incoming)
        parts = {k: json.dumps(merged[k], ensure_ascii=False)
                 for k in ("srs", "progress", "profile", "exam_date")}
        total = sum(len(v.encode("utf-8")) for v in parts.values())
        if total > MAX_STATE_BYTES:
            # Отвергаем запись целиком: состояние на сервере остаётся прежним,
            # клиент продолжает жить на localStorage. Придумывать политику
            # вытеснения хуже: молча выброшенные ключи — потеря данных.
            raise StateTooLarge(f"{total} байт (потолок {MAX_STATE_BYTES})")
        conn.execute(
            """INSERT INTO state(user_id, srs, progress, profile, exam_date,
                                 schema_version, created_at, updated_at)
               VALUES(?,?,?,?,?,?,?,?)
               ON CONFLICT(user_id) DO UPDATE SET
                 srs=excluded.srs, progress=excluded.progress,
                 profile=excluded.profile, exam_date=excluded.exam_date,
                 schema_version=excluded.schema_version, updated_at=excluded.updated_at""",
            (
                user_id,
                parts["srs"],
                parts["progress"],
                parts["profile"],
                parts["exam_date"],
                SCHEMA_VERSION,
                now,
                now,
            ),
        )
        conn.commit()
        return merged
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


# ── история попыток ────────────────────────────────────────────────────────

def _row_to_attempt(r) -> dict:
    try:
        payload = json.loads(r[9] or "{}")
    except json.JSONDecodeError:
        payload = {}
    return {
        "id": r[0],
        "ts": r[1],
        "kind": r[2],
        "mode": r[3],
        "total": r[4],
        "correct": r[5],
        "pct": r[6],
        "secs": r[7],
        "weakTopics": payload.get("weakTopics", []),
        "details": payload.get("details"),
    }


def list_attempts(user_id: int, limit: int = HISTORY_LIMIT) -> list:
    with get_db() as conn:
        rows = conn.execute(
            """SELECT id, ts, kind, mode, total, correct, pct, secs, user_id, payload
               FROM attempts WHERE user_id=? ORDER BY ts DESC, id ASC LIMIT ?""",
            (user_id, limit),
        ).fetchall()
    return [_row_to_attempt(r) for r in rows]


def merge_and_save_attempts(user_id: int, incoming: list) -> list:
    """Слить историю с сохранённой и вернуть результат.

    История append-only: записи объединяются по id. Транзакция та же
    BEGIN IMMEDIATE — иначе два устройства, отправившие историю одновременно,
    получат разный итог.
    """
    conn = _connect()
    try:
        conn.execute("BEGIN IMMEDIATE")
        rows = conn.execute(
            """SELECT id, ts, kind, mode, total, correct, pct, secs, user_id, payload
               FROM attempts WHERE user_id=?""",
            (user_id,),
        ).fetchall()
        existing = [_row_to_attempt(r) for r in rows]
        merged = merge_history(existing, incoming)

        keep = {rec["id"] for rec in merged}
        # Удаляем то, что не попало в итог: так соблюдается лимит истории и
        # не копятся записи, вытесненные более свежими.
        for r in rows:
            if r[0] not in keep:
                conn.execute("DELETE FROM attempts WHERE user_id=? AND id=?", (user_id, r[0]))

        for rec in merged:
            payload = json.dumps(
                {"weakTopics": rec.get("weakTopics", []), "details": rec.get("details")},
                ensure_ascii=False,
            )
            conn.execute(
                """INSERT INTO attempts(id, user_id, ts, kind, mode, total, correct,
                                        pct, secs, payload)
                   VALUES(?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(user_id, id) DO UPDATE SET
                     ts=excluded.ts, kind=excluded.kind, mode=excluded.mode,
                     total=excluded.total, correct=excluded.correct, pct=excluded.pct,
                     secs=excluded.secs, payload=excluded.payload""",
                (
                    str(rec.get("id")),
                    user_id,
                    int(rec.get("ts") or 0),
                    str(rec.get("kind") or "quiz"),
                    str(rec.get("mode") or ""),
                    int(rec.get("total") or 0),
                    int(rec.get("correct") or 0),
                    int(rec.get("pct") or 0),
                    int(rec.get("secs") or 0),
                    payload,
                ),
            )
        conn.commit()
        return merged
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_user(user_id: int) -> None:
    """Удалить все данные пользователя — требование раздела приватности."""
    with get_db() as conn:
        conn.execute("DELETE FROM state WHERE user_id=?", (user_id,))
        conn.execute("DELETE FROM attempts WHERE user_id=?", (user_id,))


def stats() -> dict:
    with get_db() as conn:
        users = conn.execute("SELECT COUNT(*) FROM state").fetchone()[0]
        attempts = conn.execute("SELECT COUNT(*) FROM attempts").fetchone()[0]
    return {"users": users, "attempts": attempts}
