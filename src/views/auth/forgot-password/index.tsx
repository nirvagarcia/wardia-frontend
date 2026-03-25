"use client";

/**
 * ForgotPasswordView Component
 * Password recovery interface
 */

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "../components/auth-layout";
import { AuthInput } from "../components/auth-input";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

export function ForgotPasswordView(): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      setError(t("auth.errors.emailRequired"));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.errors.emailInvalid"));
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  if (emailSent) {
    return (
      <AuthLayout
        title={t("auth.checkEmailTitle")}
        subtitle={t("auth.checkEmailSubtitle")}
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-cyan-100 dark:bg-cyan-900/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-zinc-700 dark:text-zinc-300">
              {t("auth.emailSentTo")}
            </p>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {email}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 pt-2">
              {t("auth.checkSpam")}
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("auth.backToLogin")}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotPasswordSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <AuthInput
          label={t("auth.emailLabel")}
          type="email"
          icon={Mail}
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
            "bg-gradient-to-r from-cyan-500 to-blue-600",
            "hover:from-cyan-600 hover:to-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transform hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden sm:inline">{t("auth.sending")}</span>
              <span className="sm:hidden">{t("auth.sending")}</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{t("auth.sendRecoveryLink")}</span>
              <span className="sm:hidden">{t("auth.sendRecoveryLinkShort")}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
