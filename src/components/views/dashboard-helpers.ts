/**
 * Dashboard helper functions.
 * Extracted for reusability and testability.
 */

import { IFinancialSummary } from "@/types/finance";
import { IAmount } from "@/types";

/**
 * Format currency amounts.
 */
export function formatCurrency(amount: IAmount, language: string): string {
  const locale = language === "es" ? "es-PE" : "en-US";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: amount.currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount.value);
}

/**
 * Calculate days until a payment is due.
 */
export function getDaysUntilPayment(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get donut chart segments for financial breakdown.
 */
export function getMiniDonutSegments(
  summary: IFinancialSummary,
  t: (key: string) => string
): Array<{ value: number; color: string; label: string }> {
  return [
    {
      value: summary.totalBalance.value - summary.totalCreditCardDebt.value,
      color: "#06b6d4",
      label: t("dashboard.available"),
    },
    {
      value: summary.totalCreditCardDebt.value,
      color: "#ef4444",
      label: t("dashboard.debt"),
    },
    {
      value: summary.monthlySubscriptionCost.value,
      color: "#14b8a6",
      label: t("dashboard.monthlyServices"),
    },
  ];
}
