/**
 * Transaction Card Component
 * Displays individual transaction with category icon, merchant, and amount
 */

import React from "react";
import { ITransaction } from "@/shared/types/finance";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { getLocale, formatCurrency } from "@/shared/utils/currency";
import { formatDate } from "@/shared/utils/date";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  getCategoryIcon,
  getCategoryLabel,
} from "../utils/helpers";

interface TransactionCardProps {
  transaction: ITransaction;
  onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = getLocale(language);

  const isIncome = transaction.type === "income";
  const isPending = transaction.status === "pending";

  const categoryIcon = getCategoryIcon(transaction.category);
  const categoryLabel = getCategoryLabel(t, transaction.category);
  const formattedDate = formatDate(transaction.date, locale);
  const formattedAmount = formatCurrency(transaction.amount, language);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-md transition-all",
        "flex items-center gap-4 text-left",
        isPending && "opacity-70"
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
            isIncome
              ? "bg-emerald-100 dark:bg-emerald-950/30"
              : "bg-red-100 dark:bg-red-950/30"
          )}
        >
          {categoryIcon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
            {transaction.description}
          </h3>
          {isPending && (
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{categoryLabel}</span>
          {transaction.merchant && (
            <>
              <span>•</span>
              <span className="truncate">{transaction.merchant}</span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {formattedDate}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        <div
          className={cn(
            "font-bold text-lg flex items-center gap-1",
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {isIncome ? (
            <ArrowUpCircle className="w-5 h-5" />
          ) : (
            <ArrowDownCircle className="w-5 h-5" />
          )}
          <span>
            {isIncome ? "+" : "-"} {formattedAmount}
          </span>
        </div>
        {isPending && (
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {t("transactions.pending")}
          </span>
        )}
      </div>
    </button>
  );
}
