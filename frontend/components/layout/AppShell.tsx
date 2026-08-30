import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background relative">
      <AppSidebar />
      <AppHeader />
      <main className="pl-72 pt-16 min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
}
