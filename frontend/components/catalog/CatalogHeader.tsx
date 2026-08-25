"use client";

interface CatalogHeaderProps {
  onOpenDocs: () => void;
}

export function CatalogHeader({ onOpenDocs }: CatalogHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border-technical pb-6">
      <div>
        <h2 className="font-headline-lg text-text-high-contrast uppercase tracking-tight">
          Agent Modules
        </h2>
        <p className="font-body-md text-text-muted max-w-md mt-2">
          Specialized AI systems designed for distinct phases of the intellectual
          property lifecycle.
        </p>
      </div>
      <button
        onClick={onOpenDocs}
        className="bg-primary border-none text-on-primary hover:opacity-90 px-6 py-2.5 font-label-caps transition-all cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.3)] active:scale-[0.98]"
      >
        View Documentation
      </button>
    </div>
  );
}
