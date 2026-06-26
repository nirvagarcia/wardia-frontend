"use client";

import {
  Receipt, DollarSign, AlertCircle, Zap, Wifi, Home as HomeIcon,
  Sparkles, Plus, TrendingUp, Filter, Layers,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AddServiceModal } from "./components/modals/add-service-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { SortableServiceCard } from "./components/sortable-service-card";
import { ServicesSkeleton } from "./components/services-skeleton";
import { getCategoryLabel } from "./utils/helpers";
import { useServicesPage } from "./hooks/use-services-page";
import { getDaysUntil } from "@/shared/utils/date";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  entertainment: Sparkles, productivity: DollarSign, health: TrendingUp,
  utilities: Zap, telecom: Wifi, housing: HomeIcon,
};

export default function ServicesPage() {
  const {
    mounted, isLoading, isError, t, locale, currency,
    filteredServices, allCategories, services,
    totalInUserCurrency, upcomingSubs, isActionLoading,
    isAddModalOpen, setIsAddModalOpen,
    editingService, setEditingService,
    selectedCategories, showFilters, setShowFilters,
    confirmDelete, setConfirmDelete,
    sensors,
    toggleCategory, clearFilters,
    handleAddService, handleUpdateService, handleEditService, handleDeleteService, confirmDeletion, handleDragEnd,
    getFreqLabel, getStatLabel, formatCurrencyAmount,
  } = useServicesPage();

  if (!mounted || isLoading) return <ServicesSkeleton />;

  if (isError) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-500 dark:text-red-400">{t("common.error")}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
          {t("common.back")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
            <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
              <Receipt className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
            </div>
            {t("services.title")}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{t("services.subtitle")}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 p-4 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-cyan-100/80 text-xs font-medium mb-0.5">{t("services.totalMonthlyCost")}</p>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currency === "PEN" ? "S/" : currency === "USD" ? "$" : "€"}{" "}
                {totalInUserCurrency.toLocaleString(locale, { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-cyan-200/70 text-xs mt-0.5">
                {filteredServices.filter((s) => s.status === "active").length} {t("services.activeServices")}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl ring-1 ring-white/20 flex-shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {upcomingSubs.length > 0 && (
          <div className="card-surface rounded-xl p-4 ring-1 ring-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="bg-teal-500/10 p-2 rounded-lg ring-1 ring-teal-500/10 flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <p className="font-semibold text-teal-600 dark:text-teal-400 text-sm">
                  {upcomingSubs.length}{" "}
                  {upcomingSubs.length > 1 ? t("services.pendingPayments").split(" | ")[1] : t("services.pendingPayments").split(" | ")[0]}{" "}
                  {t("services.thisWeek")}
                </p>
                <p className="text-xs text-teal-700/80 dark:text-teal-300/60 mt-1">
                  {upcomingSubs.map((sub) => sub.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex gap-2 justify-end">
        <button onClick={() => setShowFilters(!showFilters)}
          className={cn("px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors flex items-center gap-2",
            showFilters || selectedCategories.length > 0 ? "bg-cyan-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700")}>
          <Filter className="w-3 h-3 md:w-4 md:h-4" />
          {t("transactions.filters")}
          {selectedCategories.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{selectedCategories.length}</span>}
        </button>
        <button onClick={() => { setEditingService(null); setIsAddModalOpen(true); }}
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          {t("services.addService")}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{t("transactions.filterByCategory")}</h3>
            {selectedCategories.length > 0 && (
              <button onClick={clearFilters} className="text-sm text-cyan-500 hover:text-cyan-600 font-medium">{t("transactions.clearFilters")}</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allCategories.map((category) => {
              const IconComponent = categoryIcons[category] || DollarSign;
              const isActive = selectedCategories.includes(category);
              const categoryCount = services.filter((s) => s.category === category).length;
              return (
                <button key={category} onClick={() => toggleCategory(category)}
                  className={cn("flex items-center justify-between gap-2 p-3 rounded-xl border-2 transition-all overflow-hidden",
                    isActive ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600")}>
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComponent className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400")} />
                    <span className={cn("text-sm font-medium truncate", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400")}>
                      {getCategoryLabel(category, t)}
                    </span>
                  </div>
                  <span className={cn("flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center",
                    isActive ? "bg-cyan-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400")}>
                    {categoryCount > 9 ? "+9" : categoryCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredServices.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <section>
            {isActionLoading ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card-surface rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="card-surface rounded-2xl p-12 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("services.noServicesInCategory")}</h3>
                <p className="text-sm text-zinc-500">{t("services.noServicesInCategoryDesc")}</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((sub) => {
                  const daysUntil = getDaysUntil(sub.nextPaymentDate);
                  return (
                    <SortableServiceCard key={sub.id} sub={sub} daysUntil={daysUntil} isDueSoon={daysUntil <= 3}
                      locale={locale} formatCurrency={formatCurrencyAmount}
                      getFrequencyLabel={getFreqLabel} getStatusLabel={getStatLabel}
                      onEdit={handleEditService} onDelete={handleDeleteService} t={t}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </SortableContext>
      </DndContext>

      <AddServiceModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingService(null); }}
        onAdd={handleAddService} onUpdate={handleUpdateService} editingService={editingService} />

      <ConfirmModal isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, name: "" })}
        onConfirm={confirmDeletion}
        title={t("common.confirmDeletion")} message={t("services.confirmDelete").replace("{name}", confirmDelete.name)}
        confirmText={t("common.delete")} cancelText={t("common.cancel")} variant="danger" />
    </div>
  );
}
