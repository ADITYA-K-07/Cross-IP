"use client";

interface CodeEditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  onLoadFile: () => void;
  onScanNow: () => void;
  isScanning: boolean;
}

export function CodeEditorPanel({
  value,
  onChange,
  onLoadFile,
  onScanNow,
  isScanning,
}: CodeEditorPanelProps) {
  const canScan = value.trim().length > 0 && !isScanning;
  const lineCount = Math.max(18, value.split("\n").length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <section className="col-span-12 lg:col-span-7 flex flex-col gap-6">
      <div className="bg-surface border border-outline-variant/30 rounded flex flex-col h-full min-h-[600px]">
        {/* Panel Header */}
        <div className="bg-surface-container-low border-b border-outline-variant/30 p-4 flex justify-between items-center rounded-t">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              terminal
            </span>
            <span className="font-label-caps text-on-surface font-bold">
              Input Vector Analysis
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onLoadFile}
              disabled={isScanning}
              className="bg-surface hover:bg-surface-container-highest text-on-surface px-3 py-1 text-xs font-label-caps border border-outline-variant/30 transition-colors rounded disabled:opacity-50"
              title="Load sample source code file"
            >
              Load File
            </button>

            <button
              type="button"
              onClick={onScanNow}
              disabled={!canScan}
              className={`px-4 py-1 text-xs font-label-caps transition-colors shadow-sm rounded flex items-center gap-1.5 ${
                !canScan
                  ? "bg-primary/50 text-on-primary/70 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-on-primary"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[14px] ${
                  isScanning ? "animate-spin" : ""
                }`}
              >
                {isScanning ? "sync" : "radar"}
              </span>
              {isScanning ? "Scanning..." : "Scan Now"}
            </button>
          </div>
        </div>

        {/* Code Editor Container */}
        <div className="p-4 flex-1 flex flex-col relative group bg-surface rounded-b min-h-[500px]">
          {/* Simulated Line Numbers Gutter */}
          <div className="absolute left-4 top-4 bottom-4 w-8 border-r border-outline-variant/30 text-right pr-2 pt-2 font-data-mono text-[11px] text-on-surface-variant/70 select-none hidden sm:block overflow-hidden">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-relaxed">
                {num}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isScanning}
            placeholder="Paste source code or proprietary text here for deep analysis..."
            className="flex-1 w-full bg-transparent text-on-surface font-data-mono text-sm leading-relaxed outline-none resize-none sm:pl-12 pt-2 placeholder:text-on-surface-variant/50 focus:ring-0 min-h-[480px] disabled:opacity-60"
          />

          {/* Focus Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
