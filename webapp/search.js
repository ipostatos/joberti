// ===========================================================================
// SEARCH — единый поиск по урокам, терминам, библиотеке, вопросам и кейсам.
//
// Требования: понимать русское название, английский термин, синонимы (aliases)
// и частичное совпадение. Никаких внешних библиотек — индекс строится один раз
// из CONTENT и живёт в памяти страницы.
//
// Ранжирование простое и предсказуемое: точное совпадение выше, чем совпадение
// в начале слова, а оно выше, чем вхождение в середине. Совпадение в заголовке
// весит больше, чем в теле. Пользователю важнее понятный порядок, чем
// «умная» релевантность, которую невозможно объяснить.
// ===========================================================================
(function (global) {
  "use strict";

  var TYPE_META = {
    lesson: { title: "Урок", icon: "book-open", href: "lesson.html?id=" },
    term: { title: "Термин", icon: "file-text", href: "glossary.html?id=" },
    library: { title: "Материал", icon: "library", href: "library.html?id=" },
    question: { title: "Вопрос", icon: "clipboard-list", href: "quiz.html?id=" },
    mock: { title: "Mock", icon: "message-square", href: "mock.html?id=" },
    "case": { title: "Кейс", icon: "briefcase", href: "cases.html?id=" },
    step: { title: "Шаг плана", icon: "map", href: "roadmap.html?id=" },
    phrase: { title: "Фраза", icon: "message-square", href: "english.html?tab=phrases&id=" },
    eword: { title: "Слово", icon: "globe", href: "english.html?tab=words&id=" },
    edrill: { title: "Ответ вслух", icon: "mic", href: "english.html?tab=drills&id=" },
    ewriting: { title: "Письмо", icon: "file-text", href: "english.html?tab=writing&id=" },
  };

  // Нормализация: регистр, ё→е (пользователи печатают и так, и так),
  // пунктуация в пробелы.
  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[«»"'`.,;:!?()[\]{}—–\-/\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildIndex(content, trackId) {
    var idx = [];

    function add(type, id, title, subtitle, keys, body, topicId) {
      idx.push({
        type: type,
        id: id,
        title: title,
        subtitle: subtitle || "",
        topicId: topicId || null,
        // ключи — то, по чему ищем в первую очередь (название, синонимы)
        keys: keys.filter(Boolean).map(norm),
        // тело — вспомогательный текст, совпадение в нём весит меньше
        body: norm(body || ""),
      });
    }

    var inTrack = function (x) { return !trackId || x.track_id === trackId; };

    (content.lessons || []).filter(inTrack).forEach(function (l) {
      add("lesson", l.id, l.title, l.summary, [l.title],
        [l.summary, l.why_it_matters, (l.key_points || []).join(" "),
         l.interview_question, l.short_answer].join(" "), l.topic_id);
    });

    (content.glossary || []).forEach(function (t) {
      if (trackId && t.track_ids && t.track_ids.indexOf(trackId) === -1) return;
      add("term", t.id, t.term, t.category,
        [t.term].concat(t.aliases || []),
        [t.definition_simple, t.definition_interview, t.example, t.common_confusion].join(" "),
        (t.topic_ids || [])[0]);
    });

    (content.library || []).forEach(function (r) {
      add("library", r.id, r.title, r.publisher, [r.title, r.publisher],
        [r.why_read, r.type].join(" "), (r.topic_ids || [])[0]);
    });

    (content.questions || []).filter(inTrack).forEach(function (q) {
      add("question", q.id, q.question, "", [q.question],
        [q.explanation, (q.options || []).join(" ")].join(" "), q.topic);
    });

    (content.mockQuestions || []).filter(inTrack).forEach(function (m) {
      add("mock", m.id, m.question, m.category, [m.question],
        [m.intent, (m.expected_points || []).join(" "), m.model_answer_short].join(" "),
        (m.topic_ids || [])[0]);
    });

    (content.cases || []).filter(inTrack).forEach(function (x) {
      add("case", x.id, x.title, "Практический кейс", [x.title],
        [x.scenario, (x.must_mention || []).join(" ")].join(" "),
        (x.topic_ids || [])[0]);
    });

    (content.roadmap || []).filter(inTrack).forEach(function (s) {
      add("step", s.id, s.title, "Шаг " + s.order, [s.title],
        s.goal, (s.topic_ids || [])[0]);
    });

    // Английский сквозной: пустой track_ids значит «во всех треках», поэтому
    // фильтр здесь не такой, как у остального контента.
    var inEnglish = function (x) {
      return !trackId || !x.track_ids || !x.track_ids.length ||
        x.track_ids.indexOf(trackId) !== -1;
    };

    (content.englishPhrases || []).filter(inEnglish).forEach(function (p) {
      add("phrase", p.id, p.en, p.ru, [p.en].concat(p.variants || []),
        [p.ru, p.when, p.note, p.category].join(" "));
    });

    (content.englishVocab || []).filter(inEnglish).forEach(function (w) {
      add("eword", w.id, w.term, w.meaning, [w.term, w.ru_hint],
        [w.meaning, w.wrong, w.example_en, w.example_ru, w.category].join(" "));
    });

    (content.englishDrills || []).filter(inEnglish).forEach(function (d) {
      add("edrill", d.id, d.prompt_en, d.prompt_ru, [d.prompt_en, d.prompt_ru],
        [d.hint, (d.keywords || []).join(" "), d.model_answer_en].join(" "));
    });

    (content.englishWriting || []).filter(inEnglish).forEach(function (s) {
      add("ewriting", s.id, s.title, s.category, [s.title],
        [s.en, s.ru, s.note].join(" "));
    });

    return idx;
  }

  // Оценка совпадения одной записи. Возвращает 0, если не совпало.
  function scoreEntry(entry, q) {
    var best = 0;
    for (var i = 0; i < entry.keys.length; i++) {
      var k = entry.keys[i];
      if (!k) continue;
      if (k === q) { best = Math.max(best, 100); continue; }
      if (k.indexOf(q) === 0) { best = Math.max(best, 80); continue; }
      // совпадение с началом любого слова ключа
      if ((" " + k).indexOf(" " + q) !== -1) { best = Math.max(best, 65); continue; }
      if (k.indexOf(q) !== -1) { best = Math.max(best, 50); }
    }
    if (!best && entry.body) {
      if ((" " + entry.body).indexOf(" " + q) !== -1) best = 25;
      else if (entry.body.indexOf(q) !== -1) best = 15;
    }
    return best;
  }

  var Search = {
    TYPE_META: TYPE_META,
    norm: norm,
    buildIndex: buildIndex,

    // Все слова запроса должны найтись — иначе «gsc отчёт» выдавал бы всё
    // подряд по слову «отчёт».
    query: function (index, text, opts) {
      var options = opts || {};
      var raw = norm(text);
      if (raw.length < 2) return [];
      var words = raw.split(" ").filter(function (w) { return w.length >= 2; });
      if (!words.length) return [];

      var out = [];
      for (var i = 0; i < index.length; i++) {
        var e = index[i];
        if (options.types && options.types.indexOf(e.type) === -1) continue;
        var total = 0, ok = true;
        for (var w = 0; w < words.length; w++) {
          var s = scoreEntry(e, words[w]);
          if (!s) { ok = false; break; }
          total += s;
        }
        if (!ok) continue;
        out.push({ entry: e, score: total / words.length });
      }

      out.sort(function (a, b) {
        return b.score - a.score
          || a.entry.title.length - b.entry.title.length
          || a.entry.title.localeCompare(b.entry.title);
      });
      return out.slice(0, options.limit || 40).map(function (r) {
        return { score: Math.round(r.score), entry: r.entry };
      });
    },

    hrefFor: function (entry) {
      var meta = TYPE_META[entry.type];
      return meta ? meta.href + encodeURIComponent(entry.id) : "#";
    },
  };

  global.Search = Search;
  if (typeof module !== "undefined" && module.exports) module.exports = Search;
})(typeof window !== "undefined" ? window : globalThis);
