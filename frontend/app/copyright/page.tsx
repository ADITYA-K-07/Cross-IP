"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyrightCard } from "@/components/ip/Cards";
import { ResultSkeleton } from "@/components/ip/LoadingStates";
import { RiskGauge } from "@/components/ip/RiskGauge";
import { UpgradeNudge } from "@/components/ip/UpgradeNudge";
import { RateLimitError, checkCopyright } from "@/components/ip/api";
import { demoInputs } from "@/components/ip/data";
import { useFreeChecks } from "@/components/ip/useFreeChecks";
import { useToast } from "@/components/ip/ToastProvider";
import { CopyrightResult } from "@/components/ip/types";

function riskToScore(level: string) {
  const normalized = level.toLowerCase();
  if (normalized.includes("critical")) return 90;
  if (normalized.includes("high")) return 75;
  if (normalized.includes("medium")) return 52;
  return 20;
}

export default function CopyrightPage() {
  const [content, setContent] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [result, setResult] = useState<CopyrightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { remainingChecks, consumeCheck } = useFreeChecks();
  const { showToast } = useToast();

  const runCheck = async () => {
    if (content.trim().length < 20) {
      setMessage("Please paste at least 20 characters.");
      showToast("warning", "Paste a little more text before checking.");
      return;
    }
    if (remainingChecks <= 0) {
      setMessage("Free tier limit reached. Open Pricing to see paid plans.");
      showToast("warning", "Free tier limit reached.");
      return;
    }

    setMessage("");
    setLoading(true);
    setResult(null);
    try {
      const nextResult = await checkCopyright(content.trim());
      setResult(nextResult);
      const usage = await consumeCheck();
      showToast("success", `Copy check complete. ${usage.remaining} checks left.`);
    } catch (error) {
      if (error instanceof RateLimitError) {
        setMessage("Free tier limit reached. Open Pricing to see paid plans.");
        showToast("warning", "Free tier limit reached.");
      } else {
        setMessage("Something went wrong. Please try again.");
        showToast("error", "Could not check for copies.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to dashboard
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-border-technical bg-white p-6">
          <p className="text-sm font-bold text-primary">Copyright Monitor</p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">Check text or code for copies</h1>
          <p className="mt-3 text-on-surface-variant">
            Paste public-facing text, documentation, or code snippets and look for similar sources.
          </p>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            maxLength={5000}
            className="mt-6 w-full resize-none rounded-lg border border-border-technical p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Paste text or code here..."
          />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <button type="button" onClick={() => setContent(demoInputs.copyright)} className="font-semibold text-primary">
              Use sample
            </button>
            <span>{content.length} / 5000</span>
          </div>
          {message && <p className="mt-3 text-sm font-semibold text-risk-high">{message}</p>}
          <button
            type="button"
            onClick={runCheck}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
              {loading ? "sync" : "copyright"}
            </span>
            {loading ? "Checking sources..." : "Check for copies"}
          </button>
          <UpgradeNudge items={["Trade secret monitor", "Weekly digest", "Open source checks"]} />
        </section>

        <section className="rounded-lg border border-border-technical bg-surface-container-low p-4">
          {loading && <ResultSkeleton />}
          {!loading && !result && (
            <div className="rounded-lg bg-white p-8 text-center text-on-surface-variant">
              Similar text and source links will appear here.
            </div>
          )}
          {result && (
            <div className="animate-[fade-in_200ms_ease-out] space-y-4">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <RiskGauge score={riskToScore(result.risk_label || result.overall_risk)} label={`${result.risk_label} risk`} />
                <div className="rounded-lg border border-border-technical bg-white p-5">
                  <h2 className="text-xl font-bold text-on-surface">Copy risk summary</h2>
                  <p className="mt-3 text-on-surface-variant">
                    We found {result.matches.length} possible public matches. Review each source before publishing or filing.
                  </p>
                </div>
              </div>
              {result.matches.map((match) => (
                <CopyrightCard key={match.url} match={match} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
