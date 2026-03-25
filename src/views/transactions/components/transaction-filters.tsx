/**
 * TransactionFilters Component
 * Provides type and category filtering for transactions
 */

"use client";

import React from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type FilterType = "all" | "income" | "expense";

interface TransactionFiltersProps {
  filterType: FilterType;
  selectedCategories: string[];
  showFilters: boolean;
  hasActiveFilters: boolean;
  currentFilterCategories: Array<{ id: string; label: string; icon: string }>;
  onFilterTypeChange: (type: FilterType) => void;
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  allLabel: string;
  incomeLabel: string;
  expensesLabel: string;
  filtersLabel: string;
  filterByCategoryLabel: string;
  clearFiltersLabel: string;
}

export function TransactionFilters({
  filterType,
  selectedCategories,
  showFilters,
  hasActiveFilters,
  currentFilterCategories,
  onFilterTypeChange,
  onToggleCategory,
  onClearFilters,
  onToggleFilters,
  allLabel,
  incomeLabel,
  expensesLabel,
  filtersLabel,
  filterByCategoryLabel,
  clearFiltersLabel,
}: TransactionFiltersProps): React.JSX.Element {
  return (
    <div className="card-surface rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {filtersLabel}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {clearFiltersLabel}
          </button>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => onFilterTypeChange("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filterType === "all"
              ? "bg-cyan-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          {allLabel}
        </button>
        <button
          onClick={() => onFilterTypeChange("income")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filterType === "income"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          {incomeLabel}
        </button>
        <button
          onClick={() => onFilterTypeChange("expense")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filterType === "expense"
              ? "bg-red-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          )}
        >
          {expensesLabel}
        </button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {filterByCategoryLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {currentFilterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onToggleCategory(category.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                  selectedCategories.includes(category.id)
                    ? "bg-cyan-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onToggleFilters}
        className="w-full text-sm text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
      >
        {showFilters ? "Ocultar categorías" : "Ver todas las categorías"}
      </button>
    </div>
  );
}
