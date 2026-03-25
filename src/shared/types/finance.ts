/**
 * Financial domain type definitions for WARDIA.
 * Strictly typed interfaces for accounts, cards, transactions, and subscriptions.
 */

import { TransactionType, TransactionStatus, IAmount } from "./index";

export type AccountType = "savings" | "checking" | "investment";

export type CardNetwork = "visa" | "mastercard" | "amex" | "discover";

export type CardStatus = "active" | "blocked" | "expired";

export type SubscriptionStatus = "active" | "cancelled" | "paused";

export type PaymentFrequency = "monthly" | "yearly" | "weekly" | "quarterly";

/**
 * Represents a bank account with CCI (Código de Cuenta Interbancaria).
 */
export interface IAccount {
  id: string;
  bankName: string;
  accountType: AccountType;
  accountNumber: string;
  cci: string;
  balance: IAmount;
  lastUpdated: Date;
  isDefault: boolean;
  network: CardNetwork;
  cvv: string;
  expiryMonth: number;
  expiryYear: number;
}

/**
 * Represents a credit card with detailed information.
 */
export interface ICreditCard {
  id: string;
  bankName: string;
  cardholderName: string;
  cardNumber: string;
  network: CardNetwork;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  creditLimit: IAmount;
  usedCredit: IAmount;
  availableCredit: IAmount;
  cutoffDay: number;
  paymentDueDay: number;
  lastStatementDate: Date;
  nextPaymentDate: Date;
  minimumPayment: IAmount;
}

/**
 * Represents a financial transaction.
 */
export interface ITransaction {
  id: string;
  accountId: string;
  cardId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: IAmount;
  description: string;
  merchant?: string;
  category: string;
  date: Date;
  notes?: string;
}

/**
 * Represents a recurring subscription or payment.
 */
export interface ISubscription {
  id: string;
  name: string;
  description?: string;
  amount: IAmount;
  frequency: PaymentFrequency;
  nextPaymentDate: Date;
  status: SubscriptionStatus;
  category: string;
  accountId?: string;
  cardId?: string;
  merchantUrl?: string;
  autoRenewal: boolean;
}

/**
 * Summary data for dashboard display.
 */
export interface IFinancialSummary {
  totalBalance: IAmount;
  totalCreditCardDebt: IAmount;
  totalAvailableCredit: IAmount;
  monthlySubscriptionCost: IAmount;
  upcomingPayments: IUpcomingPayment[];
}

/**
 * Represents an upcoming payment notification.
 */
export interface IUpcomingPayment {
  id: string;
  name: string;
  amount: IAmount;
  dueDate: Date;
  type: "subscription" | "card" | "loan";
  isUrgent?: boolean;
}

/**
 * Represents bank credentials for online banking access.
 */
export interface IBankCredentials {
  id: string;
  bankName: string;
  username: string;
  password: string;
  digitalKey?: string;
  securityToken?: string;
  notes?: string;
  lastUpdated: Date;
}
