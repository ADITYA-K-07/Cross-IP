"use client";

export function TelemetryBar() {
  return (
    <div className="w-full bg-surface-industrial border-y border-border-technical">
      <div className="max-w-[1440px] mx-auto px-gutter py-6 flex justify-between items-center overflow-x-auto no-scrollbar gap-8">
        <div className="flex items-center gap-3 min-w-max">
          <span className="material-symbols-outlined text-text-muted text-[20px]">
            memory
          </span>
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            NODE: US-EAST-1
          </span>
        </div>
        <div className="w-px h-6 bg-border-technical hidden md:block" />
        <div className="flex items-center gap-3 min-w-max">
          <span className="material-symbols-outlined text-text-muted text-[20px]">
            speed
          </span>
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            LATENCY: 12MS
          </span>
        </div>
        <div className="w-px h-6 bg-border-technical hidden md:block" />
        <div className="flex items-center gap-3 min-w-max">
          <span className="material-symbols-outlined text-text-muted text-[20px]">
            security
          </span>
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            ENCRYPTION: AES-256
          </span>
        </div>
        <div className="w-px h-6 bg-border-technical hidden md:block" />
        <div className="flex items-center gap-3 min-w-max">
          <span className="flex w-2.5 h-2.5 rounded-full bg-risk-nominal animate-pulse" />
          <span className="font-data-mono text-data-mono text-risk-nominal font-medium tracking-wide">
            SYSTEM NOMINAL
          </span>
        </div>
      </div>
    </div>
  );
}
