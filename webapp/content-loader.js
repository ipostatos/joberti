// ===========================================================================
// CONTENT-LOADER — подключает данные выбранного трека.
//
// Зачем он есть. Контент разрезан на общую часть (generated/content_core.js) и
// файл на каждый трек. Человек на треке DevOps не должен качать ещё и весь
// SEO-трек: раньше это стоило 280 КБ gzip вместо нужных 130 КБ, и каждый новый
// трек добавлял налог всем сразу.
//
// Почему document.write, а не динамический <script>. app.js и остальные модули
// читают window.CONTENT в момент разбора файла, а не по DOMContentLoaded.
// Динамически вставленный скрипт разбор не блокирует, и app.js увидел бы пустые
// массивы. document.write во время первичного разбора — блокирующий, порядок
// сохраняется. Ограничение Chrome на document.write действует только для
// СТОРОННИХ доменов на медленной сети, а файл свой.
//
// Подключать СТРОГО между generated/content_core.js и остальными модулями.
//
// ВАЖНО: путь к файлу берётся только из CONTENT.trackFiles. Идентификатор
// трека приходит из localStorage, то есть из-под контроля пользователя, и
// склеивать из него src нельзя.
// ===========================================================================
(function (global, document) {
  "use strict";

  // ОБЯЗАН совпадать с K_PROFILE в progress.js — там же лежит trackId.
  // Совпадение проверяет webapp/_nav_check.mjs, иначе рассинхрон ключей
  // проявился бы «пустым» приложением у людей с уже выбранным треком.
  var K_PROFILE = "interview_profile_v1";

  var C = global.CONTENT || {};
  var files = C.trackFiles || {};
  var loading = {};

  function fileFor(id) {
    if (!id) return null;
    return Object.prototype.hasOwnProperty.call(files, id) ? files[id] : null;
  }

  function storedTrack() {
    try {
      var p = JSON.parse(global.localStorage.getItem(K_PROFILE)) || {};
      return p.trackId || null;
    } catch (e) { return null; }
  }

  // Тот же порядок выбора, что и в App.trackId(): сохранённый трек, иначе
  // первый активный. Если эти два места разойдутся, страница загрузит данные
  // одного трека, а покажет другой.
  function pickTrack() {
    var stored = storedTrack();
    if (fileFor(stored)) return stored;
    var tracks = C.tracks || [];
    for (var i = 0; i < tracks.length; i++) {
      if (tracks[i].status === "active" && fileFor(tracks[i].id)) return tracks[i].id;
    }
    for (var j = 0; j < tracks.length; j++) {
      if (fileFor(tracks[j].id)) return tracks[j].id;
    }
    return null;
  }

  // Service worker не видит localStorage и на установке не знает, какой трек
  // нужен, поэтому трековые файлы не лежат в PRECACHE. Просим закэшировать
  // ровно тот, что реально используется, — иначе офлайн-режим остался бы без
  // контента.
  function askServiceWorkerToCache(url) {
    try {
      var sw = global.navigator && global.navigator.serviceWorker;
      if (!sw) return;
      var send = function () {
        if (sw.controller) sw.controller.postMessage({ type: "cache-track", url: url });
      };
      send();
      sw.ready.then(send).catch(function () {});
    } catch (e) {}
  }

  function inject(url, done) {
    var s = document.createElement("script");
    s.src = url;
    s.async = false;
    s.onload = function () { done(true); };
    s.onerror = function () { done(false); };
    document.head.appendChild(s);
  }

  var current = pickTrack();
  var currentFile = fileFor(current);

  if (currentFile) {
    if (document.readyState === "loading") {
      document.write('<script src="' + currentFile + '"><\/script>');
    } else {
      // Страница уже разобрана — document.write затёр бы её целиком.
      inject(currentFile, function () {});
    }
    askServiceWorkerToCache(currentFile);
  }

  global.ContentLoader = {
    current: function () { return current; },

    // Догрузить данные другого трека без перезагрузки страницы. Нужно
    // онбордингу: там трек выбирают и тут же показывают его самооценку и план.
    // Повторный вызов для уже загруженного трека — не ошибка, а no-op.
    ensure: function (id, cb) {
      var done = typeof cb === "function" ? cb : function () {};
      var url = fileFor(id);
      if (!url) { done(false); return; }
      if ((global.CONTENT || {}).trackLoaded === id) { done(true); return; }
      if (loading[id]) { loading[id].push(done); return; }
      loading[id] = [done];
      inject(url, function (okFlag) {
        var waiting = loading[id];
        delete loading[id];
        if (okFlag) { current = id; askServiceWorkerToCache(url); }
        waiting.forEach(function (fn) { fn(okFlag); });
      });
    },
  };
})(window, document);
