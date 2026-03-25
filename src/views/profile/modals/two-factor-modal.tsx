"use client";

/**
 * Two-Factor Authentication Modal Component
 * Allows users to enable/disable 2FA and configure authentication methods
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { X, Shield, Smartphone, Mail, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TwoFactorMethod = "app" | "sms" | "email";
type TwoFactorStep = "select" | "setup" | "verify" | "success";

export function TwoFactorModal({ isOpen, onClose }: TwoFactorModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState<TwoFactorStep>("select");
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [qrCode] = useState("WARDIA2FA-DEMO-CODE-123456");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setStep(isEnabled ? "select" : "select");
    setSelectedMethod(null);
    setVerificationCode("");
    setError("");
    setCopied(false);
  }, [isOpen, isEnabled]);

  if (!isOpen) return null;

  const handleMethodSelect = (method: TwoFactorMethod) => {
    setSelectedMethod(method);
    setStep("setup");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError(t("security.invalidCode"));
      return;
    }

    setTimeout(() => {
      setIsEnabled(true);
      setStep("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 500);
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setStep("select");
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const renderSelectMethod = () => (
    <div className="p-4 sm:p-6 space-y-4 pb-20 sm:pb-6">
      <div className="space-y-3">
        <button
          onClick={() => handleMethodSelect("app")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
        >
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <Smartphone className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{t("security.authenticatorApp")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t("security.authenticatorAppDesc")}</p>
          </div>
        </button>

        <button
          onClick={() => handleMethodSelect("sms")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
        >
          <div className="bg-emerald-500/20 p-3 rounded-lg">
            <Smartphone className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{t("security.smsCodes")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t("security.smsCodesDesc")}</p>
          </div>
        </button>

        <button
          onClick={() => handleMethodSelect("email")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
        >
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-white">{t("security.emailCodes")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t("security.emailCodesDesc")}</p>
          </div>
        </button>
      </div>

      {isEnabled && (
        <div className="pt-4">
          <button
            onClick={handleDisable}
            className="w-full px-4 py-3 rounded-xl border border-red-500 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            {t("security.disable2FA")}
          </button>
        </div>
      )}
    </div>
  );

  const renderSetup = () => (
    <div className="p-4 sm:p-6 space-y-5 pb-20 sm:pb-6">
      {selectedMethod === "app" && (
        <>
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("security.scanQRCode")}
            </p>
            <div className="bg-white p-4 rounded-xl inline-block">
              <div className="w-48 h-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                <Shield className="w-16 h-16 text-zinc-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("security.orEnterManually")}
            </p>
            <div className="flex items-center gap-2 justify-center">
              <code className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-mono">
                {qrCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {selectedMethod === "sms" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t("security.smsSetupDesc")}
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              +51 999 999 999
            </p>
          </div>
        </div>
      )}

      {selectedMethod === "email" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t("security.emailSetupDesc")}
          </p>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              user@example.com
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="verificationCode">{t("security.enterVerificationCode")}</Label>
        <Input
          id="verificationCode"
          type="text"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => {
            setVerificationCode(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          className={cn(
            "text-center text-2xl tracking-widest font-mono",
            error && "border-red-500 focus:ring-red-500"
          )}
          placeholder="000000"
        />
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1 justify-center">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep("select")}
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-gray-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {t("forms.back")}
        </button>
        <button
          type="button"
          onClick={handleVerify}
          className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors"
        >
          {t("security.verify")}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
      <div className="bg-emerald-500/20 p-4 rounded-full">
        <CheckCircle className="w-12 h-12 text-emerald-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {t("security.2FAEnabled")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("security.2FAEnabledDesc")}
        </p>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" 
      onClick={step !== "success" ? onClose : undefined}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] sm:max-h-[85vh] overflow-y-auto animate-slide-up flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              {t("security.twoFactorAuth")}
            </h2>
          </div>
          {step !== "success" && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          )}
        </div>

        {step === "select" && renderSelectMethod()}
        {step === "setup" && renderSetup()}
        {step === "success" && renderSuccess()}
      </div>
    </div>
  );
}
