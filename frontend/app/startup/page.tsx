"use client";

import { useState } from "react";
import { StartupHero } from "@/components/startup/StartupHero";
import { TelemetryBar } from "@/components/startup/TelemetryBar";
import { CoreModules } from "@/components/startup/CoreModules";
import { SampleReportModal } from "@/components/startup/SampleReportModal";
import { SpecsModal } from "@/components/startup/SpecsModal";
import { DeploymentModal } from "@/components/startup/DeploymentModal";

export default function StartupPage() {
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);

  return (
    <div className="flex flex-col w-full text-on-background font-body-md bg-background min-h-full pb-20">
      {/* 1. HERO BANNER */}
      <StartupHero
        onInitiateDeployment={() => setIsDeploymentOpen(true)}
        onViewSpecs={() => setIsSpecsOpen(true)}
      />

      {/* 2. SYSTEM TELEMETRY BAR */}
      <TelemetryBar />

      {/* 3. CORE MODULES (Asymmetric 2x2 Grid) */}
      <CoreModules
        onOpenSampleReport={() => setIsSampleReportOpen(true)}
      />

      {/* 4. INTERACTIVE MODALS */}
      <SampleReportModal
        isOpen={isSampleReportOpen}
        onClose={() => setIsSampleReportOpen(false)}
      />

      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      <DeploymentModal
        isOpen={isDeploymentOpen}
        onClose={() => setIsDeploymentOpen(false)}
      />
    </div>
  );
}
