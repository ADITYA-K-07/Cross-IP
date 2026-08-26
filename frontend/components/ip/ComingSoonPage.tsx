import Link from "next/link";

export function ComingSoonPage({
  title,
  description,
  plan,
}: {
  title: string;
  description: string;
  plan: string;
}) {
  return (
    <div className="page-wrap">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to dashboard
      </Link>
      <section className="mx-auto mt-10 max-w-2xl rounded-lg border border-border-technical bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[30px]">lock</span>
        </span>
        <p className="mt-6 text-sm font-bold text-primary">Coming soon</p>
        <h1 className="mt-2 text-3xl font-bold text-on-surface">{title}</h1>
        <p className="mt-4 text-on-surface-variant">{description}</p>
        <p className="mt-5 rounded-lg bg-surface-container-low p-3 text-sm font-semibold text-on-surface">
          Available in the {plan} plan.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-white"
        >
          View plans
        </Link>
      </section>
    </div>
  );
}
