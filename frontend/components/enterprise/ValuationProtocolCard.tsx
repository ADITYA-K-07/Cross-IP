"use client";

import { VALUATION_DATA } from "./mockData";

export function ValuationProtocolCard() {
  return (
    <div className="md:col-span-6 bg-surface flex flex-col hover:bg-surface-industrial transition-colors group">
      <div className="p-8 border-b border-border-technical">
        <div className="font-data-mono text-[10px] text-primary mb-2">
          04 // VAL-PROTOCOL
        </div>
        <h3 className="font-headline-md text-headline-md text-text-high-contrast mb-3">
          Valuation Estimator
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Algorithmic appraisal of patent families based on forward citations,
          market size, and litigation history.
        </p>
      </div>

      <div className="p-8 flex-1 bg-surface-container-lowest flex items-center justify-between">
        <div>
          <div className="font-label-caps text-[10px] text-text-muted mb-1">
            PORTFOLIO ESTIMATE (USD)
          </div>
          <div className="font-display-lg text-display-lg text-text-high-contrast tracking-tighter">
            $42.8
            <span className="text-headline-md text-on-surface-variant font-semibold">
              M
            </span>
          </div>
        </div>

        {/* Circular Progress Gauge matching Stitch */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-border-technical"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${VALUATION_DATA.confidencePercent}, 100`}
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-data-mono text-[12px] text-on-surface font-medium">
            {VALUATION_DATA.confidencePercent}%
          </div>
          <div className="absolute -bottom-6 w-full text-center font-label-caps text-[8px] text-text-muted tracking-widest">
            CONFIDENCE
          </div>
        </div>
      </div>
    </div>
  );
}
