"use client";

import { AGENT_MODULES_DOCS } from "./mockData";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentationModal({
  isOpen,
  onClose,
}: DocumentationModalProps) {
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
                menu_book
              </span>
            </div>
            <div>
              <p className="font-label-caps text-xs text-primary">
                TECHNICAL ARCHITECTURE
              </p>
              <h2 className="font-headline-md text-on-surface text-lg">
                Agent Modules Specification & Documentation
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

        {/* Documentation Content */}
        <div className="p-6 space-y-6 flex-1">
          <div className="p-4 bg-surface-container-low border border-border-technical rounded">
            <p className="font-body-md text-sm text-on-surface">
              IPSentinel Agent Modules operate as specialized autonomous intelligence units across the intellectual property lifecycle. Each module utilizes domain-trained ML pipelines for high-precision IP surveillance.
            </p>
          </div>

          <div className="space-y-4">
            {AGENT_MODULES_DOCS.map((mod) => (
              <div
                key={mod.id}
                className="p-4 bg-surface-container-lowest border border-border-technical rounded space-y-3"
              >
                <div className="flex justify-between items-center border-b border-border-technical/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {mod.icon}
                    </span>
                    <h3 className="font-headline-md text-base text-on-surface">
                      {mod.name}
                    </h3>
                  </div>
                  <span className="font-data-mono text-xs text-text-muted bg-surface-container px-2 py-0.5 rounded border border-border-technical/40">
                    {mod.version}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant">
                  {mod.description}
                </p>

                <div className="space-y-1">
                  <p className="font-label-caps text-[10px] text-text-muted uppercase">
                    Key Capabilities:
                  </p>
                  <ul className="space-y-1 font-data-mono text-xs text-on-surface">
                    {mod.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border-technical bg-surface-industrial flex justify-end">
          <button
            onClick={onClose}
            className="border border-border-technical bg-surface text-on-surface font-label-caps text-xs px-5 py-2.5 rounded hover:bg-surface-accent transition-colors cursor-pointer"
          >
            CLOSE DOCUMENTATION
          </button>
        </div>
      </div>
    </div>
  );
}
