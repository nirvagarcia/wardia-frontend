"use client";

/**
 * Account Card Component - Feature component for displaying bank account information.
 * Now with unified card layout: Header → Visual Card → Balance → Details → Metadata.
 */

import React from "react";
import Image from "next/image";
import { IAccount } from "@/shared/types/finance";
import { maskAccountNumber } from "@/shared/utils/security";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useMask } from "@/shared/hooks/use-mask";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { getLocale } from "@/shared/utils/currency";
import { Copy, Check, Eye, EyeOff, Building2, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DebitCardVisual } from "./debit-card-visual";
import { getBankLogo } from "@/shared/utils/bank-logos";

interface AccountCardProps {
  account: IAccount;
  onEdit?: (account: IAccount) => void;
  onDelete?: (id: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const { copied, copyToClipboard } = useClipboard();
  const { isMasked, toggleMask } = useMask(true);
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const handleCopyCCI = async (): Promise<void> => {
    await copyToClipboard(account.cci, true);
  };

  const formatCurrency = (amount: { value: number; currency: string }): string => {
    const locale = getLocale(language);
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount.value);
  };

  const locale = getLocale(language);

  return (
    <div className="card-surface rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl ring-1 ring-black/[0.06] dark:ring-white/[0.06] shadow-sm">
            {getBankLogo(account.bankName) ? (
              <Image
                src={getBankLogo(account.bankName)!}
                alt={account.bankName}
                width={28}
                height={28}
                className="object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{account.bankName}</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 capitalize">{account.accountType}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {account.isDefault && (
            <span className="text-[10px] font-semibold px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full ring-1 ring-cyan-500/10">
              {t("accounts.default")}
            </span>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(account)}
              className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group"
              title={t("common.edit")}
            >
              <Edit2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(account.id)}
              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group"
              title={t("common.delete")}
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1 font-medium">{t("accounts.available")}</p>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 tracking-tight">
            {formatCurrency(account.balance)}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mb-1 font-medium">{t("accounts.accountNumber")}</p>
            <p className="font-mono text-sm text-zinc-900 dark:text-white cursor-text select-text">
              {isMasked ? maskAccountNumber(account.accountNumber) : account.accountNumber}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mb-1 font-medium">CCI</p>
              <p className="font-mono text-sm text-zinc-900 dark:text-white cursor-text select-text">
                {isMasked ? maskAccountNumber(account.cci) : account.cci}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMask}
                className="p-2 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
                aria-label={isMasked ? "Show full numbers" : "Hide numbers"}
              >
                {isMasked ? (
                  <Eye className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                )}
              </button>

              <button
                onClick={handleCopyCCI}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copied
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                    : "bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
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

        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            {t("accounts.lastUpdated")}: {account.lastUpdated.toLocaleString(locale, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <DebitCardVisual account={account} />
    </div>
  );
};
