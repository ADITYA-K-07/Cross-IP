"use client";

import { useState } from "react";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { NoveltyModuleCard } from "@/components/catalog/NoveltyModuleCard";
import { DrafterModuleCard } from "@/components/catalog/DrafterModuleCard";
import { MarkScannerModuleCard } from "@/components/catalog/MarkScannerModuleCard";
import { CodeProvenanceModuleCard } from "@/components/catalog/CodeProvenanceModuleCard";
import { DocumentationModal } from "@/components/catalog/DocumentationModal";

export default function CatalogPage() {
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-full bg-surface text-on-surface pb-20">
      {/* Hero Texture / Grid Background */}
      <section className="relative w-full border-b border-border-technical bg-surface-container-lowest py-8 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none filter invert"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzXdcz9Ha28JsBghmGM8NGAD4uEs2f7cKUJYGQY2p1UTuFcWAt1lDsgDhkUds8okILwGMb_QQTmNE5saZkGCQEw_1rF7gbVVXvO-fl8-0iTCJEwfD_lsKG57K28yk12aSC322GA8x9dRo7CQ43XCMDFw6iT1sGqj7VsqMc0zVIlymtiv0sTaH7Bxft8UJpXXFYH23iP24gtvvskjtr18_dTlvY7PatWSV96M9EczUHAfLLP3z4AQjIf_dFdSGxbwlKNP0')",
            backgroundSize: "contain",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      </section>

      {/* Asymmetric Modules Grid Section */}
      <section className="p-gutter lg:p-margin-desktop bg-surface-industrial relative flex-1">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <CatalogHeader onOpenDocs={() => setIsDocsOpen(true)} />

          {/* Asymmetric 8 / 4 / 5 / 7 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Card 1: Novelty Engine (8 cols) */}
            <NoveltyModuleCard />

            {/* Card 2: Auto-Drafter (4 cols) */}
            <DrafterModuleCard />

            {/* Card 3: Mark Scanner (5 cols) */}
            <MarkScannerModuleCard />

            {/* Card 4: Code Provenance (7 cols) */}
            <CodeProvenanceModuleCard />
          </div>
        </div>
      </section>

      {/* Interactive Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
