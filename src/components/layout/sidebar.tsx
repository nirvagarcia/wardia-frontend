"use client";

/**
 * Collapsible Sidebar Navigation Component
 * Desktop-optimized navigation sidebar with theme/language/currency controls.
 * Hidden on mobile devices where BottomNav is used instead.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { 
  Home, 
  Wallet, 
  Receipt, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Globe,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency } = usePreferencesStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { href: "/dashboard", labelKey: "nav.home", icon: Home },
    { href: "/accounts", labelKey: "nav.accounts", icon: Wallet },
    { href: "/services", labelKey: "nav.services", icon: Receipt },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  const rotateCurrency = () => {
    const currencies: Array<"PEN" | "USD" | "EUR"> = ["PEN", "USD", "EUR"];
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
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
      <div className={cn(
        "border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between",
        isCollapsed ? "p-3 flex-col gap-3" : "p-5"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed ? "flex-col" : "flex-1 min-w-0"
        )}>
          <div className={cn(
            "rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10",
            isCollapsed ? "w-11 h-11" : "w-10 h-10"
          )}>
            <Image 
              src="/wardia-icon.png" 
              alt="WARDIA" 
              width={44} 
              height={44}
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white truncate">WARDIA</h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">
                {t("nav.appTagline")}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-200 flex-shrink-0",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
            "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="px-3 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className={cn(
          "flex gap-1",
          isCollapsed ? "flex-col items-center" : "justify-center"
        )}>
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-xl transition-all duration-200 group",
              "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50",
              "ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            )}
            title={mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Toggle theme"}
            suppressHydrationWarning
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className={cn(
              "p-2 rounded-xl transition-all duration-200 group flex items-center justify-center",
              "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50",
              "ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            )}
            title={language === "es" ? "English" : "Español"}
          >
            <Globe className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            {!isCollapsed && (
              <span className="ml-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                {language.toUpperCase()}
              </span>
            )}
          </button>

          <button
            onClick={rotateCurrency}
            className={cn(
              "p-2 rounded-xl transition-all duration-200 group flex items-center justify-center",
              "bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50",
              "ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            )}
            title={`Currency: ${currency}`}
          >
            <DollarSign className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
            {!isCollapsed && (
              <span className="ml-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                {currency}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-cyan-500/[0.08] dark:bg-cyan-500/[0.12]"
                  : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50",
                isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
              )}
              title={isCollapsed ? t(item.labelKey) : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-cyan-500" />
              )}
              
              <Icon className={cn(
                "flex-shrink-0 transition-colors duration-200",
                isCollapsed ? "w-5 h-5" : "w-5 h-5",
                isActive
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className={cn(
                    "text-sm font-medium flex-1 transition-colors",
                    isActive 
                      ? "text-cyan-700 dark:text-cyan-300" 
                      : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                  )}>
                    {t(item.labelKey)}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-xl transition-all duration-200 group",
            pathname === "/profile"
              ? "bg-cyan-500/[0.08] dark:bg-cyan-500/[0.12]"
              : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50",
            isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
          )}
          title={isCollapsed ? "Nirvana - Premium User" : undefined}
        >
          <div className={cn(
            "rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0",
            "shadow-md shadow-cyan-500/20 ring-2 ring-white/80 dark:ring-zinc-900/80",
            isCollapsed ? "w-10 h-10" : "w-10 h-10"
          )}>
            <User className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                Nirvana
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">
                {t("nav.premiumUser")}
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};
