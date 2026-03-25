/**
 * Mock data exports - Centralized access to all mock data.
 * Data is now modularized for better maintainability.
 */

// Individual data exports
export { mockAccounts } from "./accounts";
export { mockCreditCards } from "./credit-cards";
export { mockSubscriptions } from "./subscriptions";
export { mockBankCredentials } from "./credentials";
export { mockUpcomingPayments } from "./payments";
export { mockFinancialSummary } from "./summary";
export { mockTransactions } from "./transactions";

// Helper functions
export { createAmount, convertToPEN } from "./helpers";
