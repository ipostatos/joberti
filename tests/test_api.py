#!/usr/bin/env python3
"""
Тесты Sync API: аутентификация, маршруты, безопасность, конкурентность.

Каждый тест поднимает приложение на временной базе, поэтому прогон не трогает
реальные данные и не зависит от порядка выполнения.

Запуск:  python tests/test_api.py
"""
from __future__ import annotations

import importlib
import json
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "api"))

# Намеренно НЕ похож по форме на настоящий токен Telegram: иначе секрет-скан
# в tests/test_security.py и в CI справедливо ругался бы на эту строку.
BOT_TOKEN = "fake-token-for-unit-tests-only"


def fresh_app(**env):
    """Импортировать приложение заново с чистой временной базой.

    Переимпорт нужен, потому что app.py читает конфигурацию на уровне модуля:
    иначе тесты, меняющие лимиты, влияли бы друг на друга.
    """
    tmp = tempfile.mkdtemp(prefix="itb-api-")
    os.environ["DATABASE_PATH"] = str(Path(tmp) / "state.db")
    os.environ["BOT_TOKEN"] = BOT_TOKEN
    # Именно присваивание, а не setdefault: предыдущий тест мог оставить в
    # окружении свой лимит (fresh_app(API_RATE_MAX=5)), и «свежее» приложение
    # молча наследовало бы его. Под unittest классы идут по алфавиту и это не
    # проявлялось; pytest идёт по порядку файла — и ловил 429 в тесте гонок.
    os.environ["API_RATE_MAX"] = "1000"
    os.environ["API_RATE_WINDOW"] = "60"
    for k, v in env.items():
        os.environ[k] = str(v)

    for mod in ("storage", "merge", "models", "auth", "app"):
        if mod in sys.modules:
            del sys.modules[mod]
    app_module = importlib.import_module("app")
    return app_module


def client_for(app_module, testcase=None):
    """Клиент с ЗАПУЩЕННЫМ lifespan.

    TestClient выполняет обработчики старта приложения только при входе в
    контекстный менеджер. Без этого init_db() не вызывается, и все запросы
    падают на «no such table» — то есть тесты проверяли бы не то приложение,
    которое реально запускается в проде.
    """
    from fastapi.testclient import TestClient
    c = TestClient(app_module.app)
    c.__enter__()
    if testcase is not None:
        testcase.addCleanup(c.__exit__, None, None, None)
    return c


def init_data(user_id=42, **kw):
    from auth import build_init_data
    return build_init_data(BOT_TOKEN, {"id": user_id, "first_name": "Тест"}, **kw)


def hdr(user_id=42):
    return {"X-Init-Data": init_data(user_id)}


class TestAuth(unittest.TestCase):
    """Проверка подписи initData — единственный источник личности."""

    def test_valid_init_data(self):
        from auth import verify_init_data
        info = verify_init_data(init_data(7), BOT_TOKEN)
        self.assertEqual(info["user_id"], 7)

    def test_wrong_token_rejected(self):
        from auth import InitDataError, verify_init_data
        with self.assertRaises(InitDataError):
            verify_init_data(init_data(7), "другой-токен")

    def test_tampered_payload_rejected(self):
        """Подмена user_id в теле не должна проходить: подпись перестаёт сходиться."""
        from auth import InitDataError, verify_init_data
        raw = init_data(7)
        tampered = raw.replace("%22id%22%3A7", "%22id%22%3A999")
        self.assertNotEqual(raw, tampered, "фикстура должна реально меняться")
        with self.assertRaises(InitDataError):
            verify_init_data(tampered, BOT_TOKEN)

    def test_missing_hash_rejected(self):
        from auth import InitDataError, verify_init_data
        with self.assertRaises(InitDataError):
            verify_init_data("auth_date=1&user=%7B%22id%22%3A1%7D", BOT_TOKEN)

    def test_expired_init_data_rejected(self):
        from auth import InitDataError, verify_init_data
        old = init_data(7, auth_date=int(time.time()) - 100000)
        with self.assertRaises(InitDataError):
            verify_init_data(old, BOT_TOKEN, max_age_sec=3600)

    def test_oversized_init_data_rejected(self):
        from auth import InitDataError, verify_init_data
        with self.assertRaises(InitDataError):
            verify_init_data("x" * 100000, BOT_TOKEN)

    def test_init_data_without_auth_date_rejected(self):
        """Правильно подписанный initData БЕЗ auth_date жил бы вечно: TTL
        не от чего отсчитывать. Telegram шлёт поле всегда — отсутствие
        означает ручную сборку строки."""
        import hashlib
        import hmac as hmac_mod
        from urllib.parse import urlencode

        from auth import InitDataError, verify_init_data
        data = {"user": json.dumps({"id": 7})}
        dcs = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
        secret = hmac_mod.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
        good_hash = hmac_mod.new(secret, dcs.encode(), hashlib.sha256).hexdigest()
        with self.assertRaises(InitDataError):
            verify_init_data(urlencode({**data, "hash": good_hash}), BOT_TOKEN)

    def test_empty_rejected(self):
        from auth import InitDataError, verify_init_data
        with self.assertRaises(InitDataError):
            verify_init_data("", BOT_TOKEN)
        with self.assertRaises(InitDataError):
            verify_init_data(init_data(7), "")


class TestEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = fresh_app()
        self.c = client_for(self.app, self)

    def test_health_is_public(self):
        r = self.c.get("/api/health")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.json()["ok"])

    def test_state_requires_auth(self):
        self.assertEqual(self.c.get("/api/state").status_code, 401)
        self.assertEqual(self.c.post("/api/state", json={}).status_code, 401)
        self.assertEqual(self.c.get("/api/attempts").status_code, 401)
        self.assertEqual(self.c.delete("/api/me").status_code, 401)

    def test_bad_init_data_rejected(self):
        # Заголовок HTTP обязан быть ASCII, поэтому мусор тоже берём ASCII —
        # кириллицу клиент физически не сможет отправить.
        for bad in ("garbage", "auth_date=1&hash=deadbeef", "=", "&&&"):
            with self.subTest(value=bad):
                r = self.c.get("/api/state", headers={"X-Init-Data": bad})
                self.assertEqual(r.status_code, 401)

    def test_empty_state_for_new_user(self):
        r = self.c.get("/api/state", headers=hdr(1))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["state"]["srs"], {})

    def test_post_then_get_roundtrip(self):
        payload = {
            "srs": {"q:a": {"box": 2, "due": 500}},
            "progress": {"goal": 25, "days": {"2026-07-01": 10}, "streak": 3, "best": 3},
            "profile": {"trackId": "redcore-junior-seo", "onboarded": True},
            "exam_date": {"value": "2026-08-01", "setAt": 100},
        }
        r = self.c.post("/api/state", json=payload, headers=hdr(2))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["state"]["srs"]["q:a"]["box"], 2)

        r2 = self.c.get("/api/state", headers=hdr(2))
        st = r2.json()["state"]
        self.assertEqual(st["progress"]["goal"], 25)
        self.assertEqual(st["profile"]["trackId"], "redcore-junior-seo")
        self.assertEqual(st["exam_date"]["value"], "2026-08-01")

    def test_users_are_isolated(self):
        """Главная проверка приватности: чужой прогресс недоступен."""
        self.c.post("/api/state", json={"srs": {"q:a": {"box": 5, "due": 1}}}, headers=hdr(10))
        r = self.c.get("/api/state", headers=hdr(11))
        self.assertEqual(r.json()["state"]["srs"], {},
                         "пользователь 11 не должен видеть данные пользователя 10")

    def test_merge_not_overwrite(self):
        """Второе устройство не затирает прогресс первого."""
        self.c.post("/api/state", json={"srs": {"q:a": {"box": 4, "due": 100}}}, headers=hdr(3))
        r = self.c.post("/api/state", json={"srs": {"q:b": {"box": 1, "due": 5}}}, headers=hdr(3))
        srs = r.json()["state"]["srs"]
        self.assertIn("q:a", srs, "прогресс первого устройства потерян")
        self.assertIn("q:b", srs)
        self.assertEqual(srs["q:a"]["box"], 4)

    def test_lower_box_does_not_downgrade(self):
        self.c.post("/api/state", json={"srs": {"q:a": {"box": 5, "due": 100}}}, headers=hdr(4))
        r = self.c.post("/api/state", json={"srs": {"q:a": {"box": 1, "due": 200}}}, headers=hdr(4))
        self.assertEqual(r.json()["state"]["srs"]["q:a"]["box"], 5)

    def test_bad_json_rejected(self):
        r = self.c.post("/api/state", content="{не json".encode("utf-8"),
                        headers={**hdr(5), "Content-Type": "application/json"})
        self.assertEqual(r.status_code, 400)

    def test_non_object_body_rejected(self):
        r = self.c.post("/api/state", content=b"[1,2,3]",
                        headers={**hdr(5), "Content-Type": "application/json"})
        self.assertEqual(r.status_code, 400)

    def test_oversized_body_rejected(self):
        big = json.dumps({"srs": {f"q:{i}": {"box": 1, "due": 1} for i in range(60000)}})
        r = self.c.post("/api/state", content=big.encode(),
                        headers={**hdr(6), "Content-Type": "application/json"})
        self.assertEqual(r.status_code, 413)

    def test_too_many_srs_items_rejected(self):
        payload = {"srs": {f"q:{i}": {"box": 1, "due": 1} for i in range(5001)}}
        r = self.c.post("/api/state", json=payload, headers=hdr(7))
        self.assertEqual(r.status_code, 422)

    def test_empty_body_is_accepted(self):
        """Пустое тело — валидный запрос: клиент просто ничего не накопил."""
        r = self.c.post("/api/state", content=b"",
                        headers={**hdr(8), "Content-Type": "application/json"})
        self.assertEqual(r.status_code, 200)

    def test_state_total_size_capped(self):
        """Лимит тела ограничивает один запрос, но merge объединяет ключи —
        серией запросов состояние можно наращивать до заполнения диска.
        Превышение потолка отвергается, состояние на сервере не меняется."""
        import storage
        from unittest.mock import patch

        r = self.c.post("/api/state", json={"progress": {"goal": 20}}, headers=hdr(9))
        self.assertEqual(r.status_code, 200)
        with patch.object(storage, "MAX_STATE_BYTES", 60):
            days = {f"2026-06-{i:02d}": 1 for i in range(1, 28)}
            r = self.c.post("/api/state", json={"progress": {"days": days}},
                            headers=hdr(9))
            self.assertEqual(r.status_code, 413)
        r = self.c.get("/api/state", headers=hdr(9))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["state"]["progress"].get("goal"), 20,
                         "отвергнутая запись не должна портить прежнее состояние")


class TestAttempts(unittest.TestCase):

    def setUp(self):
        self.app = fresh_app()
        self.c = client_for(self.app, self)

    def test_attempts_roundtrip(self):
        payload = {"attempts": [
            {"id": "a1", "ts": 1000, "kind": "quiz", "mode": "quick",
             "total": 10, "correct": 8, "pct": 80, "secs": 120},
        ]}
        r = self.c.post("/api/attempts", json=payload, headers=hdr(20))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()["attempts"]), 1)

        r2 = self.c.get("/api/attempts", headers=hdr(20))
        self.assertEqual(r2.json()["attempts"][0]["id"], "a1")

    def test_attempts_dedupe(self):
        rec = {"id": "same", "ts": 1, "kind": "quiz", "total": 1, "correct": 1, "pct": 100}
        self.c.post("/api/attempts", json={"attempts": [rec]}, headers=hdr(21))
        r = self.c.post("/api/attempts", json={"attempts": [rec]}, headers=hdr(21))
        self.assertEqual(len(r.json()["attempts"]), 1, "повторная отправка не должна дублировать")

    def test_attempts_merge_from_two_devices(self):
        self.c.post("/api/attempts", json={"attempts": [
            {"id": "d1", "ts": 100, "kind": "quiz", "total": 1, "correct": 1, "pct": 100}]},
            headers=hdr(22))
        r = self.c.post("/api/attempts", json={"attempts": [
            {"id": "d2", "ts": 200, "kind": "mock", "total": 1, "correct": 1, "pct": 75}]},
            headers=hdr(22))
        ids = {a["id"] for a in r.json()["attempts"]}
        self.assertEqual(ids, {"d1", "d2"}, "истории с двух устройств должны объединиться")

    def test_attempts_capped(self):
        many = [{"id": f"x{i}", "ts": i, "kind": "quiz", "total": 1, "correct": 1, "pct": 100}
                for i in range(150)]
        r = self.c.post("/api/attempts", json={"attempts": many}, headers=hdr(23))
        self.assertLessEqual(len(r.json()["attempts"]), 100)

    def test_invalid_attempt_rejected(self):
        r = self.c.post("/api/attempts", json={"attempts": [
            {"id": "bad", "ts": 1, "pct": 500}]}, headers=hdr(24))
        self.assertEqual(r.status_code, 422, "процент вне 0..100 должен отвергаться")

    def test_garbage_values_do_not_crash(self):
        """Мусорный тип не должен превращаться в 500."""
        r = self.c.post("/api/attempts", json={"attempts": [
            {"id": "g", "ts": "abc", "total": "много"}]}, headers=hdr(25))
        self.assertEqual(r.status_code, 422)

    def test_unknown_kind_normalized(self):
        r = self.c.post("/api/attempts", json={"attempts": [
            {"id": "k", "ts": 1, "kind": "выдуманный", "pct": 10}]}, headers=hdr(26))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["attempts"][0]["kind"], "quiz")


class TestDeletion(unittest.TestCase):

    def setUp(self):
        self.app = fresh_app()
        self.c = client_for(self.app, self)

    def test_delete_removes_everything(self):
        self.c.post("/api/state", json={"srs": {"q:a": {"box": 3, "due": 1}}}, headers=hdr(30))
        self.c.post("/api/attempts", json={"attempts": [
            {"id": "a", "ts": 1, "kind": "quiz", "pct": 50}]}, headers=hdr(30))

        r = self.c.delete("/api/me", headers=hdr(30))
        self.assertEqual(r.status_code, 200)

        self.assertEqual(self.c.get("/api/state", headers=hdr(30)).json()["state"]["srs"], {})
        self.assertEqual(self.c.get("/api/attempts", headers=hdr(30)).json()["attempts"], [])

    def test_delete_does_not_touch_others(self):
        self.c.post("/api/state", json={"srs": {"q:a": {"box": 3, "due": 1}}}, headers=hdr(31))
        self.c.post("/api/state", json={"srs": {"q:b": {"box": 3, "due": 1}}}, headers=hdr(32))
        self.c.delete("/api/me", headers=hdr(31))
        self.assertIn("q:b", self.c.get("/api/state", headers=hdr(32)).json()["state"]["srs"])


class TestRateLimit(unittest.TestCase):

    def test_rate_limit_triggers(self):
        app_module = fresh_app(API_RATE_MAX=5, API_RATE_WINDOW=60)
        c = client_for(app_module, self)
        codes = [c.get("/api/state", headers=hdr(50)).status_code for _ in range(8)]
        self.assertIn(429, codes, "лимит частоты должен срабатывать")
        self.assertEqual(codes[:5], [200] * 5, "первые запросы в пределах лимита проходят")

    def test_rate_limit_is_per_user(self):
        app_module = fresh_app(API_RATE_MAX=3, API_RATE_WINDOW=60)
        c = client_for(app_module, self)
        for _ in range(3):
            c.get("/api/state", headers=hdr(60))
        self.assertEqual(c.get("/api/state", headers=hdr(60)).status_code, 429)
        self.assertEqual(c.get("/api/state", headers=hdr(61)).status_code, 200,
                         "лимит одного пользователя не должен блокировать другого")


class TestConcurrency(unittest.TestCase):
    """Одновременная запись с двух устройств не должна терять обновления."""

    def test_no_lost_update(self):
        import threading

        app_module = fresh_app()
        c = client_for(app_module, self)
        user = 70
        errors = []

        def push(i):
            try:
                c.post("/api/state",
                       json={"srs": {f"q:{i}": {"box": 1, "due": i}}},
                       headers=hdr(user))
            except Exception as e:      # noqa: BLE001
                errors.append(e)

        threads = [threading.Thread(target=push, args=(i,)) for i in range(12)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        self.assertEqual(errors, [], f"параллельные записи упали: {errors}")
        srs = c.get("/api/state", headers=hdr(user)).json()["state"]["srs"]
        self.assertEqual(len(srs), 12,
                         f"часть параллельных обновлений потеряна: сохранено {len(srs)} из 12")


class TestSecurity(unittest.TestCase):

    def setUp(self):
        self.app = fresh_app()
        self.c = client_for(self.app, self)

    def test_docs_are_disabled(self):
        """Публичная документация API сервису не нужна и раскрывает схему."""
        for path in ("/docs", "/redoc", "/openapi.json"):
            with self.subTest(path=path):
                self.assertEqual(self.c.get(path).status_code, 404)

    def test_stats_require_auth(self):
        self.assertEqual(self.c.get("/api/stats").status_code, 401)
        self.assertEqual(self.c.get("/api/stats", headers=hdr(80)).status_code, 200)

    def test_sql_injection_in_ids_is_harmless(self):
        """Запросы параметризованы: спецсимволы в id не выполняются как SQL."""
        evil = "'; DROP TABLE attempts; --"
        r = self.c.post("/api/attempts", json={"attempts": [
            {"id": evil, "ts": 1, "kind": "quiz", "pct": 10}]}, headers=hdr(81))
        self.assertEqual(r.status_code, 200)
        again = self.c.get("/api/attempts", headers=hdr(81))
        self.assertEqual(again.status_code, 200, "таблица должна быть на месте")
        self.assertEqual(again.json()["attempts"][0]["id"], evil)

    def test_init_data_not_in_error_message(self):
        """Секрет не должен утекать в тело ответа."""
        secret = init_data(90)
        r = self.c.get("/api/state", headers={"X-Init-Data": secret + "x"})
        self.assertEqual(r.status_code, 401)
        self.assertNotIn(secret[:40], r.text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
