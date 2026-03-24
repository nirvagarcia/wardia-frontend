"use client";

/**
 * Credit Card Display Component
 * Shows credit card with unified layout: Header → Visual Card → Usage → Payment Info → Metadata.
 */

import React from "react";
import { ICreditCard } from "@/types/finance";
import { InteractiveCard } from "./interactive-card";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { Calendar, AlertCircle, Edit2, Trash2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <CreditCard className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{card.cardholderName}</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{card.network}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(card)}
              className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors group"
              title={t("common.edit")}
            >
              <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(card.id)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              title={t("common.delete")}
            >
              <Trash2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t("creditCard.creditUsage")}</span>
            <span className={cn(
              "text-sm font-semibold",
              isHighUsage ? "text-amber-500 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
            )}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isHighUsage
                  ? "bg-gradient-to-r from-amber-500 to-red-500"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500"
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-500 dark:text-gray-500">
              {t("accounts.used")}: {formatCurrency(card.usedCredit)}
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              {t("creditCard.limit")}: {formatCurrency(card.creditLimit)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{t("creditCard.nextPayment")}</span>
            </div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {card.nextPaymentDate.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t("creditCard.minimum")}: {formatCurrency(card.minimumPayment)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{t("creditCard.cutoffDate")}</span>
            </div>
            <p className="font-semibold text-zinc-900 dark:text-white">{t("creditCard.day")} {card.cutoffDay} {t("creditCard.ofMonth")}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t("creditCard.dueDay")} {card.paymentDueDay}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-gray-500">
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
