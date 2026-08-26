"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { WaitlistModal } from "@/components/ip/Modals";
import { comparisonGroups, faqs, planCards } from "@/components/ip/data";

const missingFeaturesByPlan: Record<string, string[]> = {
  Free: [
    "Unlimited IP checks",
    "Competitor watch",
    "Freedom to operate checker",
    "Weekly IP digest",
    "Trade secret leak monitor",
    "API access",
  ],
  Startup: [
    "Trade secret leak monitor",
    "IP landscape mapper",
    "Open source license checks",
    "IP valuation estimate",
    "Law firm client portal",
  ],
  Enterprise: [],
};

export default function PricingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [highlighted, setHighlighted] = useState("");

  return (
    <div className="page-wrap">
      <header className="max-w-3xl">
        <p className="text-sm font-bold text-primary">Monthly plans</p>
        <h1 className="mt-3 text-4xl font-bold text-on-surface">Simple pricing. Serious protection.</h1>
        <p className="mt-4 text-lg text-on-surface-variant">
          Start free. Upgrade when your IP needs monitoring, alerts, and deeper analysis.
        </p>
        <div className="mt-6 inline-flex rounded-lg border border-border-technical bg-white p-1">
          <span className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Monthly</span>
        </div>
      </header>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {planCards.map((plan) => (
          <div key={plan.name} className="flex rounded-lg border border-border-technical bg-white p-6 shadow-sm">
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-on-surface">{plan.name}</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{plan.badge}</span>
              </div>
              <p className="mt-3 text-xl font-semibold text-on-surface-variant">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-on-surface-variant">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="material-symbols-outlined text-[18px] text-risk-low">check_circle</span>
                    {feature}
                  </li>
                ))}
                {missingFeaturesByPlan[plan.name].map((feature) => (
                  <li key={feature} className="flex gap-2 text-text-muted line-through opacity-70">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.name === "Free" && (
                <Link href="/dashboard" className="mt-6 rounded-lg bg-primary px-4 py-3 text-center font-semibold text-white">
                  Get started free
                </Link>
              )}
              {plan.name === "Startup" && (
                <>
                  <button
                    type="button"
                    onClick={() => setWaitlistOpen(true)}
                    className="mt-6 rounded-lg bg-primary px-4 py-3 font-semibold text-white"
                  >
                    Join waitlist
                  </button>
                  <Link href="/plans/startup" className="mt-3 text-center text-sm font-semibold text-primary">
                    View Startup details
                  </Link>
                </>
              )}
              {plan.name === "Enterprise" && (
                <>
                  <a
                    href="mailto:teamamigos@example.com"
                    className="mt-6 rounded-lg border border-border-technical px-4 py-3 text-center font-semibold text-on-surface hover:border-primary hover:text-primary"
                  >
                    Contact us
                  </a>
                  <button type="button" onClick={() => setWaitlistOpen(true)} className="mt-3 text-sm font-semibold text-primary">
                    Join waitlist
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-lg border border-border-technical bg-white p-5">
        <h2 className="text-2xl font-bold text-on-surface">Compare features</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-technical text-left">
                <th className="py-3 pr-4">Feature</th>
                <th className="py-3 px-4">Free</th>
                <th className="py-3 px-4">Startup</th>
                <th className="py-3 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonGroups.map((group) => (
                <Fragment key={group.group}>
                  <tr>
                    <td colSpan={4} className="bg-surface-container-low py-3 pr-4 font-bold text-primary">
                      {group.group}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={row[0]}
                      onClick={() => setHighlighted(row[0])}
                      className={`cursor-pointer border-b border-border-technical transition ${
                        highlighted === row[0] ? "bg-primary/5" : "hover:bg-surface-container-low"
                      }`}
                    >
                      <td className="py-3 pr-4 font-semibold text-on-surface">{row[0]}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{row[1]}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{row[2]}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{row[3]}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-on-surface">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-lg border border-border-technical bg-white p-5">
              <h3 className="font-bold text-on-surface">{faq.q}</h3>
              <p className="mt-2 text-sm text-on-surface-variant">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
