// ===========================================================================
// SRS — интервальное повторение (система Лейтнера).
//
// Зачем: теория забывается. SRS возвращает элемент на повтор ровно тогда, когда
// он вот-вот забудется. Это самый дешёвый способ удержать знание к дате
// собеседования.
//
// Что попадает в SRS: не только вопросы теста, но и термины словаря, открытые
// вопросы mock interview и кейсы. Поэтому идентификаторы префиксуются типом —
// "q:...", "t:...", "m:...", "c:..." — и одна коробка не путается с другой.
//
// Хранилище: localStorage, ключ interview_srs_v1
//   { [itemId]: { box, due } }
//   box — номер коробки 0..5 (чем выше, тем реже спрашиваем);
//   due — timestamp (мс), когда элемент снова «созреет».
//
// Поведение: верный ответ → box+1 и due отодвигается по INTERVALS; ошибка →
// box сбрасывается в 0, и элемент возвращается через INTERVALS[0] — минуты, а
// не мгновенно: иначе один и тот же вопрос крутился бы внутри одной сессии.
// Невиданный элемент считается «к изучению» и попадает в очередь повтора.
//
// API (window.SRS):
//   id(type, rawId)          — собрать префиксованный идентификатор;
//   grade(itemId, ok, now?)  — записать результат;
//   state(itemId)            — { box, due } или null;
//   boxOf(itemId)            — номер коробки или null;
//   isDue(itemId, now?)      — пора ли повторять;
//   dueCount(ids, now?)      — сколько из ids пора повторить;
//   pickDue(ids, n, now?)    — выбрать до n элементов к повтору;
//   stats(ids)               — сводка по коробкам;
//   mastery(ids)             — доля освоенности 0..1 (для расчёта готовности);
//   reset()                  — очистить.
//
// Чистое ядро nextState() экспортируется отдельно и не трогает хранилище —
// это позволяет проверять логику без браузера.
// ===========================================================================
(function (global) {
  "use strict";

  var KEY = "interview_srs_v1";

  var MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR;
  // Интервалы по коробкам. box 0 — вернуть почти сразу, box 5 — раз в три недели.
  var INTERVALS = [10 * MIN, 4 * HOUR, 1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY];
  var MAX_BOX = INTERVALS.length - 1;
  // Начиная с этой коробки элемент считается закреплённым.
  var LEARNED_BOX = 4;

  // Английский живёт в тех же коробках, но под своими префиксами: расчёт
  // готовности к профессии перечисляет идентификаторы сам и английских не
  // берёт, поэтому раздел не подмешивается в процент.
  var TYPES = { question: "q", term: "t", mock: "m", "case": "c",
    eword: "ew", edrill: "ed" };

  function load() {
    try { return JSON.parse(global.localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(map) {
    try { global.localStorage.setItem(KEY, JSON.stringify(map)); } catch (e) {}
  }

  // Чистое ядро перехода. prev: {box,due} | undefined → новое {box,due}.
  function nextState(prev, correct, now) {
    var box = prev && typeof prev.box === "number" ? prev.box : 0;
    if (correct) box = Math.min(box + 1, MAX_BOX);
    else box = 0;
    return { box: box, due: now + INTERVALS[box] };
  }

  var SRS = {
    INTERVALS: INTERVALS,
    MAX_BOX: MAX_BOX,
    LEARNED_BOX: LEARNED_BOX,
    nextState: nextState,

    id: function (type, rawId) {
      var p = TYPES[type];
      if (!p) throw new Error("SRS.id: неизвестный тип '" + type + "'");
      return p + ":" + rawId;
    },

    grade: function (itemId, correct, now) {
      now = now || Date.now();
      var map = load();
      map[itemId] = nextState(map[itemId], correct, now);
      save(map);
      return map[itemId];
    },

    // Записать сразу пачку результатов — один проход по хранилищу вместо N.
    gradeMany: function (results, now) {
      now = now || Date.now();
      var map = load();
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        map[r.id] = nextState(map[r.id], r.correct, now);
      }
      save(map);
      return map;
    },

    state: function (itemId) {
      var s = load()[itemId];
      return s || null;
    },

    // Весь срез разом — нужен расчёту готовности, чтобы не читать
    // localStorage по одному элементу на каждый из сотен идентификаторов.
    stateMap: function () { return load(); },

    boxOf: function (itemId) {
      var s = load()[itemId];
      return s ? s.box : null;
    },

    isDue: function (itemId, now) {
      now = now || Date.now();
      var s = load()[itemId];
      if (!s) return true;                       // ещё не учили — пора
      return s.due <= now;
    },

    dueCount: function (ids, now) {
      now = now || Date.now();
      var map = load(), n = 0;
      for (var i = 0; i < ids.length; i++) {
        var s = map[ids[i]];
        if (!s || s.due <= now) n++;
      }
      return n;
    },

    // Сколько элементов уже начаты и просрочены — то есть именно «повторить»,
    // а не «выучить впервые». Дашборд показывает это отдельным числом.
    reviewDueCount: function (ids, now) {
      now = now || Date.now();
      var map = load(), n = 0;
      for (var i = 0; i < ids.length; i++) {
        var s = map[ids[i]];
        if (s && s.due <= now) n++;
      }
      return n;
    },

    // Выбрать до n элементов к повтору. Приоритет: ниже коробка и больше
    // просрочка — раньше. Невиданные идут в конец: их много, и они не должны
    // вытеснять то, что вот-вот забудется.
    pickDue: function (ids, n, now) {
      now = now || Date.now();
      var map = load();
      var seen = [], fresh = [];
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i], s = map[id];
        if (s) { if (s.due <= now) seen.push({ id: id, box: s.box, over: now - s.due }); }
        else fresh.push(id);
      }
      seen.sort(function (a, b) { return (a.box - b.box) || (b.over - a.over); });
      var out = seen.map(function (x) { return x.id; }).concat(fresh);
      return n ? out.slice(0, n) : out;
    },

    stats: function (ids) {
      var map = load();
      var boxes = [0, 0, 0, 0, 0, 0], learned = 0, started = 0;
      for (var i = 0; i < ids.length; i++) {
        var s = map[ids[i]];
        if (!s) continue;
        started++;
        boxes[s.box]++;
        if (s.box >= LEARNED_BOX) learned++;
      }
      return { total: ids.length, started: started, learned: learned, boxes: boxes };
    },

    // Освоенность набора: 0..1. Вклад элемента — box/MAX_BOX, поэтому процент
    // растёт плавно, а не скачком при переходе в «закреплено».
    mastery: function (ids, stateMap) {
      if (!ids || !ids.length) return 0;
      var map = stateMap || load();
      var sum = 0;
      for (var i = 0; i < ids.length; i++) {
        var s = map[ids[i]];
        sum += s ? Math.min(s.box, MAX_BOX) / MAX_BOX : 0;
      }
      return sum / ids.length;
    },

    // Сколько верных ответов осталось, чтобы довести набор до «закреплено».
    // Используется планом к дате собеседования.
    reviewsLeft: function (ids, stateMap) {
      var map = stateMap || load();
      var left = 0;
      for (var i = 0; i < ids.length; i++) {
        var s = map[ids[i]];
        left += Math.max(0, LEARNED_BOX - (s ? s.box : 0));
      }
      return left;
    },

    reset: function () { save({}); },
  };

  global.SRS = SRS;
  if (typeof module !== "undefined" && module.exports) module.exports = SRS;
})(typeof window !== "undefined" ? window : globalThis);
