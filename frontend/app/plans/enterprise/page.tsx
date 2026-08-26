const features = [
  {
    name: "Trade secret leak monitor",
    description:
      "Scan public sites for sensitive company information that should not be outside your team. Early detection can protect patents, contracts, and competitive advantage.",
    icon: "lock",
  },
  {
    name: "IP landscape mapper",
    description:
      "Map who owns patents in your technology area and find open spaces for innovation. Use it for strategy, fundraising, and product planning.",
    icon: "hub",
  },
  {
    name: "Open source license conflict checker",
    description:
      "Flag GPL, LGPL, and AGPL risks in dependencies before diligence. It helps teams avoid accidental disclosure obligations.",
    icon: "code",
  },
  {
    name: "IP valuation estimator",
    description:
      "Estimate portfolio value using signals such as citations, claim breadth, and market activity. Useful for fundraising, M&A, and licensing talks.",
    icon: "monitoring",
  },
  {
    name: "Full API access and white-label",
    description:
      "Connect IPSentinel analysis to your own platform, law firm portal, or internal workflow. Built for multi-client and portfolio-scale use.",
    icon: "api",
  },
];

const audiences = ["Funded startups", "Law firms", "R&D teams"];

export default function EnterprisePlanPage() {
  return (
    <div className="page-wrap">
      <section className="rounded-lg border border-border-technical bg-white p-8">
        <p className="text-sm font-bold text-primary">Enterprise plan - INR 25,000 / month</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-on-surface">
          Your IP team, at a fraction of the cost.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
          Everything in Startup, plus deep intelligence tools for companies with serious IP portfolios.
        </p>
        <a
          href="mailto:teamamigos@example.com"
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-white"
        >
          Contact sales
        </a>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.name} className="rounded-lg border border-border-technical bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[22px]">{feature.icon}</span>
            </span>
            <h2 className="mt-5 text-xl font-bold text-on-surface">{feature.name}</h2>
            <p className="mt-3 text-on-surface-variant">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-on-surface">Who it is for</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {audiences.map((audience) => (
            <div key={audience} className="rounded-lg border border-border-technical bg-white p-5">
              <h3 className="font-bold text-on-surface">{audience}</h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Teams that need repeatable IP checks, clear reports, and stronger monitoring.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-primary p-6 text-white">
        <h2 className="text-2xl font-bold">Talk to us about your IP needs</h2>
        <p className="mt-2 text-white/85">We can shape the Enterprise plan around your team, portfolio, or client workflow.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:teamamigos@example.com"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 font-semibold text-primary"
          >
            Contact sales
          </a>
          <a
            href="#"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-5 font-semibold text-white hover:bg-white/10"
          >
            Calendar link coming soon
          </a>
        </div>
      </section>
    </div>
  );
}
