"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Join the waitlist</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              We will tell you when paid plans are ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-technical"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-700">
            You are on the list. We will reach out soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <label className="text-sm font-semibold text-on-surface" htmlFor="waitlist-email">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-border-technical px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
            >
              Notify me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function UpgradeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">More tools are coming</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Startup and Enterprise plans add monitoring, alerts, and deeper analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-technical"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-technical p-5">
            <p className="text-sm font-semibold text-primary">Startup</p>
            <h3 className="mt-1 text-lg font-bold">For active founders</h3>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>Competitor watch</li>
              <li>Freedom to operate checks</li>
              <li>Weekly IP digest</li>
            </ul>
            <Link
              href="/plans/startup"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              View Startup plan
            </Link>
          </div>
          <div className="rounded-lg border border-border-technical p-5">
            <p className="text-sm font-semibold text-primary">Enterprise</p>
            <h3 className="mt-1 text-lg font-bold">For IP-heavy teams</h3>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>Trade secret leak monitor</li>
              <li>IP landscape mapping</li>
              <li>API access and client portal</li>
            </ul>
            <Link
              href="/plans/enterprise"
              className="mt-5 inline-flex rounded-lg border border-border-technical px-4 py-2 text-sm font-semibold text-on-surface"
            >
              View Enterprise plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
