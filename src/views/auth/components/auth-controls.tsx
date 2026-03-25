"use client";

/**
 * AuthControls Component
 * Theme and language controls for auth pages
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe } from "lucide-react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";

export function AuthControls(): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = usePreferencesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center gap-2" />;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-cyan-600" />
        )}
      </button>

      <button
        onClick={() => setLanguage(language === "es" ? "en" : "es")}
        className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2 min-w-[4rem]"
        aria-label="Toggle language"
      >
        <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <span className="text-sm font-medium text-zinc-900 dark:text-white uppercase">
          {language}
        </span>
      </button>
    </div>
  );
}
