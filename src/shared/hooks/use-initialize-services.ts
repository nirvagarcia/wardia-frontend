/**
 * useInitializeServices Hook
 * Initializes services store with data from service layer.
 */

"use client";

import { useEffect } from "react";
import { useServicesStore } from "@/shared/stores/services-store";
import { servicesService } from "@/shared/services";

export function useInitializeServices(): {
  isLoading: boolean;
  error: string | null;
} {
  const { setServices, setLoading, setError, isLoading, error } = useServicesStore();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const services = await servicesService.getServices();

        if (isMounted) {
          setServices(services);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load services");
          setLoading(false);
        }
      }
    }

    const currentState = useServicesStore.getState();
    if (currentState.services.length === 0) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [setServices, setLoading, setError]);

  return { isLoading, error };
}
