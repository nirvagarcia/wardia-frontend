"use client";

/**
 * Services & Subscriptions Page - Manage all recurring payments and services.
 * Now with full i18n support and proper light/dark mode styling.
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { mockSubscriptions } from "@/lib/mock-data";
import { Receipt, Calendar, DollarSign, TrendingUp, AlertCircle, Zap, Wifi, Home as HomeIcon, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddServiceModal } from "@/components/modals/add-service-modal";
import type { ISubscription } from "@/types/finance";

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "entertainment": Sparkles,
  "productivity": DollarSign,
  "health": TrendingUp,
  "utilities": Zap,
  "telecom": Wifi,
  "housing": HomeIcon,
};

export default function ServicesPage(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = language === "es" ? "es-PE" : "en-US";

  // Local state for services
  const [services, setServices] = useState<ISubscription[]>(mockSubscriptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddService = (newService: Omit<ISubscription, "id">) => {
    const serviceWithId: ISubscription = {
      ...newService,
      id: `service-${Date.now()}`,
    };
    setServices([...services, serviceWithId]);
  };

  // Translate category names
  const getCategoryLabel = (categoryKey: string): string => {
    const map: Record<string, string> = {
      entertainment: t("services.categoryEntertainment"),
      productivity: t("services.categoryProductivity"),
      health: t("services.categoryHealth"),
      utilities: t("services.categoryUtilities"),
      telecom: t("services.categoryTelecom"),
      housing: t("services.categoryHousing"),
    };
    return map[categoryKey] || categoryKey;
  };

  const formatCurrency = (amount: { value: number; currency: string }): string => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount.value);
  };

  // Calculate total monthly cost (convert USD to PEN for aggregation)
  const totalMonthlyInPEN = services
    .filter((sub) => sub.frequency === "monthly" && sub.status === "active")
    .reduce((sum, sub) => {
      const valueInPEN = sub.amount.currency === "USD" ? sub.amount.value * 3.75 : sub.amount.value;
      return sum + valueInPEN;
    }, 0);

  // Get upcoming subscriptions (within next 7 days)
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingSubs = services.filter(
    (sub) => sub.nextPaymentDate >= now && sub.nextPaymentDate <= sevenDaysFromNow
  );

  // Group subscriptions by category
  const categorizedSubs = services.reduce((acc, sub) => {
    if (!acc[sub.category]) {
      acc[sub.category] = [];
    }
    acc[sub.category].push(sub);
    return acc;
  }, {} as Record<string, typeof services>);

  const getDaysUntil = (date: Date): number => {
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getFrequencyLabel = (freq: string): string => {
    const map: Record<string, { es: string; en: string }> = {
      monthly: { es: "Mensual", en: "Monthly" },
      yearly: { es: "Anual", en: "Yearly" },
      weekly: { es: "Semanal", en: "Weekly" },
      quarterly: { es: "Trimestral", en: "Quarterly" },
    };
    return map[freq]?.[language] || freq;
  };

  const getStatusLabel = (status: string): string => {
    const map: Record<string, { es: string; en: string }> = {
      active: { es: "Activo", en: "Active" },
      cancelled: { es: "Cancelado", en: "Cancelled" },
      paused: { es: "Pausado", en: "Paused" },
    };
    return map[status]?.[language] || status;
  };

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24 bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Receipt className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              {t("services.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t("services.subtitle")}</p>
          </div>
          
          {/* Add Service Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Monthly Cost Summary */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium">{t("services.totalMonthlyCost")}</p>
              <h2 className="text-4xl font-bold text-white mt-2">
                {currency === "PEN" ? "S/" : currency === "USD" ? "$" : "€"} {totalMonthlyInPEN.toLocaleString(locale, { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-sm">
            {services.filter((s) => s.status === "active").length} {t("services.activeServices")}
          </p>
        </div>

        {/* Upcoming Payments Alert */}
        {upcomingSubs.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  {upcomingSubs.length} {upcomingSubs.length > 1 ? t("services.pendingPayments").split(" | ")[1] : t("services.pendingPayments").split(" | ")[0]} {t("services.thisWeek")}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                  {upcomingSubs.map((sub) => sub.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Services by Category */}
      <section className="space-y-6">
        {Object.entries(categorizedSubs).map(([category, subs]) => {
          const IconComponent = categoryIcons[category] || DollarSign;
          
          return (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300 flex items-center gap-2">
                <IconComponent className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                {getCategoryLabel(category)}
              </h2>

              <div className="space-y-2">
                {subs.map((sub) => {
                  const daysUntil = getDaysUntil(sub.nextPaymentDate);
                  const isDueSoon = daysUntil <= 3;

                  return (
                    <div
                      key={sub.id}
                      className={cn(
                        "bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border rounded-xl p-4 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800/50",
                        isDueSoon ? "border-amber-500/50" : "border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Subscription Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
                            )}>
                              <DollarSign className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-zinc-900 dark:text-white">{sub.name}</h3>
                              {sub.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{sub.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div className="flex items-center gap-4 mt-3 ml-13 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {sub.nextPaymentDate.toLocaleDateString(locale, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            {isDueSoon && (
                              <span className={cn("font-medium", language === "es" ? "text-amber-500 dark:text-amber-400" : "text-amber-500 dark:text-amber-400")}>
                                {daysUntil === 0
                                  ? t("dashboard.dueToday")
                                  : daysUntil === 1
                                  ? t("dashboard.dueTomorrow")
                                  : t("dashboard.inDays").replace("{days}", daysUntil.toString())}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full capitalize">
                              {getFrequencyLabel(sub.frequency)}
                            </span>
                            {sub.autoRenewal && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                                {t("services.autoRenewal")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(sub.amount)}</p>
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              sub.status === "active"
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                            )}
                          >
                            {getStatusLabel(sub.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{t("services.noServices")}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("services.addFirstService")}</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
          >
            {t("services.addService")}
          </button>
        </div>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddService}
      />
    </div>
  );
}