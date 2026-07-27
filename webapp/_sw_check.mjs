// Проверка полноты списка PRECACHE в service-worker.js.
//
// Зачем: список кэшируемых файлов легко отстаёт от реального набора страниц.
// Забытый файл виден не сразу — только у пользователя без сети, белым экраном.
// Здесь список сверяется с содержимым каталога webapp/.
//
// Запуск: node webapp/_sw_check.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };

const swText = readFileSync(join(DIR, "service-worker.js"), "utf8");

// Достаём массив PRECACHE из исходника, не выполняя его.
const m = swText.match(/var PRECACHE = \[([\s\S]*?)\];/);
ok(!!m, "в service-worker.js должен быть массив PRECACHE");
if (!m) { process.exit(1); }

const precache = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
ok(precache.length > 10, "PRECACHE не должен быть пустым или почти пустым");

// ── все html и js каталога должны быть в списке ──
const files = readdirSync(DIR);
const pages = files.filter((f) => f.endsWith(".html"));
const scripts = files.filter((f) => f.endsWith(".js") &&
  !f.startsWith("_") && f !== "service-worker.js");

pages.forEach((f) => {
  ok(precache.includes(f), `страница ${f} отсутствует в PRECACHE — офлайн она не откроется`);
});
scripts.forEach((f) => {
  ok(precache.includes(f), `модуль ${f} отсутствует в PRECACHE`);
});

// theme.css, манифест, иконка и сгенерированные данные — без них офлайн-режим
// открывается сломанным.
["theme.css", "manifest.webmanifest", "icon.svg", "generated/content_data.js"]
  .forEach((f) => {
    ok(precache.includes(f), `${f} отсутствует в PRECACHE`);
  });

// ── обратная проверка: в списке нет несуществующих файлов ──
precache.forEach((f) => {
  ok(existsSync(join(DIR, f)), `в PRECACHE указан несуществующий файл ${f}`);
});

// ── стратегии ──
ok(/\/api\//.test(swText) && /return;/.test(swText),
  "запросы к /api/ должны идти мимо кэша: это живое состояние пользователя");
ok(swText.includes("networkFirst"),
  "для страниц и кода нужна стратегия network-first, иначе после деплоя залипнет старый код");
ok(swText.includes("staleWhileRevalidate"),
  "для статики нужна стратегия stale-while-revalidate");
ok(/NET_TIMEOUT_MS\s*=\s*\d+/.test(swText),
  "у сетевого запроса должен быть таймаут, иначе на плохой сети приложение зависнет");

// Версия кэша обязана быть уникальной строкой: без bump старые клиенты
// продолжают жить на прежнем наборе файлов.
ok(/var CACHE = "interview-trainer-v\d+"/.test(swText),
  "имя кэша должно содержать версию");

// ── страницы подключают нужные модули ──
// Забытый script на странице проявляется как пустой экран уже онлайн.
const REQUIRED = ["theme.css", "nav.js", "icons.js"];
pages.forEach((f) => {
  const html = readFileSync(join(DIR, f), "utf8");
  REQUIRED.forEach((dep) => {
    ok(html.includes(dep), `страница ${f} не подключает ${dep}`);
  });
  ok(/<meta http-equiv="Content-Security-Policy"/.test(html),
    `на странице ${f} нет заголовка Content-Security-Policy`);
  ok(/<meta name="viewport"/.test(html), `на странице ${f} нет viewport`);
  ok(/<html lang="ru">/.test(html), `на странице ${f} не указан язык документа`);
});

if (failed) { console.error(`\n_sw_check: провалено проверок ${failed}`); process.exit(1); }
console.log(`_sw_check: OK (страниц ${pages.length}, модулей ${scripts.length})`);
