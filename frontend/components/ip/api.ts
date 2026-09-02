import { CopyrightResult, DraftResult, NoveltyResult, TrademarkResult } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export interface UsageResult {
  limit: number;
  remaining: number;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message = "Free tier limit reached") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

function endpoint(path: string) {
  if (!API_URL) {
    throw new ApiError("The IPSentinel backend is not configured. Set NEXT_PUBLIC_API_URL and try again.", 503);
  }
  return `${API_URL}${path}`;
}

async function errorFrom(response: Response): Promise<ApiError> {
  let message = "Request failed";
  try {
    const data = (await response.json()) as { error?: string; detail?: string };
    message = data.error ?? data.detail ?? message;
  } catch {
    message = (await response.text()) || message;
  }
  return response.status === 429 ? new RateLimitError(message) : new ApiError(message, response.status);
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) throw await errorFrom(response);
  return (await response.json()) as T;
}

function postJson<T>(path: string, body: Record<string, string | boolean>): Promise<T> {
  return requestJson<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function getUsage(): Promise<UsageResult> {
  return requestJson<UsageResult>("/api/usage", { method: "GET" });
}

export function checkNovelty(description: string): Promise<NoveltyResult> {
  return postJson("/api/novelty", { description });
}

export function generateClaims(description: string): Promise<DraftResult> {
  return postJson("/api/draft", { description });
}

export function scanTrademark(brand_name: string, phonetic: boolean): Promise<TrademarkResult> {
  return postJson("/api/trademark", { brand_name, phonetic });
}

export function checkCopyright(content: string): Promise<CopyrightResult> {
  return postJson("/api/copyright", { content });
}
