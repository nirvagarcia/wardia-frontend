/**
 * Layout for authenticated main app routes.
 * Includes the bottom navigation and proper spacing for mobile viewport.
 */

import React from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<MainLayoutProps>): React.JSX.Element {
  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-zinc-950">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
