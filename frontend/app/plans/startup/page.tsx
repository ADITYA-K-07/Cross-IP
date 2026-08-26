"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/ip/Modals";

const agents = [
  {
    name: "Competitor watch agent",
    description:
      "Track up to 5 competitors and get alerts when they file new patents. This helps you spot moves in your space before they surprise you.",
    icon: "visibility",
  },
  {
    name: "Freedom to operate checker",
    description:
      "Check whether a planned product may conflict with active patents. Use it before launch to find risky areas early.",
    icon: "gavel",
  },
  {
    name: "Deadline and renewal alerts",
    description:
      "Track patent maintenance fees, trademark renewals, and important IP dates. You get reminders before a missed date becomes expensive.",
    icon: "event_upcoming",
  },
  {
    name: "Weekly IP digest",
    description:
      "Receive a Monday summary of new filings, competitor activity, expiring prior art, and useful IP updates. It keeps your team informed without extra research.",
    icon: "summarize",
  },
];

export default function StartupPlanPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page-wrap">
      <section className="rounded-lg border border-border-technical bg-white p-8">
        <p className="text-sm font-bold text-primary">Startup plan - INR 3,000 / month</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-on-surface">
          We watch your IP space so you do not have to.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
          Set it once. Get alerts when competitors file, deadlines approach, or conflicts appear.
        </p>
        <button
          type="button"
          onClick={() => setWaitlistOpen(true)}
          className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white"
        >
          Join the waitlist
        </button>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {agents.map((agent) => (
          <article key={agent.name} className="rounded-lg border border-border-technical bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[22px]">{agent.icon}</span>
            </span>
            <h2 className="mt-5 text-xl font-bold text-on-surface">{agent.name}</h2>
            <p className="mt-3 text-on-surface-variant">{agent.description}</p>
            <div className="mt-5 rounded-lg bg-surface-container-low p-4 text-sm text-text-muted">
              Preview: alert timeline, source links, and recommended next action.
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-border-technical bg-white p-6">
        <h2 className="text-2xl font-bold text-on-surface">Founder notes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["[Testimonial from startup founder]", "[Testimonial from product lead]", "[Testimonial from student inventor]"].map((quote) => (
            <blockquote key={quote} className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
              {quote}
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-primary p-6 text-white">
        <h2 className="text-2xl font-bold">Be first when Startup launches</h2>
        <p className="mt-2 text-white/85">Join the waitlist and we will notify you when monitoring tools are ready.</p>
        {submitted ? (
          <div className="mt-5 rounded-lg bg-white/15 p-4 text-sm font-semibold">
            You are on the list. We will reach out soon.
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 flex-1 rounded-lg border border-white/30 bg-white px-4 text-on-surface outline-none focus:ring-2 focus:ring-white/60"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              className="min-h-12 rounded-lg bg-white px-5 font-semibold text-primary"
            >
              Notify me
            </button>
          </form>
        )}
      </section>

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
