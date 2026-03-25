/**
 * Modal Actions Component
 * Cancel and submit buttons for modal dialogs.
 */

import React from "react";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelLabel: string;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function ModalActions({
  onCancel,
  onSubmit,
  cancelLabel,
  submitLabel,
  isSubmitting = false,
}: ModalActionsProps): React.JSX.Element {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors disabled:opacity-50 shadow-sm"
      >
        {submitLabel}
      </button>
    </div>
  );
}
