"use client";

/**
 * Collapsible Sidebar Navigation Component
 * Desktop-optimized navigation sidebar with theme/language/currency controls.
 * Hidden on mobile devices where BottomNav is used instead.
 */

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { Home, Wallet, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { SidebarHeader } from "./sidebar-header";
import { SidebarControls } from "./sidebar-controls";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarProfile } from "./sidebar-profile";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = usePreferencesStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { href: "/dashboard", labelKey: "nav.home", icon: Home },
    { href: "/transactions", labelKey: "nav.transactions", icon: TrendingUp },
    { href: "/services", labelKey: "nav.services", icon: Receipt },
    { href: "/accounts", labelKey: "nav.accounts", icon: Wallet },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col h-screen sticky top-0 transition-all duration-300 border-r",
        "bg-gradient-to-b from-white via-white to-zinc-50/80 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/50",
        "border-zinc-200/80 dark:border-zinc-800/80",
        isCollapsed ? "md:w-[76px]" : "md:w-64 lg:w-72"
      )}
    >
      <SidebarHeader isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} t={t} />

      <SidebarControls
        isCollapsed={isCollapsed}
        theme={theme}
        language={language}
        mounted={mounted}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            label={t(item.labelKey)}
            icon={item.icon}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
</nav>

      <SidebarProfile
        isActive={pathname === "/profile"}
        isCollapsed={isCollapsed}
        username="Nirvana"
        userRole={t("nav.premiumUser")}
      />
    </aside>
  );
};
