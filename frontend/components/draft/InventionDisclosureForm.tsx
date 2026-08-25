"use client";

import { BestPracticesPopover } from "./BestPracticesPopover";

interface InventionDisclosureFormProps {
  value: string;
  onChange: (value: string) => void;
  onImportSpec: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function InventionDisclosureForm({
  value,
  onChange,
  onImportSpec,
  onGenerate,
  isGenerating,
}: InventionDisclosureFormProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const canGenerate = value.trim().length > 0 && !isGenerating;

  return (
    <div className="xl:col-span-5 flex flex-col bg-surface-industrial border-r border-border-technical">
      {/* Form Header */}
      <div className="flex items-center justify-between p-4 bg-surface-steel border-b border-border-technical">
        <h2 className="font-headline-md text-on-surface flex items-center gap-2 text-[20px]">
          <span className="material-symbols-outlined text-primary text-[20px]">
            input
          </span>
          Invention Disclosure
        </h2>
        <BestPracticesPopover />
      </div>

      {/* Form Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[400px]">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isGenerating}
            placeholder="Enter detailed technical description of the invention..."
            className="w-full h-full bg-surface border border-border-technical p-4 font-data-mono text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none transition-all placeholder:text-text-muted/50 leading-relaxed text-sm disabled:opacity-60"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-text-muted font-label-caps bg-surface px-2 py-1 border border-border-technical/50 rounded">
            <span className="material-symbols-outlined text-[16px]">
              text_snippet
            </span>
            {wordCount} WORDS
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={onImportSpec}
            disabled={isGenerating}
            className="px-4 py-2 bg-surface-container-low border border-border-technical text-on-surface font-label-caps hover:bg-surface-container-high transition-colors flex items-center gap-2 rounded disabled:opacity-50"
            title="Import sample invention disclosure specification"
          >
            <span className="material-symbols-outlined text-[18px]">
              upload_file
            </span>
            Import Spec
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className={`px-6 py-3 bg-primary text-on-primary font-label-caps transition-colors flex items-center gap-2 shadow-sm rounded ${
              !canGenerate
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isGenerating ? "animate-spin" : ""
              }`}
            >
              {isGenerating ? "sync" : "auto_awesome"}
            </span>
            {isGenerating ? "Drafting Claims..." : "Generate Claim Set"}
          </button>
        </div>
      </div>
    </div>
  );
}
