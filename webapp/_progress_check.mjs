// Проверка мотивационного слоя: дневная цель, «бережная» серия, история.
// Запуск: node webapp/_progress_check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const P = require("./progress.js");

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
const eq = (a, b, m) => {
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) { console.error(`FAIL: ${m}\n  получено ${sa}\n  ожидалось ${sb}`); failed++; }
};

// ── ключи дат ──
eq(P.dayKey(new Date(2026, 6, 27)), "2026-07-27", "dayKey форматирует локальную дату");
eq(P.dayDiff("2026-07-01", "2026-07-10"), 9, "dayDiff считает разницу в днях");
eq(P.dayDiff("2026-02-28", "2026-03-01"), 1, "dayDiff учитывает конец месяца");
ok(P.dayDiff(null, "2026-07-01") === Infinity, "нет предыдущего дня — бесконечность");
ok(P.dayDiff("мусор", "2026-07-01") === Infinity, "мусорная дата не ломает расчёт");

// ── чистое ядро серии ──
eq(P.nextStreak({}, "2026-07-01"),
  { streak: 1, best: 1, lastDay: "2026-07-01", frozenUsed: false },
  "первая активность начинает серию");

eq(P.nextStreak({ streak: 3, best: 5, lastDay: "2026-07-01", frozenUsed: false }, "2026-07-02"),
  { streak: 4, best: 5, lastDay: "2026-07-02", frozenUsed: false },
  "активность подряд продолжает серию");

eq(P.nextStreak({ streak: 3, best: 3, lastDay: "2026-07-01", frozenUsed: false }, "2026-07-01"),
  { streak: 3, best: 3, lastDay: "2026-07-01", frozenUsed: false },
  "повторная активность в тот же день не меняет серию");

// Ровно один пропущенный день переживается — но только один раз подряд.
eq(P.nextStreak({ streak: 3, best: 3, lastDay: "2026-07-01", frozenUsed: false }, "2026-07-03"),
  { streak: 4, best: 4, lastDay: "2026-07-03", frozenUsed: true },
  "пропуск одного дня переживается страховкой");

eq(P.nextStreak({ streak: 4, best: 4, lastDay: "2026-07-03", frozenUsed: true }, "2026-07-05"),
  { streak: 1, best: 4, lastDay: "2026-07-05", frozenUsed: false },
  "вторая заморозка подряд не даётся — серия рвётся");

eq(P.nextStreak({ streak: 9, best: 9, lastDay: "2026-07-01", frozenUsed: false }, "2026-07-05"),
  { streak: 1, best: 9, lastDay: "2026-07-05", frozenUsed: false },
  "разрыв больше двух дней сбрасывает серию, лучший результат сохраняется");

// ── дневная цель ──
P.reset();
eq(P.getGoal(), 15, "цель по умолчанию");
eq(P.setGoal(25), 25, "цель сохраняется");
eq(P.setGoal(1), 5, "слишком маленькая цель поднимается до минимума");
eq(P.setGoal(500), 100, "слишком большая цель ограничивается максимумом");
eq(P.setGoal("abc"), 15, "мусорная цель заменяется значением по умолчанию");

// ── счётчик действий ──
P.reset();
P.recordAction(1, "2026-07-01");
P.recordAction(3, "2026-07-01");
eq(P.todayCount("2026-07-01"), 4, "действия суммируются за день");
eq(P.streakInfo("2026-07-01").streak, 1, "первый день даёт серию 1");

P.recordAction(1, "2026-07-02");
eq(P.streakInfo("2026-07-02").streak, 2, "второй день подряд увеличивает серию");
eq(P.streakInfo("2026-07-06").streak, 0,
  "при заходе через несколько дней серия показывается нулевой");
eq(P.streakInfo("2026-07-06").best, 2, "лучшая серия при этом не теряется");

// Состояние «на льду»: пропущен ровно день, страховка ещё цела.
ok(P.streakInfo("2026-07-04").onIce, "пропуск одного дня показывается как «на льду»");

// ── профиль ──
P.reset();
P.setTrack("redcore-junior-seo");
eq(P.getTrack(), "redcore-junior-seo", "трек сохраняется");
ok(!P.isOnboarded(), "по умолчанию настройка не пройдена");
P.setOnboarded(true);
ok(P.isOnboarded(), "флаг настройки сохраняется");

P.patchProfile((p) => { p.mock["m1"] = { rating: 3, count: 1 }; });
eq(P.profile().mock.m1.rating, 3, "patchProfile сохраняет вложенные данные");
eq(P.profile().cases, {}, "неинициализированные разделы профиля пустые, а не undefined");

// ── дата собеседования ──
P.setExamDate("2026-08-15");
eq(P.getExamDate(), "2026-08-15", "дата собеседования сохраняется");
eq(P.daysToExam("2026-08-01"), 14, "дни до собеседования считаются");
eq(P.daysToExam("2026-08-20"), -5, "прошедшая дата даёт отрицательное число");
P.setExamDate(null);
ok(P.getExamDate() === null, "дату можно очистить");

// ── история ──
P.reset();
const a1 = P.addAttempt({ kind: "quiz", mode: "quick", total: 10, correct: 8, pct: 80 });
ok(a1.id, "у записи истории есть идентификатор");
eq(P.history().length, 1, "запись попадает в историю");
eq(P.historyOf("mock").length, 0, "фильтр по типу работает");

for (let i = 0; i < P.MAX_ATTEMPTS + 20; i++) {
  P.addAttempt({ kind: "quiz", mode: "quick", total: 1, correct: 1, pct: 100 });
}
eq(P.history().length, P.MAX_ATTEMPTS,
  "история обрезается до лимита, иначе localStorage упрётся в квоту");

// Снимок готовности пишется не чаще раза в день.
P.reset();
ok(P.recordReadinessSnapshot(40, "2026-07-01"), "первый снимок за день пишется");
ok(!P.recordReadinessSnapshot(45, "2026-07-01"), "второй снимок за тот же день не пишется");
ok(P.recordReadinessSnapshot(50, "2026-07-02"), "снимок за новый день пишется");

// ── сброс ──
P.setExamDate("2026-09-01");
P.reset();
ok(P.getExamDate() === null, "сброс удаляет дату собеседования");
eq(P.history().length, 0, "сброс очищает историю");
eq(P.profile().trackId, undefined, "сброс очищает профиль");

// ── лимиты должны совпадать с серверными ──
eq(P.MAX_DAYS, 365, "лимит дней активности совпадает с api/merge.py");
eq(P.MAX_ATTEMPTS, 100, "лимит истории совпадает с api/merge.py");

if (failed) { console.error(`\n_progress_check: провалено проверок ${failed}`); process.exit(1); }
console.log("_progress_check: OK");
