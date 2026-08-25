"use client";

import Link from "next/link";

export function CodeProvenanceModuleCard() {
  return (
    <Link
      href="/copyright"
      className="md:col-span-7 bg-surface-container-lowest border border-border-technical flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="p-6 border-b border-border-technical bg-surface-steel flex justify-between items-center group-hover:bg-surface-accent/60 transition-colors">
        <h3 className="font-headline-md text-on-surface flex items-center gap-3 group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">
            copyright
          </span>
          Code Provenance
        </h3>
      </div>

      <div className="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-surface-container-lowest justify-between">
        <div className="flex-1 space-y-2">
          <p className="font-body-md text-on-surface-variant">
            Scans source code repositories against known open-source licenses and
            copyrighted snippets.
          </p>
        </div>

        {/* Progress Bar Widget matching Stitch */}
        <div className="w-32 h-16 bg-surface-container border border-border-technical flex flex-col items-center justify-center shrink-0 rounded-xs px-2">
          <span className="font-data-mono text-[10px] text-text-muted mb-1">
            SCAN COVERAGE
          </span>
          <div className="w-full bg-surface-accent h-2 mx-4 relative overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 h-full bg-primary w-[75%]" />
          </div>
          <span className="font-data-mono text-[10px] text-primary font-semibold mt-1">
            75%
          </span>
        </div>
      </div>
    </Link>
  );
}
