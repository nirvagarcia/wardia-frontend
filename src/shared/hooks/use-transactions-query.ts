"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/shared/services/transactions-service";
import type { ITransaction } from "@/shared/types/finance";

export const TRANSACTIONS_QUERY_KEY = (month?: string) =>
  month ? ["transactions", month] : ["transactions"];

export const HISTORY_QUERY_KEY = ["transactions", "history"] as const;

export function useTransactionsQuery(month?: string) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY(month),
    queryFn: () => transactionsService.getTransactions(month),
  });
}

export function useTransactionHistoryQuery() {
  return useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: () => transactionsService.getHistory(),
  });
}

export function useAddTransaction(month?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITransaction, "id">) =>
      transactionsService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY(month) });
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });
}

export function useUpdateTransaction(month?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ITransaction, "id"> }) =>
      transactionsService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY(month) });
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });
}

export function useDeleteTransaction(month?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY(month) });
      queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });
    },
  });
}
