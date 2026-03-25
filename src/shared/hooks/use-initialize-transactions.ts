/**
 * useInitializeTransactions Hook
 * Initializes transactions store with data from service layer.
 */

"use client";

import { useEffect } from "react";
import { useTransactionsStore } from "@/shared/stores/transactions-store";
import { transactionsService } from "@/shared/services";

export function useInitializeTransactions(): {
  isLoading: boolean;
  error: string | null;
} {
  const { setTransactions, setLoading, setError, isLoading, error } = useTransactionsStore();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const transactions = await transactionsService.getTransactions();

        if (isMounted) {
          setTransactions(transactions);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load transactions");
          setLoading(false);
        }
      }
    }

    const currentState = useTransactionsStore.getState();
    if (currentState.transactions.length === 0) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [setTransactions, setLoading, setError]);

  return { isLoading, error };
}
