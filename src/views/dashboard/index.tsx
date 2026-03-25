/**
 * DashboardView - Main financial overview component.
 * Extracted from page.tsx for better modularity and maintainability.
 * Premium enterprise financial dashboard with visual hierarchy.
 * Now with Zustand store integration for real-time data.
 */

"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { useAccountsStore } from "@/shared/stores/accounts-store";
import { useServicesStore } from "@/shared/stores/services-store";
import { useTransactionsStore } from "@/shared/stores/transactions-store";
import { useInitializeAccounts } from "@/shared/hooks/use-initialize-accounts";
import { useInitializeServices } from "@/shared/hooks/use-initialize-services";
import { useInitializeTransactions } from "@/shared/hooks/use-initialize-transactions";
import { getTranslation } from "@/shared/langs";
import { getLocale, formatCurrency } from "@/shared/utils/currency";
import { getDaysUntil } from "@/shared/utils/date";
import { LoadingState } from "@/shared/components/loading-state";
import { IUpcomingPayment, ITransaction } from "@/shared/types/finance";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Layers, Receipt } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { getMiniDonutSegments } from "./utils/helpers";
import { MiniDonutChart } from "./components/mini-donut-chart";
import { StatBar } from "./components/stat-bar";

export function DashboardView(): React.JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accountsInit = useInitializeAccounts();
  const servicesInit = useInitializeServices();
  const transactionsInit = useInitializeTransactions();

  const { getTotalBalance, getTotalCreditUsed, getTotalCreditAvailable } = useAccountsStore();
  const { getMonthlyTotal, getUpcomingPayments } = useServicesStore();
  const { transactions } = useTransactionsStore();

  const totalBalance = getTotalBalance();
  const totalCreditCardDebt = getTotalCreditUsed();
  const totalAvailableCredit = getTotalCreditAvailable();
  const monthlySubscriptionCost = getMonthlyTotal();
  const upcomingPayments = getUpcomingPayments(30);

  const summary = useMemo(() => ({
    totalBalance: { value: totalBalance, currency },
    totalCreditCardDebt: { value: totalCreditCardDebt, currency },
    totalAvailableCredit: { value: totalAvailableCredit, currency },
    monthlySubscriptionCost: { value: monthlySubscriptionCost, currency },
    upcomingPayments: upcomingPayments.map((service) => ({
      id: service.id,
      name: service.name,
      amount: service.amount,
      dueDate: service.nextPaymentDate,
      type: "subscription" as const,
    })),
  }), [totalBalance, totalCreditCardDebt, totalAvailableCredit, monthlySubscriptionCost, upcomingPayments, currency]);

  const donutSegments = useMemo(
    () => getMiniDonutSegments(summary, t),
    [summary, t]
  );

  const recentTransactions = useMemo(
    () => transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5),
    [transactions]
  );

  const isLoading = !mounted || accountsInit.isLoading || servicesInit.isLoading || transactionsInit.isLoading;
  const error = accountsInit.error || servicesInit.error || transactionsInit.error;

  if (isLoading) {
    return <LoadingState message={t("common.loading")} fullScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }
  
  const now = new Date();
  const locale = getLocale(language);
  const monthName = now.toLocaleDateString(locale, { month: "long" });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = now.getFullYear();
  const dayOfWeek = now.toLocaleDateString(locale, { weekday: "long" });
  const dayOfMonth = now.getDate();

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

      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 p-8 card-elevated transition-all duration-300 hover:scale-[1.02]">
          <div className="gradient-mesh-cyan absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl ring-1 ring-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-cyan-100/80 text-sm font-medium mb-2">{t("dashboard.totalBalance")}</p>
              <h2 className="text-[3rem] leading-none font-bold text-white tracking-tight">
                {formatCurrency(summary.totalBalance, language)}
              </h2>
            </div>
            <p className="text-cyan-200/70 text-sm">{t("dashboard.acrossAccounts")}</p>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-4">
          <div className="card-surface rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/10">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t("dashboard.debt")}</span>
            </div>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight">
              {formatCurrency(summary.totalCreditCardDebt, language)}
            </p>
          </div>

          <div className="card-surface rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-cyan-500/10 p-2 rounded-lg ring-1 ring-cyan-500/10">
                <ArrowUpRight className="w-4 h-4 text-cyan-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{t("dashboard.available")}</span>
            </div>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 tracking-tight">
              {formatCurrency(summary.totalAvailableCredit, language)}
            </p>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-3 card-surface rounded-2xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:card-elevated">
          <MiniDonutChart segments={donutSegments} />
          <div className="w-full space-y-2.5">
            {donutSegments.map((seg: { color: string; label: string }, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-zinc-500 dark:text-zinc-400 truncate">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-surface rounded-2xl p-6 transition-all duration-300 hover:card-elevated flex items-center justify-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-2.5 rounded-xl ring-1 ring-purple-500/10">
                <Layers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">{t("dashboard.monthlyServices")}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                  {t("dashboard.monthlyRecurring")} {capitalizedMonth}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
              {formatCurrency(summary.monthlySubscriptionCost, language)}
            </span>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6 space-y-4 transition-all duration-300 hover:card-elevated">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{t("dashboard.financialHealth")}</h3>
          <StatBar 
            label={t("dashboard.available")} 
            value={summary.totalBalance.value - summary.totalCreditCardDebt.value} 
            total={summary.totalBalance.value} 
            color="#06b6d4" 
          />
          <StatBar 
            label={t("dashboard.debt")} 
            value={summary.totalCreditCardDebt.value} 
            total={summary.totalBalance.value} 
            color="#ef4444" 
          />
        </div>
      </div>

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
          {summary.upcomingPayments.map((payment: IUpcomingPayment) => {
            const daysUntil = getDaysUntil(payment.dueDate);
            const isUrgent = daysUntil <= 3;

            let dueText = "";
            if (daysUntil === 0) {
              dueText = t("dashboard.dueToday");
            } else if (daysUntil === 1) {
              dueText = t("dashboard.dueTomorrow");
            } else {
              const template = t("dashboard.inDays");
              dueText = template.replace("{days}", daysUntil.toString());
            }

            return (
              <div
                key={payment.id}
                className={cn(
                  "card-surface rounded-xl p-4 transition-all duration-300 hover:card-elevated hover:scale-[1.02] group",
                  isUrgent && "ring-1 ring-amber-500/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{payment.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5">
                      {payment.dueDate.toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      <span
                        className={cn(
                          "font-medium",
                          isUrgent ? "text-amber-500 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-500"
                        )}
                      >
                        {dueText}
                      </span>
                    </p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight">
                      {formatCurrency(payment.amount, language)}
                    </p>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
                        payment.type === "card" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20",
                        payment.type === "subscription" && "bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20",
                        payment.type === "loan" && "bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20"
                      )}
                    >
                      {payment.type === "card" && t("dashboard.card")}
                      {payment.type === "subscription" && t("dashboard.subscription")}
                      {payment.type === "loan" && t("dashboard.bill")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
          {recentTransactions.map((transaction: ITransaction) => {
            const isIncome = transaction.type === "income";
            const isPending = transaction.status === "pending";
            
            return (
              <div
                key={transaction.id}
                className={cn(
                  "card-surface rounded-xl p-4 transition-all duration-300 hover:card-elevated hover:scale-[1.01] group flex items-center gap-4",
                  isPending && "opacity-70"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0",
                    isIncome
                      ? "bg-emerald-100 dark:bg-emerald-950/30"
                      : "bg-red-100 dark:bg-red-950/30"
                  )}
                >
                  {isIncome ? "💰" : "💸"}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                    {transaction.description}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 flex items-center gap-2">
                    <span>{transaction.date.toLocaleDateString(locale, { month: "short", day: "numeric" })}</span>
                    {transaction.merchant && (
                      <>
                        <span>•</span>
                        <span className="truncate">{transaction.merchant}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className={cn(
                      "font-bold text-sm tracking-tight",
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {isIncome ? "+" : "-"} {formatCurrency(transaction.amount, language)}
                  </p>
                  {isPending && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {t("transactions.pending")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
