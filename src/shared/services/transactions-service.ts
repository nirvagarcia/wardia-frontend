/**
 * Transactions Service
 * Abstraction layer for transaction data operations.
 */

import type { ITransaction } from "@/shared/types/finance";
import { mockTransactions } from "@/shared/utils/mock";

const USE_MOCK_DATA = true;

export const transactionsService = {
  /**
   * Fetch all transactions
   */
  async getTransactions(): Promise<ITransaction[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTransactions;
    }

    // Real API implementation
    // const response = await fetch('/api/transactions');
    // if (!response.ok) throw new Error('Failed to fetch transactions');
    // return response.json();

    return [];
  },

  /**
   * Fetch transactions by date range
   */
  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTransactions.filter((txn) => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate && txnDate <= endDate;
      });
    }

    // Real API implementation
    // const params = new URLSearchParams({
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    // });
    // const response = await fetch(`/api/transactions?${params}`);
    // if (!response.ok) throw new Error('Failed to fetch transactions');
    // return response.json();

    return [];
  },

  /**
   * Create a new transaction
   */
  async createTransaction(transaction: Omit<ITransaction, "id">): Promise<ITransaction> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...transaction,
        id: `txn-${Date.now()}`,
      };
    }

    // Real API implementation
    // const response = await fetch('/api/transactions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transaction),
    // });
    // if (!response.ok) throw new Error('Failed to create transaction');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Update an existing transaction
   */
  async updateTransaction(id: string, transaction: Omit<ITransaction, "id">): Promise<ITransaction> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...transaction,
        id,
      };
    }

    // Real API implementation
    // const response = await fetch(`/api/transactions/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transaction),
    // });
    // if (!response.ok) throw new Error('Failed to update transaction');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log(`Deleting transaction: ${id}`);
      return;
    }

    // Real API implementation
    // const response = await fetch(`/api/transactions/${id}`, {
    //   method: 'DELETE',
    // });
    // if (!response.ok) throw new Error('Failed to delete transaction');

    throw new Error("API not implemented");
  },
};
