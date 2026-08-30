"use client";

import { useState } from "react";
import { UpgradeModal } from "./Modals";

export function UpgradeNudge({
  title = "Need monitoring after this check?",
  items = ["Competitor alerts", "Freedom to operate checks", "Weekly IP digest"],
}: {
  title?: string;
  items?: string[];
}) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <>
      <div className="mt-5 rounded-lg border border-dashed border-border-technical bg-surface-container-low p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-on-surface">{title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-muted"
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUpgradeOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-border-technical bg-white px-4 py-2 text-sm font-semibold text-on-surface hover:border-primary hover:text-primary"
          >
            View paid tools
          </button>
        </div>
      </div>
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
