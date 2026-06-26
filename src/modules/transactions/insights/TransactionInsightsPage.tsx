"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Zap,
  Trophy,
  Calendar,
} from "lucide-react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { formatCurrency, getLocale } from "@/shared/utils/currency";
import { useTransactionsQuery } from "@/shared/hooks/use-transactions-query";
import { usePeriodsQuery } from "@/shared/hooks/use-periods-query";
import { useServicesQuery } from "@/shared/hooks/use-services-query";
import { getServicesInPeriod } from "@/shared/utils/service-payments";
import { cn } from "@/shared/utils/cn";
import {
  getCategoryIcon,
  getCategoryLabel,
} from "../utils/helpers";
import { TransactionsSkeleton } from "../components/transactions-skeleton";
import type { ITransaction } from "@/shared/types/finance";

interface CategoryStat {
  key: string;
  total: number;
  count: number;
  pct: number;
  transactions: ITransaction[];
}

interface DayStat {
  key: string;
  date: Date;
  total: number;
  count: number;
  transactions: ITransaction[];
}

type AccentColor = "emerald" | "red" | "cyan" | "amber" | "violet" | "zinc";

const colorMap: Record<AccentColor, string> = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  red: "text-red-500 dark:text-red-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  amber: "text-amber-500 dark:text-amber-400",
  violet: "text-cyan-600 dark:text-cyan-400",
  zinc: "text-zinc-500 dark:text-zinc-400",
};

interface SummaryCardProps {
  label: string;
  value: string;
  color: AccentColor;
  Icon: React.ElementType;
}

function SummaryCard({ label, value, color, Icon }: SummaryCardProps): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", colorMap[color])} />
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{label}</span>
      </div>
      <p className={cn("text-lg font-bold truncate", colorMap[color])}>{value}</p>
    </div>
  );
}

interface HighlightCardProps {
  title: string;
  emoji: string;
  main: string;
  sub: string;
}

function HighlightCard({ title, emoji, main, sub }: HighlightCardProps): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-2">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{main}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export function TransactionInsightsView(): React.JSX.Element {
  const router = useRouter();
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const { data: periods = [], isLoading: periodsLoading } = usePeriodsQuery();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedPeriod = periods[selectedIndex];

  const apiParams = useMemo(() => {
    if (!selectedPeriod) return undefined;
    const start = selectedPeriod.startDate.split("T")[0]!;
    return selectedPeriod.endDate
      ? { startDate: start, endDate: selectedPeriod.endDate.split("T")[0]! }
      : { startDate: start };
  }, [selectedPeriod]);

  const displayLabel = selectedPeriod?.label ?? "";
  const canGoForward = selectedIndex > 0;
  const canGoBack = selectedIndex < periods.length - 1;

  const displayDateRange = useMemo(() => {
    if (!selectedPeriod) return "";
    const locale = language === "es" ? "es-PE" : "en-US";
    const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const start = new Date(selectedPeriod.startDate).toLocaleDateString(locale, opts);
    const end = selectedPeriod.endDate
      ? new Date(selectedPeriod.endDate).toLocaleDateString(locale, opts)
      : getTranslation(language, "transactions.present");
    return `${start} – ${end}`;
  }, [selectedPeriod, language]);

  const { data: transactions = [], isLoading } = useTransactionsQuery(apiParams);
  const { data: servicesData } = useServicesQuery();
  const services = useMemo(() => servicesData?.services ?? [], [servicesData]);

  const servicePayments = useMemo(() => {
    if (!selectedPeriod) return [];
    const periodStart = new Date(selectedPeriod.startDate);
    const periodEnd = selectedPeriod.endDate
      ? new Date(selectedPeriod.endDate)
      : new Date();
    return getServicesInPeriod(
      services.filter((s) => s.status === "active"),
      periodStart,
      periodEnd,
    );
  }, [services, selectedPeriod]);

  const allTransactions = useMemo(
    () => [...transactions, ...servicePayments],
    [transactions, servicePayments],
  );

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [breakdownType, setBreakdownType] = useState<"expense" | "income">("expense");

  const totalIncome = useMemo(
    () =>
      allTransactions
        .filter((txn) => txn.type === "income")
        .reduce((sum, txn) => sum + txn.amount.value, 0),
    [allTransactions],
  );

  const totalExpenses = useMemo(
    () =>
      allTransactions
        .filter((txn) => txn.type === "expense")
        .reduce((sum, txn) => sum + txn.amount.value, 0),
    [allTransactions],
  );

  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : null;

  const categoryStats = useMemo((): CategoryStat[] => {
    const relevant = allTransactions.filter((txn) => txn.type === breakdownType);
    const grandTotal = relevant.reduce((sum, txn) => sum + txn.amount.value, 0);
    const grouped: Record<string, CategoryStat> = {};
    for (const txn of relevant) {
      if (!grouped[txn.category]) {
        grouped[txn.category] = {
          key: txn.category,
          total: 0,
          count: 0,
          pct: 0,
          transactions: [],
        };
      }
      grouped[txn.category]!.total += txn.amount.value;
      grouped[txn.category]!.count += 1;
      grouped[txn.category]!.transactions.push(txn);
    }
    return Object.values(grouped)
      .map((g) => ({
        ...g,
        pct: grandTotal > 0 ? (g.total / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [allTransactions, breakdownType]);

  const dailyStats = useMemo((): DayStat[] => {
    const grouped: Record<string, DayStat> = {};
    for (const txn of allTransactions) {
      if (txn.type !== "expense") continue;
      const date = new Date(txn.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = { key, date, total: 0, count: 0, transactions: [] };
      }
      grouped[key]!.total += txn.amount.value;
      grouped[key]!.count += 1;
      grouped[key]!.transactions.push(txn);
    }
    return Object.values(grouped).sort((a, b) => b.total - a.total);
  }, [allTransactions]);

  const topExpenseCategory = useMemo(
    () =>
      allTransactions
        .filter((txn) => txn.type === "expense")
        .reduce(
          (acc: Record<string, number>, txn) => ({
            ...acc,
            [txn.category]: (acc[txn.category] ?? 0) + txn.amount.value,
          }),
          {},
        ),
    [allTransactions],
  );

  const topExpenseCategoryKey = Object.entries(topExpenseCategory).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  const topDay = dailyStats[0] ?? null;
  const maxDayTotal = dailyStats[0]?.total ?? 1;

  const biggestExpense = useMemo(
    () =>
      [...transactions]
        .filter((txn) => txn.type === "expense")
        .sort((a, b) => b.amount.value - a.amount.value)[0] ?? null,
    [transactions],
  );

  const avgDailySpend =
    dailyStats.length > 0
      ? dailyStats.reduce((sum, d) => sum + d.total, 0) / dailyStats.length
      : 0;

  const fmt = (value: number) => formatCurrency(value, currency, language);
  const locale = getLocale(language);
  const savingsRateColor: AccentColor =
    savingsRate === null
      ? "zinc"
      : savingsRate >= 20
        ? "emerald"
        : savingsRate >= 0
          ? "amber"
          : "red";

  if (isLoading || periodsLoading) return <TransactionsSkeleton />;

  return (
    <div className="space-y-6 pb-6">
      {/* ── Header ── */}
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
            <div className="bg-cyan-500/10 p-1.5 rounded-xl ring-1 ring-cyan-500/10">
              <BarChart2 className="w-5 h-5 text-cyan-500" />
            </div>
            {t("transactions.reportTitle")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-0.5">
            {t("transactions.reportSubtitle")}
          </p>
        </div>
      </header>

      <div className="flex items-center justify-between bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3">
        <button
          onClick={() => {
            setSelectedIndex((i) => i + 1);
            setExpandedCategory(null);
          }}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-zinc-900 dark:text-white text-sm md:text-base">
              {displayLabel}
            </span>
          </div>
          {displayDateRange && (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums">
              {displayDateRange}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setSelectedIndex((i) => i - 1);
            setExpandedCategory(null);
          }}
          disabled={!canGoForward}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="bg-cyan-500/10 p-4 rounded-2xl">
            <BarChart2 className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {t("transactions.noDataMonth")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard
              label={t("transactions.income")}
              value={fmt(totalIncome)}
              color="emerald"
              Icon={TrendingUp}
            />
            <SummaryCard
              label={t("transactions.expenses")}
              value={fmt(totalExpenses)}
              color="red"
              Icon={TrendingDown}
            />
            <SummaryCard
              label={t("transactions.balance")}
              value={fmt(balance)}
              color={balance >= 0 ? "cyan" : "red"}
              Icon={Zap}
            />
            <SummaryCard
              label={t("transactions.savingsRate")}
              value={savingsRate !== null ? `${savingsRate}%` : "—"}
              color={savingsRateColor}
              Icon={Trophy}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topExpenseCategoryKey && (
              <HighlightCard
                title={t("transactions.topCategory")}
                emoji={getCategoryIcon(topExpenseCategoryKey)}
                main={getCategoryLabel(t, topExpenseCategoryKey)}
                sub={fmt(topExpenseCategory[topExpenseCategoryKey] ?? 0)}
              />
            )}
            {topDay && (
              <HighlightCard
                title={t("transactions.topDay")}
                emoji="🔥"
                main={topDay.date.toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
                sub={fmt(topDay.total)}
              />
            )}
            <HighlightCard
              title={t("transactions.avgDailySpend")}
              emoji="📊"
              main={fmt(avgDailySpend)}
              sub={`${dailyStats.length} ${t("transactions.daysWithActivity")}`}
            />
          </div>

          <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <h2 className="font-bold text-zinc-900 dark:text-white">
                {breakdownType === "expense"
                  ? t("transactions.expenseBreakdown")
                  : t("transactions.incomeBreakdown")}
              </h2>
              <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
                <button
                  onClick={() => {
                    setBreakdownType("expense");
                    setExpandedCategory(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    breakdownType === "expense"
                      ? "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  )}
                >
                  {t("transactions.expense")}
                </button>
                <button
                  onClick={() => {
                    setBreakdownType("income");
                    setExpandedCategory(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    breakdownType === "income"
                      ? "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  )}
                >
                  {t("transactions.income")}
                </button>
              </div>
            </div>

            {categoryStats.length === 0 ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400 py-8 text-sm">
                {t("transactions.noDataMonth")}
              </p>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {categoryStats.map((cat, i) => (
                  <div key={cat.key}>
                    <button
                      onClick={() =>
                        setExpandedCategory((prev) =>
                          prev === cat.key ? null : cat.key,
                        )
                      }
                      className="w-full flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <div className="w-6 flex-shrink-0 text-center">
                        {i === 0 ? (
                          <span className="text-sm">🥇</span>
                        ) : i === 1 ? (
                          <span className="text-sm">🥈</span>
                        ) : i === 2 ? (
                          <span className="text-sm">🥉</span>
                        ) : (
                          <span className="text-xs font-bold text-zinc-400">
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <span className="text-xl w-8 text-center flex-shrink-0">
                        {getCategoryIcon(cat.key)}
                      </span>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                            {getCategoryLabel(t, cat.key)}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              {cat.count}×
                            </span>
                            <span
                              className={cn(
                                "text-sm font-bold",
                                breakdownType === "expense"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-emerald-600 dark:text-emerald-400",
                              )}
                            >
                              {fmt(cat.total)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500"
                              style={{ width: `${cat.pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 w-8 text-right">
                            {cat.pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200",
                          expandedCategory === cat.key && "-rotate-180",
                        )}
                      />
                    </button>

                    {expandedCategory === cat.key && (
                      <div className="bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {cat.transactions
                          .slice()
                          .sort((a, b) => b.amount.value - a.amount.value)
                          .map((txn) => (
                            <div
                              key={txn.id}
                              className="flex items-center gap-3 px-4 py-3"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                  {txn.description}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                  {new Date(
                                    txn.transactionDate,
                                  ).toLocaleDateString(locale, {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                  {txn.source ? ` · ${txn.source}` : ""}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-bold flex-shrink-0",
                                  breakdownType === "expense"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-emerald-600 dark:text-emerald-400",
                                )}
                              >
                                {breakdownType === "expense" ? "-" : "+"}{" "}
                                {fmt(txn.amount.value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {dailyStats.length > 0 && (
            <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="font-bold text-zinc-900 dark:text-white">
                  {t("transactions.dailyPatterns")}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                  {t("transactions.dailyPatternsDesc")}
                </p>
              </div>
              <div className="p-4 space-y-3">
                {dailyStats.map((day, i) => (
                  <div key={day.key} className="flex items-center gap-3">
                    <div className="w-20 flex-shrink-0">
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 capitalize">
                        {day.date.toLocaleDateString(locale, {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {day.date.toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            i === 0
                              ? "bg-cyan-500"
                              : i === 1
                                ? "bg-cyan-400"
                                : i === 2
                                  ? "bg-cyan-300 dark:bg-cyan-600"
                                  : "bg-zinc-200 dark:bg-zinc-700",
                          )}
                          style={{
                            width: `${(day.total / maxDayTotal) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 w-24 text-right flex-shrink-0">
                        {fmt(day.total)}
                      </span>
                    </div>

                    {i === 0 ? (
                      <Flame className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {biggestExpense && (
            <section className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
              <h2 className="font-bold text-zinc-900 dark:text-white mb-3">
                {t("transactions.biggestExpense")}
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
                  {getCategoryIcon(biggestExpense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {biggestExpense.description}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {getCategoryLabel(t, biggestExpense.category)} ·{" "}
                    {new Date(
                      biggestExpense.transactionDate,
                    ).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span className="text-base font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                  -{fmt(biggestExpense.amount.value)}
                </span>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionInsightsView;
