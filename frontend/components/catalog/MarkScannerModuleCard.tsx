"use client";

import Link from "next/link";

export function MarkScannerModuleCard() {
  return (
    <Link
      href="/novelty"
      className="md:col-span-5 bg-surface-container-lowest border border-border-technical flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="p-6 border-b border-border-technical bg-surface-steel flex justify-between items-center group-hover:bg-surface-accent/60 transition-colors">
        <h3 className="font-headline-md text-on-surface flex items-center gap-3 group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">
            verified
          </span>
          Mark Scanner
        </h3>
      </div>

      <div className="p-6 space-y-4 bg-surface-container-lowest flex-1 flex flex-col justify-between">
        <p className="font-body-md text-on-surface-variant">
          Phonetic and visual similarity search across active trademark databases to
          prevent infringement.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-2.5 py-1 bg-surface-container border border-border-technical font-data-mono text-xs text-on-surface rounded-xs">
            Text Analysis
          </span>
          <span className="px-2.5 py-1 bg-surface-container border border-border-technical font-data-mono text-xs text-on-surface rounded-xs">
            Logo Vision AI
          </span>
        </div>
      </div>
    </Link>
  );
}
