import { PricingTierCard } from "@/components/pricing/PricingTierCard";
import { PRICING_TIERS } from "@/components/pricing/mockData";

export default function PricingPage() {
  return (
    <div className="flex flex-col w-full px-8 py-12 gap-12 bg-background text-on-background max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-border-technical pb-8">
        <h1 className="font-display-lg text-on-surface tracking-tighter">
          OPERATIONAL TIERS
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          Select the appropriate Sentinel deployment for your network scale. All tiers include baseline anomaly detection.
        </p>
      </header>

      {/* 3-Column Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-border-technical p-1px border border-border-technical">
        {PRICING_TIERS.map((tier) => (
          <PricingTierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}
