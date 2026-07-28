// ===========================================================================
// Помощник для node-проверок: собирает контент обратно из общей части и
// трековых файлов.
//
// Зачем: в браузере страница грузит core + ОДИН трек, а проверкам нужно то
// одно, то другое — readiness и search считают по конкретному треку, а обход
// иконок достижений идёт по общей части. Имя с подчёркиванием намеренное:
// _sw_check.mjs пропускает такие файлы, они не часть приложения.
//
// Использование:
//   const { core, forTrack, all, trackIds } = require("./_content_all.js");
// ===========================================================================
"use strict";

const path = require("node:path");

// Слепок делаем СРАЗУ: подключение трекового файла дописывает свои разделы в
// globalThis.CONTENT, то есть в тот же объект, что вернул core. Без копии
// «общая часть» перестала бы быть общей после первого же forTrack.
const CORE = structuredClone(require("./generated/content_core.js"));

const trackIds = Object.keys(CORE.trackFiles || {}).sort();

function loadTrackData(id) {
  const rel = (CORE.trackFiles || {})[id];
  if (!rel) throw new Error(`неизвестный трек: ${id}`);
  return require("./" + path.posix.normalize(rel));
}

// Контент так, как его видит страница с выбранным треком.
function forTrack(id) {
  return Object.assign(structuredClone(CORE), structuredClone(loadTrackData(id)),
    { trackLoaded: id });
}

// Весь корпус разом — для проверок, которым нужны все треки сразу.
// Списки склеиваются, индексы объединяются по ключу темы.
function all() {
  const merged = structuredClone(CORE);
  merged.trackLoaded = null;
  for (const id of trackIds) {
    const data = structuredClone(loadTrackData(id));
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        merged[key] = (merged[key] || []).concat(value);
      } else if (value && typeof value === "object") {
        const dst = merged[key] || (merged[key] = {});
        for (const [k, v] of Object.entries(value)) {
          dst[k] = (dst[k] || []).concat(v);
        }
      }
    }
  }
  return merged;
}

module.exports = { core: CORE, forTrack, all, trackIds };
