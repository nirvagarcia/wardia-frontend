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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Textarea } from "@/shared/components/ui/textarea";
import type { ISubscription, PaymentFrequency, SubscriptionStatus } from "@/shared/types/finance";

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
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-3xl">{icon}</span>
                  <span className={cn(
                    "text-sm font-medium",
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
              className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" />
                {t("forms.amount")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currency === "PEN" ? "S/" : currency === "USD" ? "$" : "€"}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={cn("pl-9", errors.amount && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4" />
                {t("forms.frequency")}
              </Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value as PaymentFrequency })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t("services.monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("services.yearly")}</SelectItem>
                  <SelectItem value="weekly">{t("services.weekly")}</SelectItem>
                  <SelectItem value="quarterly">{t("services.quarterly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              {t("forms.nextPaymentDate")}
            </Label>
            <DatePicker
              value={formData.nextPaymentDate ? new Date(formData.nextPaymentDate) : undefined}
              onChange={(date) => setFormData({ ...formData, nextPaymentDate: date ? date.toISOString().split('T')[0] : "" })}
              placeholder={t("forms.selectDate")}
              className={cn(errors.nextPaymentDate && "border-red-500")}
            />
            {errors.nextPaymentDate && <p className="text-red-500 text-sm mt-1">{errors.nextPaymentDate}</p>}
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
              className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-colors font-medium shadow-sm"
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
