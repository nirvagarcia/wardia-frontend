"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/shared/services/services-service";
import type { ISubscription } from "@/shared/types/finance";

export const SERVICES_QUERY_KEY = ["services"] as const;

export function useServicesQuery() {
  return useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: () => servicesService.getServices(),
  });
}

export function useAddService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ISubscription, "id">) => servicesService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ISubscription, "id"> }) =>
      servicesService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
  });
}

export function computeMonthlyTotal(services: ISubscription[]): number {
  return services
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const monthly =
        s.frequency === "yearly" ? s.amount.value / 12 :
        s.frequency === "weekly" ? s.amount.value * 4.33 :
        s.frequency === "quarterly" ? s.amount.value / 3 :
        s.amount.value;
      return sum + monthly;
    }, 0);
}

export function computeUpcomingPayments(services: ISubscription[], daysAhead = 7): ISubscription[] {
  const today = new Date();
  const limit = new Date();
  limit.setDate(today.getDate() + daysAhead);
  return services
    .filter((s) => s.status === "active")
    .filter((s) => s.nextPaymentDate >= today && s.nextPaymentDate <= limit)
    .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime());
}
