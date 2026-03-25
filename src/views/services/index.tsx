/**
 * ServicesView - Service & Subscriptions management component.
 * Extracted from page.tsx for better modularity and maintainability.
 * Now with full i18n support and proper light/dark mode styling.
 */

"use client";

import React, { useState } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { mockSubscriptions } from "@/shared/utils/mock";
import {
  Receipt,
  DollarSign,
  AlertCircle,
  Zap,
  Wifi,
  Home as HomeIcon,
  Sparkles,
  Plus,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { AddServiceModal } from "./modals/add-service-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ISubscription } from "@/shared/types/finance";
import { SortableServiceCard } from "./components/sortable-service-card";
import {
  calculateMonthlyTotal,
  getUpcomingServices,
  getDaysUntil,
  formatServiceCurrency,
  getFrequencyLabel,
  getStatusLabel,
  getCategoryLabel,
  createNewService,
  updateService,
} from "./utils/helpers";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  entertainment: Sparkles,
  productivity: DollarSign,
  health: TrendingUp,
  utilities: Zap,
  telecom: Wifi,
  housing: HomeIcon,
};

export function ServicesView(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = language === "es" ? "es-PE" : "en-US";

  const [services, setServices] = useState<ISubscription[]>(mockSubscriptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ISubscription | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: "",
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const handleAddService = (newServiceData: Omit<ISubscription, "id">) => {
    const newService = createNewService(newServiceData);
    setServices([...services, newService]);
  };

  const handleUpdateService = (id: string, updatedServiceData: Omit<ISubscription, "id">) => {
    setServices(
      services.map((service) =>
        service.id === id ? updateService(id, updatedServiceData) : service
      )
    );
  };

  const handleEditService = (service: ISubscription) => {
    setEditingService(service);
    setIsAddModalOpen(true);
  };

  const handleDeleteService = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setConfirmDelete({
        isOpen: true,
        id,
        name: service.name,
      });
    }
  };

  const confirmDeletion = () => {
    if (confirmDelete.id) {
      setServices(services.filter((service) => service.id !== confirmDelete.id));
    }
    setConfirmDelete({ isOpen: false, id: null, name: "" });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredServices =
    selectedCategories.length > 0
      ? services.filter((s) => selectedCategories.includes(s.category))
      : services;

  const allCategories = Array.from(new Set(services.map((s) => s.category)));
  const totalInUserCurrency = calculateMonthlyTotal(filteredServices, currency, true);
  
  const upcomingSubs = getUpcomingServices(services);

  const formatCurrency = (amount: { value: number; currency: string }): string =>
    formatServiceCurrency(amount, currency, locale);

  const getFreqLabel = (freq: string): string => getFrequencyLabel(freq, language);
  const getStatLabel = (status: string): string => getStatusLabel(status, language);

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

        <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-600/30 dark:to-teal-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-cyan-200/40 dark:border-white/5">
          <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
          <div className="relative">
            <p className="text-cyan-700 dark:text-cyan-300 text-xs md:text-sm font-semibold mb-1">
              {t("services.totalMonthlyCost")}
            </p>
            <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-cyan-900 dark:text-white tracking-tight">
              {currency === "PEN" ? "S/" : currency === "USD" ? "$" : "€"}{" "}
              {totalInUserCurrency.toLocaleString(locale, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-cyan-600 dark:text-cyan-400 text-xs md:text-sm mt-2 font-medium">
              {filteredServices.filter((s) => s.status === "active").length}{" "}
              {t("services.activeServices")}
            </p>
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
                  {upcomingSubs.length > 1
                    ? t("services.pendingPayments").split(" | ")[1]
                    : t("services.pendingPayments").split(" | ")[0]}{" "}
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

      {/* Filters and Actions Bar */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors flex items-center gap-2",
            showFilters || selectedCategories.length > 0
              ? "bg-cyan-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          <Filter className="w-3 h-3 md:w-4 md:h-4" />
          {t("transactions.filters")}
          {selectedCategories.length > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              {selectedCategories.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setEditingService(null);
            setIsAddModalOpen(true);
          }}
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          {t("services.addService")}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {t("transactions.filterByCategory")}
            </h3>
            {selectedCategories.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
              >
                {t("transactions.clearFilters")}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allCategories.map((category) => {
              const IconComponent = categoryIcons[category] || DollarSign;
              const isActive = selectedCategories.includes(category);
              const categoryCount = services.filter(s => s.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-all",
                    isActive
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={cn(
                      "w-4 h-4",
                      isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-600 dark:text-zinc-400"
                    )}>
                      {getCategoryLabel(category, t)}
                    </span>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    isActive
                      ? "bg-cyan-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                  )}>
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredServices.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <section>
            {filteredServices.length === 0 ? (
              <div className="card-surface rounded-2xl p-12 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  No hay servicios en esta categoría
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  Selecciona otra categoría o limpia los filtros para ver todos tus servicios
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((sub) => {
                  const daysUntil = getDaysUntil(sub.nextPaymentDate);
                  const isDueSoon = daysUntil <= 3;

                  return (
                    <SortableServiceCard
                      key={sub.id}
                      sub={sub}
                      daysUntil={daysUntil}
                      isDueSoon={isDueSoon}
                      locale={locale}
                      formatCurrency={formatCurrency}
                      getFrequencyLabel={getFreqLabel}
                      getStatusLabel={getStatLabel}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      t={t}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </SortableContext>
      </DndContext>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onAdd={handleAddService}
        onUpdate={handleUpdateService}
        editingService={editingService}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, name: "" })}
        onConfirm={confirmDeletion}
        title={language === "es" ? "Confirmar Eliminación" : "Confirm Deletion"}
        message={
          language === "es"
            ? `¿Estás seguro de que deseas eliminar el servicio "${confirmDelete.name}"? Esta acción no se puede deshacer.`
            : `Are you sure you want to delete the service "${confirmDelete.name}"? This action cannot be undone.`
        }
        confirmText={language === "es" ? "Eliminar" : "Delete"}
        cancelText={language === "es" ? "Cancelar" : "Cancel"}
        variant="danger"
      />
    </div>
  );
}
