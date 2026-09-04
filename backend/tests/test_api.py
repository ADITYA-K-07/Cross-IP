from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace

from fastapi.testclient import TestClient
from PIL import Image

from backend.config import Settings
from backend.errors import UpstreamError
from backend.main import create_app
from backend.models.schemas import (
    ConceptsResponse,
    DraftResult,
    PatentSimilarity,
    PatentSimilarityResponse,
    PublicRiskAssessment,
    RiskAssessment,
    SearchPhrasesResponse,
)
from backend.services.tavily import SearchResult
from backend.services.cross_ip import demo_cross_ip_report


class FakeGroq:
    def __init__(self, should_fail: bool = False) -> None:
        self.should_fail = should_fail

    async def extract_concepts(self, description: str) -> ConceptsResponse:
        return ConceptsResponse(concepts=["wearable hydration sensor", "skin impedance", "dehydration alert"])

    async def generate_claims(self, description: str) -> DraftResult:
        if self.should_fail:
            raise UpstreamError("test failure")
        return DraftResult(independent_claims=["A system comprising a sensor and controller."], dependent_claims=["The system of claim 1, wherein the sensor is wearable."])

    async def aggregate_novelty(self, description: str, public_analysis: dict[str, object]) -> RiskAssessment:
        return RiskAssessment(risk_score=41, risk_label="Caution", analysis="Public US patent records include related wearable sensing concepts. Review the listed records with a patent professional before filing.")

    async def extract_search_phrases(self, content: str) -> SearchPhrasesResponse:
        return SearchPhrasesResponse(phrases=["distinctive source phrase", "copyright candidate phrase", "public matching text"])


class FakeGemini:
    def __init__(self) -> None:
        self.patent_payload: list[dict[str, str]] | None = None

    async def score_patents(self, public_patents: list[dict[str, str]]) -> PatentSimilarityResponse:
        self.patent_payload = public_patents
        return PatentSimilarityResponse(similarities=[PatentSimilarity(patent_number="US1234567B1", similarity_pct=73)])

    async def classify_public_results(self, public_results: list[dict[str, object]]) -> PublicRiskAssessment:
        return PublicRiskAssessment(risk_level="Medium", explanation="The public results include potentially similar names or text that merit review.")


class FakeTavily:
    async def search(self, query: str, count: int = 10, *, include_domains: tuple[str, ...] = (), include_raw_content: bool = False) -> list[SearchResult]:
        if "patents.google.com" in include_domains:
            return [SearchResult("Wearable hydration sensor - Google Patents", "https://patents.google.com/patent/US1234567B1/en", "A wearable sensor measures hydration using skin impedance.")]
        if "trademark" in query:
            return [SearchResult("FlowNest trademark record", "https://example.test/flownest", "A public mark listing.")]
        return [SearchResult("Matching source", "https://example.test/source", "Public matching text.", "Prefix distinctive source phrase and enough remaining content to look like a matching public source.")]


def client(should_fail: bool = False) -> tuple[TestClient, FakeGemini]:
    gemini = FakeGemini()
    settings = Settings(None, None, None, "fake-groq", "fake-gemini", ("http://localhost:3000",), 1, False, "lax")
    app = create_app(settings, SimpleNamespace(groq=FakeGroq(should_fail), gemini=gemini, tavily=FakeTavily()))
    return TestClient(app), gemini


def test_health_usage_and_rate_limit() -> None:
    api, _ = client()
    assert api.get("/health").json() == {"status": "ok"}
    assert api.get("/api/usage").json() == {"limit": 5, "remaining": 5}
    for _ in range(5):
        response = api.post("/api/draft", json={"description": "A detailed sensor system with a controller and a calibration workflow."})
        assert response.status_code == 200
    limited = api.post("/api/draft", json={"description": "A detailed sensor system with a controller and a calibration workflow."})
    assert limited.status_code == 429
    assert limited.json()["upgrade_url"] == "/pricing"


def test_validation_and_refund_after_upstream_failure() -> None:
    api, _ = client(should_fail=True)
    invalid = api.post("/api/draft", json={"description": "too short"})
    assert invalid.status_code == 400
    assert invalid.json()["error"].startswith("Describe your invention")
    failed = api.post("/api/draft", json={"description": "A detailed sensor system with a controller and a calibration workflow."})
    assert failed.status_code == 502
    assert api.get("/api/usage").json()["remaining"] == 5


def test_novelty_contract_and_gemini_privacy_boundary() -> None:
    api, gemini = client()
    disclosure = "A wearable ring measures hydration through skin impedance and sends an early dehydration alert."
    response = api.post("/api/novelty", json={"description": disclosure})
    assert response.status_code == 200
    body = response.json()
    assert body["risk_label"] == "Caution"
    assert body["patents"][0]["patent_number"] == "US1234567B1"
    assert gemini.patent_payload is not None
    assert disclosure not in str(gemini.patent_payload)


def test_trademark_contract() -> None:
    api, _ = client()
    response = api.post("/api/trademark", json={"brand_name": "FlowNest", "phonetic": True})
    assert response.status_code == 200
    body = response.json()
    assert body["matches"]
    assert body["risk_level"] == "Medium"


def test_copyright_contract() -> None:
    api, _ = client()
    response = api.post("/api/copyright", json={"content": "A distinctive source phrase appears in this sufficiently long content for a copyright check."})
    assert response.status_code == 200
    assert response.json()["risk_label"] == "Medium"


def test_cross_ip_stream_quota_and_pdf_export() -> None:
    api, gemini = client()
    response = api.post(
        "/api/cross-ip-report/stream",
        data={
            "description": "A wearable ring measures hydration through skin impedance and sends an early dehydration alert.",
            "brand_name": "FlowNest",
            "content": "A distinctive source phrase appears in this sufficiently long content for a copyright check.",
        },
        files={"logo": ("logo.png", _valid_png(), "image/png")},
    )
    assert response.status_code == 200
    assert "event: position" in response.text
    assert "event: examiner_objection" in response.text
    assert "event: revision" in response.text
    assert "event: complete" in response.text
    assert api.get("/api/usage").json()["remaining"] == 4
    assert gemini.patent_payload is not None
    assert "wearable ring" not in str(gemini.patent_payload).lower()

    pdf = api.post("/api/cross-ip-report/pdf", json={"report": demo_cross_ip_report().model_dump()})
    assert pdf.status_code == 200
    assert pdf.headers["content-type"].startswith("application/pdf")
    assert pdf.content.startswith(b"%PDF")


def test_cross_ip_rejects_non_image_upload_without_charging_quota() -> None:
    api, _ = client()
    response = api.post(
        "/api/cross-ip-report/stream",
        data={
            "description": "A wearable ring measures hydration through skin impedance and sends an early dehydration alert.",
            "brand_name": "FlowNest",
            "content": "A distinctive source phrase appears in this sufficiently long content for a copyright check.",
        },
        files={"logo": ("logo.png", b"not an image", "image/png")},
    )
    assert response.status_code == 400
    assert "not a valid image" in response.json()["error"]
    assert api.get("/api/usage").json()["remaining"] == 5


def test_cross_ip_exact_demo_uses_cached_transcript_after_live_failure() -> None:
    class FailingGroq(FakeGroq):
        async def extract_concepts(self, description: str) -> ConceptsResponse:
            raise UpstreamError("demo upstream failure")

    api, _ = client()
    api.app.state.services.groq = FailingGroq()
    response = api.post(
        "/api/cross-ip-report/stream",
        data={
            "description": "A low-cost wearable ring that measures hydration from skin signals and sends alerts to a mobile app before dehydration symptoms begin.",
            "brand_name": "FlowNest",
            "content": "Our platform creates a weekly report of new patent filings, competitor moves, renewal deadlines, and public prior art that may help product teams plan safer launches.",
        },
        files={"logo": ("logo.png", _valid_png(), "image/png")},
    )
    assert response.status_code == 200
    assert "event: examiner_objection" in response.text
    assert '"is_demo_fallback":true' in response.text
    assert api.get("/api/usage").json()["remaining"] == 4


def test_cross_ip_demo_profiles_show_distinct_risk_ranges() -> None:
    assert demo_cross_ip_report("low").unified_score < 45
    assert demo_cross_ip_report("high").unified_score > 50


def _valid_png() -> bytes:
    # A one-pixel transparent PNG. The route verifies actual image data, not only the MIME type.
    output = BytesIO()
    Image.new("RGBA", (1, 1), (124, 58, 237, 255)).save(output, format="PNG")
    return output.getvalue()
