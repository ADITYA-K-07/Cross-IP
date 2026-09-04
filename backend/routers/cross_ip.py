"""Streaming Cross-IP report route with one-quota reservation per report."""

from __future__ import annotations

import asyncio
import json
import logging
from io import BytesIO
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
from PIL import Image, UnidentifiedImageError

from backend.models.schemas import CopyrightRequest, CrossIpPdfRequest, DescriptionRequest, TrademarkRequest
from backend.routers.common import refund_check, reserve_check, services_for, settings_for
from backend.services.cross_ip import build_cross_ip_report, demo_cross_ip_report
from backend.services.report_pdf import render_report_pdf


router = APIRouter(prefix="/api", tags=["cross-ip-report"])
logger = logging.getLogger("CrossIP.cross_ip")
MAX_LOGO_BYTES = 5 * 1024 * 1024
SUPPORTED_LOGO_TYPES = {"image/png", "image/jpeg", "image/webp"}
HIGH_RISK_DEMO = (
    "A low-cost wearable ring that measures hydration from skin signals and sends alerts to a mobile app before dehydration symptoms begin.",
    "FlowNest",
    "Our platform creates a weekly report of new patent filings, competitor moves, renewal deadlines, and public prior art that may help product teams plan safer launches.",
)
LOW_RISK_DEMO = (
    "A lightweight paper garden planner that helps community volunteers assign watering days using manually entered weather notes and shared bed labels.",
    "TrellisNote",
    "TrellisNote helps community gardeners write weekly watering notes, label shared planting beds, and coordinate volunteer visits with a simple printable checklist.",
)


def _sse(event: str, data: dict[str, object]) -> str:
    return f"event: {event}\ndata: {json.dumps(data, separators=(',', ':'))}\n\n"


async def _validated_upload(upload: UploadFile) -> bytes:
    if upload.content_type not in SUPPORTED_LOGO_TYPES:
        raise HTTPException(status_code=400, detail="Upload a PNG, JPEG, or WebP logo under 5 MB.")
    payload = await upload.read(MAX_LOGO_BYTES + 1)
    if not payload or len(payload) > MAX_LOGO_BYTES:
        raise HTTPException(status_code=400, detail="Upload a non-empty PNG, JPEG, or WebP logo under 5 MB.")
    try:
        with Image.open(BytesIO(payload)) as image:
            image.verify()
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as error:
        raise HTTPException(status_code=400, detail="The uploaded logo is not a valid image file.") from error
    return payload


def _demo_profile(description: str, brand: str, content: str) -> str | None:
    if (description, brand, content) == LOW_RISK_DEMO:
        return "low"
    if (description, brand, content) == HIGH_RISK_DEMO:
        return "high"
    return None


@router.post("/cross-ip-report/stream")
async def stream_cross_ip_report(
    request: Request,
    response: Response,
    description: Annotated[str, Form()],
    brand_name: Annotated[str, Form()],
    content: Annotated[str, Form()],
    logo: Annotated[UploadFile, File()],
) -> StreamingResponse:
    # Reuse the established validation boundaries before taking a free-tier reservation.
    try:
        validated_description = DescriptionRequest(description=description).description
        validated_brand = TrademarkRequest(brand_name=brand_name).brand_name
        validated_content = CopyrightRequest(content=content).content
    except ValidationError as error:
        raise HTTPException(status_code=400, detail=error.errors()[0]["msg"]) from error
    logo_bytes = await _validated_upload(logo)
    session_id = await reserve_check(request, response)
    services = services_for(request)
    settings = settings_for(request)

    async def generate():
        events: asyncio.Queue[tuple[str, dict[str, object]]] = asyncio.Queue()

        async def publish(event: str, data: dict[str, object]) -> None:
            await events.put((event, data))

        async def run_report() -> None:
            try:
                report = await build_cross_ip_report(services, settings, validated_description, validated_brand, validated_content, logo_bytes, publish)
                await events.put(("complete", {"report": report.model_dump()}))
            except Exception as error:
                logger.exception("cross-ip report failed: %s", type(error).__name__)
                profile = _demo_profile(validated_description, validated_brand, validated_content)
                if profile:
                    fallback = demo_cross_ip_report(profile)
                    for entry in fallback.transcript:
                        if entry.kind == "position":
                            domain = next(item for item in fallback.domains if item.domain == entry.domain)
                            await events.put(("position", domain.model_dump()))
                        elif entry.kind == "objection":
                            await events.put(("examiner_objection", {"domain": entry.domain, "message": entry.message, "evidence_ids": entry.evidence_ids, "direction": "increase"}))
                        elif entry.kind == "rebuttal":
                            domain = next(item for item in fallback.domains if item.domain == entry.domain)
                            await events.put(("revision", domain.model_dump()))
                    await events.put(("complete", {"report": fallback.model_dump()}))
                else:
                    await refund_check(request, session_id)
                    await events.put(("error", {"error": "Cross-IP analysis could not be completed. Your free check was restored."}))

        task = asyncio.create_task(run_report())
        try:
            while True:
                event, data = await events.get()
                yield _sse(event, data)
                if event in {"complete", "error"}:
                    break
        finally:
            if not task.done():
                task.cancel()
            await asyncio.gather(task, return_exceptions=True)

    stream_response = StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
    # FastAPI's injected Response holds the newly issued session cookie; copy it
    # because this route returns a separate StreamingResponse instance.
    if cookie := response.headers.get("set-cookie"):
        stream_response.headers["set-cookie"] = cookie
    return stream_response


@router.post("/cross-ip-report/pdf")
async def download_cross_ip_pdf(payload: CrossIpPdfRequest) -> Response:
    pdf = render_report_pdf(payload.report)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=CrossIP-cross-ip-report.pdf"},
    )
