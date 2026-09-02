from __future__ import annotations

from fastapi import APIRouter, Request, Response

from backend.errors import MalformedModelResponse
from backend.models.schemas import DescriptionRequest, NoveltyResult, PatentMatch
from backend.routers.common import refund_check, reserve_check, services_for
from backend.services.patents import discover_us_patents


router = APIRouter(prefix="/api", tags=["novelty"])


@router.post("/novelty", response_model=NoveltyResult)
async def check_novelty(payload: DescriptionRequest, request: Request, response: Response) -> NoveltyResult:
    session_id = await reserve_check(request, response)
    try:
        services = services_for(request)
        concepts = await services.groq.extract_concepts(payload.description)
        patents = await discover_us_patents(services.tavily, concepts.concepts)
        # Tavily can return lengthy extracted text. Keep the retrieval pool at
        # twenty records, but send the ten strongest discovered records to the
        # public-data model to stay within the interactive endpoint budget.
        candidate_patents = patents[:10]
        public_patents = [patent.public_record() for patent in candidate_patents]
        if public_patents:
            similarity_result = await services.gemini.score_patents(public_patents)
            scores = {item.patent_number.upper(): item.similarity_pct for item in similarity_result.similarities}
            selected = [patent for patent in candidate_patents if patent.patent_number in scores]
            if not selected:
                raise MalformedModelResponse("Gemini did not score retrieved public patents")
            selected.sort(key=lambda patent: scores[patent.patent_number], reverse=True)
        else:
            scores = {}
            selected = []
        assessment = await services.groq.aggregate_novelty(
            payload.description,
            {"retrieved_us_patents": public_patents, "similarity_scores": scores},
        )
        return NoveltyResult(
            patents=[
                PatentMatch(
                    title=patent.title,
                    patent_number=patent.patent_number,
                    date=patent.date,
                    similarity_pct=scores[patent.patent_number],
                    abstract_excerpt=patent.abstract_excerpt,
                    link=patent.link,
                )
                for patent in selected[:5]
            ],
            risk_score=assessment.risk_score,
            risk_label=assessment.risk_label,
            analysis=assessment.analysis,
        )
    except Exception:
        await refund_check(request, session_id)
        raise
