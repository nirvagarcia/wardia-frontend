/**
 * Preferences Store - Manages user preferences for theme, language, and currency.
 * Uses Zustand with localStorage persistence + server sync.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUserPreferences } from "@/shared/types/auth";

export type Theme = "light" | "dark" | "system";
export type Language = "es" | "en";
export type Currency = "PEN" | "USD" | "EUR";

function syncPreferences(patch: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  fetch("/api/auth/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => {});
}

interface PreferencesState {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  language: Language;
  setLanguage: (language: Language) => void;

  currency: Currency;
  setCurrency: (currency: Currency) => void;

  /** Day of the month the user receives their income (1–28). Defines the billing period start. */
  billingCycleStartDay: number;
  setBillingCycleStartDay: (day: number) => void;

  notifications: {
    paymentReminders: boolean;
    balanceAlerts: boolean;
    transactionNotifications: boolean;
    monthlySummary: boolean;
  };
  toggleNotification: (key: keyof PreferencesState["notifications"]) => void;

  /** Called by AuthProvider to hydrate from server after login */
  hydrateFromServer: (prefs: IUserPreferences) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme: Theme) => set({ theme }), 

      language: "es",
      setLanguage: (language: Language) => {
        set({ language });
        syncPreferences({ language });
      },

      currency: "PEN",
      setCurrency: (currency: Currency) => {
        set({ currency });
        syncPreferences({ currency });
      },

      billingCycleStartDay: 1,
      setBillingCycleStartDay: (day: number) => set({ billingCycleStartDay: day }),

      notifications: {
        paymentReminders: true,
        balanceAlerts: true,
        transactionNotifications: false,
        monthlySummary: true,
      },
      toggleNotification: (key) =>
        set((state) => {
          const updated = { ...state.notifications, [key]: !state.notifications[key] };
          syncPreferences({ notifications: updated });
          return { notifications: updated };
        }),

      hydrateFromServer: (prefs) => set((state) => ({
        language: (prefs.language as Language) ?? state.language,
        currency: (prefs.currency as Currency) ?? state.currency,
        notifications: prefs.notifications
          ? { ...state.notifications, ...prefs.notifications }
          : state.notifications,
      })),
    }),
    {
      name: "wardia-preferences",
    }
  )
);

