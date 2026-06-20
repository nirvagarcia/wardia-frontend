"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { formatCurrency, getLocale } from "@/shared/utils/currency";
import { Receipt, Plus, Filter, History, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { TransactionStats } from "./components/transaction-stats";
import { TransactionCard } from "./components/transaction-card";
import { TransactionsSkeleton } from "./components/transactions-skeleton";
import { AddTransactionModal } from "./modals/add-transaction-modal";
import { TransactionHistoryModal } from "./modals/transaction-history-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import {
  useTransactionsQuery,
  useAddTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/shared/hooks/use-transactions-query";
import type { ITransaction } from "@/shared/types/finance";
import {
  filterTransactionsByType,
  filterTransactionsByCategory,
  sortTransactionsByDate,
  incomeCategories,
  expenseCategories,
} from "./utils/helpers";

type FilterType = "all" | "income" | "expense";

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function TransactionsView(): React.JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = (key: string, vars?: Record<string, string | number>) => getTranslation(language, key, vars);

  const currentMonth = useMemo(() => getCurrentMonth(), []);

  useEffect(() => { setMounted(true); }, []);

  const { data: transactions = [], isLoading, isError } = useTransactionsQuery(currentMonth);
  const addMutation = useAddTransaction(currentMonth);
  const updateMutation = useUpdateTransaction(currentMonth);
  const deleteMutation = useDeleteTransaction(currentMonth);

  const isActionLoading =
    addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string | null;
    description: string;
  }>({ isOpen: false, id: null, description: "" });

  const totalIncome = useMemo(
    () => transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount.value, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () => transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount.value, 0),
    [transactions]
  );
  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactionsByType(transactions, filterType);
    filtered = filterTransactionsByCategory(filtered, selectedCategories);
    return sortTransactionsByDate(filtered, "desc");
  }, [transactions, filterType, selectedCategories]);

  if (!mounted || isLoading) return <TransactionsSkeleton />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">{t("common.errorLoading")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  const handleAddTransaction = async (data: Omit<ITransaction, "id">) => {
    await addMutation.mutateAsync(data);
    toast.success(t("transactions.addSuccess"));
    setIsAddModalOpen(false);
  };

  const handleUpdateTransaction = async (id: string, data: Omit<ITransaction, "id">) => {
    await updateMutation.mutateAsync({ id, data });
    toast.success(t("transactions.updateSuccess"));
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success(t("transactions.deleteSuccess"));
    } catch {
      toast.error(t("transactions.deleteError"));
    }
    setConfirmDelete({ isOpen: false, id: null, description: "" });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setFilterType("all");
    setSelectedCategories([]);
  };

  const hasActiveFilters = filterType !== "all" || selectedCategories.length > 0;

  const currentFilterCategories =
    filterType === "income"
      ? incomeCategories
      : filterType === "expense"
      ? expenseCategories
      : [...incomeCategories, ...expenseCategories];

  const formatAmount = (value: number) => formatCurrency(value, currency, language);

  const locale = getLocale(language);
  const now = new Date();
  const monthName = now.toLocaleDateString(locale, { month: "long" });
  const currentMonthYear =
    monthName.charAt(0).toUpperCase() + monthName.slice(1) + " " + now.getFullYear();

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
              <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
              {t("transactions.title")}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">
              {t("transactions.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0 mt-1"
          >
            <History className="w-4 h-4" />
            {t("transactions.history")}
          </button>
        </div>
      </header>

      <TransactionStats
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        formatAmount={formatAmount}
        incomeLabel={t("transactions.income")}
        expensesLabel={t("transactions.expenses")}
        balanceLabel={t("transactions.balance")}
        thisMonthLabel={currentMonthYear}
      />

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors flex items-center gap-2",
            showFilters || hasActiveFilters
              ? "bg-cyan-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          <Filter className="w-3 h-3 md:w-4 md:h-4" />
          {t("transactions.filters")}
          {hasActiveFilters && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              {(filterType !== "all" ? 1 : 0) + selectedCategories.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={isActionLoading}
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          {t("transactions.addTransaction")}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
              {t("transactions.filters")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([
                { type: "all"     as const, Icon: Layers,      label: t("transactions.all"),      activeBorder: "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",          activeIcon: "text-cyan-600 dark:text-cyan-400",     activeBadge: "bg-cyan-500 text-white",     activeText: "text-cyan-600 dark:text-cyan-400"     },
                { type: "income"  as const, Icon: TrendingUp,  label: t("transactions.income"),   activeBorder: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",  activeIcon: "text-emerald-600 dark:text-emerald-400", activeBadge: "bg-emerald-500 text-white", activeText: "text-emerald-600 dark:text-emerald-400" },
                { type: "expense" as const, Icon: TrendingDown, label: t("transactions.expenses"), activeBorder: "border-red-500 bg-red-50 dark:bg-red-950/30",             activeIcon: "text-red-600 dark:text-red-400",       activeBadge: "bg-red-500 text-white",       activeText: "text-red-600 dark:text-red-400"       },
              ]).map(({ type, Icon, label, activeBorder, activeIcon, activeBadge, activeText }) => {
                const isActive = filterType === type;
                const count = type === "all" ? transactions.length : transactions.filter((tr) => tr.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      "flex items-center justify-between gap-2 p-3 rounded-xl border-2 transition-all overflow-hidden",
                      isActive ? activeBorder : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? activeIcon : "text-zinc-600 dark:text-zinc-400")} />
                      <span className={cn("text-sm font-medium truncate", isActive ? activeText : "text-zinc-600 dark:text-zinc-400")}>
                        {label}
                      </span>
                    </div>
                    <span className={cn(
                      "flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center",
                      isActive ? activeBadge : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    )}>
                      {count > 9 ? "+9" : count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {t("transactions.filterByCategory")}
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
                >
                  {t("transactions.clearFilters")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentFilterCategories.map((category) => {
                const isActive = selectedCategories.includes(category.key);
                const categoryCount = transactions.filter(
                  (tr) => tr.category === category.key
                ).length;
                return (
                  <button
                    key={category.key}
                    onClick={() => toggleCategory(category.key)}
                    className={cn(
                      "flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-all",
                      isActive
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-zinc-600 dark:text-zinc-400"
                        )}
                      >
                        {t(category.labelKey)}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold px-1.5 py-0.5 rounded-full",
                        isActive
                          ? "bg-cyan-500 text-white"
                          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      {categoryCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <Receipt className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">{t("transactions.noTransactions")}</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEditTransaction}
              onDelete={(id) => {
                const found = transactions.find((t) => t.id === id);
                setConfirmDelete({
                  isOpen: true,
                  id,
                  description: found?.description ?? "",
                });
              }}
            />
          ))
        )}
      </section>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddTransaction}
        editingTransaction={editingTransaction}
        onUpdate={handleUpdateTransaction}
      />

      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, description: "" })}
        onConfirm={handleConfirmDelete}
        title={t("common.confirmDelete")}
        message={t("common.confirmDeleteMessage", { name: confirmDelete.description })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </div>
  );
}
