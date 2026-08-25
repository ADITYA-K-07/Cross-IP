"use client";

import { PATENT_COLLISIONS } from "./mockData";

interface CoreModulesProps {
  onOpenSampleReport: () => void;
}

export function CoreModules({ onOpenSampleReport }: CoreModulesProps) {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-gutter py-margin-desktop">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-text-high-contrast mb-2">
          <span className="text-primary mr-2">/</span>Core Modules
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Active intelligence gathering and risk mitigation systems.
        </p>
      </div>

      {/* Asymmetric 2x2 Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-panel-gap bg-border-technical p-panel-gap rounded-lg overflow-hidden shadow-lg">
        {/* MODULE 01: COMPETITOR WATCH (Col Span 7) */}
        <div className="col-span-1 md:col-span-7 bg-surface-industrial flex flex-col group relative overflow-hidden">
          {/* Hover Slide Accent Surface */}
          <div className="absolute inset-0 bg-surface-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-0 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 bg-primary/10 flex items-center justify-center rounded">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    radar
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-text-high-contrast">
                  Competitor Watch
                </h3>
              </div>
              <span className="font-data-mono text-data-mono text-text-muted px-3 py-1 border border-border-technical rounded bg-surface-container-lowest">
                MOD_01
              </span>
            </div>

            <div className="mt-auto">
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Continuous tracking of competitor patent filings, trademark
                registrations, and litigation history across 120 jurisdictions.
                Receive actionable alerts before they secure rights in your target
                markets.
              </p>
              {/* Filing Volume Graph SVG matching Stitch */}
              <div className="w-full h-48 bg-surface-container-lowest border border-border-technical rounded relative overflow-hidden flex items-end px-4 pt-4">
                <svg
                  className="w-full h-full text-primary opacity-80 stroke-current drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                  viewBox="0 0 400 100"
                >
                  <path
                    d="M0,80 Q50,70 100,50 T200,60 T300,20 T400,30"
                    fill="none"
                    strokeWidth="2"
                  />
                  <path
                    className="text-primary opacity-30"
                    d="M0,60 Q50,50 100,80 T200,40 T300,70 T400,10"
                    fill="none"
                    strokeDasharray="4"
                    strokeWidth="1"
                  />
                  <line
                    className="text-border-technical"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="0"
                    x2="400"
                    y1="90"
                    y2="90"
                  />
                  <line
                    className="text-border-technical opacity-50"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="50"
                    x2="50"
                    y1="0"
                    y2="100"
                  />
                  <line
                    className="text-border-technical opacity-50"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="150"
                    x2="150"
                    y1="0"
                    y2="100"
                  />
                  <line
                    className="text-border-technical opacity-50"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="250"
                    x2="250"
                    y1="0"
                    y2="100"
                  />
                  <line
                    className="text-border-technical opacity-50"
                    stroke="currentColor"
                    strokeWidth="1"
                    x1="350"
                    x2="350"
                    y1="0"
                    y2="100"
                  />
                  <circle
                    className="animate-pulse"
                    cx="300"
                    cy="20"
                    fill="#7C3AED"
                    r="4"
                  />
                </svg>
                <div className="absolute top-4 left-4 font-data-mono text-[10px] text-text-muted">
                  FILING VOLUME (90D)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 02: FTO CHECKER (Col Span 5) */}
        <div className="col-span-1 md:col-span-5 bg-surface-industrial flex flex-col group relative overflow-hidden">
          {/* Hover Slide Accent Surface */}
          <div className="absolute inset-0 bg-surface-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-0 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 bg-primary/10 flex items-center justify-center rounded">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    policy
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-text-high-contrast">
                  FTO Checker
                </h3>
              </div>
              <span className="font-data-mono text-data-mono text-text-muted px-3 py-1 border border-border-technical rounded bg-surface-container-lowest">
                MOD_02
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Automated semantic analysis of your product descriptions against
              active patent claims. Identify potential infringement risks with
              heat-mapped claim charting before launch.
            </p>

            <div className="mt-auto space-y-3">
              {PATENT_COLLISIONS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-surface-container-lowest border border-border-technical rounded"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        item.severity === "critical"
                          ? "text-risk-critical"
                          : "text-risk-nominal"
                      }`}
                    >
                      {item.severity === "critical" ? "warning" : "check_circle"}
                    </span>
                    <span className="font-data-mono text-data-mono text-on-surface text-sm">
                      {item.patentNumber}
                    </span>
                  </div>
                  <span
                    className={`font-label-caps text-label-caps ${
                      item.severity === "critical"
                        ? "text-risk-critical"
                        : "text-text-muted"
                    }`}
                  >
                    {item.matchPercentage < 10 ? `0${item.matchPercentage}` : item.matchPercentage}% MATCH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODULE 03: DEADLINE ALERTS (Col Span 5) */}
        <div className="col-span-1 md:col-span-5 bg-surface-industrial flex flex-col group relative overflow-hidden">
          {/* Hover Slide Accent Surface */}
          <div className="absolute inset-0 bg-surface-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-0 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 bg-primary/10 flex items-center justify-center rounded">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    event_busy
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-text-high-contrast">
                  Deadline Alerts
                </h3>
              </div>
              <span className="font-data-mono text-data-mono text-text-muted px-3 py-1 border border-border-technical rounded bg-surface-container-lowest">
                MOD_03
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Never miss an office action response, maintenance fee, or opposition
              period. Synchronizes with global patent office databases to build a
              foolproof docketing timeline.
            </p>

            <div className="mt-auto relative w-full h-32 bg-surface-container-lowest border border-border-technical rounded overflow-hidden">
              <div className="absolute top-1/2 left-0 w-full h-px bg-border-technical" />

              {/* Marker 1: Critical (48H OA Response) */}
              <div className="absolute top-1/2 left-4 w-3 h-3 rounded-full bg-risk-critical -mt-[6px] shadow-[0_0_10px_#EF4444]" />
              <div className="absolute top-4 left-4 font-data-mono text-[10px] text-risk-critical">
                48H: RESPOND TO OA
              </div>

              {/* Marker 2: Primary (14D Maintenance Fee) */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary -mt-[6px] -ml-[6px]" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-data-mono text-[10px] text-primary font-medium">
                14D: MAINT. FEE
              </div>

              {/* Marker 3: Opposition (60D) */}
              <div className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-surface-bright border border-border-technical -mt-[6px]" />
              <div className="absolute top-4 right-4 font-data-mono text-[10px] text-text-muted">
                60D: OPPOSITION
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 04: WEEKLY DIGEST (Col Span 7) */}
        <div className="col-span-1 md:col-span-7 bg-surface-industrial flex flex-col group relative overflow-hidden">
          {/* Hover Slide Accent Surface */}
          <div className="absolute inset-0 bg-surface-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-0 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-primary/30 bg-primary/10 flex items-center justify-center rounded">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    mark_email_unread
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-text-high-contrast">
                  Weekly Digest
                </h3>
              </div>
              <span className="font-data-mono text-data-mono text-text-muted px-3 py-1 border border-border-technical rounded bg-surface-container-lowest">
                MOD_04
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 mt-auto items-start sm:items-center">
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                  A synthesized executive summary of your IP landscape delivered
                  every Monday at 0800 UTC. Highlights critical threats, new
                  white-space opportunities, and portfolio health metrics.
                </p>
                <button
                  onClick={onOpenSampleReport}
                  className="text-primary font-label-caps text-label-caps hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer group/btn"
                >
                  VIEW SAMPLE REPORT{" "}
                  <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Stitch-style mini bar chart graphic */}
              <div className="w-48 h-48 rounded bg-surface-container-lowest border border-border-technical relative p-4 hidden lg:block overflow-hidden shrink-0">
                <div className="w-full h-2 bg-surface-container-highest rounded mb-3" />
                <div className="w-3/4 h-2 bg-surface-container-highest rounded mb-6" />
                <div className="w-full h-24 bg-surface-accent/30 rounded flex items-end justify-between px-2 pb-2 gap-1 border border-border-technical/50">
                  <div className="w-full bg-primary h-[30%] rounded-t-sm" />
                  <div className="w-full bg-primary h-[60%] rounded-t-sm" />
                  <div className="w-full bg-risk-critical h-[80%] rounded-t-sm shadow-[0_0_8px_#EF4444]" />
                  <div className="w-full bg-primary h-[40%] rounded-t-sm" />
                  <div className="w-full bg-primary h-[50%] rounded-t-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
