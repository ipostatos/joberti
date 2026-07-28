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
  ["generated/content_core.js", "content-loader.js", "srs.js", "progress.js",
   "readiness.js"].forEach((dep) => {
    const depIdx = html.indexOf('src="' + dep + '"');
    ok(depIdx !== -1 && depIdx < appIdx,
      `${page}: ${dep} должен подключаться до app.js`);
  });
  // Загрузчик читает CONTENT.trackFiles, поэтому обязан идти ПОСЛЕ общей части.
  ok(html.indexOf('src="generated/content_core.js"') < html.indexOf('src="content-loader.js"'),
    `${page}: content-loader.js должен подключаться после generated/content_core.js`);
});

// ── ключ профиля продублирован в загрузчике ──
// content-loader.js читает trackId до подключения progress.js, поэтому имя
// ключа записано у него своей строкой. Рассинхрон проявился бы не ошибкой, а
// «пустым» приложением у людей с уже выбранным треком.
{
  const loader = readFileSync(join(DIR, "content-loader.js"), "utf8");
  const progress = readFileSync(join(DIR, "progress.js"), "utf8");
  const inLoader = loader.match(/K_PROFILE\s*=\s*"([^"]+)"/);
  const inProgress = progress.match(/K_PROFILE\s*=\s*"([^"]+)"/);
  ok(!!inLoader && !!inProgress && inLoader[1] === inProgress[1],
    "ключ профиля в content-loader.js и progress.js должен совпадать: " +
    `${inLoader && inLoader[1]} против ${inProgress && inProgress[1]}`);
}

// ── .t/.d обязаны быть блочными ──
// Классы .t (заголовок) и .d (пояснение) размечены как <span>, то есть по
// умолчанию строчные. Чтобы они встали отдельными строками, нужно ЛИБО
// правило «.контейнер .t{ display:block }», ЛИБО контейнер-флекс-колонка.
// Иначе текст слипается: «Linux и службыУверенно читать…теория 0/1».
// Наличия правила недостаточно — оно может задавать только шрифт и цвет,
// и ровно на этом проверка уже один раз промахнулась.
const themeCss = readFileSync(join(DIR, "theme.css"), "utf8");

// Правила вида «.X .t{…}» / «.X .d{…}» и сами контейнеры «.X{…}».
const ruleRe = /\.([a-z][\w-]*)\s+\.([td])\s*\{([^}]*)\}/g;
const containerRe = /\.([a-z][\w-]*)\s*\{([^}]*)\}/g;

// Собираем ОТДЕЛЬНО по .t и по .d: блочность одного не спасает второй.
// И возвращаем новый результат на каждый вызов — иначе локальные правила
// одной страницы протекли бы на другие, и проверка молча ослабла бы.
function collectRules(css) {
  const block = { t: new Set(), d: new Set() };
  for (const m of css.matchAll(ruleRe)) {
    if (/display\s*:\s*(block|flex|grid)/.test(m[3])) block[m[2]].add(m[1]);
  }
  for (const m of css.matchAll(containerRe)) {
    const body = m[2];
    const isColumn = /display\s*:\s*flex/.test(body) && /flex-direction\s*:\s*column/.test(body);
    if (isColumn || /display\s*:\s*grid/.test(body)) {
      block.t.add(m[1]);
      block.d.add(m[1]);
    }
  }
  return block;
}

const themeBlock = collectRules(themeCss);

pages.forEach((page) => {
  const html = readFileSync(join(DIR, page), "utf8");
  const local = collectRules(html);
  // Контейнер годится, только если блочны ОБА класса: и заголовок, и пояснение.
  const known = new Set(
    [...themeBlock.t, ...local.t].filter(
      (cls) => themeBlock.d.has(cls) || local.d.has(cls)));
  // Контейнер строки — ближайший предшествующий блочный тег, а НЕ соседний
  // <span class="ic-tile">, который идёт прямо перед .body. Класс бывает
  // литералом и началом склейки: class="step ' + st + '".
  const rowRe = /<(?:button|div|a|li|label)\b[^>]*?class="([a-z][\w-]*)/g;
  for (const m of html.matchAll(/<span class="body"><span class="t"/g)) {
    const before = html.slice(0, m.index);
    const open = [...before.matchAll(rowRe)].pop();
    ok(open && known.has(open[1]),
      `${page}: <span class="t"> внутри «${open ? open[1] : "?"}» остаётся строчным — ` +
      `нужен display:block у .${open ? open[1] : "?"} .t/.d, иначе заголовок ` +
      `склеится с описанием`);
  }
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
const CONTENT = require("./_content_all.js").core;
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
