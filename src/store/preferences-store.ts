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
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;

  // Notification Settings
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
      // Theme defaults
      theme: "dark",
      setTheme: (theme: Theme) => set({ theme }),

      // Language defaults
      language: "es",
      setLanguage: (language: Language) => set({ language }),

      // Currency defaults
      currency: "PEN",
      setCurrency: (currency: Currency) => set({ currency }),

      // Notifications defaults
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
