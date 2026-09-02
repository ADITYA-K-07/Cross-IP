"""Shared route helpers for app state and quota reservations."""

from __future__ import annotations

from fastapi import HTTPException, Request, Response

from backend.config import Settings
from backend.middleware.rate_limit import SessionUsageStore, get_or_create_session_id


def settings_for(request: Request) -> Settings:
    return request.app.state.settings  # type: ignore[no-any-return]


def services_for(request: Request):
    return request.app.state.services


async def reserve_check(request: Request, response: Response) -> str:
    settings = settings_for(request)
    store: SessionUsageStore = request.app.state.usage_store
    session_id = get_or_create_session_id(request, response, settings)
    if not await store.reserve(session_id):
        raise HTTPException(status_code=429, detail="Free tier limit reached")
    return session_id


async def refund_check(request: Request, session_id: str) -> None:
    store: SessionUsageStore = request.app.state.usage_store
    await store.refund(session_id)
