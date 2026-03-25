/**
 * Credential Field Component
 * Displays a single credential field with copy functionality.
 */

import React from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface CredentialFieldProps {
  label: string;
  value: string;
  fieldId: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onCopy: (text: string, fieldId: string) => void;
  copiedFields: Set<string>;
}

export function CredentialField({
  label,
  value,
  fieldId,
  icon,
  isPassword = false,
  isVisible = true,
  onToggleVisibility,
  onCopy,
  copiedFields,
}: CredentialFieldProps): React.JSX.Element {
  const displayValue = isPassword && !isVisible ? "••••••••" : value;

  return (
    <div>
      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block flex items-center gap-1">
        {icon}
        {label}
      </label>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-mono text-zinc-900 dark:text-white cursor-text select-text">
          {displayValue}
        </div>
        {isPassword && onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
            title={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? (
              <EyeOff className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <Eye className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            )}
          </button>
        )}
        <button
          onClick={() => onCopy(value, fieldId)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            copiedFields.has(fieldId)
              ? "bg-cyan-500 text-white"
              : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
          )}
          title="Copy"
        >
          {copiedFields.has(fieldId) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
