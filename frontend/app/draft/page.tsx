"use client";

import { useState } from "react";
import { InventionDisclosureForm } from "@/components/draft/InventionDisclosureForm";
import { ClaimSetOutput } from "@/components/draft/ClaimSetOutput";
import { MOCK_DRAFT_RESULT, SAMPLE_DISCLOSURE } from "@/components/draft/mockData";
import { DraftResult } from "@/components/draft/types";

export default function DraftPage() {
  const [disclosureText, setDisclosureText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DraftResult | null>(null);

  const handleImportSpec = () => {
    setDisclosureText(SAMPLE_DISCLOSURE);
  };

  const handleGenerate = () => {
    if (!disclosureText.trim() || isGenerating) return;

    setIsGenerating(true);
    setResult(null);

    setTimeout(() => {
      setIsGenerating(false);
      setResult(MOCK_DRAFT_RESULT);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen text-on-background relative overflow-hidden pb-20">
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 flex flex-col gap-8">
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-border-technical pb-6">
          <div>
            <div className="font-label-caps text-primary tracking-[0.2em] mb-2">
              MODULE 04 // PATENT GENERATION
            </div>
            <h1 className="font-display-lg text-on-surface">Patent Drafter</h1>
            <p className="font-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Initialize algorithmic claim generation based on raw invention disclosures. Ensure input parameters adhere to drafting heuristics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-surface-container-low border border-border-technical font-data-mono text-text-muted flex items-center gap-2 text-xs rounded">
              <span className="w-2 h-2 rounded-full bg-risk-nominal animate-pulse" />
              LLM Engine Online
            </div>
          </div>
        </header>

        {/* Main Content 12-Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-px bg-border-technical border border-border-technical rounded">
          <InventionDisclosureForm
            value={disclosureText}
            onChange={setDisclosureText}
            onImportSpec={handleImportSpec}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          <ClaimSetOutput result={result} isGenerating={isGenerating} />
        </div>
      </div>
    </div>
  );
}
