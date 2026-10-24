// ===========================================================================
// APP — общий слой между экранами Mini App.
//
// Зачем отдельный модуль: семнадцать HTML-страниц не должны каждая по-своему
// понимать, что такое «выполненный шаг плана» или «засчитанное действие».
// Вся логика состояния живёт здесь, страницы занимаются только отрисовкой.
//
// Подключать ПОСЛЕ: generated/content_core.js, content-loader.js, srs.js, progress.js,
// readiness.js, sync.js.
// ===========================================================================
(function (global) {
  "use strict";

  var C = global.CONTENT;
  var SRS = global.SRS;
  var Progress = global.Progress;
  var Readiness = global.Readiness;
  var Sync = global.Sync;

  // ── утилиты ──────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Текст вопроса. У вопросов «разбор вывода команды» в середине лежит вывод
  // терминала: его показываем моноширинным блоком, иначе колонки df или ss
  // разъезжаются. Первая строка — контекст, последняя — сам вопрос.
  function questionHtml(text) {
    var src = String(text == null ? "" : text);
    // Вывод, явно огороженный тройными кавычками, — моноширинным блоком,
    // остальное — текстом.
    if (src.indexOf("```") !== -1) {
      return src.split(/```[^\n]*\n?/).map(function (part, i) {
        part = part.replace(/^\n+|\n+$/g, "");
        if (!part) return "";
        return i % 2 ? '<pre class="out">' + esc(part) + "</pre>"
          : '<span class="q-lead">' + esc(part).replace(/\n/g, "<br>") + "</span>";
      }).join("");
    }
    var lines = src.split("\n");
    if (lines.length < 3) return esc(src).replace(/\n/g, "<br>");
    return '<span class="q-lead">' + esc(lines[0]) + "</span>" +
      '<pre class="out">' + esc(lines.slice(1, -1).join("\n")) + "</pre>" +
      '<span class="q-tail">' + esc(lines[lines.length - 1]) + "</span>";
  }

  function param(name) {
    try {
      return new URLSearchParams(global.location.search).get(name);
    } catch (e) { return null; }
  }

  function plural(n, one, few, many) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  }

  function shuffle(arr, seed) {
    // Детерминированное перемешивание: одинаковый seed даёт одинаковый порядок.
    // Это нужно, чтобы при возврате на вопрос варианты не прыгали.
    var a = arr.slice();
    var s = seed || 1;
    function rnd() {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function hashCode(str) {
    var h = 0;
    for (var i = 0; i < String(str).length; i++) {
      h = ((h << 5) - h + String(str).charCodeAt(i)) | 0;
    }
    return Math.abs(h) || 1;
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // ── трек и контент ───────────────────────────────────────────────────────

  function activeTracks() {
    return (C.tracks || []).filter(function (t) { return t.status === "active"; });
  }

  function trackId() {
    var id = Progress.getTrack();
    if (id && byId(C.tracks, id)) return id;
    var a = activeTracks();
    return a.length ? a[0].id : null;
  }

  function track() { return byId(C.tracks, trackId()); }

  function vacancy() {
    var t = track();
    if (!t || !t.vacancy_id) return null;
    return byId(C.vacancies || [], t.vacancy_id);
  }

  function topics() {
    var id = trackId();
    return (C.topics || []).filter(function (t) { return t.track_id === id; })
      .sort(function (a, b) { return a.order - b.order; });
  }
  function topicById(id) { return byId(C.topics || [], id); }
  function topicTitle(id) {
    var t = topicById(id);
    return t ? t.title : id;
  }

  function questions() {
    var id = trackId();
    return (C.questions || []).filter(function (q) { return q.track_id === id; });
  }
  function questionsOfTopic(topicId) {
    return questions().filter(function (q) { return q.topic === topicId; });
  }
  function lessons() {
    var id = trackId();
    return (C.lessons || []).filter(function (l) { return l.track_id === id; });
  }
  function mocks() {
    var id = trackId();
    return (C.mockQuestions || []).filter(function (m) { return m.track_id === id; });
  }
  function cases() {
    var id = trackId();
    return (C.cases || []).filter(function (x) { return x.track_id === id; });
  }
  function steps() {
    var id = trackId();
    return (C.roadmap || []).filter(function (s) { return s.track_id === id; })
      .sort(function (a, b) { return a.order - b.order; });
  }
  function terms() {
    var id = trackId();
    return (C.glossary || []).filter(function (t) {
      return !t.track_ids || t.track_ids.indexOf(id) !== -1;
    });
  }
  function sourceById(id) { return byId(C.sources || [], id); }

  // ── практика DevOps: лабораторные и DutyOps ──────────────────────────────
  function labs() {
    var id = trackId();
    return (C.labs || []).filter(function (l) { return l.track_id === id; });
  }
  function dutyDrills() {
    var id = trackId();
    return (C.dutyopsDrills || []).filter(function (d) { return d.track_id === id; });
  }
  function labDomains() {
    var t = track();
    return (t && t.lab_domains) || [];
  }
  function hasLabs() { return labs().length > 0; }

  // ── английский для IT ────────────────────────────────────────────────────
  //
  // Раздел сквозной: пустой track_ids означает «во всех треках», непустой —
  // лексика конкретной профессии. Правило отбора то же, что у глоссария, и
  // живёт в одном месте, чтобы четыре экрана не разошлись в трактовке.

  function englishOf(key) {
    var id = trackId();
    return (C[key] || []).filter(function (x) {
      var t = x.track_ids;
      return !t || !t.length || t.indexOf(id) !== -1;
    });
  }
  function phrases() { return englishOf("englishPhrases"); }
  function words() { return englishOf("englishVocab"); }
  function drills() { return englishOf("englishDrills"); }
  function writings() { return englishOf("englishWriting"); }
  function engResources() { return englishOf("englishResources"); }

  // ── идентификаторы SRS ───────────────────────────────────────────────────

  function qid(id) { return "q:" + id; }
  function tid(id) { return "t:" + id; }
  function ewid(id) { return "ew:" + id; }
  // Производство слова (знаю смысл — достаю английское) считается отдельно от
  // узнавания: это разные навыки, и вторым владеют заметно позже первого.
  function ewrid(id) { return "ewr:" + id; }
  function edid(id) { return "ed:" + id; }
  function ephid(id) { return "eph:" + id; }

  // ── запись действий ──────────────────────────────────────────────────────
  //
  // Действием считается ответ на тест, проверенный термин, отвеченный
  // mock-вопрос и завершённый кейс. Каждое действие обновляет SRS (там, где
  // это применимо), дневной счётчик и планирует отправку на сервер.

  function afterChange() {
    recomputeRoadmap();
    if (Sync) Sync.schedulePush();
  }

  function recordQuizAnswers(results) {
    // results: [{ id, correct }]
    if (!results.length) return;
    SRS.gradeMany(results.map(function (r) {
      return { id: qid(r.id), correct: !!r.correct };
    }));
    Progress.recordAction(results.length);
    afterChange();
  }

  function recordTermCheck(termId, correct) {
    SRS.grade(tid(termId), !!correct);
    Progress.patchProfile(function (p) {
      var e = p.glossary[termId] || {};
      e.checked = (e.checked || 0) + 1;
      p.glossary[termId] = e;
    });
    Progress.recordAction(1);
    afterChange();
  }

  function toggleTermFavorite(termId) {
    var on = false;
    Progress.patchProfile(function (p) {
      var e = p.glossary[termId] || {};
      e.favorite = !e.favorite;
      on = e.favorite;
      p.glossary[termId] = e;
    });
    if (Sync) Sync.schedulePush();
    return on;
  }

  // rating: 0..4 по рубрике самооценки
  function recordMock(mockId, rating) {
    var m = byId(C.mockQuestions || [], mockId);
    Progress.patchProfile(function (p) {
      var e = p.mock[mockId] || { count: 0 };
      e.rating = Math.max(0, Math.min(4, parseInt(rating, 10) || 0));
      e.count = (e.count || 0) + 1;
      e.ts = Date.now();
      p.mock[mockId] = e;
    });
    // Открытый вопрос тоже уходит в SRS: слабый ответ вернётся на повтор
    // скоро, уверенный — нескоро. Порог 3 из 4 соответствует рубрике
    // «системный ответ».
    if (m) SRS.grade("m:" + mockId, (parseInt(rating, 10) || 0) >= 3);
    Progress.recordAction(1);
    afterChange();
  }

  function recordCase(caseId, rating) {
    Progress.patchProfile(function (p) {
      var e = p.cases[caseId] || { count: 0 };
      e.rating = Math.max(0, Math.min(4, parseInt(rating, 10) || 0));
      e.count = (e.count || 0) + 1;
      e.ts = Date.now();
      p.cases[caseId] = e;
    });
    SRS.grade("c:" + caseId, (parseInt(rating, 10) || 0) >= 3);
    Progress.recordAction(1);
    afterChange();
  }

  // ── английский: запись прогресса ─────────────────────────────────────────
  //
  // Английский НЕ участвует в расчёте готовности к профессии: процент отражает
  // знание предметной области, и подмешивать в него язык значило бы выдавать
  // выученные слова за понимание работы. В дневную цель и серию он идёт: это
  // такая же учебная работа, как повторение терминов.

  // direction: "recall" — вижу слово, вспоминаю значение (по умолчанию);
  //            "produce" — знаю значение, достаю английское слово.
  // Направления идут в РАЗНЫЕ коробки повторения, но в один счётчик проверок:
  // счётчик отвечает на вопрос «сколько раз человек работал со словом», и
  // делить его по направлениям значило бы усложнять слияние без пользы.
  function recordWordCheck(wordId, correct, direction) {
    SRS.grade(direction === "produce" ? ewrid(wordId) : ewid(wordId), !!correct);
    Progress.patchProfile(function (p) {
      var e = p.english.words[wordId] || {};
      e.checked = (e.checked || 0) + 1;
      p.english.words[wordId] = e;
    });
    Progress.recordAction(1);
    if (Sync) Sync.schedulePush();
  }

  function toggleWordFavorite(wordId) {
    var on = false;
    Progress.patchProfile(function (p) {
      var e = p.english.words[wordId] || {};
      e.favorite = !e.favorite;
      on = e.favorite;
      p.english.words[wordId] = e;
    });
    if (Sync) Sync.schedulePush();
    return on;
  }

  // Ручная отметка «выучил(а)». Осталась как закладка самого человека и живёт
  // отдельно от коробки повторения: отметка отражает намерение, коробка —
  // проверенный результат.
  function togglePhraseLearned(phraseId) {
    var on = false;
    Progress.patchProfile(function (p) {
      var e = p.english.phrases[phraseId] || {};
      e.learned = !e.learned;
      on = e.learned;
      p.english.phrases[phraseId] = e;
    });
    if (Sync) Sync.schedulePush();
    return on;
  }

  // Практика фразы: человеку показывают ситуацию по-русски, он произносит
  // английскую фразу и сверяется с эталоном. Оценка своя — иначе пришлось бы
  // распознавать речь, — но она идёт в коробку повторения, поэтому забытая
  // фраза возвращается сама.
  function recordPhraseCheck(phraseId, correct) {
    SRS.grade(ephid(phraseId), !!correct);
    Progress.patchProfile(function (p) {
      var e = p.english.phrases[phraseId] || {};
      e.checked = (e.checked || 0) + 1;
      p.english.phrases[phraseId] = e;
    });
    Progress.recordAction(1);
    if (Sync) Sync.schedulePush();
  }

  // Письменное задание. В отличие от остального английского, здесь оценка
  // объективная: проверка ищет обязательные конструкции жанра в тексте, который
  // человек написал сам. Поэтому хранится не оценка, а факт — прошло или нет —
  // и число попыток. Текст письма НЕ сохраняется и не уходит на сервер: это
  // черновик человека, приложению он не нужен.
  function recordWritingAttempt(writingId, passed) {
    Progress.patchProfile(function (p) {
      var e = p.english.writing[writingId] || { attempts: 0 };
      e.attempts = (e.attempts || 0) + 1;
      e.passed = !!e.passed || !!passed;
      e.ts = Date.now();
      p.english.writing[writingId] = e;
    });
    Progress.recordAction(1);
    if (Sync) Sync.schedulePush();
  }

  // rating: 0..4 по рубрике самооценки, как в mock interview: последняя
  // оценка перезаписывает предыдущую — честное понижение не должно
  // блокироваться старым максимумом (то же правило в mergeRated).
  function recordDrill(drillId, rating) {
    var r = Math.max(0, Math.min(4, parseInt(rating, 10) || 0));
    Progress.patchProfile(function (p) {
      var e = p.english.drills[drillId] || { count: 0 };
      e.rating = r;
      e.count = (e.count || 0) + 1;
      e.ts = Date.now();
      p.english.drills[drillId] = e;
    });
    SRS.grade(edid(drillId), r >= 3);
    Progress.recordAction(1);
    if (Sync) Sync.schedulePush();
  }

  // Сводка для плашки на главной и заголовка экрана.
  function englishStats() {
    var p = Progress.profile();
    var map = SRS.stateMap();
    var w = words(), d = drills(), ph = phrases(), wr = writings();
    var started = 0, learned = 0, due = 0;
    // Производство считается отдельно: именно оно отражает готовность говорить,
    // и именно оно отстаёт. Складывать его с узнаванием — прятать разрыв.
    var prodStarted = 0, prodLearned = 0, prodDue = 0;
    var now = Date.now();
    w.forEach(function (x) {
      var s = map[ewid(x.id)];
      if (s) {
        started++;
        if (s.box >= SRS.LEARNED_BOX) learned++;
        if (s.due <= now) due++;
      }
      var r = map[ewrid(x.id)];
      if (r) {
        prodStarted++;
        if (r.box >= SRS.LEARNED_BOX) prodLearned++;
        if (r.due <= now) prodDue++;
      }
    });
    var drillsDone = d.filter(function (x) {
      var e = (p.english.drills || {})[x.id];
      return e && typeof e.rating === "number";
    }).length;
    var phrasesLearned = ph.filter(function (x) {
      var e = (p.english.phrases || {})[x.id];
      return e && e.learned;
    }).length;
    var phrasesPracticed = 0, phrasesDue = 0;
    ph.forEach(function (x) {
      var s = map[ephid(x.id)];
      if (!s) return;
      phrasesPracticed++;
      if (s.due <= now) phrasesDue++;
    });
    var withTask = wr.filter(function (x) { return !!x.task; });
    var writingPassed = withTask.filter(function (x) {
      var e = (p.english.writing || {})[x.id];
      return e && e.passed;
    }).length;
    return {
      words: w.length, wordsStarted: started, wordsLearned: learned, wordsDue: due,
      wordsProdStarted: prodStarted, wordsProdLearned: prodLearned, wordsProdDue: prodDue,
      drills: d.length, drillsDone: drillsDone,
      phrases: ph.length, phrasesLearned: phrasesLearned,
      phrasesPracticed: phrasesPracticed, phrasesDue: phrasesDue,
      writing: wr.length,
      writingTasks: withTask.length, writingPassed: writingPassed,
    };
  }

  // ── лабораторные ─────────────────────────────────────────────────────────
  //
  // Mini App не может проверить внешнюю Linux/Kubernetes/облачную среду. Поэтому
  // выполнение складывается из трёх честных частей: чек-лист критериев,
  // короткая заметка-доказательство и post-check вопросы. Никакой «AI-проверки»
  // текста заметки нет: она хранится как есть и в расчёт не входит.
  var LAB_NOTE_MAX = 1000;

  function labState(labId) {
    var e = (Progress.profile().labs || {})[labId];
    return e || { attempts: 0, completed: false, post_check_score: null,
      evidence_note: "", checklist: {}, ts: 0 };
  }

  function setLabChecklist(labId, index, on) {
    Progress.patchProfile(function (p) {
      p.labs = p.labs || {};
      var e = p.labs[labId] || {};
      e.checklist = e.checklist || {};
      if (on) e.checklist[String(index)] = true;
      else delete e.checklist[String(index)];
      e.ts = Date.now();
      p.labs[labId] = e;
    });
    if (Sync) Sync.schedulePush();
  }

  function saveLabNote(labId, note) {
    Progress.patchProfile(function (p) {
      p.labs = p.labs || {};
      var e = p.labs[labId] || {};
      e.evidence_note = String(note || "").slice(0, LAB_NOTE_MAX);
      e.ts = Date.now();
      p.labs[labId] = e;
    });
    if (Sync) Sync.schedulePush();
  }

  // Отметить прохождение. Засчитывается только при отмеченном чек-листе:
  // кнопка «готово» без проверки критериев была бы самооценкой.
  function completeLab(labId) {
    var lab = byId(C.labs || [], labId);
    if (!lab) return false;
    var st = labState(labId);
    var need = (lab.success_criteria || []).length;
    var have = Object.keys(st.checklist || {}).length;
    if (have < need) return false;
    var attempt = 0;
    Progress.patchProfile(function (p) {
      p.labs = p.labs || {};
      var e = p.labs[labId] || {};
      e.attempts = (e.attempts || 0) + 1;
      attempt = e.attempts;
      e.completed = true;
      e.ts = Date.now();
      p.labs[labId] = e;
    });
    Progress.recordAction(1);
    Progress.addAttempt({
      kind: "lab", mode: labId, total: 0, correct: 0, pct: 0,
      details: [{ attempt: attempt, completed: true }],
    });
    afterChange();
    return true;
  }

  // Post-check: ответы идут в SRS как обычный тест, лучший результат
  // сохраняется — он повышает уверенность в лабораторной.
  function recordLabPostCheck(labId, answers) {
    if (!answers.length) return null;
    var correct = answers.filter(function (a) { return a.correct; }).length;
    var score = correct / answers.length;
    SRS.gradeMany(answers.map(function (a) { return { id: qid(a.id), correct: !!a.correct }; }));
    var attempt = 0;
    Progress.patchProfile(function (p) {
      p.labs = p.labs || {};
      var e = p.labs[labId] || {};
      var prev = typeof e.post_check_score === "number" ? e.post_check_score : null;
      e.post_check_score = prev === null ? score : Math.max(prev, score);
      attempt = e.attempts || 0;
      e.ts = Date.now();
      p.labs[labId] = e;
    });
    Progress.recordAction(answers.length);
    Progress.addAttempt({
      kind: "lab", mode: labId, total: answers.length, correct: correct,
      pct: Math.round(score * 100),
      details: [{ attempt: attempt, completed: !!labState(labId).completed, postCheck: true }],
    });
    afterChange();
    return score;
  }

  function labsDoneCount() {
    var st = Progress.profile().labs || {};
    return labs().filter(function (l) { return st[l.id] && st[l.id].completed; }).length;
  }

  // ── DutyOps drills ───────────────────────────────────────────────────────
  // pct — доля набранных баллов за ход рассуждения (0..100).
  function recordDrill(drillId, pct, details) {
    var v = Math.max(0, Math.min(100, Math.round(pct)));
    Progress.patchProfile(function (p) {
      p.drills = p.drills || {};
      var e = p.drills[drillId] || {};
      e.best = typeof e.best === "number" ? Math.max(e.best, v) : v;
      e.last = v;
      e.attempts = (e.attempts || 0) + 1;
      e.ts = Date.now();
      p.drills[drillId] = e;
    });
    Progress.recordAction(1);
    Progress.addAttempt({ kind: "drill", mode: drillId, total: (details || []).length,
      correct: (details || []).filter(function (d) { return d.score === 2; }).length,
      pct: v, details: details || null });
    afterChange();
  }

  function drillState(drillId) {
    return (Progress.profile().drills || {})[drillId] || null;
  }

  // ── диагностика ──────────────────────────────────────────────────────────
  function diagnosticConfig() {
    var t = track();
    return (t && t.diagnostic) || null;
  }
  function diagnosticState() { return Progress.profile().diagnostic || null; }

  function saveDiagnostic(report, selfLabs) {
    Progress.patchProfile(function (p) {
      var prev = p.diagnostic || {};
      var domains = {};
      (report.domains || []).forEach(function (d) { if (d.pct != null) domains[d.id] = d.pct; });
      p.diagnostic = {
        ts: Date.now(),
        count: (prev.count || 0) + 1,
        total: report.total, correct: report.correct, pct: report.pct,
        domains: domains,
        selfLabs: selfLabs || prev.selfLabs || {},
      };
    });
    afterChange();
  }

  // Отметки «делал руками» из диагностики — только подсказка для быстрого
  // пути. В готовность и покрытие требований они НЕ входят.
  function saveDiagnosticSelfLabs(selfLabs) {
    Progress.patchProfile(function (p) {
      if (!p.diagnostic) return;
      p.diagnostic.selfLabs = selfLabs || {};
    });
    if (Sync) Sync.schedulePush();
  }

  // ── доказательства из портфолио ──────────────────────────────────────────
  var PORTFOLIO_FIELDS = ["project", "owned", "changed", "verified", "result", "link"];
  function savePortfolio(promptId, fields) {
    Progress.patchProfile(function (p) {
      p.portfolio = p.portfolio || {};
      var e = p.portfolio[promptId] || {};
      PORTFOLIO_FIELDS.forEach(function (k) {
        if (fields[k] !== undefined) e[k] = String(fields[k] || "").slice(0, 2000);
      });
      e.updatedAt = Date.now();
      p.portfolio[promptId] = e;
    });
    if (Sync) Sync.schedulePush();
  }
  function portfolioState(promptId) {
    return (Progress.profile().portfolio || {})[promptId] || {};
  }

  function markLessonRead(lessonId) {
    Progress.patchProfile(function (p) {
      p.lessons = p.lessons || {};
      p.lessons[lessonId] = { read: true, ts: Date.now() };
    });
    afterChange();
  }

  function isLessonRead(lessonId) {
    var p = Progress.profile();
    return !!(p.lessons && p.lessons[lessonId] && p.lessons[lessonId].read);
  }

  function toggleLibraryRead(resId) {
    var on = false;
    Progress.patchProfile(function (p) {
      var e = p.library[resId] || {};
      e.read = !e.read;
      on = e.read;
      p.library[resId] = e;
    });
    if (Sync) Sync.schedulePush();
    return on;
  }

  function saveLibraryNote(resId, note) {
    Progress.patchProfile(function (p) {
      var e = p.library[resId] || {};
      e.note = String(note || "").slice(0, 2000);
      p.library[resId] = e;
    });
    if (Sync) Sync.schedulePush();
  }

  function saveStory(storyId, fields) {
    Progress.patchProfile(function (p) {
      var e = p.stories[storyId] || {};
      ["situation", "task", "action", "result", "reflection"].forEach(function (k) {
        if (fields[k] !== undefined) e[k] = String(fields[k] || "").slice(0, 4000);
      });
      e.updatedAt = Date.now();
      p.stories[storyId] = e;
    });
    if (Sync) Sync.schedulePush();
  }

  function storyFilledCount() {
    var p = Progress.profile();
    var n = 0;
    Object.keys(p.stories || {}).forEach(function (k) {
      var s = p.stories[k] || {};
      // История считается заполненной, когда есть ситуация, действия и результат:
      // без результата это ещё не история для собеседования.
      if ((s.situation || "").trim() && (s.action || "").trim() && (s.result || "").trim()) n++;
    });
    return n;
  }

  function saveRequirement(reqId, patch) {
    Progress.patchProfile(function (p) {
      var e = p.requirements[reqId] || {};
      if (patch.status !== undefined) e.status = patch.status;
      if (patch.evidence !== undefined) e.evidence = String(patch.evidence || "").slice(0, 2000);
      if (patch.gap !== undefined) e.gap = String(patch.gap || "").slice(0, 2000);
      p.requirements[reqId] = e;
    });
    if (Sync) Sync.schedulePush();
  }

  // ── практические проекты ─────────────────────────────────────────────────
  //
  // У проекта намеренно НЕТ собственного состояния. Сделанным он считается
  // тогда, когда человек описал доказательство у связанного требования
  // вакансии: заводить рядом вторую отметку «выполнено» значило бы держать два
  // источника правды об одном факте, а они неизбежно разъедутся при слиянии.
  function projects() {
    var id = trackId();
    return (C.projects || []).filter(function (p) { return p.track_id === id; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }

  function requirementById(reqId) {
    var v = vacancy();
    return v ? byId(v.requirements || [], reqId) : null;
  }

  function projectDone(p) {
    var req = requirementById(p.requirement_id);
    if (!req) return false;
    var st = requirementState(req);
    return !!String(st.evidence || "").trim() &&
      (st.status === "confirmed" || st.status === "partial");
  }

  // Сколько требований вакансии человек подкрепил доказательством из своего
  // опыта. Знание и доказательство — разные вещи: процент по тестам не отвечает
  // на вопрос «что вы можете показать», а на собеседовании спрашивают именно это.
  function requirementsEvidencedCount() {
    var v = vacancy();
    if (!v) return 0;
    return (v.requirements || []).filter(function (r) {
      return (requirementState(r).evidence || "").trim();
    }).length;
  }

  // Требование с учётом пользовательских правок поверх данных вакансии.
  function requirementState(req) {
    var p = Progress.profile();
    var e = (p.requirements || {})[req.id] || {};
    return {
      status: e.status || req.status || "not_started",
      evidence: e.evidence !== undefined ? e.evidence : (req.evidence || ""),
      gap: e.gap !== undefined ? e.gap : (req.gap || ""),
    };
  }

  // ── план подготовки ──────────────────────────────────────────────────────

  // Состояние шага выводим из фактических данных, а не из счётчиков: счётчик
  // легко разъезжается после слияния с другого устройства, а данные — нет.
  function stepProgress(step) {
    var p = Progress.profile();
    var studyTotal = (step.study_items || []).length;
    var studyDone = (step.study_items || []).filter(isLessonRead).length;

    var quizTopics = [], caseIds = [], mockIds = [], labIds = [], drillIds = [];
    (step.practice_items || []).forEach(function (item) {
      var parts = String(item).split(":");
      if (parts[0] === "quiz") quizTopics.push(parts[1]);
      else if (parts[0] === "case") caseIds.push(parts[1]);
      else if (parts[0] === "mock") mockIds.push(parts[1]);
      else if (parts[0] === "lab") labIds.push(parts[1]);
      else if (parts[0] === "drill") drillIds.push(parts[1]);
    });
    var labsDone = labIds.filter(function (id) {
      var e = (p.labs || {})[id];
      return e && e.completed;
    }).length;
    var drillsDone = drillIds.filter(function (id) {
      var e = (p.drills || {})[id];
      return e && typeof e.best === "number";
    }).length;

    var quizBest = 0;
    quizTopics.forEach(function (t) {
      var best = (p.quizBest && p.quizBest[t]) || 0;
      quizBest = Math.max(quizBest, best);
    });

    var casesDone = caseIds.filter(function (id) {
      var e = (p.cases || {})[id];
      return e && typeof e.rating === "number";
    }).length;

    var mocksAnswered = mockIds.filter(function (id) {
      var e = (p.mock || {})[id];
      return e && typeof e.rating === "number";
    }).length;

    return {
      lessonRead: studyTotal === 0 ? true : studyDone === studyTotal,
      studyDone: studyDone,
      studyTotal: studyTotal,
      quizBest: quizBest,
      quizTopics: quizTopics,
      casesDone: casesDone,
      caseIds: caseIds,
      mocksAnswered: mocksAnswered,
      mockIds: mockIds,
      labsDone: labsDone,
      labIds: labIds,
      drillsDone: drillsDone,
      drillIds: drillIds,
    };
  }

  function fullMockSessions() {
    return Progress.historyOf("mock").filter(function (a) {
      return a.mode === "full";
    }).length;
  }

  function stepDone(step) {
    var pr = stepProgress(step);
    var rule = step.completion_rule || {};
    if (rule.lesson_read && !pr.lessonRead) return false;
    if (rule.quiz_score_min && pr.quizBest < rule.quiz_score_min) return false;
    if (rule.case_completed_min && pr.casesDone < rule.case_completed_min) return false;
    if (rule.mock_answered_min && pr.mocksAnswered < rule.mock_answered_min) return false;
    if (rule.stories_filled_min && storyFilledCount() < rule.stories_filled_min) return false;
    if (rule.full_mock_sessions_min && fullMockSessions() < rule.full_mock_sessions_min) return false;
    if (rule.requirements_evidenced_min &&
        requirementsEvidencedCount() < rule.requirements_evidenced_min) return false;
    if (rule.lab_completed_min && pr.labsDone < rule.lab_completed_min) return false;
    if (rule.drill_completed_min && pr.drillsDone < rule.drill_completed_min) return false;
    if (rule.diagnostic_done && !(diagnosticState() && diagnosticState().ts)) return false;
    return true;
  }

  function stepUnlocked(step) {
    var all = steps();
    return (step.prerequisites || []).every(function (pid) {
      var pre = byId(all, pid);
      return !pre || stepDone(pre);
    });
  }

  function recomputeRoadmap() {
    var list = steps();
    Progress.patchProfile(function (p) {
      list.forEach(function (s) {
        var pr = stepProgress(s);
        p.roadmap[s.id] = {
          lessonRead: pr.lessonRead,
          quizBest: pr.quizBest,
          casesDone: pr.casesDone,
          mocksAnswered: pr.mocksAnswered,
          done: stepDone(s),
        };
      });
    });
  }

  function recordQuizResult(topicId, pct) {
    if (!topicId) return;
    Progress.patchProfile(function (p) {
      p.quizBest = p.quizBest || {};
      p.quizBest[topicId] = Math.max(p.quizBest[topicId] || 0, Math.round(pct));
    });
    recomputeRoadmap();
  }

  // Текущий шаг: первый обязательный незакрытый и разблокированный.
  function currentStep() {
    var list = steps();
    for (var i = 0; i < list.length; i++) {
      if (!stepDone(list[i]) && stepUnlocked(list[i])) return list[i];
    }
    for (var j = 0; j < list.length; j++) {
      if (!stepDone(list[j])) return list[j];
    }
    return null;
  }

  // ── готовность ───────────────────────────────────────────────────────────

  function readiness(now) {
    return Readiness.compute({
      content: C,
      trackId: trackId(),
      srs: SRS.stateMap(),
      profile: Progress.profile(),
      days: Progress.days(),
      today: Progress.dayKey(now),
      nowMs: (now || new Date()).getTime(),
      fullMockSessions: fullMockSessions(),
    });
  }

  // Готовность к ВАКАНСИИ — второй процент, отвечающий на другой вопрос:
  // не «знаю ли я предмет», а «готов ли я к этой вакансии». Состояние
  // требований сливается здесь: readiness.js хранилище не читает.
  function vacancyReadiness(now) {
    var v = vacancy();
    var reqs = ((v && v.requirements) || []).map(function (r) {
      var st = requirementState(r);
      return {
        id: r.id,
        importance: r.importance,
        competency: r.competency || null,
        status: st.status,
        evidence: st.evidence,
      };
    });
    return Readiness.computeVacancy({
      content: C,
      trackId: trackId(),
      srs: SRS.stateMap(),
      profile: Progress.profile(),
      days: Progress.days(),
      today: Progress.dayKey(now),
      nowMs: (now || new Date()).getTime(),
      fullMockSessions: fullMockSessions(),
      requirements: reqs,
      languageRequirements: (v && v.language_requirements) || [],
      storiesFilled: storyFilledCount(),
      english: englishStats(),
      projects: projects().map(function (p) {
        return { id: p.id, required: !!p.required, done: projectDone(p) };
      }),
    });
  }

  function examPlan(now) {
    return Readiness.examPlan({
      content: C,
      trackId: trackId(),
      srs: SRS.stateMap(),
      profile: Progress.profile(),
      examDate: Progress.getExamDate(),
      today: Progress.dayKey(now),
      goal: Progress.getGoal(),
    });
  }

  function readinessProfile() { return Readiness.profileFor(trackId()); }

  // Покрытие требований вакансии — отдельно от готовности.
  function requirementCoverage(r) {
    var v = vacancy();
    if (!v) return null;
    var rr = r || readiness();
    var p = Progress.profile();
    return Readiness.requirementCoverage({
      vacancy: v, requirements: p.requirements || {}, topics: rr.topics || [],
      labs: labs(), labState: p.labs || {},
    });
  }

  function skillMatrix(r, cov) {
    var v = vacancy();
    if (!v || !(v.skill_matrix || []).length) return [];
    var rr = r || readiness();
    var p = Progress.profile();
    return Readiness.skillMatrix({
      vacancy: v, coverage: cov || requirementCoverage(rr), topics: rr.topics || [],
      labs: C.labs || [], labState: p.labs || {}, trackId: trackId(),
      mocks: C.mockQuestions || [], mockState: p.mock || {},
    });
  }

  // План на сегодня для треков с практикой: не больше четырёх конкретных
  // действий — повтор, лабораторная, чтение, mock. Двенадцать кнопок разом
  // не помогают выбрать, что делать.
  function todayPlan(r) {
    var rr = r || readiness();
    var out = [];
    var due = reviewDue();
    if (due > 0) {
      var n = Math.min(due, 15);
      out.push({ kind: "review", title: "Повторить " + n + " " + plural(n, "карточку", "карточки", "карточек"),
        href: "quiz.html?mode=review" });
    }
    var st = Progress.profile().labs || {};
    var cap = rr.appliedCap;
    var lab = null;
    if (cap && cap.labId) lab = byId(C.labs || [], cap.labId);
    if (!lab) {
      var step = currentStep();
      var pr = step ? stepProgress(step) : null;
      var fromStep = pr ? pr.labIds.filter(function (id) { return !(st[id] && st[id].completed); }) : [];
      lab = fromStep.length ? byId(C.labs || [], fromStep[0]) : null;
    }
    if (!lab) {
      lab = labs().filter(function (l) {
        return l.priority === "core" && !(st[l.id] && st[l.id].completed);
      })[0] || null;
    }
    if (lab) out.push({ kind: "lab", title: "Лабораторная: " + lab.title,
      href: "labs.html?id=" + encodeURIComponent(lab.id) });
    var cs = currentStep();
    var unread = cs ? (cs.study_items || []).filter(function (lid) { return !isLessonRead(lid); }) : [];
    var lesson = unread.length ? byId(C.lessons || [], unread[0]) : null;
    if (lesson) out.push({ kind: "read", title: "Прочитать: " + lesson.title,
      href: "lesson.html?id=" + encodeURIComponent(lesson.id) });
    var mockState = Progress.profile().mock || {};
    var weakTopic = (rr.topics || []).filter(function (t) { return t.critical; })[0];
    var mq = null;
    if (cs) {
      var ids = stepProgress(cs).mockIds.filter(function (id) { return !mockState[id]; });
      if (ids.length) mq = byId(C.mockQuestions || [], ids[0]);
    }
    if (!mq && weakTopic) {
      mq = mocks().filter(function (m) {
        return (m.topic_ids || []).indexOf(weakTopic.id) !== -1 && !mockState[m.id];
      })[0] || null;
    }
    if (!mq) mq = mocks().filter(function (m) { return !mockState[m.id]; })[0] || null;
    if (mq) out.push({ kind: "mock", title: "Mock: " + mq.question,
      href: "mock.html?id=" + encodeURIComponent(mq.id) });
    return out.slice(0, 4);
  }

  function setExamDate(iso) {
    Progress.setExamDate(iso);
    // Метка времени нужна слиянию: без неё нельзя понять, какая из двух дат
    // на разных устройствах новее.
    Progress.patchProfile(function (p) { p.examDateSetAt = Date.now(); });
    if (Sync) Sync.schedulePush();
  }

  // ── что делать сегодня ───────────────────────────────────────────────────

  function dueIds() {
    var ids = questions().map(function (q) { return qid(q.id); })
      .concat(terms().map(function (t) { return tid(t.id); }));
    return ids;
  }

  function reviewDue() {
    return SRS.reviewDueCount(dueIds());
  }

  function mistakeIds() {
    // Ошибка — вопрос, сброшенный в коробку 0 после неверного ответа.
    var map = SRS.stateMap();
    return questions().filter(function (q) {
      var s = map[qid(q.id)];
      return s && s.box === 0;
    }).map(function (q) { return q.id; });
  }

  // Единственное «следующее лучшее действие» для дашборда.
  function nextAction() {
    var r = readiness();
    var due = reviewDue();

    if (!Progress.isOnboarded()) {
      return { label: "С чего начать", title: "Пройти короткую настройку",
        hint: "Трек, самооценка, дата собеседования и дневная цель",
        href: "onboarding.html", cta: "Начать" };
    }

    if (due >= 5) {
      return { label: "На сегодня", title: "Повторить " + due + " " +
          plural(due, "вопрос", "вопроса", "вопросов"),
        hint: "Интервальное повторение возвращает то, что вот-вот забудется",
        href: "quiz.html?mode=review", cta: "Повторить" };
    }

    var mistakes = mistakeIds();
    if (mistakes.length >= 5) {
      return { label: "На сегодня", title: "Работа над ошибками",
        hint: mistakes.length + " " + plural(mistakes.length, "вопрос", "вопроса", "вопросов") +
          " ждут повторного верного ответа",
        href: "quiz.html?mode=mistakes", cta: "Разобрать" };
    }

    // Сработавший ограничитель — самое ценное действие: он держит процент.
    if (r.available && r.appliedCap) {
      var cap = r.appliedCap;
      var href = cap.href || "roadmap.html";
      if (cap.key === "noFullMock") href = "mock.html?mode=full";
      else if (cap.key === "fewCases") href = "cases.html";
      else if (cap.key === "weakCriticalTopic" && cap.topicId) href = "quiz.html?topic=" + encodeURIComponent(cap.topicId);
      return { label: "Что держит готовность", title: cap.action,
        hint: cap.reason, href: href, cta: "Перейти" };
    }

    var step = currentStep();
    if (step) {
      return { label: "Шаг " + step.order + " из " + steps().length, title: step.title,
        hint: step.goal, href: "roadmap.html?id=" + encodeURIComponent(step.id),
        cta: "Открыть" };
    }

    return { label: "План закрыт", title: "Пройти полное mock interview",
      hint: "Обязательные шаги выполнены — держите форму практикой",
      href: "mock.html?mode=full", cta: "Начать" };
  }

  // ── достижения ───────────────────────────────────────────────────────────

  function achievementProgress(rule, r) {
    var p = Progress.profile();
    var days = Progress.days();
    var streak = Progress.streakInfo();

    switch (rule.type) {
      case "actions_total":
        return Object.keys(days).reduce(function (a, k) { return a + days[k]; }, 0);
      case "quiz_sessions":
        return Progress.historyOf("quiz").length;
      case "streak":
        return Math.max(streak.streak, streak.best);
      case "glossary_mastered": {
        var map = SRS.stateMap();
        return terms().filter(function (t) {
          var s = map[tid(t.id)];
          return s && s.box >= SRS.LEARNED_BOX;
        }).length;
      }
      case "mock_answered":
        return Object.keys(p.mock || {}).length;
      case "full_mock_sessions":
        return fullMockSessions();
      case "cases_completed":
        return Object.keys(p.cases || {}).length;
      case "critical_cases_completed_all": {
        var crit = cases().filter(function (x) { return x.critical; });
        var done = crit.filter(function (x) { return (p.cases || {})[x.id]; }).length;
        return crit.length && done === crit.length ? 1 : 0;
      }
      case "topic_mastery": {
        var row = (r.topics || []).filter(function (t) { return t.id === rule.topic_id; })[0];
        return row && row.pct != null ? row.pct : 0;
      }
      case "flawless_quiz_min_size":
        return Progress.historyOf("quiz").some(function (a) {
          return a.total >= rule.value && a.correct === a.total;
        }) ? rule.value : 0;
      case "weak_topic_recovered":
        return Progress.flags().weakTopicRecovered ? 1 : 0;
      case "mistakes_cleared":
        return (Progress.historyOf("quiz").length && mistakeIds().length === 0) ? 1 : 0;
      case "roadmap_required_percent": {
        var req = steps().filter(function (s) { return s.required; });
        if (!req.length) return 0;
        var d = req.filter(stepDone).length;
        return Math.round(d / req.length * 100);
      }
      case "library_must_read_all": {
        var must = (C.library || []).filter(function (x) { return x.read_before_interview; });
        var readN = must.filter(function (x) { return (p.library || {})[x.id] && p.library[x.id].read; }).length;
        return must.length && readN === must.length ? 1 : 0;
      }
      case "stories_filled":
        return storyFilledCount();
      case "required_requirements_addressed": {
        var v = vacancy();
        if (!v) return 0;
        var reqs = (v.requirements || []).filter(function (x) { return x.importance === "required"; });
        if (!reqs.length) return 0;
        var ok = reqs.filter(function (x) {
          var st = requirementState(x).status;
          return st === "confirmed" || st === "partial";
        }).length;
        return ok === reqs.length ? 1 : 0;
      }
      case "readiness":
        return r.available ? r.percent : 0;
      default:
        return 0;
    }
  }

  function achievements(r) {
    var rr = r || readiness();
    // Полученное достижение фиксируется флагом и не отзывается: часть правил
    // считается из истории, которая обрезана до MAX_ATTEMPTS записей, — без
    // флага «Без ошибок» гасло бы, когда идеальный тест вытесняется из
    // истории. Флаги сливаются по ИЛИ и переживают смену устройства.
    var flags = Progress.flags();
    var changed = false;
    var out = (C.achievements || []).map(function (a) {
      var got = achievementProgress(a.rule, rr);
      var target = a.rule.value || 1;
      var key = "ach:" + a.id;
      var unlocked = got >= target || !!flags[key];
      if (got >= target && !flags[key]) { changed = true; Progress.setFlag(key, true); }
      return {
        def: a,
        value: got,
        target: target,
        unlocked: unlocked,
        pct: unlocked ? 100
          : Math.max(0, Math.min(100, Math.round(got / target * 100))),
      };
    });
    if (changed && Sync) Sync.schedulePush();
    return out;
  }

  // Слабая тема, доведённая до 70%, помечается флагом один раз — иначе после
  // очередного повтора достижение выдавалось бы заново.
  function trackWeakTopicRecovery(r) {
    if (!r.available) return;
    var p = Progress.profile();
    var seen = p.weakTopicsSeen || {};
    var changed = false;
    (r.topics || []).forEach(function (t) {
      if (t.mastery == null) return;
      // Порог берётся из расчёта, а не дублируется числом: разъехавшись, они
      // дали бы достижение «слабая тема подтянута» для темы, которая по расчёту
      // слабой не считалась.
      if (t.mastery < Readiness.WEAK_CRITICAL && !seen[t.id]) {
        seen[t.id] = true; changed = true;
      }
      if (seen[t.id] && t.mastery >= 0.70 && !Progress.flags().weakTopicRecovered) {
        Progress.setFlag("weakTopicRecovered", true);
      }
    });
    if (changed) Progress.patchProfile(function (pp) { pp.weakTopicsSeen = seen; });
  }

  // ── экспорт данных пользователя ──────────────────────────────────────────
  // Не обязателен для MVP, но структура его позволяет — и это же используется
  // экраном «сбросить данные», чтобы человек мог сохранить копию перед сбросом.
  function exportData() {
    return {
      schema: 1,
      exportedAt: new Date().toISOString(),
      srs: SRS.stateMap(),
      progress: JSON.parse(global.localStorage.getItem(Progress.KEYS.progress) || "{}"),
      profile: Progress.profile(),
      history: Progress.history(),
      examDate: Progress.getExamDate(),
    };
  }

  var App = {
    C: C,
    esc: esc, questionHtml: questionHtml, param: param, plural: plural, shuffle: shuffle, hashCode: hashCode, byId: byId,
    activeTracks: activeTracks, trackId: trackId, track: track, vacancy: vacancy,
    topics: topics, topicById: topicById, topicTitle: topicTitle,
    questions: questions, questionsOfTopic: questionsOfTopic,
    lessons: lessons, mocks: mocks, cases: cases, steps: steps, terms: terms,
    sourceById: sourceById,
    labs: labs, dutyDrills: dutyDrills, labDomains: labDomains, hasLabs: hasLabs,
    labState: labState, setLabChecklist: setLabChecklist, saveLabNote: saveLabNote,
    completeLab: completeLab, recordLabPostCheck: recordLabPostCheck, labsDoneCount: labsDoneCount,
    recordDrill: recordDrill, drillState: drillState,
    diagnosticConfig: diagnosticConfig, diagnosticState: diagnosticState,
    saveDiagnostic: saveDiagnostic, saveDiagnosticSelfLabs: saveDiagnosticSelfLabs,
    savePortfolio: savePortfolio, portfolioState: portfolioState, PORTFOLIO_FIELDS: PORTFOLIO_FIELDS,
    readinessProfile: readinessProfile, requirementCoverage: requirementCoverage,
    skillMatrix: skillMatrix, todayPlan: todayPlan,
    phrases: phrases, words: words, drills: drills, writings: writings,
    engResources: engResources,
    qid: qid, tid: tid, ewid: ewid, ewrid: ewrid, edid: edid, ephid: ephid,
    recordWordCheck: recordWordCheck, toggleWordFavorite: toggleWordFavorite,
    togglePhraseLearned: togglePhraseLearned, recordPhraseCheck: recordPhraseCheck,
    recordDrill: recordDrill, recordWritingAttempt: recordWritingAttempt,
    englishStats: englishStats,
    recordQuizAnswers: recordQuizAnswers, recordQuizResult: recordQuizResult,
    recordTermCheck: recordTermCheck, toggleTermFavorite: toggleTermFavorite,
    recordMock: recordMock, recordCase: recordCase,
    markLessonRead: markLessonRead, isLessonRead: isLessonRead,
    toggleLibraryRead: toggleLibraryRead, saveLibraryNote: saveLibraryNote,
    saveStory: saveStory, storyFilledCount: storyFilledCount,
    saveRequirement: saveRequirement, requirementState: requirementState,
    requirementsEvidencedCount: requirementsEvidencedCount,
    projects: projects, projectDone: projectDone, requirementById: requirementById,
    stepProgress: stepProgress, stepDone: stepDone, stepUnlocked: stepUnlocked,
    recomputeRoadmap: recomputeRoadmap, currentStep: currentStep,
    fullMockSessions: fullMockSessions,
    readiness: readiness, vacancyReadiness: vacancyReadiness,
    examPlan: examPlan, setExamDate: setExamDate,
    dueIds: dueIds, reviewDue: reviewDue, mistakeIds: mistakeIds,
    nextAction: nextAction,
    achievements: achievements, trackWeakTopicRecovery: trackWeakTopicRecovery,
    exportData: exportData,
  };

  global.App = App;
  if (typeof module !== "undefined" && module.exports) module.exports = App;
})(typeof window !== "undefined" ? window : globalThis);
