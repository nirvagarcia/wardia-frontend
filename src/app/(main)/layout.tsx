/**
 * Layout for authenticated main app routes.
 * Responsive layout with:
 * - Sidebar navigation for desktop (md+)
 * - Bottom navigation for mobile (< md)
 * - Adaptive content width based on screen size
 */

import React from "react";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { ErrorBoundary } from "@/shared/components/error-boundary";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>): React.JSX.Element {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
        <Sidebar />
        
        <div className="flex-1 min-w-0">
          <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-8 pb-24 md:pb-10">
            {children}
          </main>
        </div>
        
        <BottomNav />
      </div>
    </ErrorBoundary>
  );
}
