"use client";

/**
 * Profile View Component
 * Displays user profile, settings, notifications, and preferences.
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { usePreferencesStore, type Theme, type Language, type Currency } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { useAuthStore } from "@/shared/stores/auth-store";
import { authService } from "@/shared/services/auth-service";
import {
  User,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Settings,
  CreditCard,
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
import { ChangePasswordModal } from "./modals/change-password-modal";
import { TwoFactorModal } from "./modals/two-factor-modal";
import { EditProfileModal } from "./modals/edit-profile-modal";
import { ProfileAvatar } from "./components/profile-avatar";

export function ProfileView(): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

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
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
              <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
                <User className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
              {t("profile.title")}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{t("profile.subtitle")}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
              <div className="mt-4 space-y-3">
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto"></div>
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto"></div>
              </div>
            </div>
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

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
            <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
              <User className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
            </div>
            {t("profile.title")}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{t("profile.subtitle")}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <ProfileAvatar name={user?.name ?? ""} />
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name ?? ""}</h2>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                  title="Editar perfil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("profile.memberSince")}{" "}
                {user?.createdAt ? new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(user.createdAt) : ""}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-2 rounded-lg">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("profile.email")}</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user?.email ?? ""}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("profile.phone")}</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.phone ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-500" />
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
                    notifications[setting.key] ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
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
          <Settings className="w-5 h-5 text-cyan-500" />
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
          <Shield className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.security")}</h2>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setShowChangePasswordModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">{t("profile.changePassword")}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          <button 
            onClick={() => setShowTwoFactorModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
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
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all group"
        >
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

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />

      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
      />
    </div>
  );
}
