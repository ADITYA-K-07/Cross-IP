"use client";

import { DraftResult } from "./types";
import { ClaimCard } from "./ClaimCard";

interface ClaimSetOutputProps {
  result: DraftResult | null;
  isGenerating: boolean;
}

export function ClaimSetOutput({
  result,
  isGenerating,
}: ClaimSetOutputProps) {
  const handleDownload = () => {
    if (!result || !result.claims || result.claims.length === 0) return;

    const formattedText = result.claims
      .map((c) => {
        let claimStr = `[CLAIM ${c.number}]\n${c.text}`;
        if (c.subClauses && c.subClauses.length > 0) {
          c.subClauses.forEach((sc) => {
            if (sc.title) {
              claimStr += `\n  - ${sc.title}: ${sc.text}`;
            } else {
              claimStr += `\n  - ${sc.text}`;
            }
            if (sc.nestedItems) {
              sc.nestedItems.forEach((ni) => {
                claimStr += `\n      * ${ni}`;
              });
            }
          });
        }
        return claimStr;
      })
      .join("\n\n");

    const headerNotice = `====================================================\nCrossIP PATENT DRAFTER — SPECIFICATION CLAIMS\nConfidence Score: ${result.confidenceScore}%\nGenerated At: ${new Date().toISOString()}\n====================================================\n\n`;

    const blob = new Blob([headerNotice + formattedText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `patent_claims_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="xl:col-span-7 flex flex-col bg-surface-industrial">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface-steel border-b border-border-technical">
        <h2 className="font-headline-md text-on-surface flex items-center gap-2 text-[20px]">
          <span className="material-symbols-outlined text-primary text-[20px]">
            gavel
          </span>
          Drafted Claims
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-data-mono text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-risk-nominal">
              check_circle
            </span>
            Confidence Score:{" "}
            <span className="text-on-surface font-semibold">
              {isGenerating ? "..." : result ? `${result.confidenceScore}%` : "--"}
            </span>
          </div>

          <div className="h-4 w-px bg-border-technical" />

          <button
            type="button"
            onClick={handleDownload}
            disabled={!result || isGenerating}
            className={`p-1.5 transition-colors rounded ${
              result && !isGenerating
                ? "text-text-muted hover:text-primary hover:bg-surface-container-high"
                : "text-text-muted/40 cursor-not-allowed"
            }`}
            title="Download claims specification as text file"
          >
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div className="p-6 overflow-y-auto max-h-[600px] flex flex-col gap-6">
        {isGenerating && (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3 text-text-muted font-data-mono text-sm">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">
              auto_awesome
            </span>
            <span>Algorithmic Claim Engine Constructing USPTO Claims...</span>
          </div>
        )}

        {!isGenerating && result && result.claims.length > 0 && (
          <>
            {result.claims.map((claim) => (
              <ClaimCard key={claim.number} claim={claim} />
            ))}
          </>
        )}

        {!isGenerating && !result && (
          <div className="p-12 text-center text-text-muted font-data-mono text-sm border border-dashed border-border-technical bg-surface-container-lowest rounded">
            Enter invention disclosure and click &quot;Generate Claim Set&quot; to generate structured patent claims.
          </div>
        )}
      </div>
    </div>
  );
}
