export interface PatentMatch {
  title: string;
  patent_number: string;
  date: string;
  similarity_pct: number;
  abstract_excerpt: string;
  link: string;
}

export interface NoveltyResult {
  patents: PatentMatch[];
  risk_score: number;
  risk_label: string;
  analysis: string;
}

export interface DraftResult {
  independent_claims: string[];
  dependent_claims: string[];
}

export interface TrademarkMatch {
  name: string;
  match_type: string;
  similarity_pct: number;
  category?: string;
  registry?: string;
  source_url: string;
}

export interface TrademarkResult {
  matches: TrademarkMatch[];
  risk_level: string;
  explanation: string;
}

export interface CopyrightMatch {
  url: string;
  title: string;
  excerpt: string;
  similarity_pct: number;
}

export interface CopyrightResult {
  matches: CopyrightMatch[];
  overall_risk: string;
  risk_label: string;
}

export type CrossIpDomain = "patent" | "trademark" | "copyright";
export type CrossIpEventName = "position" | "examiner_objection" | "revision" | "complete" | "error";

export interface CrossIpEvidence {
  source_id: string;
  title: string;
  excerpt: string;
  relevance: number;
  url?: string;
}

export interface CrossIpDomainResult {
  domain: CrossIpDomain;
  agent_name: string;
  initial_score: number;
  score: number;
  confidence: number;
  reasoning: string;
  evidence_ids: string[];
  revision_reason?: string;
  visual_evidence_available?: boolean;
}

export interface DebateEntry {
  round: number;
  kind: "position" | "objection" | "rebuttal";
  agent: string;
  domain?: CrossIpDomain;
  message: string;
  evidence_ids: string[];
}

export interface ExaminerChallenge {
  domain: CrossIpDomain;
  message: string;
  evidence_ids: string[];
  direction: "increase" | "decrease";
}

export interface InnovationGapFeature {
  feature: string;
  status: "overlap" | "gap";
  evidence_ids: string[];
}

export interface CrossIpReport {
  unified_score: number;
  risk_label: "Low" | "Moderate" | "High" | "Critical";
  executive_summary: string;
  domains: CrossIpDomainResult[];
  transcript: DebateEntry[];
  evidence: CrossIpEvidence[];
  opinions_and_tips: string[];
  innovation_gap_map: InnovationGapFeature[];
  is_demo_fallback: boolean;
}
