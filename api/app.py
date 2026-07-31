"""
Interview Trainer — API синхронизации прогресса между устройствами.

Маршруты (за reverse-proxy на пути /api/*):
    GET    /api/health     — проверка живости
    GET    /api/state      — состояние пользователя
    POST   /api/state      — merge(server, incoming) → сохранить → вернуть merged
    GET    /api/attempts   — история попыток
    POST   /api/attempts   — слить историю и вернуть результат
    DELETE /api/me         — удалить все данные пользователя

Безопасность:
  * подлинность — только Telegram initData (HMAC), см. auth.py;
  * user_id берётся ТОЛЬКО из проверенного initData, не из тела запроса;
  * BOT_TOKEN из окружения (общий .env с ботом), в лог не попадает;
  * лимит размера тела и лимит частоты запросов на пользователя;
  * никакого blind overwrite — только слияние, см. merge.py.

Запуск:  uvicorn app:app --host 127.0.0.1 --port 4200
"""
from __future__ import annotations

import contextlib
import json
import logging
import os
import time
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from auth import InitDataError, verify_init_data
from models import AttemptsIn, StateIn
from storage import (
    SCHEMA_VERSION,
    StateTooLarge,
    delete_user,
    init_db,
    list_attempts,
    load_state,
    merge_and_save_attempts,
    merge_and_save_state,
    stats,
)

logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("interview-api")

MAX_BODY = 512 * 1024        # 512 КБ с запасом на SRS + профиль + историю


def _bot_token() -> str:
    tok = os.environ.get("BOT_TOKEN", "").strip()
    if tok:
        return tok
    # Фолбэк: читаем общий с ботом .env. Нужен, когда сервис запускают руками
    # без EnvironmentFile — тогда токена в окружении нет, и API молча отвечал бы
    # 500 на каждый запрос.
    env = Path(__file__).resolve().parent.parent / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("BOT_TOKEN") and "=" in line:
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


BOT_TOKEN = _bot_token()
INITDATA_MAX_AGE = int(os.environ.get("API_INITDATA_MAX_AGE", "86400"))


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    if not BOT_TOKEN:
        log.error("BOT_TOKEN не задан: все запросы будут отвечать 500")
    yield


app = FastAPI(
    title="Interview Trainer Sync API",
    docs_url=None,          # публичная документация сервису не нужна
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)

# CORS нужен, только если Mini App раздаётся с другого origin. За общим
# reverse-proxy (same-origin) переменную не задают, и заголовки не шлются.
_origin = os.environ.get("API_CORS_ORIGIN", "").strip()
if _origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[_origin],
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "X-Init-Data"],
        max_age=600,
    )


# ── ограничение частоты ────────────────────────────────────────────────────
# Скользящее окно на пользователя, в памяти процесса. Для одного воркера этого
# достаточно; при масштабировании выносится в общее хранилище.
RATE_MAX = int(os.environ.get("API_RATE_MAX", "60"))
RATE_WINDOW = int(os.environ.get("API_RATE_WINDOW", "60"))
_hits: dict[int, list[float]] = {}


def _check_rate(user_id: int) -> None:
    if RATE_MAX <= 0 or RATE_WINDOW <= 0:
        return
    now = time.time()
    hits = _hits.setdefault(user_id, [])
    cutoff = now - RATE_WINDOW
    hits[:] = [t for t in hits if t > cutoff]
    if len(hits) >= RATE_MAX:
        retry = max(1, int(hits[0] + RATE_WINDOW - now))
        log.warning("rate limit: user=%s (%d/%ds)", user_id, RATE_MAX, RATE_WINDOW)
        raise HTTPException(429, "rate limit exceeded", headers={"Retry-After": str(retry)})
    hits.append(now)
    # Лёгкая уборка, чтобы словарь не рос бесконечно на длинной работе процесса.
    if len(_hits) > 5000:
        for uid in [u for u, h in _hits.items() if not h or h[-1] < cutoff]:
            _hits.pop(uid, None)


def _auth(init_data: str | None) -> int:
    if not BOT_TOKEN:
        log.error("auth: BOT_TOKEN не настроен")
        raise HTTPException(500, "server misconfigured")
    if not init_data:
        log.info("auth 401: нет initData")          # сам initData НЕ логируем
        raise HTTPException(401, "missing initData")
    try:
        info = verify_init_data(init_data, BOT_TOKEN, INITDATA_MAX_AGE)
    except InitDataError as e:
        log.info("auth 401: %s", e)                 # причина без секретов
        raise HTTPException(401, f"invalid initData: {e}")
    user_id = info["user_id"]
    _check_rate(user_id)                            # лимит после успешной проверки
    return user_id


async def _json_body(request: Request) -> dict:
    # Отказ ДО чтения: request.body() буферизует всё тело в память, и проверка
    # длины после него не защищает от гигабайтного POST. Сначала смотрим
    # Content-Length, затем читаем потоком со счётчиком — заголовку верить
    # нельзя (chunked или ложь), а поток рвётся на первом лишнем байте.
    cl = request.headers.get("content-length", "")
    if cl.isdigit() and int(cl) > MAX_BODY:
        raise HTTPException(413, "payload too large")
    chunks: list[bytes] = []
    size = 0
    async for chunk in request.stream():
        size += len(chunk)
        if size > MAX_BODY:
            raise HTTPException(413, "payload too large")
        chunks.append(chunk)
    raw = b"".join(chunks)
    if not raw:
        return {}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(400, "bad json")
    if not isinstance(data, dict):
        raise HTTPException(400, "expected object")
    return data


# ── маршруты ───────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"ok": True, "schema": SCHEMA_VERSION, "token_configured": bool(BOT_TOKEN)}


@app.get("/api/state")
def get_state(x_init_data: str | None = Header(default=None, alias="X-Init-Data")):
    user_id = _auth(x_init_data)
    return {"ok": True, "state": load_state(user_id)}


@app.post("/api/state")
async def post_state(
    request: Request,
    x_init_data: str | None = Header(default=None, alias="X-Init-Data"),
):
    user_id = _auth(x_init_data)
    body = await _json_body(request)
    try:
        payload = StateIn(**body)
    except ValidationError as e:
        raise HTTPException(422, e.errors()[0]["msg"] if e.errors() else "invalid payload")

    try:
        merged = merge_and_save_state(user_id, {
            "srs": payload.srs,
            "progress": payload.progress,
            "profile": payload.profile,
            "exam_date": payload.exam_date,
        })
    except StateTooLarge as e:
        log.warning("state too large: user=%s %s", user_id, e)
        raise HTTPException(413, "state too large")
    return {"ok": True, "state": merged}


@app.get("/api/attempts")
def get_attempts(x_init_data: str | None = Header(default=None, alias="X-Init-Data")):
    user_id = _auth(x_init_data)
    return {"ok": True, "attempts": list_attempts(user_id)}


@app.post("/api/attempts")
async def post_attempts(
    request: Request,
    x_init_data: str | None = Header(default=None, alias="X-Init-Data"),
):
    user_id = _auth(x_init_data)
    body = await _json_body(request)
    try:
        payload = AttemptsIn(**body)
    except ValidationError as e:
        raise HTTPException(422, e.errors()[0]["msg"] if e.errors() else "invalid payload")

    incoming = [a.model_dump() for a in payload.attempts]
    merged = merge_and_save_attempts(user_id, incoming)
    return {"ok": True, "attempts": merged}


@app.delete("/api/me")
def delete_me(x_init_data: str | None = Header(default=None, alias="X-Init-Data")):
    """Удалить все серверные данные пользователя.

    Локальный сброс делается в приложении; этот маршрут нужен, чтобы данные не
    вернулись обратно при следующей синхронизации.
    """
    user_id = _auth(x_init_data)
    delete_user(user_id)
    log.info("удалены данные пользователя %s", user_id)
    return {"ok": True}


@app.get("/api/stats")
def get_stats(x_init_data: str | None = Header(default=None, alias="X-Init-Data")):
    """Общая статистика сервиса. Доступна только аутентифицированному
    пользователю: анонимный запрос не должен раскрывать размер базы."""
    _auth(x_init_data)
    return {"ok": True, **stats()}


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    # Не отдаём стектрейс наружу: он раскрывает пути и структуру сервиса.
    log.exception("необработанная ошибка на %s", request.url.path)
    return JSONResponse(status_code=500, content={"ok": False, "error": "internal error"})
