import Link from "next/link";
import {
  CopyrightMatch,
  PatentMatch,
  TrademarkMatch,
} from "./types";

export function ToolCard({
  title,
  description,
  href,
  icon,
  action,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-56 flex-col rounded-lg border border-border-technical bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </span>
      <h3 className="mt-5 text-lg font-bold text-on-surface">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-on-surface-variant">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {action}
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </span>
    </Link>
  );
}

export function LockedToolCard({
  title,
  description,
  icon,
  plan,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  plan: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-52 flex-col rounded-lg border border-dashed border-border-technical bg-surface-container-low p-6 text-left transition hover:border-primary hover:bg-white"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-text-muted">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </span>
      <h3 className="mt-5 text-lg font-bold text-on-surface">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-on-surface-variant">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-muted">
        <span className="material-symbols-outlined text-[16px]">lock</span>
        Coming soon in {plan}
      </span>
    </button>
  );
}

export function PatentCard({ patent }: { patent: PatentMatch }) {
  return (
    <article className="rounded-lg border border-border-technical bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted">{patent.patent_number}</p>
          <h3 className="mt-1 text-base font-bold text-on-surface">{patent.title}</h3>
          <p className="mt-1 text-sm text-text-muted">Filed: {patent.date}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {patent.similarity_pct}% similar
        </span>
      </div>
      <p className="mt-4 text-sm text-on-surface-variant">{patent.abstract_excerpt}</p>
      <a
        href={patent.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        View patent
        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
      </a>
    </article>
  );
}

export function TrademarkCard({ match }: { match: TrademarkMatch }) {
  return (
    <article className="rounded-lg border border-border-technical bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-on-surface">{match.name}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {match.category ?? "General"} - {match.registry ?? "Public source"}
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
          {match.similarity_pct}% similar
        </span>
      </div>
      <div className="mt-4 inline-flex rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
        {match.match_type}
      </div>
      <a
        href={match.source_url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary"
      >
        View source
        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
      </a>
    </article>
  );
}

export function CopyrightCard({ match }: { match: CopyrightMatch }) {
  return (
    <article className="rounded-lg border border-border-technical bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-on-surface">{match.title}</h3>
          <p className="mt-1 break-all text-sm text-text-muted">{match.url}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {match.similarity_pct}% match
        </span>
      </div>
      <p className="mt-4 text-sm text-on-surface-variant">{match.excerpt}</p>
      <a
        href={match.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        View source
        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
      </a>
    </article>
  );
}
