"""Errors that can safely be mapped to the public HTTP error contract."""

from __future__ import annotations


class PublicServiceError(Exception):
    status_code = 502
    public_message = "A required analysis service is unavailable. Please try again."

    def __init__(self, detail: str = "Upstream service failed") -> None:
        self.detail = detail
        super().__init__(detail)


class ConfigurationError(PublicServiceError):
    status_code = 503
    public_message = "This analysis service is not configured yet."


class UpstreamError(PublicServiceError):
    status_code = 502


class MalformedModelResponse(UpstreamError):
    public_message = "The analysis service returned an invalid response. Please retry."

