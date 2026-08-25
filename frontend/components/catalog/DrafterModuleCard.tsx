"use client";

import Link from "next/link";

export function DrafterModuleCard() {
  return (
    <Link
      href="/draft"
      className="md:col-span-4 bg-surface-container-lowest border border-border-technical flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="p-6 border-b border-border-technical bg-surface-steel flex justify-between items-center group-hover:bg-surface-accent/60 transition-colors">
        <h3 className="font-headline-md text-on-surface flex items-center gap-3 group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">
            edit_document
          </span>
          Auto-Drafter
        </h3>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 bg-surface-container-lowest">
        <p className="font-body-md text-on-surface-variant">
          Generates USPTO-compliant patent specifications and claims based on minimal
          input data.
        </p>

        {/* Claim Code Preview Widget matching Stitch */}
        <div className="flex-1 bg-surface-container border border-border-technical p-4 font-data-mono text-xs text-text-muted overflow-hidden relative rounded-xs min-h-[120px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container z-10 pointer-events-none" />
          <span className="text-primary font-semibold">[CLAIM 1]</span>
          <br />
          A system for processing...
          <br />
          comprising:
          <br />
          a primary network interface;
          <br />
          a cryptographic module configured to...
          <br />
          wherein said module executes...
        </div>
      </div>
    </Link>
  );
}
