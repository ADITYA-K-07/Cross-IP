"""US public patent discovery through Tavily-indexed Google Patents results.

PatentsView now requires an API key, so this service deliberately uses the
already-configured Tavily Search API instead of implying a keyless USPTO source.
"""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass

from backend.services.tavily import SearchResult, TavilyClient


US_PATENT_PATH = re.compile(r"/patent/(US[0-9A-Z]+)/?", re.IGNORECASE)


@dataclass(frozen=True)
class PublicPatent:
    title: str
    patent_number: str
    date: str
    abstract_excerpt: str
    link: str

    def public_record(self) -> dict[str, str]:
        return {
            "title": self.title,
            "patent_number": self.patent_number,
            "date": self.date,
            "abstract_excerpt": self.abstract_excerpt,
            "link": self.link,
        }


def _from_result(result: SearchResult) -> PublicPatent | None:
    match = US_PATENT_PATH.search(result.url)
    if not match:
        return None
    snippets = result.content.strip()
    return PublicPatent(
        title=result.title.replace(" - Google Patents", "").strip(),
        patent_number=match.group(1).upper(),
        date="Publication date unavailable",
        abstract_excerpt=snippets[:900] or "Public abstract excerpt unavailable.",
        link=result.url,
    )


async def discover_us_patents(tavily: TavilyClient, concepts: list[str]) -> list[PublicPatent]:
    searches = await asyncio.gather(
        *[
            tavily.search(concept, count=8, include_domains=("patents.google.com",))
            for concept in concepts
        ]
    )
    deduplicated: dict[str, PublicPatent] = {}
    for results in searches:
        for result in results:
            patent = _from_result(result)
            if patent:
                deduplicated.setdefault(patent.patent_number, patent)
    return list(deduplicated.values())[:20]
