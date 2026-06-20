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
        const serverPrefs = user.preferences ?? {};
        if (!serverPrefs["language"] || !serverPrefs["currency"]) {
          const { language, currency } = usePreferencesStore.getState();
          const patch: Record<string, string> = {};
          if (!serverPrefs["language"]) patch["language"] = language;
          if (!serverPrefs["currency"]) patch["currency"] = currency;
          fetch("/api/auth/preferences", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          }).catch(() => {});
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setUser, setLoading, hydrateFromServer]);

  return <>{children}</>;
}
