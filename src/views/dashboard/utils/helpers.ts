/**
 * Dashboard helper functions.
 * Extracted for reusability and testability.
 */

import { IFinancialSummary } from "@/shared/types/finance";

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
