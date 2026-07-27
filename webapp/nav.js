// ===========================================================================
// NAV — навигация Mini App поверх системной кнопки «Назад» Telegram.
//
// Проблема: страницы связаны обычными <a href>, но для Telegram это ОДНО
// приложение. Системный жест «назад» закрывает весь webview вместо возврата на
// предыдущий экран. Решение — Telegram BackButton: показываем его на
// под-страницах и сами решаем, куда вести.
//
// Подключение:
//   <script src="nav.js" data-home="true"></script>   на стартовом экране
//   <script src="nav.js"></script>                    на всех остальных
//
// Страница может перехватить «назад» своим обработчиком:
//   window.__navBack = function () { ...; return true; }  // true = обработано
// ===========================================================================
(function () {
  "use strict";

  var tg = window.Telegram && window.Telegram.WebApp;

  // ── PWA: service worker и манифест ──
  // Прогрессивное улучшение. В iOS-клиенте Telegram service worker недоступен —
  // там приложение просто работает по сети. Регистрируем здесь, потому что
  // nav.js подключён на каждой странице.
  try {
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    }
    if (!document.querySelector('link[rel="manifest"]')) {
      var mf = document.createElement("link");
      mf.rel = "manifest";
      mf.href = "manifest.webmanifest";
      document.head.appendChild(mf);
    }
  } catch (e) {}

  // ── тактильный отклик ──
  // На старых и альтернативных клиентах HapticFeedback или его методов может не
  // быть; любой сбой глушим, чтобы не ронять интерфейс.
  window.haptic = function (type) {
    try {
      var h = tg && tg.HapticFeedback;
      if (!h) return;
      if (type === "success" || type === "warning" || type === "error") {
        h.notificationOccurred && h.notificationOccurred(type);
      } else if (type === "select") {
        h.selectionChanged && h.selectionChanged();
      } else {
        h.impactOccurred && h.impactOccurred(type || "light");
      }
    } catch (e) {}
  };

  // Подтверждение закрытия: включать на время теста, кейса или mock-сессии,
  // чтобы случайный свайп не оборвал начатое.
  window.setBusy = function (on) {
    try {
      if (!tg) return;
      if (on) { tg.enableClosingConfirmation && tg.enableClosingConfirmation(); }
      else { tg.disableClosingConfirmation && tg.disableClosingConfirmation(); }
    } catch (e) {}
  };

  // Всплывающее уведомление. Работает и без Telegram — используется в тестах.
  window.toast = function (text, ms) {
    try {
      var el = document.createElement("div");
      el.className = "toast";
      el.textContent = text;
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("show"); });
      setTimeout(function () {
        el.classList.remove("show");
        setTimeout(function () { el.remove(); }, 400);
      }, ms || 2200);
    } catch (e) {}
  };

  if (!tg) return;                       // вне Telegram работаем как обычный сайт
  try { tg.ready(); tg.expand(); } catch (e) {}

  var script = document.currentScript;
  var isHome = script && script.getAttribute("data-home") === "true";

  var bb = tg.BackButton;
  if (!bb) return;

  // Гард от двойного срабатывания: на части клиентов за один тап приходят И
  // bb.onClick, И событие backButtonClicked. Без гарда перескакивало бы на два
  // экрана назад. Схлопываем повторные вызовы в пределах одного тика.
  var busy = false;
  function goBack() {
    if (busy) return;
    busy = true;
    setTimeout(function () { busy = false; }, 0);

    // Сначала даём странице обработать «назад» у себя: например, экран кейса
    // вернётся со страницы разбора к списку шагов, не покидая раздел.
    if (typeof window.__navBack === "function") {
      try { if (window.__navBack() === true) return; } catch (e) {}
    }
    // Иначе ведём на главную детерминированно. history.back() в webview
    // Telegram ненадёжен: referrer и history.length ведут себя по-разному.
    window.location.replace("index.html");
  }

  if (isHome) {
    bb.hide();                            // на главной системная кнопка закрывает Mini App
  } else {
    bb.show();
    try { bb.offClick && bb.offClick(goBack); } catch (e) {}
    bb.onClick(goBack);
    try { tg.onEvent && tg.onEvent("backButtonClicked", goBack); } catch (e) {}
  }
})();
