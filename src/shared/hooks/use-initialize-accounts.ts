/**
 * useInitializeAccounts Hook
 * Initializes accounts store with data from service layer.
 * Call this in a Server Component or on mount to load initial data.
 */

"use client";

import { useEffect } from "react";
import { useAccountsStore } from "@/shared/stores/accounts-store";
import { accountsService } from "@/shared/services";

export function useInitializeAccounts(): {
  isLoading: boolean;
  error: string | null;
} {
  const { setAccounts, setCreditCards, setLoading, setError, isLoading, error } =
    useAccountsStore();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [accounts, creditCards] = await Promise.all([
          accountsService.getAccounts(),
          accountsService.getCreditCards(),
        ]);

        if (isMounted) {
          setAccounts(accounts);
          setCreditCards(creditCards);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load accounts");
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [setAccounts, setCreditCards, setLoading, setError]);

  return { isLoading, error };
}
