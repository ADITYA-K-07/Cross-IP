"""The API models mirror frontend/components/ip/types.ts exactly."""

from __future__ import annotations

from typing import Literal

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

