// Проверка расчёта готовности: веса, ограничители, воспроизводимость и то,
// что самооценка не может поднять процент.
// Запуск: node webapp/_readiness_check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const R = require("./readiness.js");
const CONTENT = require("./_content_all.js").forTrack("redcore-junior-seo");

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
// Трек берётся не по имени, а по статусу: наполненный трек рано или поздно
// становится активным, и проверка молча начинала бы сравнивать не то. А когда
// незаполненных треков не осталось вовсе — так и случилось, когда наполнили
// четвёртый, — правило всё равно нужно проверять, поэтому берём синтетический
// трек: проверяется поведение расчёта, а не наличие черновика в контенте.
const draftInContent = (CONTENT.tracks || []).find((t) => t.status !== "active");
const draftId = draftInContent ? draftInContent.id : "draft-track-for-check";
const draftContent = draftInContent ? CONTENT : Object.assign({}, CONTENT, {
  tracks: (CONTENT.tracks || []).concat([
    { id: draftId, title: "Черновик", status: "coming_soon", language: "ru" },
  ]),
});
const draft = R.compute(base({ content: draftContent, trackId: draftId }));
ok(!draft.available, "трек со статусом coming_soon не получает готовности");
ok(draft.percent === null, "у незаполненного трека процент равен null, а не нулю");
const noTrack = R.compute(base({ trackId: "нет-такого" }));
ok(!noTrack.available, "неизвестный трек не получает готовности");

// ── КАЖДЫЙ активный трек считается ──
// Проверки выше идут по контенту SEO-трека. Пробел в новом треке — например
// нехватка кейсов или mock — они не увидят, поэтому считаем готовность на
// пустом прогрессе для всех активных треков.
const ALL = require("./_content_all.js");
(CONTENT.tracks || []).filter((t) => t.status === "active").forEach((t) => {
  const r = R.compute(base({ content: ALL.forTrack(t.id), trackId: t.id }));
  ok(r.available, `трек ${t.id}: готовность не считается`);
  eq(r.percent, 0, `трек ${t.id}: на пустом прогрессе готовность равна нулю`);
  ok(r.caps.length >= 3, `трек ${t.id}: ограничители не срабатывают на пустом прогрессе`);
});

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

// ═══ ГОТОВНОСТЬ К ВАКАНСИИ ═══════════════════════════════════════════════
//
// Второй процент отвечает на другой вопрос, поэтому проверяется отдельно:
// веса, ограничители, и главное — что английский не может поднять готовность
// к профессии, но обязан быть виден в готовности к вакансии.

const vsum = Object.keys(R.VACANCY_WEIGHTS)
  .reduce((a, k) => a + R.VACANCY_WEIGHTS[k], 0);
eq(vsum, 100, "сумма весов блоков готовности к вакансии равна 100");

const VACANCY = (CONTENT.vacancies || []).filter((v) => v.track_id === TRACK)[0];
ok(!!VACANCY, "у трека есть описанная вакансия");
const REQS = VACANCY.requirements || [];
const REQUIRED = REQS.filter((r) => r.importance === "required");
ok(REQUIRED.length >= 10, `обязательных требований ${REQUIRED.length}`);

// Вакансия выровнена под объявление: удалённый формат и обязательный английский.
ok(/удал/i.test(VACANCY.work_format),
  `формат работы должен быть удалённым, получено «${VACANCY.work_format}»`);
ok(/польш/i.test(VACANCY.work_format),
  "формат работы должен упоминать право работы в Польше");
eq(VACANCY.external_ref, "TAG-2147", "вакансия ссылается на объявление");
const LANG = (VACANCY.language_requirements || []).filter((l) => l.importance === "required");
ok(LANG.length === 1, "у вакансии ровно одно обязательное языковое требование");
const enReq = REQS.filter((r) => r.id === LANG[0].requirement_id)[0];
ok(enReq && enReq.importance === "required",
  "требование по английскому обязано быть required, а не desirable");
// Core Web Vitals остаются в программе, но не отсекают.
const cwv = REQS.filter((r) => r.id === "req-cwv")[0];
ok(cwv && cwv.importance !== "required",
  "Core Web Vitals не должны быть обязательным требованием вакансии");
// Инструменты и off-page присутствуют как обязательная компетенция.
ok(REQS.some((r) => r.id === "req-seo-tools" && r.importance === "required"),
  "обязательная компетенция по инструментам отсутствует");
ok(REQS.some((r) => r.id === "req-off-page" && r.importance === "required"),
  "обязательное требование по off-page отсутствует");

function vacancyState(overrides) {
  return Object.assign(base({
    requirements: REQS.map((r) => ({
      id: r.id, importance: r.importance, competency: r.competency || null,
      status: "not_started", evidence: "",
    })),
    languageRequirements: VACANCY.language_requirements || [],
    storiesFilled: 0,
    english: { drills: 10, drillsDone: 0, writingTasks: 10, writingPassed: 0,
               words: 50, wordsProdLearned: 0 },
  }), overrides || {});
}

const vEmpty = R.computeVacancy(vacancyState());
ok(vEmpty.available, "готовность к вакансии считается на активном треке");
eq(vEmpty.percent, 0, "на пустом состоянии готовность к вакансии равна нулю");
ok(vEmpty.caps.some((c) => c.key === "requiredNotStarted"),
  "нетронутые обязательные требования ограничивают процент");
ok(vEmpty.caps.some((c) => c.key === "englishNotMet"),
  "незакрытое обязательное требование по английскому ограничивает процент");
ok(vEmpty.allGaps.some((g) => g.kind === "warning"),
  "отсутствие доказательств должно быть предупреждением, а не потолком");

// Незаполненный трек не получает и этого процента.
const vDraft = R.computeVacancy(vacancyState({
  content: draftContent, trackId: draftId,
}));
ok(!vDraft.available, "неактивный трек не получает готовности к вакансии");

// ── всё закрыто, кроме английского ──
function closedAll(evidence) {
  return REQS.map((r) => ({
    id: r.id, importance: r.importance, competency: r.competency || null,
    status: "confirmed", evidence: evidence ? "подтверждено пользователем" : "",
  }));
}

const strongVacancy = vacancyState(Object.assign({}, strongState(), {
  requirements: closedAll(true),
  languageRequirements: VACANCY.language_requirements || [],
  storiesFilled: 6,
  english: { drills: 10, drillsDone: 10, writingTasks: 10, writingPassed: 10,
             words: 50, wordsProdLearned: 50 },
}));
const vStrong = R.computeVacancy(strongVacancy);
ok(vStrong.percent >= 90,
  `полностью закрытая вакансия даёт высокий процент (получено ${vStrong.percent})`);
eq(vStrong.caps.length, 0, "у закрытой вакансии нет ограничителей");

// Английский не закрыт — процент обязан просесть и ограничитель сработать.
const noEnglish = Object.assign({}, strongVacancy, {
  requirements: closedAll(true).map((r) =>
    r.id === LANG[0].requirement_id ? Object.assign({}, r, { status: "learning" }) : r),
});
const vNoEn = R.computeVacancy(noEnglish);
ok(vNoEn.caps.some((c) => c.key === "englishNotMet"),
  "невыполненное требование по английскому обязано срабатывать ограничителем");
ok(vNoEn.percent <= R.VACANCY_CAPS.englishNotMet,
  `без английского готовность к вакансии не выше ${R.VACANCY_CAPS.englishNotMet} ` +
  `(получено ${vNoEn.percent})`);
ok(vNoEn.percent < vStrong.percent,
  "незакрытый язык обязан снижать готовность к вакансии");

// ── и при этом английский НЕ поднимает готовность к профессии ──
const skillNoEnglish = R.compute(strongState());
const skillWithEnglish = R.compute(Object.assign(strongState(), {
  english: { drills: 10, drillsDone: 10, writingTasks: 10, writingPassed: 10,
             words: 50, wordsProdLearned: 50 },
}));
eq(skillWithEnglish.percent, skillNoEnglish.percent,
  "английский не имеет права поднимать готовность к профессии");

// ── знание без доказательств: два процента обязаны разойтись ──
const knownButUnproven = R.computeVacancy(vacancyState(Object.assign({}, strongState(), {
  requirements: closedAll(false).map((r) => Object.assign({}, r, { status: "not_started" })),
  languageRequirements: VACANCY.language_requirements || [],
  storiesFilled: 0,
  english: { drills: 10, drillsDone: 0, writingTasks: 10, writingPassed: 0,
             words: 50, wordsProdLearned: 0 },
})));
const skillStrong = R.compute(strongState());
ok(knownButUnproven.percent < skillStrong.percent,
  "человек, знающий предмет без единого доказательства, не может быть готов " +
  "к вакансии так же, как к профессии");

// «Не применимо» не держит процент внизу: это осознанное решение человека.
const withNA = R.computeVacancy(vacancyState({
  requirements: REQS.map((r) => ({
    id: r.id, importance: r.importance, competency: r.competency || null,
    status: "not_applicable", evidence: "",
  })),
}));
ok(!withNA.caps.some((c) => c.key === "requiredNotStarted"),
  "требования «не применимо» не должны считаться незакрытыми");

// Воспроизводимость: чистая функция.
eq(R.computeVacancy(vacancyState()).percent, vEmpty.percent,
  "одинаковый вход даёт одинаковую готовность к вакансии");

[vEmpty, vStrong, vNoEn, knownButUnproven].forEach((r, i) => {
  ok(r.percent >= 0 && r.percent <= 100,
    `готовность к вакансии в границах 0..100 (случай ${i})`);
});

// ── процент никогда не выходит за границы ──
[empty, r1, strong, noMock, fewCases, weakCrit, lowCov].forEach((r, i) => {
  ok(r.percent >= 0 && r.percent <= 100, `процент в границах 0..100 (случай ${i})`);
});

if (failed) { console.error(`\n_readiness_check: провалено проверок ${failed}`); process.exit(1); }
console.log("_readiness_check: OK");
