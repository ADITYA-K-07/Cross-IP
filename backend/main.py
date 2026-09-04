"""FastAPI application entry point for the CrossIP local MVP."""

from __future__ import annotations

import logging
from types import SimpleNamespace

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import Settings
from backend.errors import PublicServiceError
from backend.middleware.rate_limit import SessionUsageStore, get_or_create_session_id
from backend.models.schemas import UsageResponse
from backend.routers import copyright, cross_ip, draft, novelty, trademark
from backend.services.gemini import GeminiClient
from backend.services.groq_client import GroqClient
from backend.services.logo_similarity import LocalClipLogoMatcher
from backend.services.tavily import TavilyClient


logger = logging.getLogger("CrossIP")


def _validation_message(error: RequestValidationError) -> str:
    first = error.errors()[0] if error.errors() else {}
    context_error = first.get("ctx", {}).get("error")
    if context_error:
        return str(context_error)
    return "Invalid request."


def create_app(settings: Settings | None = None, services: object | None = None) -> FastAPI:
    settings = settings or Settings.from_env()
    app = FastAPI(title="CrossIP API", version="0.1.0")
    app.state.settings = settings
    app.state.usage_store = SessionUsageStore(limit=5)
    app.state.services = services or SimpleNamespace(
        tavily=TavilyClient(settings),
        groq=GroqClient(settings),
        gemini=GeminiClient(settings),
        logo_similarity=LocalClipLogoMatcher(),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, error: RequestValidationError) -> JSONResponse:
        message = _validation_message(error)
        return JSONResponse(status_code=400, content={"error": message, "detail": "Request validation failed", "status": 400})

    @app.exception_handler(HTTPException)
    async def http_error_handler(_: Request, error: HTTPException) -> JSONResponse:
        message = str(error.detail) if isinstance(error.detail, str) else "Request failed."
        body: dict[str, object] = {"error": message, "detail": message, "status": error.status_code}
        if error.status_code == 429:
            body["upgrade_url"] = "/pricing"
        return JSONResponse(status_code=error.status_code, content=body)

    @app.exception_handler(PublicServiceError)
    async def service_error_handler(_: Request, error: PublicServiceError) -> JSONResponse:
        logger.warning("analysis service error: %s", type(error).__name__)
        return JSONResponse(
            status_code=error.status_code,
            content={"error": error.public_message, "detail": "Upstream analysis request failed", "status": error.status_code},
        )

    @app.exception_handler(Exception)
    async def unexpected_error_handler(_: Request, error: Exception) -> JSONResponse:
        logger.exception("unexpected API error: %s", type(error).__name__)
        return JSONResponse(
            status_code=500,
            content={"error": "An unexpected server error occurred. Please try again.", "detail": "Internal server error", "status": 500},
        )

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/usage", response_model=UsageResponse)
    async def usage(request: Request, response: Response) -> UsageResponse:
        session_id = get_or_create_session_id(request, response, settings)
        remaining = await app.state.usage_store.remaining(session_id)
        return UsageResponse(limit=5, remaining=remaining)

    app.include_router(novelty.router)
    app.include_router(draft.router)
    app.include_router(trademark.router)
    app.include_router(copyright.router)
    app.include_router(cross_ip.router)
    return app


app = create_app()
