"""Private, local logo comparison against public trademark candidate imagery."""

from __future__ import annotations

import asyncio
import ipaddress
import re
import socket
from dataclasses import dataclass
from typing import Iterable
from urllib.parse import urljoin, urlparse

import httpx


MAX_IMAGE_BYTES = 5 * 1024 * 1024
_OG_IMAGE = re.compile(r"<meta[^>]+(?:property|name)=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)", re.IGNORECASE)


@dataclass(frozen=True)
class LogoComparison:
    available: bool
    similarity_pct: int | None = None
    source_id: str | None = None


def _is_public_http_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return False
    if parsed.port not in {None, 80, 443}:
        return False
    try:
        addresses = socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM)
        return bool(addresses) and all(not ipaddress.ip_address(item[4][0]).is_private and not ipaddress.ip_address(item[4][0]).is_loopback and not ipaddress.ip_address(item[4][0]).is_link_local for item in addresses)
    except (OSError, ValueError):
        return False


class LocalClipLogoMatcher:
    """Loads CLIP only when a real visual comparison is requested."""

    def __init__(self, timeout_seconds: float = 8.0) -> None:
        self._timeout = timeout_seconds
        self._model: object | None = None
        self._load_lock = asyncio.Lock()

    async def compare(self, upload: bytes, candidates: Iterable[tuple[str, str]]) -> LogoComparison:
        public_images = await self._candidate_images(candidates)
        if not public_images:
            return LogoComparison(available=False)
        try:
            score, source_id = await asyncio.to_thread(self._clip_score, upload, public_images)
        except (ImportError, OSError, RuntimeError, ValueError):
            # The report explicitly says visual evidence is unavailable; it never substitutes a guessed score.
            return LogoComparison(available=False)
        return LogoComparison(available=True, similarity_pct=score, source_id=source_id)

    async def _candidate_images(self, candidates: Iterable[tuple[str, str]]) -> list[tuple[str, bytes]]:
        tasks = [self._logo_for_candidate(source_id, url) for source_id, url in list(candidates)[:3]]
        records = await asyncio.gather(*tasks, return_exceptions=True)
        return [record for record in records if isinstance(record, tuple)]

    async def _logo_for_candidate(self, source_id: str, page_url: str) -> tuple[str, bytes] | None:
        if not _is_public_http_url(page_url):
            return None
        async with httpx.AsyncClient(timeout=self._timeout, follow_redirects=False) as client:
            page = await client.get(page_url, headers={"User-Agent": "CrossIP/1.0 logo-evidence"})
            if page.is_redirect or page.status_code != 200:
                return None
            image_match = _OG_IMAGE.search(page.text[:200_000])
            if not image_match:
                return None
            image_url = urljoin(str(page.url), image_match.group(1).strip())
            if not _is_public_http_url(image_url):
                return None
            image = await client.get(image_url, headers={"User-Agent": "CrossIP/1.0 logo-evidence"})
            declared_size = int(image.headers.get("content-length", "0") or 0)
            if image.is_redirect or image.status_code != 200 or declared_size > MAX_IMAGE_BYTES or len(image.content) > MAX_IMAGE_BYTES:
                return None
            if not image.headers.get("content-type", "").lower().startswith("image/"):
                return None
            return source_id, image.content

    def _clip_score(self, upload: bytes, candidates: list[tuple[str, bytes]]) -> tuple[int, str]:
        from io import BytesIO

        from PIL import Image
        import torch
        from transformers import CLIPModel, CLIPProcessor

        if self._model is None:
            # A compact general-purpose model is sufficient for a demo and runs on CPU.
            # Never let a live report trigger a model download or a Hugging Face
            # network check. If the model is not pre-cached, compare() reports
            # visual evidence as unavailable instead of delaying the analysis.
            model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32", local_files_only=True)
            model.eval()
            self._model = (model, CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", local_files_only=True))
        model, processor = self._model  # type: ignore[misc]
        uploaded = Image.open(BytesIO(upload)).convert("RGB")
        images = [uploaded, *[Image.open(BytesIO(content)).convert("RGB") for _, content in candidates]]
        inputs = processor(images=images, return_tensors="pt")
        # Transformers 5 returns BaseModelOutputWithPooling here, whereas
        # earlier releases returned the projection tensor directly.
        with torch.inference_mode():
            image_output = model.get_image_features(**inputs)
        image_features = getattr(image_output, "pooler_output", image_output)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        similarities = (image_features[0] @ image_features[1:].T).tolist()
        index, similarity = max(enumerate(similarities), key=lambda item: item[1])
        return round(max(0.0, min(1.0, float(similarity))) * 100), candidates[index][0]
