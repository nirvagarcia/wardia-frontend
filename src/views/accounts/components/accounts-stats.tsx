/**
 * AccountsStats Component
 * Displays statistics for debit accounts and credit cards
 */

import React from "react";

interface StatsCardProps {
  label: string;
  value: string;
  subtitle: string;
  variant: "cyan" | "red";
}

function StatsCard({ label, value, subtitle, variant }: StatsCardProps): React.JSX.Element {
  const colors = variant === "cyan"
    ? {
        gradient: "from-cyan-50 to-teal-100 dark:from-cyan-600/30 dark:to-teal-600/30",
        border: "border-cyan-200/40 dark:border-white/5",
        labelText: "text-cyan-700 dark:text-cyan-300",
        valueText: "text-cyan-900 dark:text-white",
        subtitleText: "text-cyan-600 dark:text-cyan-400",
      }
    : {
        gradient: "from-red-50 to-rose-100 dark:from-red-600/30 dark:to-rose-600/30",
        border: "border-red-200/40 dark:border-white/5",
        labelText: "text-red-700 dark:text-red-300",
        valueText: "text-red-900 dark:text-white",
        subtitleText: "text-red-600 dark:text-red-400",
      };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br ${colors.gradient} shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border ${colors.border}`}>
      <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
      <div className="relative">
        <p className={`${colors.labelText} text-xs md:text-sm font-semibold mb-1`}>
          {label}
        </p>
        <p className={`text-3xl md:text-[2.5rem] leading-tight font-bold ${colors.valueText} tracking-tight`}>
          {value}
        </p>
        <p className={`${colors.subtitleText} text-xs md:text-sm mt-2 font-medium`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

interface DebitStatsProps {
  totalBalance: string;
  accountsCount: number;
  spentAmount: string;
  spentLabel: string;
  thisMonthLabel: string;
}

export function DebitStats({
  totalBalance,
  accountsCount,
  spentAmount,
  spentLabel,
  thisMonthLabel,
}: DebitStatsProps): React.JSX.Element {
  const accountsLabel = accountsCount === 1 ? "tarjeta débito" : "tarjetas débito";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard
        variant="cyan"
        label="Balance de Cuentas"
        value={totalBalance}
        subtitle={`${accountsCount} ${accountsLabel}`}
      />
      <StatsCard
        variant="red"
        label={spentLabel}
        value={spentAmount}
        subtitle={thisMonthLabel}
      />
    </div>
  );
}

interface CreditStatsProps {
  availableCredit: string;
  cardsCount: number;
  usedCredit: string;
  availableLabel: string;
  usedLabel: string;
  thisMonthLabel: string;
}

export function CreditStats({
  availableCredit,
  cardsCount,
  usedCredit,
  availableLabel,
  usedLabel,
  thisMonthLabel,
}: CreditStatsProps): React.JSX.Element {
  const cardsLabel = cardsCount === 1 ? "tarjeta crédito" : "tarjetas crédito";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard
        variant="cyan"
        label={availableLabel}
        value={availableCredit}
        subtitle={`${cardsCount} ${cardsLabel}`}
      />
      <StatsCard
        variant="red"
        label={usedLabel}
        value={usedCredit}
        subtitle={thisMonthLabel}
      />
    </div>
  );
}
