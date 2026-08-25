"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: "monitoring" },
  { name: "Agent Catalog", href: "/catalog", icon: "apps" },
  { name: "Novelty Scanner", href: "/novelty", icon: "radar" },
  { name: "Auto-Drafter", href: "/draft", icon: "edit_document" },
  { name: "Copyright Monitor", href: "/copyright", icon: "copyright" },
  { name: "Operational Tiers", href: "/pricing", icon: "payments" },
  { name: "Startup Hub", href: "/startup", icon: "rocket_launch" },
  { name: "Enterprise Portal", href: "/enterprise", icon: "domain" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col border-r border-border-technical">
      {/* Brand Header */}
      <div className="p-8 flex items-center gap-3 border-b border-border-technical/40">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined text-[20px]">radar</span>
        </div>
        <span className="font-headline-md text-on-surface tracking-tight">
          IPSentinel
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-4 pb-2 font-label-caps text-[10px] text-text-muted tracking-widest uppercase">
          System Modules
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all font-data-mono text-sm group ${
                isActive
                  ? "bg-primary text-on-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined mr-4 text-[20px] transition-colors ${
                  isActive ? "text-on-primary" : "text-text-muted group-hover:text-primary"
                }`}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile Box matching Stitch UI */}
      <div className="p-4 border-t border-border-technical">
        <div className="bg-surface-container-high p-4 rounded-xl flex items-center gap-3 border border-border-technical/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-label-caps text-xs">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-data-mono text-sm text-on-surface truncate font-semibold">
              SysAdmin.Alpha
            </p>
            <p className="font-data-mono text-xs text-text-muted">Pro Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
