/**
 * Preferences Store - Manages user preferences for theme, language, and currency.
 * Uses Zustand with localStorage persistence.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type Language = "es" | "en";
export type Currency = "PEN" | "USD" | "EUR";

interface PreferencesState {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  language: Language;
  setLanguage: (language: Language) => void;

  currency: Currency;
  setCurrency: (currency: Currency) => void;

  notifications: {
    paymentReminders: boolean;
    balanceAlerts: boolean;
    transactionNotifications: boolean;
    monthlySummary: boolean;
  };
  toggleNotification: (key: keyof PreferencesState["notifications"]) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme: Theme) => set({ theme }),

      language: "es",
      setLanguage: (language: Language) => set({ language }),

      currency: "PEN",
      setCurrency: (currency: Currency) => set({ currency }),

      notifications: {
        paymentReminders: true,
        balanceAlerts: true,
        transactionNotifications: false,
        monthlySummary: true,
      },
      toggleNotification: (key) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          },
        })),
    }),
    {
      name: "wardia-preferences",
    }
  )
);
