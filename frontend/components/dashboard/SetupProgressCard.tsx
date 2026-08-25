"use client";

interface SetupProgressCardProps {
  title?: string;
  checksRemaining?: number;
  progressPercent?: number;
}

export function SetupProgressCard({
  title = "Setup Protocol",
  checksRemaining = 5,
  progressPercent = 35,
}: SetupProgressCardProps) {
  return (
    <div className="bg-surface-accent border border-border-technical rounded p-4 min-w-[300px] flex flex-col gap-3 shadow-none">
      <div className="flex justify-between items-center">
        <span className="font-label-caps text-on-surface-variant">
          {title}
        </span>
        <span className="font-data-mono text-primary font-medium">
          {checksRemaining} checks remaining
        </span>
      </div>
      <div className="w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
