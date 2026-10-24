// Проверка лабораторных и DutyOps на уровне app.js: как фиксируется
// выполнение, post-check, drills, диагностика, шаги плана и план на сегодня.
//
// Главные свойства:
//   • «готово» без отмеченного чек-листа не засчитывается — иначе это самооценка;
//   • повтор и post-check только добавляют уверенность, ничего не отнимают;
//   • история пишет новые виды lab и drill;
//   • текст вопроса с выводом команды экранируется до разметки.
//
// Запуск: node webapp/_labs_check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const T = "devops-platform";
const ALL = require("./_content_all.js");
globalThis.CONTENT = ALL.forTrack(T);
globalThis.SRS = require("./srs.js");
globalThis.Progress = require("./progress.js");
globalThis.Readiness = require("./readiness.js");
globalThis.Sync = require("./sync.js");
const App = require("./app.js");

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
const eq = (a, b, m) => {
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) { console.error(`FAIL: ${m}\n  получено ${sa}\n  ожидалось ${sb}`); failed++; }
};

Progress.setTrack(T);
Progress.setOnboarded(true);
eq(App.trackId(), T, "трек выбран");
ok(App.hasLabs(), "у DevOps-трека есть лабораторные");
ok(App.labs().length >= 32, "лабораторных не меньше 32");
ok(App.dutyDrills().length >= 13, "DutyOps-упражнений не меньше 13");

// ── выполнение лабораторной ──
const lab = App.labs().find((l) => l.id === "lab-linux-systemd-002");
ok(lab, "лабораторная по systemd есть");
eq(App.completeLab(lab.id), false, "без отмеченного чек-листа выполнение не засчитывается");
lab.success_criteria.slice(0, -1).forEach((_, i) => App.setLabChecklist(lab.id, i, true));
eq(App.completeLab(lab.id), false, "не все критерии отмечены — не засчитывается");
App.setLabChecklist(lab.id, lab.success_criteria.length - 1, true);
App.saveLabNote(lab.id, "Причина: неверный ExecStart. journalctl -u app. Исправил путь.");
eq(App.completeLab(lab.id), true, "все критерии отмечены — засчитано");
let st = App.labState(lab.id);
eq(st.attempts, 1, "первая попытка");
eq(st.completed, true, "выполнено");
eq(Readiness.labConfidence(st), 0.4, "одна отметка даёт только 40% уверенности");
ok(st.evidence_note.startsWith("Причина"), "заметка сохранена как есть");

App.saveLabNote(lab.id, "x".repeat(5000));
eq(App.labState(lab.id).evidence_note.length, 1000, "заметка ограничена 1000 символами");

// post-check: лучший результат сохраняется
const qs = lab.post_check_question_ids.map((id) => App.byId(App.questions(), id));
ok(qs.every(Boolean), "post-check вопросы найдены в треке");
const score1 = App.recordLabPostCheck(lab.id, qs.map((q, i) => ({ id: q.id, topic: q.topic, correct: i === 0 })));
eq(score1, 0.5, "post-check: доля верных");
App.recordLabPostCheck(lab.id, qs.map((q) => ({ id: q.id, topic: q.topic, correct: false })));
eq(App.labState(lab.id).post_check_score, 0.5, "хуже прошёл повторно — лучший результат не теряется");
App.recordLabPostCheck(lab.id, qs.map((q) => ({ id: q.id, topic: q.topic, correct: true })));
eq(App.labState(lab.id).post_check_score, 1, "лучший результат обновляется");
ok(SRS.stateMap()["q:" + qs[0].id], "ответы post-check попадают в SRS");
eq(App.completeLab(lab.id), true, "повторное прохождение засчитывается");
eq(App.labState(lab.id).attempts, 2, "повтор увеличивает число попыток");
eq(Readiness.labConfidence(App.labState(lab.id)), 1, "повтор и post-check дают полную уверенность");

const labHist = Progress.historyOf("lab");
ok(labHist.length >= 4, "история пишет вид lab (выполнение и post-check)");
ok(labHist.some((h) => h.total > 0 && h.details && h.details[0].postCheck), "post-check в истории с числом вопросов");
ok(labHist.some((h) => h.total === 0 && h.details && h.details[0].attempt === 2), "в истории номер попытки");
eq(App.labsDoneCount(), 1, "счётчик выполненных лабораторных");

// ── DutyOps drill ──
const drill = App.dutyDrills().find((d) => d.kind === "drill");
App.recordDrill(drill.id, 60, [{ id: "s1", phase: "first_check", score: 2 }]);
App.recordDrill(drill.id, 40, [{ id: "s1", phase: "first_check", score: 0 }]);
eq(App.drillState(drill.id).best, 60, "drill: лучший результат сохраняется");
eq(App.drillState(drill.id).last, 40, "drill: последний — последний");
eq(App.drillState(drill.id).attempts, 2, "drill: попытки считаются");
ok(Progress.historyOf("drill").length === 2, "история пишет вид drill");

// ── шаги плана с лабами и drills ──
const step = App.steps().find((s) => s.id === "step-dv-01-linux");
const pr = App.stepProgress(step);
ok(pr.labIds.includes("lab-linux-systemd-002"), "шаг видит свои лабораторные");
eq(pr.labsDone, 1, "шаг считает выполненные лабораторные");
const diagStep = App.steps().find((s) => s.id === "step-dv-00-diagnostic");
eq(App.stepDone(diagStep), false, "шаг диагностики не закрыт без диагностики");

// ── диагностика ──
const ids = Readiness.diagnosticSelect(CONTENT, T, 3);
const answers = ids.map((id) => {
  const q = App.byId(App.questions(), id);
  return { id, topic: q.topic, correct: q.topic === "linux-basics" };
});
const rep = Readiness.diagnosticReport({ content: CONTENT, trackId: T, answers });
App.saveDiagnostic(rep, null);
ok(App.diagnosticState().ts > 0, "диагностика сохранена");
eq(App.diagnosticState().count, 1, "число прохождений");
eq(App.stepDone(diagStep), true, "после диагностики шаг закрыт");
App.saveDiagnosticSelfLabs({ docker: true });
eq(App.diagnosticState().selfLabs, { docker: true }, "отметки «делал руками» сохранены");
const r1 = App.readiness();
App.saveDiagnosticSelfLabs({ docker: true, kubernetes: true, linux: true });
eq(App.readiness().percent, r1.percent, "отметки «делал руками» не влияют на готовность");

// ── план на сегодня ──
const plan = App.todayPlan(App.readiness());
ok(plan.length >= 1 && plan.length <= 4, "план на сегодня: от 1 до 4 действий, а не 12 кнопок");
ok(plan.every((x) => x.href && x.title), "у каждого действия есть ссылка и название");
ok(plan.some((x) => x.kind === "lab"), "в плане на сегодня есть лабораторная");

// ── покрытие требований через App ──
const cov = App.requirementCoverage();
ok(cov && cov.percent === 0, "покрытие без доказательств — 0%, сколько бы лаб ни было пройдено");
ok(cov.rows.find((r) => r.id === "rc-req-linux-cli").labsDone >= 1,
  "учебное покрытие видит выполненную лабораторную отдельной колонкой");

// ── портфолио ──
App.savePortfolio("ev-linux-host", { project: "VPS", owned: "всё", result: "работает", extra: "мусор" });
const pf = Progress.profile().portfolio["ev-linux-host"];
eq(pf.project, "VPS", "портфолио сохранено");
ok(!("extra" in pf), "лишние поля портфолио не сохраняются");

// ── разметка вопроса с выводом команды ──
const html = App.questionHtml("Вывод:\n$ df -i\n<script>x</script>\nЧто дальше?");
ok(html.includes("<pre class=\"out\">"), "вывод команды — моноширинным блоком");
ok(!html.includes("<script>") && html.includes("&lt;script&gt;"), "вывод экранирован");
eq(App.questionHtml("один"), "один", "однострочный вопрос — как есть");
const fenced = App.questionHtml("Видно:\n```\nstate | n\nidle | 7\n```\nЧто это значит?");
ok(fenced.includes('<pre class="out">state | n\nidle | 7</pre>'), "огороженный вывод — моноширинным блоком без кавычек");
ok(!fenced.includes("```"), "тройные кавычки не попадают в разметку");

// ── слияние профиля сохраняет лабы ──
const merged = Sync.mergeProfile(Progress.profile(), {});
ok(merged.labs[lab.id].completed && merged.drills[drill.id].best === 60 && merged.diagnostic.ts,
  "mergeProfile переносит labs, drills и diagnostic");

if (failed) { console.error(`\n_labs_check: провалено проверок ${failed}`); process.exit(1); }
console.log("_labs_check: OK");
