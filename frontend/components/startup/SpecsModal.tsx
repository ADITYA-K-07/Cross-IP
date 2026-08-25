"use client";

import { SYSTEM_SPECS } from "./mockData";

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpecsModal({ isOpen, onClose }: SpecsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-surface border border-border-technical rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-technical flex justify-between items-center bg-surface-industrial">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">
                settings_suggest
              </span>
            </div>
            <div>
              <p className="font-label-caps text-xs text-primary">
                SYSTEM SPECIFICATIONS
              </p>
              <h2 className="font-headline-md text-on-surface text-lg">
                Startup Tier Architecture & Protocols
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

        {/* Specs Content Grid */}
        <div className="p-6 space-y-4 flex-1">
          <div className="grid grid-cols-1 gap-4">
            {SYSTEM_SPECS.map((spec, index) => (
              <div
                key={index}
                className="p-4 bg-surface-container-lowest border border-border-technical rounded flex flex-col gap-2"
              >
                <div className="flex justify-between items-center border-b border-border-technical/60 pb-2">
                  <span className="font-label-caps text-xs text-primary">
                    {spec.category}
                  </span>
                  <span className="font-data-mono text-xs font-semibold text-on-surface bg-surface-container px-2 py-0.5 rounded border border-border-technical/40">
                    {spec.value}
                  </span>
                </div>
                <h4 className="font-headline-md text-sm text-on-surface">
                  {spec.title}
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {spec.detail}
                </p>
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
            CLOSE SPECS
          </button>
        </div>
      </div>
    </div>
  );
}
