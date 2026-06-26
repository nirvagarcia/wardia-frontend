"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { formatCurrency } from "@/shared/utils/currency";
import {
  useTransactionsQuery, useAddTransaction, useUpdateTransaction, useDeleteTransaction,
} from "@/shared/hooks/use-transactions-query";
import { useCurrentPeriod } from "@/shared/hooks/use-periods-query";
import { useServicesQuery } from "@/shared/hooks/use-services-query";
import { getServicesInPeriod } from "@/shared/utils/service-payments";
import type { ITransaction } from "@/shared/types/finance";
import {
  filterTransactionsByType, filterTransactionsByCategory, sortTransactionsByDate,
  incomeCategories, expenseCategories,
} from "../utils/helpers";

type FilterType = "all" | "income" | "expense";

export function useTransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string, vars?: Record<string, string | number>) =>
    getTranslation(language, key, vars), [language]);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStartPeriodModalOpen, setIsStartPeriodModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; description: string }>({
    isOpen: false, id: null, description: "",
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const periodQuery = useCurrentPeriod();
  const apiParams = useMemo(() => {
    if (!periodQuery.data) return undefined;
    const start = periodQuery.data.startDate.split("T")[0]!;
    return periodQuery.data.endDate
      ? { startDate: start, endDate: periodQuery.data.endDate.split("T")[0]! }
      : { startDate: start };
  }, [periodQuery.data]);

  const { data: transactions = [], isLoading, isError } = useTransactionsQuery(apiParams);
  const { data: servicesData } = useServicesQuery();
  const services = useMemo(() => servicesData?.services ?? [], [servicesData]);

  const addMutation = useAddTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const isActionLoading = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const servicePayments = useMemo(() => {
    if (!periodQuery.data) return [];
    const periodStart = new Date(periodQuery.data.startDate);
    const periodEnd = periodQuery.data.endDate ? new Date(periodQuery.data.endDate) : new Date();
    return getServicesInPeriod(services.filter((s) => s.status === "active"), periodStart, periodEnd);
  }, [services, periodQuery.data]);

  const allTransactions = useMemo(() => [...transactions, ...servicePayments], [transactions, servicePayments]);

  const totalIncome = useMemo(() => allTransactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount.value, 0), [allTransactions]);
  const totalExpenses = useMemo(() => allTransactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount.value, 0), [allTransactions]);
  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactionsByType(allTransactions, filterType);
    filtered = filterTransactionsByCategory(filtered, selectedCategories);
    return sortTransactionsByDate(filtered, "desc");
  }, [allTransactions, filterType, selectedCategories]);

  const periodStartDateLabel = useMemo(() => {
    if (!periodQuery.data) return "";
    const date = new Date(periodQuery.data.startDate);
    const locale = language === "es" ? "es-PE" : "en-US";
    const formatted = date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
    return getTranslation(language, "transactions.periodStarted", { date: formatted });
  }, [periodQuery.data, language]);

  const hasActiveFilters = filterType !== "all" || selectedCategories.length > 0;
  const currentFilterCategories = filterType === "income" ? incomeCategories
    : filterType === "expense" ? expenseCategories
    : [...incomeCategories, ...expenseCategories];
  const formatAmount = useCallback((value: number) => formatCurrency(value, currency, language), [currency, language]);

  const handleAddTransaction = useCallback(async (data: Omit<ITransaction, "id">) => {
    await addMutation.mutateAsync(data);
    toast.success(t("transactions.addSuccess"));
    setIsAddModalOpen(false);
  }, [addMutation, t]);

  const handleUpdateTransaction = useCallback(async (id: string, data: Omit<ITransaction, "id">) => {
    await updateMutation.mutateAsync({ id, data });
    toast.success(t("transactions.updateSuccess"));
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  }, [updateMutation, t]);

  const handleEditTransaction = useCallback((transaction: ITransaction) => {
    setEditingTransaction(transaction); setIsAddModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => { setIsAddModalOpen(false); setEditingTransaction(null); }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete.id) return;
    try { await deleteMutation.mutateAsync(confirmDelete.id); toast.success(t("transactions.deleteSuccess")); }
    catch { toast.error(t("transactions.deleteError")); }
    setConfirmDelete({ isOpen: false, id: null, description: "" });
  }, [confirmDelete, deleteMutation, t]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
  }, []);
  const clearFilters = useCallback(() => { setFilterType("all"); setSelectedCategories([]); }, []);

  return {
    mounted, isLoading: !mounted || isLoading || periodQuery.isLoading, isError,
    t, language, currency,
    transactions, filteredTransactions, allTransactions,
    totalIncome, totalExpenses, balance, formatAmount,
    filterType, setFilterType, selectedCategories, showFilters, setShowFilters,
    isMenuOpen, setIsMenuOpen, isAddModalOpen, setIsAddModalOpen,
    isStartPeriodModalOpen, setIsStartPeriodModalOpen,
    editingTransaction, confirmDelete, setConfirmDelete,
    isActionLoading, hasActiveFilters, currentFilterCategories, periodStartDateLabel,
    periodLabel: periodQuery.data?.label ?? "",
    router, menuRef,
    handleAddTransaction, handleUpdateTransaction, handleEditTransaction, handleCloseModal,
    handleConfirmDelete, toggleCategory, clearFilters,
  };
}
