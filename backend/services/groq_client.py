"""Private-zone Groq client. Raw user input is only sent through this module."""

from __future__ import annotations

import json
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from backend.config import Settings
from backend.errors import ConfigurationError, MalformedModelResponse, UpstreamError
from backend.models.schemas import (
    AgentNarrative,
    ConceptsResponse,
    DraftResult,
    ExaminerReview,
    RebuttalNarrative,
    RiskAssessment,
    SearchPhrasesResponse,
)


ResultModel = TypeVar("ResultModel", bound=BaseModel)


class GroqClient:
    endpoint = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(self, settings: Settings) -> None:
        self._api_key = settings.groq_api_key
        self._model = settings.groq_model
        self._timeout = settings.model_timeout_seconds

    async def _json_completion(
        self, system: str, user: str, result_model: type[ResultModel]
    ) -> ResultModel:
        if not self._api_key:
            raise ConfigurationError("GROQ_API_KEY is missing")
        payload = {
            "model": self._model,
            "temperature": 0.2,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "response_format": {"type": "json_object"},
        }
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    self.endpoint,
                    headers={"Authorization": f"Bearer {self._api_key}", "Content-Type": "application/json"},
                    json=payload,
                )
                response.raise_for_status()
                content = response.json()["choices"][0]["message"]["content"]
            return result_model.model_validate(json.loads(content))
        except (httpx.HTTPError, KeyError, IndexError, TypeError) as error:
            raise UpstreamError("Groq request failed") from error
        except (json.JSONDecodeError, ValidationError) as error:
            raise MalformedModelResponse("Groq returned invalid structured data") from error

    async def extract_concepts(self, description: str) -> ConceptsResponse:
        return await self._json_completion(
            "You extract 3 to 5 concise, non-sensitive patent search concepts. Return JSON only: {concepts: string[]}.",
            description,
            ConceptsResponse,
        )

    async def generate_claims(self, description: str) -> DraftResult:
        return await self._json_completion(
            "You draft a patent-claim starting point, not legal advice. Return JSON only with non-empty independent_claims and dependent_claims arrays. Be technically specific and do not include markdown.",
            description,
            DraftResult,
        )

    async def aggregate_novelty(self, description: str, public_analysis: dict[str, object]) -> RiskAssessment:
        return await self._json_completion(
            "You assess US public-patent novelty risk. The user disclosure is private. Combine it with supplied public-record analysis. Return JSON only with risk_score (0-100), risk_label (Low, Caution, High, Critical), and a 2-3 sentence plain-English analysis. Do not claim legal clearance.",
            json.dumps({"description": description, "public_analysis": public_analysis}),
            RiskAssessment,
        )

    async def extract_search_phrases(self, content: str) -> SearchPhrasesResponse:
        return await self._json_completion(
            "Extract 3 or 4 distinctive searchable phrases from the supplied text or code. Return JSON only: {phrases: string[]}. Avoid secrets and keep each phrase under 100 characters.",
            content,
            SearchPhrasesResponse,
        )

    async def cross_ip_position(
        self, role: str, baseline_score: int, evidence: list[dict[str, object]]
    ) -> AgentNarrative:
        return await self._json_completion(
            f"You are the CrossIP {role} specialist. Reason only from the supplied retrieved public evidence. "
            f"The deterministic risk baseline is {baseline_score}/100; do not change it. Return JSON only with "
            "reasoning, confidence (0-1), and 1-3 evidence_ids copied exactly from the records. "
            "Never introduce a source or fact outside the records.",
            json.dumps({"baseline_score": baseline_score, "evidence": evidence}),
            AgentNarrative,
        )

    async def cross_ip_examiner(
        self, positions: list[dict[str, object]], evidence: list[dict[str, object]]
    ) -> ExaminerReview:
        return await self._json_completion(
            "You are the adversarial CrossIP Examiner Agent. Challenge only an understated or overstated "
            "specialist score when the supplied public evidence supports it. Return JSON only as {challenges:[{domain, "
            "message, evidence_ids, direction}]}. Use at most one challenge per domain, and copy evidence_ids exactly. "
            "Never retrieve or invent evidence.",
            json.dumps({"positions": positions, "evidence": evidence}),
            ExaminerReview,
        )

    async def cross_ip_rebuttal(
        self,
        role: str,
        current_score: int,
        objection: dict[str, object],
        evidence: list[dict[str, object]],
    ) -> RebuttalNarrative:
        return await self._json_completion(
            f"You are the CrossIP {role} specialist responding once to an Examiner objection. Reason only from "
            "the supplied public evidence. Return JSON only with reasoning, confidence, evidence_ids, and revised_score "
            "(0-100). Cite at least one exact evidence_id; do not invent sources.",
            json.dumps({"current_score": current_score, "objection": objection, "evidence": evidence}),
            RebuttalNarrative,
        )
