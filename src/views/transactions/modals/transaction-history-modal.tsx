"use client";

import React from "react";
import { X, TrendingUp, TrendingDown, Minus, History } from "lucide-react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { formatCurrency } from "@/shared/utils/currency";
import { useTransactionHistoryQuery } from "@/shared/hooks/use-transactions-query";
import { cn } from "@/shared/utils/cn";

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionHistoryModal({
  isOpen,
  onClose,
}: TransactionHistoryModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const { data: history = [], isLoading } = useTransactionHistoryQuery();

  if (!isOpen) return null;

  const formatAmount = (value: number) => formatCurrency(value, currency, language);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-xl">
              <History className="w-5 h-5 text-cyan-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {t("transactions.historyTitle")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && history.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-12">
              {t("transactions.historyEmpty")}
            </p>
          )}

          {!isLoading &&
            history.map((entry) => {
              const isPositive = entry.balance >= 0;
              const [y, m] = entry.label.split("-").map(Number);
              const monthNames = language === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;
              const monthLabel = `${monthNames[(m ?? 1) - 1]} ${y}`;

              return (
                <div
                  key={entry.label}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {monthLabel}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {entry.transactionCount} {t("transactions.transactions")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-emerald-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{t("transactions.income")}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatAmount(entry.totalIncome)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{t("transactions.expenses")}</span>
                      </div>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatAmount(entry.totalExpenses)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Minus className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{t("transactions.balance")}</span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isPositive
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {formatAmount(entry.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
