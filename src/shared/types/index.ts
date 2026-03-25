/**
 * Shared base types and enums for the WARDIA finance application.
 * All types must be strictly typed with no `any` usage.
 */

export type Currency = "PEN" | "USD" | "EUR";

export type TransactionType = "income" | "expense" | "transfer";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

export interface IAmount {
  value: number;
  currency: Currency;
}
