"use client";

/**
 * Account Card Component - Feature component for displaying bank account information.
 * Now with i18n support and proper light/dark mode styling.
 */

import React from "react";
import { IAccount } from "@/types/finance";
import { maskAccountNumber } from "@/lib/security";
import { useClipboard } from "@/hooks/use-clipboard";
import { useMask } from "@/hooks/use-mask";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { Copy, Check, Eye, EyeOff, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: IAccount;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const { copied, copyToClipboard } = useClipboard();
  const { isMasked, toggleMask } = useMask(true);
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const handleCopyCCI = async (): Promise<void> => {
    await copyToClipboard(account.cci, true);
  };

  const formatCurrency = (amount: { value: number; currency: string }): string => {
    const locale = language === "es" ? "es-PE" : "en-US";
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount.value);
  };

  const locale = language === "es" ? "es-PE" : "en-US";

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/30 transition-all">
      {/* Bank Name & Type */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-3 rounded-xl">
            <Building2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{account.bankName}</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{account.accountType}</span>
          </div>
        </div>
        {account.isDefault && (
          <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full">
            {t("accounts.default")}
          </span>
        )}
      </div>

      {/* Balance */}
      <div className="py-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t("accounts.available")}</p>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(account.balance)}
        </p>
      </div>

      {/* Account Number & CCI */}
      <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{t("accounts.accountNumber")}</p>
          <p className="font-mono text-sm text-zinc-900 dark:text-white">
            {isMasked ? maskAccountNumber(account.accountNumber) : account.accountNumber}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">CCI</p>
            <p className="font-mono text-sm text-zinc-900 dark:text-white">
              {isMasked ? maskAccountNumber(account.cci) : account.cci}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMask}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              aria-label={isMasked ? "Show full numbers" : "Hide numbers"}
            >
              {isMasked ? (
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <button
              onClick={handleCopyCCI}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-gray-300"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{t("accounts.copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">{t("accounts.copyCCI")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-gray-500">
          {t("accounts.lastUpdated")}: {account.lastUpdated.toLocaleString(locale, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};
