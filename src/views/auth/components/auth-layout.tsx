"use client";

/**
 * AuthLayout Component
 * Shared layout for authentication pages
 */

import React from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { AuthControls } from "./auth-controls";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-cyan-950 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <AuthControls />
      </div>

      <div className="relative w-full max-w-md lg:max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-4">
            <Image
              src="/assets/wardia-icon.png"
              alt="WARDIA"
              width={64}
              height={64}
              className="w-14 h-14 sm:w-16 sm:h-16"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            {t("auth.appTagline")}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Personal Finance Manager
          </p>
        </div>

        <div className={cn(
          "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8",
          className
        )}>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              {subtitle}
            </p>
          </div>
          {children}
        </div>

        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {t("auth.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}
