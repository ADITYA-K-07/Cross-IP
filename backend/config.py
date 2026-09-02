"""Environment-backed backend configuration."""

from __future__ import annotations

from dataclasses import dataclass
from os import getenv
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(Path(__file__).with_name(".env"))


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    groq_api_key: str | None
    gemini_api_key: str | None
    tavily_api_key: str | None
    groq_model: str
    gemini_model: str
    allowed_origins: tuple[str, ...]
    upstream_timeout_seconds: float
    session_cookie_secure: bool
    session_cookie_samesite: str
    session_cookie_name: str = "ipsentinel_session"
    model_timeout_seconds: float = 45.0

    @classmethod
    def from_env(cls) -> "Settings":
        origins = tuple(
            origin.strip()
            for origin in getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
            if origin.strip()
        )
        samesite = getenv("SESSION_COOKIE_SAMESITE", "lax").strip().lower()
        if samesite not in {"lax", "strict", "none"}:
            samesite = "lax"
        return cls(
            groq_api_key=getenv("GROQ_API_KEY") or None,
            gemini_api_key=getenv("GEMINI_API_KEY") or None,
            tavily_api_key=getenv("TAVILY_API_KEY") or None,
            groq_model=getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            gemini_model=getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            allowed_origins=origins,
            upstream_timeout_seconds=float(getenv("UPSTREAM_TIMEOUT_SECONDS", "15")),
            session_cookie_secure=_as_bool(getenv("SESSION_COOKIE_SECURE")),
            session_cookie_samesite=samesite,
            model_timeout_seconds=float(getenv("MODEL_TIMEOUT_SECONDS", "45")),
        )
