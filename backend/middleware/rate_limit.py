"""A lightweight, in-memory session quota for the local MVP."""

from __future__ import annotations

import asyncio
import secrets

from fastapi import Request, Response

from backend.config import Settings


class SessionUsageStore:
    def __init__(self, limit: int = 5) -> None:
        self.limit = limit
        self._remaining: dict[str, int] = {}
        self._lock = asyncio.Lock()

    async def remaining(self, session_id: str) -> int:
        async with self._lock:
            return self._remaining.setdefault(session_id, self.limit)

    async def reserve(self, session_id: str) -> bool:
        async with self._lock:
            remaining = self._remaining.setdefault(session_id, self.limit)
            if remaining <= 0:
                return False
            self._remaining[session_id] = remaining - 1
            return True

    async def refund(self, session_id: str) -> int:
        async with self._lock:
            remaining = self._remaining.setdefault(session_id, self.limit)
            self._remaining[session_id] = min(self.limit, remaining + 1)
            return self._remaining[session_id]


def get_or_create_session_id(request: Request, response: Response, settings: Settings) -> str:
    existing = request.cookies.get(settings.session_cookie_name)
    if existing:
        return existing
    session_id = secrets.token_urlsafe(32)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_id,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        max_age=60 * 60 * 24 * 30,
        path="/",
    )
    return session_id
