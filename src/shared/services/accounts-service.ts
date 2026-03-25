/**
 * Accounts Service
 * Abstraction layer for account data operations.
 * Switch between mock and real API by changing the implementation.
 */

import type { IAccount, ICreditCard, IBankCredentials } from "@/shared/types/finance";
import { mockAccounts, mockCreditCards, mockBankCredentials } from "@/shared/utils/mock";

// Toggle between mock and real API
const USE_MOCK_DATA = true; // Set to false when API is ready

/**
 * Accounts Service Interface
 */
export const accountsService = {
  /**
   * Fetch all accounts
   */
  async getAccounts(): Promise<IAccount[]> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAccounts;
    }

    // Real API implementation
    // const response = await fetch('/api/accounts');
    // if (!response.ok) throw new Error('Failed to fetch accounts');
    // return response.json();
    
    return [];
  },

  /**
   * Create a new account
   */
  async createAccount(account: Omit<IAccount, "id" | "lastUpdated">): Promise<IAccount> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...account,
        id: `acc-${Date.now()}`,
        lastUpdated: new Date(),
      };
    }

    // Real API implementation
    // const response = await fetch('/api/accounts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(account),
    // });
    // if (!response.ok) throw new Error('Failed to create account');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Update an existing account
   */
  async updateAccount(id: string, account: Omit<IAccount, "id" | "lastUpdated">): Promise<IAccount> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...account,
        id,
        lastUpdated: new Date(),
      };
    }

    // Real API implementation
    // const response = await fetch(`/api/accounts/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(account),
    // });
    // if (!response.ok) throw new Error('Failed to update account');
    // return response.json();

    throw new Error("API not implemented");
  },

  /**
   * Delete an account
   */
  async deleteAccount(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // In mock mode, id is logged but not used for actual deletion
      console.log(`Deleting account: ${id}`);
      return;
    }

    // Real API implementation
    // const response = await fetch(`/api/accounts/${id}`, {
    //   method: 'DELETE',
    // });
    // if (!response.ok) throw new Error('Failed to delete account');

    throw new Error("API not implemented");
  },

  /**
   * Fetch all credit cards
   */
  async getCreditCards(): Promise<ICreditCard[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockCreditCards;
    }

    // Real API implementation
    // const response = await fetch('/api/credit-cards');
    // if (!response.ok) throw new Error('Failed to fetch credit cards');
    // return response.json();

    return [];
  },

  /**
   * Create a new credit card
   */
  async createCreditCard(card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">): Promise<ICreditCard> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(card.cutoffDay);

      const paymentDate = new Date(nextMonth);
      paymentDate.setDate(card.paymentDueDay);
      if (paymentDate < nextMonth) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }

      return {
        ...card,
        id: `card-${Date.now()}`,
        lastStatementDate: nextMonth,
        nextPaymentDate: paymentDate,
        minimumPayment: {
          value: card.usedCredit.value * 0.05,
          currency: card.usedCredit.currency,
        },
      };
    }

    // Real API implementation
    throw new Error("API not implemented");
  },

  /**
   * Update a credit card
   */
  async updateCreditCard(id: string, card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">): Promise<ICreditCard> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(card.cutoffDay);

      const paymentDate = new Date(nextMonth);
      paymentDate.setDate(card.paymentDueDay);
      if (paymentDate < nextMonth) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }

      return {
        ...card,
        id,
        lastStatementDate: nextMonth,
        nextPaymentDate: paymentDate,
        minimumPayment: {
          value: card.usedCredit.value * 0.05,
          currency: card.usedCredit.currency,
        },
      };
    }

    // Real API implementation
    throw new Error("API not implemented");
  },

  /**
   * Delete a credit card
   */
  async deleteCreditCard(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log(`Deleting credit card: ${id}`);
      return;
    }

    // Real API implementation
    throw new Error("API not implemented");
  },

  /**
   * Fetch all bank credentials
   */
  async getCredentials(): Promise<IBankCredentials[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockBankCredentials;
    }

    // Real API implementation
    // const response = await fetch('/api/credentials');
    // if (!response.ok) throw new Error('Failed to fetch credentials');
    // return response.json();

    return [];
  },

  /**
   * Create new bank credentials
   */
  async createCredentials(credentials: Omit<IBankCredentials, "id" | "lastUpdated">): Promise<IBankCredentials> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...credentials,
        id: `cred-${Date.now()}`,
        lastUpdated: new Date(),
      };
    }

    // Real API implementation
    throw new Error("API not implemented");
  },

  /**
   * Update bank credentials
   */
  async updateCredentials(id: string, credentials: Omit<IBankCredentials, "id" | "lastUpdated">): Promise<IBankCredentials> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...credentials,
        id,
        lastUpdated: new Date(),
      };
    }

    // Real API implementation
    throw new Error("API not implemented");
  },

  /**
   * Delete bank credentials
   */
  async deleteCredentials(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log(`Deleting credentials: ${id}`);
      return;
    }

    // Real API implementation
    throw new Error("API not implemented");
  },
};
