"use client";

/**
 * Bottom Navigation Component
 * Fixed mobile-style navigation for the main app shell.
 * Now with i18n support and proper light/dark mode styling.
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { Home, Wallet, Receipt, TrendingUp, User } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const navItems: NavItem[] = [
    { href: "/dashboard", labelKey: "nav.home", icon: Home },
    { href: "/transactions", labelKey: "nav.transactions", icon: TrendingUp },
    { href: "/services", labelKey: "nav.services", icon: Receipt },
    { href: "/accounts", labelKey: "nav.accounts", icon: Wallet },
    { href: "/profile", labelKey: "nav.profile", icon: User },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/assets/wardia-icon.png" 
              alt="Wardia" 
              width={28}
              height={28}
              className="rounded-lg shadow-sm"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Wardia</span>
          </div>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto px-2 py-1.5">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-cyan-500 dark:text-cyan-400"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isActive && "bg-cyan-500/10"
                  )}>
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        isActive ? "scale-110" : "scale-100"
                      )}
                    />
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    isActive ? "font-semibold" : "font-medium"
                  )}>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
    </>
  );
};
