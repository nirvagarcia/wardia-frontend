/**
 * Sidebar Nav Item Component
 * Individual navigation link with active state.
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({ href, label, icon: Icon, isActive, isCollapsed }: SidebarNavItemProps): React.JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
        isActive ? "bg-cyan-500/[0.08] dark:bg-cyan-500/[0.12]" : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50",
        isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
      )}
      title={isCollapsed ? label : undefined}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-cyan-500" />}

      <Icon
        className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isCollapsed ? "w-5 h-5" : "w-5 h-5",
          isActive
            ? "text-cyan-600 dark:text-cyan-400"
            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
        )}
      />

      {!isCollapsed && (
        <>
          <span
            className={cn(
              "text-sm font-medium flex-1 transition-colors",
              isActive
                ? "text-cyan-700 dark:text-cyan-300"
                : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
            )}
          >
            {label}
          </span>
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
        </>
      )}
    </Link>
  );
}
