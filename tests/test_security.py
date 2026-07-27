#!/usr/bin/env python3
"""
Тесты безопасности уровня репозитория.

Проверяют то, что легко нарушить незаметно: утёкший токен, забытый .env,
ослабленный CSP, вставка пользовательского текста через innerHTML.

Запуск:  python tests/test_security.py
"""
from __future__ import annotations

import re
import subprocess
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

# Формат токена Telegram: <8-10 цифр>:<35 символов base64url>.
TOKEN_RE = re.compile(r"\b\d{8,10}:[A-Za-z0-9_-]{35}\b")

SCANNED_SUFFIXES = {".py", ".js", ".mjs", ".html", ".json", ".md", ".yml",
                    ".yaml", ".txt", ".css", ".sh", ".service", ".example"}
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", ".pytest_cache"}


def repo_files():
    for p in BASE.rglob("*"):
        if not p.is_file():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        if p.name == ".env":
            continue                        # .env не в репозитории, проверяется отдельно
        if p.suffix in SCANNED_SUFFIXES or p.name.startswith(".env"):
            yield p


class TestSecrets(unittest.TestCase):

    def test_no_telegram_token_in_repo(self):
        """Токен бота не должен попасть ни в один файл репозитория."""
        for path in repo_files():
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            hit = TOKEN_RE.search(text)
            with self.subTest(file=str(path.relative_to(BASE))):
                self.assertIsNone(hit, f"похоже на токен Telegram: {hit.group(0) if hit else ''}")

    def test_env_example_has_no_values(self):
        """В .env.example не должно быть реальных значений."""
        text = (BASE / ".env.example").read_text(encoding="utf-8")
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            with self.subTest(key=key):
                # Осмысленные значения по умолчанию допустимы, секреты — нет.
                if key in {"BOT_TOKEN", "WEBAPP_BASE", "API_CORS_ORIGIN"}:
                    self.assertEqual(value.strip(), "",
                                     "секрет или домен не должен быть заполнен в примере")

    def test_env_is_gitignored(self):
        gitignore = (BASE / ".gitignore").read_text(encoding="utf-8")
        self.assertTrue(".env" in gitignore, ".env обязан быть в .gitignore")

    def test_env_not_tracked_by_git(self):
        try:
            out = subprocess.run(
                ["git", "ls-files", "--error-unmatch", ".env"],
                cwd=str(BASE), capture_output=True, text=True,
            )
        except FileNotFoundError:
            self.skipTest("git не найден")
        self.assertNotEqual(out.returncode, 0, ".env закоммичен в репозиторий")

    def test_database_not_tracked(self):
        try:
            out = subprocess.run(
                ["git", "ls-files"], cwd=str(BASE), capture_output=True, text=True,
            )
        except FileNotFoundError:
            self.skipTest("git не найден")
        for line in out.stdout.splitlines():
            with self.subTest(file=line):
                self.assertFalse(line.endswith(".db"), "файл БД не должен быть в репозитории")

    def test_no_user_progress_in_repo(self):
        for d in ("progress", "sessions"):
            path = BASE / d
            if path.exists():
                files = [p for p in path.rglob("*") if p.is_file()]
                self.assertEqual(files, [], f"каталог {d}/ должен быть пустым в репозитории")


class TestWebSecurity(unittest.TestCase):

    def setUp(self):
        self.pages = list((BASE / "webapp").glob("*.html"))

    def test_csp_present_and_strict(self):
        for page in self.pages:
            html = page.read_text(encoding="utf-8")
            m = re.search(r'Content-Security-Policy" content="([^"]+)"', html)
            with self.subTest(page=page.name):
                self.assertIsNotNone(m, "нет заголовка Content-Security-Policy")
                csp = m.group(1)
                self.assertIn("default-src 'self'", csp)
                self.assertIn("base-uri 'none'", csp,
                              "без base-uri можно подменить относительные ссылки")
                self.assertIn("form-action 'none'", csp)
                # connect-src ограничен своим origin: приложение не должно
                # уметь отправлять данные пользователя куда-то ещё.
                self.assertIn("connect-src 'self'", csp)
                self.assertNotIn("unsafe-eval", csp)
                self.assertNotIn("script-src *", csp)
                # frame-ancestors в <meta> браузером игнорируется и работает
                # только HTTP-заголовком. В мета-теге он создавал бы ложное
                # ощущение защиты и шумел в консоли.
                self.assertNotIn("frame-ancestors", csp)

    def test_frame_ancestors_is_set_by_web_server(self):
        """Ограничение на встраивание задаётся заголовком, а не мета-тегом."""
        caddy = (BASE / "deploy" / "Caddyfile.example").read_text(encoding="utf-8")
        self.assertIn("frame-ancestors", caddy)
        self.assertIn("web.telegram.org", caddy,
                      "Mini App обязан открываться во фрейме Telegram")
        # X-Frame-Options: DENY сломал бы Mini App — он открывается во фрейме
        # Telegram. Проверяем именно директивы, а не комментарии: упоминание
        # заголовка в пояснении — это документация, а не настройка.
        directives = [ln for ln in caddy.splitlines()
                      if ln.strip() and not ln.strip().startswith("#")]
        for line in directives:
            self.assertNotIn("X-Frame-Options", line,
                             "X-Frame-Options сломает открытие Mini App во фрейме")

    def test_only_telegram_is_external(self):
        for page in self.pages:
            html = page.read_text(encoding="utf-8")
            for m in re.finditer(r'src="(https?://[^"]+)"', html):
                with self.subTest(page=page.name, url=m.group(1)):
                    self.assertTrue(
                        m.group(1).startswith("https://telegram.org/js/telegram-web-app.js"),
                        "единственный допустимый внешний скрипт — telegram-web-app.js",
                    )

    def test_external_links_are_safe(self):
        """У ссылок в новое окно обязателен rel=noopener: без него открытая
        страница получает доступ к window.opener."""
        for page in self.pages:
            html = page.read_text(encoding="utf-8")
            for m in re.finditer(r'target="_blank"', html):
                start = max(0, m.start() - 200)
                context = html[start:m.end() + 120]
                with self.subTest(page=page.name):
                    self.assertIn("noopener", context)

    def test_user_text_is_escaped(self):
        """Пользовательский текст (заметки, истории, доказательства) должен
        попадать в разметку только через экранирование."""
        risky = {
            "library.html": ["note"],
            "vacancy.html": ["evidence", "gap"],
        }
        for page_name, fields in risky.items():
            html = (BASE / "webapp" / page_name).read_text(encoding="utf-8")
            for field in fields:
                # Ищем вставку значения поля в шаблон строки без App.esc.
                bad = re.search(r"\+\s*(?:st\.|state\.|e\.)?" + field + r"\s*\+", html)
                with self.subTest(page=page_name, field=field):
                    self.assertIsNone(
                        bad,
                        f"поле {field} вставляется в разметку без App.esc — это XSS",
                    )
                self.assertIn(f"App.esc({field})", html.replace("\n", " ").replace("  ", " ")
                              .replace("App.esc(st." + field + ")", f"App.esc({field})")
                              .replace("App.esc(x." + field + ")", f"App.esc({field})"),
                              f"{page_name}: значение {field} должно проходить через App.esc")

    def test_esc_covers_all_dangerous_chars(self):
        """Проверяем саму функцию экранирования, а не только её вызовы."""
        app_js = (BASE / "webapp" / "app.js").read_text(encoding="utf-8")
        for ch in ("&amp;", "&lt;", "&gt;", "&quot;", "&#39;"):
            with self.subTest(char=ch):
                self.assertIn(ch, app_js, "функция esc должна экранировать все опасные символы")
        # Амперсанд обязан заменяться первым, иначе двойное экранирование ломает вывод.
        self.assertLess(app_js.index("/&/g"), app_js.index("/</g"))


class TestApiSecurity(unittest.TestCase):

    def test_auth_uses_constant_time_compare(self):
        auth = (BASE / "api" / "auth.py").read_text(encoding="utf-8")
        self.assertIn("compare_digest", auth,
                      "сравнение подписи должно быть за постоянное время")
        self.assertNotIn("expected == received_hash", auth)

    def test_user_id_never_from_body(self):
        """user_id обязан браться только из проверенного initData."""
        app = (BASE / "api" / "app.py").read_text(encoding="utf-8")
        self.assertNotIn("body.get(\"user_id\")", app)
        self.assertNotIn("payload.user_id", app)
        self.assertIn("_auth(x_init_data)", app)

    def test_sql_is_parameterized(self):
        storage = (BASE / "api" / "storage.py").read_text(encoding="utf-8")
        # Форматирование значений прямо в SQL — прямой путь к инъекции.
        for pattern in ('execute(f"', "execute(f'", '% (user_id', '.format('):
            with self.subTest(pattern=pattern):
                self.assertNotIn(pattern + "SELECT", storage)
                self.assertNotIn(pattern + "INSERT", storage)
                self.assertNotIn(pattern + "DELETE", storage)

    def test_body_size_is_limited(self):
        app = (BASE / "api" / "app.py").read_text(encoding="utf-8")
        self.assertIn("MAX_BODY", app)
        self.assertIn("413", app, "превышение размера тела должно отвергаться")

    def test_docs_disabled(self):
        app = (BASE / "api" / "app.py").read_text(encoding="utf-8")
        self.assertIn("docs_url=None", app)
        self.assertIn("openapi_url=None", app)

    def test_init_data_is_never_logged(self):
        """initData — секрет на время жизни: его нельзя писать в лог."""
        app = (BASE / "api" / "app.py").read_text(encoding="utf-8")
        for bad in ("log.info(init_data", "log.debug(init_data",
                    "%s\", init_data", "log.warning(init_data"):
            with self.subTest(pattern=bad):
                self.assertNotIn(bad, app)

    def test_stacktrace_not_returned(self):
        app = (BASE / "api" / "app.py").read_text(encoding="utf-8")
        self.assertIn("internal error", app,
                      "наружу должно уходить общее сообщение, а не стектрейс")

    def test_bot_token_read_from_env_not_hardcoded(self):
        for name in ("bot.py", "api/app.py"):
            text = (BASE / name).read_text(encoding="utf-8")
            with self.subTest(file=name):
                self.assertIn("BOT_TOKEN", text)
                self.assertIsNone(TOKEN_RE.search(text))


class TestSystemdHardening(unittest.TestCase):
    """Юниты должны запускаться в песочнице и не от root."""

    def test_units_are_hardened(self):
        units = list((BASE / "deploy").glob("*.service"))
        self.assertTrue(units, "должны быть systemd-юниты")
        required = [
            "ProtectSystem=strict", "ProtectHome=true", "PrivateTmp=true",
            "NoNewPrivileges=true", "RestrictNamespaces=true",
            "SystemCallFilter=@system-service",
        ]
        for unit in units:
            text = unit.read_text(encoding="utf-8")
            for directive in required:
                with self.subTest(unit=unit.name, directive=directive):
                    self.assertIn(directive, text)
            with self.subTest(unit=unit.name, check="not root"):
                self.assertIn("User=", text)
                self.assertNotIn("User=root", text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
