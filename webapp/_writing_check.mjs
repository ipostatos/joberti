// Проверка правила сопоставления в webapp/writing.js.
//
// Зачем: раздел «Письмо» проверяет текст человека по чек-листу жанра. Правило
// сопоставления продублировано в tools/content_lib.py — там оно следит, чтобы
// эталонный ответ проходил собственный чек-лист. Если две реализации разойдутся,
// валидатор будет считать задание исправным, а пользователь увидит «конструкция
// не найдена» на тексте, который её содержит.
//
// Поэтому здесь: собственные проверки семантики (границы слов, апострофы,
// дефисы, кириллица) и режим --dump, который выдаёт вход и результат. Паритет
// сверяет tests/test_writing.py: он берёт ВХОД из этого дампа и прогоняет его
// через Python. Фикстуры намеренно живут в одном месте, а не продублированы,
// как в _sync_check.mjs: там дублирование нужно, чтобы читать правила слияния
// глазами рядом с кодом, здесь же сравнивается одна чистая функция, и
// единственный источник входа исключает расхождение самих фикстур.
//
// Запуск: node webapp/_writing_check.mjs [--dump]
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const DIR = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const Writing = require(join(DIR, "writing.js"));

let failed = 0;
const ok = (c, m) => { if (!c) { console.error("FAIL:", m); failed++; } };
const eq = (a, b, m) =>
  ok(JSON.stringify(a) === JSON.stringify(b), `${m}\n  получено: ${JSON.stringify(a)}`);

// ── фикстуры сопоставления ───────────────────────────────────────────────
// Каждый случай — текст, набор вариантов и ожидание. Ожидание записано здесь,
// чтобы проверялась не только одинаковость двух реализаций, но и правильность.
const HITS = [
  ["Thank you for the conversation today.", ["thank you for"], "thank you for"],
  // Граница слова: «at» не живёт внутри «that».
  ["I know that already.", ["at"], null],
  ["We meet at noon.", ["at"], "at"],
  // Тот же класс ошибки в обратную сторону: «impact» не находится в «impactful».
  ["This is impactful work.", ["impact"], null],
  ["Impact: all users.", ["impact"], "impact"],
  // Регистр и знаки препинания не мешают.
  ["SUMMARY: card declined", ["summary"], "summary"],
  ["Steps to reproduce:\n1. Open the page", ["steps to reproduce"], "steps to reproduce"],
  // Апостроф: типографский приводится к обычному.
  ["I’m blocked on the database.", ["i'm blocked"], "i'm blocked"],
  ["I'm blocked on the database.", ["i'm blocked"], "i'm blocked"],
  // Дефис равен пробелу: «non-blocking» и «non blocking» — одно и то же.
  ["This is a non-blocking comment.", ["non blocking"], "non blocking"],
  ["This is a non blocking comment.", ["non-blocking"], "non-blocking"],
  // Перечисление вариантов: возвращается первый найденный.
  ["Thanks for the offer.", ["thank you for the offer", "thanks for the offer"],
    "thanks for the offer"],
  // Кириллица не проходит проверку английского текста.
  ["Спасибо за предложение", ["thank you"], null],
  // Многословная конструкция целиком, а не по кускам.
  ["Sorry for the notice.", ["sorry for the short notice"], null],
  ["Sorry for the short notice.", ["sorry for the short notice"], "sorry for the short notice"],
  // Цифры — часть текста.
  ["Order 88214 was charged twice.", ["88214"], "88214"],
  // Пустой ввод и пустые варианты ничего не находят.
  ["", ["anything"], null],
  ["Some text", [""], null],
  ["Some text", [], null],
  [null, ["text"], null],
];

const WORDS = [
  ["", 0],
  ["   ", 0],
  ["one", 1],
  ["one two three", 3],
  ["Hi Anna,\n\nThank you.", 4],
  ["non-blocking", 2],           // дефис разделяет
  ["I'm fine", 2],               // апостроф не разделяет
  ["Спасибо большое", 0],        // кириллица не считается словами
  ["149.90 PLN", 3],             // точка разделяет число
];

// Небольшое задание целиком: разбор должен собираться из частей предсказуемо.
const TASK = {
  min_words: 10,
  must: [
    { label: "Благодарность", any: ["thank you for", "thanks for"], why: "..." },
    { label: "Срок", any: ["by friday"], why: "..." },
  ],
  avoid: [
    { label: "Ложная срочность", any: ["asap", "urgent"], why: "..." },
  ],
};

const CHECKS = [
  // всё на месте
  "Thank you for the review. I will send the corrected version by Friday morning.",
  // не хватает срока
  "Thank you for the review. I will send the corrected version soon.",
  // есть запрещённое
  "Thanks for the review, I need your answer ASAP, and I will send it by Friday.",
  // слишком коротко, хотя конструкции есть
  "Thanks for it by Friday.",
  // пусто
  "",
];

function dump() {
  return {
    hit: HITS.map(([text, variants]) => ({
      input: { text, variants },
      result: Writing.hit(text, variants),
    })),
    words: WORDS.map(([text]) => ({ input: { text }, result: Writing.countWords(text) })),
    check: CHECKS.map((text) => ({
      input: { text, task: TASK },
      result: Writing.check(text, TASK),
    })),
    content: contentCases().map(({ id, text, task }) => ({
      input: { id, text, task },
      result: Writing.check(text, task),
    })),
  };
}

// Настоящие данные: каждый эталон обязан проходить свой чек-лист и в браузерной
// реализации тоже. Валидатор проверяет то же самое на стороне Python — здесь
// проверка идёт ровно тем кодом, который выполняется у пользователя.
function contentCases() {
  const raw = JSON.parse(
    readFileSync(join(DIR, "..", "data", "english_writing.json"), "utf8"));
  return (raw.snippets || [])
    .filter((s) => s.task)
    .map((s) => ({ id: s.id, text: s.task.model_en, task: s.task }));
}

if (process.argv.includes("--dump")) {
  process.stdout.write(JSON.stringify(dump()));
} else {
  HITS.forEach(([text, variants, want]) => {
    eq(Writing.hit(text, variants), want,
      `hit(${JSON.stringify(text)}, ${JSON.stringify(variants)}) должен дать ${JSON.stringify(want)}`);
  });
  WORDS.forEach(([text, want]) => {
    eq(Writing.countWords(text), want, `countWords(${JSON.stringify(text)}) должен дать ${want}`);
  });

  // Нормализованная строка всегда обрамлена пробелами: на этом держатся границы слов.
  ["hello", "", "  x  ", null].forEach((t) => {
    const n = Writing.norm(t);
    ok(n.startsWith(" ") && n.endsWith(" "),
      `norm(${JSON.stringify(t)}) должен быть обрамлён пробелами, получено ${JSON.stringify(n)}`);
  });

  const full = Writing.check(CHECKS[0], TASK);
  ok(full.passed, "полный ответ должен проходить задание");
  eq([full.mustDone, full.mustTotal, full.avoidHit], [2, 2, 0], "разбор полного ответа");

  const noDeadline = Writing.check(CHECKS[1], TASK);
  ok(!noDeadline.passed, "ответ без срока не должен проходить");
  eq(noDeadline.must.map((m) => m.ok), [true, false], "видно, какое правило не выполнено");

  const urgent = Writing.check(CHECKS[2], TASK);
  ok(!urgent.passed, "ответ с запрещённой конструкцией не должен проходить");
  eq(urgent.avoid[0].matched, "asap", "запрещённая конструкция названа явно");

  const short = Writing.check(CHECKS[3], TASK);
  ok(!short.enough && !short.passed,
    "короткий ответ не проходит, даже если конструкции формально найдены");

  const empty = Writing.check(CHECKS[4], TASK);
  ok(!empty.passed && empty.words === 0, "пустой ответ не проходит");

  // Задание без правил не должно молча «проходить» на пустом тексте: минимум
  // слов остаётся единственным барьером, и он обязан работать.
  const bare = Writing.check("", { min_words: 5 });
  ok(!bare.passed, "пустой текст не проходит даже задание без обязательных конструкций");

  const cases = contentCases();
  ok(cases.length >= 10,
    `заданий с эталоном должно быть хотя бы 10, найдено ${cases.length}`);
  cases.forEach(({ id, text, task }) => {
    const r = Writing.check(text, task);
    const gaps = r.must.filter((m) => !m.ok).map((m) => m.label);
    const hits = r.avoid.filter((a) => !a.ok).map((a) => a.label);
    ok(r.passed,
      `${id}: эталон не проходит собственный чек-лист ` +
      `(слов ${r.words}/${r.minWords}` +
      (gaps.length ? `, не найдено: ${gaps.join(", ")}` : "") +
      (hits.length ? `, запрещённое: ${hits.join(", ")}` : "") + ")");
  });

  if (failed) { console.error(`\n_writing_check: провалено проверок ${failed}`); process.exit(1); }
  console.log(`_writing_check: OK (заданий с эталоном ${cases.length})`);
}
