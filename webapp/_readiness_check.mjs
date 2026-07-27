// Проверка расчёта готовности: веса, ограничители, воспроизводимость и то,
// что самооценка не может поднять процент.
// Запуск: node webapp/_readiness_check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const R = require("./readiness.js");
const CONTENT = require("./generated/content_data.js");

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
const eq = (a, b, m) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    console.error(`FAIL: ${m}\n  получено ${JSON.stringify(a)}\n  ожидалось ${JSON.stringify(b)}`);
    failed++;
  }
};

const TRACK = "redcore-junior-seo";
const TODAY = "2026-07-27";
const NOW = Date.UTC(2026, 6, 27);

function base(extra) {
  return Object.assign({
    content: CONTENT,
    trackId: TRACK,
    srs: {},
    profile: {},
    days: {},
    today: TODAY,
    nowMs: NOW,
    fullMockSessions: 0,
  }, extra || {});
}

// ── веса ──
const sum = Object.keys(R.WEIGHTS).reduce((a, k) => a + R.WEIGHTS[k], 0);
eq(sum, 100, "сумма весов блоков равна 100");
eq(R.WEIGHTS.knowledge, 35, "вес знаний");
eq(R.WEIGHTS.mock, 25, "вес mock interview");
eq(R.WEIGHTS.cases, 20, "вес кейсов");
eq(R.WEIGHTS.glossary, 10, "вес словаря");
eq(R.WEIGHTS.plan, 10, "вес плана и регулярности");

// ── пустое состояние ──
const empty = R.compute(base());
ok(empty.available, "активный трек даёт расчёт готовности");
eq(empty.percent, 0, "на пустом прогрессе готовность равна нулю");
eq(empty.verdict, "Начало подготовки", "вердикт на нуле");
ok(empty.caps.length >= 3, "на пустом прогрессе срабатывает несколько ограничителей");

// ── незаполненный трек не получает процента ──
const draft = R.compute(base({ trackId: "qa-payments" }));
ok(!draft.available, "трек со статусом coming_soon не получает готовности");
ok(draft.percent === null, "у незаполненного трека процент равен null, а не нулю");
const noTrack = R.compute(base({ trackId: "нет-такого" }));
ok(!noTrack.available, "неизвестный трек не получает готовности");

// ── воспроизводимость ──
const srsSample = {};
CONTENT.questions.slice(0, 40).forEach((q, i) => {
  srsSample["q:" + q.id] = { box: (i % 6), due: NOW + 1000 };
});
const r1 = R.compute(base({ srs: srsSample }));
const r2 = R.compute(base({ srs: srsSample }));
eq(r1.percent, r2.percent, "одинаковый вход даёт одинаковый процент");
eq(r1.blocks.map((b) => b.score), r2.blocks.map((b) => b.score),
  "одинаковый вход даёт одинаковые баллы блоков");

// ── самооценка не влияет ──
const withSelf = R.compute(base({
  srs: srsSample,
  profile: {
    selfAssessment: {
      "sa-seo-experience": 5, "sa-html-css": 5, "sa-technical-seo": 5,
      "sa-gsc": 5, "sa-ga4": 5, "sa-keyword-research": 5,
      "sa-screaming-frog": 5, "sa-ahrefs-semrush": 5, "sa-sheets": 5,
      "sa-english": 5, "sa-storytelling": 5,
    },
  },
}));
eq(withSelf.percent, r1.percent,
  "максимальная самооценка не меняет процент готовности");

// ── ограничители ──
// Собираем «сильное» состояние: всё выучено, кейсы и mock пройдены.
function strongState(overrides) {
  const srs = {};
  CONTENT.questions.forEach((q) => { srs["q:" + q.id] = { box: 5, due: NOW + 1e9 }; });
  CONTENT.glossary.forEach((t) => { srs["t:" + t.id] = { box: 5, due: NOW + 1e9 }; });

  const mock = {}, cases = {}, roadmap = {};
  CONTENT.mockQuestions.forEach((m) => { mock[m.id] = { rating: 4, count: 3, ts: NOW }; });
  CONTENT.cases.forEach((c) => { cases[c.id] = { rating: 4, count: 2, ts: NOW }; });
  CONTENT.roadmap.forEach((s) => { roadmap[s.id] = { done: true }; });

  const days = {};
  for (let i = 0; i < 14; i++) days[R.shiftDay(TODAY, -i)] = 20;

  return Object.assign(base({
    srs, days, fullMockSessions: 2,
    profile: { mock, cases, roadmap },
  }), overrides || {});
}

const strong = R.compute(strongState());
ok(strong.percent >= 95, `полностью проработанное состояние даёт высокий процент (получено ${strong.percent})`);
eq(strong.caps.length, 0, "у полностью проработанного состояния нет ограничителей");
eq(strong.verdict, "Готов к собеседованию", "вердикт при высокой готовности");

// cap: нет полной сессии mock
const noMock = R.compute(strongState({ fullMockSessions: 0 }));
ok(noMock.percent <= R.CAPS.noFullMock,
  `без полной сессии mock процент не выше ${R.CAPS.noFullMock} (получено ${noMock.percent})`);
ok(noMock.appliedCap && noMock.appliedCap.key === "noFullMock",
  "сработавший ограничитель назван правильно");
ok(noMock.rawPercent > noMock.percent, "ограничитель реально срезал набранный балл");

// cap: мало кейсов
const s2 = strongState();
s2.profile = Object.assign({}, s2.profile, {
  cases: { [CONTENT.cases[0].id]: { rating: 4, count: 2, ts: NOW } },
});
const fewCases = R.compute(s2);
ok(fewCases.percent <= R.CAPS.fewCases,
  `меньше трёх кейсов ограничивает процент до ${R.CAPS.fewCases} (получено ${fewCases.percent})`);

// cap: слабая критическая тема
const s3 = strongState();
const track = CONTENT.tracks.filter((t) => t.id === TRACK)[0];
const critTopic = track.critical_topic_ids[0];
const srs3 = Object.assign({}, s3.srs);
CONTENT.questions.filter((q) => q.topic === critTopic).forEach((q) => {
  srs3["q:" + q.id] = { box: 1, due: NOW + 1e9 };     // 20% освоенности
});
s3.srs = srs3;
const weakCrit = R.compute(s3);
ok(weakCrit.percent <= R.CAPS.weakCriticalTopic,
  `слабая критическая тема ограничивает процент до ${R.CAPS.weakCriticalTopic} (получено ${weakCrit.percent})`);
ok(weakCrit.caps.some((c) => c.key === "weakCriticalTopic"),
  "ограничитель по критической теме присутствует в списке");

// cap: низкое покрытие обязательных тем
const s4 = strongState();
const srs4 = {};
CONTENT.glossary.forEach((t) => { srs4["t:" + t.id] = { box: 5, due: NOW + 1e9 }; });
// оставляем изученной только одну тему из многих
const oneTopic = CONTENT.topics.filter((t) => t.track_id === TRACK && t.required)[0].id;
CONTENT.questions.filter((q) => q.topic === oneTopic).forEach((q) => {
  srs4["q:" + q.id] = { box: 5, due: NOW + 1e9 };
});
s4.srs = srs4;
const lowCov = R.compute(s4);
ok(lowCov.percent <= R.CAPS.lowTopicCoverage,
  `низкое покрытие тем ограничивает процент до ${R.CAPS.lowTopicCoverage} (получено ${lowCov.percent})`);

// ── одна высокая самооценка mock без повтора не даёт полного балла ──
const once = strongState();
const mockOnce = {};
CONTENT.mockQuestions.forEach((m) => { mockOnce[m.id] = { rating: 4, count: 1, ts: NOW }; });
once.profile = Object.assign({}, once.profile, { mock: mockOnce });
const r_once = R.compute(once);
const mockBlockOnce = r_once.blocks.filter((b) => b.key === "mock")[0];
const mockBlockFull = strong.blocks.filter((b) => b.key === "mock")[0];
ok(mockBlockOnce.score < mockBlockFull.score,
  "ответ без повторного захода даёт меньший балл, чем подтверждённый");

// ── вердикты по границам ──
eq(R.verdictFor(0), "Начало подготовки", "граница 0");
eq(R.verdictFor(29), "Начало подготовки", "граница 29");
eq(R.verdictFor(30), "База формируется", "граница 30");
eq(R.verdictFor(49), "База формируется", "граница 49");
eq(R.verdictFor(50), "В процессе", "граница 50");
eq(R.verdictFor(69), "В процессе", "граница 69");
eq(R.verdictFor(70), "Почти готов", "граница 70");
eq(R.verdictFor(84), "Почти готов", "граница 84");
eq(R.verdictFor(85), "Готов к собеседованию", "граница 85");
eq(R.verdictFor(100), "Готов к собеседованию", "граница 100");

// ── план к дате собеседования ──
const plan = R.examPlan({
  content: CONTENT, trackId: TRACK, srs: {}, profile: {},
  examDate: "2026-08-26", today: TODAY, goal: 15,
});
ok(plan, "план рассчитывается при заданной дате");
eq(plan.daysLeft, 30, "дни до собеседования считаются верно");
ok(plan.needPerDay > 0, "дневная норма положительна на пустом прогрессе");
ok(!plan.onTrack, "на пустом прогрессе за 30 дней норма выше цели 15");
ok(plan.reviewsLeft > 0 && plan.casesLeft > 0 && plan.mocksLeft > 0 && plan.stepsLeft > 0,
  "план учитывает элементы всех типов, а не только тесты");

const past = R.examPlan({
  content: CONTENT, trackId: TRACK, srs: {}, profile: {},
  examDate: "2026-07-01", today: TODAY, goal: 15,
});
ok(past && past.past, "прошедшая дата не ломает расчёт, а помечается как прошедшая");
eq(past.needPerDay, 0, "для прошедшей даты норма не считается");

ok(R.examPlan({ content: CONTENT, trackId: TRACK, examDate: null, today: TODAY }) === null,
  "без даты плана нет");

// План на полностью проработанном состоянии не требует работы.
const planDone = R.examPlan({
  content: CONTENT, trackId: TRACK,
  srs: strongState().srs, profile: strongState().profile,
  examDate: "2026-08-26", today: TODAY, goal: 15,
});
eq(planDone.workUnits, 0, "на закрытом плане работы не остаётся");
ok(planDone.onTrack, "закрытый план всегда в графике");

// ── процент никогда не выходит за границы ──
[empty, r1, strong, noMock, fewCases, weakCrit, lowCov].forEach((r, i) => {
  ok(r.percent >= 0 && r.percent <= 100, `процент в границах 0..100 (случай ${i})`);
});

if (failed) { console.error(`\n_readiness_check: провалено проверок ${failed}`); process.exit(1); }
console.log("_readiness_check: OK");
