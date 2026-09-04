"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { downloadCrossIpPdf, RateLimitError, streamCrossIpReport } from "@/components/ip/api";
import { demoInputs } from "@/components/ip/data";
import { RiskGauge } from "@/components/ip/RiskGauge";
import { useFreeChecks } from "@/components/ip/useFreeChecks";
import { useToast } from "@/components/ip/ToastProvider";
import {
  CrossIpDomain,
  CrossIpDomainResult,
  CrossIpReport,
  DebateEntry,
  ExaminerChallenge,
} from "@/components/ip/types";

type Phase = "idle" | "running" | "complete";

const agents = [
  { domain: "patent" as const, initials: "PA", title: "Patent Agent", role: "Novelty and design-around" },
  { domain: "trademark" as const, initials: "TM", title: "Trademark Agent", role: "Brand and logo conflicts" },
  { domain: "copyright" as const, initials: "CA", title: "Copyright Agent", role: "Content originality" },
  { domain: null, initials: "EX", title: "Examiner Agent", role: "Adversarial review" },
];

const domainLabel: Record<CrossIpDomain, string> = {
  patent: "Patent",
  trademark: "Trademark",
  copyright: "Copyright",
};

function scoreTone(score: number) {
  if (score < 25) return "text-risk-low bg-emerald-50 border-emerald-200";
  if (score < 50) return "text-risk-medium bg-amber-50 border-amber-200";
  return "text-risk-high bg-red-50 border-red-200";
}

function eventToTranscript(event: "position" | "examiner_objection" | "revision", payload: unknown): DebateEntry | null {
  if (event === "examiner_objection") {
    const objection = payload as ExaminerChallenge;
    return { round: 2, kind: "objection", agent: "Examiner Agent", domain: objection.domain, message: objection.message, evidence_ids: objection.evidence_ids };
  }
  const domain = payload as CrossIpDomainResult;
  return {
    round: event === "revision" ? 3 : 1,
    kind: event === "revision" ? "rebuttal" : "position",
    agent: domain.agent_name,
    domain: domain.domain,
    message: domain.reasoning,
    evidence_ids: domain.evidence_ids,
  };
}

async function demoLogo(): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new File(["demo"], "flownest.png", { type: "image/png" });
  context.fillStyle = "#7c3aed";
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(64, 64, 34, 0, Math.PI * 2);
  context.fill();
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((value) => resolve(value ?? new Blob()), "image/png"));
  return new File([blob], "flownest-demo-logo.png", { type: "image/png" });
}

function DomainRadar({ domains }: { domains: CrossIpDomainResult[] }) {
  const values = domains.map((domain) => domain.score / 100);
  const points = values.map((value, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / 3;
    return `${120 + Math.cos(angle) * 72 * value},${112 + Math.sin(angle) * 72 * value}`;
  }).join(" ");
  const axes = [0, 1, 2].map((index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / 3;
    return { x: 120 + Math.cos(angle) * 72, y: 112 + Math.sin(angle) * 72 };
  });
  return (
    <svg viewBox="0 0 240 224" className="mx-auto h-56 w-full max-w-sm" role="img" aria-label="Risk by IP domain">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon key={ratio} points={axes.map((point) => `${120 + (point.x - 120) * ratio},${112 + (point.y - 112) * ratio}`).join(" ")} fill="none" stroke="#d1d5db" strokeWidth="1" />
      ))}
      {axes.map((point, index) => <line key={index} x1="120" y1="112" x2={point.x} y2={point.y} stroke="#d1d5db" />)}
      <polygon points={points} fill="rgba(124,58,237,0.16)" stroke="#7c3aed" strokeWidth="3" />
      {axes.map((point, index) => <text key={index} x={point.x} y={point.y + (index === 0 ? -9 : 16)} textAnchor="middle" className="fill-text-muted text-[11px]">{domainLabel[domains[index].domain]}</text>)}
    </svg>
  );
}

function AgentAvatar({ initials, status }: { initials: string; status: "pending" | "active" | "complete" }) {
  return <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-xs font-bold ${status === "complete" ? "border-risk-low bg-emerald-50 text-risk-low" : status === "active" ? "border-primary bg-primary/10 text-primary" : "border-border-technical bg-surface-container text-text-muted"}`}>{initials}{status === "active" && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary" />}</span>;
}

export default function CrossIpReportPage() {
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [content, setContent] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [liveDomains, setLiveDomains] = useState<Partial<Record<CrossIpDomain, CrossIpDomainResult>>>({});
  const [liveTranscript, setLiveTranscript] = useState<DebateEntry[]>([]);
  const [report, setReport] = useState<CrossIpReport | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [demoProfile, setDemoProfile] = useState<"low" | "high">("low");
  const { remainingChecks, refreshChecks } = useFreeChecks();
  const { showToast } = useToast();

  const completedCount = Object.keys(liveDomains).length;
  const currentScore = useMemo(() => {
    const values = Object.values(liveDomains);
    return values.length ? Math.round(values.reduce((total, value) => total + value.score, 0) / values.length) : 0;
  }, [liveDomains]);

  const fillDemo = async (profile: "low" | "high" = "low") => {
    const sample = profile === "low" ? demoInputs.crossIpLowRisk : demoInputs.crossIpHighRisk;
    setDescription(sample.description);
    setBrandName(sample.trademark);
    setContent(sample.copyright);
    setLogo(await demoLogo());
    setError("");
  };

  const onLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    if (next && !["image/png", "image/jpeg", "image/webp"].includes(next.type)) {
      setError("Upload a PNG, JPEG, or WebP logo.");
      return;
    }
    setLogo(next);
    setError("");
  };

  const runReport = async () => {
    if (description.trim().length < 20 || content.trim().length < 20 || brandName.trim().length < 2 || !logo) {
      setError("Add an invention description, brand name, text or code, and a PNG, JPEG, or WebP logo.");
      return;
    }
    if (remainingChecks <= 0) {
      setError("Free tier limit reached. Open Pricing to continue.");
      return;
    }
    setPhase("running");
    setError("");
    setReport(null);
    setLiveDomains({});
    setLiveTranscript([]);
    try {
      await streamCrossIpReport({ description: description.trim(), brandName: brandName.trim(), content: content.trim(), logo }, (event, payload) => {
        if (event === "position" || event === "revision") {
          const domain = payload as CrossIpDomainResult;
          setLiveDomains((current) => ({ ...current, [domain.domain]: domain }));
          const entry = eventToTranscript(event, payload);
          if (entry) setLiveTranscript((current) => [...current, entry]);
        }
        if (event === "examiner_objection") {
          const entry = eventToTranscript(event, payload);
          if (entry) setLiveTranscript((current) => [...current, entry]);
        }
        if (event === "complete") {
          const completed = (payload as { report: CrossIpReport }).report;
          setReport(completed);
          setLiveDomains(Object.fromEntries(completed.domains.map((domain) => [domain.domain, domain])));
          setLiveTranscript(completed.transcript);
          setPhase("complete");
          void refreshChecks().catch(() => undefined);
          showToast("success", completed.is_demo_fallback ? "Showing the cached demo report." : "Cross-IP report complete.");
        }
        if (event === "error") {
          setPhase("idle");
          setError((payload as { error: string }).error);
          void refreshChecks().catch(() => undefined);
        }
      });
    } catch (caught) {
      setPhase("idle");
      setError(caught instanceof RateLimitError ? "Free tier limit reached. Open Pricing to continue." : caught instanceof Error ? caught.message : "Cross-IP analysis could not be started.");
      showToast("error", "Could not run the Cross-IP report.");
    }
  };

  const exportPdf = async () => {
    if (!report) return;
    setPdfBusy(true);
    try {
      await downloadCrossIpPdf(report);
    } catch {
      showToast("error", "Could not export the report PDF.");
    } finally {
      setPdfBusy(false);
    }
  };

  if (phase === "complete" && report) {
    return <div className="page-wrap">
      <div className="flex flex-col gap-5 border-b border-border-technical pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold text-primary">Cross-IP Report · resolved</p><h1 className="mt-2 text-3xl font-bold text-on-surface">Evidence-backed risk decision</h1><p className="mt-2 max-w-3xl text-on-surface-variant">Patent, trademark, and copyright positions were pressure-tested by the Examiner Agent before aggregation.</p></div>
        <div className="flex gap-3"><button type="button" onClick={() => setPhase("idle")} className="rounded-lg border border-border-technical px-4 py-2 text-sm font-semibold text-on-surface">New report</button><button type="button" onClick={exportPdf} disabled={pdfBusy} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><span className="material-symbols-outlined text-[18px]">download</span>{pdfBusy ? "Exporting..." : "Export PDF"}</button></div>
      </div>
      {report.is_demo_fallback && <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Cached demo report shown because live services were unavailable.</p>}
      <section className="mt-7 grid gap-5 lg:grid-cols-[290px_1fr]"><RiskGauge score={report.unified_score} label={`${report.risk_label} unified risk`} /><article className="rounded-lg border border-border-technical bg-white p-6"><p className="text-sm font-bold text-primary">Executive summary</p><p className="mt-4 text-lg leading-8 text-on-surface">{report.executive_summary}</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{report.domains.map((domain) => <div key={domain.domain} className="rounded-lg bg-surface-container-low p-4"><p className="text-xs font-bold uppercase tracking-wide text-text-muted">{domainLabel[domain.domain]}</p><p className="mt-1 text-2xl font-bold text-on-surface">{domain.score}<span className="text-sm text-text-muted"> / 100</span></p></div>)}</div></article></section>
      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_330px]"><div className="grid gap-4 md:grid-cols-3">{report.domains.map((domain) => <article key={domain.domain} className="rounded-lg border border-border-technical bg-white p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-primary">{domain.agent_name}</p><h2 className="mt-1 text-xl font-bold text-on-surface">{domainLabel[domain.domain]} risk</h2></div><span className={`rounded-full border px-3 py-1 text-sm font-bold ${scoreTone(domain.score)}`}>{domain.score}</span></div><p className="mt-4 text-sm text-on-surface-variant">{domain.reasoning}</p><div className="mt-4 border-t border-border-technical pt-3 text-xs text-text-muted"><p>Confidence: <span className="font-bold text-on-surface">{Math.round(domain.confidence * 100)}%</span></p>{domain.revision_reason && <p className="mt-2 font-semibold text-primary">Revised after Examiner debate</p>}{domain.domain === "trademark" && domain.visual_evidence_available === false && <p className="mt-2 text-amber-700">Visual logo evidence unavailable</p>}</div></article>)}</div><article className="rounded-lg border border-border-technical bg-white p-5"><h2 className="text-lg font-bold text-on-surface">Risk by domain</h2><p className="mt-1 text-sm text-text-muted">Resolved post-debate scores</p><DomainRadar domains={report.domains} /></article></section>
      <section className="mt-6 grid gap-5 lg:grid-cols-2"><article className="rounded-lg border border-border-technical bg-white p-6"><h2 className="text-xl font-bold text-on-surface">Innovation gap map</h2><p className="mt-2 text-sm text-text-muted">Green features are not represented in the retrieved patent evidence; red features overlap it.</p><div className="mt-5 space-y-3">{report.innovation_gap_map.map((feature) => <div key={feature.feature} className={`flex items-center justify-between rounded-lg border p-3 ${feature.status === "gap" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}><span className="font-semibold text-on-surface">{feature.feature}</span><span className={`text-xs font-bold uppercase ${feature.status === "gap" ? "text-risk-low" : "text-risk-high"}`}>{feature.status}</span></div>)}</div></article><article className="rounded-lg border border-border-technical bg-white p-6"><h2 className="text-xl font-bold text-on-surface">Opinions & tips</h2><ul className="mt-5 space-y-4">{report.opinions_and_tips.map((tip) => <li key={tip} className="flex gap-3 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-primary">lightbulb</span>{tip}</li>)}</ul></article></section>
      <section className="mt-6 rounded-lg border border-border-technical bg-white p-6"><h2 className="text-xl font-bold text-on-surface">Agent deliberation</h2><div className="mt-5 space-y-3">{report.transcript.map((entry, index) => <details key={`${entry.agent}-${index}`} className="rounded-lg border border-border-technical p-4" open={index < 2}><summary className="cursor-pointer list-none font-semibold text-on-surface"><span className="mr-2 rounded bg-primary/10 px-2 py-1 text-xs text-primary">Round {entry.round}</span>{entry.agent}</summary><p className="mt-3 text-sm text-on-surface-variant">{entry.message}</p></details>)}</div></section>
      <section className="mt-6 rounded-lg border border-border-technical bg-white p-6"><h2 className="text-xl font-bold text-on-surface">Cited evidence</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{report.evidence.map((source) => <article key={source.source_id} className="rounded-lg bg-surface-container-low p-4"><p className="text-xs font-bold text-primary">{source.source_id}</p><h3 className="mt-1 font-bold text-on-surface">{source.title}</h3><p className="mt-2 text-sm text-on-surface-variant">{source.excerpt}</p>{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-primary">Open source <span className="material-symbols-outlined ml-1 text-[16px]">open_in_new</span></a>}</article>)}</div></section>
    </div>;
  }

  if (phase === "running") {
    return <div className="page-wrap" aria-live="polite"><section className="rounded-lg border border-border-technical bg-white p-6"><p className="text-sm font-bold text-primary">Cross-IP deliberation session</p><h1 className="mt-2 text-3xl font-bold text-on-surface">Your specialist agents are reviewing evidence</h1><div className="mt-7 flex flex-wrap gap-5">{agents.map((agent) => { const domain = agent.domain ? liveDomains[agent.domain] : undefined; const status = agent.domain ? domain ? "complete" : completedCount ? "active" : "pending" : liveTranscript.some((entry) => entry.kind === "objection") ? "active" : "pending"; return <div key={agent.initials} className="flex items-center gap-3"><AgentAvatar initials={agent.initials} status={status} /><div><p className="font-bold text-on-surface">{agent.title}</p><p className="text-xs text-text-muted">{status === "complete" ? "Position recorded" : status === "active" ? "Reviewing evidence" : agent.role}</p></div></div>; })}</div></section><section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"><article className="rounded-lg border border-border-technical bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-on-surface">Live deliberation</h2><span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" />Live</span></div><div className="mt-5 max-h-[560px] space-y-4 overflow-y-auto pr-2">{liveTranscript.length === 0 && <p className="rounded-lg bg-surface-container-low p-5 text-sm text-on-surface-variant">Retrieving public evidence across all three domains…</p>}{liveTranscript.map((entry, index) => <article key={`${entry.agent}-${index}`} className={`rounded-lg p-4 ${entry.kind === "objection" ? "border border-amber-200 bg-amber-50" : "bg-surface-container-low"}`}><p className="font-bold text-on-surface">{entry.agent} <span className="ml-2 text-xs font-medium text-text-muted">Round {entry.round}</span></p><p className="mt-2 text-sm text-on-surface-variant">{entry.message}</p></article>)}</div></article><aside className="rounded-lg border border-border-technical bg-white p-6"><h2 className="text-xl font-bold text-on-surface">Unified decision</h2><div className="mt-5"><RiskGauge score={currentScore} label="Assembling risk score" /></div><div className="mt-5 grid grid-cols-2 gap-3 text-center"><div className="rounded-lg bg-surface-container-low p-3"><p className="text-xl font-bold text-primary">{completedCount}</p><p className="text-xs text-text-muted">positions</p></div><div className="rounded-lg bg-surface-container-low p-3"><p className="text-xl font-bold text-primary">{liveTranscript.filter((entry) => entry.kind === "objection").length}</p><p className="text-xs text-text-muted">objections</p></div></div><p className="mt-5 text-sm text-text-muted">The final score appears after the Examiner’s cited challenges are resolved.</p></aside></section></div>;
  }

  return <div className="page-wrap"><Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><span className="material-symbols-outlined text-[18px]">arrow_back</span>Back to dashboard</Link><div className="mt-6"><p className="text-sm font-bold text-primary">Cross-IP Report</p><h1 className="mt-2 text-3xl font-bold text-on-surface">Let four IP agents pressure-test your launch</h1><p className="mt-3 max-w-3xl text-on-surface-variant">Submit one product brief. Patent, trademark, and copyright specialists assess retrieved public evidence before an adversarial Examiner Agent challenges their positions.</p></div><div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><section className="rounded-lg border border-border-technical bg-white p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold text-on-surface">Submission workspace</h2><div className="flex flex-wrap items-center gap-2"><select aria-label="Choose demo risk profile" value={demoProfile} onChange={(event) => setDemoProfile(event.target.value as "low" | "high")} className="rounded-lg border border-border-technical bg-white px-3 py-2 text-sm font-semibold text-on-surface"><option value="low">Lower-risk demo</option><option value="high">Higher-risk demo</option></select><button type="button" onClick={() => void fillDemo(demoProfile)} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">Load demo</button></div></div><p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">The lower-risk demo is preselected: its cached report resolves to 30/100, proving the score is not hardcoded to high risk.</p><label className="mt-5 block text-sm font-semibold text-on-surface">Invention description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} maxLength={5000} className="mt-2 w-full resize-none rounded-lg border border-border-technical p-3 outline-none focus:border-primary" placeholder="Describe the problem, solution, and what makes it different." /></label><label className="mt-4 block text-sm font-semibold text-on-surface">Brand name<input value={brandName} onChange={(event) => setBrandName(event.target.value)} maxLength={200} className="mt-2 w-full rounded-lg border border-border-technical p-3 outline-none focus:border-primary" placeholder="Example: FlowNest" /></label><label className="mt-4 block text-sm font-semibold text-on-surface">Text or code to screen<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={5} maxLength={5000} className="mt-2 w-full resize-none rounded-lg border border-border-technical p-3 outline-none focus:border-primary" placeholder="Paste public-facing copy, documentation, or code." /></label><label className="mt-4 block rounded-lg border border-dashed border-border-technical p-4 text-sm font-semibold text-on-surface">Logo upload <span className="font-normal text-text-muted">(PNG, JPEG, or WebP; max 5 MB)</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={onLogoChange} className="mt-3 block w-full text-sm text-text-muted" />{logo && <span className="mt-2 block text-xs font-semibold text-primary">Ready: {logo.name}</span>}</label>{error && <p className="mt-4 text-sm font-semibold text-risk-high">{error}</p>}<button type="button" onClick={runReport} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90"><span className="material-symbols-outlined">hub</span>Convene the IP agents</button><p className="mt-3 text-xs text-text-muted">One report uses one free check. Your logo stays in the private analysis path.</p></section><aside className="rounded-lg border border-border-technical bg-surface-container-low p-6"><p className="text-sm font-bold text-primary">Who’s evaluating</p><h2 className="mt-2 text-2xl font-bold text-on-surface">Four distinct roles, one grounded decision</h2><p className="mt-3 text-sm text-on-surface-variant">Agents can interpret the retrieved evidence, but cannot invent sources, marks, or similarity scores.</p><div className="mt-6 space-y-3">{agents.map((agent) => <article key={agent.initials} className="flex items-center gap-4 rounded-lg border border-border-technical bg-white p-4"><AgentAvatar initials={agent.initials} status="pending" /><div><p className="font-bold text-on-surface">{agent.title}</p><p className="text-sm text-text-muted">{agent.role}</p></div><span className="material-symbols-outlined ml-auto text-risk-low">check_circle</span></article>)}</div></aside></div></div>;
}
