import * as repo from "./periods.repository";
import type { IBillingPeriod } from "./periods.repository";

export type { IBillingPeriod };

function buildDefaultLabel(date: Date): string {
  const raw = date.toLocaleDateString("es", { month: "long", year: "numeric" });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export async function getOrCreateCurrentPeriod(userId: string): Promise<IBillingPeriod> {
  const existing = await repo.getCurrentPeriod(userId);
  if (existing) return existing;

  const now = new Date();
  const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const label = buildDefaultLabel(startDate);
  return repo.createPeriod(userId, label, startDate, null);
}

export async function getAllPeriods(userId: string): Promise<IBillingPeriod[]> {
  return repo.getAllPeriods(userId);
}

export async function startNewPeriod(
  userId: string,
  paymentDate: Date,
  label: string
): Promise<IBillingPeriod> {
  await repo.closeCurrentPeriod(userId, paymentDate);
  return repo.createPeriod(userId, label, paymentDate, null);
}
