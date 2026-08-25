"use client";

import Link from "next/link";

export function NoveltyModuleCard() {
  return (
    <Link
      href="/novelty"
      className="md:col-span-8 bg-surface-container-lowest border border-border-technical flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="p-6 border-b border-border-technical bg-surface-steel flex justify-between items-center group-hover:bg-surface-accent/60 transition-colors">
        <h3 className="font-headline-md text-on-surface flex items-center gap-3 group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">
            model_training
          </span>
          Novelty Engine
        </h3>
        <span className="font-data-mono text-sm text-text-muted border border-border-technical px-2 py-1 bg-surface-container rounded-xs">
          v2.4.1
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col md:flex-row gap-8 bg-surface-container-lowest">
        <div className="flex-1 space-y-4">
          <p className="font-body-md text-on-surface-variant">
            Deep semantic analysis of your invention description against 120M+
            global patent documents. Identifies structural and functional overlaps
            beyond keyword matching.
          </p>
          <ul className="space-y-2 font-data-mono text-sm text-text-muted">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              Semantic Vector Search
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              Claim Construction Analysis
            </li>
          </ul>
        </div>

        {/* Visual Graphic Box */}
        <div className="w-full md:w-48 h-32 bg-surface-container border border-border-technical relative flex items-center justify-center overflow-hidden shrink-0 rounded-xs">
          <div
            className="absolute inset-0 opacity-20 filter invert pointer-events-none"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-U8uGwZ0t0d7VIL1bSjFkbrAlvaVR23zlXKb6SHeKo8Zya1d9S7stasCNsBqp_blXckVYF35sC7-ltJ-MdaZfv-vn34CnZArMGBYpyOkKiZ6yoZ58foApCbzD1cKpMgPHw4S5QeU60w_irHcXcnFHztH4pPpo55u0dcqxmuoT_AdXG92dLI-bCvw-OpQXaSKeVz81tXMJC_ai1lGCk2w2r0XehFbnQvm1VNIuDnMYQQqZ-sTNwnF5CA')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />
          <span className="material-symbols-outlined text-4xl text-primary relative z-10 group-hover:scale-110 transition-transform">
            hub
          </span>
        </div>
      </div>
    </Link>
  );
}
