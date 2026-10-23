// Регрессия готовности для треков, у которых нет своего профиля расчёта.
//
// Зачем: у DevOps-трека появился собственный профиль весов и ограничителей
// (READINESS_PROFILES в readiness.js). Остальные треки обязаны считаться
// РОВНО как раньше. Эталон снят кодом readiness.js ДО введения профилей
// (коммит b5a6fd1) и лежит в _readiness_legacy_golden.json; здесь те же
// состояния прогоняются через текущий код и сравниваются побайтово.
//
// Запуск:
//   node webapp/_readiness_legacy.mjs           — сверить с эталоном
//   node webapp/_readiness_legacy.mjs --write   — переснять эталон (ТОЛЬКО если
//                                                 изменение legacy-расчёта
//                                                 сделано намеренно)
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const R = require("./readiness.js");
const ALL = require("./_content_all.js");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GOLDEN = path.join(HERE, "_readiness_legacy_golden.json");

const LEGACY = ["redcore-junior-seo", "qa-payments", "technical-engineer"];
const TODAY = "2026-07-27";
const NOW = Date.UTC(2026, 6, 27);

function shift(day, n) { return R.shiftDay(day, n); }

// Состояния строятся детерминированно из контента трека: никакого random.
function states(C, trackId) {
  const qs = C.questions.filter((q) => q.track_id === trackId);
  const terms = C.glossary.filter((t) => !t.track_ids || t.track_ids.indexOf(trackId) !== -1);
  const mocks = C.mockQuestions.filter((m) => m.track_id === trackId);
  const cases = C.cases.filter((x) => x.track_id === trackId);
  const steps = C.roadmap.filter((s) => s.track_id === trackId);

  const out = {};
  out.empty = { srs: {}, profile: {}, days: {}, fullMockSessions: 0 };

  // частичный прогресс: разные коробки, половина mock, два кейса
  const srsP = {};
  qs.forEach((q, i) => { if (i % 3 !== 0) srsP["q:" + q.id] = { box: i % 6, due: NOW + ((i % 2) ? 1e6 : -1e6) }; });
  terms.forEach((t, i) => { if (i % 2 === 0) srsP["t:" + t.id] = { box: (i % 5) + 1, due: NOW + 1e6 }; });
  const mockP = {};
  mocks.forEach((m, i) => { if (i % 2 === 0) mockP[m.id] = { rating: i % 5, count: 1 + (i % 3), ts: NOW }; });
  const casesP = {};
  cases.slice(0, 2).forEach((c, i) => { casesP[c.id] = { rating: 3 + i, count: 1 + i, ts: NOW }; });
  const roadP = {};
  steps.slice(0, 4).forEach((s) => { roadP[s.id] = { done: true }; });
  const daysP = {};
  for (let i = 0; i < 14; i += 2) daysP[shift(TODAY, -i)] = 7;
  out.partial = { srs: srsP, profile: { mock: mockP, cases: casesP, roadmap: roadP }, days: daysP, fullMockSessions: 0 };
  out.partialWithMock = Object.assign({}, out.partial, { fullMockSessions: 1 });

  // сильное состояние
  const srsS = {};
  qs.forEach((q) => { srsS["q:" + q.id] = { box: 5, due: NOW + 1e9 }; });
  terms.forEach((t) => { srsS["t:" + t.id] = { box: 5, due: NOW + 1e9 }; });
  const mockS = {}, casesS = {}, roadS = {};
  mocks.forEach((m) => { mockS[m.id] = { rating: 4, count: 3, ts: NOW }; });
  cases.forEach((c) => { casesS[c.id] = { rating: 4, count: 2, ts: NOW }; });
  steps.forEach((s) => { roadS[s.id] = { done: true }; });
  const daysS = {};
  for (let i = 0; i < 14; i++) daysS[shift(TODAY, -i)] = 20;
  out.strong = { srs: srsS, profile: { mock: mockS, cases: casesS, roadmap: roadS }, days: daysS, fullMockSessions: 2 };
  // Поле labs в профиле legacy-трека не должно ничего менять.
  out.strongWithForeignLabs = Object.assign({}, out.strong, {
    profile: Object.assign({}, out.strong.profile, {
      labs: { "lab-x": { attempts: 3, completed: true, post_check_score: 1, ts: NOW } },
      drills: { "drill-x": { best: 1, attempts: 2, ts: NOW } },
    }),
  });
  return out;
}

function snapshot() {
  const res = {};
  LEGACY.forEach((trackId) => {
    const C = ALL.forTrack(trackId);
    const st = states(C, trackId);
    res[trackId] = {};
    Object.keys(st).forEach((name) => {
      const s = st[name];
      const r = R.compute({
        content: C, trackId, srs: s.srs, profile: s.profile, days: s.days,
        today: TODAY, nowMs: NOW, fullMockSessions: s.fullMockSessions,
      });
      const plan = R.examPlan({
        content: C, trackId, srs: s.srs, profile: s.profile,
        examDate: "2026-08-26", today: TODAY, goal: 15,
      });
      // Поля, которых не было в эталоне, не входят в сравнение: новое
      // дополнение ответа — не изменение расчёта. Сравниваются только ключи
      // эталона (см. pick ниже).
      res[trackId][name] = { compute: r, plan };
    });
  });
  return JSON.parse(JSON.stringify(res));
}

// Оставить у b только ключи, которые есть у a (рекурсивно для объектов).
function pickLike(a, b) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return b;
    return b.map((x, i) => (i < a.length ? pickLike(a[i], x) : x));
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return b;
    const out = {};
    Object.keys(a).forEach((k) => { out[k] = pickLike(a[k], b[k]); });
    return out;
  }
  return b;
}

const now = snapshot();

if (process.argv.includes("--write")) {
  writeFileSync(GOLDEN, JSON.stringify(now, null, 1) + "\n");
  console.log("_readiness_legacy: эталон записан");
  process.exit(0);
}

const golden = JSON.parse(readFileSync(GOLDEN, "utf-8"));
let failed = 0;
LEGACY.forEach((t) => {
  Object.keys(golden[t]).forEach((name) => {
    const want = JSON.stringify(golden[t][name]);
    const got = JSON.stringify(pickLike(golden[t][name], now[t][name]));
    if (want !== got) {
      failed++;
      console.error(`FAIL: ${t} / ${name}: расчёт legacy-трека изменился`);
    }
  });
});
if (failed) { console.error(`\n_readiness_legacy: провалено ${failed}`); process.exit(1); }
console.log(`_readiness_legacy: OK (треков ${LEGACY.length}, состояний ${Object.keys(golden[LEGACY[0]]).length})`);
