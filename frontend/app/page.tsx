"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToolCard } from "@/components/ip/Cards";
import { RiskGauge } from "@/components/ip/RiskGauge";
import { freeTools, planCards } from "@/components/ip/data";

const steps = [
  "Tell us what you are building",
  "We search public IP sources",
  "AI compares the closest matches",
  "You get a clear risk score",
  "You decide the next step",
];

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const query = text.trim();
    if (query) {
      router.push(`/novelty?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/novelty");
    }
  };

  return (
    <div>
      <section className="border-b border-border-technical bg-white">
        <div className="page-wrap grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-bold text-primary">Free AI tools for early IP checks</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-on-surface sm:text-6xl">
              Is your invention already taken?
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              Check patents, draft claims, scan brand names, and look for copied text in simple English.
            </p>

            <div className="mt-8 rounded-lg border border-border-technical bg-surface-container-low p-3">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={5}
                className="w-full resize-none rounded-lg border border-border-technical bg-white p-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Describe your invention in a few sentences..."
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-muted">No legal jargon. Start with what it does and what makes it different.</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Check novelty
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border-technical bg-surface-container-low p-5">
            <RiskGauge score={23} label="Example conflict risk" />
            <div className="mt-5 rounded-lg bg-white p-4">
              <p className="text-sm font-semibold text-on-surface">Example result</p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Low risk. A few public patents are related, but the core idea looks different enough for a deeper search.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-technical bg-primary/5">
        <div className="page-wrap flex flex-col gap-3 py-5 text-sm font-semibold text-on-surface-variant md:flex-row md:items-center md:justify-center md:gap-8">
          <span>10M+ patents scanned</span>
          <span>Free to start</span>
          <span>No legal jargon</span>
        </div>
      </section>

      <section id="features" className="page-wrap">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold text-on-surface">Four free tools for your demo</h2>
          <p className="mt-3 text-on-surface-variant">
            Each tool is designed for a founder, student, or inventor who needs a first answer quickly.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {freeTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} title={tool.title} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="page-wrap">
          <h2 className="text-3xl font-bold text-on-surface">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-border-technical bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold text-on-surface">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Simple pricing</h2>
            <p className="mt-3 text-on-surface-variant">Free tools work now. Paid monitoring is shown as coming soon.</p>
          </div>
          <Link href="/pricing" className="font-semibold text-primary">
            View all plans
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {planCards.map((plan) => (
            <div key={plan.name} className="rounded-lg border border-border-technical bg-white p-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{plan.badge}</span>
              <h3 className="mt-4 text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-lg font-semibold text-on-surface-variant">{plan.price}</p>
              <ul className="mt-5 space-y-2 text-sm text-on-surface-variant">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="material-symbols-outlined text-[18px] text-risk-low">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
