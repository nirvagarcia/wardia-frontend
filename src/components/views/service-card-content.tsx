/**
 * ServiceCardContent - Content displayed within a service card.
 * Extracted for modularity and reusability.
 */

import React from "react";
import { Calendar, DollarSign, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ISubscription } from "@/types/finance";

interface ServiceCardContentProps {
  sub: ISubscription;
  daysUntil: number;
  isDueSoon: boolean;
  locale: string;
  formatCurrency: (amount: { value: number; currency: string }) => string;
  getFrequencyLabel: (freq: string) => string;
  getStatusLabel: (status: string) => string;
  onEdit: (service: ISubscription) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export function ServiceCardContent({
  sub,
  daysUntil,
  isDueSoon,
  locale,
  formatCurrency,
  getFrequencyLabel,
  getStatusLabel,
  onEdit,
  onDelete,
  t,
}: ServiceCardContentProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              "bg-cyan-500/10 ring-1 ring-cyan-500/10"
            )}
          >
            <DollarSign className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
              {sub.name}
            </h3>
            {sub.description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">{sub.description}</p>
            )}
          </div>
        </div>

        <div
          className="flex items-center gap-0.5 flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(sub)}
            className="p-1.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group/btn"
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover/btn:text-blue-500" />
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover/btn:text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-500">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {sub.nextPaymentDate.toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {isDueSoon && (
          <span className="font-semibold text-teal-600 dark:text-teal-400 whitespace-nowrap">
            {daysUntil === 0
              ? t("dashboard.dueToday")
              : daysUntil === 1
              ? t("dashboard.dueTomorrow")
              : t("dashboard.inDays").replace("{days}", daysUntil.toString())}
          </span>
        )}

        <span className="px-2 py-0.5 bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full capitalize whitespace-nowrap font-medium">
          {getFrequencyLabel(sub.frequency)}
        </span>

        {sub.autoRenewal && (
          <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full whitespace-nowrap ring-1 ring-cyan-500/10 font-medium">
            {t("services.autoRenewal")}
          </span>
        )}

        <span
          className={cn(
            "px-2 py-0.5 rounded-full whitespace-nowrap font-medium",
            sub.status === "active"
              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/10"
              : "bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500"
          )}
        >
          {getStatusLabel(sub.status)}
        </span>
      </div>

      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <p className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {formatCurrency(sub.amount)}
        </p>
      </div>
    </div>
  );
}
