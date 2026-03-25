/**
 * Transactions View Component
 * Manages income and expense tracking with filtering and statistics
 * Now with Zustand store integration and modular component architecture
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { useTransactionsStore } from "@/shared/stores/transactions-store";
import { useInitializeTransactions } from "@/shared/hooks/use-initialize-transactions";
import { getTranslation } from "@/shared/langs";
import { formatCurrency } from "@/shared/utils/currency";
import { LoadingState } from "@/shared/components/loading-state";
import { Receipt, Plus, Filter } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { TransactionStats } from "./components/transaction-stats";
import { TransactionCard } from "./components/transaction-card";
import { AddTransactionModal } from "./modals/add-transaction-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import type { ITransaction } from "@/shared/types/finance";
import {
  filterTransactionsByType,
  filterTransactionsByCategory,
  sortTransactionsByDate,
  incomeCategories,
  expenseCategories,
} from "./utils/helpers";

type FilterType = "all" | "income" | "expense";

export function TransactionsView(): React.JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoading, error } = useInitializeTransactions();

  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
  } = useTransactionsStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    id: string | null;
    description: string;
  }>({
    isOpen: false,
    id: null,
    description: "",
  });

  const totalIncome = useMemo(
    () => getTotalIncome(),
    [getTotalIncome]
  );
  const totalExpenses = useMemo(
    () => getTotalExpenses(),
    [getTotalExpenses]
  );
  const balance = useMemo(
    () => getBalance(),
    [getBalance]
  );

  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactionsByType(transactions, filterType);
    filtered = filterTransactionsByCategory(filtered, selectedCategories);
    return sortTransactionsByDate(filtered, "desc");
  }, [transactions, filterType, selectedCategories]);

  if (!mounted || isLoading) {
    return <LoadingState message={t("common.loading")} fullScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
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

  const handleAddTransaction = (newTransactionData: Omit<ITransaction, "id">) => {
    addTransaction(newTransactionData);
  };

  const handleUpdateTransaction = (id: string, updatedTransactionData: Omit<ITransaction, "id">) => {
    updateTransaction(id, updatedTransactionData);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    setConfirmDelete({ isOpen: false, id: null, description: "" });
  };

  const handleEditTransaction = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
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

  const currentFilterCategories = filterType === "income" 
    ? incomeCategories 
    : filterType === "expense" 
    ? expenseCategories 
    : [...incomeCategories, ...expenseCategories];

  const formatAmount = (value: number) =>
    formatCurrency(value, currency, language);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
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
      </header>

      <TransactionStats
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        formatAmount={formatAmount}
        incomeLabel={t("transactions.income")}
        expensesLabel={t("transactions.expenses")}
        balanceLabel={t("transactions.balance")}
        thisMonthLabel={t("transactions.thisMonth")}
      />

      {/* Filters and Actions Bar */}
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
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          {t("transactions.addTransaction")}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
          {/* Type Filters */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
              {t("transactions.filters")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filterType === "all"
                    ? "bg-cyan-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {t("transactions.all")}
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filterType === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {t("transactions.income")}
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filterType === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {t("transactions.expenses")}
              </button>
            </div>
          </div>

          {/* Category Filters */}
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
                  tr => tr.category === category.key
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
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        isActive
                          ? "bg-cyan-500 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">
            {t("transactions.recentTransactions")}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} {t("transactions.transactions")}
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
            <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              {t("transactions.noTransactions")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("transactions.addFirstTransaction")}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("transactions.addTransaction")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => handleEditTransaction(transaction)}
              />
            ))}
          </div>
        )}
      </section>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddTransaction}
        editingTransaction={editingTransaction}
        onUpdate={handleUpdateTransaction}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={t("transactions.deleteTransaction")}
        message={t("transactions.confirmDelete").replace("{description}", confirmDelete.description)}
        onConfirm={() => confirmDelete.id && handleDeleteTransaction(confirmDelete.id)}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, description: "" })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </div>
  );
}
