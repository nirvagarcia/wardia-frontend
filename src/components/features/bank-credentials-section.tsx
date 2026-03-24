"use client";

/**
 * Bank Credentials Section
 * Displays and manages banking credentials with secure copy-to-clipboard functionality
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { Building2, Eye, EyeOff, Copy, Check, Lock, Key, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IBankCredentials } from "@/types/finance";

interface BankCredentialsSectionProps {
  credentials: IBankCredentials[];
}

export function BankCredentialsSection({ credentials }: BankCredentialsSectionProps): React.JSX.Element {
  const { language } = usePreferencesStore();

  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  const togglePasswordVisibility = (credId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(credId)) {
        newSet.delete(credId);
      } else {
        newSet.add(credId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFields((prev) => new Set(prev).add(fieldId));
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      }, 2000);
    });
  };

  if (credentials.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {language === "es" ? "No hay credenciales bancarias registradas" : "No bank credentials registered"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {credentials.map((cred) => {
        const isExpanded = expandedBank === cred.id;
        const isPasswordVisible = visiblePasswords.has(cred.id);

        return (
          <div
            key={cred.id}
            className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
          >
            {/* Header - Always Visible */}
            <button
              onClick={() => setExpandedBank(isExpanded ? null : cred.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{cred.bankName}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {language === "es" ? "Credenciales de acceso" : "Access credentials"}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>

            {/* Credentials Details - Expandable */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {language === "es" ? "Usuario" : "Username"}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                      <code className="text-sm text-zinc-900 dark:text-white font-mono">{cred.username}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cred.username, `${cred.id}-username`)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        copiedFields.has(`${cred.id}-username`)
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      {copiedFields.has(`${cred.id}-username`) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    {language === "es" ? "Contraseña" : "Password"}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center gap-2">
                      <code className="flex-1 text-sm text-zinc-900 dark:text-white font-mono">
                        {isPasswordVisible ? cred.password : "••••••••••••"}
                      </code>
                      <button
                        onClick={() => togglePasswordVisibility(cred.id)}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cred.password, `${cred.id}-password`)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        copiedFields.has(`${cred.id}-password`)
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      {copiedFields.has(`${cred.id}-password`) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Digital Key (Optional) */}
                {cred.digitalKey && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {language === "es" ? "Clave Digital" : "Digital Key"}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <code className="text-sm text-zinc-900 dark:text-white font-mono">{cred.digitalKey}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cred.digitalKey!, `${cred.id}-digitalkey`)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          copiedFields.has(`${cred.id}-digitalkey`)
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {copiedFields.has(`${cred.id}-digitalkey`) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Token (Optional) */}
                {cred.securityToken && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {language === "es" ? "Token de Seguridad" : "Security Token"}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <code className="text-sm text-zinc-900 dark:text-white font-mono">{cred.securityToken}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(cred.securityToken!, `${cred.id}-token`)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          copiedFields.has(`${cred.id}-token`)
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {copiedFields.has(`${cred.id}-token`) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes (Optional) */}
                {cred.notes && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-800 dark:text-amber-300">{cred.notes}</p>
                  </div>
                )}

                {/* Last Updated */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {language === "es" ? "Actualizado: " : "Updated: "}
                    {cred.lastUpdated.toLocaleDateString(language === "es" ? "es-PE" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
