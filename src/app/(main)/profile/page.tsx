"use client";

/**
 * Profile & Settings Page
 * Fully functional with real theme, language, and currency switching.
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePreferencesStore, type Theme, type Language, type Currency } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import {
  User,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Settings,
  CreditCard,
  Eye,
  Moon,
  Sun,
  Monitor,
  Globe,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage(): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    notifications,
    toggleNotification,
  } = usePreferencesStore();

  const [mounted, setMounted] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Avoid hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string) => getTranslation(language, key);

  const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: "light", label: t("profile.themeLight"), icon: Sun },
    { value: "dark", label: t("profile.themeDark"), icon: Moon },
    { value: "system", label: t("profile.themeSystem"), icon: Monitor },
  ];

  const languageOptions: Array<{ value: Language; label: string }> = [
    { value: "es", label: t("profile.languageSpanish") },
    { value: "en", label: t("profile.languageEnglish") },
  ];

  const currencyOptions: Array<{ value: Currency; label: string }> = [
    { value: "PEN", label: t("profile.currencyPEN") },
    { value: "USD", label: t("profile.currencyUSD") },
    { value: "EUR", label: t("profile.currencyEUR") },
  ];

  const notificationSettings = [
    {
      key: "paymentReminders" as const,
      label: t("profile.paymentReminders"),
      description: t("profile.paymentRemindersDesc"),
    },
    {
      key: "balanceAlerts" as const,
      label: t("profile.balanceAlerts"),
      description: t("profile.balanceAlertsDesc"),
    },
    {
      key: "transactionNotifications" as const,
      label: t("profile.transactionNotifications"),
      description: t("profile.transactionNotificationsDesc"),
    },
    {
      key: "monthlySummary" as const,
      label: t("profile.monthlySummary"),
      description: t("profile.monthlySummaryDesc"),
    },
  ];

  // Only show current values after hydration to avoid mismatch
  if (!mounted) {
    // Render placeholder until mounted to avoid hydration mismatch
    return (
      <div className="min-h-screen p-6 space-y-6 pb-24 bg-white dark:bg-zinc-950">
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <User className="w-8 h-8 text-emerald-400" />
              {t("profile.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t("profile.subtitle")}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-xl animate-pulse">
            <div className="h-20 bg-white/10 rounded-full"></div>
          </div>
        </header>
      </div>
    );
  }

  const currentThemeLabel = themeOptions.find((opt) => opt.value === theme)?.label || t("profile.themeSystem");
  const currentLanguageLabel = languageOptions.find((opt) => opt.value === language)?.label || "Español";
  const currentCurrencyLabel = currencyOptions.find((opt) => opt.value === currency)?.label || "Soles (PEN)";

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24 bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <User className="w-8 h-8 text-emerald-400" />
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t("profile.subtitle")}</p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Nirvana</h2>
              <p className="text-emerald-100 text-sm mt-1">Usuario Premium</p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Eye className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Personal Information */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.personalInfo")}</h2>
        
        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.email")}</p>
                <p className="font-medium text-zinc-900 dark:text-white">nirvana@wardia.app</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.phone")}</p>
                <p className="font-medium text-zinc-900 dark:text-white">+51 986 689 120</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.memberSince")}</p>
                <p className="font-medium text-zinc-900 dark:text-white">Marzo 2026</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.notifications")}</h2>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
          {notificationSettings.map((setting, index) => (
            <div key={setting.key}>
              {index > 0 && <div className="border-t border-zinc-200 dark:border-zinc-800 mx-3" />}
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white">{setting.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(setting.key)}
                  className={cn(
                    "relative w-12 h-7 rounded-full transition-colors",
                    notifications[setting.key] ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
                  )}
                  aria-label={`Toggle ${setting.label}`}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
                      notifications[setting.key] ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Settings */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.appPreferences")}</h2>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          {/* Theme Selector */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Moon className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-white">{t("profile.theme")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                  {currentThemeLabel}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          {/* Language Selector */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-white">{t("profile.language")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                  {currentLanguageLabel}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          {/* Currency Selector */}
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-white">{t("profile.currency")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                  {currentCurrencyLabel}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          {/* Currency Selector */}
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-white">{t("profile.currency")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentCurrencyLabel}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.security")}</h2>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">{t("profile.changePassword")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">{t("profile.twoFactor")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Logout Button */}
      <section>
        <button className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all group">
          <LogOut className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold text-red-400">{t("profile.logout")}</span>
        </button>
      </section>

      {/* App Version */}
      <div className="text-center text-sm text-gray-500 pt-4">
        <p>{t("profile.version")}</p>
        <p className="mt-1">{t("profile.copyright")}</p>
      </div>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowThemeModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("profile.theme")}</h3>
              <button onClick={() => setShowThemeModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            <div className="space-y-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setShowThemeModal(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                      isSelected
                        ? "bg-emerald-500/20 border-2 border-emerald-500"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", isSelected ? "text-emerald-500" : "text-zinc-600 dark:text-zinc-400")} />
                      <span className={cn("font-medium", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white")}>
                        {option.label}
                      </span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowLanguageModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("profile.language")}</h3>
              <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            <div className="space-y-2">
              {languageOptions.map((option) => {
                const isSelected = language === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setLanguage(option.value);
                      setShowLanguageModal(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                      isSelected
                        ? "bg-emerald-500/20 border-2 border-emerald-500"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    <span className={cn("font-medium", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white")}>
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowCurrencyModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("profile.currency")}</h3>
              <button onClick={() => setShowCurrencyModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            <div className="space-y-2">
              {currencyOptions.map((option) => {
                const isSelected = currency === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setCurrency(option.value);
                      setShowCurrencyModal(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                      isSelected
                        ? "bg-emerald-500/20 border-2 border-emerald-500"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                  >
                    <span className={cn("font-medium", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white")}>
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
