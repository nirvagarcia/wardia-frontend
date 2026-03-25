/**
 * TransactionStats Component
 * Displays income, expenses, and balance statistics cards
 */

"use client";

import React from "react";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface TransactionStatsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  formatAmount: (value: number) => string;
  incomeLabel: string;
  expensesLabel: string;
  balanceLabel: string;
  thisMonthLabel: string;
}

export function TransactionStats({
  totalIncome,
  totalExpenses,
  balance,
  formatAmount,
  incomeLabel,
  expensesLabel,
  balanceLabel,
  thisMonthLabel,
}: TransactionStatsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-600/30 dark:to-green-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-emerald-200/40 dark:border-white/5">
        <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <ArrowUpCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold">
              {incomeLabel}
            </span>
          </div>
          <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-emerald-900 dark:text-white tracking-tight">
            {formatAmount(totalIncome)}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs md:text-sm mt-2 font-medium">
            {thisMonthLabel}
          </p>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-600/30 dark:to-rose-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-red-200/40 dark:border-white/5">
        <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-500/10 p-2 rounded-lg">
              <ArrowDownCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-red-700 dark:text-red-300 text-xs md:text-sm font-semibold">
              {expensesLabel}
            </span>
          </div>
          <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-red-900 dark:text-white tracking-tight">
            {formatAmount(totalExpenses)}
          </p>
          <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 font-medium">
            {thisMonthLabel}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-600/30 dark:to-blue-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-cyan-200/40 dark:border-white/5">
        <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-cyan-700 dark:text-cyan-300 text-xs md:text-sm font-semibold">
              {balanceLabel}
            </span>
          </div>
          <p
            className={cn(
              "text-3xl md:text-[2.5rem] leading-tight font-bold tracking-tight",
              balance >= 0
                ? "text-cyan-900 dark:text-white"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {formatAmount(balance)}
          </p>
          <p className="text-cyan-600 dark:text-cyan-400 text-xs md:text-sm mt-2 font-medium">
            {thisMonthLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
