"use client";

import { TradeSecretProtocolCard } from "./TradeSecretProtocolCard";
import { LandscapeProtocolCard } from "./LandscapeProtocolCard";
import { OpenSourceProtocolCard } from "./OpenSourceProtocolCard";
import { ValuationProtocolCard } from "./ValuationProtocolCard";

export function ProtocolGrid() {
  return (
    <section className="relative z-20 px-8 max-w-[1440px] mx-auto w-full py-24 bg-surface">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-border-technical p-[1px]">
        {/* Protocol 01: Trade Secret Monitor */}
        <TradeSecretProtocolCard />

        {/* Protocol 02: IP Landscape Mapper */}
        <LandscapeProtocolCard />

        {/* Protocol 03: Open Source Integrity */}
        <OpenSourceProtocolCard />

        {/* Protocol 04: Valuation Estimator */}
        <ValuationProtocolCard />
      </div>
    </section>
  );
}
