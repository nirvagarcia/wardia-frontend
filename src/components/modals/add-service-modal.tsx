"use client";

/**
 * Add Service Modal Component
 * Full-featured form for adding new services/subscriptions
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { X, Calendar, DollarSign, Tag, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ISubscription } from "@/types/finance";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: Omit<ISubscription, "id">) => void;
}

const categories = [
  { key: "entertainment", icon: "🎬" },
  { key: "productivity", icon: "💼" },
  { key: "health", icon: "💪" },
  { key: "utilities", icon: "⚡" },
  { key: "telecom", icon: "📡" },
  { key: "housing", icon: "🏠" },
];

export function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: "entertainment" | "productivity" | "health" | "utilities" | "telecom" | "housing";
    amount: string;
    frequency: "monthly" | "yearly" | "weekly" | "quarterly";
    nextPaymentDate: string;
    status: "active";
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = language === "es" ? "Nombre requerido" : "Name required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = language === "es" ? "Monto inválido" : "Invalid amount";
    }
    if (!formData.nextPaymentDate) {
      newErrors.nextPaymentDate = language === "es" ? "Fecha requerida" : "Date required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create service object
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

    onAdd(newService);
    
    // Reset form
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
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {language === "es" ? "Agregar Servicio" : "Add Service"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-3">
              {language === "es" ? "Categoría" : "Category"}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(({ key, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key as "entertainment" | "productivity" | "health" | "utilities" | "telecom" | "housing" })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    formData.category === key
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-3xl">{icon}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    formData.category === key ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {t(`services.category${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              {language === "es" ? "Nombre del Servicio" : "Service Name"}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={language === "es" ? "Ej: Netflix Premium" : "e.g. Netflix Premium"}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.name
                  ? "border-red-500 dark:border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500"
              )}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              {language === "es" ? "Descripción (Opcional)" : "Description (Optional)"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={language === "es" ? "Detalles adicionales..." : "Additional details..."}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500"
            />
          </div>

          {/* Amount & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                {language === "es" ? "Monto" : "Amount"}
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
                      : "border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                  )}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                {language === "es" ? "Frecuencia" : "Frequency"}
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as "monthly" | "yearly" | "weekly" | "quarterly" })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500"
              >
                <option value="monthly">{t("services.monthly")}</option>
                <option value="yearly">{t("services.yearly")}</option>
                <option value="weekly">{t("services.weekly")}</option>
                <option value="quarterly">{t("services.quarterly")}</option>
              </select>
            </div>
          </div>

          {/* Next Payment Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {language === "es" ? "Próximo Pago" : "Next Payment"}
            </label>
            <input
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.nextPaymentDate
                  ? "border-red-500 dark:border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500"
              )}
            />
            {errors.nextPaymentDate && <p className="text-red-500 text-sm mt-1">{errors.nextPaymentDate}</p>}
          </div>

          {/* Auto-renewal & Status */}
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {language === "es" ? "Auto-renovación" : "Auto-renewal"}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {language === "es" ? "Se renueva automáticamente" : "Renews automatically"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, autoRenewal: !formData.autoRenewal })}
                className={cn(
                  "relative w-12 h-7 rounded-full transition-colors",
                  formData.autoRenewal ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
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

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              {language === "es" ? "Cancelar" : "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium"
            >
              {language === "es" ? "Agregar Servicio" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
