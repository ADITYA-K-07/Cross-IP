"use client";

import Link from "next/link";
import { useState } from "react";
import { PatentCard } from "@/components/ip/Cards";
import { ResultSkeleton } from "@/components/ip/LoadingStates";
import { RiskGauge } from "@/components/ip/RiskGauge";
import { UpgradeNudge } from "@/components/ip/UpgradeNudge";
import { RateLimitError, checkNovelty } from "@/components/ip/api";
import { demoInputs } from "@/components/ip/data";
import { useFreeChecks } from "@/components/ip/useFreeChecks";
import { useToast } from "@/components/ip/ToastProvider";
import { NoveltyResult } from "@/components/ip/types";

export default function NoveltyPage() {
  const [description, setDescription] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [result, setResult] = useState<NoveltyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { remainingChecks, consumeCheck } = useFreeChecks();
  const { showToast } = useToast();

  const runCheck = async () => {
    if (description.trim().length < 20) {
      setMessage("Please describe your invention in at least 20 characters.");
      showToast("warning", "Add a little more detail before checking.");
      return;
    }
    if (remainingChecks <= 0) {
      setMessage("Free tier limit reached. Open Pricing to see paid plans, or reset checks from the dashboard for demo use.");
      showToast("warning", "Free tier limit reached.");
      return;
    }

    setMessage("");
    setLoading(true);
    setResult(null);
    try {
      const nextResult = await checkNovelty(description.trim());
      setResult(nextResult);
      consumeCheck();
      showToast("success", `Novelty check complete. ${Math.max(0, remainingChecks - 1)} checks left.`);
    } catch (error) {
      if (error instanceof RateLimitError) {
        setMessage("Free tier limit reached. Open Pricing to see paid plans.");
        showToast("warning", "Free tier limit reached.");
      } else {
        setMessage("Something went wrong. Please try again.");
        showToast("error", "Could not complete the novelty check.");
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
          <p className="text-sm font-bold text-primary">Patent Novelty Checker</p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">Check if your invention is new</h1>
          <p className="mt-3 text-on-surface-variant">
            Describe the problem, your solution, and what makes it different.
          </p>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={10}
            maxLength={5000}
            className="mt-6 w-full resize-none rounded-lg border border-border-technical p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Describe your invention..."
          />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <button type="button" onClick={() => setDescription(demoInputs.novelty)} className="font-semibold text-primary">
              Use sample
            </button>
            <span>{description.length} / 5000</span>
          </div>
          {message && <p className="mt-3 text-sm font-semibold text-risk-high">{message}</p>}
          <button
            type="button"
            onClick={runCheck}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
              {loading ? "sync" : "search"}
            </span>
            {loading ? "Searching patents..." : "Check novelty"}
          </button>
          <UpgradeNudge />
        </section>

        <section className="rounded-lg border border-border-technical bg-surface-container-low p-4">
          {loading && <ResultSkeleton />}

          {!loading && !result && (
            <div className="rounded-lg bg-white p-8 text-center text-on-surface-variant">
              Your patent risk score and closest matches will appear here.
            </div>
          )}

          {result && (
            <div className="animate-[fade-in_200ms_ease-out] space-y-4">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <RiskGauge score={result.risk_score} label={`${result.risk_label} risk`} />
                <div className="rounded-lg border border-border-technical bg-white p-5">
                  <h2 className="text-xl font-bold text-on-surface">Plain-English result</h2>
                  <p className="mt-3 text-on-surface-variant">{result.analysis}</p>
                </div>
              </div>
              {result.patents.map((patent) => (
                <PatentCard key={patent.patent_number} patent={patent} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
