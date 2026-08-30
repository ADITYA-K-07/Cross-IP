"use client";

import { useState } from "react";
import { CodeEditorPanel } from "@/components/copyright/CodeEditorPanel";
import { CopyrightMetricsCard } from "@/components/copyright/CopyrightMetricsCard";
import { DetectedVectorCard } from "@/components/copyright/DetectedVectorCard";
import { MOCK_COPYRIGHT_RESULT, SAMPLE_CODE_INPUT } from "@/components/copyright/mockData";
import { CopyrightResult } from "@/components/copyright/types";

export default function CopyrightPage() {
  const [codeText, setCodeText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<CopyrightResult | null>(null);

  const handleLoadFile = () => {
    setCodeText(SAMPLE_CODE_INPUT);
  };

  const handleScanNow = () => {
    if (!codeText.trim() || isScanning) return;

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setHasSearched(true);
      setResult(MOCK_COPYRIGHT_RESULT);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Ambient Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto w-full p-6 lg:p-8 flex flex-col gap-8">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-6">
          <div>
            <h1 className="font-display-lg text-on-surface mb-2 tracking-tight">
              Copyright Monitor
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl">
              Initiate deep-scan analysis of source code or proprietary text against global intellectual property databases.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-label-caps text-on-surface-variant mb-1">
                System Load
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-surface-container-highest rounded-sm overflow-hidden border border-outline-variant/30">
                  <div
                    className={`h-full bg-primary transition-all ${
                      isScanning ? "w-[85%] animate-pulse" : "w-[35%]"
                    }`}
                  />
                </div>
                <span className="font-data-mono text-primary font-bold text-sm">
                  {isScanning ? "85%" : "35%"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main 12-Column Layout Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Code Editor */}
          <CodeEditorPanel
            value={codeText}
            onChange={setCodeText}
            onLoadFile={handleLoadFile}
            onScanNow={handleScanNow}
            isScanning={isScanning}
          />

          {/* Right Column: Metrics & Detected Vectors */}
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <CopyrightMetricsCard
              riskIndex={result ? result.riskIndex : null}
              fragmentsFound={result ? result.fragmentsFound : null}
              repositoryCount={result ? result.repositoryCount : null}
              isScanning={isScanning}
            />

            {/* Detected Vectors List */}
            <div className="bg-surface border border-outline-variant/30 flex-1 flex flex-col rounded min-h-[350px]">
              <div className="bg-surface-container-low border-b border-outline-variant/30 p-4 flex justify-between items-center rounded-t">
                <span className="font-label-caps text-on-surface font-bold">
                  Detected Vectors
                </span>
                <span className="font-data-mono text-[11px] text-on-surface border border-outline-variant/30 px-2 py-0.5 bg-surface rounded-sm">
                  Sort: Severity
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {isScanning && (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-3 text-text-muted font-data-mono text-sm">
                    <span className="material-symbols-outlined text-3xl text-primary animate-spin">
                      sync
                    </span>
                    <span>Performing Heuristic Code Snippet Analysis...</span>
                  </div>
                )}

                {!isScanning && result && result.vectors.length > 0 && (
                  <>
                    {result.vectors.map((vector) => (
                      <DetectedVectorCard key={vector.id} vector={vector} />
                    ))}
                  </>
                )}

                {!isScanning && (!result || !hasSearched) && (
                  <div className="p-8 text-center text-text-muted font-data-mono text-xs border border-dashed border-outline-variant/30 rounded bg-surface-container-lowest">
                    Paste source code or click &quot;Load File&quot; and then &quot;Scan Now&quot; to inspect code provenance vectors.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
