"use client";

import { useState } from "react";
import { DEPENDENCY_AUDIT } from "./mockData";

export function OpenSourceProtocolCard() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [count, setCount] = useState(DEPENDENCY_AUDIT.totalAnalyzed);

  const handleRunAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setTimeout(() => {
      setCount((prev) => prev + 12);
      setIsAuditing(false);
    }, 800);
  };

  return (
    <div className="md:col-span-6 bg-surface flex flex-col hover:bg-surface-industrial transition-colors group">
      <div className="p-8 border-b border-border-technical">
        <div className="font-data-mono text-[10px] text-primary mb-2">
          03 // OSI-PROTOCOL
        </div>
        <h3 className="font-headline-md text-headline-md text-text-high-contrast mb-3">
          Open Source Integrity
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Automated dependency auditing to prevent viral license contamination
          (GPL/AGPL) within proprietary codebases.
        </p>
      </div>

      <div className="p-8 flex-1 bg-surface-container-lowest flex flex-col justify-center">
        {/* Terminal Audit Widget matching Stitch */}
        <div
          onClick={handleRunAudit}
          className="font-data-mono text-[12px] text-on-surface-variant space-y-1 bg-surface-industrial p-4 border border-border-technical cursor-pointer hover:border-primary/50 transition-colors"
          title="Click to execute dependency audit scan"
        >
          <div className="flex text-text-muted">
            <span className="w-4 text-border-technical select-none">1</span>{" "}
            <span className="text-primary">import</span> &#123; structuralAudit &#125;{" "}
            <span className="text-primary">from</span> &apos;@ips/core&apos;;
          </div>
          <div className="flex">
            <span className="w-4 text-border-technical select-none">2</span>
          </div>
          <div className="flex text-text-muted">
            <span className="w-4 text-border-technical select-none">3</span>{" "}
            <span className="text-primary">const</span> scanResults =
            structuralAudit.init();
          </div>
          <div className="flex">
            <span className="w-4 text-border-technical select-none">4</span>{" "}
            <span className="text-risk-nominal">
              &gt;[SYS] {isAuditing ? "Scanning AST..." : `${count.toLocaleString()} Dependencies Analyzed`}
            </span>
          </div>
          <div className="flex">
            <span className="w-4 text-border-technical select-none">5</span>{" "}
            <span className="text-risk-nominal">
              &gt;[SYS] {DEPENDENCY_AUDIT.viralLicenses} Viral Licenses Detected
            </span>
          </div>
          <div className="flex">
            <span className="w-4 text-border-technical select-none">6</span>{" "}
            <span className="text-primary animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
