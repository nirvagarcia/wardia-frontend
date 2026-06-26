/**
 * AccountsStats Component
 * Displays statistics for debit accounts and credit cards
 */

import React from "react";
import { ArrowDownRight, Wallet, CreditCard } from "lucide-react";

interface HeroCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

function HeroCard({ label, value, subtitle, icon }: HeroCardProps): React.JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 p-8 card-elevated transition-all duration-300 hover:scale-[1.02]">
      <div className="gradient-mesh-cyan absolute inset-0 opacity-50" />
      <div className="relative flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl ring-1 ring-white/20">
          {icon}
        </div>
        <div>
          <p className="text-cyan-100/80 text-sm font-medium mb-2">{label}</p>
          <h2 className="text-[2.5rem] leading-none font-bold text-white tracking-tight">{value}</h2>
        </div>
        <p className="text-cyan-200/70 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

function RedCard({ label, value, subtitle }: { label: string; value: string; subtitle: string }): React.JSX.Element {
  return (
    <div className="card-surface rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-300 hover:card-elevated">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/10">
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{label}</span>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 tracking-tight">{value}</p>
      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-500 mt-2 font-medium">{subtitle}</p>
    </div>
  );
}

interface DebitStatsProps {
  totalBalance: string;
  accountsCount: number;
  balanceLabel: string;
  cardSubtitle: string;
  spentAmount: string;
  spentLabel: string;
  thisMonthLabel: string;
}

export function DebitStats({
  totalBalance,
  accountsCount,
  balanceLabel,
  cardSubtitle,
  spentAmount,
  spentLabel,
  thisMonthLabel,
}: DebitStatsProps): React.JSX.Element {
  void accountsCount;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <HeroCard
        label={balanceLabel}
        value={totalBalance}
        subtitle={cardSubtitle}
        icon={<Wallet className="w-6 h-6 text-white" />}
      />
      <RedCard
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
  cardSubtitle: string;
  usedCredit: string;
  availableLabel: string;
  usedLabel: string;
  thisMonthLabel: string;
}

export function CreditStats({
  availableCredit,
  cardsCount,
  cardSubtitle,
  usedCredit,
  availableLabel,
  usedLabel,
  thisMonthLabel,
}: CreditStatsProps): React.JSX.Element {
  void cardsCount;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <HeroCard
        label={availableLabel}
        value={availableCredit}
        subtitle={cardSubtitle}
        icon={<CreditCard className="w-6 h-6 text-white" />}
      />
      <RedCard
        label={usedLabel}
        value={usedCredit}
        subtitle={thisMonthLabel}
      />
    </div>
  );
}
