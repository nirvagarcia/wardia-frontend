/**
 * Transactions Store - Manages financial transactions state.
 * Centralized store for all transaction-related data across the application.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ITransaction } from "@/shared/types/finance";

/**
 * Custom storage with date deserialization
 */
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      const parsed = JSON.parse(str);
      const { state } = parsed;
      
      // Convert date strings back to Date objects
      if (state.transactions && Array.isArray(state.transactions)) {
        state.transactions = state.transactions.map((txn: ITransaction) => ({
          ...txn,
          date: txn.date ? new Date(txn.date) : new Date(),
        }));
      }
      
      return { state, version: parsed.version };
    } catch (error) {
      console.error('Error parsing transactions storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

interface TransactionsState {
  // State
  transactions: ITransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addTransaction: (transaction: Omit<ITransaction, "id">) => void;
  updateTransaction: (id: string, transaction: Omit<ITransaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: ITransaction[]) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/selectors
  getTotalIncome: (startDate?: Date, endDate?: Date) => number;
  getTotalExpenses: (startDate?: Date, endDate?: Date) => number;
  getBalance: (startDate?: Date, endDate?: Date) => number;
  getTransactionsByType: (type: "income" | "expense" | "transfer") => ITransaction[];
  getTransactionsByCategory: (category: string) => ITransaction[];
  getTransactionsByAccount: (accountId: string) => ITransaction[];
  getRecentTransactions: (limit?: number) => ITransaction[];
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      isLoading: false,
      error: null,

      // Actions
      addTransaction: (transactionData) => {
        const newTransaction: ITransaction = {
          ...transactionData,
          id: `txn-${Date.now()}`,
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          error: null,
        }));
      },

      updateTransaction: (id, transactionData) => {
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === id ? { ...transactionData, id } : txn
          ),
          error: null,
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((txn) => txn.id !== id),
          error: null,
        }));
      },

      setTransactions: (transactions) => {
        set({ transactions, error: null });
      },

      // Loading states
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Computed/selectors
      getTotalIncome: (startDate, endDate) => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.type === "income")
          .filter((txn) => {
            if (!startDate && !endDate) return true;
            const txnDate = new Date(txn.date);
            if (startDate && txnDate < startDate) return false;
            if (endDate && txnDate > endDate) return false;
            return true;
          })
          .reduce((sum, txn) => sum + txn.amount.value, 0);
      },

      getTotalExpenses: (startDate, endDate) => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.type === "expense")
          .filter((txn) => {
            if (!startDate && !endDate) return true;
            const txnDate = new Date(txn.date);
            if (startDate && txnDate < startDate) return false;
            if (endDate && txnDate > endDate) return false;
            return true;
          })
          .reduce((sum, txn) => sum + txn.amount.value, 0);
      },

      getBalance: (startDate, endDate) => {
        const { getTotalIncome, getTotalExpenses } = get();
        return getTotalIncome(startDate, endDate) - getTotalExpenses(startDate, endDate);
      },

      getTransactionsByType: (type) => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.type === type)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getTransactionsByCategory: (category) => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.category === category)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getTransactionsByAccount: (accountId) => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.accountId === accountId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getRecentTransactions: (limit = 10) => {
        const { transactions } = get();
        return [...transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: "wardia-transactions",
      storage: customStorage,
    }
  )
);
