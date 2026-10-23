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
//   критическая тема ниже 50%        → максимум 69
//   охвачено меньше 60% обязательных тем → максимум 64
//
// У трека может быть собственный ПРОФИЛЬ расчёта (READINESS_PROFILES). Сейчас
// он есть у devops-platform: там к блокам добавлены лабораторные и DutyOps
// drills, а ограничители требуют диагностику, практику по core-доменам и
// разбор инцидентов. Треки без своего профиля считаются ровно как раньше —
// это проверяет _readiness_legacy.mjs по эталону, снятому до введения профилей.
//
// Готовность ≠ покрытие требований вакансии. Покрытие (requirementCoverage)
// считается отдельно и только по доказательствам, которые человек внёс сам:
// учёба не превращается в коммерческий опыт.
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
  // Порог поднят с 0.40 до 0.50 вместе с расширением списка критических тем:
  // сорок процентов по критической теме — это «примерно половину не знаю»,
  // и пропускать такое состояние выше 69% было слишком мягко.
  var WEAK_CRITICAL = 0.50;          // критическая тема ниже — cap
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

  // ── профили расчёта ──────────────────────────────────────────────────────
  //
  // default — прежняя формула всех треков, БЕЗ изменений.
  // devops-platform — RedCore Junior DevOps / DutyOps: практика весит больше
  // знаний, потому что DevOps нельзя оценить только тестами.
  var DEVOPS_PROFILE = {
    id: "devops",
    weights: { knowledge: 25, mock: 15, cases: 20, glossary: 5, plan: 5, labs: 30 },
    caps: {
      noDiagnostic: 59,          // не пройдена диагностика
      fewLabs: 64,               // выполнено меньше MIN_LABS лабораторных
      lowTopicCoverage: 64,      // охвачено меньше 65% обязательных тем
      coreLabDomainMissing: 69,  // какой-то core-домен без единой выполненной лабораторной
      weakCriticalTopic: 69,     // критическая тема ниже 50%
      fewIncidents: 74,          // разобрано меньше 5 инцидентов (кейсы + drills)
      noFullMock: 79,            // нет полной сессии mock interview
    },
    minLabs: 6,
    minIncidents: 5,
    weakCritical: 0.50,
    topicCovered: 0.30,
    minTopicCoverage: 0.65,
    // Условные единицы работы для плана к дате: лабораторная дороже кейса.
    actionCost: { review: 1, mock: 3, "case": 8, lab: 10, step: 4, drill: 5 },
    blockTitles: { cases: "Инциденты и разбор сбоев", labs: "Лабораторные" },
  };

  var DEFAULT_PROFILE = {
    id: "default",
    weights: WEIGHTS,
    caps: CAPS,
    minCases: MIN_CASES,
    weakCritical: WEAK_CRITICAL,
    topicCovered: TOPIC_COVERED,
    minTopicCoverage: MIN_TOPIC_COVERAGE,
    actionCost: null,          // задаётся ниже как ACTION_COST
    blockTitles: {},
  };

  var READINESS_PROFILES = {
    "default": DEFAULT_PROFILE,
    "devops-platform": DEVOPS_PROFILE,
  };

  function profileFor(trackId) {
    return READINESS_PROFILES[trackId] || READINESS_PROFILES["default"];
  }

  // Уверенность в лабораторной. Отметка «готово» сама по себе даёт только
  // 40%: Mini App не может проверить внешнюю среду. Остальное — post-check и
  // повторное прохождение. Самооценка сюда не входит.
  var LAB_PRIORITY_WEIGHT = { core: 3, important: 2, optional: 0 };
  function labConfidence(st) {
    if (!st || !st.completed) return 0;
    var pc = typeof st.post_check_score === "number" ? clamp01(st.post_check_score) : 0;
    var repeat = (st.attempts || 0) >= 2 ? 0.2 : 0;
    return Math.min(1, 0.4 + 0.4 * pc + repeat);
  }

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

  // ── блоки профиля DevOps ─────────────────────────────────────────────────

  function trackOf(c, trackId) {
    return (c.tracks || []).filter(function (t) { return t.id === trackId; })[0] || null;
  }

  function labsBlock(input) {
    var c = input.content, trackId = input.trackId;
    var labs = (c.labs || []).filter(function (l) { return l.track_id === trackId; });
    var state = (input.profile && input.profile.labs) || {};
    var track = trackOf(c, trackId) || {};
    var coreDomains = (track.lab_domains || []).filter(function (d) { return d.core; });

    var sum = 0, total = 0, completed = 0, confirmed = 0, requiredTotal = 0;
    var doneByDomain = {};
    labs.forEach(function (l) {
      var st = state[l.id];
      var conf = labConfidence(st);
      if (st && st.completed) {
        completed++;
        doneByDomain[l.lab_domain] = true;
        if (typeof st.post_check_score === "number" && st.post_check_score >= 0.67) confirmed++;
      }
      // Необязательные лабораторные не входят в знаменатель: базовая
      // готовность не требует всего списка и тем более платного облака.
      var w = LAB_PRIORITY_WEIGHT[l.priority] || 0;
      if (w) { sum += w * conf; total += w; requiredTotal++; }
    });
    var weighted = total ? sum / total : 0;
    var domainRows = coreDomains.map(function (d) {
      return { id: d.id, title: d.title, done: !!doneByDomain[d.id] };
    });
    var closedDomains = domainRows.filter(function (d) { return d.done; }).length;
    var domainShare = coreDomains.length ? closedDomains / coreDomains.length : 0;
    var score = labs.length ? clamp01(0.75 * weighted + 0.25 * domainShare) : 0;

    return {
      score: score,
      detail: {
        completed: completed,
        confirmed: confirmed,
        total: labs.length,
        requiredTotal: requiredTotal,
        confidence: weighted,
        coreDomains: domainRows,
        coreDomainsClosed: closedDomains,
        missingDomains: domainRows.filter(function (d) { return !d.done; }),
      },
    };
  }

  // Кейсы плюс DutyOps drills: оба тренируют разбор сбоя, а не знание фактов.
  function drillQuality(st) {
    if (!st || typeof st.best !== "number") return null;
    var q = clamp01(st.best / 100);
    return (st.attempts || 0) >= 2 ? q : q * 0.85;      // повтор — подтверждение
  }

  function incidentsBlock(input) {
    var cb = casesBlock(input);
    var c = input.content, trackId = input.trackId;
    var drills = (c.dutyopsDrills || []).filter(function (d) { return d.track_id === trackId; });
    var state = (input.profile && input.profile.drills) || {};
    var done = 0, qs = [];
    drills.forEach(function (d) {
      var q = drillQuality(state[d.id]);
      if (q != null) { done++; qs.push(q); }
    });
    var avg = qs.length ? qs.reduce(function (a, b) { return a + b; }, 0) / qs.length : 0;
    var drillScore = drills.length ? clamp01(0.4 * (done / drills.length) + 0.6 * avg) : 0;
    var score = drills.length ? clamp01(0.6 * cb.score + 0.4 * drillScore) : cb.score;
    var d = cb.detail;
    return {
      score: score,
      detail: {
        completed: d.completed,
        total: d.total,
        criticalDone: d.criticalDone,
        criticalTotal: d.criticalTotal,
        avgQuality: d.avgQuality,
        drillsDone: done,
        drillsTotal: drills.length,
        incidentsCompleted: d.completed + done,
        incidentsTotal: d.total + drills.length,
      },
    };
  }

  function computeDevops(input, track, ctx, P) {
    var kb = knowledgeBlock(ctx);
    var mb = mockBlock(ctx);
    var ib = incidentsBlock(ctx);
    var gb = glossaryBlock(ctx);
    var pb = planBlock(ctx);
    var lb = labsBlock(ctx);
    var W = P.weights;

    // Порядок первых пяти блоков совпадает с общим профилем: экраны берут
    // блок и по ключу, и по индексу.
    var blocks = [
      { key: "knowledge", title: "Знания и повторение", weight: W.knowledge, score: kb.score, detail: kb.detail },
      { key: "mock", title: "Mock interview", weight: W.mock, score: mb.score, detail: mb.detail },
      { key: "cases", title: P.blockTitles.cases, weight: W.cases, score: ib.score, detail: ib.detail },
      { key: "glossary", title: "Словарь", weight: W.glossary, score: gb.score, detail: gb.detail },
      { key: "plan", title: "План и регулярность", weight: W.plan, score: pb.score, detail: pb.detail },
      { key: "labs", title: P.blockTitles.labs, weight: W.labs, score: lb.score, detail: lb.detail },
    ];
    var raw = Math.round(blocks.reduce(function (a, b) { return a + b.weight * b.score; }, 0));

    var C = P.caps, caps = [];
    var diag = ctx.profile.diagnostic;
    if (!(diag && diag.ts)) {
      caps.push({ key: "noDiagnostic", max: C.noDiagnostic,
        reason: "Не пройдена диагностика уровня",
        action: "Пройти диагностику", href: "quiz.html?mode=diagnostic" });
    }
    if (lb.detail.completed < P.minLabs) {
      caps.push({ key: "fewLabs", max: C.fewLabs,
        reason: "Выполнено лабораторных: " + lb.detail.completed + " из минимальных " + P.minLabs,
        action: "Выполнить ещё " + (P.minLabs - lb.detail.completed) + " лабораторн." ,
        href: "labs.html" });
    }
    var requiredRows = kb.topics.filter(function (t) { return t.required && t.questions > 0; });
    var coveredRequired = requiredRows.filter(function (t) {
      return t.mastery != null && t.mastery >= P.topicCovered;
    }).length;
    var coverage = requiredRows.length ? coveredRequired / requiredRows.length : 0;
    if (coverage < P.minTopicCoverage) {
      caps.push({ key: "lowTopicCoverage", max: C.lowTopicCoverage,
        reason: "Охвачено " + Math.round(coverage * 100) + "% обязательных тем (нужно от " +
          Math.round(P.minTopicCoverage * 100) + "%)",
        action: "Начать разбор новых тем плана", href: "roadmap.html" });
    }
    if (lb.detail.missingDomains.length) {
      var miss = lb.detail.missingDomains;
      var firstLab = (ctx.content.labs || []).filter(function (l) {
        return l.track_id === ctx.trackId && l.lab_domain === miss[0].id && l.priority === "core";
      })[0];
      caps.push({ key: "coreLabDomainMissing", max: C.coreLabDomainMissing,
        reason: "Нет выполненной лабораторной в " +
          (miss.length === 1 ? "домене " : "доменах ") +
          miss.map(function (d) { return d.title; }).join(", "),
        action: firstLab ? "Лабораторная: " + firstLab.title : "Выполнить лабораторную",
        labId: firstLab ? firstLab.id : null,
        href: firstLab ? "labs.html?id=" + encodeURIComponent(firstLab.id) : "labs.html" });
    }
    var weakCritical = kb.topics.filter(function (t) {
      return t.critical && (t.mastery == null || t.mastery < P.weakCritical);
    });
    if (weakCritical.length) {
      caps.push({ key: "weakCriticalTopic", max: C.weakCriticalTopic,
        reason: "Критическая тема ниже " + Math.round(P.weakCritical * 100) + "%: " +
          weakCritical.map(function (t) { return t.title; }).join(", "),
        action: "Подтянуть тему «" + weakCritical[0].title + "»",
        topicId: weakCritical[0].id,
        href: "quiz.html?topic=" + encodeURIComponent(weakCritical[0].id) });
    }
    if (ib.detail.incidentsCompleted < P.minIncidents) {
      caps.push({ key: "fewIncidents", max: C.fewIncidents,
        reason: "Разобрано инцидентов (кейсы и drills): " + ib.detail.incidentsCompleted +
          " из " + P.minIncidents,
        action: "Разобрать ещё " + (P.minIncidents - ib.detail.incidentsCompleted) + " инцидент.",
        href: "labs.html?tab=drills" });
    }
    if (!ctx.fullMockSessions) {
      caps.push({ key: "noFullMock", max: C.noFullMock,
        reason: "Нет ни одной полной сессии mock interview",
        action: "Пройти полное mock interview", href: "mock.html?mode=full" });
    }

    var capMax = caps.reduce(function (m, x) { return Math.min(m, x.max); }, 100);
    var percent = Math.min(raw, capMax);
    var appliedCap = caps.filter(function (x) { return x.max === capMax; })[0] || null;
    if (appliedCap && raw <= capMax) appliedCap = null;

    var gaps = [];
    caps.slice().sort(function (a, b) { return a.max - b.max; }).forEach(function (x) {
      gaps.push({ kind: "cap", title: x.reason, action: x.action, topicId: x.topicId || null,
        href: x.href || null });
    });
    kb.topics.forEach(function (t) {
      if (t.questions > 0 && t.mastery != null && t.mastery < 0.5) {
        gaps.push({ kind: "topic", title: "Тема «" + t.title + "» — " + t.pct + "%",
          action: "Пройти тест по теме", topicId: t.id,
          href: "quiz.html?topic=" + encodeURIComponent(t.id) });
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
      profile: P.id,
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

    var P = profileFor(trackId);
    if (P !== DEFAULT_PROFILE) return computeDevops(input, track, ctx, P);

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

  // ── готовность к ВАКАНСИИ ────────────────────────────────────────────────
  //
  // Второй процент, отвечающий на другой вопрос. Готовность к профессии
  // (compute выше) говорит «знаю ли я предмет». Готовность к вакансии говорит
  // «готов ли я к ЭТОЙ вакансии»: закрыты ли её обязательные требования, есть
  // ли чем их подтвердить, отработаны ли инструменты, добран ли обязательный
  // язык, отрепетированы ли ответы и собраны ли истории.
  //
  // Знание входит сюда одним блоком из двадцати баллов, а не подменяет собой
  // весь расчёт: человек может знать предмет и не иметь ни одного
  // доказательства — и это ровно тот разрыв, который должен быть виден.
  //
  // Английский НЕ входит в расчёт готовности к профессии и не может поднять
  // её ни на балл. Здесь он и блок, и ограничитель: невыполненное
  // обязательное требование вакансии по языку обязано быть видно.

  var VACANCY_WEIGHTS = {
    knowledge: 20,
    requirements: 25,
    evidence: 15,
    tools: 10,
    english: 10,
    mock: 10,
    stories: 10,
  };

  var VACANCY_CAPS = {
    requiredNotStarted: 80,   // хотя бы одно обязательное требование не начато
    noFullMock: 79,           // нет ни одной полной сессии mock interview
    projectsNotDone: 79,      // обязательная практика не сдана
    englishNotMet: 74,        // обязательное языковое требование не закрыто
  };

  var STORIES_TARGET = 5;         // историй STAR, закрывающих типовые вопросы
  var LOW_EVIDENCE = 0.5;         // ниже этой доли доказательств — предупреждение

  var CLOSED = { confirmed: true, partial: true };

  function shareOf(list, predicate) {
    if (!list.length) return null;
    var n = 0;
    for (var i = 0; i < list.length; i++) if (predicate(list[i])) n++;
    return n / list.length;
  }

  // Практика английского: три оси одинакового веса. Ни одна не обязательна —
  // человек мог подтвердить язык работой, а не тренажёром, — поэтому пустой
  // раздел просто не участвует, а не обнуляет блок.
  function englishPractice(stats) {
    if (!stats) return 0;
    var parts = [];
    if (stats.drills) parts.push(clamp01((stats.drillsDone || 0) / stats.drills));
    if (stats.writingTasks) parts.push(clamp01((stats.writingPassed || 0) / stats.writingTasks));
    if (stats.words) parts.push(clamp01((stats.wordsProdLearned || 0) / stats.words));
    if (!parts.length) return 0;
    var sum = 0;
    for (var i = 0; i < parts.length; i++) sum += parts[i];
    return sum / parts.length;
  }

  function computeVacancy(input) {
    var c = input.content;
    var trackId = input.trackId;
    var track = (c.tracks || []).filter(function (t) { return t.id === trackId; })[0];
    var vacancy = null;
    if (track && track.vacancy_id) {
      vacancy = (c.vacancies || []).filter(function (v) {
        return v.id === track.vacancy_id;
      })[0] || null;
    }

    if (!track || track.status !== "active" || !vacancy) {
      return {
        available: false,
        reason: vacancy ? "Трек ещё не наполнен" : "Для трека не описана вакансия",
        percent: null, verdict: null, blocks: [], caps: [], gaps: [],
      };
    }

    // Состояние требований приходит слитым снаружи: readiness.js не читает
    // хранилище. Если его не передали — считаем по данным вакансии как есть.
    var states = input.requirements;
    if (!states || !states.length) {
      states = (vacancy.requirements || []).map(function (r) {
        return {
          id: r.id, importance: r.importance, competency: r.competency || null,
          status: r.status || "not_started", evidence: r.evidence || "",
        };
      });
    }

    var counted = states.filter(function (r) {
      // «Не применимо» человек ставит осознанно, и держать этим требованием
      // процент внизу значило бы спорить с его решением.
      return r.status !== "not_applicable";
    });
    var required = counted.filter(function (r) { return r.importance === "required"; });
    var tools = counted.filter(function (r) { return r.competency === "tools"; });

    function closed(r) { return !!CLOSED[r.status]; }
    function evidenced(r) { return !!String(r.evidence || "").trim(); }

    var reqShare = shareOf(required, closed);
    var evidenceShare = shareOf(required, evidenced);
    var toolsShare = shareOf(tools, closed);

    // Язык: обязательное требование вакансии плюс фактическая практика.
    var langs = input.languageRequirements || vacancy.language_requirements || [];
    var mandatoryLang = langs.filter(function (l) {
      return l.importance === "required";
    });
    var byId = {};
    states.forEach(function (r) { byId[r.id] = r; });
    var langMet = mandatoryLang.length
      ? mandatoryLang.every(function (l) {
          var r = byId[l.requirement_id];
          return !!(r && CLOSED[r.status]);
        })
      : true;
    var practice = englishPractice(input.english);
    var englishScore = mandatoryLang.length
      ? clamp01(0.6 * (langMet ? 1 : 0) + 0.4 * practice)
      : practice;

    var skill = compute(input);
    var mb = mockBlock({
      content: c, trackId: trackId,
      profile: input.profile || {},
      fullMockSessions: input.fullMockSessions || 0,
    });

    var storiesFilled = input.storiesFilled || 0;
    var storiesScore = clamp01(storiesFilled / STORIES_TARGET);

    var blocks = [
      { key: "knowledge", title: "Знание предмета", weight: VACANCY_WEIGHTS.knowledge,
        score: skill.available ? skill.percent / 100 : 0,
        detail: { percent: skill.available ? skill.percent : null } },
      { key: "requirements", title: "Обязательные требования", weight: VACANCY_WEIGHTS.requirements,
        score: reqShare == null ? 0 : reqShare,
        detail: { closed: required.filter(closed).length, total: required.length } },
      { key: "evidence", title: "Доказательства", weight: VACANCY_WEIGHTS.evidence,
        score: evidenceShare == null ? 0 : evidenceShare,
        detail: { evidenced: required.filter(evidenced).length, total: required.length } },
      { key: "tools", title: "Инструменты", weight: VACANCY_WEIGHTS.tools,
        score: toolsShare == null ? 0 : toolsShare,
        detail: { closed: tools.filter(closed).length, total: tools.length } },
      { key: "english", title: "Английский", weight: VACANCY_WEIGHTS.english,
        score: englishScore,
        detail: { required: mandatoryLang.length > 0, met: langMet, practice: practice } },
      { key: "mock", title: "Mock interview", weight: VACANCY_WEIGHTS.mock,
        score: mb.score, detail: mb.detail },
      { key: "stories", title: "Истории STAR", weight: VACANCY_WEIGHTS.stories,
        score: storiesScore, detail: { filled: storiesFilled, target: STORIES_TARGET } },
    ];

    var raw = Math.round(blocks.reduce(function (a, b) {
      return a + b.weight * b.score;
    }, 0));

    var caps = [];
    var notStarted = required.filter(function (r) { return r.status === "not_started"; });
    if (notStarted.length) {
      caps.push({ key: "requiredNotStarted", max: VACANCY_CAPS.requiredNotStarted,
        reason: "Обязательных требований не начато: " + notStarted.length,
        action: "Разобрать требования вакансии и проставить статус" });
    }
    if (!input.fullMockSessions) {
      caps.push({ key: "noFullMock", max: VACANCY_CAPS.noFullMock,
        reason: "Нет ни одной полной сессии mock interview",
        action: "Пройти полное mock interview" });
    }
    // Практика руками не заменяется ни тестами, ни моком: «я читал про
    // Screaming Frog» и «я краулил сайт и делал аудит» — разные ответы, и
    // разницу на собеседовании слышно сразу.
    var requiredProjects = (input.projects || []).filter(function (p) {
      return p.required;
    });
    var projectsLeft = requiredProjects.filter(function (p) { return !p.done; });
    if (requiredProjects.length && projectsLeft.length) {
      caps.push({ key: "projectsNotDone", max: VACANCY_CAPS.projectsNotDone,
        reason: "Обязательная практика не сдана: " + projectsLeft.length +
          " из " + requiredProjects.length,
        action: "Сделать проект и описать доказательство" });
    }
    if (mandatoryLang.length && !langMet) {
      caps.push({ key: "englishNotMet", max: VACANCY_CAPS.englishNotMet,
        reason: "Обязательное требование по английскому не закрыто",
        action: "Подтвердить уровень языка и описать, чем он подтверждается" });
    }

    var capMax = caps.reduce(function (m, x) { return Math.min(m, x.max); }, 100);
    var percent = Math.min(raw, capMax);
    var appliedCap = caps.filter(function (x) { return x.max === capMax; })[0] || null;
    if (appliedCap && raw <= capMax) appliedCap = null;

    var gaps = caps.map(function (x) {
      return { kind: "cap", title: x.reason, action: x.action };
    });
    // Массовое отсутствие доказательств — предупреждение, а не потолок:
    // знание без портфолио бывает честным состоянием, и наказывать за него
    // процентом неправильно. Но не сказать об этом нельзя.
    if (evidenceShare != null && evidenceShare < LOW_EVIDENCE) {
      gaps.push({
        kind: "warning",
        title: "У большинства обязательных требований нет доказательства",
        action: "Описать, чем подтверждается каждое требование",
      });
    }

    return {
      available: true,
      percent: percent,
      rawPercent: raw,
      verdict: verdictFor(percent),
      blocks: blocks,
      caps: caps,
      appliedCap: appliedCap,
      capMax: capMax,
      requiredTotal: required.length,
      requiredClosed: required.filter(closed).length,
      projectsTotal: requiredProjects.length,
      projectsDone: requiredProjects.length - projectsLeft.length,
      evidenceShare: evidenceShare,
      englishRequired: mandatoryLang.length > 0,
      englishMet: langMet,
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
  DEFAULT_PROFILE.actionCost = ACTION_COST;

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

    // Профиль DevOps добавляет лабораторные и drills со своей ценой. Для
    // треков без профиля эта ветка не выполняется — их расчёт не меняется.
    var P = profileFor(trackId);
    var labsLeft = 0, drillsLeft = 0;
    if (P !== DEFAULT_PROFILE) {
      var cost = P.actionCost;
      var labState = profile.labs || {};
      labsLeft = (c.labs || []).filter(function (l) {
        return l.track_id === trackId && l.priority !== "optional" &&
          !(labState[l.id] && labState[l.id].completed);
      }).length;
      var drillState = profile.drills || {};
      drillsLeft = (c.dutyopsDrills || []).filter(function (d) {
        return d.track_id === trackId && !(drillState[d.id] && typeof drillState[d.id].best === "number");
      }).length;
      work = reviewsLeft * cost.review + mocksLeft * cost.mock + casesLeft * cost["case"] +
        stepsLeft * cost.step + labsLeft * cost.lab + drillsLeft * cost.drill;
    }

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
      labsLeft: labsLeft,
      drillsLeft: drillsLeft,
      workUnits: work,
      needPerDay: needPerDay,
      goal: input.goal || 0,
      onTrack: past ? false : needPerDay <= (input.goal || 0),
    };
  }

  // ── покрытие требований вакансии ─────────────────────────────────────────
  //
  // Это НЕ вероятность найма и НЕ готовность. Учитывается только то, что
  // человек подтвердил сам: статус «подтверждено» или «частично» без описания
  // доказательства не засчитывается. Требование вида experience (например,
  // «2+ года администрирования») учёбой не закрывается вовсе.
  var REQ_WEIGHT = { required: 3, desirable: 2, nice_to_have: 1 };
  var REQ_VALUE = {
    confirmed: 1, partial: 0.55, learning: 0.25, not_started: 0,
    unverified_experience: 0, not_applicable: 0,
  };

  function effectiveRequirement(req, st) {
    var status = (st && st.status) || req.status || "not_started";
    var evidence = String((st && st.evidence !== undefined ? st.evidence : req.evidence) || "").trim();
    var claimedWithoutEvidence = (status === "confirmed" || status === "partial") && !evidence;
    var eff = status;
    if (claimedWithoutEvidence) eff = req.kind === "experience" ? "unverified_experience" : "learning";
    if (req.kind === "experience" && (eff === "learning" || eff === "not_applicable")) {
      eff = "unverified_experience";
    }
    if (!(eff in REQ_VALUE)) eff = "not_started";
    return { status: status, effective: eff, evidence: evidence,
      claimedWithoutEvidence: claimedWithoutEvidence };
  }

  // input: { vacancy, requirements (profile.requirements), topics (строки из
  //          compute().topics), labs (контент), labState (profile.labs) }
  function requirementCoverage(input) {
    var v = input.vacancy;
    if (!v || !(v.requirements || []).length) return null;
    var states = input.requirements || {};
    var topicPct = {};
    (input.topics || []).forEach(function (t) { topicPct[t.id] = t.mastery; });
    var labState = input.labState || {};
    var labsById = {};
    (input.labs || []).forEach(function (l) { labsById[l.id] = l; });

    var num = 0, den = 0, unconfirmedRequired = 0, hardGaps = 0, requiredTotal = 0;
    var rows = (v.requirements || []).map(function (r) {
      var e = effectiveRequirement(r, states[r.id]);
      var w = REQ_WEIGHT[r.importance] || 1;
      var val = REQ_VALUE[e.effective];
      num += w * val; den += w;
      if (r.importance === "required") {
        requiredTotal++;
        if (e.effective !== "confirmed") unconfirmedRequired++;
      }
      var experienceGap = r.kind === "experience" &&
        e.effective !== "confirmed" && e.effective !== "partial";
      if (experienceGap) hardGaps++;
      // Учебное покрытие — отдельная справочная колонка. В процент не входит.
      var ms = (r.topic_ids || []).map(function (t) { return topicPct[t]; })
        .filter(function (m) { return typeof m === "number"; });
      var labIds = (r.lab_ids || []).filter(function (id) { return labsById[id]; });
      var labsDone = labIds.filter(function (id) { return labState[id] && labState[id].completed; }).length;
      return {
        id: r.id, requirement: r.requirement, importance: r.importance, kind: r.kind || "skill",
        status: e.status, effective: e.effective, value: val, weight: w,
        evidence: e.evidence, evidenceHint: r.evidence_hint || "",
        claimedWithoutEvidence: e.claimedWithoutEvidence,
        learningPct: ms.length ? Math.round(ms.reduce(function (a, b) { return a + b; }, 0) / ms.length * 100) : null,
        labsDone: labsDone, labsTotal: labIds.length,
        experienceGap: experienceGap,
        nextAction: r.next_action || "",
      };
    });
    return {
      percent: den ? Math.round(num / den * 100) : 0,
      requiredTotal: requiredTotal,
      unconfirmedRequired: unconfirmedRequired,
      hardGaps: hardGaps,
      rows: rows,
    };
  }

  // ── матрица навыков ──────────────────────────────────────────────────────
  // Колонки НЕ сводятся в одну оценку: цель, доказательство, учебная
  // освоенность, лабораторные и интервью — разные оси.
  var EFFECTIVE_RANK = ["not_started", "not_applicable", "unverified_experience", "learning", "partial", "confirmed"];

  function skillMatrix(input) {
    var v = input.vacancy;
    if (!v || !(v.skill_matrix || []).length) return [];
    var cov = input.coverage || { rows: [] };
    var byDomain = {};
    (v.requirements || []).forEach(function (r) {
      if (r.domain_id) (byDomain[r.domain_id] = byDomain[r.domain_id] || []).push(r.id);
    });
    var rowById = {};
    cov.rows.forEach(function (r) { rowById[r.id] = r; });
    var topicM = {};
    (input.topics || []).forEach(function (t) { topicM[t.id] = t.mastery; });
    var labs = (input.labs || []).filter(function (l) { return l.track_id === input.trackId; });
    var labState = input.labState || {};
    var mocks = (input.mocks || []).filter(function (m) { return m.track_id === input.trackId; });
    var mockState = input.mockState || {};

    return v.skill_matrix.map(function (d) {
      var topics = d.topic_ids || [];
      var inDomain = function (ids) {
        return (ids || []).some(function (t) { return topics.indexOf(t) !== -1; });
      };
      var best = null;
      (byDomain[d.id] || []).forEach(function (rid) {
        var r = rowById[rid];
        if (!r) return;
        if (best === null || EFFECTIVE_RANK.indexOf(r.effective) > EFFECTIVE_RANK.indexOf(best)) best = r.effective;
      });
      var ms = topics.map(function (t) { return topicM[t]; })
        .filter(function (m) { return typeof m === "number"; });
      var dl = labs.filter(function (l) { return inDomain(l.topic_ids); });
      var labsDone = dl.filter(function (l) { return labState[l.id] && labState[l.id].completed; }).length;
      var qs = [];
      mocks.filter(function (m) { return inDomain(m.topic_ids); }).forEach(function (m) {
        var q = ratedQuality(mockState[m.id]);
        if (q != null) qs.push(q);
      });
      return {
        id: d.id, title: d.title, priority: d.priority, target: d.target,
        evidence: best,
        learningPct: ms.length ? Math.round(ms.reduce(function (a, b) { return a + b; }, 0) / ms.length * 100) : null,
        labsDone: labsDone, labsTotal: dl.length,
        interviewPct: qs.length ? Math.round(qs.reduce(function (a, b) { return a + b; }, 0) / qs.length * 100) : null,
      };
    });
  }

  // ── диагностика ──────────────────────────────────────────────────────────
  // Детерминированный выбор: одинаковый seed — одинаковый набор вопросов.
  function lcg(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }

  function diagnosticSelect(content, trackId, seed) {
    var track = trackOf(content, trackId);
    if (!track || !track.diagnostic) return [];
    var cfg = track.diagnostic;
    var v = (content.vacancies || []).filter(function (x) { return x.id === track.vacancy_id; })[0];
    var domains = (v && v.skill_matrix) || [];
    var qs = (content.questions || []).filter(function (q) { return q.track_id === trackId; });
    var rnd = lcg(seed);
    var picked = {}, out = [];
    function take(pool, n) {
      pool = pool.filter(function (q) { return !picked[q.id]; });
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      // Смесь сложности: сначала по одному каждого уровня, затем остальное.
      pool.sort(function (a, b) { return (a.difficulty || 1) - (b.difficulty || 1); });
      var byLevel = {};
      pool.forEach(function (q) { (byLevel[q.difficulty || 1] = byLevel[q.difficulty || 1] || []).push(q); });
      var order = [];
      var levels = Object.keys(byLevel).sort();
      while (order.length < pool.length) {
        levels.forEach(function (lv) { if (byLevel[lv].length) order.push(byLevel[lv].shift()); });
      }
      order.slice(0, n).forEach(function (q) { picked[q.id] = true; out.push(q.id); });
    }
    var per = Math.max(1, Math.floor(cfg.question_count / Math.max(1, domains.length)));
    domains.forEach(function (d) {
      take(qs.filter(function (q) { return (d.topic_ids || []).indexOf(q.topic) !== -1; }), per);
    });
    // Добор до question_count: в первую очередь P0-домены.
    var p0 = {};
    domains.forEach(function (d) { if (d.priority === "P0") (d.topic_ids || []).forEach(function (t) { p0[t] = 1; }); });
    if (out.length < cfg.question_count) take(qs.filter(function (q) { return p0[q.topic]; }), cfg.question_count - out.length);
    if (out.length < cfg.question_count) take(qs, cfg.question_count - out.length);
    // Сценарии разбора сбоя — отдельной порцией.
    take(qs.filter(function (q) { return q.kind === "scenario"; }), cfg.scenario_count || 0);
    return out;
  }

  // answers: [{ id, topic, correct }]. Самооценка не участвует.
  function diagnosticReport(input) {
    var c = input.content, trackId = input.trackId;
    var track = trackOf(c, trackId);
    var v = track && (c.vacancies || []).filter(function (x) { return x.id === track.vacancy_id; })[0];
    var domains = (v && v.skill_matrix) || [];
    var answers = input.answers || [];
    var rows = domains.map(function (d) {
      var a = answers.filter(function (x) { return (d.topic_ids || []).indexOf(x.topic) !== -1; });
      var ok = a.filter(function (x) { return x.correct; }).length;
      return {
        id: d.id, title: d.title, priority: d.priority, target: d.target,
        lab_domain: d.lab_domain, topic_ids: d.topic_ids || [],
        asked: a.length, correct: ok,
        pct: a.length ? Math.round(ok / a.length * 100) : null,
      };
    }).filter(function (r) { return r.asked > 0; });
    var strong = rows.filter(function (r) { return r.pct >= 75; });
    var weak = rows.filter(function (r) { return r.pct < 50; });
    var critical = weak.filter(function (r) { return r.priority === "P0"; });
    var PR = { P0: 0, P1: 1, P2: 2 };
    var focus = rows.filter(function (r) { return r.pct < 75; }).sort(function (a, b) {
      return (PR[a.priority] - PR[b.priority]) || (a.pct - b.pct);
    });

    var labState = input.labState || {};
    var labs = (c.labs || []).filter(function (l) { return l.track_id === trackId; });
    var lessons = (c.lessons || []).filter(function (l) { return l.track_id === trackId; });
    var actions = [];
    focus.forEach(function (r) {
      if (actions.length >= 5) return;
      var lab = labs.filter(function (l) {
        return (l.topic_ids || []).some(function (t) { return r.topic_ids.indexOf(t) !== -1; }) &&
          l.priority !== "optional" && !(labState[l.id] && labState[l.id].completed);
      }).sort(function (a, b) { return (a.priority === "core" ? 0 : 1) - (b.priority === "core" ? 0 : 1); })[0];
      var lesson = lessons.filter(function (l) { return r.topic_ids.indexOf(l.topic_id) !== -1; })[0];
      if (lesson) actions.push({ kind: "lesson", domain: r.id, title: "Урок: " + lesson.title,
        href: "lesson.html?id=" + encodeURIComponent(lesson.id) });
      if (lab && actions.length < 5) actions.push({ kind: "lab", domain: r.id, title: "Лабораторная: " + lab.title,
        href: "labs.html?id=" + encodeURIComponent(lab.id) });
    });

    // Быстрый путь: шаги плана, чьи темы целиком в сильных доменах, можно
    // проходить ускоренно — сразу тест и лабораторная. Остальные — по порядку.
    var strongTopics = {};
    strong.forEach(function (r) { r.topic_ids.forEach(function (t) { strongTopics[t] = 1; }); });
    var steps = (c.roadmap || []).filter(function (s) { return s.track_id === trackId; })
      .sort(function (a, b) { return a.order - b.order; });
    var fast = steps.filter(function (s) {
      return (s.topic_ids || []).length && s.topic_ids.every(function (t) { return strongTopics[t]; });
    }).map(function (s) { return s.id; });

    var total = answers.length;
    var correct = answers.filter(function (a) { return a.correct; }).length;
    return {
      total: total, correct: correct, pct: total ? Math.round(correct / total * 100) : 0,
      domains: rows, strong: strong, weak: weak, critical: critical,
      nextActions: actions.slice(0, 5), fastSteps: fast,
    };
  }

  var Readiness = {
    WEIGHTS: WEIGHTS,
    CAPS: CAPS,
    VACANCY_WEIGHTS: VACANCY_WEIGHTS,
    VACANCY_CAPS: VACANCY_CAPS,
    STORIES_TARGET: STORIES_TARGET,
    VERDICTS: VERDICTS,
    MIN_CASES: MIN_CASES,
    WEAK_CRITICAL: WEAK_CRITICAL,
    TOPIC_COVERED: TOPIC_COVERED,
    MIN_TOPIC_COVERAGE: MIN_TOPIC_COVERAGE,
    ACTION_COST: ACTION_COST,
    READINESS_PROFILES: READINESS_PROFILES,
    profileFor: profileFor,
    labConfidence: labConfidence,
    requirementCoverage: requirementCoverage,
    effectiveRequirement: effectiveRequirement,
    skillMatrix: skillMatrix,
    diagnosticSelect: diagnosticSelect,
    diagnosticReport: diagnosticReport,
    REQ_WEIGHT: REQ_WEIGHT,
    REQ_VALUE: REQ_VALUE,
    compute: compute,
    computeVacancy: computeVacancy,
    examPlan: examPlan,
    verdictFor: verdictFor,
    shiftDay: shiftDay,
  };

  global.Readiness = Readiness;
  if (typeof module !== "undefined" && module.exports) module.exports = Readiness;
})(typeof window !== "undefined" ? window : globalThis);
