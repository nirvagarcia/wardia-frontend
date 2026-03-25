/**
 * Accounts helper functions.
 * Extracted for reusability and testability.
 */

import { IAccount, ICreditCard, IBankCredentials } from "@/types/finance";

/**
 * Format currency for display.
 */
export function formatCurrency(
  value: number,
  currency: string,
  language: string
): string {
  const locale = language === "es" ? "es-PE" : "en-US";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
}

/**
 * Calculate total balance from accounts.
 */
export function calculateTotalBalance(accounts: IAccount[]): number {
  return accounts.reduce((sum, acc) => sum + acc.balance.value, 0);
}

/**
 * Calculate total used credit from cards.
 */
export function calculateTotalUsedCredit(cards: ICreditCard[]): number {
  return cards.reduce((sum, card) => sum + card.usedCredit.value, 0);
}

/**
 * Calculate total available credit from cards.
 */
export function calculateTotalAvailable(cards: ICreditCard[]): number {
  return cards.reduce((sum, card) => sum + card.availableCredit.value, 0);
}

/**
 * Create a new account with generated ID and timestamp.
 */
export function createNewAccount(
  accountData: Omit<IAccount, "id" | "lastUpdated">
): IAccount {
  return {
    ...accountData,
    id: `account-${Date.now()}`,
    lastUpdated: new Date(),
  };
}

/**
 * Create a new credit card with calculated fields.
 */
export function createNewCard(
  cardData: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">
): ICreditCard {
  const now = new Date();
  return {
    ...cardData,
    id: `card-${Date.now()}`,
    lastStatementDate: new Date(now.getFullYear(), now.getMonth(), cardData.cutoffDay),
    nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, cardData.paymentDueDay),
    minimumPayment: {
      value: cardData.usedCredit.value * 0.05,
      currency: cardData.usedCredit.currency,
    },
  };
}

/**
 * Update an account with new data, preserving ID and updating timestamp.
 */
export function updateAccount(
  id: string,
  accountData: Omit<IAccount, "id" | "lastUpdated">
): IAccount {
  return {
    ...accountData,
    id,
    lastUpdated: new Date(),
  };
}

/**
 * Update a credit card with recalculated fields.
 */
export function updateCard(
  id: string,
  cardData: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">
): ICreditCard {
  const now = new Date();
  return {
    ...cardData,
    id,
    lastStatementDate: new Date(now.getFullYear(), now.getMonth(), cardData.cutoffDay),
    nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, cardData.paymentDueDay),
    minimumPayment: {
      value: cardData.usedCredit.value * 0.05,
      currency: cardData.usedCredit.currency,
    },
  };
}

/**
 * Create new credentials with generated ID and timestamp.
 */
export function createNewCredentials(
  credData: Omit<IBankCredentials, "id" | "lastUpdated">
): IBankCredentials {
  return {
    ...credData,
    id: `cred-${Date.now()}`,
    lastUpdated: new Date(),
  };
}

/**
 * Update credentials with new data, preserving ID and updating timestamp.
 */
export function updateCredentials(
  id: string,
  credData: Omit<IBankCredentials, "id" | "lastUpdated">
): IBankCredentials {
  return {
    ...credData,
    id,
    lastUpdated: new Date(),
  };
}
