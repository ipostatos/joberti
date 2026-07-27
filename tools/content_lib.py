"""
Общий загрузчик учебного контента.

Источник правды — читаемые JSON-файлы в data/. Всё остальное (Mini App, бот,
отчёты) строится из них, поэтому загрузка и базовая нормализация живут в одном
месте: иначе три потребителя разъедутся в трактовке одних и тех же полей.

Использование:
    from content_lib import load_all
    c = load_all()
    c.questions, c.topics_by_id, c.track("redcore-junior-seo")
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Файлы источника правды. Порядок важен только для читаемости отчётов.
FILES = {
    "tracks": "tracks.json",
    "topics": "topics.json",
    "vacancies": "vacancies.json",
    "sources": "sources.json",
    "lessons": "lessons.json",
    "glossary": "glossary.json",
    "library": "library.json",
    "questions": "questions.json",
    "mock_questions": "mock_questions.json",
    "cases": "cases.json",
    "roadmap": "roadmap.json",
    "stories": "stories.json",
    "achievements": "achievements.json",
}

# Ключ верхнего уровня со списком записей внутри каждого файла.
LIST_KEY = {
    "tracks": "tracks",
    "topics": "topics",
    "vacancies": "vacancies",
    "sources": "sources",
    "lessons": "lessons",
    "glossary": "terms",
    "library": "resources",
    "questions": "questions",
    "mock_questions": "questions",
    "cases": "cases",
    "roadmap": "steps",
    "stories": "templates",
    "achievements": "achievements",
}


@dataclass
class Content:
    raw: dict = field(default_factory=dict)

    tracks: list = field(default_factory=list)
    topics: list = field(default_factory=list)
    vacancies: list = field(default_factory=list)
    sources: list = field(default_factory=list)
    lessons: list = field(default_factory=list)
    glossary: list = field(default_factory=list)
    library: list = field(default_factory=list)
    questions: list = field(default_factory=list)
    mock_questions: list = field(default_factory=list)
    cases: list = field(default_factory=list)
    roadmap: list = field(default_factory=list)
    stories: list = field(default_factory=list)
    achievements: list = field(default_factory=list)

    # ── индексы по id (строятся один раз) ──
    @property
    def tracks_by_id(self) -> dict:
        return {t["id"]: t for t in self.tracks}

    @property
    def topics_by_id(self) -> dict:
        return {t["id"]: t for t in self.topics}

    @property
    def sources_by_id(self) -> dict:
        return {s["id"]: s for s in self.sources}

    @property
    def lessons_by_id(self) -> dict:
        return {x["id"]: x for x in self.lessons}

    @property
    def terms_by_id(self) -> dict:
        return {x["id"]: x for x in self.glossary}

    @property
    def questions_by_id(self) -> dict:
        return {x["id"]: x for x in self.questions}

    @property
    def mock_by_id(self) -> dict:
        return {x["id"]: x for x in self.mock_questions}

    @property
    def cases_by_id(self) -> dict:
        return {x["id"]: x for x in self.cases}

    @property
    def steps_by_id(self) -> dict:
        return {x["id"]: x for x in self.roadmap}

    def track(self, track_id: str) -> dict | None:
        return self.tracks_by_id.get(track_id)

    def active_tracks(self) -> list:
        return [t for t in self.tracks if t.get("status") == "active"]

    def topics_of(self, track_id: str) -> list:
        return sorted(
            [t for t in self.topics if t.get("track_id") == track_id],
            key=lambda t: t.get("order", 0),
        )

    def questions_of(self, track_id: str) -> list:
        return [q for q in self.questions if q.get("track_id") == track_id]

    def counts(self) -> dict:
        return {
            "tracks": len(self.tracks),
            "active_tracks": len(self.active_tracks()),
            "topics": len(self.topics),
            "vacancies": len(self.vacancies),
            "sources": len(self.sources),
            "lessons": len(self.lessons),
            "glossary_terms": len(self.glossary),
            "library_resources": len(self.library),
            "questions": len(self.questions),
            "mock_questions": len(self.mock_questions),
            "cases": len(self.cases),
            "roadmap_steps": len(self.roadmap),
            "story_templates": len(self.stories),
            "achievements": len(self.achievements),
        }


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_all(data_dir: Path | None = None) -> Content:
    """Прочитать все файлы data/ и вернуть заполненный Content.

    Отсутствующий файл — это ошибка конфигурации, а не «пустая коллекция»:
    молчаливый пропуск скрыл бы поломку сборки, поэтому кидаем FileNotFoundError.
    """
    d = data_dir or DATA_DIR
    c = Content()
    for key, filename in FILES.items():
        path = d / filename
        if not path.exists():
            raise FileNotFoundError(f"нет файла контента: {path}")
        raw = load_json(path)
        c.raw[key] = raw
        setattr(c, key, raw.get(LIST_KEY[key], []))
    return c


# Нормализация текста для поиска точных дублей: регистр, пробелы и знаки
# препинания не должны маскировать один и тот же вопрос.
_PUNCT = str.maketrans({ch: " " for ch in "«»\"'`.,;:!?()[]{}—–-"})


def normalize_text(s: str) -> str:
    return " ".join(str(s).lower().translate(_PUNCT).split())
