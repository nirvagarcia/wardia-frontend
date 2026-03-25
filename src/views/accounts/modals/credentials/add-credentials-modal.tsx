"use client";

/**
 * Add/Edit Bank Credentials Modal
 * Form for managing banking credentials
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { X, Building2, Lock, Key, Shield, FileText } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import type { IBankCredentials } from "@/shared/types/finance";

interface AddCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credentials: Omit<IBankCredentials, "id" | "lastUpdated">) => void;
  onUpdate?: (id: string, credentials: Omit<IBankCredentials, "id" | "lastUpdated">) => void;
  editingCredential?: IBankCredentials | null;
}

interface CredentialsFormData {
  bankName: string;
  username: string;
  password: string;
  digitalKey: string;
  securityToken: string;
  notes: string;
}

interface CredentialsFormErrors {
  bankName?: string;
  username?: string;
  password?: string;
}

const getInitialFormData = (credential?: IBankCredentials | null): CredentialsFormData => ({
  bankName: credential?.bankName || "",
  username: credential?.username || "",
  password: credential?.password || "",
  digitalKey: credential?.digitalKey || "",
  securityToken: credential?.securityToken || "",
  notes: credential?.notes || "",
});

export function AddCredentialsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate,
  editingCredential 
}: AddCredentialsModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState<CredentialsFormData>(getInitialFormData(editingCredential));
  const [errors, setErrors] = useState<CredentialsFormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(editingCredential));
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingCredential?.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: CredentialsFormErrors = {};
    if (!formData.bankName.trim()) {
      newErrors.bankName = t("forms.bankNameRequired");
    }
    if (!formData.username.trim()) {
      newErrors.username = t("forms.usernameRequired");
    }
    if (!formData.password.trim()) {
      newErrors.password = t("forms.passwordRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const credentialsData = {
      bankName: formData.bankName,
      username: formData.username,
      password: formData.password,
      digitalKey: formData.digitalKey || undefined,
      securityToken: formData.securityToken || undefined,
      notes: formData.notes || undefined,
    };

    if (editingCredential && onUpdate) {
      onUpdate(editingCredential.id, credentialsData);
    } else {
      onSave(credentialsData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {editingCredential 
              ? t("credentials.editCredentials")
              : t("credentials.addCredentials")
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="off">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4" />
              {t("forms.bankName")}
            </Label>
            <Input
              type="text"
              name="bank-name-field"
              autoComplete="chrome-off"
              data-form-type="other"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder={t("forms.bankNamePlaceholder")}
              className={cn(errors.bankName && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4" />
              {t("credentials.username")}
            </Label>
            <Input
              type="text"
              name="credential-username"
              autoComplete="chrome-off"
              data-form-type="other"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder={t("credentials.username")}
              className={cn("font-mono", errors.username && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4" />
              {t("credentials.password")}
            </Label>
            <Input
              type="password"
              name="credential-password"
              autoComplete="chrome-off"
              data-form-type="other"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••"
              className={cn("font-mono", errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              {t("credentials.digitalKey")} ({t("credentials.optional")})
            </Label>
            <Input
              type="text"
              value={formData.digitalKey}
              onChange={(e) => setFormData({ ...formData, digitalKey: e.target.value })}
              placeholder="123456"
              className="font-mono"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              {t("credentials.securityToken")} ({t("credentials.optional")})
            </Label>
            <Input
              type="text"
              value={formData.securityToken}
              onChange={(e) => setFormData({ ...formData, securityToken: e.target.value })}
              placeholder="TOKEN-123"
              className="font-mono"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              {t("credentials.notes")} ({t("credentials.optional")})
            </Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("credentials.notes")}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-colors font-medium shadow-sm"
            >
              {editingCredential 
                ? t("forms.update")
                : t("common.add")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
