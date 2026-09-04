"use client";

import { useState } from "react";
import { LockedToolCard, ToolCard } from "@/components/ip/Cards";
import { UpgradeModal } from "@/components/ip/Modals";
import { freeTools, lockedTools } from "@/components/ip/data";
import { useFreeChecks } from "@/components/ip/useFreeChecks";

export default function DashboardPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { maxChecks, remainingChecks, usageError, isUsageLoading } = useFreeChecks();
  const usedChecks = maxChecks - remainingChecks;
  const progress = (remainingChecks / maxChecks) * 100;

  return (
    <div className="page-wrap">
      <section className="rounded-lg border border-border-technical bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-primary">Free plan</p>
            <h1 className="mt-2 text-3xl font-bold text-on-surface">Welcome to CrossIP</h1>
            <p className="mt-2 max-w-2xl text-on-surface-variant">
              Pick a tool and run a quick IP check. Your free checks are tracked securely for this session.
            </p>
          </div>
          <div className="w-full max-w-sm rounded-lg bg-surface-container-low p-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{isUsageLoading ? "Loading checks..." : `${remainingChecks} checks remaining`}</span>
              <span>{isUsageLoading ? "" : `${usedChecks} used`}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            {remainingChecks === 0 ? (
              <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                Free tier limit reached. View plans to continue with more checks.
              </div>
            ) : null}
            {usageError ? <p className="mt-3 text-sm font-semibold text-risk-high">{usageError}</p> : null}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-on-surface">Free tools</h2>
          <span className="text-sm text-text-muted">Working now</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {freeTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} title={tool.shortTitle} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-on-surface">Coming soon</h2>
          <span className="text-sm text-text-muted">Paid plan preview</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lockedTools.map((tool) => (
            <LockedToolCard
              key={tool.href}
              {...tool}
              onClick={() => setUpgradeOpen(true)}
            />
          ))}
        </div>
      </section>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
