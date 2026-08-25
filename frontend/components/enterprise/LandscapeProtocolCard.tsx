"use client";

import { useState } from "react";
import { LANDSCAPE_DATA } from "./mockData";

export function LandscapeProtocolCard() {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(2);

  return (
    <div className="md:col-span-4 bg-surface flex flex-col hover:bg-surface-industrial transition-colors group">
      <div className="p-8 border-b border-border-technical">
        <div className="font-data-mono text-[10px] text-primary mb-2">
          02 // ILM-PROTOCOL
        </div>
        <h3 className="font-headline-md text-headline-md text-text-high-contrast mb-3">
          IP Landscape Mapper
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Topographical visualization of competitor patent filings and white-space
          opportunities.
        </p>
      </div>

      <div className="p-8 flex-1 bg-surface-container-lowest flex flex-col justify-end">
        {/* Sector Bar Chart Mockup matching Stitch */}
        <div className="h-32 w-full flex items-end gap-1 mb-4">
          {LANDSCAPE_DATA.bars.map((bar, idx) => {
            const isSelected = selectedBarIndex === idx;
            const isTarget = bar.isTarget;

            return (
              <div
                key={idx}
                onClick={() => setSelectedBarIndex(idx)}
                style={{ height: `${bar.heightPercent}%` }}
                className={`w-1/6 relative transition-all duration-300 cursor-pointer ${
                  isTarget || isSelected
                    ? "bg-primary shadow-[0_0_10px_rgba(124,58,237,0.4)]"
                    : "bg-border-technical group-hover:bg-surface-container-highest"
                }`}
              >
                {isTarget && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-data-mono text-[10px] text-primary font-medium tracking-tighter">
                    TARGET
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-border-technical pt-4 flex justify-between items-center">
          <span className="font-label-caps text-[10px] text-text-muted">
            {LANDSCAPE_DATA.label}
          </span>
          <span className="font-data-mono text-[12px] text-on-surface font-medium">
            {LANDSCAPE_DATA.densityChange}
          </span>
        </div>
      </div>
    </div>
  );
}
