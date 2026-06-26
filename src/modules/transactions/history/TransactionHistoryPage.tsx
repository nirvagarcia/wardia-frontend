"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, History, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

export function TransactionHistoryView(): React.JSX.Element {
  const router = useRouter();
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const { data: history = [], isLoading } = useTransactionHistoryQuery();

  const fmt = (value: number) => formatCurrency(value, currency, language);

  return (
    <div className="space-y-6 pb-6">
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5 tracking-tight">
            <div className="bg-zinc-500/10 p-1.5 rounded-xl ring-1 ring-zinc-500/10">
              <History className="w-5 h-5 text-zinc-500" />
            </div>
            {t("transactions.historyTitle")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-0.5">
            {t("transactions.historySubtitle")}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl">
            <History className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {t("transactions.historyEmpty")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const isPositive = entry.balance >= 0;
            const [y, m] = entry.label.split("-").map(Number);
            const monthNames = language === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;
            const monthLabel = `${monthNames[(m ?? 1) - 1]} ${y}`;

            return (
              <div
                key={entry.label}
                className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3"
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
                      {fmt(entry.totalIncome)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{t("transactions.expenses")}</span>
                    </div>
                    <span className="text-sm font-bold text-red-500 dark:text-red-400">
                      {fmt(entry.totalExpenses)}
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
                          : "text-red-500 dark:text-red-400",
                      )}
                    >
                      {fmt(entry.balance)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TransactionHistoryView;
