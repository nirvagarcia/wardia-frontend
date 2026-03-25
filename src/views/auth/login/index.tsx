"use client";

/**
 * LoginView Component
 * Modern login interface with form validation
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "../components/auth-layout";
import { AuthInput } from "../components/auth-input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

export function LoginView(): React.JSX.Element {
  const router = useRouter();
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t("auth.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("auth.errors.emailInvalid");
    }

    if (!password) {
      newErrors.password = t("auth.errors.passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("auth.errors.passwordMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <AuthLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <AuthInput
          label={t("auth.emailLabel")}
          type="email"
          icon={Mail}
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label={t("auth.passwordLabel")}
          type="password"
          icon={Lock}
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-zinc-300 dark:border-zinc-600 text-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
            />
            <span className="text-zinc-600 dark:text-zinc-400">{t("auth.rememberMe")}</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition-colors"
          >
            {t("auth.forgotPasswordLink")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
            "bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600",
            "hover:from-emerald-700 hover:via-cyan-700 hover:to-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transform hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden sm:inline">{t("auth.loggingIn")}</span>
              <span className="sm:hidden">{t("auth.loggingInShort")}</span>
            </>
          ) : (
            <>
              {t("auth.loginButton")}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 dark:bg-zinc-900/80 text-zinc-500">
              {t("auth.noAccount")}
            </span>
          </div>
        </div>

        <Link
          href="/register"
          className="block w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-center transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("auth.createAccount")}
        </Link>
      </form>
    </AuthLayout>
  );
}
