import { prisma } from "@/server/db/client";

export interface IBillingPeriod {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date | null;
}

export async function getCurrentPeriod(userId: string): Promise<IBillingPeriod | null> {
  return prisma.billingPeriod.findFirst({
    where: { userId, endDate: null },
    orderBy: { startDate: "desc" },
  });
}

export async function getAllPeriods(userId: string): Promise<IBillingPeriod[]> {
  return prisma.billingPeriod.findMany({
    where: { userId },
    orderBy: { startDate: "desc" },
  });
}

export async function createPeriod(
  userId: string,
  label: string,
  startDate: Date,
  endDate: Date | null = null
): Promise<IBillingPeriod> {
  return prisma.billingPeriod.create({
    data: { userId, label, startDate, endDate },
  });
}

export async function closeCurrentPeriod(userId: string, endDate: Date): Promise<void> {
  await prisma.billingPeriod.updateMany({
    where: { userId, endDate: null },
    data: { endDate },
  });
}
