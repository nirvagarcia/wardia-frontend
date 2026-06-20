/**
 * DashboardView â€“ period-based financial summary.
 */

"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { useServicesQuery, computeUpcomingPayments } from "@/shared/hooks/use-services-query";
import { useCurrentPeriod } from "@/shared/hooks/use-periods-query";
import { useTransactionsQuery } from "@/shared/hooks/use-transactions-query";
import { getServicesInPeriod } from "@/shared/utils/service-payments";
import { getTranslation } from "@/shared/langs";
import { getLocale, formatCurrency } from "@/shared/utils/currency";
import { getDaysUntil } from "@/shared/utils/date";
import type { IUpcomingPayment } from "@/shared/types/finance";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Receipt } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { MiniDonutChart } from "./components/mini-donut-chart";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { TransactionCard } from "@/views/transactions/components/transaction-card";

export function DashboardView(): React.JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  useEffect(() => { setMounted(true); }, []);

  // â”€â”€ Period â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const periodQuery = useCurrentPeriod();
  const apiParams = useMemo(() => {
    if (!periodQuery.data) return undefined;
    const start = periodQuery.data.startDate.split("T")[0]!;
    return periodQuery.data.endDate
      ? { startDate: start, endDate: periodQuery.data.endDate.split("T")[0]! }
      : { startDate: start };
  }, [periodQuery.data]);

  const { data: transactions = [], isLoading: txLoading } = useTransactionsQuery(apiParams);
  const { data: servicesData } = useServicesQuery();
  const services = useMemo(() => servicesData?.services ?? [], [servicesData]);

  const servicePayments = useMemo(() => {
    if (!periodQuery.data) return [];
    const periodStart = new Date(periodQuery.data.startDate);
    const periodEnd = periodQuery.data.endDate
      ? new Date(periodQuery.data.endDate)
      : new Date();
    return getServicesInPeriod(
      services.filter((s) => s.status === "active"),
      periodStart,
      periodEnd,
    );
  }, [services, periodQuery.data]);

  const allTransactions = useMemo(
    () => [...transactions, ...servicePayments],
    [transactions, servicePayments],
  );

  // â”€â”€ Period totals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const periodIncome = useMemo(
    () => allTransactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount.value, 0),
    [allTransactions],
  );
  const periodExpenses = useMemo(
    () => allTransactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount.value, 0),
    [allTransactions],
  );
  const periodBalance = periodIncome - periodExpenses;

  // â”€â”€ Upcoming payments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const upcomingPayments = useMemo<IUpcomingPayment[]>(
    () => computeUpcomingPayments(services, 30).map((s) => ({
      id: s.id,
      name: s.name,
      amount: s.amount,
      dueDate: s.nextPaymentDate,
      type: "subscription" as const,
    })),
    [services],
  );

  // â”€â”€ Recent transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const recentTransactions = useMemo(
    () => [...allTransactions]
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5),
    [allTransactions],
  );

  // â”€â”€ Donut: expenses (red) + balance/remainder (cyan) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const donutSegments = useMemo(() => {
    if (periodIncome === 0 && periodExpenses === 0) {
      return [{ value: 1, color: "#e4e4e7", label: getTranslation(language, "transactions.income") }];
    }
    const segs: { value: number; color: string; label: string }[] = [];
    if (periodExpenses > 0) {
      segs.push({ value: periodExpenses, color: "#ef4444", label: getTranslation(language, "transactions.expenses") });
    }
    if (periodBalance > 0) {
      segs.push({ value: periodBalance, color: "#06b6d4", label: getTranslation(language, "transactions.balance") });
    }
    return segs;
  }, [periodIncome, periodExpenses, periodBalance, language]);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const isLoading = !mounted || periodQuery.isLoading || txLoading;
  if (isLoading) return <DashboardSkeleton />;

  const now = new Date();
  const locale = getLocale(language);
  const monthName = now.toLocaleDateString(locale, { month: "long" });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = now.getFullYear();
  const dayOfWeek = now.toLocaleDateString(locale, { weekday: "long" });
  const dayOfMonth = now.getDate();
  const periodLabel = periodQuery.data?.label ?? capitalizedMonth;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {t("dashboard.greeting")} Nirvana
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-500">
          {dayOfWeek}, {dayOfMonth} {t("common.de")} {monthName} {year}
        </p>
        <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 pt-1">
          {t("dashboard.summary")} {capitalizedMonth}
        </p>
      </header>

      {/* â”€â”€ Period summary â”€â”€ */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Balance */}
        <div className="md:col-span-6 lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 p-8 card-elevated transition-all duration-300 hover:scale-[1.02]">
          <div className="gradient-mesh-cyan absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl ring-1 ring-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-cyan-100/80 text-sm font-medium mb-2">{t("transactions.balance")}</p>
              <h2 className="text-[3rem] leading-none font-bold text-white tracking-tight">
                {formatCurrency(periodBalance, currency, language)}
              </h2>
            </div>
            <p className="text-cyan-200/70 text-sm">{periodLabel}</p>
          </div>
        </div>

        {/* Gastos + Ingresos */}
        <div className="md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-4">
          <div className="card-surface rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/10">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t("transactions.expenses")}</span>
            </div>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight">
              {formatCurrency(periodExpenses, currency, language)}
            </p>
          </div>

          <div className="card-surface rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-emerald-500/10 p-2 rounded-lg ring-1 ring-emerald-500/10">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t("transactions.income")}</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(periodIncome, currency, language)}
            </p>
          </div>
        </div>

        {/* Donut */}
        <div className="md:col-span-12 lg:col-span-3 card-surface rounded-2xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:card-elevated">
          <MiniDonutChart segments={donutSegments} />
          <div className="w-full space-y-2.5">
            {donutSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-zinc-500 dark:text-zinc-400 truncate">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ Upcoming payments â”€â”€ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
            <div className="bg-cyan-500/10 p-2 rounded-lg ring-1 ring-cyan-500/10">
              <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            </div>
            {t("dashboard.upcomingPayments")} {capitalizedMonth}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1.5 ml-11">{t("dashboard.stayOnTop")}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcomingPayments.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 card-surface rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center">
              <div className="bg-cyan-500/10 p-3 rounded-xl ring-1 ring-cyan-500/10 mb-1">
                <Calendar className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">{t("dashboard.noUpcomingPayments")}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{t("dashboard.noUpcomingPaymentsDesc")}</p>
            </div>
          ) : (
            upcomingPayments.map((payment: IUpcomingPayment) => {
              const daysUntil = getDaysUntil(payment.dueDate);
              const isUrgent = daysUntil <= 3;
              let dueText = "";
              if (daysUntil === 0) {
                dueText = t("dashboard.dueToday");
              } else if (daysUntil === 1) {
                dueText = t("dashboard.dueTomorrow");
              } else {
                dueText = t("dashboard.inDays").replace("{days}", daysUntil.toString());
              }
              return (
                <div
                  key={payment.id}
                  className={cn(
                    "card-surface rounded-xl p-4 transition-all duration-300 hover:card-elevated hover:scale-[1.02]",
                    isUrgent && "ring-1 ring-amber-500/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{payment.name}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5">
                        {payment.dueDate.toLocaleDateString(locale, { month: "short", day: "numeric" })}
                        {" Â· "}
                        <span className={cn("font-medium", isUrgent ? "text-amber-500 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-500")}>
                          {dueText}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-1.5">
                      <p className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight">
                        {formatCurrency(payment.amount, language)}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
                        {t("dashboard.subscription")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* â”€â”€ Recent transactions â”€â”€ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
              <div className="bg-emerald-500/10 p-2 rounded-lg ring-1 ring-emerald-500/10">
                <Receipt className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              {t("dashboard.recentTransactions")}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1.5 ml-11">{t("dashboard.lastMovements")}</p>
          </div>
          <a
            href="/transactions"
            className="text-sm font-medium text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
          >
            {t("dashboard.viewAll")}
          </a>
        </div>

        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="card-surface rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center">
              <Receipt className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-1" />
              <p className="font-medium text-zinc-500 dark:text-zinc-400 text-sm">{t("transactions.noTransactions")}</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
