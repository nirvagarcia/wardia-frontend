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
  periodStartDateLabel?: string;
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
  periodStartDateLabel,
}: TransactionStatsProps): React.JSX.Element {
  return (
    <>
      {/* Mobile: compact single banner */}
      <div className="md:hidden relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 p-4 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-cyan-100/80 text-xs font-medium mb-0.5">{balanceLabel}</p>
            <h2 className={cn(
              "text-2xl font-bold tracking-tight",
              balance >= 0 ? "text-white" : "text-red-200"
            )}>
              {formatAmount(balance)}
            </h2>
            <p className="text-cyan-200/80 text-xs mt-0.5 font-medium">{thisMonthLabel}</p>
            {periodStartDateLabel && (
              <p className="text-cyan-200/60 text-[10px] mt-0.5">{periodStartDateLabel}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="text-right">
              <p className="text-cyan-100/60 text-[10px] font-medium">{incomeLabel}</p>
              <p className="text-sm font-bold text-white">{formatAmount(totalIncome)}</p>
            </div>
            <div className="text-right">
              <p className="text-cyan-100/60 text-[10px] font-medium">{expensesLabel}</p>
              <p className="text-sm font-bold text-white">{formatAmount(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: original layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 p-8 card-elevated transition-all duration-300 hover:scale-[1.02]">
          <div className="gradient-mesh-cyan absolute inset-0 opacity-50" />
          <div className="relative h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl ring-1 ring-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-cyan-100/80 text-sm font-medium mb-2">{balanceLabel}</p>
              <h2 className={cn(
                "text-[2.5rem] leading-none font-bold tracking-tight",
                balance >= 0 ? "text-white" : "text-red-200"
              )}>
                {formatAmount(balance)}
              </h2>
            </div>
            <p className="text-cyan-200/80 text-sm font-semibold">{thisMonthLabel}</p>
            {periodStartDateLabel && (
              <p className="text-cyan-200/60 text-xs">{periodStartDateLabel}</p>
            )}
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          <div className="card-surface rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg ring-1 ring-emerald-500/10">
                <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{incomeLabel}</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatAmount(totalIncome)}
            </p>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-500 mt-2 font-medium">
              {thisMonthLabel}
            </p>
          </div>

          <div className="card-surface rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/10">
                <ArrowDownCircle className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{expensesLabel}</span>
            </div>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight">
              {formatAmount(totalExpenses)}
            </p>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-500 mt-2 font-medium">
              {thisMonthLabel}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
