"use client";

export function AppHeader() {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 flex items-center justify-between px-8 border-b border-border-technical">
      {/* System Status Ticker */}
      <div className="flex items-center gap-4">
        <span className="font-label-caps text-text-muted uppercase tracking-widest text-xs">
          System Status:
        </span>
        <span className="flex items-center gap-2 text-risk-nominal font-data-mono text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-risk-nominal animate-pulse" />
          Active
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button
          type="button"
          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
          title="Global Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>
    </header>
  );
}
