"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { authService } from "@/shared/services/auth-service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const hydrateFromServer = usePreferencesStore((s) => s.hydrateFromServer);

  useEffect(() => {
    authService
      .getMe()
      .then((user) => {
        setUser(user);
        if (user.preferences) {
          hydrateFromServer(user.preferences);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setUser, setLoading, hydrateFromServer]);

  return <>{children}</>;
}
