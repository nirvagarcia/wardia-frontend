"use client";

/**
 * Add Service Modal Component
 * Full-featured form for adding/editing services/subscriptions
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { X, Calendar, DollarSign, Tag, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ISubscription, PaymentFrequency, SubscriptionStatus } from "@/types/finance";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: Omit<ISubscription, "id">) => void;
  editingService?: ISubscription | null;
  onUpdate?: (id: string, service: Omit<ISubscription, "id">) => void;
}

const categories = [
  { key: "entertainment", icon: "🎬" },
  { key: "productivity", icon: "💼" },
  { key: "health", icon: "💪" },
  { key: "utilities", icon: "⚡" },
  { key: "telecom", icon: "📡" },
  { key: "housing", icon: "🏠" },
];

export function AddServiceModal({ isOpen, onClose, onAdd, editingService, onUpdate }: AddServiceModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const isEditMode = !!editingService;

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    amount: string;
    frequency: PaymentFrequency;
    nextPaymentDate: string;
    status: SubscriptionStatus;
    autoRenewal: boolean;
  }>({
    name: "",
    description: "",
    category: "entertainment",
    amount: "",
    frequency: "monthly",
    nextPaymentDate: "",
    status: "active",
    autoRenewal: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
    if (!isOpen) return;

    if (editingService) {
      
      setFormData((prev) => ({
        ...prev,
        name: editingService.name,
        description: editingService.description || "",
        category: editingService.category,
        amount: editingService.amount.value.toString(),
        frequency: editingService.frequency,
        nextPaymentDate: editingService.nextPaymentDate.toISOString().split('T')[0],
        status: editingService.status,
        autoRenewal: editingService.autoRenewal,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        description: "",
        category: "entertainment",
        amount: "",
        frequency: "monthly",
        nextPaymentDate: "",
        status: "active",
        autoRenewal: true,
      }));
    }
    setErrors({});
  }, [isOpen, editingService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("forms.nameRequired");
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t("forms.invalidAmount");
    }
    if (!formData.nextPaymentDate) {
      newErrors.nextPaymentDate = t("forms.dateRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newService: Omit<ISubscription, "id"> = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      amount: {
        value: parseFloat(formData.amount),
        currency: currency,
      },
      frequency: formData.frequency,
      nextPaymentDate: new Date(formData.nextPaymentDate),
      status: formData.status,
      autoRenewal: formData.autoRenewal,
    };

    if (isEditMode && editingService && onUpdate) {
      onUpdate(editingService.id, newService);
    } else {
      onAdd(newService);
    }
    
    setFormData({
      name: "",
      description: "",
      category: "entertainment",
      amount: "",
      frequency: "monthly",
      nextPaymentDate: "",
      status: "active",
      autoRenewal: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isEditMode
              ? t("forms.editService")
              : t("forms.addService")
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {t("forms.category")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(({ key, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    formData.category === key
                      ? "border-cyan-$100 bg-cyan-$100/10"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-3xl">{icon}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    formData.category === key ? "text-cyan-$100 dark:text-cyan-$100" : "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {t(`services.category${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              {t("forms.serviceName")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("forms.serviceNamePlaceholder")}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.name
                  ? "border-red-500 dark:border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-cyan-$100 dark:focus:border-cyan-$100"
              )}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              {t("forms.description")} ({t("credentials.optional")})
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("forms.descriptionPlaceholder")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-cyan-$100 dark:focus:border-cyan-$100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                {t("forms.amount")}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                  {currency === "PEN" ? "S/" : currency === "USD" ? "$" : "€"}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                    errors.amount
                      ? "border-red-500 dark:border-red-500"
                      : "border-zinc-200 dark:border-zinc-700 focus:border-cyan-$100 dark:focus:border-cyan-$100"
                  )}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                {t("forms.frequency")}
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as "monthly" | "yearly" | "weekly" | "quarterly" })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-cyan-$100 dark:focus:border-cyan-$100"
              >
                <option value="monthly">{t("services.monthly")}</option>
                <option value="yearly">{t("services.yearly")}</option>
                <option value="weekly">{t("services.weekly")}</option>
                <option value="quarterly">{t("services.quarterly")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t("forms.nextPaymentDate")}
            </label>
            <input
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.nextPaymentDate
                  ? "border-red-500 dark:border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-cyan-$100 dark:focus:border-cyan-$100"
              )}
            />
            {errors.nextPaymentDate && <p className="text-red-500 text-sm mt-1">{errors.nextPaymentDate}</p>}
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-$100" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {t("forms.autoRenewal")}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t("forms.renewsAutomatically")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, autoRenewal: !formData.autoRenewal })}
                className={cn(
                  "relative w-12 h-7 rounded-full transition-colors",
                  formData.autoRenewal ? "bg-cyan-$100" : "bg-zinc-300 dark:bg-zinc-700"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
                    formData.autoRenewal ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-cyan-$100 hover:bg-emerald-700 text-white transition-colors font-medium"
            >
              {isEditMode
                ? t("forms.saveChanges")
                : t("forms.addService")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
