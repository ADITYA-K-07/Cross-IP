from __future__ import annotations

from fastapi import APIRouter, Request, Response

from backend.models.schemas import DescriptionRequest, DraftResult
from backend.routers.common import refund_check, reserve_check, services_for


router = APIRouter(prefix="/api", tags=["draft"])


@router.post("/draft", response_model=DraftResult)
async def draft_claims(payload: DescriptionRequest, request: Request, response: Response) -> DraftResult:
    session_id = await reserve_check(request, response)
    try:
        return await services_for(request).groq.generate_claims(payload.description)
    except Exception:
        await refund_check(request, session_id)
        raise
