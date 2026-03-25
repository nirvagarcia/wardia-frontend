/**
 * Sidebar Header Component
 * Logo and collapse button for sidebar navigation.
 */

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  t: (key: string) => string;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse, t }: SidebarHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between",
        isCollapsed ? "p-3 flex-col gap-3" : "p-5"
      )}
    >
      <div className={cn("flex items-center gap-3", isCollapsed ? "flex-col" : "flex-1 min-w-0")}>
        <div
          className={cn(
            "rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10",
            isCollapsed ? "w-11 h-11" : "w-10 h-10"
          )}
        >
          <Image src="/wardia-icon.png" alt="WARDIA" width={44} height={44} className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white truncate">WARDIA</h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">{t("nav.appTagline")}</p>
          </div>
        )}
      </div>

      <button
        onClick={onToggleCollapse}
        className={cn(
          "p-1.5 rounded-lg transition-all duration-200 flex-shrink-0",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
          "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
