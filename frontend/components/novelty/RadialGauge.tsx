"use client";

import { useEffect, useState } from "react";

interface RadialGaugeProps {
  riskValue: number | null;
  confidenceScore: string;
  nodesScanned: string;
  isScanning: boolean;
}

export function RadialGauge({
  riskValue,
  confidenceScore,
  nodesScanned,
  isScanning,
}: RadialGaugeProps) {
  const [displayRisk, setDisplayRisk] = useState<number | null>(riskValue);

  useEffect(() => {
    if (riskValue === null) {
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const animateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const val = Math.floor(ease * riskValue);

      setDisplayRisk(val);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayRisk(riskValue);
      }
    };

    const animId = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(animId);
  }, [riskValue]);

  const activePercent = riskValue !== null ? (displayRisk ?? riskValue) : 0;
  const circumference = 251.2;
  const strokeDashoffset = circumference - (activePercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8 border border-border-technical bg-surface-industrial relative overflow-hidden">
      {/* SVG Radial Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Base Gauge Circle */}
          <circle
            className="text-border-technical"
            cx="50"
            cy="50"
            fill="none"
            r="40"
            stroke="currentColor"
            strokeWidth="4"
          />

          {/* Active Risk Circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${
              activePercent >= 75
                ? "text-risk-critical"
                : activePercent > 0
                ? "text-primary"
                : "text-border-technical"
            }`}
            cx="50"
            cy="50"
            fill="none"
            r="40"
            stroke="currentColor"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute flex flex-col items-center">
          <span
            className={`font-display-lg text-display-lg ${
              isScanning
                ? "animate-pulse text-primary"
                : riskValue !== null && activePercent >= 75
                ? "text-risk-critical font-bold"
                : "text-on-surface"
            }`}
          >
            {isScanning ? "..." : riskValue !== null ? activePercent : "--"}
          </span>
          <span className="font-label-caps text-text-muted mt-1">
            Collision Risk
          </span>
        </div>
      </div>

      {/* Sub-Metrics Bar */}
      <div className="mt-6 flex gap-4 w-full px-8">
        <div className="flex-1 border-t border-border-technical pt-2 text-center">
          <div className="font-data-mono text-[10px] text-text-muted mb-1 uppercase">
            CONFIDENCE
          </div>
          <div className="font-headline-md text-on-surface">
            {isScanning ? "..." : confidenceScore}
          </div>
        </div>
        <div className="w-[1px] bg-border-technical" />
        <div className="flex-1 border-t border-border-technical pt-2 text-center">
          <div className="font-data-mono text-[10px] text-text-muted mb-1 uppercase">
            NODES SCANNED
          </div>
          <div className="font-headline-md text-on-surface">
            {isScanning ? "..." : nodesScanned}
          </div>
        </div>
      </div>
    </div>
  );
}
