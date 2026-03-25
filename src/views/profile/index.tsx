"use client";

/**
 * Profile View Component
 * Displays user profile, settings, notifications, and preferences.
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePreferencesStore, type Theme, type Language, type Currency } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
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
  Globe,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  getThemeOptions,
  getLanguageOptions,
  getCurrencyOptions,
  getNotificationSettings,
} from "./utils/helpers";
import { SelectionModal, type SelectionOption } from "./modals/selection-modal";

export function ProfileView(): React.JSX.Element {
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string) => getTranslation(language, key);

  const themeOptions = getThemeOptions(t);
  const languageOptions = getLanguageOptions(t);
  const currencyOptions = getCurrencyOptions(t);
  const notificationSettings = getNotificationSettings(t);

  if (!mounted) {
    return (
      <div className="space-y-6">
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

  const themeSelectionOptions: SelectionOption[] = themeOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
    icon: opt.icon,
  }));

  const languageSelectionOptions: SelectionOption[] = languageOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const currencySelectionOptions: SelectionOption[] = currencyOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <User className="w-8 h-8 text-emerald-400" />
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t("profile.subtitle")}</p>
        </div>

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

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.appPreferences")}</h2>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
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
        </div>
      </section>

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

      <section>
        <button className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all group">
          <LogOut className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold text-red-400">{t("profile.logout")}</span>
        </button>
      </section>

      <div className="text-center text-sm text-gray-500 pt-4">
        <p>{t("profile.version")}</p>
        <p className="mt-1">{t("profile.copyright")}</p>
      </div>

      <SelectionModal
        isOpen={showThemeModal}
        title={t("profile.theme")}
        options={themeSelectionOptions}
        selectedValue={theme || "system"}
        onSelect={(value) => setTheme(value as Theme)}
        onClose={() => setShowThemeModal(false)}
      />

      <SelectionModal
        isOpen={showLanguageModal}
        title={t("profile.language")}
        options={languageSelectionOptions}
        selectedValue={language}
        onSelect={(value) => setLanguage(value as Language)}
        onClose={() => setShowLanguageModal(false)}
      />

      <SelectionModal
        isOpen={showCurrencyModal}
        title={t("profile.currency")}
        options={currencySelectionOptions}
        selectedValue={currency}
        onSelect={(value) => setCurrency(value as Currency)}
        onClose={() => setShowCurrencyModal(false)}
      />
    </div>
  );
}
