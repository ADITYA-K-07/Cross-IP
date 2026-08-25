"use client";

import { useState } from "react";
import { InventionInput } from "@/components/novelty/InventionInput";
import { ScanDiagnostics } from "@/components/novelty/ScanDiagnostics";
import { MOCK_NOVELTY_RESULT } from "@/components/novelty/mockData";
import { NoveltyResult } from "@/components/novelty/types";

export default function NoveltyPage() {
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<NoveltyResult | null>(null);

  const canExecute = inputText.trim().length > 0 && !isScanning;

  const handleExecuteScan = () => {
    if (!canExecute) return;

    setIsScanning(true);
    setResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      setIsScanning(false);
      setHasSearched(true);
      setResult(MOCK_NOVELTY_RESULT);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full h-full p-gutter gap-gutter max-w-[1440px] mx-auto pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border-technical">
        <div>
          <h1 className="font-headline-lg text-on-surface">
            Patent Novelty Analysis
          </h1>
          <p className="font-body-md text-text-muted mt-2">
            Real-time semantic scanning against global intellectual property databases.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="bg-transparent border border-border-technical text-text-muted px-4 py-2 flex items-center gap-2 hover:border-primary hover:text-primary transition-colors rounded"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="font-label-caps">Filters</span>
          </button>

          <button
            type="button"
            onClick={handleExecuteScan}
            disabled={!canExecute}
            className={`bg-primary text-on-primary px-6 py-2 flex items-center gap-2 transition-all relative overflow-hidden group rounded ${
              !canExecute ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isScanning ? "animate-spin" : ""
              }`}
            >
              {isScanning ? "sync" : "radar"}
            </span>
            <span className="font-label-caps">
              {isScanning
                ? "Scanning..."
                : hasSearched
                ? "Re-Scan"
                : "Execute Scan"}
            </span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-12 gap-panel-gap bg-border-technical border border-border-technical min-h-[600px]">
        <InventionInput
          value={inputText}
          onChange={setInputText}
          isScanning={isScanning}
        />
        <ScanDiagnostics
          result={result}
          isScanning={isScanning}
          hasSearched={hasSearched}
        />
      </div>
    </div>
  );
}
