"use client";

import { User, LogOut } from "lucide-react";
import { type Theme, type Language, type Currency } from "@/shared/stores/preferences-store";
import { ProfileHeader } from "./components/profile-header";
import { NotificationsSection } from "./components/notifications-section";
import { PreferencesSection } from "./components/preferences-section";
import { SecuritySection } from "./components/security-section";
import { SelectionModal } from "./components/modals/selection-modal";
import { ChangePasswordModal } from "./components/modals/change-password-modal";
import { EditProfileModal } from "./components/modals/edit-profile-modal";
import { TwoFactorModal } from "./components/modals/two-factor-modal";
import { useUserPage } from "./hooks/use-user-page";

export default function UserPage() {
  const {
    mounted, user, language, theme, currency,
    notifications, toggleNotification,
    activeModal, openModal, closeModal,
    t, themeOptions, languageOptions, currencyOptions, notificationSettings,
    currentThemeLabel, currentLanguageLabel, currentCurrencyLabel,
    handleLogout, setTheme, setLanguage, setCurrency,
  } = useUserPage();

  if (!mounted) return <UserPageSkeleton t={t} />;

  return (
    <div className="space-y-6">
      <UserPageHeader t={t} />

      <ProfileHeader user={user} language={language} onEdit={() => openModal("editProfile")} t={t} />

      <NotificationsSection
        notifications={notifications}
        toggleNotification={toggleNotification}
        settings={notificationSettings}
        t={t}
      />

      <PreferencesSection
        currentThemeLabel={currentThemeLabel}
        currentLanguageLabel={currentLanguageLabel}
        currentCurrencyLabel={currentCurrencyLabel}
        onTheme={() => openModal("theme")}
        onLanguage={() => openModal("language")}
        onCurrency={() => openModal("currency")}
        t={t}
      />

      <SecuritySection t={t} />

      <LogoutButton onClick={handleLogout} label={t("profile.logout")} />

      <footer className="text-center text-sm text-gray-500 pt-4">
        <p>{t("profile.version")}</p>
        <p className="mt-1">{t("profile.copyright")}</p>
      </footer>

      <SelectionModal isOpen={activeModal === "theme"} title={t("profile.theme")} options={themeOptions} selectedValue={theme ?? "system"} onSelect={(v) => setTheme(v as Theme)} onClose={closeModal} />
      <SelectionModal isOpen={activeModal === "language"} title={t("profile.language")} options={languageOptions} selectedValue={language} onSelect={(v) => setLanguage(v as Language)} onClose={closeModal} />
      <SelectionModal isOpen={activeModal === "currency"} title={t("profile.currency")} options={currencyOptions} selectedValue={currency} onSelect={(v) => setCurrency(v as Currency)} onClose={closeModal} />
      <ChangePasswordModal isOpen={activeModal === "changePassword"} onClose={closeModal} />
      <EditProfileModal isOpen={activeModal === "editProfile"} onClose={closeModal} />
      <TwoFactorModal isOpen={activeModal === "twoFactor"} onClose={closeModal} />
    </div>
  );
}

function UserPageHeader({ t }: { t: (key: string) => string }) {
  return (
    <header>
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
        <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
          <User className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
        </div>
        {t("profile.title")}
      </h1>
      <p className="text-sm md:text-base text-zinc-500 mt-1">{t("profile.subtitle")}</p>
    </header>
  );
}

function LogoutButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <section>
      <button
        onClick={onClick}
        className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all group"
      >
        <LogOut className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
        <span className="font-semibold text-red-400">{label}</span>
      </button>
    </section>
  );
}

function UserPageSkeleton({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-6">
      <UserPageHeader t={t} />
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 animate-pulse">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-4 space-y-3">
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
