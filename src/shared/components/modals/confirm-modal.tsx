"use client";

/**
 * Confirmation Modal
 * Reusable confirmation dialog for destructive actions
 */

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
}: ConfirmModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md animate-slide-up shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                variant === "danger" && "bg-red-500/10",
                variant === "warning" && "bg-amber-500/10",
                variant === "info" && "bg-blue-500/10"
              )}>
                <AlertTriangle className={cn(
                  "w-6 h-6",
                  variant === "danger" && "text-red-500 dark:text-red-400",
                  variant === "warning" && "text-amber-500 dark:text-amber-400",
                  variant === "info" && "text-blue-500 dark:text-blue-400"
                )} />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "flex-1 px-6 py-3 rounded-xl text-white transition-colors font-medium",
              variant === "danger" && "bg-red-600 hover:bg-red-700",
              variant === "warning" && "bg-amber-600 hover:bg-amber-700",
              variant === "info" && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
