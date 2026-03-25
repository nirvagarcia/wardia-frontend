/**
 * Sidebar Profile Component
 * User profile link in sidebar footer.
 */

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProfileProps {
  isActive: boolean;
  isCollapsed: boolean;
  username: string;
  userRole: string;
}

export function SidebarProfile({ isActive, isCollapsed, username, userRole }: SidebarProfileProps): React.JSX.Element {
  return (
    <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <Link
        href="/profile"
        className={cn(
          "flex items-center gap-3 rounded-xl transition-all duration-200 group",
          isActive ? "bg-cyan-500/[0.08] dark:bg-cyan-500/[0.12]" : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50",
          isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
        )}
        title={isCollapsed ? `${username} - ${userRole}` : undefined}
      >
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0",
            "shadow-md shadow-cyan-500/20 ring-2 ring-white/80 dark:ring-zinc-900/80",
            isCollapsed ? "w-10 h-10" : "w-10 h-10"
          )}
        >
          <User className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{username}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">{userRole}</p>
          </div>
        )}
      </Link>
    </div>
  );
}
