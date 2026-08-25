export interface PatentCollision {
  id: string;
  patentNumber: string;
  matchPercentage: number;
  severity: "critical" | "low" | "nominal";
  title: string;
  assignee: string;
}

export interface TimelineAlert {
  id: string;
  label: string;
  timeframe: string;
  type: "critical" | "primary" | "neutral";
  details: string;
}

export interface SpecItem {
  category: string;
  title: string;
  value: string;
  detail: string;
}

export const PATENT_COLLISIONS: PatentCollision[] = [
  {
    id: "col-1",
    patentNumber: "US1029384 B2",
    matchPercentage: 94,
    severity: "critical",
    title: "Autonomous Network Anomaly Detection Architecture",
    assignee: "CyberDynamics IP LLC",
  },
  {
    id: "col-2",
    patentNumber: "EP349281 A1",
    matchPercentage: 12,
    severity: "nominal",
    title: "Distributed Packet Inspection Vector Array",
    assignee: "Aegis Systems SA",
  },
  {
    id: "col-3",
    patentNumber: "WO202100493 A1",
    matchPercentage: 5,
    severity: "nominal",
    title: "Cryptographic Payload Integrity Verification",
    assignee: "Quantum Shield Inc.",
  },
];

export const TIMELINE_ALERTS: TimelineAlert[] = [
  {
    id: "tl-1",
    label: "RESPOND TO OA",
    timeframe: "48H",
    type: "critical",
    details: "USPTO Office Action response deadline for Application #18/492,019",
  },
  {
    id: "tl-2",
    label: "MAINT. FEE",
    timeframe: "14D",
    type: "primary",
    details: "3.5 Year Maintenance Fee due for core network topology patent",
  },
  {
    id: "tl-3",
    label: "OPPOSITION",
    timeframe: "60D",
    type: "neutral",
    details: "EPO Opposition window opens for competitor European filing",
  },
];

export const SYSTEM_SPECS: SpecItem[] = [
  {
    category: "Surveillance Engine",
    title: "Global Office Coverage",
    value: "120 Jurisdictions",
    detail: "USPTO, EPO, WIPO, JPO, KIPO, NIPA & regional IP registries synchronized in real-time.",
  },
  {
    category: "Performance SLA",
    title: "Alert Propagation Latency",
    value: "< 12 ms",
    detail: "Sub-second indexing of newly published patent claims and status updates.",
  },
  {
    category: "Security Standard",
    title: "Payload Encryption",
    value: "AES-256-GCM",
    detail: "Zero-knowledge encryption for all proprietary product descriptions and claim maps.",
  },
  {
    category: "Semantic FTO",
    title: "Claim Matching Precision",
    value: "99.4% Accuracy",
    detail: "LLM-driven claim chart semantic alignment trained on 40M+ legal precedents.",
  },
];

export const SAMPLE_EXECUTIVE_REPORT = {
  date: "Monday, Aug 24, 2026",
  utcTime: "08:00 UTC",
  reportId: "DIGEST-2026-W34",
  summary:
    "Synthetic Intelligence Surveillance Scan complete. 1 critical claim collision detected in US jurisdiction. 3 competitor filings logged in cloud networking whitespace.",
  stats: {
    scannedFilings: 14209,
    flaggedCollisions: 1,
    activeWatchlists: 24,
    portfolioHealthScore: "96/100",
  },
  highlights: [
    {
      type: "ALERT",
      severity: "CRITICAL",
      text: "Competitor CyberDynamics filed continuation claim covering automated IP packet filtering.",
    },
    {
      type: "OPPORTUNITY",
      severity: "NOMINAL",
      text: "Whitespace detected in decentralized key management (USPTO Class 726/023).",
    },
    {
      type: "DEADLINE",
      severity: "WARNING",
      text: "48 hours remaining for USPTO OA response on core routing architecture.",
    },
  ],
};
