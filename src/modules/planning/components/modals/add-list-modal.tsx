"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { IPlanningList } from "@/shared/types/planning";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface AddListModalProps {
  isOpen: boolean;
  editingList?: IPlanningList;
  onClose: () => void;
  onSave: (data: { title: string; description?: string }) => Promise<void>;
}

export function AddListModal({ isOpen, editingList, onClose, onSave }: AddListModalProps) {
  const { language } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingList) {
      setTitle(editingList.title);
      setDescription(editingList.description ?? "");
    } else {
      setTitle(""); setDescription("");
    }
  }, [editingList, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ title: title.trim(), description: description.trim() || undefined });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {editingList ? t("planning.editList") : t("planning.newList")}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t("planning.listTitle")} *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej: Menaje, Muebles, Electrodomésticos..."
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm",
                "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800",
                "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition"
              )}
              required autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t("planning.listDescription")} ({t("credentials.optional")})</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la lista..."
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm",
                "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800",
                "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition"
              )}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={isSaving || !title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {isSaving ? t("planning.saving") : editingList ? t("planning.saveChanges") : t("planning.createList")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
