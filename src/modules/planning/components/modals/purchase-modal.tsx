"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ShoppingBag } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { IPlanningItem, PlanningCurrency, IPurchaseItemPayload } from "@/shared/types/planning";
import { PURCHASE_CATEGORIES, formatPrice } from "../../utils/helpers";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface PurchaseModalProps {
  isOpen: boolean;
  item: IPlanningItem | null;
  onClose: () => void;
  onConfirm: (data: IPurchaseItemPayload) => Promise<void>;
}

const CURRENCIES: PlanningCurrency[] = ["PEN", "USD", "EUR"];

export function PurchaseModal({ isOpen, item, onClose, onConfirm }: PurchaseModalProps) {
  const { language } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);
  const [purchasedAt, setPurchasedAt] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<PlanningCurrency>("PEN");
  const [createTransaction, setCreateTransaction] = useState(false);
  const [category, setCategory] = useState("Hogar");
  const [txNotes, setTxNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setPurchasedAt(new Date().toISOString().split("T")[0] ?? "");
      setPriceValue(item.priceValue != null ? String(item.priceValue) : "");
      setPriceCurrency((item.priceCurrency as PlanningCurrency) ?? "PEN");
      setTxNotes(item.title ?? "");
    }
    setCreateTransaction(false);
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onConfirm({
        purchasedAt: new Date(purchasedAt).toISOString(),
        priceValue: priceValue ? parseFloat(priceValue) : null,
        priceCurrency,
        createTransaction,
        transactionData: createTransaction ? { category, notes: txNotes } : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{t("planning.markAsPurchased")}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</p>
            {item.priceValue != null && (
              <p className="text-xs text-zinc-500 mt-0.5">{t("planning.estimatedPrice")} {formatPrice(item.priceValue, item.priceCurrency)}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t("planning.purchaseDate")} *</label>
              <input type="date" value={purchasedAt} onChange={(e) => setPurchasedAt(e.target.value)} required
                className={cn("w-full px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t("planning.pricePaid")}</label>
              <div className="flex gap-2">
                <select value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value as PlanningCurrency)}
                  className={cn("w-20 shrink-0 px-2 py-2.5 rounded-xl border text-xs", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min="0" step="0.01" value={priceValue} onChange={(e) => setPriceValue(e.target.value)}
                  placeholder="0.00"
                  className={cn("flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer"
            onClick={() => setCreateTransaction((p) => !p)}>
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{t("planning.createTransaction")}</p>
              <p className="text-xs text-zinc-500">{t("planning.purchaseAddToFinance")}</p>
            </div>
            <div className={cn("w-10 h-6 rounded-full transition-colors flex items-center px-1", createTransaction ? "bg-cyan-500" : "bg-zinc-200 dark:bg-zinc-700")}>
              <div className={cn("w-4 h-4 rounded-full bg-white shadow transition-transform", createTransaction ? "translate-x-4" : "translate-x-0")} />
            </div>
          </div>

          {createTransaction && (
            <div className="space-y-3 p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t("planning.transactionCategory")} *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className={cn("w-full px-3 py-2 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")}>
                  {PURCHASE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t("planning.transactionNotes")}</label>
                <input value={txNotes} onChange={(e) => setTxNotes(e.target.value)} placeholder={t("planning.transactionNotes") + "..."}
                  className={cn("w-full px-3 py-2 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={isSaving || !purchasedAt}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {isSaving ? t("planning.saving") : t("planning.purchaseConfirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
