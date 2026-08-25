"use client";

import { SAMPLE_EXECUTIVE_REPORT } from "./mockData";

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SampleReportModal({
  isOpen,
  onClose,
}: SampleReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-surface border border-border-technical rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-technical flex justify-between items-center bg-surface-industrial">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">
                mark_email_unread
              </span>
            </div>
            <div>
              <p className="font-label-caps text-xs text-primary">
                EXECUTIVE DIGEST PREVIEW
              </p>
              <h2 className="font-headline-md text-on-surface text-lg">
                IP Landscape Report — {SAMPLE_EXECUTIVE_REPORT.reportId}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-on-surface transition-colors cursor-pointer rounded hover:bg-surface-accent"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Metadata bar */}
          <div className="flex flex-wrap gap-4 text-xs font-data-mono bg-surface-container p-3 rounded border border-border-technical/60 justify-between text-on-surface-variant">
            <span>DATE: {SAMPLE_EXECUTIVE_REPORT.date}</span>
            <span>TIME: {SAMPLE_EXECUTIVE_REPORT.utcTime}</span>
            <span>SCOUT: SYNTHETIC INTELLIGENCE v4.2</span>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-surface-container-low border border-border-technical rounded">
            <h4 className="font-label-caps text-xs text-text-muted mb-2">
              EXECUTIVE SUMMARY
            </h4>
            <p className="font-body-md text-on-surface">
              {SAMPLE_EXECUTIVE_REPORT.summary}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-industrial border border-border-technical rounded text-center">
              <p className="font-label-caps text-[10px] text-text-muted">
                FILINGS SCANNED
              </p>
              <p className="font-headline-md text-primary text-xl mt-1">
                {SAMPLE_EXECUTIVE_REPORT.stats.scannedFilings.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-surface-industrial border border-border-technical rounded text-center">
              <p className="font-label-caps text-[10px] text-text-muted">
                CRITICAL THREATS
              </p>
              <p className="font-headline-md text-risk-critical text-xl mt-1">
                {SAMPLE_EXECUTIVE_REPORT.stats.flaggedCollisions}
              </p>
            </div>
            <div className="p-3 bg-surface-industrial border border-border-technical rounded text-center">
              <p className="font-label-caps text-[10px] text-text-muted">
                ACTIVE WATCHLISTS
              </p>
              <p className="font-headline-md text-on-surface text-xl mt-1">
                {SAMPLE_EXECUTIVE_REPORT.stats.activeWatchlists}
              </p>
            </div>
            <div className="p-3 bg-surface-industrial border border-border-technical rounded text-center">
              <p className="font-label-caps text-[10px] text-text-muted">
                PORTFOLIO HEALTH
              </p>
              <p className="font-headline-md text-risk-nominal text-xl mt-1">
                {SAMPLE_EXECUTIVE_REPORT.stats.portfolioHealthScore}
              </p>
            </div>
          </div>

          {/* Highlights List */}
          <div>
            <h4 className="font-label-caps text-xs text-text-muted mb-3">
              SYNTHESIZED HIGHLIGHTS & ACTION ITEMS
            </h4>
            <div className="space-y-2.5">
              {SAMPLE_EXECUTIVE_REPORT.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-surface-container-lowest border border-border-technical rounded"
                >
                  <span
                    className={`font-label-caps text-[10px] px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                      h.severity === "CRITICAL"
                        ? "bg-risk-critical/10 text-risk-critical border-risk-critical/30"
                        : h.severity === "WARNING"
                        ? "bg-risk-medium/10 text-risk-medium border-risk-medium/30"
                        : "bg-risk-nominal/10 text-risk-nominal border-risk-nominal/30"
                    }`}
                  >
                    {h.type}
                  </span>
                  <p className="font-body-sm text-on-surface text-sm">{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border-technical bg-surface-industrial flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-border-technical bg-surface text-on-surface font-label-caps text-xs px-5 py-2.5 rounded hover:bg-surface-accent transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
