export interface AgentModuleInfo {
  id: string;
  name: string;
  version: string;
  icon: string;
  route: string;
  description: string;
  highlights: string[];
}

export const AGENT_MODULES_DOCS: AgentModuleInfo[] = [
  {
    id: "mod-novelty",
    name: "Novelty Engine",
    version: "v2.4.1",
    icon: "model_training",
    route: "/novelty",
    description:
      "Deep semantic analysis of your invention description against 120M+ global patent documents. Identifies structural and functional overlaps beyond keyword matching.",
    highlights: [
      "Semantic Vector Search across USPTO, EPO, WIPO",
      "Claim Construction Analysis and prior art scoring",
      "Heatmapped similarity matrix rendering",
    ],
  },
  {
    id: "mod-drafter",
    name: "Auto-Drafter",
    version: "v1.8.0",
    icon: "edit_document",
    route: "/draft",
    description:
      "Generates USPTO-compliant patent specifications and claims based on minimal input data.",
    highlights: [
      "Automated independent & dependent claim generation",
      "Detailed description and embodiment scaffolding",
      "Antecedent basis validation check",
    ],
  },
  {
    id: "mod-scanner",
    name: "Mark Scanner",
    version: "v3.1.2",
    icon: "verified",
    route: "/novelty",
    description:
      "Phonetic and visual similarity search across active trademark databases to prevent infringement.",
    highlights: [
      "Phonetic soundex & Levenshtein distance matching",
      "Logo Vision AI vector embeddings",
      "Nice classification conflict detection",
    ],
  },
  {
    id: "mod-provenance",
    name: "Code Provenance",
    version: "v2.0.4",
    icon: "copyright",
    route: "/copyright",
    description:
      "Scans source code repositories against known open-source licenses and copyrighted snippets.",
    highlights: [
      "Copyleft & viral license contamination audit (GPL/AGPL)",
      "Code snippet fingerprint matching across 50M repos",
      "Automated SBOM export and risk severity charting",
    ],
  },
];
