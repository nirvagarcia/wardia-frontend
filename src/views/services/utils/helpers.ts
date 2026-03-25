/**
 * Services helper functions.
 * Extracted for reusability and testability.
 */

import { ISubscription } from "@/shared/types/finance";
import { Currency } from "@/shared/types";
import { convertCurrency } from "@/shared/utils/currency";

/**
 * Calculate total monthly cost in the preferred currency.
 * Normalizes all frequencies to monthly equivalent and converts currencies.
 */
export function calculateMonthlyTotal(
  services: ISubscription[],
  preferredCurrency: Currency,
  onlyActive: boolean = true
): number {
  return services
    .filter((sub) => !onlyActive || sub.status === "active")
    .reduce((sum, sub) => {
      const valueInPreferred = convertCurrency(
        sub.amount.value,
        sub.amount.currency as Currency,
        preferredCurrency
      );
      
      let monthlyEquivalent = 0;
      switch (sub.frequency) {
        case "monthly":
          monthlyEquivalent = valueInPreferred;
          break;
        case "yearly":
          monthlyEquivalent = valueInPreferred / 12;
          break;
        case "weekly":
          monthlyEquivalent = valueInPreferred * 4.33;
          break;
        case "quarterly":
          monthlyEquivalent = valueInPreferred / 3;
          break;
        default:
          monthlyEquivalent = valueInPreferred;
      }
      
      return sum + monthlyEquivalent;
    }, 0);
}

/**
 * Get upcoming subscriptions within the next 7 days.
 */
export function getUpcomingServices(services: ISubscription[]): ISubscription[] {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return services.filter(
    (sub) => sub.nextPaymentDate >= now && sub.nextPaymentDate <= sevenDaysFromNow
  );
}

/**
 * Get localized frequency label.
 */
export function getFrequencyLabel(freq: string, language: string): string {
  const map: Record<string, { es: string; en: string }> = {
    monthly: { es: "Mensual", en: "Monthly" },
    yearly: { es: "Anual", en: "Yearly" },
    weekly: { es: "Semanal", en: "Weekly" },
    quarterly: { es: "Trimestral", en: "Quarterly" },
  };
  const lang = language as "es" | "en";
  return map[freq]?.[lang] || freq;
}

/**
 * Get localized status label.
 */
export function getStatusLabel(status: string, language: string): string {
  const map: Record<string, { es: string; en: string }> = {
    active: { es: "Activo", en: "Active" },
    cancelled: { es: "Cancelado", en: "Cancelled" },
    paused: { es: "Pausado", en: "Paused" },
  };
  const lang = language as "es" | "en";
  return map[status]?.[lang] || status;
}

/**
 * Get localized category label.
 */
export function getCategoryLabel(categoryKey: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    entertainment: t("services.categoryEntertainment"),
    productivity: t("services.categoryProductivity"),
    health: t("services.categoryHealth"),
    utilities: t("services.categoryUtilities"),
    telecom: t("services.categoryTelecom"),
    housing: t("services.categoryHousing"),
  };
  return map[categoryKey] || categoryKey;
}

/**
 * Create a new service with generated ID.
 */
export function createNewService(serviceData: Omit<ISubscription, "id">): ISubscription {
  return {
    ...serviceData,
    id: `service-${Date.now()}`,
  };
}

/**
 * Update a service, preserving ID.
 */
export function updateService(id: string, serviceData: Omit<ISubscription, "id">): ISubscription {
  return {
    ...serviceData,
    id,
  };
}
