import {
  CopyrightResult,
  DraftResult,
  NoveltyResult,
  TrademarkResult,
} from "./types";

export const demoNoveltyResult: NoveltyResult = {
  risk_score: 28,
  risk_label: "Low",
  analysis:
    "We found a few related hydration and wearable sensor patents, but none look like a direct match. Your idea may still need a deeper patent search before filing.",
  patents: [
    {
      patent_number: "US-2022-0184421",
      title: "Wearable hydration monitoring device",
      date: "2022-06-16",
      similarity_pct: 41,
      abstract_excerpt:
        "A wearable device estimates body hydration using skin impedance and activity signals.",
      link: "https://patents.google.com/",
    },
    {
      patent_number: "US-2019-0314020",
      title: "Skin sensor for wellness monitoring",
      date: "2019-10-17",
      similarity_pct: 34,
      abstract_excerpt:
        "A compact sensor package gathers biometric signals for wellness alerts on a mobile device.",
      link: "https://patents.google.com/",
    },
    {
      patent_number: "WO-2023-081214",
      title: "Mobile health alert system",
      date: "2023-05-04",
      similarity_pct: 23,
      abstract_excerpt:
        "A health platform sends early warnings based on sensor readings and user history.",
      link: "https://patents.google.com/",
    },
  ],
};

export const demoDraftResult: DraftResult = {
  independent_claims: [
    "A smart irrigation system comprising a soil moisture sensor, a weather data receiver, a crop profile store, and a controller configured to open or close a water valve based on the soil moisture, weather forecast, and crop profile.",
    "A method for reducing water use in crop irrigation, comprising receiving soil data, receiving forecast data, selecting a water need level for a crop, and automatically controlling irrigation according to the selected water need level.",
  ],
  dependent_claims: [
    "The system of claim 1, wherein the controller delays irrigation when rain is predicted within a set time period.",
    "The system of claim 1, wherein the crop profile store includes growth stage data for each crop.",
    "The method of claim 2, further comprising sending a mobile alert when manual review is recommended.",
  ],
};

export const demoTrademarkResult: TrademarkResult = {
  risk_level: "Medium",
  explanation:
    "We found names that sound or look somewhat similar. You may want to adjust the brand name before launch.",
  matches: [
    {
      name: "FlowNest",
      match_type: "exact",
      similarity_pct: 92,
      category: "Software",
      registry: "Public web result",
      source_url: "https://www.google.com/search?q=FlowNest+trademark",
    },
    {
      name: "FloNest",
      match_type: "phonetic",
      similarity_pct: 78,
      category: "IoT products",
      registry: "Public web result",
      source_url: "https://www.google.com/search?q=FloNest+brand",
    },
    {
      name: "FlowNext",
      match_type: "similar spelling",
      similarity_pct: 69,
      category: "Business tools",
      registry: "Public web result",
      source_url: "https://www.google.com/search?q=FlowNext+trademark",
    },
  ],
};

export const demoCopyrightResult: CopyrightResult = {
  overall_risk: "Low",
  risk_label: "Low",
  matches: [
    {
      title: "Patent monitoring product page",
      url: "https://example.com/ip-monitoring",
      excerpt:
        "Weekly patent alerts and competitor updates for product teams working in fast-moving technical fields.",
      similarity_pct: 31,
    },
    {
      title: "Prior art digest service",
      url: "https://example.com/prior-art-digest",
      excerpt:
        "A periodic report that summarizes new public filings, expiring patents, and useful market signals.",
      similarity_pct: 24,
    },
  ],
};
