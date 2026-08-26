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
