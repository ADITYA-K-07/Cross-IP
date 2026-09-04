export const freeTools = [
  {
    title: "Cross-IP Report",
    shortTitle: "Cross-IP Report",
    description: "Let specialist agents debate patent, trademark, and copyright risks.",
    href: "/cross-ip-report",
    icon: "hub",
    action: "Run report",
  },
  {
    title: "Patent Novelty Checker",
    shortTitle: "Patent Novelty",
    description: "Check if your invention looks similar to existing patents.",
    href: "/novelty",
    icon: "search_insights",
    action: "Check novelty",
  },
  {
    title: "Patent Drafter",
    shortTitle: "Patent Drafter",
    description: "Turn an invention note into simple patent claim drafts.",
    href: "/draft",
    icon: "edit_document",
    action: "Generate claims",
  },
  {
    title: "Trademark Scanner",
    shortTitle: "Trademark Scanner",
    description: "Find exact, similar, and similar-sounding brand names.",
    href: "/trademark",
    icon: "verified",
    action: "Scan trademark",
  },
  {
    title: "Copyright Monitor",
    shortTitle: "Copyright Monitor",
    description: "Paste text or code and look for matching public sources.",
    href: "/copyright",
    icon: "copyright",
    action: "Check copies",
  },
];

export const lockedTools = [
  {
    title: "Competitor Watch",
    description: "Weekly alerts when competitors file new patents.",
    href: "/competitor-watch",
    icon: "visibility",
    plan: "Startup",
  },
  {
    title: "Freedom to Operate",
    description: "A pre-launch check for patents that may block your product.",
    href: "/fto",
    icon: "gavel",
    plan: "Startup",
  },
  {
    title: "Trade Secret Monitor",
    description: "Scan public sites for leaked internal content.",
    href: "/trade-secret",
    icon: "lock",
    plan: "Enterprise",
  },
  {
    title: "Weekly IP Digest",
    description: "A weekly summary of new patents and useful IP updates.",
    href: "/digest",
    icon: "summarize",
    plan: "Startup",
  },
];

export const planCards = [
  {
    name: "Free",
    price: "INR 0 / month",
    badge: "Working now",
    cta: "Get started free",
    href: "/dashboard",
    features: [
      "5 IP checks per month",
      "Patent novelty checker",
      "Patent drafter",
      "Trademark scanner",
      "Copyright monitor",
      "Community support",
    ],
  },
  {
    name: "Startup",
    price: "INR 3,000 / month",
    badge: "Coming soon",
    cta: "Join waitlist",
    href: "/plans/startup",
    features: [
      "Unlimited IP checks",
      "Competitor watch for 5 competitors",
      "Freedom to operate checker",
      "Deadline and renewal alerts",
      "Weekly IP digest email",
      "24/7 active IP monitoring",
      "Automated conflict alerts",
    ],
  },
  {
    name: "Enterprise",
    price: "INR 25,000 / month",
    badge: "Coming soon",
    cta: "Contact us",
    href: "mailto:teamamigos@example.com",
    features: [
      "Trade secret leak monitor",
      "IP landscape mapper",
      "Open source license checks",
      "IP valuation estimate",
      "API access and integrations",
      "Portfolio management suite",
      "Law firm client portal",
      "Unlimited competitor tracking",
    ],
  },
];

export const comparisonGroups = [
  {
    group: "Core tools",
    rows: [
      ["Monthly IP checks", "5", "Unlimited", "Unlimited"],
      ["Patent novelty checker", "Yes", "Yes", "Yes"],
      ["Patent drafter", "Yes", "Yes", "Yes"],
      ["Trademark scanner", "Yes", "Yes", "Yes"],
      ["Copyright monitor", "Yes", "Yes", "Yes"],
    ],
  },
  {
    group: "Monitoring and alerts",
    rows: [
      ["Competitor watch", "-", "5 competitors", "Unlimited"],
      ["Deadline alerts", "-", "Yes", "Yes"],
      ["Weekly IP digest", "-", "Yes", "Yes"],
      ["24/7 monitoring", "-", "Yes", "Yes"],
    ],
  },
  {
    group: "Advanced analysis",
    rows: [
      ["Freedom to operate check", "-", "Yes", "Yes"],
      ["Trade secret leak monitor", "-", "-", "Yes"],
      ["IP landscape map", "-", "-", "Yes"],
      ["Open source license risk", "-", "-", "Yes"],
      ["IP valuation estimate", "-", "-", "Yes"],
    ],
  },
  {
    group: "Access and integrations",
    rows: [
      ["API access", "-", "-", "Yes"],
      ["Portfolio management", "-", "-", "Yes"],
      ["Law firm portal", "-", "-", "Yes"],
      ["Support", "Community", "Priority", "Dedicated"],
    ],
  },
];

export const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan does not need payment details.",
  },
  {
    q: "When will paid plans be available?",
    a: "They are in active development. Join the waitlist to be notified first.",
  },
  {
    q: "Can I use this before filing a patent?",
    a: "Yes. CrossIP is built for early checks before you spend on filing.",
  },
  {
    q: "Is my invention data private?",
    a: "The planned backend keeps raw invention text in the private AI zone and only sends public search results to public-data analysis.",
  },
];

export const demoInputs = {
  novelty:
    "A low-cost wearable ring that measures hydration from skin signals and sends alerts to a mobile app before dehydration symptoms begin.",
  draft:
    "A smart irrigation device that checks soil moisture, weather forecasts, and crop type to control water valves automatically and reduce water waste.",
  trademark: "FlowNest",
  copyright:
    "Our platform creates a weekly report of new patent filings, competitor moves, renewal deadlines, and public prior art that may help product teams plan safer launches.",
  crossIpLowRisk: {
    description:
      "A lightweight paper garden planner that helps community volunteers assign watering days using manually entered weather notes and shared bed labels.",
    trademark: "TrellisNote",
    copyright:
      "TrellisNote helps community gardeners write weekly watering notes, label shared planting beds, and coordinate volunteer visits with a simple printable checklist.",
  },
  crossIpHighRisk: {
    description:
      "A low-cost wearable ring that measures hydration from skin signals and sends alerts to a mobile app before dehydration symptoms begin.",
    trademark: "FlowNest",
    copyright:
      "Our platform creates a weekly report of new patent filings, competitor moves, renewal deadlines, and public prior art that may help product teams plan safer launches.",
  },
};
