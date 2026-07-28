// Проверка единого поиска: русский, английский, синонимы, частичное совпадение.
// Запуск: node webapp/_search_check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const Search = require("./search.js");
const CONTENT = require("./_content_all.js").forTrack("redcore-junior-seo");

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
const eq = (a, b, m) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    console.error(`FAIL: ${m}\n  получено ${JSON.stringify(a)}\n  ожидалось ${JSON.stringify(b)}`);
    failed++;
  }
};

// ── нормализация ──
eq(Search.norm("Canonical URL"), "canonical url", "приведение к нижнему регистру");
eq(Search.norm("Ёлка, «тест»!"), "елка тест", "ё приводится к е, пунктуация убирается");
eq(Search.norm("  a   b  "), "a b", "лишние пробелы схлопываются");
eq(Search.norm(null), "", "null не ломает нормализацию");

// ── индекс ──
const index = Search.buildIndex(CONTENT, "redcore-junior-seo");
ok(index.length > 200, `индекс должен покрывать весь контент (получено ${index.length})`);

const types = new Set(index.map((e) => e.type));
["lesson", "term", "library", "question", "mock", "case", "step"].forEach((t) => {
  ok(types.has(t), `в индексе нет записей типа ${t}`);
});

function find(q, opts) {
  return Search.query(index, q, opts || {});
}
function titles(res) { return res.map((r) => r.entry.title); }

// ── поиск по русскому и английскому ──
ok(find("canonical").length > 0, "английский термин находится");
ok(find("Canonical").length > 0, "регистр не важен");
ok(find("канонический").length > 0, "русское описание находится");
ok(find("интент").length > 0, "русский термин находится");

// Точное совпадение с названием термина должно быть первым.
const canon = find("canonical url");
ok(canon.length > 0 && /canonical/i.test(canon[0].entry.title),
  "точное совпадение с термином стоит первым");

// ── синонимы ──
const byAlias = find("rel=canonical");
ok(byAlias.some((r) => r.entry.id === "t-canonical-url"),
  "поиск по синониму (aliases) находит термин");
const byAlias2 = find("KD");
ok(byAlias2.some((r) => r.entry.id === "t-keyword-difficulty"),
  "аббревиатура из aliases находит термин");

// ── частичное совпадение ──
ok(find("канони").length > 0, "частичное совпадение работает");
ok(find("robots").length > 0, "поиск по robots находит записи");

// ── все слова запроса обязательны ──
const two = find("canonical пагинация");
const one = find("canonical");
ok(two.length < one.length,
  "добавление второго слова сужает выдачу, а не расширяет её");
eq(find("zzzqqq"), [], "бессмысленный запрос не находит ничего");
eq(find("a"), [], "слишком короткий запрос игнорируется");
eq(find(""), [], "пустой запрос не выдаёт весь индекс");

// ── фильтр по типу ──
const onlyTerms = find("canonical", { types: ["term"] });
ok(onlyTerms.length > 0, "фильтр по типу находит записи");
ok(onlyTerms.every((r) => r.entry.type === "term"), "фильтр по типу не пропускает чужое");

// ── лимит ──
ok(find("seo", { limit: 5 }).length <= 5, "лимит выдачи соблюдается");

// ── ссылки ──
index.slice(0, 50).forEach((e) => {
  const href = Search.hrefFor(e);
  ok(href !== "#" && href.includes(".html"),
    `для типа ${e.type} не построена ссылка`);
});

// ── детерминированность ──
eq(titles(find("индексация")), titles(find("индексация")),
  "одинаковый запрос даёт одинаковый порядок");

// ── поиск находит записи всех типов ──
ok(find("страница не индексируется", { types: ["case"] }).length > 0,
  "кейс находится по названию");
ok(find("расскажите о себе", { types: ["mock"] }).length > 0,
  "открытый вопрос находится по формулировке");
ok(find("как работает google", { types: ["step"] }).length > 0,
  "шаг плана находится по названию");

if (failed) { console.error(`\n_search_check: провалено проверок ${failed}`); process.exit(1); }
console.log(`_search_check: OK (записей в индексе ${index.length})`);
