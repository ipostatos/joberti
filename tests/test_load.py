#!/usr/bin/env python3
"""
Нагрузочная проверка API: минимум 10 параллельных пользователей.

Задача не в измерении скорости, а в проверке того, что под параллельной
нагрузкой ничего не ломается: соединения не текут, SQLite не отдаёт
«database is locked», обновления не теряются, пользователи не видят чужих
данных.

Запуск:  python tests/test_load.py
"""
from __future__ import annotations

import importlib
import os
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE / "api"))

# Намеренно НЕ похож по форме на настоящий токен Telegram: иначе секрет-скан
# в tests/test_security.py и в CI справедливо ругался бы на эту строку.
BOT_TOKEN = "fake-token-for-load-test-only"
USERS = 10
ROUNDS = 6


def setup_app():
    tmp = tempfile.mkdtemp(prefix="itb-load-")
    os.environ["DATABASE_PATH"] = str(Path(tmp) / "state.db")
    os.environ["BOT_TOKEN"] = BOT_TOKEN
    os.environ["API_RATE_MAX"] = "0"        # лимит частоты мешает нагрузочному тесту
    os.environ["API_RATE_WINDOW"] = "0"
    for mod in ("storage", "merge", "models", "auth", "app"):
        sys.modules.pop(mod, None)
    return importlib.import_module("app")


class TestLoad(unittest.TestCase):

    def setUp(self):
        from fastapi.testclient import TestClient
        self.app_module = setup_app()
        self.client = TestClient(self.app_module.app)
        self.client.__enter__()
        self.addCleanup(self.client.__exit__, None, None, None)

        from auth import build_init_data
        self.hdr = {
            uid: {"X-Init-Data": build_init_data(BOT_TOKEN, {"id": uid, "first_name": f"U{uid}"})}
            for uid in range(1, USERS + 1)
        }

    def test_parallel_users(self):
        errors: list[str] = []
        lock = threading.Lock()

        def work(uid: int) -> None:
            try:
                for r in range(ROUNDS):
                    payload = {
                        "srs": {f"q:u{uid}-{r}": {"box": (r % 6), "due": 1000 + r}},
                        "progress": {"goal": 15, "days": {"2026-07-01": r + 1},
                                     "streak": r + 1, "best": r + 1},
                        "profile": {"trackId": "redcore-junior-seo", "onboarded": True},
                    }
                    resp = self.client.post("/api/state", json=payload, headers=self.hdr[uid])
                    if resp.status_code != 200:
                        with lock:
                            errors.append(f"user {uid} round {r}: POST {resp.status_code}")
                        return

                    att = {"attempts": [{"id": f"u{uid}-a{r}", "ts": 1000 + r,
                                         "kind": "quiz", "mode": "quick",
                                         "total": 10, "correct": 8, "pct": 80}]}
                    resp = self.client.post("/api/attempts", json=att, headers=self.hdr[uid])
                    if resp.status_code != 200:
                        with lock:
                            errors.append(f"user {uid} round {r}: attempts {resp.status_code}")
                        return

                    resp = self.client.get("/api/state", headers=self.hdr[uid])
                    if resp.status_code != 200:
                        with lock:
                            errors.append(f"user {uid} round {r}: GET {resp.status_code}")
                        return
            except Exception as e:                      # noqa: BLE001
                with lock:
                    errors.append(f"user {uid}: {type(e).__name__}: {e}")

        started = time.time()
        threads = [threading.Thread(target=work, args=(uid,)) for uid in self.hdr]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=120)
        elapsed = time.time() - started

        self.assertEqual(errors, [], "ошибки под нагрузкой:\n" + "\n".join(errors[:10]))
        for t in threads:
            self.assertFalse(t.is_alive(), "поток не завершился — вероятная блокировка БД")

        # ── целостность после нагрузки ──
        for uid in self.hdr:
            state = self.client.get("/api/state", headers=self.hdr[uid]).json()["state"]
            srs = state["srs"]
            with self.subTest(user=uid):
                self.assertEqual(len(srs), ROUNDS,
                                 f"пользователь {uid}: сохранено {len(srs)} из {ROUNDS} записей")
                # Чужих данных быть не должно ни одной записи.
                foreign = [k for k in srs if not k.startswith(f"q:u{uid}-")]
                self.assertEqual(foreign, [], f"в состоянии пользователя {uid} чужие данные")

            attempts = self.client.get("/api/attempts", headers=self.hdr[uid]).json()["attempts"]
            with self.subTest(user=uid, part="attempts"):
                self.assertEqual(len(attempts), ROUNDS)

        total_requests = USERS * ROUNDS * 3
        print(f"\nнагрузка: {USERS} пользователей x {ROUNDS} раундов = "
              f"{total_requests} запросов за {elapsed:.1f} с "
              f"({total_requests / max(elapsed, 0.001):.0f} запросов/с)")

    def test_repeated_sync_is_stable(self):
        """Повторная синхронизация одного и того же состояния не должна его
        менять: иначе прогресс «дрейфует» при каждом обмене."""
        payload = {
            "srs": {"q:a": {"box": 3, "due": 999}},
            "progress": {"goal": 25, "days": {"2026-07-01": 7}, "streak": 2, "best": 4},
            "profile": {"trackId": "redcore-junior-seo", "onboarded": True},
            "exam_date": {"value": "2026-08-10", "setAt": 555},
        }
        first = self.client.post("/api/state", json=payload, headers=self.hdr[1]).json()["state"]
        for _ in range(5):
            again = self.client.post("/api/state", json=payload,
                                     headers=self.hdr[1]).json()["state"]
            self.assertEqual(again, first, "состояние изменилось при повторной синхронизации")


if __name__ == "__main__":
    unittest.main(verbosity=2)
