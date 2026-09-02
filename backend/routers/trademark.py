from __future__ import annotations

import asyncio
from difflib import SequenceMatcher

import jellyfish
from fastapi import APIRouter, Request, Response

from backend.models.schemas import TrademarkMatch, TrademarkRequest, TrademarkResult
from backend.routers.common import refund_check, reserve_check, services_for
from backend.services.tavily import SearchResult


router = APIRouter(prefix="/api", tags=["trademark"])


def _variants(brand: str, phonetic: bool) -> list[str]:
    values = [brand]
    if phonetic:
        sound = jellyfish.soundex(brand)
        metaphone = jellyfish.metaphone(brand)
        values.extend([f"{brand} trademark", f"{brand} brand registration", sound, metaphone])
    return list(dict.fromkeys(value for value in values if value and len(value) > 1))[:4]


def _candidate(brand: str, result: SearchResult) -> TrademarkMatch:
    name = result.title.split(" - ", 1)[0].strip() or result.title
    spelling = round(100 * SequenceMatcher(None, brand.lower(), name.lower()).ratio())
    if brand.lower() in name.lower():
        match_type = "exact"
        score = max(90, spelling)
    elif jellyfish.metaphone(brand) == jellyfish.metaphone(name):
        match_type = "phonetic"
        score = max(65, spelling)
    else:
        match_type = "similar spelling"
        score = spelling
    return TrademarkMatch(
        name=name[:180],
        match_type=match_type,
        similarity_pct=min(100, score),
        category="Public web result",
        registry=result.host or "Public source",
        source_url=result.url,
    )


@router.post("/trademark", response_model=TrademarkResult)
async def scan_trademark(payload: TrademarkRequest, request: Request, response: Response) -> TrademarkResult:
    session_id = await reserve_check(request, response)
    try:
        services = services_for(request)
        responses = await asyncio.gather(
            *[services.tavily.search(f"{variant} trademark", count=6) for variant in _variants(payload.brand_name, payload.phonetic)]
        )
        matches: dict[str, TrademarkMatch] = {}
        for results in responses:
            for result in results:
                candidate = _candidate(payload.brand_name, result)
                existing = matches.get(candidate.source_url)
                if existing is None or candidate.similarity_pct > existing.similarity_pct:
                    matches[candidate.source_url] = candidate
        ranked = sorted(matches.values(), key=lambda item: item.similarity_pct, reverse=True)[:5]
        if not ranked:
            return TrademarkResult(matches=[], risk_level="Low", explanation="No comparable public trademark candidates were returned by the search provider. Review official registries before launch.")
        public_result_records = [
            {"name": item.name, "match_type": item.match_type, "similarity_pct": item.similarity_pct, "source_url": item.source_url}
            for item in ranked
        ]
        analysis = await services.gemini.classify_public_results(public_result_records)
        return TrademarkResult(matches=ranked, risk_level=analysis.risk_level, explanation=analysis.explanation)
    except Exception:
        await refund_check(request, session_id)
        raise
