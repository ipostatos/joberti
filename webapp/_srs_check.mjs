// Проверка ядра SRS без браузера. Запуск: node webapp/_srs_check.mjs
// Модуль экспортируется и в window, и в module.exports — поэтому тестируется
// ровно тот код, который поедет в прод, а не его копия.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

// localStorage-заглушка: SRS обращается к global.localStorage.
const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const SRS = require("./srs.js");

let failed = 0;
function ok(cond, msg) {
  if (!cond) { console.error("FAIL:", msg); failed++; }
}
function eq(a, b, msg) {
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) { console.error(`FAIL: ${msg}\n  получено ${sa}\n  ожидалось ${sb}`); failed++; }
}

const NOW = 1_700_000_000_000;

// ── чистое ядро перехода ──
eq(SRS.nextState(undefined, true, NOW), { box: 1, due: NOW + SRS.INTERVALS[1] },
  "верный ответ на невиданном элементе поднимает в коробку 1");
eq(SRS.nextState({ box: 3, due: 0 }, true, NOW), { box: 4, due: NOW + SRS.INTERVALS[4] },
  "верный ответ поднимает коробку на единицу");
eq(SRS.nextState({ box: 5, due: 0 }, true, NOW), { box: 5, due: NOW + SRS.INTERVALS[5] },
  "коробка не превышает максимум");
eq(SRS.nextState({ box: 4, due: 0 }, false, NOW), { box: 0, due: NOW + SRS.INTERVALS[0] },
  "ошибка сбрасывает в коробку 0");

// Интервалы должны строго расти: иначе высокая коробка спрашивалась бы чаще низкой.
for (let i = 1; i < SRS.INTERVALS.length; i++) {
  ok(SRS.INTERVALS[i] > SRS.INTERVALS[i - 1],
    `интервал коробки ${i} должен быть больше интервала ${i - 1}`);
}

// ── работа с хранилищем ──
SRS.reset();
SRS.grade("q:a", true, NOW);
eq(SRS.boxOf("q:a"), 1, "grade сохраняет состояние");
ok(SRS.boxOf("q:missing") === null, "неизвестный элемент не имеет коробки");

// Невиданный элемент считается «пора учить».
ok(SRS.isDue("q:new", NOW), "невиданный элемент к повтору");
ok(!SRS.isDue("q:a", NOW), "только что отвеченный элемент не к повтору");
ok(SRS.isDue("q:a", NOW + SRS.INTERVALS[1] + 1), "элемент созревает после интервала");

// Порча хранилища не должна ломать приложение.
store["interview_srs_v1"] = "{не json";
eq(SRS.stateMap(), {}, "битое хранилище читается как пустое");
SRS.reset();

// ── подсчёты ──
SRS.reset();
SRS.grade("q:1", true, NOW);      // box 1
SRS.grade("q:2", true, NOW);
SRS.grade("q:2", true, NOW);      // box 2
SRS.grade("q:3", false, NOW);     // box 0
const ids = ["q:1", "q:2", "q:3", "q:4"];

eq(SRS.stats(ids).started, 3, "stats считает только начатые");
eq(SRS.stats(ids).total, 4, "stats знает общий размер набора");

// Сразу после ответа ничего не «созрело»: даже ошибка возвращается не мгновенно,
// а через INTERVALS[0], иначе один и тот же вопрос крутился бы в одной сессии.
eq(SRS.dueCount(ids, NOW), 1, "сразу после ответов к повтору только невиданный элемент");
eq(SRS.reviewDueCount(ids, NOW), 0, "reviewDueCount не считает невиданные");

// А вот спустя интервал ошибочный вопрос действительно возвращается.
const AFTER_ERR = NOW + SRS.INTERVALS[0] + 1;
eq(SRS.dueCount(ids, AFTER_ERR), 2, "после INTERVALS[0] ошибочный вопрос созревает");
eq(SRS.reviewDueCount(ids, AFTER_ERR), 1, "созревший ошибочный вопрос считается повтором");

// Освоенность: box/MAX_BOX, среднее по набору.
const expected = (1 / 5 + 2 / 5 + 0 + 0) / 4;
ok(Math.abs(SRS.mastery(ids) - expected) < 1e-9, "mastery считает среднее по коробкам");
eq(SRS.mastery([]), 0, "пустой набор даёт нулевую освоенность");

// reviewsLeft: сколько верных ответов до «закреплено».
eq(SRS.reviewsLeft(ids), (4 - 1) + (4 - 2) + 4 + 4, "reviewsLeft считает путь до закрепления");

// ── приоритет повторения ──
// Оба элемента должны быть просрочены, иначе сравнивать приоритет не с чем:
// коробка 2 живёт сутки, поэтому берём момент двухдневной давности.
SRS.reset();
const LONG_AGO = NOW - 2 * 24 * 60 * 60 * 1000;
SRS.grade("q:low", false, LONG_AGO);           // коробка 0
SRS.grade("q:high", true, LONG_AGO);
SRS.grade("q:high", true, LONG_AGO);           // коробка 2
ok(SRS.isDue("q:low", NOW) && SRS.isDue("q:high", NOW), "оба элемента просрочены");

const picked = SRS.pickDue(["q:high", "q:low", "q:fresh"], 3, NOW);
eq(picked[0], "q:low", "низкая коробка идёт первой");
eq(picked[1], "q:high", "высокая коробка идёт после низкой");
eq(picked[2], "q:fresh", "невиданные идут в конец, чтобы не топить повтор");
eq(SRS.pickDue(["q:high", "q:low", "q:fresh"], 2, NOW).length, 2, "pickDue уважает лимит");

// ── префиксы типов ──
eq(SRS.id("question", "abc"), "q:abc", "префикс вопроса");
eq(SRS.id("term", "abc"), "t:abc", "префикс термина");
eq(SRS.id("mock", "abc"), "m:abc", "префикс mock-вопроса");
eq(SRS.id("case", "abc"), "c:abc", "префикс кейса");
let threw = false;
try { SRS.id("unknown", "x"); } catch (e) { threw = true; }
ok(threw, "неизвестный тип идентификатора отвергается");

// ── пакетная запись ──
SRS.reset();
SRS.gradeMany([{ id: "q:x", correct: true }, { id: "q:y", correct: false }], NOW);
eq(SRS.boxOf("q:x"), 1, "gradeMany записывает верный ответ");
eq(SRS.boxOf("q:y"), 0, "gradeMany записывает ошибку");

if (failed) { console.error(`\n_srs_check: провалено проверок ${failed}`); process.exit(1); }
console.log("_srs_check: OK");
