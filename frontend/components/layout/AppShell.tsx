"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToastProvider } from "@/components/ip/ToastProvider";

interface AppShellProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Cross-IP Report", href: "/cross-ip-report" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background font-body-md text-on-background">
        <header className="sticky top-0 z-50 border-b border-border-technical bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 text-on-surface">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </span>
              <span className="text-lg font-bold">CrossIP</span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const active = link.href !== "/#features" && pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/dashboard"
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 md:inline-flex"
            >
              Try free
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-technical bg-white text-on-surface md:hidden"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isOpen ? "close" : "menu"}
              </span>
            </button>
          </div>

          {isOpen && (
            <div className="border-t border-border-technical bg-white px-4 py-3 md:hidden">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Try free
                </Link>
              </div>
            </div>
          )}
        </header>

        <main className="min-h-screen bg-background">{children}</main>

        <footer className="border-t border-border-technical bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-text-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>Team Amigos, Vishwakarma Institute of Technology, Ideathon 2026</p>
            <div className="flex gap-4">
              <Link href="/pricing" className="hover:text-primary">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
