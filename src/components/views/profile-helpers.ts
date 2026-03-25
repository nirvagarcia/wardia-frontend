/**
 * Profile View Helper Utilities
 * Contains types, constants, and utility functions for profile management.
 */

import { Theme, Language, Currency } from "@/store/preferences-store";
import { Sun, Moon, Monitor } from "lucide-react";

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun;
}

export interface LanguageOption {
  value: Language;
  label: string;
}

export interface CurrencyOption {
  value: Currency;
  label: string;
}

export interface NotificationSetting {
  key: "paymentReminders" | "balanceAlerts" | "transactionNotifications" | "monthlySummary";
  label: string;
  description: string;
}

export function getThemeOptions(t: (key: string) => string): ThemeOption[] {
  return [
    { value: "light", label: t("profile.themeLight"), icon: Sun },
    { value: "dark", label: t("profile.themeDark"), icon: Moon },
    { value: "system", label: t("profile.themeSystem"), icon: Monitor },
  ];
}

export function getLanguageOptions(t: (key: string) => string): LanguageOption[] {
  return [
    { value: "es", label: t("profile.languageSpanish") },
    { value: "en", label: t("profile.languageEnglish") },
  ];
}

export function getCurrencyOptions(t: (key: string) => string): CurrencyOption[] {
  return [
    { value: "PEN", label: t("profile.currencyPEN") },
    { value: "USD", label: t("profile.currencyUSD") },
    { value: "EUR", label: t("profile.currencyEUR") },
  ];
}

export function getNotificationSettings(t: (key: string) => string): NotificationSetting[] {
  return [
    {
      key: "paymentReminders",
      label: t("profile.paymentReminders"),
      description: t("profile.paymentRemindersDesc"),
    },
    {
      key: "balanceAlerts",
      label: t("profile.balanceAlerts"),
      description: t("profile.balanceAlertsDesc"),
    },
    {
      key: "transactionNotifications",
      label: t("profile.transactionNotifications"),
      description: t("profile.transactionNotificationsDesc"),
    },
    {
      key: "monthlySummary",
      label: t("profile.monthlySummary"),
      description: t("profile.monthlySummaryDesc"),
    },
  ];
}
