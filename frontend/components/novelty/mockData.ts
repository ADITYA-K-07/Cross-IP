import { NoveltyResult } from "./types";

export const MOCK_NOVELTY_RESULT: NoveltyResult = {
  collisionRisk: 82,
  confidenceScore: "94.2%",
  nodesScanned: "14.2M",
  matches: [
    {
      patentId: "US-20210345-A1",
      matchPercentage: 89,
      title: "Distributed Ledger State Synchronization",
      abstract:
        "Distributed ledger system for asynchronous state synchronization across low-latency node clusters.",
      filingDate: "2021-04-12",
      ipcClass: "G06F 15/16",
    },
    {
      patentId: "EP-302144-B1",
      matchPercentage: 76,
      title: "Cryptographic Consensus Anomaly Resolution",
      abstract:
        "Method and apparatus for resolving cryptographic consensus anomalies in peer-to-peer networks.",
      filingDate: "2019-11-05",
      ipcClass: "H04L 9/32",
    },
    {
      patentId: "WO-2023199-A2",
      matchPercentage: 42,
      title: "Quantum-Resistant Routing Protocol",
      abstract:
        "Optimized routing protocol for secure data transmission utilizing quantum-resistant algorithms.",
      filingDate: "2023-01-20",
      ipcClass: "H04W 12/06",
    },
  ],
};

export const SAMPLE_INVENTION_TEXT =
  "A distributed ledger system for asynchronous state synchronization across low-latency node clusters. The architecture utilizes dynamic consensus thresholds, multi-party cryptographic verification, and quantum-resistant key exchange algorithms to prevent anomalies in peer-to-peer transaction flows.";
