"""Evidence-grounded orchestration for the unified Cross-IP report."""

from __future__ import annotations

import asyncio
import hashlib
import logging
from difflib import SequenceMatcher
from typing import Awaitable, Callable, Literal

import jellyfish

from backend.config import Settings
from backend.models.schemas import (
    AgentNarrative,
    CrossIpDomainResult,
    CrossIpEvidence,
    CrossIpReport,
    DebateEntry,
    ExaminerChallenge,
    ExaminerReview,
    InnovationGapFeature,
    RebuttalNarrative,
)
from backend.services.content import similarity_and_excerpt
from backend.services.logo_similarity import LogoComparison
from backend.services.patents import discover_us_patents
from backend.services.tavily import SearchResult


logger = logging.getLogger("CrossIP.cross_ip")
Domain = Literal["patent", "trademark", "copyright"]
AGENT_NAMES: dict[Domain, str] = {
    "patent": "Patent Agent",
    "trademark": "Trademark Agent",
    "copyright": "Copyright Agent",
}


def _risk_label(score: int) -> Literal["Low", "Moderate", "High", "Critical"]:
    if score < 25:
        return "Low"
    if score < 50:
        return "Moderate"
    if score < 75:
        return "High"
    return "Critical"


def _empty_evidence(domain: Domain) -> CrossIpEvidence:
    return CrossIpEvidence(
        source_id=f"{domain}:retrieval-none",
        title="No comparable public evidence retrieved",
        excerpt="The deterministic retrieval pipeline did not return a comparable public source for this domain.",
        relevance=0,
    )


def _valid_ids(ids: list[str], evidence_ids: set[str]) -> list[str]:
    return list(dict.fromkeys(source_id for source_id in ids if source_id in evidence_ids))[:3]


def _fallback_narrative(domain: Domain, score: int, evidence: list[CrossIpEvidence]) -> AgentNarrative:
    strongest = max(evidence, key=lambda item: item.relevance)
    return AgentNarrative(
        reasoning=f"The deterministic {domain} score is anchored to the strongest retrieved evidence: {strongest.title}.",
        confidence=round(min(0.92, 0.35 + strongest.relevance * 0.55), 2),
        evidence_ids=[strongest.source_id],
    )


async def _narrative(services: object, domain: Domain, score: int, evidence: list[CrossIpEvidence]) -> AgentNarrative:
    groq = getattr(services, "groq")
    if not hasattr(groq, "cross_ip_position"):
        return _fallback_narrative(domain, score, evidence)
    try:
        result = await groq.cross_ip_position(AGENT_NAMES[domain], score, [item.model_dump() for item in evidence])
        valid = _valid_ids(result.evidence_ids, {item.source_id for item in evidence})
        if valid:
            return result.model_copy(update={"evidence_ids": valid})
        logger.warning("%s position contained no valid evidence ids; using deterministic narrative", domain)
    except Exception as error:
        logger.warning("%s position model unavailable: %s", domain, type(error).__name__)
    return _fallback_narrative(domain, score, evidence)


async def _patent_evidence(services: object, description: str) -> tuple[list[CrossIpEvidence], int, list[InnovationGapFeature]]:
    concepts = await services.groq.extract_concepts(description)
    patents = await discover_us_patents(services.tavily, concepts.concepts)
    candidates = patents[:10]
    records = [patent.public_record() for patent in candidates]
    scores: dict[str, int] = {}
    if records:
        result = await services.gemini.score_patents(records)
        scores = {item.patent_number.upper(): item.similarity_pct for item in result.similarities}
    ranked = sorted((patent for patent in candidates if patent.patent_number in scores), key=lambda item: scores[item.patent_number], reverse=True)[:5]
    evidence = [
        CrossIpEvidence(
            source_id=f"patent:{patent.patent_number}",
            title=patent.title,
            excerpt=patent.abstract_excerpt[:700],
            relevance=scores[patent.patent_number] / 100,
            url=patent.link,
        )
        for patent in ranked
    ] or [_empty_evidence("patent")]
    percentages = [scores[patent.patent_number] for patent in ranked]
    peak = max(percentages, default=0)
    overlap = round(sum(percentages) / len(percentages)) if percentages else 0
    evidence_strength = min(100, len(ranked) * 20)
    # Public US records have known jurisdiction; dated records are currently not guaranteed by search snippets.
    score = round(0.30 * peak + 0.30 * overlap + 0.20 * evidence_strength + 0.10 * 50 + 0.10 * 100)
    gaps = [
        InnovationGapFeature(
            feature=concept,
            status="overlap" if evidence and evidence[0].relevance >= 0.5 else "gap",
            evidence_ids=[evidence[0].source_id] if evidence[0].relevance else [],
        )
        for concept in concepts.concepts[:5]
    ]
    return evidence, max(0, min(100, score)), gaps


def _trademark_variants(brand: str) -> list[str]:
    values = [brand, f"{brand} trademark", jellyfish.soundex(brand), jellyfish.metaphone(brand)]
    return list(dict.fromkeys(value for value in values if len(value) > 1))[:4]


def _trademark_evidence_from_result(brand: str, result: SearchResult) -> CrossIpEvidence:
    name = result.title.split(" - ", 1)[0].strip() or result.title
    spelling = round(100 * SequenceMatcher(None, brand.lower(), name.lower()).ratio())
    if brand.lower() in name.lower():
        score = max(90, spelling)
    elif jellyfish.metaphone(brand) == jellyfish.metaphone(name):
        score = max(65, spelling)
    else:
        score = spelling
    return CrossIpEvidence(
        source_id=f"trademark:{hashlib.sha256(result.url.encode()).hexdigest()[:16]}",
        title=name[:240],
        excerpt=(result.content or "Public trademark candidate returned by search.")[:700],
        relevance=score / 100,
        url=result.url,
    )


async def _trademark_evidence(
    services: object, brand: str, logo: bytes
) -> tuple[list[CrossIpEvidence], int, LogoComparison]:
    result_groups = await asyncio.gather(*[services.tavily.search(f"{query} trademark", count=5) for query in _trademark_variants(brand)])
    candidates: dict[str, CrossIpEvidence] = {}
    for result in (item for group in result_groups for item in group):
        candidate = _trademark_evidence_from_result(brand, result)
        current = candidates.get(result.url)
        if current is None or candidate.relevance > current.relevance:
            candidates[result.url] = candidate
    evidence = sorted(candidates.values(), key=lambda item: item.relevance, reverse=True)[:5] or [_empty_evidence("trademark")]
    matcher = getattr(services, "logo_similarity", None)
    visual = await matcher.compare(logo, [(item.source_id, item.url) for item in evidence if item.url]) if matcher else LogoComparison(available=False)
    name_score = round(max(item.relevance for item in evidence) * 100)
    visual_score = visual.similarity_pct or 0
    class_overlap = round(name_score * 0.65)  # Product context comes from the submitted invention, not from a fabricated registry class.
    registration_strength = round(max(item.relevance for item in evidence) * 100)
    score = round(0.40 * name_score + 0.30 * visual_score + 0.20 * class_overlap + 0.10 * registration_strength)
    return evidence, max(0, min(100, score)), visual


async def _copyright_evidence(services: object, content: str) -> tuple[list[CrossIpEvidence], int]:
    phrases = await services.groq.extract_search_phrases(content)
    result_groups = await asyncio.gather(*[services.tavily.search(f'"{phrase}"', count=4, include_raw_content=True) for phrase in phrases.phrases])
    sources = {result.url: result for group in result_groups for result in group}
    evidence: list[CrossIpEvidence] = []
    for result in list(sources.values())[:12]:
        similarity, excerpt = similarity_and_excerpt(content, result.raw_content or result.content)
        if similarity >= 10 and excerpt:
            evidence.append(CrossIpEvidence(
                source_id=f"copyright:{hashlib.sha256(result.url.encode()).hexdigest()[:16]}",
                title=result.title[:240],
                excerpt=excerpt[:700],
                relevance=similarity / 100,
                url=result.url,
            ))
    evidence = sorted(evidence, key=lambda item: item.relevance, reverse=True)[:5] or [_empty_evidence("copyright")]
    similarity_score = round(max(item.relevance for item in evidence) * 100)
    originality_signal = similarity_score
    score = round(0.50 * similarity_score + 0.30 * originality_signal + 0.20 * 50)
    return evidence, max(0, min(100, score))


def _deterministic_challenges(domains: dict[Domain, CrossIpDomainResult]) -> ExaminerReview:
    highest = max(domains.values(), key=lambda item: item.score)
    if highest.score < 20:
        return ExaminerReview(challenges=[])
    direction: Literal["increase", "decrease"] = "increase" if highest.score < 75 else "decrease"
    return ExaminerReview(challenges=[ExaminerChallenge(
        domain=highest.domain,
        direction=direction,
        message=f"The strongest cited evidence should be pressure-tested before relying on the {highest.domain} score.",
        evidence_ids=highest.evidence_ids[:1],
    )])


async def _examiner(services: object, domains: dict[Domain, CrossIpDomainResult], evidence: list[CrossIpEvidence]) -> ExaminerReview:
    groq = getattr(services, "groq")
    if not hasattr(groq, "cross_ip_examiner"):
        return _deterministic_challenges(domains)
    try:
        review = await groq.cross_ip_examiner([item.model_dump() for item in domains.values()], [item.model_dump() for item in evidence])
        valid_evidence = {item.source_id for item in evidence}
        challenges = [challenge.model_copy(update={"evidence_ids": _valid_ids(challenge.evidence_ids, valid_evidence)}) for challenge in review.challenges]
        challenges = [challenge for challenge in challenges if challenge.evidence_ids]
        return review.model_copy(update={"challenges": challenges})
    except Exception as error:
        logger.warning("examiner model unavailable: %s", type(error).__name__)
        return _deterministic_challenges(domains)


async def _rebuttal(
    services: object, challenge: ExaminerChallenge, domain_result: CrossIpDomainResult, domain_evidence: list[CrossIpEvidence]
) -> RebuttalNarrative:
    groq = getattr(services, "groq")
    if hasattr(groq, "cross_ip_rebuttal"):
        try:
            result = await groq.cross_ip_rebuttal(
                AGENT_NAMES[challenge.domain], domain_result.score, challenge.model_dump(), [item.model_dump() for item in domain_evidence]
            )
            valid = _valid_ids(result.evidence_ids, {item.source_id for item in domain_evidence})
            if valid:
                return result.model_copy(update={"evidence_ids": valid})
        except Exception as error:
            logger.warning("%s rebuttal model unavailable: %s", challenge.domain, type(error).__name__)
    adjustment = 6 if challenge.direction == "increase" else -6
    fallback = _fallback_narrative(challenge.domain, domain_result.score, domain_evidence)
    return RebuttalNarrative(**fallback.model_dump(), revised_score=max(0, min(100, domain_result.score + adjustment)))


async def build_cross_ip_report(
    services: object,
    settings: Settings,
    description: str,
    brand: str,
    content: str,
    logo: bytes,
    emit: Callable[[str, dict[str, object]], Awaitable[None]] | None = None,
) -> CrossIpReport:
    patent, trademark, copyright = await asyncio.gather(
        _patent_evidence(services, description), _trademark_evidence(services, brand, logo), _copyright_evidence(services, content)
    )
    patent_evidence, patent_score, gaps = patent
    trademark_evidence, trademark_score, visual = trademark
    copyright_evidence, copyright_score = copyright
    per_domain_evidence: dict[Domain, list[CrossIpEvidence]] = {
        "patent": patent_evidence, "trademark": trademark_evidence, "copyright": copyright_evidence,
    }
    narratives = await asyncio.gather(*[
        _narrative(services, domain, score, per_domain_evidence[domain])
        for domain, score in (("patent", patent_score), ("trademark", trademark_score), ("copyright", copyright_score))
    ])
    domains: dict[Domain, CrossIpDomainResult] = {}
    transcript: list[DebateEntry] = []
    for domain, score, narrative in zip(("patent", "trademark", "copyright"), (patent_score, trademark_score, copyright_score), narratives, strict=True):
        domains[domain] = CrossIpDomainResult(
            domain=domain,
            agent_name=AGENT_NAMES[domain],
            initial_score=score,
            score=score,
            confidence=narrative.confidence,
            reasoning=narrative.reasoning,
            evidence_ids=narrative.evidence_ids,
            visual_evidence_available=visual.available if domain == "trademark" else None,
        )
        transcript.append(DebateEntry(round=1, kind="position", agent=AGENT_NAMES[domain], domain=domain, message=narrative.reasoning, evidence_ids=narrative.evidence_ids))
        if emit:
            await emit("position", domains[domain].model_dump())
    all_evidence = [*patent_evidence, *trademark_evidence, *copyright_evidence]
    review = await _examiner(services, domains, all_evidence)
    for challenge in review.challenges:
        transcript.append(DebateEntry(round=2, kind="objection", agent="Examiner Agent", domain=challenge.domain, message=challenge.message, evidence_ids=challenge.evidence_ids))
        if emit:
            await emit("examiner_objection", challenge.model_dump())
        result = await _rebuttal(services, challenge, domains[challenge.domain], per_domain_evidence[challenge.domain])
        # The server, not the model, enforces that a revision remains grounded in domain evidence.
        valid_ids = _valid_ids(result.evidence_ids, {item.source_id for item in per_domain_evidence[challenge.domain]})
        if valid_ids:
            previous = domains[challenge.domain]
            domains[challenge.domain] = previous.model_copy(update={
                "score": result.revised_score,
                "confidence": result.confidence,
                "reasoning": result.reasoning,
                "evidence_ids": valid_ids,
                "revision_reason": result.reasoning,
            })
            transcript.append(DebateEntry(round=3, kind="rebuttal", agent=AGENT_NAMES[challenge.domain], domain=challenge.domain, message=result.reasoning, evidence_ids=valid_ids))
            if emit:
                await emit("revision", domains[challenge.domain].model_dump())
    unified = round(
        settings.cross_ip_patent_weight * domains["patent"].score
        + settings.cross_ip_trademark_weight * domains["trademark"].score
        + settings.cross_ip_copyright_weight * domains["copyright"].score
    )
    highest = max(domains.values(), key=lambda item: item.score)
    tips = [
        f"Prioritize the {highest.domain} domain: it is the highest resolved exposure at {highest.score}/100.",
        "Review each cited source before filing, launch, or publication; this is an early screening aid, not legal advice.",
        "Narrow the product description to the green innovation-gap features when planning a design-around.",
    ]
    if not visual.available:
        tips.append("No usable public logo image was available for visual comparison, so the trademark visual signal is marked unavailable.")
    return CrossIpReport(
        unified_score=unified,
        risk_label=_risk_label(unified),
        executive_summary=(
            f"The resolved Cross-IP screening result is {_risk_label(unified).lower()} risk at {unified}/100. "
            f"The primary exposure is {highest.domain} evidence, assessed by the specialist agents and pressure-tested by the Examiner Agent."
        ),
        domains=[domains["patent"], domains["trademark"], domains["copyright"]],
        transcript=transcript,
        evidence=all_evidence,
        opinions_and_tips=tips,
        innovation_gap_map=gaps or [InnovationGapFeature(feature="No feature map available", status="gap")],
    )


def demo_cross_ip_report(profile: str = "high") -> CrossIpReport:
    """A fixed, visibly marked report used only for the built-in sample text when live services fail."""
    if profile == "low":
        evidence = [
            CrossIpEvidence(source_id="patent:demo-none", title="No comparable patent match retrieved", excerpt="The demo retrieval set contains no closely comparable patent record.", relevance=0.12),
            CrossIpEvidence(source_id="trademark:demo-trellisnote", title="TrellisNote public candidate", excerpt="The demo dataset found a weakly related public name in an unrelated context.", relevance=0.22, url="https://example.test/trellisnote"),
            CrossIpEvidence(source_id="copyright:demo-garden", title="Garden planning source", excerpt="The demo source contains only general garden-planning wording.", relevance=0.18, url="https://example.test/garden"),
        ]
        domains = [
            CrossIpDomainResult(domain="patent", agent_name="Patent Agent", initial_score=28, score=28, confidence=0.66, reasoning="No retrieved patent evidence closely maps to the paper-based volunteer planning workflow.", evidence_ids=[evidence[0].source_id]),
            CrossIpDomainResult(domain="trademark", agent_name="Trademark Agent", initial_score=34, score=34, confidence=0.59, reasoning="The name evidence is weak and does not indicate a closely related public mark.", evidence_ids=[evidence[1].source_id], visual_evidence_available=False),
            CrossIpDomainResult(domain="copyright", agent_name="Copyright Agent", initial_score=27, score=27, confidence=0.61, reasoning="Only generic planning language overlaps with the retrieved public source.", evidence_ids=[evidence[2].source_id]),
        ]
        transcript = [DebateEntry(round=1, kind="position", agent=item.agent_name, domain=item.domain, message=item.reasoning, evidence_ids=item.evidence_ids) for item in domains]
        return CrossIpReport(
            unified_score=30,
            risk_label="Moderate",
            executive_summary="Demo fallback: the retrieved evidence suggests a lower Cross-IP screening risk. The result remains a screening aid and should be reviewed before a launch or filing.",
            domains=domains,
            transcript=transcript,
            evidence=evidence,
            opinions_and_tips=["Keep the workflow focused on its paper-based volunteer-planning distinction.", "Perform an official trademark registry review before adopting TrellisNote.", "Use original copy for public-facing garden-planning materials."],
            innovation_gap_map=[InnovationGapFeature(feature="Paper-based volunteer watering workflow", status="gap"), InnovationGapFeature(feature="Generic garden planning", status="overlap", evidence_ids=[evidence[2].source_id])],
            is_demo_fallback=True,
        )
    evidence = [
        CrossIpEvidence(source_id="patent:US1234567B1", title="Wearable hydration sensor", excerpt="A wearable sensor measures hydration using skin impedance.", relevance=0.73, url="https://patents.google.com/patent/US1234567B1/en"),
        CrossIpEvidence(source_id="trademark:demo-flownest", title="FlowNest trademark record", excerpt="A public trademark candidate returned by the demo dataset.", relevance=0.67, url="https://example.test/flownest"),
        CrossIpEvidence(source_id="copyright:demo-source", title="Matching public source", excerpt="A distinctive source phrase appears in a matching public source.", relevance=0.36, url="https://example.test/source"),
    ]
    domains = [
        CrossIpDomainResult(domain="patent", agent_name="Patent Agent", initial_score=61, score=67, confidence=0.79, reasoning="The retrieved patent discloses a closely related wearable hydration sensor.", evidence_ids=[evidence[0].source_id], revision_reason="The Examiner highlighted the overlap in the cited sensor evidence."),
        CrossIpDomainResult(domain="trademark", agent_name="Trademark Agent", initial_score=46, score=46, confidence=0.62, reasoning="The public name match warrants a registry review before launch.", evidence_ids=[evidence[1].source_id], visual_evidence_available=False),
        CrossIpDomainResult(domain="copyright", agent_name="Copyright Agent", initial_score=28, score=28, confidence=0.54, reasoning="The retrieved source shows a limited wording overlap.", evidence_ids=[evidence[2].source_id]),
    ]
    transcript = [
        DebateEntry(round=1, kind="position", agent=item.agent_name, domain=item.domain, message=item.reasoning, evidence_ids=item.evidence_ids)
        for item in domains
    ]
    transcript.extend([
        DebateEntry(round=2, kind="objection", agent="Examiner Agent", domain="patent", message="The patent overlap should receive more weight because it covers the core sensing method.", evidence_ids=[evidence[0].source_id]),
        DebateEntry(round=3, kind="rebuttal", agent="Patent Agent", domain="patent", message=domains[0].revision_reason or domains[0].reasoning, evidence_ids=[evidence[0].source_id]),
    ])
    return CrossIpReport(
        unified_score=51,
        risk_label="High",
        executive_summary="Demo fallback: the cited patent overlap is the strongest Cross-IP exposure, while trademark and copyright signals require review but are less severe.",
        domains=domains,
        transcript=transcript,
        evidence=evidence,
        opinions_and_tips=["Narrow the sensor-fusion implementation around the green gap features.", "Review the cited public trademark candidate before branding.", "Rewrite the matching public wording before publication."],
        innovation_gap_map=[InnovationGapFeature(feature="Sensor-fusion alert threshold", status="gap"), InnovationGapFeature(feature="Wearable hydration sensor", status="overlap", evidence_ids=[evidence[0].source_id])],
        is_demo_fallback=True,
    )
