"use client";

import Link from "next/link";

export interface ProtocolCardProps {
  code: string;
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  href?: string;
}

export function ProtocolCard({
  code,
  title,
  description,
  icon,
  ctaText,
  href = "#",
}: ProtocolCardProps) {
  return (
    <Link
      href={href}
      className="group bg-surface-industrial hover:bg-surface-accent transition-colors p-6 flex flex-col h-[280px] relative overflow-hidden text-left"
    >
      {/* Top Hover Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

      {/* Header: Icon & Protocol Code */}
      <div className="flex justify-between items-start mb-auto">
        <div className="w-10 h-10 border border-border-technical flex items-center justify-center text-text-muted group-hover:text-primary transition-colors bg-surface-container-lowest">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="font-label-caps text-text-muted">{code}</span>
      </div>

      {/* Content: Title & Description */}
      <div className="flex flex-col gap-2 mt-8">
        <h3 className="font-headline-md text-text-high-contrast">{title}</h3>
        <p className="font-body-md text-on-surface-variant line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer: Action Link */}
      <div className="mt-6 flex items-center gap-2 text-primary font-label-caps">
        <span>{ctaText}</span>
        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}
