"use client";

import { useState } from "react";
import { PricingTier } from "./types";

interface PricingTierCardProps {
  tier: PricingTier;
}

export function PricingTierCard({ tier }: PricingTierCardProps) {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSelect = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 1500);
  };

  return (
    <div
      className={`flex flex-col h-full border ${
        tier.recommended
          ? "bg-surface border-primary relative shadow-sm"
          : "bg-surface-industrial border-border-technical"
      }`}
    >
      {/* Recommended Pill Badge */}
      {tier.recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-caps px-4 py-1 z-10 text-[11px] font-bold rounded-sm">
          RECOMMENDED
        </div>
      )}

      {/* Plan Header Box */}
      <div className="p-8 bg-surface-steel border-b border-border-technical flex flex-col gap-2">
        <h2
          className={`font-headline-md uppercase tracking-widest text-[20px] font-bold ${
            tier.recommended ? "text-primary" : "text-on-surface"
          }`}
        >
          {tier.name}
        </h2>

        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-[44px] font-bold text-on-surface">
            {tier.price}
          </span>
          {tier.period && (
            <span className="font-data-mono text-on-surface-variant text-sm">
              {tier.period}
            </span>
          )}
        </div>

        <p className="font-body-md text-on-surface-variant mt-2 h-12 text-sm leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Plan Body & Features */}
      <div className="p-8 flex flex-col flex-grow gap-6">
        <ul className="flex flex-col gap-4 font-data-mono text-sm text-on-surface">
          {tier.features.map((feat, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-3 ${
                !feat.included ? "text-on-surface-variant opacity-50" : ""
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  feat.included ? "text-primary" : "text-text-muted"
                }`}
              >
                {feat.included ? "check" : "close"}
              </span>
              <span>{feat.text}</span>
            </li>
          ))}
        </ul>

        {/* Action Button Footer */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={handleSelect}
            disabled={isDeploying}
            className={`w-full py-4 font-label-caps transition-colors flex items-center justify-center gap-2 text-xs font-bold rounded-sm ${
              tier.buttonVariant === "primary"
                ? "bg-primary text-on-primary hover:bg-primary/90"
                : "border border-border-technical text-on-surface hover:border-primary hover:text-primary"
            }`}
          >
            {isDeploying ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  sync
                </span>
                <span>ACTIVATING...</span>
              </>
            ) : (
              <>
                <span>{tier.buttonText}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {tier.buttonIcon}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
