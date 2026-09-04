"use client";

import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { ToastProvider } from "@/components/ip/ToastProvider";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-background font-body-md text-on-background">
        <AppSidebar />
        <AppHeader />
        <main className="min-h-screen bg-background pl-72 pt-16">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}