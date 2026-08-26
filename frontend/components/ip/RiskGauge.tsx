"use client";

import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  label?: string;
}

function riskColor(score: number) {
  if (score <= 30) return "#059669";
  if (score <= 65) return "#d97706";
  return "#dc2626";
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
  const [shownScore, setShownScore] = useState(0);
  const clampedScore = Math.max(0, Math.min(100, score));
  const circumference = 220;
  const progress = circumference - (circumference * shownScore) / 100;
  const color = riskColor(clampedScore);

  useEffect(() => {
    let frame = 0;
    const frames = 28;
    const timer = window.setInterval(() => {
      frame += 1;
      setShownScore(Math.round((clampedScore * frame) / frames));
      if (frame >= frames) window.clearInterval(timer);
    }, 22);

    return () => window.clearInterval(timer);
  }, [clampedScore]);

  return (
    <div className="flex flex-col items-center rounded-lg border border-border-technical bg-white p-5">
      <svg viewBox="0 0 160 92" className="h-28 w-full max-w-56">
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#e5e7eb"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          strokeWidth="14"
          className="transition-all duration-300"
        />
      </svg>
      <div className="mt-[-1.5rem] text-center">
        <div className="text-4xl font-bold" style={{ color }}>
          {shownScore}
        </div>
        <p className="mt-1 text-sm font-semibold text-on-surface">
          {label ?? "Risk score"}
        </p>
        <p className="text-xs text-text-muted">0 is low, 100 is high</p>
      </div>
    </div>
  );
}
