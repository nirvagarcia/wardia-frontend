/**
 * Utility to expand recurring services into virtual ITransaction entries
 * within a given billing period window.
 */

import type { ISubscription, ITransaction, PaymentFrequency } from "@/shared/types/finance";

/** Map service-specific categories to transaction categories */
const SERVICE_TO_CATEGORY: Record<string, string> = {
  housing: "housing",
  utilities: "utilities",
  telecom: "other-expense",
  health: "health",
  productivity: "education",
  entertainment: "entertainment",
};

/** Approximate ms per frequency step – used only to estimate loop bounds */
const FREQ_APPROX_MS: Record<PaymentFrequency, number> = {
  weekly: 7 * 86_400_000,
  monthly: 31 * 86_400_000,
  quarterly: 92 * 86_400_000,
  yearly: 366 * 86_400_000,
};

function stepDate(date: Date, frequency: PaymentFrequency, steps: number): Date {
  const d = new Date(date);
  switch (frequency) {
    case "weekly":
      d.setDate(d.getDate() + 7 * steps);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + steps);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3 * steps);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + steps);
      break;
  }
  return d;
}

/**
 * Returns all virtual ITransaction entries for a single service that fall
 * within [periodStart, periodEnd).
 */
export function getServicePaymentsInRange(
  service: ISubscription,
  periodStart: Date,
  periodEnd: Date,
): ITransaction[] {
  if (service.status !== "active") return [];

  // Normalise the base date to noon so DST shifts don't push it across midnight
  const base = new Date(service.nextPaymentDate);
  base.setHours(12, 0, 0, 0);

  const stepMs = FREQ_APPROX_MS[service.frequency];
  const rangeMs = periodEnd.getTime() - periodStart.getTime();

  // How many steps back from base to guarantee we're before periodStart
  const stepsBack =
    Math.ceil((base.getTime() - periodStart.getTime()) / stepMs) + 2;

  let anchor = stepDate(base, service.frequency, -stepsBack);

  const results: ITransaction[] = [];
  const maxIter = Math.ceil(rangeMs / stepMs) + stepsBack + 5;

  for (let i = 0; i < maxIter; i++) {
    anchor = stepDate(anchor, service.frequency, 1);
    if (anchor >= periodEnd) break;
    if (anchor >= periodStart) {
      results.push({
        id: `service-${service.id}-${anchor.getTime()}`,
        type: "expense",
        status: "completed",
        amount: service.amount,
        description: service.name,
        source: service.description,
        category: SERVICE_TO_CATEGORY[service.category] ?? "other-expense",
        transactionDate: new Date(anchor),
        isService: true,
      });
    }
  }

  return results;
}

/**
 * Returns all virtual ITransaction entries for every active service
 * within [periodStart, periodEnd).
 */
export function getServicesInPeriod(
  services: ISubscription[],
  periodStart: Date,
  periodEnd: Date,
): ITransaction[] {
  return services.flatMap((s) => getServicePaymentsInRange(s, periodStart, periodEnd));
}
