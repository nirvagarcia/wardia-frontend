"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/shared/services/transactions-service";
import type { TransactionQueryParams } from "@/shared/services/transactions-service";
import type { ITransaction } from "@/shared/types/finance";

export type { TransactionQueryParams };

export const TRANSACTIONS_QUERY_KEY = (params?: TransactionQueryParams) =>
  params ? ["transactions", params] : ["transactions"];

export const HISTORY_QUERY_KEY = ["transactions", "history"] as const;

export function useTransactionsQuery(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY(params),
    queryFn: () => transactionsService.getTransactions(params),
  });
}

export function useTransactionHistoryQuery() {
  return useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: () => transactionsService.getHistory(),
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITransaction, "id">) =>
      transactionsService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ITransaction, "id"> }) =>
      transactionsService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
