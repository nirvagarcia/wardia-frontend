import { ApiError } from "@/server/lib/api-error";
import * as repo from "./services.repository";
import type { ServiceCreateInput, ServiceUpdateInput } from "./services.validation";

export async function getServices(userId: string) {
  const services = await repo.findAllByUser(userId);

  const activeServices = services.filter((s) => s.status === "active");

  const totalMonthlyCost = activeServices.reduce((sum, s) => {
    const monthly =
      s.frequency === "monthly" ? s.amountValue :
      s.frequency === "yearly" ? s.amountValue / 12 :
      s.frequency === "weekly" ? s.amountValue * 4.33 :
      s.frequency === "quarterly" ? s.amountValue / 3 :
      s.amountValue;
    return sum + monthly;
  }, 0);

  return {
    services,
    meta: {
      total: services.length,
      activeCount: activeServices.length,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    },
  };
}

export async function createService(userId: string, data: ServiceCreateInput) {
  return repo.create(userId, data);
}

export async function updateService(id: string, userId: string, data: ServiceUpdateInput) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Service not found", 404);
  return repo.update(id, data);
}

export async function deleteService(id: string, userId: string) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Service not found", 404);
  await repo.remove(id);
}
