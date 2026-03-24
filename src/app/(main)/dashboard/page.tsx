"use client";

/**
 * Dashboard Page - Main financial overview.
 * Now with full i18n support and proper light/dark mode styling.
 */

import React from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { mockFinancialSummary } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Helper function to format currency amounts.
 */
function formatAmount(amount: { value: number; currency: string }, locale: string): string {
  const formatter = new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", {
    style: "currency",
    currency: amount.currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount.value);
}

/**
 * Helper to calculate days until a payment is due.
 */
function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DashboardPage(): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const summary = mockFinancialSummary;
  
  const now = new Date();
  const locale = language === "es" ? "es-PE" : "en-US";
  const monthName = now.toLocaleDateString(locale, { month: "long" });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = now.getFullYear();
  const dayOfWeek = now.toLocaleDateString(locale, { weekday: "long" });
  const dayOfMonth = now.getDate();

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24 bg-white dark:bg-zinc-950">
      <header className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {t("dashboard.greeting")} Nirvana 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {dayOfWeek}, {dayOfMonth} {language === "es" ? "de" : ""} {monthName} {year}
          </p>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {t("dashboard.summary")} {capitalizedMonth}
        </p>
      </header>

      <div className="grid gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t("dashboard.totalBalance")}</p>
              <h2 className="text-4xl font-bold text-white mt-2">
                {formatAmount(summary.totalBalance, language)}
              </h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-emerald-100 text-sm">{t("dashboard.acrossAccounts")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("dashboard.debt")}</span>
            </div>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">
              {formatAmount(summary.totalCreditCardDebt, language)}
            </p>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("dashboard.available")}</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatAmount(summary.totalAvailableCredit, language)}
            </p>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t("dashboard.monthlyServices")}</h3>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatAmount(summary.monthlySubscriptionCost, language)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("dashboard.monthlyRecurring")} {capitalizedMonth}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Calendar className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            {t("dashboard.upcomingPayments")} {capitalizedMonth}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t("dashboard.stayOnTop")}</p>
        </div>

        <div className="space-y-3">
          {summary.upcomingPayments.map((payment) => {
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
                  "bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border rounded-xl p-4 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800/50",
                  isUrgent ? "border-amber-500/50" : "border-zinc-200 dark:border-zinc-800"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{payment.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {payment.dueDate.toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" • "}
                      <span
                        className={cn(
                          "font-medium",
                          isUrgent ? "text-amber-500 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {dueText}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {formatAmount(payment.amount, language)}
                    </p>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        payment.type === "card"
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {payment.type === "card" ? t("dashboard.card") : t("dashboard.subscription")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
