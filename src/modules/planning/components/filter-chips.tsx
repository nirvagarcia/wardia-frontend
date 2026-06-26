"use client";

import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { cn } from "@/shared/utils/cn";

type FilterType = "all" | "pending" | "purchased" | "high";

interface FilterChipsProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTER_VALUES: FilterType[] = ["all", "pending", "purchased", "high"];
const FILTER_KEYS = ["planning.filterAll", "planning.filterPending", "planning.filterPurchased", "planning.filterHighPriority"];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const filters = FILTER_VALUES.map((value, i) => ({ value, label: t(FILTER_KEYS[i]!) }));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150",
            active === value
              ? "bg-cyan-500 text-white shadow-sm"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export type { FilterType };
