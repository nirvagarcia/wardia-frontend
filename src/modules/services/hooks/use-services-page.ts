"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { getLocale, formatCurrency } from "@/shared/utils/currency";
import {
  useServicesQuery, useAddService, useUpdateService, useDeleteService,
  computeMonthlyTotal, computeUpcomingPayments,
} from "@/shared/hooks/use-services-query";
import type { ISubscription } from "@/shared/types/finance";
import type { IAmount } from "@/shared/types";
import { getFrequencyLabel, getStatusLabel, getCategoryLabel } from "../utils/helpers";

export { getCategoryLabel };

export function useServicesPage() {
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);
  const locale = getLocale(language);

  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<ISubscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ISubscription | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; name: string }>({
    isOpen: false, id: null, name: "",
  });

  const { data, isLoading, isError } = useServicesQuery();
  const addMutation = useAddService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (data?.services) setServices(data.services); }, [data]);

  const totalInUserCurrency = useMemo(() => computeMonthlyTotal(services), [services]);
  const upcomingSubs = useMemo(() => computeUpcomingPayments(services, 7), [services]);
  const isActionLoading = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const filteredServices = selectedCategories.length > 0
    ? services.filter((s) => selectedCategories.includes(s.category))
    : services;
  const allCategories = useMemo(() => Array.from(new Set(services.map((s) => s.category))), [services]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
  }, []);
  const clearFilters = useCallback(() => { setSelectedCategories([]); }, []);

  const handleAddService = useCallback(async (data: Omit<ISubscription, "id">) => {
    try { await addMutation.mutateAsync(data); toast.success(t("services.addSuccess")); }
    catch { toast.error(t("services.addError")); }
  }, [addMutation, t]);

  const handleUpdateService = useCallback(async (id: string, data: Omit<ISubscription, "id">) => {
    try { await updateMutation.mutateAsync({ id, data }); toast.success(t("services.updateSuccess")); }
    catch { toast.error(t("services.updateError")); }
  }, [updateMutation, t]);

  const handleEditService = useCallback((service: ISubscription) => {
    setEditingService(service); setIsAddModalOpen(true);
  }, []);

  const handleDeleteService = useCallback((id: string) => {
    const service = services.find((s) => s.id === id);
    if (service) setConfirmDelete({ isOpen: true, id, name: service.name });
  }, [services]);

  const confirmDeletion = useCallback(async () => {
    if (confirmDelete.id) {
      try { await deleteMutation.mutateAsync(confirmDelete.id); toast.success(t("services.deleteSuccess")); }
      catch { toast.error(t("services.deleteError")); }
    }
    setConfirmDelete({ isOpen: false, id: null, name: "" });
  }, [confirmDelete, deleteMutation, t]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((item) => item.id === active.id);
      const newIndex = services.findIndex((item) => item.id === over.id);
      setServices(arrayMove(services, oldIndex, newIndex));
    }
  }, [services]);

  const getFreqLabel = useCallback((freq: string) => getFrequencyLabel(freq, language), [language]);
  const getStatLabel = useCallback((status: string) => getStatusLabel(status, language), [language]);
  const formatCurrencyAmount = useCallback((amount: { value: number; currency: string }) =>
    formatCurrency(amount as IAmount, language), [language]);

  return {
    mounted, isLoading, isError, t, locale, currency,
    services, filteredServices, allCategories,
    totalInUserCurrency, upcomingSubs, isActionLoading,
    isAddModalOpen, setIsAddModalOpen,
    editingService, setEditingService,
    selectedCategories, showFilters, setShowFilters,
    confirmDelete, setConfirmDelete,
    sensors,
    toggleCategory, clearFilters,
    handleAddService, handleUpdateService, handleEditService, handleDeleteService, confirmDeletion, handleDragEnd,
    getFreqLabel, getStatLabel, formatCurrencyAmount,
  };
}
