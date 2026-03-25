/**
 * Mock data for WARDIA development and testing.
 * REFACTORED: Now imports from modular structure for better maintainability.
 * 
 * This file maintains backward compatibility - all exports work as before.
 * Individual data files are located in lib/mock-data/ directory.
 */

export { mockAccounts } from "./mock-data/accounts";
export { mockCreditCards } from "./mock-data/credit-cards";
export { mockSubscriptions } from "./mock-data/subscriptions";
export { mockBankCredentials } from "./mock-data/credentials";
export { mockUpcomingPayments } from "./mock-data/payments";
export { mockFinancialSummary } from "./mock-data/summary";
export { createAmount, convertToPEN } from "./mock-data/helpers";
