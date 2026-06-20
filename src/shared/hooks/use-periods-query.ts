"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { periodsService } from "@/shared/services/periods-service";
import type { IBillingPeriodClient } from "@/shared/services/periods-service";

export type { IBillingPeriodClient };

export const PERIODS_QUERY_KEY = ["billing-periods"] as const;
export const CURRENT_PERIOD_QUERY_KEY = [...PERIODS_QUERY_KEY, "current"] as const;

export function useCurrentPeriod() {
  return useQuery({
    queryKey: CURRENT_PERIOD_QUERY_KEY,
    queryFn: () => periodsService.getCurrentPeriod(),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePeriodsQuery() {
  return useQuery({
    queryKey: PERIODS_QUERY_KEY,
    queryFn: () => periodsService.getPeriods(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStartNewPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { paymentDate: string; label: string }) =>
      periodsService.startNewPeriod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERIODS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
