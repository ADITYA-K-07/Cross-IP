"use client";

import { SAMPLE_INVENTION_TEXT } from "./mockData";

interface InventionInputProps {
  value: string;
  onChange: (value: string) => void;
  isScanning: boolean;
  maxLength?: number;
}

export function InventionInput({
  value,
  onChange,
  isScanning,
  maxLength = 10000,
}: InventionInputProps) {
  const currentLength = value.length;

  const handleSampleClick = () => {
    onChange(SAMPLE_INVENTION_TEXT);
  };

  return (
    <div className="col-span-12 lg:col-span-7 bg-surface-industrial flex flex-col relative border border-border-technical">
      {/* Header bar */}
      <div className="bg-surface-steel border-b border-border-technical px-6 py-3 flex justify-between items-center">
        <span className="font-label-caps text-text-muted">Input Designation</span>
        <span className="font-data-mono text-text-muted text-xs">TXT_STREAM_READY</span>
      </div>

      {/* Body content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* Status Indicator */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex gap-2 items-center">
            <span
              className={`w-2 h-2 rounded-full ${
                isScanning
                  ? "bg-primary animate-ping"
                  : currentLength > 0
                  ? "bg-risk-nominal"
                  : "bg-text-muted animate-pulse"
              }`}
            />
            <span className="font-data-mono text-[12px] text-text-muted">
              {isScanning
                ? "Scanning Global Vector Nodes..."
                : currentLength > 0
                ? "Sequence Active"
                : "Awaiting Sequence..."}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSampleClick}
            className="font-label-caps text-[10px] text-primary hover:underline transition-all"
            title="Load sample invention text for instant testing"
          >
            + Load Demo Disclosure
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          disabled={isScanning}
          placeholder="Describe the technical architecture, unique mechanisms, or novel processes of your invention in detail. Semantic parsing accepts plain text, code snippets, or structured claims..."
          className="w-full flex-1 min-h-[360px] bg-surface-container-lowest border border-border-technical text-on-surface font-body-md p-6 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted/50 leading-relaxed disabled:opacity-60"
        />

        {/* Footer Toolbar */}
        <div className="flex justify-between items-center text-text-muted pt-2 border-t border-border-technical/30">
          <div className="flex gap-2">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-border-technical hover:text-primary hover:border-primary transition-colors bg-white rounded"
              title="Import File"
            >
              <span className="material-symbols-outlined text-[18px]">
                upload_file
              </span>
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-border-technical hover:text-primary hover:border-primary transition-colors bg-white rounded"
              title="Link Reference URL"
            >
              <span className="material-symbols-outlined text-[18px]">
                link
              </span>
            </button>
          </div>

          <span className="font-data-mono text-[12px]">
            {currentLength.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
