// ===========================================================================
// PROGRESS — дневная цель, серия, история и профиль пользователя.
//
// Разделение хранилищ (важно для sync — см. sync.js и api/merge.py):
//   interview_progress_v1   { goal, days, streak, best, lastDay, frozenUsed, flags }
//   interview_profile_v1    { trackId, onboarded, selfAssessment, requirements,
//                             roadmap, glossary, mock, cases, library, stories,
//                             english }
//   interview_history_v1    { attempts: [...] }
//   interview_exam_date_v1  "YYYY-MM-DD"
//
// Дата собеседования вынесена в отдельный ключ, но, в отличие от референсного
// проекта, ВХОДИТ в контракт синхронизации: иначе merge молча стирал бы её при
// первом же обмене с сервером.
//
// Серия «бережная»: пропуск ровно одного дня не рвёт её (одна заморозка
// подряд). Два и более пропущенных дня — серия сбрасывается. Это поддерживает
// возвращаемость, а не наказывает за один пропуск.
// ===========================================================================
(function (global) {
  "use strict";

  var K_PROGRESS = "interview_progress_v1";
  var K_PROFILE = "interview_profile_v1";
  var K_HISTORY = "interview_history_v1";
  var K_EXAM = "interview_exam_date_v1";

  var DEFAULT_GOAL = 15;
  var GOAL_OPTIONS = [10, 15, 25, 40];
  var DAY_MS = 24 * 60 * 60 * 1000;
  var MAX_DAYS = 365;          // ОБЯЗАН совпадать с MAX_HISTORY_DAYS в api/merge.py
  var MAX_ATTEMPTS = 100;      // ОБЯЗАН совпадать с HISTORY_LIMIT в api/storage.py

  function read(key) {
    try { return JSON.parse(global.localStorage.getItem(key)) || {}; }
    catch (e) { return {}; }
  }
  function write(key, val) {
    try { global.localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function dayKey(date) {
    var d = date || new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  // Разница в днях между ключами YYYY-MM-DD (b - a). Считаем через UTC, чтобы
  // переход на летнее время не давал 23- и 25-часовые сутки.
  function dayDiff(a, b) {
    if (!a || !b) return Infinity;
    var pa = String(a).split("-").map(Number), pb = String(b).split("-").map(Number);
    if (pa.length !== 3 || pb.length !== 3) return Infinity;
    var da = Date.UTC(pa[0], pa[1] - 1, pa[2]);
    var db = Date.UTC(pb[0], pb[1] - 1, pb[2]);
    if (isNaN(da) || isNaN(db)) return Infinity;
    return Math.round((db - da) / DAY_MS);
  }

  // Чистое ядро: как меняется серия при активности в день `today`.
  function nextStreak(prev, today) {
    var streak = prev.streak || 0, best = prev.best || 0;
    var last = prev.lastDay, frozenUsed = prev.frozenUsed || false;

    if (last === today) {
      // уже активничал сегодня — серия не меняется
    } else {
      var gap = dayDiff(last, today);
      if (last == null || gap === 1) {
        streak = streak + 1; frozenUsed = false;               // подряд
      } else if (gap === 2 && !frozenUsed) {
        // Пропущен ровно один день и страховка цела. Проверка !frozenUsed
        // обязательна: без неё серия жила бы «через день» бесконечно.
        streak = streak + 1; frozenUsed = true;
      } else {
        streak = 1; frozenUsed = false;                        // разрыв
      }
    }
    best = Math.max(best, streak);
    return { streak: streak, best: best, lastDay: today, frozenUsed: frozenUsed };
  }

  var Progress = {
    dayKey: dayKey,
    dayDiff: dayDiff,
    nextStreak: nextStreak,
    GOAL_OPTIONS: GOAL_OPTIONS,
    MAX_DAYS: MAX_DAYS,
    MAX_ATTEMPTS: MAX_ATTEMPTS,

    // ── дневная цель ──
    getGoal: function () { return read(K_PROGRESS).goal || DEFAULT_GOAL; },
    setGoal: function (n) {
      var s = read(K_PROGRESS);
      s.goal = Math.max(5, Math.min(100, parseInt(n, 10) || DEFAULT_GOAL));
      write(K_PROGRESS, s);
      return s.goal;
    },

    todayCount: function (today) {
      var s = read(K_PROGRESS), k = today || dayKey();
      return (s.days && s.days[k]) || 0;
    },

    days: function () { return read(K_PROGRESS).days || {}; },

    flags: function () { return read(K_PROGRESS).flags || {}; },
    setFlag: function (name, val) {
      var s = read(K_PROGRESS);
      s.flags = s.flags || {};
      s.flags[name] = !!val;
      write(K_PROGRESS, s);
    },

    // Засчитать выполненное действие. Действием считается ответ на тест,
    // изученный с проверкой термин, отвеченный mock-вопрос и шаг кейса.
    recordAction: function (n, today) {
      var s = read(K_PROGRESS), k = today || dayKey();
      var add = Math.max(1, parseInt(n, 10) || 1);
      s.days = s.days || {};
      var firstToday = !s.days[k];
      s.days[k] = (s.days[k] || 0) + add;
      if (firstToday) {
        var ns = nextStreak(s, k);
        s.streak = ns.streak; s.best = ns.best;
        s.lastDay = ns.lastDay; s.frozenUsed = ns.frozenUsed;
      }
      var keys = Object.keys(s.days).sort();
      while (keys.length > MAX_DAYS) { delete s.days[keys.shift()]; }
      write(K_PROGRESS, s);
      return s.days[k];
    },

    // Состояние серии при заходе. Если последняя активность была больше двух
    // дней назад, серия фактически прервана — показываем 0, но best не теряем.
    streakInfo: function (today) {
      var s = read(K_PROGRESS), k = today || dayKey();
      var streak = s.streak || 0, best = s.best || 0;
      var gap = s.lastDay ? dayDiff(s.lastDay, k) : Infinity;
      if (s.lastDay && gap > 2) streak = 0;
      return {
        streak: streak,
        best: best,
        lastDay: s.lastDay || null,
        // страховка цела и серия жива
        frozenAvailable: streak > 0 && !s.frozenUsed && gap <= 1,
        // пропущен ровно один день, серия держится на страховке
        onIce: streak > 0 && !s.frozenUsed && gap === 2,
      };
    },

    // ── профиль ──
    profile: function () {
      var p = read(K_PROFILE);
      p.selfAssessment = p.selfAssessment || {};
      p.requirements = p.requirements || {};
      p.roadmap = p.roadmap || {};
      p.glossary = p.glossary || {};
      p.mock = p.mock || {};
      p.cases = p.cases || {};
      p.library = p.library || {};
      p.stories = p.stories || {};
      // Английский — сквозной раздел, поэтому его прогресс лежит отдельно от
      // трековых коллекций и не смешивается с готовностью к профессии.
      p.english = p.english || {};
      p.english.words = p.english.words || {};
      p.english.drills = p.english.drills || {};
      p.english.phrases = p.english.phrases || {};
      return p;
    },
    saveProfile: function (p) { write(K_PROFILE, p); return p; },
    patchProfile: function (fn) {
      var p = Progress.profile();
      fn(p);
      write(K_PROFILE, p);
      return p;
    },

    getTrack: function () { return Progress.profile().trackId || null; },
    setTrack: function (id) {
      return Progress.patchProfile(function (p) { p.trackId = id; });
    },
    isOnboarded: function () { return !!Progress.profile().onboarded; },
    setOnboarded: function (v) {
      return Progress.patchProfile(function (p) { p.onboarded = !!v; });
    },

    // ── дата собеседования ──
    getExamDate: function () {
      try { return global.localStorage.getItem(K_EXAM) || null; }
      catch (e) { return null; }
    },
    setExamDate: function (iso) {
      try {
        if (iso) global.localStorage.setItem(K_EXAM, iso);
        else global.localStorage.removeItem(K_EXAM);
      } catch (e) {}
      return iso || null;
    },
    daysToExam: function (today) {
      var d = Progress.getExamDate();
      if (!d) return null;
      return dayDiff(today || dayKey(), d);
    },

    // ── история попыток ──
    // kind: "quiz" | "mock" | "case" | "readiness"
    history: function () {
      var h = read(K_HISTORY);
      return Array.isArray(h.attempts) ? h.attempts : [];
    },
    addAttempt: function (a) {
      var h = read(K_HISTORY);
      var list = Array.isArray(h.attempts) ? h.attempts : [];
      var rec = {
        id: a.id || (String(a.ts || Date.now()) + "-" + Math.round(Math.random() * 1e6)),
        ts: a.ts || Date.now(),
        kind: a.kind || "quiz",
        mode: a.mode || "",
        total: a.total || 0,
        correct: a.correct || 0,
        pct: a.pct || 0,
        secs: a.secs || 0,
        weakTopics: a.weakTopics || [],
        details: a.details || null,
      };
      list.unshift(rec);
      // Держим только последние MAX_ATTEMPTS — иначе localStorage со временем
      // упрётся в квоту, и упадёт запись вообще всего состояния.
      while (list.length > MAX_ATTEMPTS) list.pop();
      write(K_HISTORY, { attempts: list });
      return rec;
    },
    historyOf: function (kind) {
      return Progress.history().filter(function (a) { return a.kind === kind; });
    },

    // Снимок готовности для графика в истории. Пишем не чаще одного раза в
    // день: иначе история заполнится однотипными записями за одну сессию.
    recordReadinessSnapshot: function (percent, today) {
      var k = today || dayKey();
      var list = Progress.history();
      for (var i = 0; i < list.length; i++) {
        if (list[i].kind === "readiness" && list[i].mode === k) return null;
      }
      return Progress.addAttempt({ kind: "readiness", mode: k, pct: percent, total: 0 });
    },

    // ── сброс ──
    reset: function () {
      write(K_PROGRESS, {});
      write(K_PROFILE, {});
      write(K_HISTORY, {});
      try { global.localStorage.removeItem(K_EXAM); } catch (e) {}
    },

    KEYS: {
      progress: K_PROGRESS,
      profile: K_PROFILE,
      history: K_HISTORY,
      exam: K_EXAM,
    },
  };

  global.Progress = Progress;
  if (typeof module !== "undefined" && module.exports) module.exports = Progress;
})(typeof window !== "undefined" ? window : globalThis);
