// Проверка правил слияния на стороне клиента + выгрузка эталонных результатов
// для теста паритета с api/merge.py.
//
// Запуск:
//   node webapp/_sync_check.mjs              — проверить правила
//   node webapp/_sync_check.mjs --dump       — выдать JSON результатов в stdout
//
// Второй режим использует tests/test_sync.py: он прогоняет ТЕ ЖЕ фикстуры через
// Python и сравнивает результаты. Расхождение означает, что клиент и сервер
// разошлись в понимании слияния — самая дорогая из возможных поломок синхрона.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const Sync = require("./sync.js");

// ── общие фикстуры (ровно те же в tests/test_sync.py) ────────────────────
export const FIXTURES = {
  srs: [
    // выше коробка побеждает
    [{ "q:a": { box: 1, due: 100 } }, { "q:a": { box: 3, due: 50 } }],
    // при равной коробке побеждает более поздний срок
    [{ "q:a": { box: 2, due: 100 } }, { "q:a": { box: 2, due: 300 } }],
    // элемент есть только с одной стороны
    [{ "q:a": { box: 2, due: 100 } }, { "q:b": { box: 1, due: 10 } }],
    // мусорные записи отбрасываются
    [{ "q:a": { box: 99, due: 1 } }, { "q:a": { box: 2, due: 5 } }],
    [{ "q:a": "мусор" }, { "q:b": { box: 0, due: 0 } }],
    [{}, {}],
  ],
  progress: [
    [
      { goal: 15, days: { "2026-07-01": 10 }, streak: 3, best: 5,
        lastDay: "2026-07-01", frozenUsed: false },
      { goal: 25, days: { "2026-07-01": 4, "2026-07-02": 8 }, streak: 1, best: 2,
        lastDay: "2026-07-02", frozenUsed: true },
    ],
    // сервер новее клиента
    [
      { days: {}, streak: 9, best: 9, lastDay: "2026-07-10", frozenUsed: true },
      { days: {}, streak: 2, best: 2, lastDay: "2026-07-02", frozenUsed: false },
    ],
    // флаги объединяются по ИЛИ
    [{ flags: { flawless: true } }, { flags: { weakTopicRecovered: true } }],
    // мусор в днях игнорируется
    [{ days: { "2026-07-01": "abc", "2026-07-02": -5 } }, { days: { "2026-07-01": 3 } }],
    [{}, {}],
  ],
  rated: [
    [{ m1: { rating: 2, count: 1, ts: 10 } }, { m1: { rating: 4, count: 3, ts: 20 } }],
    [{ m1: { rating: 4, count: 3, ts: 30 } }, { m1: { rating: 1, count: 1, ts: 40 } }],
    [{ m1: { rating: 3, count: 2, ts: 5 } }, { m2: { rating: 1, count: 1, ts: 7 } }],
    [{ m1: { rating: "abc", count: null } }, { m1: { rating: 9, count: -3 } }],
    [{}, {}],
  ],
  roadmap: [
    [
      { s1: { lessonRead: true, quizBest: 60, casesDone: 1, mocksAnswered: 0, done: false } },
      { s1: { lessonRead: false, quizBest: 85, casesDone: 0, mocksAnswered: 2, done: true } },
    ],
    [{ s1: { done: true } }, { s2: { quizBest: 40 } }],
    [{}, {}],
  ],
  requirements: [
    [{ r1: { status: "partial", evidence: "было" } },
     { r1: { status: "confirmed", evidence: "стало" } }],
    [{ r1: { status: "confirmed", evidence: "было" } },
     { r1: { status: "learning", evidence: "" } }],
    [{ r1: { status: "not_started" } }, { r2: { status: "learning" } }],
    [{}, {}],
  ],
  library: [
    [{ l1: { read: true, note: "старая" } }, { l1: { read: false, note: "новая" } }],
    [{ l1: { read: false, note: "" } }, { l1: { read: true, note: "" } }],
    [{}, {}],
  ],
  stories: [
    [
      { s1: { situation: "A", task: "A", action: "A", result: "A", reflection: "A", updatedAt: 100 } },
      { s1: { situation: "B", task: "B", action: "B", result: "B", reflection: "B", updatedAt: 200 } },
    ],
    [
      { s1: { situation: "A", task: "A", action: "A", result: "A", reflection: "A", updatedAt: 300 } },
      { s1: { situation: "B", task: "B", action: "B", result: "B", reflection: "B", updatedAt: 100 } },
    ],
    [{}, {}],
  ],
  examDate: [
    [{ value: "2026-08-01", setAt: 100 }, { value: "2026-09-01", setAt: 200 }],
    [{ value: "2026-09-01", setAt: 500 }, { value: "2026-08-01", setAt: 100 }],
    [null, { value: "2026-08-01", setAt: 10 }],
    ["2026-07-01", null],
    [null, null],
  ],
  history: [
    [
      [{ id: "a", ts: 300, pct: 50 }, { id: "b", ts: 200, pct: 60 }],
      [{ id: "b", ts: 200, pct: 60 }, { id: "c", ts: 400, pct: 70 }],
    ],
    [[], [{ id: "x", ts: 1, pct: 0 }]],
    // запись без id, null и объект без id — всё это должно отсеиваться
    [[{ noId: 1 }, null, { ts: 5 }], [{ id: "ok", ts: 5 }]],
    [[], []],
  ],
  profile: [
    [
      {
        trackId: "redcore-junior-seo", onboarded: true,
        selfAssessment: { "sa-gsc": 3 },
        requirements: { r1: { status: "learning" } },
        roadmap: { s1: { done: true } },
        glossary: { g1: { favorite: true, checked: 2 } },
        mock: { m1: { rating: 2, count: 1, ts: 1 } },
        cases: { c1: { rating: 1, count: 1, ts: 1 } },
        library: { l1: { read: true, note: "" } },
        stories: { st1: { situation: "A", updatedAt: 5 } },
        lessons: { les1: { read: true, ts: 100 } },
        quizBest: { "on-page": 80 },
        weakTopicsSeen: { "on-page": true },
        english: {
          words: { "ev-queue": { favorite: true, checked: 2 } },
          drills: { "ed-self-001": { rating: 2, count: 1, ts: 10 } },
          phrases: { "ph-open-001": { learned: true } },
        },
      },
      {
        onboarded: false,
        selfAssessment: { "sa-gsc": 5, "sa-ga4": 2, "bad": 99 },
        requirements: { r1: { status: "partial", evidence: "есть" } },
        roadmap: { s1: { quizBest: 90 } },
        glossary: { g1: { favorite: false, checked: 5 } },
        mock: { m1: { rating: 4, count: 2, ts: 9 } },
        cases: { c1: { rating: 3, count: 2, ts: 9 } },
        library: { l1: { read: false, note: "заметка" } },
        stories: { st1: { situation: "B", updatedAt: 9 } },
        lessons: { les2: { read: true, ts: 50 } },
        quizBest: { "on-page": 45, "technical-seo": 70 },
        weakTopicsSeen: {},
        english: {
          words: { "ev-queue": { favorite: false, checked: 5 } },
          drills: { "ed-self-001": { rating: 4, count: 2, ts: 20 } },
          phrases: { "ph-open-001": { learned: false }, "ph-self-001": { learned: true } },
        },
      },
    ],
    [{}, {}],
  ],
};

function run() {
  const out = {};
  out.srs = FIXTURES.srs.map(([a, b]) => Sync.mergeSrs(a, b));
  out.progress = FIXTURES.progress.map(([a, b]) => Sync.mergeProgress(a, b));
  out.rated = FIXTURES.rated.map(([a, b]) => Sync.mergeRated(a, b));
  out.roadmap = FIXTURES.roadmap.map(([a, b]) => Sync.mergeRoadmap(a, b));
  out.requirements = FIXTURES.requirements.map(([a, b]) => Sync.mergeRequirements(a, b));
  out.library = FIXTURES.library.map(([a, b]) => Sync.mergeLibrary(a, b));
  out.stories = FIXTURES.stories.map(([a, b]) => Sync.mergeStories(a, b));
  out.examDate = FIXTURES.examDate.map(([a, b]) => Sync.mergeExamDate(a, b));
  out.history = FIXTURES.history.map(([a, b]) => Sync.mergeHistory(a, b));
  out.profile = FIXTURES.profile.map(([a, b]) => Sync.mergeProfile(a, b));
  return out;
}

if (process.argv.includes("--dump")) {
  process.stdout.write(JSON.stringify(run()));
} else {
  let failed = 0;
  const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
  const eq = (a, b, m) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      console.error(`FAIL: ${m}\n  получено ${JSON.stringify(a)}\n  ожидалось ${JSON.stringify(b)}`);
      failed++;
    }
  };

  const r = run();

  // ── SRS ──
  eq(r.srs[0], { "q:a": { box: 3, due: 50 } }, "SRS: побеждает более высокая коробка");
  eq(r.srs[1], { "q:a": { box: 2, due: 300 } }, "SRS: при равной коробке побеждает поздний срок");
  eq(r.srs[2], { "q:a": { box: 2, due: 100 }, "q:b": { box: 1, due: 10 } },
    "SRS: элементы объединяются, ничего не теряется");
  eq(r.srs[3], { "q:a": { box: 2, due: 5 } }, "SRS: коробка вне диапазона отбрасывается");
  eq(r.srs[4], { "q:b": { box: 0, due: 0 } }, "SRS: мусорная запись отбрасывается");

  // ── прогресс ──
  eq(r.progress[0].days, { "2026-07-01": 10, "2026-07-02": 8 },
    "прогресс: по дням берётся максимум");
  eq(r.progress[0].streak, 3, "прогресс: серия — максимум");
  eq(r.progress[0].best, 5, "прогресс: лучшая серия — максимум");
  eq(r.progress[0].goal, 25, "прогресс: цель берётся у клиента");
  eq(r.progress[0].lastDay, "2026-07-02", "прогресс: последний день — самый поздний");
  eq(r.progress[0].frozenUsed, true, "прогресс: страховка берётся у более свежего источника");
  eq(r.progress[1].frozenUsed, true, "прогресс: страховка берётся у сервера, если он новее");
  eq(r.progress[2].flags, { flawless: true, weakTopicRecovered: true },
    "прогресс: флаги объединяются по ИЛИ, достижения не теряются");
  eq(r.progress[3].days, { "2026-07-01": 3 }, "прогресс: мусор в днях игнорируется");

  // ── самооценки ──
  eq(r.rated[0].m1, { rating: 4, count: 3, ts: 20 }, "оценки: побеждает лучшая");
  eq(r.rated[1].m1, { rating: 4, count: 3, ts: 40 },
    "оценки: худшая оценка не понижает результат, но счётчик заходов растёт");
  eq(r.rated[3].m1, { rating: 4, count: 1, ts: 0 }, "оценки: мусор нормализуется в границы");

  // ── план ──
  eq(r.roadmap[0].s1, { lessonRead: true, quizBest: 85, casesDone: 1,
    mocksAnswered: 2, done: true }, "план: по каждому полю берётся лучшее");

  // ── требования ──
  eq(r.requirements[0].r1.status, "confirmed", "требования: побеждает более сильный статус");
  eq(r.requirements[1].r1.status, "confirmed",
    "требования: откат статуса назад не проходит");
  eq(r.requirements[1].r1.evidence, "было",
    "требования: пустое доказательство не затирает заполненное");

  // ── библиотека ──
  eq(r.library[0].l1, { read: true, note: "новая" },
    "библиотека: прочитано по ИЛИ, заметка от клиента");

  // ── истории ──
  eq(r.stories[0].s1.situation, "B", "истории: побеждает более свежая версия целиком");
  eq(r.stories[1].s1.situation, "A", "истории: старая версия не перезаписывает свежую");
  eq(r.stories[0].s1.updatedAt, 200, "истории: время правки — максимум");

  // ── дата собеседования ──
  eq(r.examDate[0], { value: "2026-09-01", setAt: 200 },
    "дата: побеждает установленная позже");
  eq(r.examDate[1], { value: "2026-09-01", setAt: 500 },
    "дата: более ранняя дата побеждает, если установлена позже");
  eq(r.examDate[2], { value: "2026-08-01", setAt: 10 }, "дата: заполненная побеждает пустую");
  eq(r.examDate[4], { value: null, setAt: 0 }, "дата: обе пустые дают пустой результат");

  // ── история ──
  eq(r.history[0].map((x) => x.id), ["c", "a", "b"],
    "история: объединяется без дублей и сортируется по времени");
  eq(r.history[2].map((x) => x.id), ["ok"],
    "история: записи без id и не-объекты отбрасываются");

  // ── профиль ──
  const p = r.profile[0];
  eq(p.trackId, "redcore-junior-seo", "профиль: трек не теряется, если клиент его не прислал");
  eq(p.onboarded, true, "профиль: пройденная настройка не отменяется");
  eq(p.selfAssessment, { "sa-ga4": 2, "sa-gsc": 5 },
    "профиль: самооценка берётся у клиента, значения вне 0..5 отбрасываются");
  eq(p.glossary.g1, { favorite: true, checked: 5 },
    "профиль: избранное по ИЛИ, число проверок — максимум");
  eq(p.mock.m1.rating, 4, "профиль: оценка mock — лучшая");
  eq(p.library.l1, { read: true, note: "заметка" }, "профиль: библиотека слита");
  eq(p.stories.st1.situation, "B", "профиль: история — более свежая версия");
  ok(!("trackId" in r.profile[1]), "профиль: пустой трек не появляется в результате");

  // ── прочитанные уроки и лучшие результаты тестов ──
  // Раньше эти разделы выпадали из слияния целиком, и вместе с ними
  // откатывались шаги плана. Проверяем, что они переживают обмен.
  eq(p.lessons, { les1: { read: true, ts: 100 }, les2: { read: true, ts: 50 } },
    "профиль: прочитанные уроки объединяются, ничего не теряется");
  eq(p.quizBest, { "on-page": 80, "technical-seo": 70 },
    "профиль: по каждой теме остаётся лучший результат теста");
  eq(p.weakTopicsSeen, { "on-page": true },
    "профиль: отметка «тема была слабой» не теряется");

  // ── английский ──
  eq(p.english.words["ev-queue"], { favorite: true, checked: 5 },
    "английский: избранное по ИЛИ, число проверок — максимум");
  eq(p.english.drills["ed-self-001"], { rating: 4, count: 2, ts: 20 },
    "английский: самооценка задания — лучшая, счётчик заходов — максимум");
  eq(p.english.phrases, { "ph-open-001": { learned: true }, "ph-self-001": { learned: true } },
    "английский: отметка «выучил» не снимается слиянием");

  // ── идемпотентность ──
  // Повторное слияние результата с самим собой ничего не меняет: иначе
  // состояние «дрейфовало» бы при каждой синхронизации.
  const once = Sync.mergeState(
    { srs: FIXTURES.srs[0][0], progress: FIXTURES.progress[0][0],
      profile: FIXTURES.profile[0][0], exam_date: FIXTURES.examDate[0][0] },
    { srs: FIXTURES.srs[0][1], progress: FIXTURES.progress[0][1],
      profile: FIXTURES.profile[0][1], exam_date: FIXTURES.examDate[0][1] });
  const twice = Sync.mergeState(once, once);
  eq(twice, once, "слияние идемпотентно: повторный обмен не меняет состояние");

  // ── лимиты совпадают с серверными ──
  eq(Sync.MAX_HISTORY_DAYS, 365, "лимит дней активности совпадает с api/merge.py");
  eq(Sync.MAX_ATTEMPTS, 100, "лимит истории совпадает с api/merge.py");

  if (failed) { console.error(`\n_sync_check: провалено проверок ${failed}`); process.exit(1); }
  console.log("_sync_check: OK");
}
