"use client";

import { NoveltyResult } from "./types";
import { RadialGauge } from "./RadialGauge";
import { PatentMatchCard } from "./PatentMatchCard";

interface ScanDiagnosticsProps {
  result: NoveltyResult | null;
  isScanning: boolean;
  hasSearched: boolean;
}

export function ScanDiagnostics({
  result,
  isScanning,
  hasSearched,
}: ScanDiagnosticsProps) {
  return (
    <div className="col-span-12 lg:col-span-5 bg-surface-accent flex flex-col relative overflow-hidden border border-border-technical">
      {/* Header Bar */}
      <div className="bg-surface-steel border-b border-border-technical px-6 py-3 flex justify-between items-center relative z-10">
        <span className="font-label-caps text-primary">Scan Diagnostics</span>
        <div className="flex gap-1">
          <span className="w-1 h-3 bg-primary/30" />
          <span className="w-1 h-3 bg-primary/60" />
          <span className="w-1 h-3 bg-primary" />
        </div>
      </div>

      {/* Main Diagnostic Body */}
      <div className="flex-1 p-6 flex flex-col gap-8 relative z-10 overflow-y-auto">
        {/* Radial Gauge Meter */}
        <RadialGauge
          riskValue={result ? result.collisionRisk : null}
          confidenceScore={result ? result.confidenceScore : "--%"}
          nodesScanned={result ? result.nodesScanned : "--"}
          isScanning={isScanning}
        />

        {/* Vector Match List */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-border-technical pb-2">
            <span className="font-label-caps text-on-surface">
              High-Similarity Vectors
            </span>
            <span className="font-data-mono text-[10px] text-text-muted">
              {result ? `TOP ${result.matches.length} RESULTS (DEMO)` : "AWAITING SCAN"}
            </span>
          </div>

          <div
            className={`flex flex-col bg-border-technical border border-border-technical transition-all duration-500 ${
              hasSearched && result && !isScanning
                ? "opacity-100 pointer-events-auto"
                : "opacity-40 pointer-events-none"
            }`}
          >
            {result?.matches.map((match) => (
              <PatentMatchCard key={match.patentId} match={match} />
            ))}

            {!result && (
              <div className="bg-surface-industrial p-8 text-center text-text-muted font-data-mono text-xs">
                Enter invention disclosure and click &quot;Execute Scan&quot; to perform semantic patent analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
