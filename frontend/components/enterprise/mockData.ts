export interface ScanTarget {
  id: string;
  name: string;
  status: "SECURE" | "ANOMALY";
}

export interface LandscapeSector {
  label: string;
  densityChange: string;
  bars: { heightPercent: number; isTarget?: boolean }[];
}

export interface DependencyAudit {
  totalAnalyzed: number;
  viralLicenses: number;
  scanTimeMs: number;
}

export interface ValuationData {
  estimateUsd: string;
  confidencePercent: number;
  marketCoverage: string;
  forwardCitations: number;
}

export const SCAN_TARGETS: ScanTarget[] = [
  { id: "target-1", name: "Core Repository A", status: "SECURE" },
  { id: "target-2", name: "External Contractor Sync", status: "ANOMALY" },
];

export const LANDSCAPE_DATA: LandscapeSector = {
  label: "SECTOR ALPHA",
  densityChange: "+14.2% DEN",
  bars: [
    { heightPercent: 30 },
    { heightPercent: 50 },
    { heightPercent: 90, isTarget: true },
    { heightPercent: 20 },
    { heightPercent: 60 },
    { heightPercent: 40 },
  ],
};

export const DEPENDENCY_AUDIT: DependencyAudit = {
  totalAnalyzed: 4192,
  viralLicenses: 0,
  scanTimeMs: 14,
};

export const VALUATION_DATA: ValuationData = {
  estimateUsd: "$42.8M",
  confidencePercent: 75,
  marketCoverage: "94.8%",
  forwardCitations: 342,
};
