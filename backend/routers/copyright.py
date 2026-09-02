from __future__ import annotations

import asyncio

from fastapi import APIRouter, Request, Response

from backend.models.schemas import CopyrightMatch, CopyrightRequest, CopyrightResult
from backend.routers.common import refund_check, reserve_check, services_for
from backend.services.content import similarity_and_excerpt


router = APIRouter(prefix="/api", tags=["copyright"])


@router.post("/copyright", response_model=CopyrightResult)
async def check_copyright(payload: CopyrightRequest, request: Request, response: Response) -> CopyrightResult:
    session_id = await reserve_check(request, response)
    try:
        services = services_for(request)
        phrases = await services.groq.extract_search_phrases(payload.content)
        search_groups = await asyncio.gather(
            *[
                services.tavily.search(
                    f'"{phrase}"', count=4, include_raw_content=True
                )
                for phrase in phrases.phrases
            ]
        )
        sources = {result.url: result for group in search_groups for result in group}

        def inspect_source(result):
            text = result.raw_content or result.content
            score, excerpt = similarity_and_excerpt(payload.content, text)
            if score < 10 or not excerpt:
                return None
            return CopyrightMatch(url=result.url, title=result.title, excerpt=excerpt[:700], similarity_pct=score)

        inspected = [inspect_source(result) for result in list(sources.values())[:12]]
        matches = sorted((match for match in inspected if match), key=lambda match: match.similarity_pct, reverse=True)[:5]
        if not matches:
            return CopyrightResult(matches=[], overall_risk="Low", risk_label="Low")
        public_records = [match.model_dump() for match in matches]
        assessment = await services.gemini.classify_public_results(public_records)
        return CopyrightResult(matches=matches, overall_risk=assessment.risk_level, risk_label=assessment.risk_level)
    except Exception:
        await refund_check(request, session_id)
        raise
