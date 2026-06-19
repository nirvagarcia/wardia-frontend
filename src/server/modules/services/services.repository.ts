import { prisma } from "@/server/db/client";
import type { ServiceCreateInput, ServiceUpdateInput } from "./services.validation";

export function findAllByUser(userId: string) {
  return prisma.service.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function findById(id: string, userId: string) {
  return prisma.service.findFirst({
    where: { id, userId },
  });
}

export function create(userId: string, data: ServiceCreateInput) {
  return prisma.service.create({
    data: {
      ...data,
      userId,
      nextPaymentDate: new Date(data.nextPaymentDate),
    },
  });
}

export function update(id: string, data: ServiceUpdateInput) {
  return prisma.service.update({
    where: { id },
    data: {
      ...data,
      nextPaymentDate: data.nextPaymentDate ? new Date(data.nextPaymentDate) : undefined,
    },
  });
}

export function remove(id: string) {
  return prisma.service.delete({ where: { id } });
}
