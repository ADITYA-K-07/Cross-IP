"use client";

export interface LockedModuleCardProps {
  code: string;
  title: string;
  description: string;
  icon: string;
}

export function LockedModuleCard({
  code,
  title,
  description,
  icon,
}: LockedModuleCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 flex flex-col h-[280px] relative overflow-hidden text-left">
      {/* Encrypted Lock Overlay */}
      <div className="absolute inset-0 bg-surface-industrial/80 flex items-center justify-center z-10 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="material-symbols-outlined text-[32px]">lock</span>
          <span className="font-label-caps text-label-caps">Encrypted</span>
        </div>
      </div>

      {/* Dimmed Underlying Content */}
      <div className="flex justify-between items-start mb-auto opacity-50">
        <div className="w-10 h-10 border border-border-technical flex items-center justify-center text-text-muted bg-surface-container-lowest">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="font-label-caps text-text-muted">{code}</span>
      </div>

      <div className="flex flex-col gap-2 mt-8 opacity-50">
        <h3 className="font-headline-md text-text-muted">{title}</h3>
        <p className="font-body-md text-on-surface-variant line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
