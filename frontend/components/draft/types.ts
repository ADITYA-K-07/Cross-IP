export interface SubClause {
  title?: string;
  text: string;
  nestedItems?: string[];
}

export interface PatentClaim {
  number: number;
  type: "independent" | "dependent";
  text: string;
  subClauses?: SubClause[];
  parentClaimNumber?: number;
}

export interface DraftResult {
  confidenceScore: number;
  claims: PatentClaim[];
}
