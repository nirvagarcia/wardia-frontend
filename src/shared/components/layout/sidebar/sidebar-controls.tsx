/**
 * Sidebar Controls Component
 * Theme and language toggle buttons.
 */

import React from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SidebarControlsProps {
  isCollapsed: boolean;
  theme: string | undefined;
  language: "es" | "en";
  mounted: boolean;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export function SidebarControls({
  isCollapsed,
  theme,
  language,
  mounted,
  onToggleTheme,
  onToggleLanguage,
}: SidebarControlsProps): React.JSX.Element {
  return (
    <div className="px-3 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className={cn("flex gap-1", isCollapsed ? "flex-col items-center" : "justify-center")}>
        <button
          onClick={onToggleTheme}
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
          onClick={onToggleLanguage}
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
      </div>
    </div>
  );
}
