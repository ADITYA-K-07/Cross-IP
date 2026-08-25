"use client";

interface MonitoredNodesWidgetProps {
  onInitializeDeployment: () => void;
}

export function MonitoredNodesWidget({
  onInitializeDeployment,
}: MonitoredNodesWidgetProps) {
  return (
    <div className="w-full md:w-80 shrink-0">
      <div className="bg-surface-industrial border border-border-technical p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border-technical pb-4">
          <span className="font-label-caps text-label-caps text-text-muted">
            Current Load
          </span>
          <span className="font-data-mono text-data-mono text-risk-nominal font-medium">
            NOMINAL
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Active Monitored Nodes
            </span>
            <span className="font-data-mono text-data-mono text-text-high-contrast font-semibold">
              1,428
            </span>
          </div>
          <div className="w-full h-1 bg-surface-accent overflow-hidden">
            <div className="h-full bg-primary w-[78%]" />
          </div>
        </div>
        <button
          onClick={onInitializeDeployment}
          className="mt-4 w-full bg-primary text-on-primary font-label-caps text-label-caps py-3 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.3)] active:scale-[0.98]"
        >
          INITIALIZE DEPLOYMENT{" "}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
