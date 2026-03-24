"use client";

/**
 * Collapsible Sidebar Navigation Component
 * Desktop-optimized navigation sidebar with theme/language/currency controls.
 * Hidden on mobile devices where BottomNav is used instead.
 */

import React, { useState } from "react";
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
  
  const t = (key: string) => getTranslation(language, key);

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
        "hidden md:flex md:flex-col h-screen sticky top-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
        isCollapsed ? "md:w-20" : "md:w-64 lg:w-72"
      )}
    >
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <Image 
                src="/wardia-icon.png" 
                alt="WARDIA" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white truncate">WARDIA</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {t("nav.appTagline")}
              </p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="mx-auto">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <Image 
                src="/wardia-icon.png" 
                alt="WARDIA" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors ml-2 flex-shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className={cn("flex gap-2", isCollapsed ? "flex-col" : "justify-center")}>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center"
            title={language === "es" ? "English" : "Español"}
          >
            <Globe className="w-5 h-5 text-blue-500" />
            {!isCollapsed && (
              <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                {language.toUpperCase()}
              </span>
            )}
          </button>

          <button
            onClick={rotateCurrency}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center"
            title={`Currency: ${currency}`}
          >
            <DollarSign className="w-5 h-5 text-emerald-500" />
            {!isCollapsed && (
              <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                {currency}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">{navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? t(item.labelKey) : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-emerald-500")} />
              {!isCollapsed && (
                <>
                  <span className="text-base flex-1">{t(item.labelKey)}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            pathname === "/profile"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Nirvana - Premium User" : undefined}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                Nirvana
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {t("nav.premiumUser")}
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};
