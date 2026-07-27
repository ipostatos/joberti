"""
Pydantic-модели входящих запросов.

Задача моделей — не «описать данные», а отсечь мусор до того, как он дойдёт до
слияния и до базы. Раньше в подобных сервисах поля приводились вручную через
int(...), и строка "abc" роняла запрос пятисоткой; здесь такой ввод отвергается
как 422 с понятным сообщением.

Состояние (srs / progress / profile) намеренно принимается как свободный dict:
его схема живёт в приложении и меняется чаще, чем API. Защита от мусора там —
в merge.py, где каждое поле нормализуется, а неизвестные ключи отбрасываются.
"""
from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

# Разумные потолки: состояние одного пользователя не может быть больше.
MAX_SRS_ITEMS = 5000
MAX_ATTEMPTS_IN = 200


class StateIn(BaseModel):
    """Тело POST /api/state."""

    model_config = {"extra": "ignore"}

    srs: dict = Field(default_factory=dict)
    progress: dict = Field(default_factory=dict)
    profile: dict = Field(default_factory=dict)
    exam_date: dict | str | None = None

    @field_validator("srs")
    @classmethod
    def _srs_size(cls, v: dict) -> dict:
        if len(v) > MAX_SRS_ITEMS:
            raise ValueError(f"srs: слишком много элементов (максимум {MAX_SRS_ITEMS})")
        return v


class AttemptIn(BaseModel):
    """Одна запись истории. Границы полей подобраны так, чтобы отсечь мусор,
    но пропустить любой реальный результат."""

    model_config = {"extra": "ignore"}

    id: str = Field(max_length=80)
    ts: int = Field(ge=0, le=4_102_444_800_000)     # до 2100 года в миллисекундах
    kind: str = Field(default="quiz", max_length=20)
    mode: str = Field(default="", max_length=80)
    total: int = Field(default=0, ge=0, le=1000)
    correct: int = Field(default=0, ge=0, le=1000)
    pct: int = Field(default=0, ge=0, le=100)
    secs: int = Field(default=0, ge=0, le=24 * 3600)
    weakTopics: list[str] = Field(default_factory=list)
    details: list | None = None

    @field_validator("kind")
    @classmethod
    def _kind(cls, v: str) -> str:
        allowed = {"quiz", "mock", "case", "readiness"}
        return v if v in allowed else "quiz"

    @field_validator("weakTopics")
    @classmethod
    def _weak(cls, v: list) -> list:
        return [str(x)[:60] for x in v[:30]]

    @field_validator("details")
    @classmethod
    def _details(cls, v):
        # Подробности сессии полезны в истории, но не должны быть каналом для
        # закачки произвольного объёма данных.
        if v is None:
            return None
        return v[:60]


class AttemptsIn(BaseModel):
    """Тело POST /api/attempts."""

    model_config = {"extra": "ignore"}

    attempts: list[AttemptIn] = Field(default_factory=list)

    @field_validator("attempts")
    @classmethod
    def _limit(cls, v: list) -> list:
        return v[:MAX_ATTEMPTS_IN]
