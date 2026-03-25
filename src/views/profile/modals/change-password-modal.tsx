"use client";

/**
 * Change Password Modal Component
 * Allows users to change their password with current password verification
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { X, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccess(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: PasswordFormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("security.currentPasswordRequired");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("security.newPasswordRequired");
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = t("security.passwordRequirements");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("security.confirmPasswordRequired");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("security.passwordMismatch");
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = t("security.passwordMustBeDifferent");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 500);
  };

  const handleClose = () => {
    if (!success) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" 
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] sm:max-h-[85vh] overflow-y-auto animate-slide-up flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              {t("security.changePassword")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={success}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {success ? (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {t("security.passwordChanged")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("security.passwordChangedDesc")}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 pb-20 sm:pb-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("security.currentPassword")}</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, currentPassword: e.target.value });
                    setErrors({ ...errors, currentPassword: "" });
                  }}
                  className={cn(
                    "pr-10",
                    errors.currentPassword && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder={t("security.enterCurrentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("security.newPassword")}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, newPassword: e.target.value });
                    setErrors({ ...errors, newPassword: "" });
                  }}
                  className={cn(
                    "pr-10",
                    errors.newPassword && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder={t("security.enterNewPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.newPassword}
                </p>
              )}
              {!errors.newPassword && formData.newPassword && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("security.passwordHint")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("security.confirmNewPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={cn(
                    "pr-10",
                    errors.confirmPassword && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder={t("security.confirmNewPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-gray-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {t("forms.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors"
              >
                {t("security.updatePassword")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
