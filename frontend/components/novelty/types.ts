export interface PatentMatch {
  patentId: string;
  matchPercentage: number;
  title: string;
  abstract: string;
  filingDate: string;
  ipcClass: string;
}

export interface NoveltyResult {
  collisionRisk: number;
  confidenceScore: string;
  nodesScanned: string;
  matches: PatentMatch[];
}
