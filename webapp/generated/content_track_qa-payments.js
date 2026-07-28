// ===========================================================================
// СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ РЕДАКТИРОВАТЬ РУКАМИ.
// Источник правды: data/*.json. Пересобрать:  python tools/build_webapp_data.py
// CI падает, если этот файл отстал от data/.
// ===========================================================================
(function (global) {
  "use strict";
  var DATA =
{
 "cases":[],
 "glossary":[],
 "lessons":[],
 "mockQuestions":[],
 "questions":[],
 "questionsByTopic":{},
 "roadmap":[],
 "stories":[],
 "termsByTopic":{},
 "topics":[],
 "vacancies":[]
};
  var C = global.CONTENT || (global.CONTENT = {});
  Object.keys(DATA).forEach(function (k) { C[k] = DATA[k]; });
  C.trackLoaded = "qa-payments";
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})(typeof window !== "undefined" ? window : globalThis);
