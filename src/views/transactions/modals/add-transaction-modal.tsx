/**
 * Add Transaction Modal Component
 * Full-featured form for adding/editing income and expense transactions
 */

"use client";

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { transactionModalSchema } from "@/shared/validation/schemas";
import type { ITransaction } from "@/shared/types/finance";
import type { TransactionType } from "@/shared/types";
import { incomeCategories, expenseCategories } from "../utils/helpers";

function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<ITransaction, "id">) => Promise<void> | void;
  editingTransaction?: ITransaction | null;
  onUpdate?: (id: string, transaction: Omit<ITransaction, "id">) => Promise<void> | void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  editingTransaction,
  onUpdate,
}: AddTransactionModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const isEditMode = !!editingTransaction;

  const [formData, setFormData] = useState<{
    type: TransactionType;
    category: string;
    description: string;
    amount: string;
    currency: "PEN" | "USD" | "EUR";
    source: string;
    date: string;
    notes: string;
    status: "pending" | "completed" | "failed";
  }>({
    type: "expense",
    category: "groceries",
    description: "",
    amount: "",
    currency: "PEN",
    source: "",
    date: "",
    notes: "",
    status: "completed",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        category: editingTransaction.category,
        description: editingTransaction.description,
        amount: editingTransaction.amount.value.toString(),
        currency: editingTransaction.amount.currency,
        source: editingTransaction.source || "",
        date: toLocalDateString(editingTransaction.transactionDate),
        notes: editingTransaction.notes || "",
        status: editingTransaction.status === "pending" ? "pending" : "completed",
      });
    } else {
      setFormData({
        type: "expense",
        category: "dining",
        description: "",
        amount: "",
        currency: "PEN",
        source: "",
        date: toLocalDateString(new Date()),
        notes: "",
        status: "completed",
      });
    }
    setErrors({});
  }, [isOpen, editingTransaction]);

  if (!isOpen) return null;

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = transactionModalSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const payload: Omit<ITransaction, "id"> = {
      type: result.data.type,
      status: result.data.status,
      amount: {
        value: parseFloat(result.data.amount),
        currency: result.data.currency,
      },
      description: result.data.description,
      source: result.data.merchant || undefined,
      category: result.data.category,
      transactionDate: new Date(result.data.date + "T12:00:00"),
      notes: result.data.notes || undefined,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode && editingTransaction && onUpdate) {
        await onUpdate(editingTransaction.id, payload);
      } else {
        await onAdd(payload);
      }
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData({
      ...formData,
      type,
      category: type === "income" ? "salary" : "dining",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md sm:max-w-2xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            {isEditMode ? t("forms.editTransaction") : t("forms.addTransaction")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 pb-20 sm:pb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {t("transactions.transactionType")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium",
                  formData.type === "income"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                )}
              >
                <span className="text-2xl">💰</span>
                {t("transactions.income")}
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium",
                  formData.type === "expense"
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                )}
              >
                <span className="text-2xl">💸</span>
                {t("transactions.expense")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {t("forms.category")}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
              {currentCategories.map(({ key, labelKey, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key })}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    formData.category === key
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <span
                    className={cn(
                      "text-xs font-medium text-center",
                      formData.category === key
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {t(labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("transactions.description")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
              className={cn(errors['description'] && "border-red-500 focus:ring-red-500")}
              placeholder={t("transactions.descriptionPlaceholder")}
            />
            {errors['description'] && (
              <p className="text-sm text-red-500">{errors['description']}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount">
                {t("forms.amount")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {formData.currency === "PEN" ? "S/" : formData.currency === "USD" ? "$" : "€"}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    setErrors({ ...errors, amount: "" });
                  }}
                  className={cn("pl-9", errors['amount'] && "border-red-500 focus:ring-red-500")}
                  placeholder="0.00"
                />
              </div>
              {errors['amount'] && <p className="text-sm text-red-500">{errors['amount']}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t("forms.currency")}</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as "PEN" | "USD" | "EUR" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">PEN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">{t("transactions.source")}</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder={t("transactions.sourcePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              {t("transactions.transactionDate")} <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={formData.date ? new Date(formData.date + "T12:00:00") : undefined}
              onChange={(date) => {
                setFormData({ ...formData, date: date ? toLocalDateString(date) : "" });
                setErrors({ ...errors, date: "" });
              }}
              placeholder={t("forms.selectDate")}
              className={cn(errors['date'] && "border-red-500 focus:ring-red-500")}
            />
            {errors['date'] && <p className="text-sm text-red-500">{errors['date']}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {t("transactions.status")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "completed" })}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all font-medium",
                  formData.status === "completed"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                )}
              >
                {t("transactions.completed")}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "pending" })}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all font-medium",
                  formData.status === "pending"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                )}
              >
                {t("transactions.pending")}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("transactions.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("forms.notesPlaceholder")}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-gray-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {t("forms.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-medium transition-colors"
            >
              {isSubmitting
                ? t("common.loading")
                : isEditMode
                ? t("forms.saveChanges")
                : t("forms.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
