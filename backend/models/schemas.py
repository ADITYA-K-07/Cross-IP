"""The API models mirror frontend/components/ip/types.ts exactly."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator


def _validated_text(value: str, field_name: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError(f"Please enter a {field_name}.")
    if len(cleaned) < 20:
        raise ValueError(
            "Describe your invention in at least 20 characters — more detail means better results."
        )
    if len(cleaned) > 5000:
        raise ValueError("Input too long. Please keep it under 5000 characters.")
    return cleaned


class DescriptionRequest(BaseModel):
    description: str

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        return _validated_text(value, "description")


class CopyrightRequest(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        return _validated_text(value, "content")


class TrademarkRequest(BaseModel):
    brand_name: str
    phonetic: bool = True

    @field_validator("brand_name")
    @classmethod
    def validate_brand_name(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("Please enter a brand name with at least 2 characters.")
        if len(cleaned) > 200:
            raise ValueError("Brand name is too long. Please keep it under 200 characters.")
        return cleaned


class UsageResponse(BaseModel):
    limit: int = 5
    remaining: int = Field(ge=0, le=5)


class PatentMatch(BaseModel):
    title: str
    patent_number: str
    date: str
    similarity_pct: int = Field(ge=0, le=100)
    abstract_excerpt: str
    link: str


class NoveltyResult(BaseModel):
    patents: list[PatentMatch]
    risk_score: int = Field(ge=0, le=100)
    risk_label: Literal["Low", "Caution", "High", "Critical"]
    analysis: str


class DraftResult(BaseModel):
    independent_claims: list[str] = Field(min_length=1)
    dependent_claims: list[str] = Field(min_length=1)


class TrademarkMatch(BaseModel):
    name: str
    match_type: Literal["exact", "phonetic", "similar spelling", "public result"]
    similarity_pct: int = Field(ge=0, le=100)
    category: str | None = None
    registry: str | None = None
    source_url: str


class TrademarkResult(BaseModel):
    matches: list[TrademarkMatch]
    risk_level: Literal["Low", "Medium", "High", "Critical"]
    explanation: str


class CopyrightMatch(BaseModel):
    url: str
    title: str
    excerpt: str
    similarity_pct: int = Field(ge=0, le=100)


class CopyrightResult(BaseModel):
    matches: list[CopyrightMatch]
    overall_risk: Literal["Low", "Medium", "High", "Critical"]
    risk_label: Literal["Low", "Medium", "High", "Critical"]


class ConceptsResponse(BaseModel):
    concepts: list[str] = Field(min_length=3, max_length=5)


class SearchPhrasesResponse(BaseModel):
    phrases: list[str] = Field(min_length=3, max_length=4)


class PatentSimilarity(BaseModel):
    patent_number: str
    similarity_pct: int = Field(ge=0, le=100)


class PatentSimilarityResponse(BaseModel):
    similarities: list[PatentSimilarity]


class RiskAssessment(BaseModel):
    risk_score: int = Field(ge=0, le=100)
    risk_label: Literal["Low", "Caution", "High", "Critical"]
    analysis: str = Field(min_length=20, max_length=700)


class PublicRiskAssessment(BaseModel):
    risk_level: Literal["Low", "Medium", "High", "Critical"]
    explanation: str = Field(min_length=10, max_length=500)


CrossIpDomain = Literal["patent", "trademark", "copyright"]
CrossIpRiskLabel = Literal["Low", "Moderate", "High", "Critical"]


class CrossIpEvidence(BaseModel):
    source_id: str = Field(min_length=3, max_length=160)
    title: str = Field(min_length=1, max_length=240)
    excerpt: str = Field(min_length=1, max_length=900)
    relevance: float = Field(ge=0, le=1)
    url: str | None = None


class AgentNarrative(BaseModel):
    reasoning: str = Field(min_length=10, max_length=700)
    confidence: float = Field(ge=0, le=1)
    evidence_ids: list[str] = Field(min_length=1, max_length=3)


class ExaminerChallenge(BaseModel):
    domain: CrossIpDomain
    message: str = Field(min_length=10, max_length=700)
    evidence_ids: list[str] = Field(min_length=1, max_length=3)
    direction: Literal["increase", "decrease"]


class ExaminerReview(BaseModel):
    challenges: list[ExaminerChallenge] = Field(default_factory=list, max_length=3)


class RebuttalNarrative(AgentNarrative):
    revised_score: int = Field(ge=0, le=100)


class CrossIpDomainResult(BaseModel):
    domain: CrossIpDomain
    agent_name: str
    initial_score: int = Field(ge=0, le=100)
    score: int = Field(ge=0, le=100)
    confidence: float = Field(ge=0, le=1)
    reasoning: str = Field(min_length=10, max_length=700)
    evidence_ids: list[str] = Field(min_length=1, max_length=3)
    revision_reason: str | None = Field(default=None, max_length=700)
    visual_evidence_available: bool | None = None


class DebateEntry(BaseModel):
    round: int = Field(ge=1, le=3)
    kind: Literal["position", "objection", "rebuttal"]
    agent: str
    domain: CrossIpDomain | None = None
    message: str = Field(min_length=10, max_length=900)
    evidence_ids: list[str] = Field(default_factory=list, max_length=3)


class InnovationGapFeature(BaseModel):
    feature: str = Field(min_length=1, max_length=160)
    status: Literal["overlap", "gap"]
    evidence_ids: list[str] = Field(default_factory=list, max_length=3)


class CrossIpReport(BaseModel):
    unified_score: int = Field(ge=0, le=100)
    risk_label: CrossIpRiskLabel
    executive_summary: str = Field(min_length=20, max_length=1000)
    domains: list[CrossIpDomainResult] = Field(min_length=3, max_length=3)
    transcript: list[DebateEntry] = Field(min_length=3, max_length=10)
    evidence: list[CrossIpEvidence] = Field(min_length=1, max_length=20)
    opinions_and_tips: list[str] = Field(min_length=2, max_length=4)
    innovation_gap_map: list[InnovationGapFeature] = Field(min_length=1, max_length=5)
    is_demo_fallback: bool = False


class CrossIpPdfRequest(BaseModel):
    report: CrossIpReport
