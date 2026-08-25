"use client";

import { useState } from "react";
import { EnterpriseHero } from "@/components/enterprise/EnterpriseHero";
import { ProtocolGrid } from "@/components/enterprise/ProtocolGrid";
import { EnterpriseDeploymentModal } from "@/components/enterprise/EnterpriseDeploymentModal";

export default function EnterprisePage() {
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full font-body-md text-on-background bg-background min-h-full pb-20">
      {/* 1. HERO BANNER & MONITORED NODES WIDGET */}
      <EnterpriseHero
        onInitializeDeployment={() => setIsDeploymentModalOpen(true)}
      />

      {/* 2. FEATURE PROTOCOL GRID */}
      <ProtocolGrid />

      {/* 3. INTERACTIVE DEPLOYMENT MODAL */}
      <EnterpriseDeploymentModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />
    </div>
  );
}
