/**
 * Layout for authenticated main app routes.
 * Responsive layout with:
 * - Sidebar navigation for desktop (md+)
 * - Bottom navigation for mobile (< md)
 * - Adaptive content width based on screen size
 */

import React from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>): React.JSX.Element {
  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <Sidebar />
      
      <div className="flex-1 min-w-0">
        <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-[47px] md:pt-[55px] pb-24 md:pb-10">
          {children}
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
