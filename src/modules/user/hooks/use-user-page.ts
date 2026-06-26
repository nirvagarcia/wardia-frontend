"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { useAuthStore } from "@/shared/stores/auth-store";
import { authService } from "@/shared/services/auth-service";
import { getThemeOptions, getLanguageOptions, getCurrencyOptions, getNotificationSettings } from "../utils/helpers";
import type { SelectionOption } from "../components/modals/selection-modal";

export type ModalKey = "theme" | "language" | "currency" | "editProfile" | "changePassword" | "twoFactor";

const toSelectionOptions = (arr: { value: string; label: string }[]): SelectionOption[] =>
  arr.map(({ value, label }) => ({ value, label }));

export function useUserPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { language, setLanguage, currency, setCurrency, notifications, toggleNotification } = usePreferencesStore();

  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const t = (key: string) => getTranslation(language, key);

  const themeRaw = getThemeOptions(t);
  const languageRaw = getLanguageOptions(t);
  const currencyRaw = getCurrencyOptions(t);
  const notificationSettings = getNotificationSettings(t);

  const currentThemeLabel = themeRaw.find((o) => o.value === theme)?.label ?? t("profile.themeSystem");
  const currentLanguageLabel = languageRaw.find((o) => o.value === language)?.label ?? "Español";
  const currentCurrencyLabel = currencyRaw.find((o) => o.value === currency)?.label ?? "Soles (PEN)";

  const openModal = (key: ModalKey) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  };

  return {
    mounted,
    user,
    language,
    theme,
    currency,
    notifications,
    toggleNotification,
    activeModal,
    openModal,
    closeModal,
    t,
    themeOptions: toSelectionOptions(themeRaw),
    languageOptions: toSelectionOptions(languageRaw),
    currencyOptions: toSelectionOptions(currencyRaw),
    notificationSettings,
    currentThemeLabel,
    currentLanguageLabel,
    currentCurrencyLabel,
    handleLogout,
    setTheme,
    setLanguage,
    setCurrency,
  };
}
