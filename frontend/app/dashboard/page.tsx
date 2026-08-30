import { SetupProgressCard } from "@/components/dashboard/SetupProgressCard";
import {
  ProtocolCard,
  ProtocolCardProps,
} from "@/components/dashboard/ProtocolCard";
import {
  LockedModuleCard,
  LockedModuleCardProps,
} from "@/components/dashboard/LockedModuleCard";

const activeProtocols: ProtocolCardProps[] = [
  {
    code: "PT-01",
    title: "IP Scanner",
    description:
      "Real-time asset discovery and vulnerability mapping across assigned subnet ranges.",
    icon: "radar",
    ctaText: "Initialize",
    href: "/novelty",
  },
  {
    code: "PT-02",
    title: "Compliance",
    description:
      "Automated checks against baseline security frameworks and regulatory standards.",
    icon: "policy",
    ctaText: "Run Audit",
    href: "/catalog",
  },
  {
    code: "PT-03",
    title: "Topology",
    description:
      "Visual mapping of internal network structures and potential lateral movement paths.",
    icon: "network_node",
    ctaText: "View Map",
    href: "/startup",
  },
  {
    code: "PT-04",
    title: "Log Analysis",
    description:
      "Deep packet inspection and heuristic analysis of historical traffic patterns.",
    icon: "data_exploration",
    ctaText: "Query Logs",
    href: "/enterprise",
  },
];

const lockedModules: LockedModuleCardProps[] = [
  {
    code: "EX-01",
    title: "Competitor Watch",
    description:
      "Advanced perimeter monitoring of defined competitor IP ranges.",
    icon: "visibility",
  },
  {
    code: "EX-02",
    title: "FTO Analysis",
    description:
      "Freedom to Operate modeling based on proprietary threat intelligence.",
    icon: "gavel",
  },
  {
    code: "EX-03",
    title: "Trade Secret",
    description:
      "Data exfiltration monitoring and internal leak detection algorithms.",
    icon: "key",
  },
  {
    code: "EX-04",
    title: "Exec Digest",
    description:
      "Automated, C-level reporting compiling cross-module threat vectors.",
    icon: "summarize",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full relative min-h-full pb-20">
      <div className="relative z-10 p-gutter w-full max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-technical pb-6 mt-8">
          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-text-muted tracking-widest uppercase">
              System Initialization
            </span>
            <h1 className="font-display-lg text-text-high-contrast">
              Welcome, SysAdmin.Alpha
            </h1>
          </div>
          <SetupProgressCard
            title="Setup Protocol"
            checksRemaining={5}
            progressPercent={35}
          />
        </section>

        {/* Active Protocols Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-risk-nominal rounded-full" />
            <h2 className="font-headline-md text-on-surface">
              Active Protocols
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-panel-gap bg-border-technical border border-border-technical">
            {activeProtocols.map((protocol) => (
              <ProtocolCard key={protocol.code} {...protocol} />
            ))}
          </div>
        </section>

        {/* Encrypted Modules Section */}
        <section className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-text-muted rounded-full" />
            <h2 className="font-headline-md text-on-surface">
              Encrypted Modules
            </h2>
            <span className="ml-auto font-label-caps text-on-primary border border-primary px-2 py-1 bg-primary">
              Requires Pro Clearance
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-panel-gap bg-border-technical border border-border-technical">
            {lockedModules.map((module) => (
              <LockedModuleCard key={module.code} {...module} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
