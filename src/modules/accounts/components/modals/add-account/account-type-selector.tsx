/**
 * Account Type Selector Component
 * Toggle buttons for selecting account type (debit/credit).
 */

import React from "react";
import { CreditCard, Wallet } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type AccountType = "debit" | "credit";

interface AccountTypeSelectorProps {
  selectedType: AccountType;
  onTypeChange: (type: AccountType) => void;
  disabled?: boolean;
  debitLabel: string;
  creditLabel: string;
}

export function AccountTypeSelector({
  selectedType,
  onTypeChange,
  disabled = false,
  debitLabel,
  creditLabel,
}: AccountTypeSelectorProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => !disabled && onTypeChange("debit")}
        disabled={disabled}
        className={cn(
          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
          selectedType === "debit"
            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Wallet className={cn("w-8 h-8", selectedType === "debit" ? "text-cyan-500" : "text-zinc-400")} />
        <span
          className={cn(
            "font-medium",
            selectedType === "debit" ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {debitLabel}
        </span>
      </button>

      <button
        type="button"
        onClick={() => !disabled && onTypeChange("credit")}
        disabled={disabled}
        className={cn(
          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
          selectedType === "credit"
            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CreditCard className={cn("w-8 h-8", selectedType === "credit" ? "text-cyan-500" : "text-zinc-400")} />
        <span
          className={cn(
            "font-medium",
            selectedType === "credit" ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {creditLabel}
        </span>
      </button>
    </div>
  );
}
