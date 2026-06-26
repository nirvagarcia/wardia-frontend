"use client";

import { cn } from "@/shared/utils/cn";

type FilterType = "all" | "pending" | "purchased" | "high";

interface FilterChipsProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "purchased", label: "Comprados" },
  { value: "high", label: "Alta prioridad" },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(({ value, label }) => (
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
