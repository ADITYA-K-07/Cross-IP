"use client";

import { useState } from "react";

interface EnterpriseDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnterpriseDeploymentModal({
  isOpen,
  onClose,
}: EnterpriseDeploymentModalProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  if (!isOpen) return null;

  const handleStartDeployment = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
    }, 1600);
  };

  const handleResetClose = () => {
    setIsDeploying(false);
    setIsDeployed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-surface border border-border-technical rounded-lg w-full max-w-xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-technical flex justify-between items-center bg-surface-industrial">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">
                domain
              </span>
            </div>
            <div>
              <p className="font-label-caps text-xs text-primary">
                ENTERPRISE DEPLOYMENT PROTOCOL
              </p>
              <h2 className="font-headline-md text-on-surface text-lg">
                CrossIP Enterprise Architecture
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetClose}
            className="p-2 text-text-muted hover:text-on-surface transition-colors cursor-pointer rounded hover:bg-surface-accent"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isDeployed && !isDeploying && (
            <>
              <div className="p-4 bg-surface-container-low border border-border-technical rounded space-y-3">
                <div className="flex justify-between items-center text-xs font-data-mono text-on-surface-variant">
                  <span>DEPLOYMENT CLUSTER: 1,428 NODES</span>
                  <span className="text-risk-nominal">CLUSTER NOMINAL</span>
                </div>
                <p className="font-body-md text-sm text-on-surface">
                  Initializing Enterprise deployment will scale automated perimeter
                  scanning across trade secrets, IP landscape mapping, open-source
                  integrity, and algorithmic valuation engine.
                </p>
              </div>

              <div className="space-y-2 font-data-mono text-xs text-on-surface-variant bg-surface-industrial p-4 rounded border border-border-technical/60">
                <div className="flex justify-between">
                  <span>Protocol 01 (Trade Secret Monitor):</span>
                  <span className="text-risk-nominal font-semibold">Active Scanning</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol 02 (IP Landscape Mapper):</span>
                  <span className="text-on-surface font-semibold">Sector Alpha Synchronized</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol 03 (Open Source Integrity):</span>
                  <span className="text-risk-nominal font-semibold">4,192 Dependencies Clean</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol 04 (Valuation Estimator):</span>
                  <span className="text-primary font-semibold">$42.8M USD Portfolio</span>
                </div>
              </div>
            </>
          )}

          {isDeploying && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <span className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-data-mono text-sm text-primary tracking-wide">
                SCALING ENTERPRISE ARCHITECTURE NODES...
              </p>
            </div>
          )}

          {isDeployed && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-risk-nominal/10 border border-risk-nominal/30 flex items-center justify-center text-risk-nominal">
                <span className="material-symbols-outlined text-[28px]">
                  check_circle
                </span>
              </div>
              <div>
                <h3 className="font-headline-md text-on-surface text-lg">
                  Enterprise Architecture Active
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
                  1,428 monitored nodes online. Continuous threat scanning and landscape mapping operational.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border-technical bg-surface-industrial flex justify-end gap-3">
          {!isDeployed && !isDeploying && (
            <>
              <button
                onClick={handleResetClose}
                className="border border-border-technical bg-surface text-on-surface font-label-caps text-xs px-5 py-2.5 rounded hover:bg-surface-accent transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleStartDeployment}
                className="bg-primary text-on-primary font-label-caps text-xs px-6 py-2.5 rounded hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(124,58,237,0.3)]"
              >
                INITIALIZE CLUSTER{" "}
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </>
          )}

          {isDeployed && (
            <button
              onClick={handleResetClose}
              className="bg-primary text-on-primary font-label-caps text-xs px-6 py-2.5 rounded hover:opacity-90 transition-opacity cursor-pointer"
            >
              DONE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
