/**
 * AccountsTabs Component
 * Segmented tabs for switching between debit, credit, and credentials
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

type TabType = "debit" | "credit" | "credentials";

interface AccountsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  debitLabel: string;
  creditLabel: string;
  credentialsLabel: string;
}

export function AccountsTabs({
  activeTab,
  onTabChange,
  debitLabel,
  creditLabel,
  credentialsLabel,
}: AccountsTabsProps): React.JSX.Element {
  const tabButtonClass = (isActive: boolean) =>
    cn(
      "flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300",
      isActive
        ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
        : "bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
    );

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onTabChange("debit")}
        className={tabButtonClass(activeTab === "debit")}
      >
        {debitLabel}
      </button>
      <button
        onClick={() => onTabChange("credit")}
        className={tabButtonClass(activeTab === "credit")}
      >
        {creditLabel}
      </button>
      <button
        onClick={() => onTabChange("credentials")}
        className={tabButtonClass(activeTab === "credentials")}
      >
        {credentialsLabel}
      </button>
    </div>
  );
}
