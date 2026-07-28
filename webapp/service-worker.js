// ===========================================================================
// Service worker Mini App — офлайн-режим.
//
// Прогрессивное улучшение: в iOS-клиенте Telegram (WKWebView) service worker
// недоступен, там приложение работает по сети как обычно. В Android-клиенте и
// браузере после первого визита страницы и данные доступны офлайн.
//
// Стратегии (важно для корректности после деплоя):
//   • страницы, код и данные (.html/.js/.css/.json/манифест) — NETWORK-FIRST
//     с таймаутом: онлайн всегда отдаём свежую версию, чтобы после выката не
//     залипал старый код; кэш используется только как фолбэк без сети;
//   • иконки и статические картинки — STALE-WHILE-REVALIDATE;
//   • НЕ кэшируем /api/* — это живое состояние пользователя.
//
// Список PRECACHE обязан покрывать все страницы и модули: его полноту
// проверяет webapp/_sw_check.mjs в CI, иначе офлайн-запуск упирается в белый
// экран на первой же непрокэшированной странице.
// ===========================================================================
"use strict";

var CACHE = "interview-trainer-v2";
var NET_TIMEOUT_MS = 4000;

// Файлы, без которых приложение не открывается офлайн.
var PRECACHE = [
  "index.html",
  "onboarding.html",
  "roadmap.html",
  "learn.html",
  "lesson.html",
  "quiz.html",
  "mock.html",
  "cases.html",
  "glossary.html",
  "library.html",
  "vacancy.html",
  "stories.html",
  "profile.html",
  "history.html",
  "search.html",
  "about.html",
  "theme.css",
  "nav.js",
  "icons.js",
  "srs.js",
  "progress.js",
  "readiness.js",
  "sync.js",
  "search.js",
  "heatmap.js",
  "app.js",
  "content-loader.js",
  "generated/content_core.js",
  "manifest.webmanifest",
  "icon.svg",
];

// Трековые файлы (generated/content_track_*.js) СОЗНАТЕЛЬНО не в PRECACHE:
// иначе установка тянула бы контент всех треков сразу — ровно то, ради чего
// контент и разрезали. Нужный файл называет страница: см. content-loader.js.
self.addEventListener("message", function (e) {
  var data = e.data || {};
  if (data.type !== "cache-track" || typeof data.url !== "string") return;
  // Кэшируем только своё и только трековые данные: сообщение приходит со
  // страницы, слепо доверять пути в нём нельзя.
  var url;
  try { url = new URL(data.url, self.location.href); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;
  if (!/\/generated\/content_track_[a-z0-9-]+\.js$/.test(url.pathname)) return;
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.match(url.href).then(function (hit) {
        return hit ? undefined : c.add(url.href);
      });
    }).catch(function () {})
  );
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll падает целиком, если хоть один файл недоступен. Кладём по
      // одному: отсутствие второстепенного файла не должно ломать установку.
      return Promise.all(PRECACHE.map(function (url) {
        return c.add(url).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// В кэш кладём только полноценные ответы: ошибки и редиректы не запоминаем.
function putIfCacheable(req, res) {
  if (!res || res.status !== 200 || res.type === "opaqueredirect") return res;
  var copy = res.clone();
  caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
  return res;
}

function fetchWithTimeout(req) {
  if (typeof AbortController === "undefined") return fetch(req);
  var ctrl = new AbortController();
  var t = setTimeout(function () { ctrl.abort(); }, NET_TIMEOUT_MS);
  return fetch(req, { signal: ctrl.signal }).then(function (r) {
    clearTimeout(t);
    return r;
  }, function (err) {
    clearTimeout(t);
    throw err;
  });
}

function networkFirst(req, isNavigate) {
  return fetchWithTimeout(req)
    .then(function (res) { return putIfCacheable(req, res); })
    .catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        // Последний фолбэк для навигаций — закэшированная главная, чтобы
        // офлайн-запуск не упирался в белый экран.
        if (isNavigate) return caches.match("index.html", { ignoreSearch: true });
        return Promise.reject(new Error("offline: " + req.url));
      });
    });
}

function staleWhileRevalidate(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    var refresh = fetch(req)
      .then(function (res) { return putIfCacheable(req, res); })
      .catch(function () { return hit; });
    return hit || refresh;
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (req.headers.has("range")) return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  if (url.origin !== self.location.origin) {
    // Единственный внешний ресурс — скрипт Telegram, без которого Mini App не
    // стартует. Остальное внешнее не трогаем.
    if (url.hostname === "telegram.org" &&
        url.pathname.indexOf("telegram-web-app") !== -1) {
      e.respondWith(staleWhileRevalidate(req));
    }
    return;
  }

  var p = url.pathname;
  if (p.indexOf("/api/") !== -1) return;                 // живое состояние — только сеть

  if (p.slice(-4) === ".svg" || p.slice(-4) === ".png" ||
      p.slice(-4) === ".jpg" || p.slice(-5) === ".webp" ||
      p.indexOf("/images/") !== -1) {
    e.respondWith(staleWhileRevalidate(req));
    return;
  }

  e.respondWith(networkFirst(req, req.mode === "navigate"));
});
