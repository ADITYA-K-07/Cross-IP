"""Deterministic similarity for public content retrieved by Tavily."""

from __future__ import annotations

from difflib import SequenceMatcher
def similarity_and_excerpt(input_text: str, source_text: str) -> tuple[int, str]:
    if not source_text:
        return 0, ""
    match = SequenceMatcher(None, input_text.lower(), source_text.lower(), autojunk=False).find_longest_match(
        0, len(input_text), 0, len(source_text)
    )
    percentage = round(100 * match.size / max(len(input_text), 1))
    if match.size < 12:
        return percentage, ""
    start = max(0, match.b - 150)
    end = min(len(source_text), match.b + match.size + 150)
    return percentage, source_text[start:end]
