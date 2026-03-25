"use client";

/**
 * RegisterView Component
 * Modern registration interface with form validation
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "../components/auth-layout";
import { AuthInput } from "../components/auth-input";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { getPasswordStrengthLabelKey } from "../utils/helpers";

export function RegisterView(): React.JSX.Element {
  const router = useRouter();
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = t("auth.errors.nameRequired");
    } else if (formData.name.length < 2) {
      newErrors.name = t("auth.errors.nameMinLength");
    }

    if (!formData.email) {
      newErrors.email = t("auth.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.errors.emailInvalid");
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = t("auth.errors.phoneInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.errors.passwordMinLength");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.passwordMismatch");
    }

    if (!agreedToTerms) {
      newErrors.terms = t("auth.errors.termsRequired");
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
    }, 1500);
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const strength = passwordStrength();
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  return (
    <AuthLayout
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <AuthInput
          label={t("auth.fullNameLabel")}
          type="text"
          icon={User}
          placeholder={t("auth.fullNamePlaceholder")}
          value={formData.name}
          onChange={handleChange("name")}
          error={errors.name}
          autoComplete="name"
        />

        <AuthInput
          label={t("auth.emailLabel")}
          type="email"
          icon={Mail}
          placeholder={t("auth.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange("email")}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label={t("auth.phoneLabel")}
          type="tel"
          icon={Phone}
          placeholder={t("auth.phonePlaceholder")}
          value={formData.phone}
          onChange={handleChange("phone")}
          error={errors.phone}
          autoComplete="tel"
        />

        <div className="space-y-2">
          <AuthInput
            label={t("auth.passwordLabel")}
            type="password"
            icon={Lock}
            placeholder={t("auth.passwordPlaceholder")}
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete="new-password"
          />
          
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-300",
                      i < strength ? strengthColors[strength - 1] : "bg-zinc-200 dark:bg-zinc-700"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {t("auth.passwordStrengthLabel")}: <span className={cn(
                  "font-medium",
                  strength === 1 && "text-red-600",
                  strength === 2 && "text-orange-600",
                  strength === 3 && "text-yellow-600",
                  strength === 4 && "text-lime-600",
                  strength === 5 && "text-green-600"
                )}>
                  {t(getPasswordStrengthLabelKey(strength - 1))}
                </span>
              </p>
            </div>
          )}
        </div>

        <AuthInput
          label={t("auth.confirmPasswordLabel")}
          type="password"
          icon={Lock}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600 text-cyan-600 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              />
            </div>
            <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-5">
              {t("auth.agreeToTermsPrefix")}{" "}
              <Link
                href="/terms"
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
              >
                {t("auth.termsLink")}
              </Link>
              {" "}{t("auth.agreeToTermsAnd")}{" "}
              <Link
                href="/privacy"
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
              >
                {t("auth.privacyLink")}
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
          )}
        </div>

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
              <span className="hidden sm:inline">{t("auth.registerLoading")}</span>
              <span className="sm:hidden">{t("auth.registerLoadingShort")}</span>
            </>
          ) : (
            <>
              {t("auth.registerButton")}
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
              {t("auth.alreadyHaveAccount")}
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="block w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-center transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("auth.loginLink")}
        </Link>
      </form>
    </AuthLayout>
  );
}
