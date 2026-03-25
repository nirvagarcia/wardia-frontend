/**
 * Selection Modal Component
 * Reusable modal for theme, language, and currency selection.
 */

import React from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectionOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SelectionModalProps {
  isOpen: boolean;
  title: string;
  options: SelectionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SelectionModal({
  isOpen,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectionModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                  isSelected
                    ? "bg-emerald-500/20 border-2 border-emerald-500"
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isSelected ? "text-emerald-500" : "text-zinc-600 dark:text-zinc-400"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
