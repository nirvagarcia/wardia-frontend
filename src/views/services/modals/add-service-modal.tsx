"use client";

/**
 * Add Service Modal Component
 * Full-featured form for adding/editing services/subscriptions
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { X, Calendar, DollarSign, Tag, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { serviceModalSchema } from "@/shared/validation/schemas";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Textarea } from "@/shared/components/ui/textarea";
import type { ISubscription, PaymentFrequency, SubscriptionStatus } from "@/shared/types/finance";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: Omit<ISubscription, "id">) => Promise<void>;
  editingService?: ISubscription | null;
  onUpdate?: (id: string, service: Omit<ISubscription, "id">) => Promise<void>;
}

const categories = [
  { key: "housing", icon: "🏠" },
  { key: "utilities", icon: "💡" },
  { key: "telecom", icon: "📱" },
  { key: "health", icon: "🩺" },
  { key: "productivity", icon: "📚" },
  { key: "entertainment", icon: "🎵" },
];

export function AddServiceModal({ isOpen, onClose, onAdd, editingService, onUpdate }: AddServiceModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const isEditMode = !!editingService;

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    amount: string;
    currency: "PEN" | "USD" | "EUR";
    frequency: PaymentFrequency;
    nextPaymentDate: string;
    status: SubscriptionStatus;
    autoRenewal: boolean;
  }>({
    name: "",
    description: "",
    category: "housing",
    amount: "",
    currency: "PEN",
    frequency: "monthly",
    nextPaymentDate: "",
    status: "active",
    autoRenewal: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!isOpen) return;

    if (editingService) {
      
      setFormData((prev) => ({
        ...prev,
        name: editingService.name,
        description: editingService.description || "",
        category: editingService.category,
        amount: editingService.amount.value.toString(),
        currency: editingService.amount.currency,
        frequency: editingService.frequency,
        nextPaymentDate: editingService.nextPaymentDate.toISOString().split('T')[0] ?? "",
        status: editingService.status,
        autoRenewal: editingService.autoRenewal,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        description: "",
        category: "housing",
        amount: "",
        currency: "PEN",
        frequency: "monthly",
        nextPaymentDate: "",
        status: "active",
        autoRenewal: true,
      }));
    }
    setErrors({});
  }, [isOpen, editingService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = serviceModalSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const newService: Omit<ISubscription, "id"> = {
      name: result.data.name,
      description: result.data.description || undefined,
      category: result.data.category,
      amount: {
        value: parseFloat(result.data.amount),
        currency: result.data.currency,
      },
      frequency: result.data.frequency,
      nextPaymentDate: new Date(result.data.nextPaymentDate + "T12:00:00"),
      status: result.data.status,
      autoRenewal: result.data.autoRenewal,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode && editingService && onUpdate) {
        await onUpdate(editingService.id, newService);
      } else {
        await onAdd(newService);
      }
      setFormData({
        name: "",
        description: "",
        category: "housing",
        amount: "",
        currency: "PEN",
        frequency: "monthly",
        nextPaymentDate: "",
        status: "active",
        autoRenewal: true,
      });
      setErrors({});
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-20 md:pb-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md sm:max-w-2xl max-h-[80vh] md:max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
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

        <div className="overflow-y-auto flex-1 min-h-0">
        <form id="service-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 pb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {t("forms.category")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(({ key, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key })}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5",
                    formData.category === key
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className={cn(
                    "text-xs font-medium text-center leading-tight",
                    formData.category === key ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {t(`services.category${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4" />
              {t("forms.serviceName")}
            </Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("forms.serviceNamePlaceholder")}
              className={cn(errors['name'] && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors['name'] && <p className="text-red-500 text-sm mt-1">{errors['name']}</p>}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              {t("forms.description")} ({t("credentials.optional")})
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("forms.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" />
                {t("forms.amount")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {formData.currency === "PEN" ? "S/" : formData.currency === "USD" ? "$" : "€"}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={cn("pl-9", errors['amount'] && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
              {errors['amount'] && <p className="text-red-500 text-sm mt-1">{errors['amount']}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" />
                {t("forms.currency")}
              </Label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as "PEN" | "USD" | "EUR" })}
                  className="w-full h-10 appearance-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 pr-8 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
                >
                  <option value="PEN">PEN (S/)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4" />
              {t("forms.frequency")}
            </Label>
            <div className="relative">
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as PaymentFrequency })}
                className="w-full h-10 appearance-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 pr-8 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
              >
                <option value="monthly">{t("services.monthly")}</option>
                <option value="yearly">{t("services.yearly")}</option>
                <option value="weekly">{t("services.weekly")}</option>
                <option value="quarterly">{t("services.quarterly")}</option>
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              {t("forms.nextPaymentDate")}
            </Label>
            <DatePicker
              value={formData.nextPaymentDate ? new Date(formData.nextPaymentDate + "T12:00:00") : undefined}
              onChange={(date) => setFormData({ ...formData, nextPaymentDate: date ? date.toISOString().split('T')[0] ?? "" : "" })}
              placeholder={t("forms.selectDate")}
              className={cn(errors['nextPaymentDate'] && "border-red-500")}
            />
            {errors['nextPaymentDate'] && <p className="text-red-500 text-sm mt-1">{errors['nextPaymentDate']}</p>}
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
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
                  formData.autoRenewal ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
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

        </form>
        </div>

        <div className="shrink-0 p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            form="service-form"
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors font-medium shadow-sm"
          >
            {isSubmitting ? t("common.loading") : t("forms.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
