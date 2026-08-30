import {
  demoCopyrightResult,
  demoDraftResult,
  demoNoveltyResult,
  demoTrademarkResult,
} from "./mockResults";
import {
  CopyrightResult,
  DraftResult,
  NoveltyResult,
  TrademarkResult,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class RateLimitError extends Error {
  constructor(message = "Free tier limit reached") {
    super(message);
    this.name = "RateLimitError";
  }
}

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 700));
}

async function postJson<T>(
  path: string,
  body: Record<string, string | boolean>,
  fallback: T,
): Promise<T> {
  if (!API_URL) {
    await delay();
    return fallback;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        let message = "Free tier limit reached";
        try {
          const data = (await response.json()) as { error?: string; detail?: string };
          message = data.error ?? data.detail ?? message;
        } catch {
          message = (await response.text()) || message;
        }
        throw new RateLimitError(message);
      }

      const text = await response.text();
      throw new Error(text || "Request failed");
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    await delay();
    return fallback;
  }
}

export function checkNovelty(description: string): Promise<NoveltyResult> {
  return postJson("/api/novelty", { description }, demoNoveltyResult);
}

export function generateClaims(description: string): Promise<DraftResult> {
  return postJson("/api/draft", { description }, demoDraftResult);
}

export function scanTrademark(
  brand_name: string,
  phonetic: boolean,
): Promise<TrademarkResult> {
  return postJson(
    "/api/trademark",
    { brand_name, phonetic },
    demoTrademarkResult,
  );
}

export function checkCopyright(content: string): Promise<CopyrightResult> {
  return postJson("/api/copyright", { content }, demoCopyrightResult);
}
