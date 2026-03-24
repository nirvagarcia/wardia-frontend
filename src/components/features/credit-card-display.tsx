"use client";

/**
 * Credit Card Display Component
 * Shows credit card with usage statistics and payment information.
 * Now with i18n support and proper light/dark mode styling.
 */

import React from "react";
import { ICreditCard } from "@/types/finance";
import { InteractiveCard } from "./interactive-card";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditCardDisplayProps {
  card: ICreditCard;
}

export const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ card }) => {
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
    <div className="space-y-4">
      {/* Interactive 3D Card */}
      <InteractiveCard card={card} />

      {/* Card Details */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        {/* Credit Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{language === "es" ? "Uso de Crédito" : "Credit Usage"}</span>
            <span className={cn(
              "text-sm font-semibold",
              isHighUsage ? "text-amber-500 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
            )}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          
          {/* Progress Bar */}
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
              {language === "es" ? "Límite" : "Limit"}: {formatCurrency(card.creditLimit)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{language === "es" ? "Próximo Pago" : "Next Payment"}</span>
            </div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {card.nextPaymentDate.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {language === "es" ? "Mínimo" : "Minimum"}: {formatCurrency(card.minimumPayment)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{language === "es" ? "Fecha de Corte" : "Cut-off Date"}</span>
            </div>
            <p className="font-semibold text-zinc-900 dark:text-white">{language === "es" ? "Día" : "Day"} {card.cutoffDay} {language === "es" ? "del mes" : "of month"}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {language === "es" ? "Vence: Día" : "Due: Day"} {card.paymentDueDay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
