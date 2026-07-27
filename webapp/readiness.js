// ===========================================================================
// READINESS — честный процент готовности к собеседованию.
//
// Требования к расчёту:
//   1. Прозрачность — видно, из чего сложился процент и что его ограничивает.
//   2. Воспроизводимость — одинаковый вход даёт одинаковый выход. Никакого
//      Date.now() и Math.random() внутри: время передаётся аргументом.
//   3. Честность — самооценка НЕ участвует в расчёте, а незаполненный трек
//      вообще не получает процента.
//
// Веса блоков (в сумме 100):
//   35  знания и SRS
//   25  mock interview
//   20  практические кейсы
//   10  словарь
//   10  покрытие плана и регулярность
//
// Ограничители (caps) не дают набрать высокий процент в обход слабых мест:
//   нет ни одной полной сессии mock  → максимум 74
//   меньше трёх завершённых кейсов   → максимум 79
//   критическая тема ниже 40%        → максимум 69
//   охвачено меньше 60% обязательных тем → максимум 64
//
// Модуль чистый: не читает localStorage сам, всё получает во входном объекте.
// Это позволяет прогонять его в Node без браузера.
// ===========================================================================
(function (global) {
  "use strict";

  var WEIGHTS = {
    knowledge: 35,
    mock: 25,
    cases: 20,
    glossary: 10,
    plan: 10,
  };

  var CAPS = {
    noFullMock: 74,
    fewCases: 79,
    weakCriticalTopic: 69,
    lowTopicCoverage: 64,
  };

  var MIN_CASES = 3;                 // ниже этого числа действует cap fewCases
  var WEAK_CRITICAL = 0.40;          // критическая тема ниже — cap
  var TOPIC_COVERED = 0.30;          // тема считается охваченной начиная отсюда
  var MIN_TOPIC_COVERAGE = 0.60;     // доля охваченных обязательных тем
  var MAX_BOX = 5;
  var LEARNED_BOX = 4;
  var ACTIVITY_WINDOW = 14;          // окно оценки регулярности, дней

  var VERDICTS = [
    { min: 85, label: "Готов к собеседованию" },
    { min: 70, label: "Почти готов" },
    { min: 50, label: "В процессе" },
    { min: 30, label: "База формируется" },
    { min: 0, label: "Начало подготовки" },
  ];

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  function boxOf(srs, id) {
    var s = srs && srs[id];
    return s && typeof s.box === "number" ? s.box : null;
  }

  // Освоенность набора идентификаторов с весами. weightFn может учитывать
  // сложность: трудный вопрос весит больше лёгкого.
  function masteryOf(srs, ids, weightFn) {
    if (!ids || !ids.length) return 0;
    var sum = 0, total = 0;
    for (var i = 0; i < ids.length; i++) {
      var w = weightFn ? weightFn(ids[i], i) : 1;
      var b = boxOf(srs, ids[i]);
      sum += w * (b == null ? 0 : Math.min(b, MAX_BOX) / MAX_BOX);
      total += w;
    }
    return total ? sum / total : 0;
  }

  // Доля начатых элементов, у которых срок повтора прошёл. Много просроченного
  // означает, что знание уже «протухает», и процент должен это отражать.
  function overdueShare(srs, ids, nowMs) {
    var started = 0, overdue = 0;
    for (var i = 0; i < ids.length; i++) {
      var s = srs && srs[ids[i]];
      if (!s) continue;
      started++;
      if (s.due <= nowMs) overdue++;
    }
    return started ? overdue / started : 0;
  }

  function verdictFor(percent) {
    for (var i = 0; i < VERDICTS.length; i++) {
      if (percent >= VERDICTS[i].min) return VERDICTS[i].label;
    }
    return VERDICTS[VERDICTS.length - 1].label;
  }

  // Качество самооценённого ответа. rating 0..4 → 0..1, но одна высокая
  // самооценка без повтора не даёт полного балла: подтверждением считается
  // повторный заход на тот же вопрос.
  function ratedQuality(entry) {
    if (!entry || typeof entry.rating !== "number") return null;
    var base = clamp01(entry.rating / 4);
    var confirmed = (entry.count || 1) >= 2;
    return confirmed ? base : base * 0.75;
  }

  // ── блоки ────────────────────────────────────────────────────────────────

  function knowledgeBlock(input) {
    var c = input.content, srs = input.srs, trackId = input.trackId;
    var questions = c.questions.filter(function (q) { return q.track_id === trackId; });
    var topics = c.topics.filter(function (t) { return t.track_id === trackId; });

    if (!questions.length) {
      return { score: 0, topics: [], detail: { reason: "в треке нет вопросов" } };
    }

    var byTopic = {};
    var ids = [], weights = {};
    questions.forEach(function (q) {
      var id = "q:" + q.id;
      ids.push(id);
      weights[id] = q.difficulty || 1;      // сложность как вес
      (byTopic[q.topic] = byTopic[q.topic] || []).push(id);
    });

    var overall = masteryOf(srs, ids, function (id) { return weights[id]; });

    // Средняя освоенность по темам: слабая тема тянет итог вниз сильнее, чем
    // при усреднении по вопросам, где крупная тема перевешивает мелкую.
    var topicRows = topics.map(function (t) {
      var tIds = byTopic[t.id] || [];
      var m = tIds.length ? masteryOf(srs, tIds, function (id) { return weights[id]; }) : null;
      return {
        id: t.id,
        title: t.title,
        required: !!t.required,
        critical: !!t.critical,
        questions: tIds.length,
        mastery: m,
        pct: m == null ? null : Math.round(m * 100),
      };
    });

    var withQuestions = topicRows.filter(function (r) { return r.mastery != null; });
    var meanTopic = withQuestions.length
      ? withQuestions.reduce(function (a, r) { return a + r.mastery; }, 0) / withQuestions.length
      : 0;

    // Свежесть: сильно просроченный набор снижает балл, но не обнуляет его.
    var freshness = 1 - 0.15 * overdueShare(srs, ids, input.nowMs);

    var score = clamp01((0.6 * overall + 0.4 * meanTopic) * freshness);

    topicRows.sort(function (a, b) {
      var am = a.mastery == null ? -1 : a.mastery;
      var bm = b.mastery == null ? -1 : b.mastery;
      return am - bm;                                   // слабые сверху
    });

    return {
      score: score,
      topics: topicRows,
      detail: {
        overall: overall,
        meanTopic: meanTopic,
        freshness: freshness,
        answered: ids.filter(function (id) { return boxOf(srs, id) != null; }).length,
        total: ids.length,
      },
    };
  }

  function mockBlock(input) {
    var c = input.content, trackId = input.trackId;
    var mocks = c.mockQuestions.filter(function (m) { return m.track_id === trackId; });
    var state = (input.profile && input.profile.mock) || {};
    if (!mocks.length) return { score: 0, detail: { answered: 0, total: 0 } };

    var categories = {};
    var answeredCats = {};
    var qualities = [];

    mocks.forEach(function (m) {
      categories[m.category] = true;
      var q = ratedQuality(state[m.id]);
      if (q != null) {
        answeredCats[m.category] = true;
        qualities.push(q);
      }
    });

    var totalCats = Object.keys(categories).length || 1;
    var coverage = Object.keys(answeredCats).length / totalCats;
    var avgQuality = qualities.length
      ? qualities.reduce(function (a, b) { return a + b; }, 0) / qualities.length
      : 0;
    // Объём: пока отвечено мало вопросов, средняя оценка ничего не говорит.
    var volume = clamp01(qualities.length / Math.max(8, Math.ceil(mocks.length * 0.4)));

    var score = clamp01(0.35 * coverage + 0.45 * avgQuality * volume + 0.20 * volume);

    return {
      score: score,
      detail: {
        answered: qualities.length,
        total: mocks.length,
        coverage: coverage,
        avgQuality: avgQuality,
        fullSessions: input.fullMockSessions || 0,
      },
    };
  }

  function casesBlock(input) {
    var c = input.content, trackId = input.trackId;
    var cases = c.cases.filter(function (x) { return x.track_id === trackId; });
    var state = (input.profile && input.profile.cases) || {};
    if (!cases.length) return { score: 0, detail: { completed: 0, total: 0 } };

    var criticalTotal = 0, criticalDone = 0, qualities = [], completed = 0;
    cases.forEach(function (x) {
      if (x.critical) criticalTotal++;
      var q = ratedQuality(state[x.id]);
      if (q != null) {
        completed++;
        qualities.push(q);
        if (x.critical) criticalDone++;
      }
    });

    var completionShare = clamp01(completed / cases.length);
    var criticalShare = criticalTotal ? criticalDone / criticalTotal : 1;
    var avgQuality = qualities.length
      ? qualities.reduce(function (a, b) { return a + b; }, 0) / qualities.length
      : 0;

    var score = clamp01(0.35 * completionShare + 0.40 * avgQuality + 0.25 * criticalShare);

    return {
      score: score,
      detail: {
        completed: completed,
        total: cases.length,
        criticalDone: criticalDone,
        criticalTotal: criticalTotal,
        avgQuality: avgQuality,
      },
    };
  }

  function glossaryBlock(input) {
    var c = input.content, srs = input.srs, trackId = input.trackId;
    var terms = c.glossary.filter(function (t) {
      return !t.track_ids || t.track_ids.indexOf(trackId) !== -1;
    });
    if (!terms.length) return { score: 0, detail: { mastered: 0, total: 0 } };

    var ids = terms.map(function (t) { return "t:" + t.id; });
    // Термин попадает в SRS только после проверки знания — просто открытая
    // карточка не даёт ничего. Это гарантирует сам экран словаря.
    var score = masteryOf(srs, ids, null);
    var mastered = ids.filter(function (id) {
      var b = boxOf(srs, id);
      return b != null && b >= LEARNED_BOX;
    }).length;
    var started = ids.filter(function (id) { return boxOf(srs, id) != null; }).length;

    return {
      score: score,
      detail: { mastered: mastered, started: started, total: ids.length },
    };
  }

  function planBlock(input) {
    var c = input.content, trackId = input.trackId;
    var steps = c.roadmap.filter(function (s) { return s.track_id === trackId; });
    var done = (input.profile && input.profile.roadmap) || {};
    var required = steps.filter(function (s) { return s.required; });

    var doneRequired = required.filter(function (s) {
      return done[s.id] && done[s.id].done;
    }).length;
    var stepsShare = required.length ? doneRequired / required.length : 0;

    // Регулярность: доля активных дней в окне. Серия сознательно НЕ берётся
    // главным показателем — она отражает дисциплину, а не знания.
    var days = input.days || {};
    var activeDays = 0;
    if (input.today) {
      for (var i = 0; i < ACTIVITY_WINDOW; i++) {
        var d = shiftDay(input.today, -i);
        if (days[d]) activeDays++;
      }
    }
    var activityShare = clamp01(activeDays / ACTIVITY_WINDOW);

    var score = clamp01(0.7 * stepsShare + 0.3 * activityShare);

    return {
      score: score,
      detail: {
        doneRequired: doneRequired,
        totalRequired: required.length,
        totalSteps: steps.length,
        activeDays: activeDays,
        window: ACTIVITY_WINDOW,
      },
    };
  }

  // Сдвиг ключа даты на n дней. Через UTC, чтобы перевод часов не сбивал счёт.
  function shiftDay(dayKey, n) {
    var p = String(dayKey).split("-").map(Number);
    var t = Date.UTC(p[0], p[1] - 1, p[2]) + n * 86400000;
    var d = new Date(t);
    return d.getUTCFullYear() + "-" +
      String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
      String(d.getUTCDate()).padStart(2, "0");
  }

  // ── основной расчёт ──────────────────────────────────────────────────────

  function compute(input) {
    var c = input.content;
    var trackId = input.trackId;
    var track = (c.tracks || []).filter(function (t) { return t.id === trackId; })[0];

    // Незаполненный трек не получает готовности: показать по пустому банку
    // «12%» значило бы выдать отсутствие контента за оценку пользователя.
    if (!track || track.status !== "active") {
      return {
        available: false,
        reason: track ? "Трек ещё не наполнен" : "Трек не выбран",
        percent: null,
        verdict: null,
        blocks: [],
        caps: [],
        topics: [],
        gaps: [],
      };
    }

    var ctx = {
      content: c,
      trackId: trackId,
      srs: input.srs || {},
      profile: input.profile || {},
      days: input.days || {},
      today: input.today,
      nowMs: input.nowMs || 0,
      fullMockSessions: input.fullMockSessions || 0,
    };

    var kb = knowledgeBlock(ctx);
    var mb = mockBlock(ctx);
    var cb = casesBlock(ctx);
    var gb = glossaryBlock(ctx);
    var pb = planBlock(ctx);

    var blocks = [
      { key: "knowledge", title: "Знания и повторение", weight: WEIGHTS.knowledge, score: kb.score, detail: kb.detail },
      { key: "mock", title: "Mock interview", weight: WEIGHTS.mock, score: mb.score, detail: mb.detail },
      { key: "cases", title: "Практические кейсы", weight: WEIGHTS.cases, score: cb.score, detail: cb.detail },
      { key: "glossary", title: "Словарь", weight: WEIGHTS.glossary, score: gb.score, detail: gb.detail },
      { key: "plan", title: "План и регулярность", weight: WEIGHTS.plan, score: pb.score, detail: pb.detail },
    ];

    var rawPoints = blocks.reduce(function (a, b) { return a + b.weight * b.score; }, 0);
    var raw = Math.round(rawPoints);

    // ── ограничители ──
    var caps = [];
    if (!ctx.fullMockSessions) {
      caps.push({ key: "noFullMock", max: CAPS.noFullMock,
        reason: "Нет ни одной полной сессии mock interview",
        action: "Пройти полное mock interview" });
    }
    if (cb.detail.completed < MIN_CASES) {
      caps.push({ key: "fewCases", max: CAPS.fewCases,
        reason: "Завершено меньше трёх практических кейсов (" + cb.detail.completed + " из " + MIN_CASES + ")",
        action: "Пройти ещё " + (MIN_CASES - cb.detail.completed) + " кейса" });
    }

    var criticalRows = kb.topics.filter(function (t) { return t.critical; });
    var weakCritical = criticalRows.filter(function (t) {
      return t.mastery == null || t.mastery < WEAK_CRITICAL;
    });
    if (weakCritical.length) {
      caps.push({ key: "weakCriticalTopic", max: CAPS.weakCriticalTopic,
        reason: "Критическая тема ниже 40%: " + weakCritical.map(function (t) { return t.title; }).join(", "),
        action: "Подтянуть тему «" + weakCritical[0].title + "»",
        topicId: weakCritical[0].id });
    }

    var requiredRows = kb.topics.filter(function (t) { return t.required && t.questions > 0; });
    var coveredRequired = requiredRows.filter(function (t) {
      return t.mastery != null && t.mastery >= TOPIC_COVERED;
    }).length;
    var coverage = requiredRows.length ? coveredRequired / requiredRows.length : 0;
    if (coverage < MIN_TOPIC_COVERAGE) {
      caps.push({ key: "lowTopicCoverage", max: CAPS.lowTopicCoverage,
        reason: "Охвачено " + Math.round(coverage * 100) + "% обязательных тем (нужно от 60%)",
        action: "Начать разбор новых тем плана" });
    }

    var capMax = caps.reduce(function (m, x) { return Math.min(m, x.max); }, 100);
    var percent = Math.min(raw, capMax);
    var appliedCap = caps.filter(function (x) { return x.max === capMax; })[0] || null;
    // Ограничитель считается сработавшим, только если он реально срезал балл.
    if (appliedCap && raw <= capMax) appliedCap = null;

    // ── три главных пробела ──
    var gaps = [];
    caps.forEach(function (x) {
      gaps.push({ kind: "cap", title: x.reason, action: x.action, topicId: x.topicId || null });
    });
    kb.topics.forEach(function (t) {
      if (t.questions > 0 && t.mastery != null && t.mastery < 0.5) {
        gaps.push({
          kind: "topic",
          title: "Тема «" + t.title + "» — " + t.pct + "%",
          action: "Пройти тест по теме",
          topicId: t.id,
        });
      }
    });
    blocks.forEach(function (b) {
      if (b.score < 0.35 && b.weight >= 20) {
        gaps.push({ kind: "block", title: "Блок «" + b.title + "» — " +
          Math.round(b.score * 100) + "%", action: "Заняться этим блоком", blockKey: b.key });
      }
    });

    return {
      available: true,
      percent: percent,
      rawPercent: raw,
      verdict: verdictFor(percent),
      blocks: blocks,
      caps: caps,
      appliedCap: appliedCap,
      capMax: capMax,
      topics: kb.topics,
      coverage: coverage,
      gaps: gaps.slice(0, 3),
      allGaps: gaps,
    };
  }

  // ── план к дате собеседования ────────────────────────────────────────────
  //
  // Считаем не только тесты: обязательные элементы разных типов имеют разный
  // вес во времени, поэтому норма выражается в «действиях в день», где кейс и
  // mock-вопрос стоят дороже одного ответа на тест.
  var ACTION_COST = { review: 1, mock: 3, "case": 8, step: 4 };

  function examPlan(input) {
    var date = input.examDate;
    if (!date || !input.today) return null;

    var p = String(date).split("-").map(Number);
    var t = String(input.today).split("-").map(Number);
    if (p.length !== 3 || t.length !== 3) return null;
    var daysLeft = Math.round(
      (Date.UTC(p[0], p[1] - 1, p[2]) - Date.UTC(t[0], t[1] - 1, t[2])) / 86400000);

    var c = input.content, trackId = input.trackId, srs = input.srs || {};
    var profile = input.profile || {};

    var qIds = c.questions.filter(function (q) { return q.track_id === trackId; })
      .map(function (q) { return "q:" + q.id; });
    var tIds = c.glossary.filter(function (x) {
      return !x.track_ids || x.track_ids.indexOf(trackId) !== -1;
    }).map(function (x) { return "t:" + x.id; });

    var reviewsLeft = 0;
    qIds.concat(tIds).forEach(function (id) {
      var b = boxOf(srs, id);
      reviewsLeft += Math.max(0, LEARNED_BOX - (b == null ? 0 : b));
    });

    var mocks = c.mockQuestions.filter(function (m) { return m.track_id === trackId; });
    var mockState = profile.mock || {};
    var mocksLeft = mocks.filter(function (m) {
      var e = mockState[m.id];
      return !e || typeof e.rating !== "number" || e.rating < 3;
    }).length;

    var cases = c.cases.filter(function (x) { return x.track_id === trackId; });
    var caseState = profile.cases || {};
    var casesLeft = cases.filter(function (x) {
      var e = caseState[x.id];
      return !e || typeof e.rating !== "number";
    }).length;

    var steps = c.roadmap.filter(function (s) { return s.track_id === trackId && s.required; });
    var stepState = profile.roadmap || {};
    var stepsLeft = steps.filter(function (s) {
      return !(stepState[s.id] && stepState[s.id].done);
    }).length;

    var work = reviewsLeft * ACTION_COST.review
      + mocksLeft * ACTION_COST.mock
      + casesLeft * ACTION_COST["case"]
      + stepsLeft * ACTION_COST.step;

    var past = daysLeft < 0;
    // День собеседования учить поздно: делим на оставшиеся полные дни.
    var effectiveDays = Math.max(1, daysLeft);
    var needPerDay = past ? 0 : Math.ceil(work / effectiveDays);

    return {
      date: date,
      daysLeft: daysLeft,
      past: past,
      reviewsLeft: reviewsLeft,
      mocksLeft: mocksLeft,
      casesLeft: casesLeft,
      stepsLeft: stepsLeft,
      workUnits: work,
      needPerDay: needPerDay,
      goal: input.goal || 0,
      onTrack: past ? false : needPerDay <= (input.goal || 0),
    };
  }

  var Readiness = {
    WEIGHTS: WEIGHTS,
    CAPS: CAPS,
    VERDICTS: VERDICTS,
    MIN_CASES: MIN_CASES,
    WEAK_CRITICAL: WEAK_CRITICAL,
    TOPIC_COVERED: TOPIC_COVERED,
    MIN_TOPIC_COVERAGE: MIN_TOPIC_COVERAGE,
    ACTION_COST: ACTION_COST,
    compute: compute,
    examPlan: examPlan,
    verdictFor: verdictFor,
    shiftDay: shiftDay,
  };

  global.Readiness = Readiness;
  if (typeof module !== "undefined" && module.exports) module.exports = Readiness;
})(typeof window !== "undefined" ? window : globalThis);
