/**
 * Helper functions for mock data generation.
 */

import { IAmount } from "@/shared/types";

/**
 * Create an IAmount object with proper typing.
 */
export const createAmount = (
  value: number,
  currency: "PEN" | "USD" | "EUR" = "PEN"
): IAmount => ({
  value,
  currency,
});

/**
 * Convert amount to PEN for aggregations (simplified conversion).
 */
export const convertToPEN = (amount: IAmount): number => {
  const exchangeRates = {
    PEN: 1,
    USD: 3.75,
    EUR: 4.10,
  };
  
  return amount.value * exchangeRates[amount.currency];
};
