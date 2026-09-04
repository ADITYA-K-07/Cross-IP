import { CopyrightResult, CrossIpEventName, CrossIpReport, DraftResult, NoveltyResult, TrademarkResult } from "./types";

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
    throw new ApiError("The CrossIP backend is not configured. Set NEXT_PUBLIC_API_URL and try again.", 503);
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

export interface CrossIpSubmission {
  description: string;
  brandName: string;
  content: string;
  logo: File;
}

export async function streamCrossIpReport(
  submission: CrossIpSubmission,
  onEvent: (event: CrossIpEventName, payload: unknown) => void,
): Promise<void> {
  const form = new FormData();
  form.set("description", submission.description);
  form.set("brand_name", submission.brandName);
  form.set("content", submission.content);
  form.set("logo", submission.logo);
  const response = await fetch(endpoint("/api/cross-ip-report/stream"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!response.ok || !response.body) throw await errorFrom(response);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const event = block.match(/^event: (.+)$/m)?.[1] as CrossIpEventName | undefined;
      const serialized = block.match(/^data: (.+)$/m)?.[1];
      if (event && serialized) onEvent(event, JSON.parse(serialized));
    }
    if (done) break;
  }
}

export async function downloadCrossIpPdf(report: CrossIpReport): Promise<void> {
  const response = await fetch(endpoint("/api/cross-ip-report/pdf"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });
  if (!response.ok) throw await errorFrom(response);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "CrossIP-cross-ip-report.pdf";
  link.click();
  URL.revokeObjectURL(url);
}
