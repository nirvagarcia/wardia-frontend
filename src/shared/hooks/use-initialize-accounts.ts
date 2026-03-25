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
  const { setAccounts, setCreditCards, setCredentials, setLoading, setError, isLoading, error } =
    useAccountsStore();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [accounts, creditCards, credentials] = await Promise.all([
          accountsService.getAccounts(),
          accountsService.getCreditCards(),
          accountsService.getCredentials(),
        ]);

        if (isMounted) {
          setAccounts(accounts);
          setCreditCards(creditCards);
          setCredentials(credentials);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load accounts");
          setLoading(false);
        }
      }
    }

    const currentState = useAccountsStore.getState();
    if (
      currentState.accounts.length === 0 && 
      currentState.creditCards.length === 0 && 
      currentState.credentials.length === 0
    ) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [setAccounts, setCreditCards, setCredentials, setLoading, setError]);

  return { isLoading, error };
}
