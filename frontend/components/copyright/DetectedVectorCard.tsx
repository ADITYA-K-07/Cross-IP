"use client";

import { useState } from "react";
import { DetectedVector } from "./types";

interface DetectedVectorCardProps {
  vector: DetectedVector;
}

export function DetectedVectorCard({ vector }: DetectedVectorCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isHighMatch = vector.matchPercentage >= 75;

  return (
    <div className="border border-outline-variant/30 bg-surface-container-lowest p-4 hover:border-primary transition-colors cursor-pointer group rounded shadow-sm">
      {/* Header Info */}
      <div
        className="flex justify-between items-start mb-3 select-none"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isHighMatch ? "bg-risk-high" : "bg-risk-low"
              }`}
            />
            <span className="font-headline-md text-sm text-on-surface font-bold">
              {vector.filename}
            </span>
          </div>
          <span className="font-data-mono text-[11px] text-on-surface-variant">
            Repository: {vector.repository}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 font-data-mono text-[11px] font-bold rounded-sm ${
              isHighMatch
                ? "bg-error-container text-on-error-container border border-error-container"
                : "bg-surface-container-highest text-on-surface border border-outline-variant/30"
            }`}
          >
            {vector.matchPercentage}% Match
          </span>

          <span className="material-symbols-outlined text-[16px] text-text-muted group-hover:text-primary transition-colors">
            {isExpanded ? "expand_less" : "expand_more"}
          </span>
        </div>
      </div>

      {/* Code Snippet Block with Matched Line Highlights */}
      {isExpanded && (
        <div className="bg-surface-container-low border border-outline-variant/30 p-3 font-data-mono text-[12px] text-on-surface overflow-x-auto whitespace-pre rounded-sm">
          <code>
            {vector.lines.map((line, idx) => (
              <div key={idx} className="leading-relaxed">
                {line.isMatched ? (
                  <span className="text-error bg-error-container/50 px-1 font-bold">
                    {line.lineText}
                  </span>
                ) : (
                  <span>{line.lineText}</span>
                )}
              </div>
            ))}
          </code>
        </div>
      )}
    </div>
  );
}
