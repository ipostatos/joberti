// ===========================================================================
// HEATMAP — сетка активности по дням для профиля и дашборда.
//
// Рисует последние N недель: каждый день — клетка, насыщенность по числу
// выполненных действий. Данные берём из Progress.days() ({ "YYYY-MM-DD": n }).
// Цвета — через токены темы, поэтому сетка одинаково читается в тёмной и
// светлой схеме.
//
// Использование:
//   Heatmap.render(container, { weeks: 16, days: Progress.days() });
// ===========================================================================
(function (global) {
  "use strict";

  var DAY_MS = 86400000;

  function fmt(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  // Уровень насыщенности 0..4. Пороги привязаны к дневной цели, чтобы шкала
  // означала «сколько от нормы», а не абстрактное число.
  function level(n, goal) {
    if (!n) return 0;
    var g = goal || 15;
    if (n < g * 0.34) return 1;
    if (n < g * 0.67) return 2;
    if (n < g) return 3;
    return 4;
  }

  var STYLE_ID = "heatmap-style";
  function ensureStyle(doc) {
    if (doc.getElementById(STYLE_ID)) return;
    var st = doc.createElement("style");
    st.id = STYLE_ID;
    st.textContent =
      ".hm{display:flex;gap:3px;overflow-x:auto;-webkit-overflow-scrolling:touch;" +
        "padding-bottom:2px;scrollbar-width:none}" +
      ".hm::-webkit-scrollbar{display:none}" +
      ".hm-col{display:flex;flex-direction:column;gap:3px}" +
      ".hm-c{width:12px;height:12px;border-radius:3px;background:var(--muted-fill);" +
        "border:1px solid var(--border)}" +
      ".hm-c.l1{background:color-mix(in srgb,var(--accent) 25%,transparent);border-color:transparent}" +
      ".hm-c.l2{background:color-mix(in srgb,var(--accent) 45%,transparent);border-color:transparent}" +
      ".hm-c.l3{background:color-mix(in srgb,var(--accent) 70%,transparent);border-color:transparent}" +
      ".hm-c.l4{background:var(--accent);border-color:transparent}" +
      ".hm-c.future{opacity:.25}" +
      ".hm-legend{display:flex;align-items:center;gap:5px;justify-content:flex-end;" +
        "margin-top:8px;font-size:var(--fs-xs);color:var(--hint)}";
    doc.head.appendChild(st);
  }

  var Heatmap = {
    level: level,

    render: function (container, opts) {
      if (!container) return;
      var o = opts || {};
      var doc = container.ownerDocument || global.document;
      ensureStyle(doc);

      var weeks = o.weeks || 16;
      var days = o.days || {};
      var goal = o.goal || 15;
      var today = o.today ? new Date(o.today + "T00:00:00") : new Date();
      today.setHours(0, 0, 0, 0);

      // Ставим последний столбец так, чтобы текущая неделя была полной:
      // отсчитываем от ближайшего воскресенья вперёд.
      var end = new Date(today.getTime());
      end.setDate(end.getDate() + (6 - end.getDay()));
      var start = new Date(end.getTime() - (weeks * 7 - 1) * DAY_MS);

      var html = '<div class="hm">';
      var cur = new Date(start.getTime());
      for (var w = 0; w < weeks; w++) {
        html += '<div class="hm-col">';
        for (var d = 0; d < 7; d++) {
          var key = fmt(cur);
          var n = days[key] || 0;
          var future = cur.getTime() > today.getTime();
          var cls = "hm-c l" + level(n, goal) + (future ? " future" : "");
          html += '<div class="' + cls + '" title="' + key + ": " + n + '"></div>';
          cur = new Date(cur.getTime() + DAY_MS);
        }
        html += "</div>";
      }
      html += "</div>";

      if (o.legend !== false) {
        html += '<div class="hm-legend"><span>меньше</span>' +
          '<span class="hm-c"></span><span class="hm-c l1"></span>' +
          '<span class="hm-c l2"></span><span class="hm-c l3"></span>' +
          '<span class="hm-c l4"></span><span>больше</span></div>';
      }

      container.innerHTML = html;
      // Прокручиваем к сегодняшнему дню: без этого на узком экране видна
      // только давняя часть истории.
      var hm = container.querySelector(".hm");
      if (hm) hm.scrollLeft = hm.scrollWidth;
    },

    // Сводка для профиля: сколько дней активности и какова текущая полоса.
    summary: function (days, todayKey) {
      var keys = Object.keys(days || {}).filter(function (k) { return days[k] > 0; });
      var total = keys.reduce(function (a, k) { return a + (days[k] || 0); }, 0);
      return {
        activeDays: keys.length,
        totalActions: total,
        avgPerActiveDay: keys.length ? Math.round(total / keys.length) : 0,
        todayActions: (days || {})[todayKey] || 0,
      };
    },
  };

  global.Heatmap = Heatmap;
  if (typeof module !== "undefined" && module.exports) module.exports = Heatmap;
})(typeof window !== "undefined" ? window : globalThis);
