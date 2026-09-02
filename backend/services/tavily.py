"""Tavily public-web search client for patent, mark, and source discovery."""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlparse

import httpx

from backend.config import Settings
from backend.errors import ConfigurationError, UpstreamError


@dataclass(frozen=True)
class SearchResult:
    title: str
    url: str
    content: str
    raw_content: str | None = None

    @property
    def host(self) -> str:
        return urlparse(self.url).netloc


class TavilyClient:
    endpoint = "https://api.tavily.com/search"

    def __init__(self, settings: Settings) -> None:
        self._api_key = settings.tavily_api_key
        self._timeout = settings.upstream_timeout_seconds

    async def search(
        self,
        query: str,
        count: int = 10,
        *,
        include_domains: tuple[str, ...] = (),
        include_raw_content: bool = False,
    ) -> list[SearchResult]:
        if not self._api_key:
            raise ConfigurationError("TAVILY_API_KEY is missing")
        payload: dict[str, object] = {
            "query": query,
            "search_depth": "basic",
            "max_results": min(count, 20),
            "include_answer": False,
            "include_raw_content": "text" if include_raw_content else False,
        }
        if include_domains:
            payload["include_domains"] = list(include_domains)
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    self.endpoint,
                    headers={"Authorization": f"Bearer {self._api_key}", "Content-Type": "application/json"},
                    json=payload,
                )
                response.raise_for_status()
                records = response.json().get("results", [])
        except (httpx.HTTPError, ValueError) as error:
            raise UpstreamError("Tavily Search request failed") from error
        return [
            SearchResult(
                title=str(record.get("title") or "Untitled public result"),
                url=str(record.get("url") or ""),
                content=str(record.get("content") or ""),
                raw_content=str(record["raw_content"]) if record.get("raw_content") else None,
            )
            for record in records
            if isinstance(record, dict) and record.get("url")
        ]
