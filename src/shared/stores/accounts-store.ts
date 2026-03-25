/**
 * Accounts Store - Manages bank accounts and credit cards state.
 * Centralized store for all account-related data across the application.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAccount, ICreditCard, IBankCredentials } from "@/shared/types/finance";

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
      if (state.accounts && Array.isArray(state.accounts)) {
        state.accounts = state.accounts.map((acc: IAccount) => ({
          ...acc,
          lastUpdated: acc.lastUpdated ? new Date(acc.lastUpdated) : new Date(),
        }));
      }
      
      if (state.creditCards && Array.isArray(state.creditCards)) {
        state.creditCards = state.creditCards.map((card: ICreditCard) => ({
          ...card,
          lastStatementDate: card.lastStatementDate ? new Date(card.lastStatementDate) : new Date(),
          nextPaymentDate: card.nextPaymentDate ? new Date(card.nextPaymentDate) : new Date(),
        }));
      }
      
      if (state.credentials && Array.isArray(state.credentials)) {
        state.credentials = state.credentials.map((cred: IBankCredentials) => ({
          ...cred,
          lastUpdated: cred.lastUpdated ? new Date(cred.lastUpdated) : new Date(),
        }));
      }
      
      return { state, version: parsed.version };
    } catch (error) {
      console.error('Error parsing accounts storage:', error);
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

interface AccountsState {
  // State
  accounts: IAccount[];
  creditCards: ICreditCard[];
  credentials: IBankCredentials[];
  isLoading: boolean;
  error: string | null;

  // Account actions
  addAccount: (account: Omit<IAccount, "id" | "lastUpdated">) => void;
  updateAccount: (id: string, account: Omit<IAccount, "id" | "lastUpdated">) => void;
  deleteAccount: (id: string) => void;
  setAccounts: (accounts: IAccount[]) => void;

  // Credit card actions
  addCreditCard: (card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => void;
  updateCreditCard: (id: string, card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => void;
  deleteCreditCard: (id: string) => void;
  setCreditCards: (cards: ICreditCard[]) => void;

  // Credentials actions
  addCredentials: (credentials: Omit<IBankCredentials, "id" | "lastUpdated">) => void;
  updateCredentials: (id: string, credentials: Omit<IBankCredentials, "id" | "lastUpdated">) => void;
  deleteCredentials: (id: string) => void;
  setCredentials: (credentials: IBankCredentials[]) => void;

  // Reordering
  reorderAccounts: (accounts: IAccount[]) => void;
  reorderCreditCards: (cards: ICreditCard[]) => void;
  reorderCredentials: (credentials: IBankCredentials[]) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/selectors
  getTotalBalance: () => number;
  getTotalCreditUsed: () => number;
  getTotalCreditAvailable: () => number;
  getDefaultAccount: () => IAccount | undefined;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      // Initial state
      accounts: [],
      creditCards: [],
      credentials: [],
      isLoading: false,
      error: null,

      // Account actions
      addAccount: (accountData) => {
        const newAccount: IAccount = {
          ...accountData,
          id: `acc-${Date.now()}`,
          lastUpdated: new Date(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
          error: null,
        }));
      },

      updateAccount: (id, accountData) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.id === id
              ? { ...accountData, id, lastUpdated: new Date() }
              : acc
          ),
          error: null,
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((acc) => acc.id !== id),
          error: null,
        }));
      },

      setAccounts: (accounts) => {
        set({ accounts, error: null });
      },

      // Credit card actions
      addCreditCard: (cardData) => {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(cardData.cutoffDay || 15);

        const paymentDate = new Date(nextMonth);
        paymentDate.setDate(cardData.paymentDueDay || 5);
        if (paymentDate < nextMonth) {
          paymentDate.setMonth(paymentDate.getMonth() + 1);
        }

        const minimumPayment = {
          value: cardData.usedCredit.value * 0.05, // 5% minimum
          currency: cardData.usedCredit.currency,
        };

        const newCard: ICreditCard = {
          ...cardData,
          id: `card-${Date.now()}`,
          lastStatementDate: nextMonth,
          nextPaymentDate: paymentDate,
          minimumPayment,
        };

        set((state) => ({
          creditCards: [...state.creditCards, newCard],
          error: null,
        }));
      },

      updateCreditCard: (id, cardData) => {
        set((state) => {
          const today = new Date();
          const nextMonth = new Date(today);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(cardData.cutoffDay || 15);

          const paymentDate = new Date(nextMonth);
          paymentDate.setDate(cardData.paymentDueDay || 5);
          if (paymentDate < nextMonth) {
            paymentDate.setMonth(paymentDate.getMonth() + 1);
          }

          const minimumPayment = {
            value: cardData.usedCredit.value * 0.05,
            currency: cardData.usedCredit.currency,
          };

          return {
            creditCards: state.creditCards.map((card) =>
              card.id === id
                ? {
                    ...cardData,
                    id,
                    lastStatementDate: nextMonth,
                    nextPaymentDate: paymentDate,
                    minimumPayment,
                  }
                : card
            ),
            error: null,
          };
        });
      },

      deleteCreditCard: (id) => {
        set((state) => ({
          creditCards: state.creditCards.filter((card) => card.id !== id),
          error: null,
        }));
      },

      setCreditCards: (cards) => {
        set({ creditCards: cards, error: null });
      },

      // Credentials actions
      addCredentials: (credentialsData) => {
        const newCredentials: IBankCredentials = {
          ...credentialsData,
          id: `cred-${Date.now()}`,
          lastUpdated: new Date(),
        };
        set((state) => ({
          credentials: [...state.credentials, newCredentials],
          error: null,
        }));
      },

      updateCredentials: (id, credentialsData) => {
        set((state) => ({
          credentials: state.credentials.map((cred) =>
            cred.id === id
              ? { ...credentialsData, id, lastUpdated: new Date() }
              : cred
          ),
          error: null,
        }));
      },

      deleteCredentials: (id) => {
        set((state) => ({
          credentials: state.credentials.filter((cred) => cred.id !== id),
          error: null,
        }));
      },

      setCredentials: (credentials) => {
        set({ credentials, error: null });
      },

      // Reordering
      reorderAccounts: (accounts) => {
        set({ accounts });
      },

      reorderCreditCards: (cards) => {
        set({ creditCards: cards });
      },

      reorderCredentials: (credentials) => {
        set({ credentials });
      },

      // Loading states
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Computed/selectors
      getTotalBalance: () => {
        const { accounts } = get();
        return accounts.reduce((sum, acc) => sum + acc.balance.value, 0);
      },

      getTotalCreditUsed: () => {
        const { creditCards } = get();
        return creditCards.reduce((sum, card) => sum + card.usedCredit.value, 0);
      },

      getTotalCreditAvailable: () => {
        const { creditCards } = get();
        return creditCards.reduce((sum, card) => sum + card.availableCredit.value, 0);
      },

      getDefaultAccount: () => {
        const { accounts } = get();
        return accounts.find((acc) => acc.isDefault);
      },
    }),
    {
      name: "wardia-accounts",
      storage: customStorage,
      // Don't persist sensitive data in production - use secure storage
      partialize: (state) => ({
        accounts: state.accounts,
        creditCards: state.creditCards,
        credentials: state.credentials,
        isLoading: state.isLoading,
        error: state.error,
      }),
    }
  )
);
