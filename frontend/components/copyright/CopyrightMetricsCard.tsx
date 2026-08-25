"use client";

interface CopyrightMetricsCardProps {
  riskIndex: number | null;
  fragmentsFound: number | null;
  repositoryCount: number | null;
  isScanning: boolean;
}

export function CopyrightMetricsCard({
  riskIndex,
  fragmentsFound,
  repositoryCount,
  isScanning,
}: CopyrightMetricsCardProps) {
  const activeRisk = riskIndex !== null ? riskIndex : 0;
  const isHighRisk = activeRisk >= 75;

  return (
    <div className="grid grid-cols-2 gap-1 bg-outline-variant/30 p-[1px] rounded">
      {/* Risk Index Box */}
      <div className="bg-surface p-6 flex flex-col justify-between rounded-l">
        <span className="font-label-caps text-on-surface-variant mb-4 font-bold">
          Risk Index
        </span>

        <div className="flex items-end gap-3">
          <span
            className={`font-display-lg text-[48px] leading-none ${
              isScanning
                ? "text-primary animate-pulse"
                : isHighRisk
                ? "text-risk-high"
                : "text-on-surface"
            }`}
          >
            {isScanning ? "..." : riskIndex !== null ? riskIndex : "--"}
            <span className="text-xl text-risk-high/70">%</span>
          </span>
        </div>

        <div className="mt-4 h-1 w-full bg-surface-container-highest border border-outline-variant/30 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isHighRisk ? "bg-risk-high" : "bg-primary"
            }`}
            style={{ width: `${activeRisk}%` }}
          />
        </div>

        <span className="font-data-mono text-[10px] text-risk-high mt-2 uppercase tracking-wider font-bold">
          {isScanning
            ? "Analyzing Code Provenance..."
            : riskIndex !== null
            ? "High Probability Match"
            : "Awaiting Scan"}
        </span>
      </div>

      {/* Fragments Found Box */}
      <div className="bg-surface p-6 flex flex-col justify-between rounded-r">
        <span className="font-label-caps text-on-surface-variant mb-4 font-bold">
          Fragments Found
        </span>

        <div className="flex items-end gap-3">
          <span
            className={`font-display-lg text-[48px] leading-none ${
              isScanning ? "text-primary animate-pulse" : "text-risk-low"
            }`}
          >
            {isScanning ? "..." : fragmentsFound !== null ? fragmentsFound : "--"}
          </span>
        </div>

        <div className="mt-4 flex gap-1 h-1">
          <div
            className={`flex-1 ${
              fragmentsFound !== null ? "bg-risk-low" : "bg-surface-container-highest"
            }`}
          />
          <div
            className={`flex-1 ${
              fragmentsFound !== null ? "bg-risk-low opacity-50" : "bg-surface-container-highest"
            }`}
          />
          <div className="flex-1 bg-surface-container-highest border border-outline-variant/30" />
          <div className="flex-1 bg-surface-container-highest border border-outline-variant/30" />
        </div>

        <span className="font-data-mono text-[10px] text-on-surface-variant mt-2 uppercase tracking-wider font-bold">
          {repositoryCount !== null
            ? `Across ${repositoryCount} Repositories`
            : "No Vector Scans Active"}
        </span>
      </div>
    </div>
  );
}
