// Проверка навигации и целостности ссылок Mini App.
//
// Ловит две частые поломки: ссылку на несуществующую страницу и страницу,
// с которой невозможно вернуться. Обе видны только при ручном клике, поэтому
// проверяются автоматически.
//
// Запуск: node webapp/_nav_check.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const DIR = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };

const pages = readdirSync(DIR).filter((f) => f.endsWith(".html"));
ok(pages.includes("index.html"), "index.html обязателен: это стартовый экран");

// ── внутренние ссылки ведут на существующие страницы ──
const linkRe = /(?:href|src)="([^"#?]+\.(?:html|js|css|svg|webmanifest))(?:[?#][^"]*)?"/g;
pages.forEach((page) => {
  const html = readFileSync(join(DIR, page), "utf8");
  for (const m of html.matchAll(linkRe)) {
    const target = m[1];
    if (/^(https?:)?\/\//.test(target)) continue;      // внешние не проверяем
    ok(existsSync(join(DIR, target)),
      `${page}: ссылка на несуществующий файл ${target}`);
  }
});

// ── ссылки в JS-модулях ──
const jsFiles = readdirSync(DIR).filter((f) => f.endsWith(".js") && !f.startsWith("_"));
const pageRefRe = /"([a-z-]+\.html)(?:\?[^"]*)?"/g;
jsFiles.forEach((f) => {
  const src = readFileSync(join(DIR, f), "utf8");
  for (const m of src.matchAll(pageRefRe)) {
    ok(existsSync(join(DIR, m[1])), `${f}: ссылка на несуществующую страницу ${m[1]}`);
  }
});

// ── nav.js подключён везде и ровно один раз помечен как домашний ──
let homeCount = 0;
pages.forEach((page) => {
  const html = readFileSync(join(DIR, page), "utf8");
  ok(/<script src="nav\.js"/.test(html), `${page}: не подключён nav.js`);
  if (/nav\.js" data-home="true"/.test(html)) homeCount++;
});
// Стартовых экрана два — index.html и onboarding.html: мастер настройки тоже
// является точкой входа, из него некуда возвращаться «назад».
ok(homeCount === 2,
  `ровно две страницы должны быть помечены data-home="true" (index и onboarding), найдено ${homeCount}`);

// ── с каждой не-домашней страницы есть путь назад ──
pages.forEach((page) => {
  if (page === "index.html" || page === "onboarding.html") return;
  const html = readFileSync(join(DIR, page), "utf8");
  const hasLink = /href="index\.html"/.test(html) ||
    /href="[a-z-]+\.html"/.test(html) ||
    /__navBack/.test(html);
  ok(hasLink, `${page}: нет ни одной ссылки назад и нет обработчика __navBack`);
});

// ── порядок подключения модулей ──
// app.js использует CONTENT, SRS, Progress, Readiness — если он подключён
// раньше, страница упадёт на первой же строке.
pages.forEach((page) => {
  const html = readFileSync(join(DIR, page), "utf8");
  // Ищем именно src="app.js": подстрока "app.js" встречается ещё и внутри
  // telegram-web-app.js, и поиск по ней давал бы ложные срабатывания.
  const appIdx = html.indexOf('src="app.js"');
  if (appIdx === -1) return;
  ["generated/content_data.js", "srs.js", "progress.js", "readiness.js"].forEach((dep) => {
    const depIdx = html.indexOf('src="' + dep + '"');
    ok(depIdx !== -1 && depIdx < appIdx,
      `${page}: ${dep} должен подключаться до app.js`);
  });
});

// ── иконки, используемые в разметке, существуют ──
const Icons = require("./icons.js");
const iconRe = /data-icon="([a-z-]+)"/g;
const usedIcons = new Set();
pages.concat(jsFiles).forEach((f) => {
  const src = readFileSync(join(DIR, f), "utf8");
  for (const m of src.matchAll(iconRe)) usedIcons.add(m[1]);
});
usedIcons.forEach((name) => {
  ok(Icons.has(name), `используется несуществующая иконка "${name}"`);
});

// Иконки достижений тоже приходят из данных, а не из разметки.
const CONTENT = require("./generated/content_data.js");
CONTENT.achievements.forEach((a) => {
  ok(Icons.has(a.icon), `иконка достижения "${a.icon}" (${a.id}) отсутствует в наборе`);
});

// ── внешние скрипты ──
// Единственный допустимый внешний ресурс — telegram-web-app.js. Любой другой
// CDN нарушает требование самодостаточности и ломает офлайн-режим.
pages.forEach((page) => {
  const html = readFileSync(join(DIR, page), "utf8");
  for (const m of html.matchAll(/src="(https?:\/\/[^"]+)"/g)) {
    ok(m[1].startsWith("https://telegram.org/js/telegram-web-app.js"),
      `${page}: подключён посторонний внешний скрипт ${m[1]}`);
  }
  ok(!/<link[^>]+href="https?:\/\//.test(html),
    `${page}: подключён внешний стиль или шрифт`);
});

// ── мобильная вёрстка и тема ──
const theme = readFileSync(join(DIR, "theme.css"), "utf8");
ok(theme.includes("--tg-theme-bg-color"), "тема должна опираться на переменные Telegram");
ok(theme.includes("prefers-color-scheme: light"),
  "нужен светлый фолбэк, иначе при системной светлой теме получится белое на белом");
ok(theme.includes("prefers-reduced-motion"),
  "нужно уважать системную настройку уменьшения движения");

if (failed) { console.error(`\n_nav_check: провалено проверок ${failed}`); process.exit(1); }
console.log(`_nav_check: OK (страниц ${pages.length}, иконок в разметке ${usedIcons.size})`);
