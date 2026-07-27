// ===========================================================================
// SYNC — синхронизация прогресса между устройствами через /api/*.
//
// Драйвер: всё состояние живёт в localStorage, чтобы приложение работало без
// сети. Этот модуль подтягивает состояние с сервера при старте и отправляет
// изменения, чтобы один и тот же аккаунт Telegram видел свой прогресс везде.
//
// Безопасность: серверу уходит Telegram initData в заголовке X-Init-Data;
// сервер проверяет подпись HMAC и берёт user_id только оттуда, никогда из тела.
//
// Полный фолбэк: нет initData, нет сети или ошибка API → молча продолжаем
// работать на localStorage. Sync НИКОГДА не должен ломать офлайн-режим.
//
// ВАЖНО: правила слияния ниже обязаны совпадать с api/merge.py по результату.
// Дублирование намеренное (клиент должен уметь сливать офлайн), а расхождение
// ловит тест паритета tests/test_sync.py и webapp/_sync_check.mjs.
//
// Подключать ПОСЛЕ srs.js и progress.js.
// ===========================================================================
(function (global) {
  "use strict";

  var K_SRS = "interview_srs_v1";
  var K_PROGRESS = "interview_progress_v1";
  var K_PROFILE = "interview_profile_v1";
  var K_HISTORY = "interview_history_v1";
  var K_EXAM = "interview_exam_date_v1";
  var K_SYNC = "interview_sync_v1";

  var API_STATE = "/api/state";
  var API_ATTEMPTS = "/api/attempts";
  var POST_DEBOUNCE_MS = 4000;

  // ОБЯЗАНЫ совпадать с api/merge.py и api/storage.py.
  var MAX_HISTORY_DAYS = 365;
  var MAX_ATTEMPTS = 100;
  var MAX_BOX = 5;

  // Порядок статусов требования вакансии: при слиянии побеждает более
  // продвинутый. Индекс = «сила» статуса.
  var REQ_STATUS_RANK = ["not_started", "not_applicable", "learning", "partial", "confirmed"];

  var tg = global.Telegram && global.Telegram.WebApp;
  var initData = (tg && tg.initData) || "";

  function lsGet(k, fallback) {
    try {
      var v = JSON.parse(global.localStorage.getItem(k));
      return v == null ? (fallback === undefined ? {} : fallback) : v;
    } catch (e) { return fallback === undefined ? {} : fallback; }
  }
  function lsSet(k, v) {
    try { global.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  // ── вспомогательные правила слияния ──

  function num(o, k) {
    var n = parseInt(o && o[k], 10);
    return isNaN(n) ? 0 : n;
  }
  function orFlag(a, b, k) { return !!((a && a[k]) || (b && b[k])); }
  // Скаляр: побеждает значение из b, если оно задано; иначе из a.
  function pick(a, b, k) {
    var vb = b ? b[k] : undefined;
    if (vb !== undefined && vb !== null && vb !== "") return vb;
    var va = a ? a[k] : undefined;
    return (va === undefined) ? null : va;
  }
  function keysOf(a, b) {
    var s = {};
    Object.keys(a || {}).forEach(function (k) { s[k] = 1; });
    Object.keys(b || {}).forEach(function (k) { s[k] = 1; });
    return Object.keys(s).sort();
  }

  function validSrsEntry(s) {
    return s && typeof s.box === "number" && typeof s.due === "number"
      && s.box >= 0 && s.box <= MAX_BOX;
  }

  // ── merge: SRS ──
  // Побеждает более высокая коробка; при равной — более поздний срок повтора.
  function mergeSrs(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = validSrsEntry(a[id]) ? a[id] : null;
      var y = validSrsEntry(b[id]) ? b[id] : null;
      if (!x && !y) return;
      if (!x) { out[id] = { box: y.box, due: y.due }; return; }
      if (!y) { out[id] = { box: x.box, due: x.due }; return; }
      out[id] = (y.box > x.box || (y.box === x.box && y.due > x.due))
        ? { box: y.box, due: y.due }
        : { box: x.box, due: x.due };
    });
    return out;
  }

  // ── merge: прогресс ──
  function mergeProgress(a, b) {
    a = a || {}; b = b || {};
    var days = {};
    [a.days || {}, b.days || {}].forEach(function (src) {
      Object.keys(src).forEach(function (d) {
        var n = parseInt(src[d], 10);
        if (isNaN(n) || n < 0) return;
        days[d] = Math.max(days[d] || 0, n);
      });
    });
    var ks = Object.keys(days).sort();
    while (ks.length > MAX_HISTORY_DAYS) { delete days[ks.shift()]; }

    var streak = Math.max(num(a, "streak"), num(b, "streak"));
    var best = Math.max(num(a, "best"), num(b, "best"), streak);
    var goal = num(b, "goal") || num(a, "goal") || 15;

    var lastA = a.lastDay || "", lastB = b.lastDay || "";
    var last = (lastA > lastB ? lastA : lastB) || null;

    var out = {
      goal: Math.max(5, Math.min(100, goal)),
      days: days,
      streak: streak,
      best: best,
    };
    if (last) {
      out.lastDay = last;
      // frozenUsed берём у источника с более свежим lastDay: иначе устройство,
      // не заходившее неделю, вернуло бы уже потраченную страховку.
      out.frozenUsed = !!((lastB >= lastA ? b : a).frozenUsed);
    }

    var flags = {};
    [a.flags || {}, b.flags || {}].forEach(function (src) {
      Object.keys(src).forEach(function (k) { if (src[k]) flags[k] = true; });
    });
    if (Object.keys(flags).length) out.flags = flags;
    return out;
  }

  // ── merge: элементы с самооценкой (mock, кейсы) ──
  // Побеждает лучшая оценка; число заходов — максимум, чтобы «подтверждённость»
  // не терялась. Оценка не «залипает» при откате: если на другом устройстве
  // ответ был хуже, счётчик заходов всё равно растёт и требует подтверждения.
  function mergeRated(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = a[id] || null, y = b[id] || null;
      if (!x && !y) return;
      if (!x) { out[id] = normRated(y); return; }
      if (!y) { out[id] = normRated(x); return; }
      var nx = normRated(x), ny = normRated(y);
      out[id] = {
        rating: Math.max(nx.rating, ny.rating),
        count: Math.max(nx.count, ny.count),
        ts: Math.max(nx.ts, ny.ts),
      };
    });
    return out;
  }
  function normRated(e) {
    var r = parseInt(e && e.rating, 10);
    if (isNaN(r) || r < 0) r = 0;
    if (r > 4) r = 4;
    var c = parseInt(e && e.count, 10);
    if (isNaN(c) || c < 1) c = 1;
    var t = parseInt(e && e.ts, 10);
    if (isNaN(t) || t < 0) t = 0;
    return { rating: r, count: c, ts: t };
  }

  // ── merge: шаги плана ──
  function mergeRoadmap(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = a[id] || {}, y = b[id] || {};
      out[id] = {
        lessonRead: orFlag(x, y, "lessonRead"),
        quizBest: Math.max(num(x, "quizBest"), num(y, "quizBest")),
        casesDone: Math.max(num(x, "casesDone"), num(y, "casesDone")),
        mocksAnswered: Math.max(num(x, "mocksAnswered"), num(y, "mocksAnswered")),
        done: orFlag(x, y, "done"),
      };
    });
    return out;
  }

  // ── merge: требования вакансии ──
  function mergeRequirements(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = a[id] || {}, y = b[id] || {};
      var rx = REQ_STATUS_RANK.indexOf(x.status || "not_started");
      var ry = REQ_STATUS_RANK.indexOf(y.status || "not_started");
      out[id] = {
        status: (ry >= rx ? y.status : x.status) || "not_started",
        evidence: pick(x, y, "evidence") || "",
        gap: pick(x, y, "gap") || "",
      };
    });
    return out;
  }

  // ── merge: библиотека и истории STAR ──
  function mergeLibrary(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = a[id] || {}, y = b[id] || {};
      out[id] = { read: orFlag(x, y, "read"), note: pick(x, y, "note") || "" };
    });
    return out;
  }

  function mergeStories(a, b) {
    a = a || {}; b = b || {};
    var out = {};
    keysOf(a, b).forEach(function (id) {
      var x = a[id] || {}, y = b[id] || {};
      // Целиком побеждает более свежая версия истории: смешивать поля из двух
      // редакций текста нельзя — получится бессвязный рассказ.
      var w = num(y, "updatedAt") >= num(x, "updatedAt") ? y : x;
      out[id] = {
        situation: w.situation || "",
        task: w.task || "",
        action: w.action || "",
        result: w.result || "",
        reflection: w.reflection || "",
        updatedAt: Math.max(num(x, "updatedAt"), num(y, "updatedAt")),
      };
    });
    return out;
  }

  // ── merge: профиль ──
  function mergeProfile(a, b) {
    a = a || {}; b = b || {};
    var sa = {};
    keysOf(a.selfAssessment, b.selfAssessment).forEach(function (k) {
      var vb = b.selfAssessment && b.selfAssessment[k];
      var va = a.selfAssessment && a.selfAssessment[k];
      var v = (vb === undefined || vb === null) ? va : vb;
      var n = parseInt(v, 10);
      if (!isNaN(n) && n >= 0 && n <= 5) sa[k] = n;
    });
    var glossary = {};
    keysOf(a.glossary, b.glossary).forEach(function (k) {
      var x = (a.glossary || {})[k] || {}, y = (b.glossary || {})[k] || {};
      glossary[k] = {
        favorite: orFlag(x, y, "favorite"),
        checked: Math.max(num(x, "checked"), num(y, "checked")),
      };
    });
    var out = {
      trackId: pick(a, b, "trackId"),
      onboarded: orFlag(a, b, "onboarded"),
      selfAssessment: sa,
      requirements: mergeRequirements(a.requirements, b.requirements),
      roadmap: mergeRoadmap(a.roadmap, b.roadmap),
      glossary: glossary,
      mock: mergeRated(a.mock, b.mock),
      cases: mergeRated(a.cases, b.cases),
      library: mergeLibrary(a.library, b.library),
      stories: mergeStories(a.stories, b.stories),
    };
    if (out.trackId === null) delete out.trackId;
    return out;
  }

  // ── merge: дата собеседования ──
  // Побеждает более поздняя ПО ВРЕМЕНИ УСТАНОВКИ, а не более поздняя дата:
  // пользователь может перенести собеседование и вперёд, и назад.
  function mergeExamDate(a, b) {
    var x = normExam(a), y = normExam(b);
    if (!x.value && !y.value) return { value: null, setAt: 0 };
    if (!x.value) return y;
    if (!y.value) return x;
    return y.setAt >= x.setAt ? y : x;
  }
  function normExam(e) {
    if (!e) return { value: null, setAt: 0 };
    if (typeof e === "string") return { value: e, setAt: 0 };
    var t = parseInt(e.setAt, 10);
    return { value: e.value || null, setAt: isNaN(t) ? 0 : t };
  }

  // ── merge: история попыток ──
  // Append-only: объединяем по id, сортируем по времени, режем до лимита.
  function mergeHistory(a, b) {
    var seen = {}, out = [];
    (a || []).concat(b || []).forEach(function (rec) {
      if (!rec || !rec.id) return;
      if (seen[rec.id]) return;
      seen[rec.id] = 1;
      out.push(rec);
    });
    out.sort(function (x, y) {
      // Стабильная сортировка: при равном времени — по id, чтобы порядок был
      // одинаковым на клиенте и на сервере.
      return (y.ts || 0) - (x.ts || 0) || String(x.id).localeCompare(String(y.id));
    });
    return out.slice(0, MAX_ATTEMPTS);
  }

  function mergeState(a, b) {
    return {
      srs: mergeSrs(a && a.srs, b && b.srs),
      progress: mergeProgress(a && a.progress, b && b.progress),
      profile: mergeProfile(a && a.profile, b && b.profile),
      exam_date: mergeExamDate(a && a.exam_date, b && b.exam_date),
    };
  }

  // ── локальное состояние ──

  function localState() {
    var profile = lsGet(K_PROFILE);
    var examValue = null;
    try { examValue = global.localStorage.getItem(K_EXAM) || null; } catch (e) {}
    return {
      srs: lsGet(K_SRS),
      progress: lsGet(K_PROGRESS),
      profile: profile,
      exam_date: { value: examValue, setAt: parseInt(profile.examDateSetAt, 10) || 0 },
    };
  }

  function applyState(state) {
    if (!state) return;
    if (state.srs) lsSet(K_SRS, state.srs);
    if (state.progress) lsSet(K_PROGRESS, state.progress);
    if (state.profile) {
      var p = state.profile;
      if (state.exam_date && state.exam_date.setAt) p.examDateSetAt = state.exam_date.setAt;
      lsSet(K_PROFILE, p);
    }
    if (state.exam_date) {
      try {
        if (state.exam_date.value) global.localStorage.setItem(K_EXAM, state.exam_date.value);
        else global.localStorage.removeItem(K_EXAM);
      } catch (e) {}
    }
  }

  function localHistory() {
    var h = lsGet(K_HISTORY, { attempts: [] });
    return Array.isArray(h.attempts) ? h.attempts : [];
  }
  function applyHistory(list) {
    lsSet(K_HISTORY, { attempts: list });
  }

  function meta() { return lsGet(K_SYNC, {}); }
  function setMeta(patch) {
    var m = meta();
    Object.keys(patch).forEach(function (k) { m[k] = patch[k]; });
    lsSet(K_SYNC, m);
  }

  function request(url, options) {
    var opts = options || {};
    opts.headers = opts.headers || {};
    opts.headers["X-Init-Data"] = initData;
    return global.fetch(url, opts).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  var Sync = {
    enabled: !!(initData && global.fetch),
    lastError: null,

    // Слить локальное с серверным. Отправляем локальное состояние, сервер
    // возвращает результат слияния — применяем его обратно.
    push: function () {
      if (!Sync.enabled) return Promise.resolve(false);
      return request(API_STATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localState()),
      }).then(function (j) {
        if (j && j.state) {
          applyState(mergeState(localState(), j.state));
          setMeta({ lastSync: Date.now(), ok: true });
          Sync.lastError = null;
          return true;
        }
        return false;
      }).catch(function (e) {
        Sync.lastError = String(e && e.message || e);
        setMeta({ ok: false });
        return false;                       // офлайн — тихо остаёмся на localStorage
      });
    },

    pull: function () {
      if (!Sync.enabled) return Promise.resolve(false);
      return request(API_STATE, {}).then(function (j) {
        if (!j || !j.state) return false;
        applyState(mergeState(localState(), j.state));
        setMeta({ lastSync: Date.now(), ok: true });
        Sync.lastError = null;
        return true;
      }).catch(function (e) {
        Sync.lastError = String(e && e.message || e);
        return false;
      });
    },

    // Дебаунс: вызывать после каждого действия, реальная отправка — раз в N сек.
    _timer: null,
    schedulePush: function () {
      if (!Sync.enabled) return;
      clearTimeout(Sync._timer);
      Sync._timer = setTimeout(function () { Sync.push(); }, POST_DEBOUNCE_MS);
    },

    pushHistory: function () {
      if (!Sync.enabled) return Promise.resolve(false);
      return request(API_ATTEMPTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attempts: localHistory() }),
      }).then(function (j) {
        if (j && j.attempts) {
          applyHistory(mergeHistory(localHistory(), j.attempts));
          return true;
        }
        return false;
      }).catch(function () { return false; });
    },

    pullHistory: function () {
      if (!Sync.enabled) return Promise.resolve(false);
      return request(API_ATTEMPTS, {}).then(function (j) {
        if (!j || !j.attempts) return false;
        applyHistory(mergeHistory(localHistory(), j.attempts));
        return true;
      }).catch(function () { return false; });
    },

    // Полная синхронизация при старте приложения.
    boot: function () {
      if (!Sync.enabled) return Promise.resolve(false);
      return Sync.push().then(function () { return Sync.pushHistory(); });
    },

    status: function () {
      var m = meta();
      return {
        enabled: Sync.enabled,
        lastSync: m.lastSync || null,
        ok: m.ok !== false,
        error: Sync.lastError,
      };
    },

    // экспорт правил для тестов паритета
    mergeSrs: mergeSrs,
    mergeProgress: mergeProgress,
    mergeProfile: mergeProfile,
    mergeRated: mergeRated,
    mergeRoadmap: mergeRoadmap,
    mergeRequirements: mergeRequirements,
    mergeLibrary: mergeLibrary,
    mergeStories: mergeStories,
    mergeExamDate: mergeExamDate,
    mergeHistory: mergeHistory,
    mergeState: mergeState,
    MAX_HISTORY_DAYS: MAX_HISTORY_DAYS,
    MAX_ATTEMPTS: MAX_ATTEMPTS,
  };

  // Отправить накопленное при сворачивании Mini App.
  if (global.addEventListener && global.document) {
    global.addEventListener("visibilitychange", function () {
      if (global.document.visibilityState === "hidden") Sync.push();
    });
  }

  global.Sync = Sync;
  if (typeof module !== "undefined" && module.exports) module.exports = Sync;
})(typeof window !== "undefined" ? window : globalThis);
