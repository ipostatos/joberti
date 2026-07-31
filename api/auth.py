"""
Проверка подлинности Telegram WebApp initData (HMAC-SHA256).

Чистые функции без FastAPI — чтобы проверять офлайн, без поднятия сервера.

Алгоритм (документация Telegram Bot API, «Validating data received via the Mini App»):
    secret_key = HMAC_SHA256(key="WebAppData", msg=BOT_TOKEN)
    data_check = "\\n".join(f"{k}={v}" for k, v in sorted(pairs) if k != "hash")
    expected   = hex(HMAC_SHA256(key=secret_key, msg=data_check))
    valid      = hmac.compare_digest(expected, received_hash)

Пользователь возвращается ТОЛЬКО при верной подписи. user_id берётся
исключительно отсюда и никогда из тела запроса: иначе любой клиент мог бы
прислать чужой идентификатор и прочитать чужой прогресс.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl, urlencode


class InitDataError(Exception):
    """Любая проблема с initData: нет подписи, не сходится, протухло."""


# Ограничение длины: initData приходит заголовком, и очень длинное значение —
# это либо мусор, либо попытка нагрузить проверку подписи.
MAX_INIT_DATA_LEN = 4096


def verify_init_data(init_data: str, bot_token: str, max_age_sec: int = 86400) -> dict:
    """Проверить initData. Вернуть {'user_id', 'user', 'auth_date'}.

    Бросает InitDataError при любой проблеме.
    """
    if not init_data or not bot_token:
        raise InitDataError("empty init_data or bot_token")
    if len(init_data) > MAX_INIT_DATA_LEN:
        raise InitDataError("init_data too long")

    # parse_qsl сохраняет порядок и декодирует проценты; пустые значения нужны,
    # потому что они участвуют в строке проверки.
    try:
        pairs = parse_qsl(init_data, keep_blank_values=True, strict_parsing=False)
    except ValueError as e:
        raise InitDataError(f"cannot parse init_data: {e}")

    data = dict(pairs)
    received_hash = data.pop("hash", None)
    if not received_hash:
        raise InitDataError("no hash in init_data")

    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    expected = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    # compare_digest, а не ==: сравнение за постоянное время закрывает
    # тайминг-атаку на подбор подписи.
    if not hmac.compare_digest(expected, received_hash):
        raise InitDataError("hash mismatch")

    # Защита от повторного использования перехваченного initData.
    # auth_date обязателен: Telegram шлёт его всегда, а подписанный initData
    # без него жил бы вечно — TTL было бы не от чего отсчитывать.
    try:
        auth_date = int(data.get("auth_date", "0") or "0")
    except ValueError:
        raise InitDataError("bad auth_date")
    if auth_date <= 0:
        raise InitDataError("missing auth_date")
    if max_age_sec and (time.time() - auth_date) > max_age_sec:
        raise InitDataError("init_data expired")

    user_raw = data.get("user")
    if not user_raw:
        raise InitDataError("no user in init_data")
    try:
        user = json.loads(user_raw)
        user_id = int(user["id"])
    except (ValueError, KeyError, TypeError) as e:
        raise InitDataError(f"bad user payload: {e}")

    if user_id <= 0:
        raise InitDataError("bad user id")

    return {"user_id": user_id, "user": user, "auth_date": auth_date}


def build_init_data(bot_token: str, user: dict, auth_date: int | None = None) -> str:
    """Собрать ВАЛИДНЫЙ initData тем же алгоритмом — нужно тестам."""
    if auth_date is None:
        auth_date = int(time.time())
    fields = {
        "auth_date": str(auth_date),
        "user": json.dumps(user, separators=(",", ":"), ensure_ascii=False),
    }
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    h = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return urlencode({**fields, "hash": h})
