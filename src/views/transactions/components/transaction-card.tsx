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
import { Clock, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  getCategoryIcon,
  getCategoryLabel,
} from "../utils/helpers";

interface TransactionCardProps {
  transaction: ITransaction;
  onEdit?: (transaction: ITransaction) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  onClick,
}: TransactionCardProps): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = getLocale(language);

  const isIncome = transaction.type === "income";
  const isPending = transaction.status === "pending";

  const categoryIcon = getCategoryIcon(transaction.category);
  const categoryLabel = getCategoryLabel(t, transaction.category);
  const formattedDate = formatDate(transaction.transactionDate, locale);
  const formattedAmount = formatCurrency(transaction.amount, language);

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 transition-all",
        isPending && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={onClick}
          className="flex items-start gap-3 flex-1 min-w-0 text-left"
        >
          <div className="relative w-9 h-9 rounded-lg flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center text-lg flex-shrink-0">
            {categoryIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
                {transaction.description}
              </h3>
              {isPending && <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-500">{formattedDate}</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full font-medium capitalize">
                {categoryLabel}
              </span>
              {transaction.source && (
                <span className="text-zinc-400 dark:text-zinc-600 truncate">{transaction.source}</span>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <p className={cn(
            "font-bold text-sm whitespace-nowrap mr-1",
            isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          )}>
            {isIncome ? "+" : "-"} {formattedAmount}
          </p>
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group/btn"
            >
              <Pencil className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover/btn:text-blue-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover/btn:text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
