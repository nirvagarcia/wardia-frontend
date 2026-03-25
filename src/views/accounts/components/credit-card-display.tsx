"use client";

/**
 * Credit Card Display Component
 * Shows credit card with unified layout: Header → Visual Card → Usage → Payment Info → Metadata.
 */

import React from "react";
import Image from "next/image";
import { ICreditCard } from "@/shared/types/finance";
import { InteractiveCard } from "./interactive-card";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { Calendar, AlertCircle, Edit2, Trash2, Building2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { getBankLogo } from "@/shared/utils/bank-logos";

interface CreditCardDisplayProps {
  card: ICreditCard;
  onEdit?: (card: ICreditCard) => void;
  onDelete?: (id: string) => void;
}

export const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ card, onEdit, onDelete }) => {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = language === "es" ? "es-PE" : "en-US";

  const formatCurrency = (amount: { value: number; currency: string }): string => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount.value);
  };

  const usagePercentage = (card.usedCredit.value / card.creditLimit.value) * 100;
  const isHighUsage = usagePercentage > 70;

  return (
    <div className="card-surface rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl ring-1 ring-black/[0.06] dark:ring-white/[0.06] shadow-sm">
            {getBankLogo(card.bankName) ? (
              <Image
                src={getBankLogo(card.bankName)!}
                alt={card.bankName}
                width={28}
                height={28}
                className="object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{card.bankName}</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 uppercase">{card.network}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(card)}
              className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group"
              title={t("common.edit")}
            >
              <Edit2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(card.id)}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group"
              title={t("common.delete")}
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">{t("creditCard.creditUsage")}</span>
            <span className={cn(
              "text-xs font-bold",
              isHighUsage ? "text-amber-500 dark:text-amber-400" : "text-cyan-600 dark:text-cyan-400"
            )}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                isHighUsage
                  ? "bg-gradient-to-r from-amber-500 to-red-500"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500"
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-zinc-500 dark:text-zinc-500">
              {t("accounts.used")}: {formatCurrency(card.usedCredit)}
            </span>
            <span className="text-zinc-500 dark:text-zinc-500">
              {t("creditCard.limit")}: {formatCurrency(card.creditLimit)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium">{t("creditCard.nextPayment")}</span>
            </div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-white">
              {card.nextPaymentDate.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">
              {t("creditCard.minimum")}: {formatCurrency(card.minimumPayment)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium">{t("creditCard.cutoffDate")}</span>
            </div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-white">{t("creditCard.day")} {card.cutoffDay} {t("creditCard.ofMonth")}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">
              {t("creditCard.dueDay")} {card.paymentDueDay}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            {t("creditCard.lastUpdated")}: {card.lastStatementDate.toLocaleString(locale, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <InteractiveCard card={card} disableInteractive={true} />
    </div>
  );
};
