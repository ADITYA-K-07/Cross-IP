"use client";

import Link from "next/link";
import { useState } from "react";
import { ResultSkeleton } from "@/components/ip/LoadingStates";
import { UpgradeNudge } from "@/components/ip/UpgradeNudge";
import { RateLimitError, generateClaims } from "@/components/ip/api";
import { demoInputs } from "@/components/ip/data";
import { useFreeChecks } from "@/components/ip/useFreeChecks";
import { useToast } from "@/components/ip/ToastProvider";
import { DraftResult } from "@/components/ip/types";

export default function DraftPage() {
  const [description, setDescription] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [result, setResult] = useState<DraftResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const { remainingChecks, consumeCheck } = useFreeChecks();
  const { showToast } = useToast();

  const runDraft = async () => {
    if (description.trim().length < 20) {
      setMessage("Please describe your invention in at least 20 characters.");
      showToast("warning", "Add a little more detail before drafting claims.");
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
      const nextResult = await generateClaims(description.trim());
      setResult(nextResult);
      const usage = await consumeCheck();
      showToast("success", `Claims generated. ${usage.remaining} checks left.`);
    } catch (error) {
      if (error instanceof RateLimitError) {
        setMessage("Free tier limit reached. Open Pricing to see paid plans.");
        showToast("warning", "Free tier limit reached.");
      } else {
        setMessage("Something went wrong. Please try again.");
        showToast("error", "Could not generate claims.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!result) return;
    const text = [
      "Independent claims",
      ...result.independent_claims.map((claim, index) => `${index + 1}. ${claim}`),
      "",
      "Dependent claims",
      ...result.dependent_claims.map((claim, index) => `${index + 1}. ${claim}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("success", "Claims copied.");
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-wrap">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to dashboard
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-border-technical bg-white p-6">
          <p className="text-sm font-bold text-primary">Patent Drafter</p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">Draft basic patent claims</h1>
          <p className="mt-3 text-on-surface-variant">
            Be specific about parts, steps, and what is new. These drafts are a starting point, not legal advice.
          </p>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={10}
            maxLength={5000}
            className="mt-6 w-full resize-none rounded-lg border border-border-technical p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Describe the invention you want claims for..."
          />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <button type="button" onClick={() => setDescription(demoInputs.draft)} className="font-semibold text-primary">
              Use sample
            </button>
            <span>{description.length} / 5000</span>
          </div>
          {message && <p className="mt-3 text-sm font-semibold text-risk-high">{message}</p>}
          <button
            type="button"
            onClick={runDraft}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
              {loading ? "sync" : "edit_document"}
            </span>
            {loading ? "Generating claims..." : "Generate claims"}
          </button>
          <UpgradeNudge items={["Deadline alerts", "Weekly IP digest", "Portfolio tools"]} />
        </section>

        <section className="rounded-lg border border-border-technical bg-surface-container-low p-4">
          {loading && <ResultSkeleton />}
          {!loading && !result && (
            <div className="rounded-lg bg-white p-8 text-center text-on-surface-variant">
              Your independent and dependent claims will appear here.
            </div>
          )}
          {result && (
            <div className="animate-[fade-in_200ms_ease-out] space-y-4">
              <div className="rounded-lg border border-border-technical bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">Generated claims</h2>
                    <p className="mt-1 text-sm text-text-muted">Review with a patent professional before filing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyAll}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-technical px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    {copied ? "Copied" : "Copy all"}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-border-technical bg-white p-5">
                <h3 className="font-bold text-on-surface">Independent claims</h3>
                <ol className="mt-4 space-y-3">
                  {result.independent_claims.map((claim, index) => (
                    <li key={claim} className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
                      <span className="font-bold text-on-surface">{index + 1}. </span>
                      {claim}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-border-technical bg-white p-5">
                <h3 className="font-bold text-on-surface">Dependent claims</h3>
                <ol className="mt-4 space-y-3">
                  {result.dependent_claims.map((claim, index) => (
                    <li key={claim} className="ml-4 rounded-lg border-l-4 border-primary/30 bg-surface-container-low p-4 text-sm text-on-surface-variant">
                      <span className="font-bold text-on-surface">{index + 1}. </span>
                      {claim}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
