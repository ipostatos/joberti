// ===========================================================================
// Writing — объективная проверка письменного задания.
//
// Зачем: раздел «Письмо» до этого умел только показать заготовку и дать её
// скопировать. Копирование не тренирует ничего: на собеседовании и в работе
// человек пишет сам. Здесь появляется задание — факты по-русски — и проверка
// того, что человек написал: содержит ли текст обязательные для этого жанра
// конструкции, нет ли в нём того, чего в таком письме быть не должно, и хватает
// ли объёма.
//
// Проверка НАМЕРЕННО не пытается оценить язык целиком: это не ИИ-рецензент, а
// чек-лист жанра. Он отвечает на вопрос «есть ли в письме обязательные части»,
// а качество формулировок человек сверяет с эталоном сам.
//
// ── Правило сопоставления ──────────────────────────────────────────────────
// И текст, и искомая конструкция приводятся к одному виду: нижний регистр,
// любой символ кроме латинской буквы, цифры и апострофа становится пробелом,
// пробелы схлопываются, строка обрамляется пробелами. Совпадение — обычное
// вхождение подстроки в такую нормализованную строку.
//
// Обрамляющие пробелы дают границы слов бесплатно и без регулярных выражений:
// «at» не найдётся в «that», потому что " that " не содержит " at ". Это тот
// самый класс ошибки, на котором раздел уже обжигался с русскими маркерами
// («буй» внутри «попробуйте»), поэтому правило здесь одно и общее.
//
// Дефис и апостроф разведены сознательно: «non-blocking» и «non blocking» —
// одно и то же (дефис становится пробелом), а «I'm» остаётся «i'm», потому что
// апостроф внутри слова несёт смысл.
//
// Кириллица превращается в пробелы: если человек написал письмо по-русски,
// объём не наберётся и обязательные конструкции не найдутся — ровно то
// поведение, которое нужно.
//
// Это же правило продублировано в tools/content_lib.py: там оно проверяет, что
// эталонный ответ сам проходит собственный чек-лист. Расхождение двух реализаций
// ловит паритет в tests/test_writing.py против `node webapp/_writing_check.mjs
// --dump` — как это сделано для правил слияния.
//
// API (window.Writing):
//   norm(text)            — нормализованная строка в обрамляющих пробелах;
//   countWords(text)      — сколько слов засчитано;
//   hit(text, variants)    — первый найденный вариант или null;
//   check(text, task)     — полный разбор задания.
// ===========================================================================
(function (global) {
  "use strict";

  // Апострофы бывают трёх начертаний, и пользователь наберёт любое: клавиатура
  // телефона по умолчанию ставит типографский. Сводим к одному.
  var APOSTROPHES = /[’ʼ´`]/g;

  function norm(text) {
    if (text === null || text === undefined) return "  ";
    var s = String(text).toLowerCase().replace(APOSTROPHES, "'");
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      var code = s.charCodeAt(i);
      var isLetter = code >= 97 && code <= 122;      // a..z
      var isDigit = code >= 48 && code <= 57;        // 0..9
      out += (isLetter || isDigit || ch === "'") ? ch : " ";
    }
    return " " + out.split(/\s+/).join(" ").replace(/^ | $/g, "") + " ";
  }

  function countWords(text) {
    var s = norm(text).replace(/^ | $/g, "");
    if (!s) return 0;
    return s.split(" ").length;
  }

  // Вернуть первый найденный вариант, а не просто «да/нет»: разбор показывает
  // человеку, какую именно формулировку он употребил.
  function hit(text, variants) {
    var hay = norm(text);
    var list = variants || [];
    for (var i = 0; i < list.length; i++) {
      var needle = norm(list[i]);
      if (needle === "  ") continue;                 // пустой вариант не ищем
      // needle уже обрамлён пробелами: срезаем только внешние, чтобы искать
      // " thank you for " целиком, вместе с границами.
      if (hay.indexOf(needle) !== -1) return list[i];
    }
    return null;
  }

  function check(text, task) {
    task = task || {};
    var words = countWords(text);
    var minWords = typeof task.min_words === "number" ? task.min_words : 0;

    var must = (task.must || []).map(function (r) {
      var found = hit(text, r.any);
      return { label: r.label, why: r.why, ok: !!found, matched: found };
    });
    var avoid = (task.avoid || []).map(function (r) {
      var found = hit(text, r.any);
      return { label: r.label, why: r.why, ok: !found, matched: found };
    });

    var mustLeft = must.filter(function (r) { return !r.ok; }).length;
    var avoidHit = avoid.filter(function (r) { return !r.ok; }).length;
    var enough = words >= minWords;

    return {
      words: words,
      minWords: minWords,
      enough: enough,
      must: must,
      avoid: avoid,
      mustDone: must.length - mustLeft,
      mustTotal: must.length,
      avoidHit: avoidHit,
      passed: enough && mustLeft === 0 && avoidHit === 0,
    };
  }

  var Writing = { norm: norm, countWords: countWords, hit: hit, check: check };

  global.Writing = Writing;
  if (typeof module !== "undefined" && module.exports) module.exports = Writing;
})(typeof window !== "undefined" ? window : globalThis);
