export interface MatchedCodeLine {
  lineText: string;
  isMatched: boolean;
}

export interface DetectedVector {
  id: string;
  filename: string;
  repository: string;
  matchPercentage: number;
  lines: MatchedCodeLine[];
}

export interface CopyrightResult {
  riskIndex: number;
  fragmentsFound: number;
  repositoryCount: number;
  vectors: DetectedVector[];
}
