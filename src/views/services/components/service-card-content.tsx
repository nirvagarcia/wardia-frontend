/**
 * ServiceCardContent - Content displayed within a service card.
 * Extracted for modularity and reusability.
 */

import React from "react";
import Image from "next/image";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ISubscription } from "@/shared/types/finance";
import { getCategoryLabel } from "../utils/helpers";

const categoryIconMap: Record<string, string> = {
  housing: "🏠",
  utilities: "💡",
  telecom: "📱",
  health: "🩺",
  productivity: "📚",
  entertainment: "🎵",
};

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
  locale,
  formatCurrency,
  getFrequencyLabel,
  onEdit,
  onDelete,
  t,
}: ServiceCardContentProps): React.JSX.Element {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="relative w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700">
            {sub.iconUrl ? (
              <Image src={sub.iconUrl} alt={sub.name} fill className="object-cover" unoptimized />
            ) : (
              <span className="text-lg absolute inset-0 flex items-center justify-center">{categoryIconMap[sub.category] || "💳"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{sub.name}</h3>
            <p className={cn(
              "text-xs font-medium mt-0.5",
              daysUntil === 0
                ? "text-red-500 dark:text-red-400"
                : daysUntil <= 3
                ? "text-amber-500 dark:text-amber-400"
                : "text-zinc-400 dark:text-zinc-500"
            )}>
              {daysUntil === 0
                ? t("dashboard.dueToday")
                : daysUntil === 1
                ? t("dashboard.dueTomorrow")
                : t("dashboard.inDays").replace("{days}", daysUntil.toString())}
            </p>
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
            {sub.nextPaymentDate.toLocaleDateString(locale, { month: "short", day: "numeric" })}
          </span>
        </div>
        <span className="px-2 py-0.5 bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full capitalize whitespace-nowrap font-medium">
          {getFrequencyLabel(sub.frequency)}
        </span>
        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 rounded-full capitalize whitespace-nowrap font-medium">
          {getCategoryLabel(sub.category, t)}
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
