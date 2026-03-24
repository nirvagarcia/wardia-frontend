"use client";

/**
 * Services & Subscriptions Page - Manage all recurring payments and services.
 * Now with full i18n support and proper light/dark mode styling.
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { mockSubscriptions } from "@/lib/mock-data";
import { Receipt, Calendar, DollarSign, TrendingUp, AlertCircle, Zap, Wifi, Home as HomeIcon, Sparkles, Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddServiceModal } from "@/components/modals/add-service-modal";
import { ConfirmModal } from "@/components/modals/confirm-modal";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ISubscription } from "@/types/finance";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "entertainment": Sparkles,
  "productivity": DollarSign,
  "health": TrendingUp,
  "utilities": Zap,
  "telecom": Wifi,
  "housing": HomeIcon,
};

interface SortableServiceCardProps {
  sub: ISubscription;
  daysUntil: number;
  isDueSoon: boolean;
  language: string;
  locale: string;
  formatCurrency: (amount: { value: number; currency: string }) => string;
  getFrequencyLabel: (freq: string) => string;
  getStatusLabel: (status: string) => string;
  onEdit: (service: ISubscription) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

function SortableServiceCard(props: SortableServiceCardProps) {
  const { sub, isDueSoon } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border rounded-xl p-4 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800/50 cursor-grab active:cursor-grabbing",
        isDueSoon ? "border-amber-500/50" : "border-zinc-200 dark:border-zinc-800",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <ServiceCardContent {...props} />
    </div>
  );
}

function ServiceCardContent(props: SortableServiceCardProps) {
  const { sub, daysUntil, isDueSoon, language, locale, formatCurrency, getFrequencyLabel, getStatusLabel, onEdit, onDelete, t } = props;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
          )}>
            <DollarSign className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{sub.name}</h3>
            {sub.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{sub.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(sub)}
            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors group"
          >
            <Edit2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500" />
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
          >
            <Trash2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {sub.nextPaymentDate.toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        
        {isDueSoon && (
          <span className="font-medium text-amber-500 dark:text-amber-400 whitespace-nowrap">
            {daysUntil === 0
              ? t("dashboard.dueToday")
              : daysUntil === 1
              ? t("dashboard.dueTomorrow")
              : t("dashboard.inDays").replace("{days}", daysUntil.toString())}
          </span>
        )}
        
        <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full capitalize whitespace-nowrap">
          {getFrequencyLabel(sub.frequency)}
        </span>
        
        {sub.autoRenewal && (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full whitespace-nowrap">
            {t("services.autoRenewal")}
          </span>
        )}
        
        <span
          className={cn(
            "px-2 py-0.5 rounded-full whitespace-nowrap",
            sub.status === "active"
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-gray-500/20 text-gray-600 dark:text-gray-400"
          )}
        >
          {getStatusLabel(sub.status)}
        </span>
      </div>

      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatCurrency(sub.amount)}</p>
      </div>
    </div>
  );
}

export default function ServicesPage(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = language === "es" ? "es-PE" : "en-US";

  const [services, setServices] = useState<ISubscription[]>(mockSubscriptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ISubscription | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: "",
  });

  const handleAddService = (newService: Omit<ISubscription, "id">) => {
    const serviceWithId: ISubscription = {
      ...newService,
      id: `service-${Date.now()}`,
    };
    setServices([...services, serviceWithId]);
  };

  const handleUpdateService = (id: string, updatedService: Omit<ISubscription, "id">) => {
    setServices(services.map(service => 
      service.id === id 
        ? { ...updatedService, id }
        : service
    ));
  };

  const handleEditService = (service: ISubscription) => {
    setEditingService(service);
    setIsAddModalOpen(true);
  };

  const handleDeleteService = (id: string) => {
    const service = services.find(s => s.id === id);
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
      setServices(services.filter(service => service.id !== confirmDelete.id));
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

  const totalMonthlyInPEN = services
    .filter((sub) => sub.frequency === "monthly" && sub.status === "active")
    .reduce((sum, sub) => {
      const valueInPEN = sub.amount.currency === "USD" ? sub.amount.value * 3.75 : sub.amount.value;
      return sum + valueInPEN;
    }, 0);

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingSubs = services.filter(
    (sub) => sub.nextPaymentDate >= now && sub.nextPaymentDate <= sevenDaysFromNow
  );

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
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Receipt className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              {t("services.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t("services.subtitle")}</p>
          </div>
          
          <button
            onClick={() => {
              setEditingService(null);
              setIsAddModalOpen(true);
            }}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={services.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <section className="space-y-6">
            {Object.entries(categorizedSubs).map(([category, subs]) => {
              const IconComponent = categoryIcons[category] || DollarSign;
              
              return (
                <div key={category} className="space-y-3">
                  <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300 flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    {getCategoryLabel(category)}
                  </h2>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {subs.map((sub) => {
                      const daysUntil = getDaysUntil(sub.nextPaymentDate);
                      const isDueSoon = daysUntil <= 3;

                      return (
                        <SortableServiceCard
                          key={sub.id}
                          sub={sub}
                          daysUntil={daysUntil}
                          isDueSoon={isDueSoon}
                          language={language}
                          locale={locale}
                          formatCurrency={formatCurrency}
                          getFrequencyLabel={getFrequencyLabel}
                          getStatusLabel={getStatusLabel}
                          onEdit={handleEditService}
                          onDelete={handleDeleteService}
                          t={t}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </SortableContext>
      </DndContext>

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

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onAdd={handleAddService}
        editingService={editingService}
        onUpdate={handleUpdateService}
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