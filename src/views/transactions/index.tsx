/**
 * Transactions View Component
 * Manages income and expense tracking with filtering and statistics
 */

"use client";

import React, { useState, useMemo } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { mockTransactions } from "@/shared/utils/mock";
import {
  Receipt,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { TransactionCard } from "./components/transaction-card";
import { AddTransactionModal } from "./modals/add-transaction-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import type { ITransaction } from "@/shared/types/finance";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  filterTransactionsByType,
  filterTransactionsByCategory,
  sortTransactionsByDate,
  formatTransactionAmount,
  createNewTransaction,
  updateTransaction,
  incomeCategories,
  expenseCategories,
} from "./utils/helpers";

type FilterType = "all" | "income" | "expense";

export function TransactionsView(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const locale = language === "es" ? "es-PE" : "en-US";

  const [transactions, setTransactions] = useState<ITransaction[]>(mockTransactions);
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

  // Calculate statistics
  const totalIncome = useMemo(
    () => calculateTotalIncome(transactions, currency),
    [transactions, currency]
  );
  const totalExpenses = useMemo(
    () => calculateTotalExpenses(transactions, currency),
    [transactions, currency]
  );
  const balance = useMemo(
    () => calculateBalance(transactions, currency),
    [transactions, currency]
  );

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactionsByType(transactions, filterType);
    filtered = filterTransactionsByCategory(filtered, selectedCategories);
    return sortTransactionsByDate(filtered, "desc");
  }, [transactions, filterType, selectedCategories]);

  const handleAddTransaction = (newTransactionData: Omit<ITransaction, "id">) => {
    const newTransaction = createNewTransaction(newTransactionData);
    setTransactions([newTransaction, ...transactions]);
  };

  const handleUpdateTransaction = (id: string, updatedTransactionData: Omit<ITransaction, "id">) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? updateTransaction(t, updatedTransactionData) : t
      )
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
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
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{t("transactions.subtitle")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-600/30 dark:to-green-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-emerald-200/40 dark:border-white/5">
          <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold">{t("transactions.income")}</span>
            </div>
            <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-emerald-900 dark:text-white tracking-tight">
              {formatTransactionAmount({ value: totalIncome, currency }, locale)}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs md:text-sm mt-2 font-medium">{t("transactions.thisMonth")}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-600/30 dark:to-rose-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-red-200/40 dark:border-white/5">
          <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-500/10 p-2 rounded-lg">
                <ArrowDownCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-red-700 dark:text-red-300 text-xs md:text-sm font-semibold">{t("transactions.expenses")}</span>
            </div>
            <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-red-900 dark:text-white tracking-tight">
              {formatTransactionAmount({ value: totalExpenses, currency }, locale)}
            </p>
            <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 font-medium">{t("transactions.thisMonth")}</p>
          </div>
        </div>

        <div className={cn(
          "relative overflow-hidden rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border",
          balance >= 0 
            ? "bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-600/30 dark:to-teal-600/30 border-cyan-200/40 dark:border-white/5" 
            : "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-600/30 dark:to-orange-600/30 border-amber-200/40 dark:border-white/5"
        )}>
          <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                balance >= 0 ? "bg-cyan-500/10" : "bg-amber-500/10"
              )}>
                <TrendingUp className={cn(
                  "w-5 h-5 md:w-6 md:h-6",
                  balance >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-amber-600 dark:text-amber-400"
                )} />
              </div>
              <span className={cn(
                "text-xs md:text-sm font-semibold",
                balance >= 0 ? "text-cyan-700 dark:text-cyan-300" : "text-amber-700 dark:text-amber-300"
              )}>
                {t("transactions.balance")}
              </span>
            </div>
            <p className={cn(
              "text-3xl md:text-[2.5rem] leading-tight font-bold tracking-tight",
              balance >= 0 ? "text-cyan-900 dark:text-white" : "text-amber-900 dark:text-white"
            )}>
              {formatTransactionAmount({ value: Math.abs(balance), currency }, locale)}
            </p>
            <p className={cn(
              "text-xs md:text-sm mt-2 font-medium",
              balance >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-amber-600 dark:text-amber-400"
            )}>
              {balance >= 0 ? t("transactions.positive") : t("transactions.negative")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors",
              filterType === "all"
                ? "bg-cyan-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            {t("transactions.all")}
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={cn(
              "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors",
              filterType === "income"
                ? "bg-emerald-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            {t("transactions.income")}
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={cn(
              "px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors",
              filterType === "expense"
                ? "bg-red-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            {t("transactions.expenses")}
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-2",
              showFilters || hasActiveFilters
                ? "bg-cyan-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            <Filter className="w-3 h-3 md:w-4 md:h-4" />
            {t("transactions.filters")}
            {selectedCategories.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {selectedCategories.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            {t("transactions.addTransaction")}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {currentFilterCategories.map(({ key, labelKey, icon }) => {
              const isSelected = selectedCategories.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    isSelected
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <span
                    className={cn(
                      "text-xs font-medium text-center leading-tight",
                      isSelected
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {t(labelKey)}
                  </span>
                </button>
              );
            })}
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
