"use client";

import { Settings, Moon, Globe, CreditCard, ChevronRight } from "lucide-react";

interface PreferencesSectionProps {
  currentThemeLabel: string;
  currentLanguageLabel: string;
  currentCurrencyLabel: string;
  onTheme: () => void;
  onLanguage: () => void;
  onCurrency: () => void;
  t: (key: string) => string;
}

export function PreferencesSection({
  currentThemeLabel, currentLanguageLabel, currentCurrencyLabel,
  onTheme, onLanguage, onCurrency, t,
}: PreferencesSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-cyan-500" />
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.appPreferences")}</h2>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <button onClick={onTheme} className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg"><Moon className="w-5 h-5 text-purple-400" /></div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-white">{t("profile.theme")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>{currentThemeLabel}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        <button onClick={onLanguage} className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg"><Globe className="w-5 h-5 text-blue-400" /></div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-white">{t("profile.language")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>{currentLanguageLabel}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        <button onClick={onCurrency} className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg"><CreditCard className="w-5 h-5 text-emerald-400" /></div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-white">{t("profile.currency")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>{currentCurrencyLabel}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </section>
  );
}
