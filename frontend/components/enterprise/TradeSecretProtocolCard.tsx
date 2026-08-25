"use client";

import { useState } from "react";
import { SCAN_TARGETS, ScanTarget } from "./mockData";

export function TradeSecretProtocolCard() {
  const [targets, setTargets] = useState<ScanTarget[]>(SCAN_TARGETS);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleToggleTarget = (id: string) => {
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "SECURE" ? "ANOMALY" : "SECURE",
            }
          : t
      )
    );
    const target = targets.find((t) => t.id === id);
    if (target) {
      setActiveMessage(
        `Perimeter scan updated for ${target.name}: Status recalculated.`
      );
      setTimeout(() => setActiveMessage(null), 3000);
    }
  };

  return (
    <div className="md:col-span-8 bg-surface flex flex-col hover:bg-surface-industrial transition-colors group">
      <div className="p-8 border-b border-border-technical flex justify-between items-start">
        <div>
          <div className="font-data-mono text-[10px] text-primary mb-2">
            01 // TSM-PROTOCOL
          </div>
          <h3 className="font-headline-lg text-headline-lg text-text-high-contrast mb-3">
            Trade Secret Monitor
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Continuous perimeter scanning for unauthorized data exfiltration.
            Analyzes outbound traffic patterns and unstructured data leaks across
            decentralized networks.
          </p>
        </div>
        <span className="material-symbols-outlined text-border-technical text-5xl group-hover:text-primary transition-colors duration-500">
          vpn_lock
        </span>
      </div>

      <div className="p-8 flex-1 bg-surface-container-lowest relative overflow-hidden flex flex-col justify-between">
        {/* Abstract Radar SVG Visualization matching Stitch */}
        <svg
          className="absolute right-0 bottom-0 w-64 h-64 text-border-technical/50 translate-y-12 translate-x-12 pointer-events-none"
          fill="none"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeDasharray="2 4"
            strokeWidth="0.5"
          />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M50 10 L50 90 M10 50 L90 50"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          {/* Active Pinging Node */}
          <circle
            className="animate-ping"
            cx="70"
            cy="30"
            fill="#EF4444"
            r="2"
          />
          <circle cx="70" cy="30" fill="#EF4444" r="1" />
          <line
            opacity="0.5"
            stroke="#EF4444"
            strokeDasharray="2 2"
            strokeWidth="1"
            x1="50"
            x2="70"
            y1="50"
            y2="30"
          />
        </svg>

        {/* Scan Target List */}
        <div className="relative z-10 w-full max-w-sm space-y-2">
          <div className="flex justify-between font-label-caps text-[10px] text-text-muted mb-4 border-b border-border-technical pb-2">
            <span>SCAN TARGET</span>
            <span>STATUS</span>
          </div>

          {targets.map((target) => (
            <div
              key={target.id}
              onClick={() => handleToggleTarget(target.id)}
              className={`flex justify-between items-center bg-surface-industrial p-3 border-l-2 border border-border-technical transition-all cursor-pointer hover:border-primary ${
                target.status === "SECURE"
                  ? "border-l-primary"
                  : "border-l-risk-critical"
              }`}
            >
              <span className="font-data-mono text-data-mono text-on-surface">
                {target.name}
              </span>
              <span
                className={`font-label-caps text-[10px] flex items-center gap-1 ${
                  target.status === "SECURE"
                    ? "text-risk-nominal"
                    : "text-risk-critical"
                }`}
              >
                {target.status === "ANOMALY" && (
                  <span className="material-symbols-outlined text-[12px]">
                    warning
                  </span>
                )}
                {target.status}
              </span>
            </div>
          ))}
        </div>

        {activeMessage && (
          <p className="font-data-mono text-xs text-primary mt-4 relative z-10 animate-in fade-in duration-200">
            {activeMessage}
          </p>
        )}
      </div>
    </div>
  );
}
