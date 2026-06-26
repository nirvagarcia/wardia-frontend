/**
 * AccountsHeader Component
 * Header section with title, subtitle, and add button
 */

import React from "react";
import { Wallet, Plus } from "lucide-react";

interface AccountsHeaderProps {
  title: string;
  subtitle: string;
  onAddClick: () => void;
}

export function AccountsHeader({ title, subtitle, onAddClick }: AccountsHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
          <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
            <Wallet className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
          </div>
          {title}
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onAddClick}
        className="relative group bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-teal-700 p-3 md:p-4 rounded-2xl transition-all text-white hover:scale-105 active:scale-95 ring-1 ring-white/20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus className="w-5 h-5 md:w-6 md:h-6 relative z-10 drop-shadow-lg" />
      </button>
    </div>
  );
}
