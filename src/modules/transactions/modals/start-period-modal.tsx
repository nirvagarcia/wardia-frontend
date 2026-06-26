"use client";

import React, { useState, useEffect } from "react";
import { Banknote, X, ChevronRight } from "lucide-react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label } from "@/shared/components/ui/label";
import { useStartNewPeriod } from "@/shared/hooks/use-periods-query";
import { cn } from "@/shared/utils/cn";

interface StartPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriodLabel: string;
}

function suggestLabel(paymentDate: Date, language: string): string {
  const refDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);
  if (paymentDate.getDate() >= 20) {
    refDate.setMonth(refDate.getMonth() + 1);
  }
  const raw = refDate.toLocaleDateString(language === "es" ? "es-PE" : "en-US", {
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === "es" ? "es-PE" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function StartPeriodModal({
  isOpen,
  onClose,
  currentPeriodLabel,
}: StartPeriodModalProps): React.JSX.Element | null {
  const { language } = usePreferencesStore();
  const t = (key: string, vars?: Record<string, string>) =>
    getTranslation(language, key, vars);

  const today = new Date();
  const [paymentDate, setPaymentDate] = useState<Date>(today);
  const [label, setLabel] = useState(() => suggestLabel(today, language));
  const { mutateAsync, isPending } = useStartNewPeriod();

  useEffect(() => {
    if (isOpen) {
      setPaymentDate(today);
      setLabel(suggestLabel(today, language));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setLabel(suggestLabel(paymentDate, language));
  }, [paymentDate, language]);

  const closingDate = new Date(paymentDate);
  closingDate.setDate(closingDate.getDate() - 1);

  const handleConfirm = async () => {
    await mutateAsync({ paymentDate: toLocalDateString(paymentDate), label });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Banknote className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {t("transactions.startNewPeriod")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("transactions.whenGotPaid")}</Label>
            <DatePicker
              value={paymentDate}
              onChange={(d) => d && setPaymentDate(d)}
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                {language === "es" ? "Cierra" : "Closes"}
              </p>
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{currentPeriodLabel}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {formatDisplayDate(closingDate, language)}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <div className="flex-1 text-center">
              <p className="text-[10px] font-medium text-cyan-500 uppercase tracking-wide mb-1">
                {t("transactions.nextPeriod")}
              </p>
              <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{label}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {formatDisplayDate(paymentDate, language)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-colors text-sm",
              "bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white"
            )}
          >
            {isPending ? "..." : t("transactions.confirmPeriod")}
          </button>
        </div>
      </div>
    </div>
  );
}

