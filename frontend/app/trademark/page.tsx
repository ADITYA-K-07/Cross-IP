"use client";

import Link from "next/link";
import { useState } from "react";
import { TrademarkCard } from "@/components/ip/Cards";
import { ResultSkeleton } from "@/components/ip/LoadingStates";
import { RiskGauge } from "@/components/ip/RiskGauge";
import { UpgradeNudge } from "@/components/ip/UpgradeNudge";
import { RateLimitError, scanTrademark } from "@/components/ip/api";
import { demoInputs } from "@/components/ip/data";
import { useFreeChecks } from "@/components/ip/useFreeChecks";
import { useToast } from "@/components/ip/ToastProvider";
import { TrademarkResult } from "@/components/ip/types";

function riskToScore(level: string) {
  const normalized = level.toLowerCase();
  if (normalized.includes("critical")) return 90;
  if (normalized.includes("high")) return 75;
  if (normalized.includes("medium")) return 52;
  return 22;
}

export default function TrademarkPage() {
  const [brand, setBrand] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [phonetic, setPhonetic] = useState(true);
  const [result, setResult] = useState<TrademarkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { remainingChecks, consumeCheck } = useFreeChecks();
  const { showToast } = useToast();

  const runScan = async () => {
    if (brand.trim().length < 2) {
      setMessage("Please enter a brand name.");
      showToast("warning", "Enter a brand name before scanning.");
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
      const nextResult = await scanTrademark(brand.trim(), phonetic);
      setResult(nextResult);
      const usage = await consumeCheck();
      showToast("success", `Trademark scan complete. ${usage.remaining} checks left.`);
    } catch (error) {
      if (error instanceof RateLimitError) {
        setMessage("Free tier limit reached. Open Pricing to see paid plans.");
        showToast("warning", "Free tier limit reached.");
      } else {
        setMessage("Something went wrong. Please try again.");
        showToast("error", "Could not scan trademarks.");
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
          <p className="text-sm font-bold text-primary">Trademark Scanner</p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">Check your brand name</h1>
          <p className="mt-3 text-on-surface-variant">
            Search for exact, similar, and similar-sounding names before you launch.
          </p>

          <label className="mt-6 block text-sm font-semibold text-on-surface" htmlFor="brand">
            Brand name
          </label>
          <input
            id="brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            maxLength={200}
            className="mt-2 w-full rounded-lg border border-border-technical p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Example: FlowNest"
          />

          <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={phonetic}
              onChange={(event) => setPhonetic(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Also check similar-sounding names
          </label>

          <button type="button" onClick={() => setBrand(demoInputs.trademark)} className="mt-4 text-sm font-semibold text-primary">
            Use sample
          </button>
          {message && <p className="mt-3 text-sm font-semibold text-risk-high">{message}</p>}

          <button
            type="button"
            onClick={runScan}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
              {loading ? "sync" : "verified"}
            </span>
            {loading ? "Scanning names..." : "Scan trademarks"}
          </button>
          <UpgradeNudge items={["Competitor alerts", "Renewal reminders", "Brand monitoring"]} />
        </section>

        <section className="rounded-lg border border-border-technical bg-surface-container-low p-4">
          {loading && <ResultSkeleton />}
          {!loading && !result && (
            <div className="rounded-lg bg-white p-8 text-center text-on-surface-variant">
              Trademark risk and matching names will appear here.
            </div>
          )}
          {result && (
            <div className="animate-[fade-in_200ms_ease-out] space-y-4">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <RiskGauge score={riskToScore(result.risk_level)} label={`${result.risk_level} risk`} />
                <div className="rounded-lg border border-border-technical bg-white p-5">
                  <h2 className="text-xl font-bold text-on-surface">Risk summary</h2>
                  <p className="mt-3 text-on-surface-variant">{result.explanation}</p>
                </div>
              </div>
              {result.matches.map((match) => (
                <TrademarkCard key={`${match.name}-${match.match_type}`} match={match} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
