/**
 * Modal Header Component
 * Reusable header for modal dialogs.
 */

import React from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps): React.JSX.Element {
  return (
    <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </button>
    </div>
  );
}
