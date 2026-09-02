"""Private-zone Groq client. Raw user input is only sent through this module."""

from __future__ import annotations

import json
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from backend.config import Settings
from backend.errors import ConfigurationError, MalformedModelResponse, UpstreamError
from backend.models.schemas import ConceptsResponse, DraftResult, RiskAssessment, SearchPhrasesResponse


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
