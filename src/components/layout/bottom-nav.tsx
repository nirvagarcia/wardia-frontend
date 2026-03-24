"use client";

/**
 * Bottom Navigation Component
 * Fixed mobile-style navigation for the main app shell.
 * Now with i18n support and proper light/dark mode styling.
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { Home, Wallet, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { href: "/accounts", labelKey: "nav.accounts", icon: Wallet },
    { href: "/services", labelKey: "nav.services", icon: Receipt },
    { href: "/profile", labelKey: "nav.profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-zinc-200 dark:border-white/10">
      <div className="max-w-lg mx-auto px-4 py-2">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-transform duration-200",
                      isActive ? "scale-110" : "scale-100"
                    )}
                  />
                  <span className="text-xs font-medium">{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
