"use client";

import Image from "next/image";
import { X, ExternalLink, ShoppingBag, Edit2, Trash2, Flag, Tag, StickyNote, CheckCircle2, Circle, ImageIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { IPlanningItem } from "@/shared/types/planning";
import { getPriorityColor, getStatusColor, formatPrice, formatDate } from "../../utils/helpers";
import { useCallback } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface ItemDetailModalProps {
  item: IPlanningItem | null;
  onClose: () => void;
  onEdit: (item: IPlanningItem) => void;
  onDelete: (item: IPlanningItem) => void;
  onPurchase: (item: IPlanningItem) => void;
}

export function ItemDetailModal({ item, onClose, onEdit, onDelete, onPurchase }: ItemDetailModalProps) {
  const { language } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);
  if (!item) return null;

  const isPurchased = item.status === "purchased";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {item.imageUrl ? (
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image src={item.imageUrl} alt={item.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="relative h-48 overflow-hidden rounded-t-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 dark:bg-black/50 hover:bg-black/20 dark:hover:bg-black/70 transition-colors">
              <X className="w-4 h-4 text-zinc-600 dark:text-white" />
            </button>
          </div>
        )}

        <div className="px-6 pt-5 pb-3">
          <div className="flex-1">
            <h2 className={cn("font-semibold text-zinc-900 dark:text-zinc-100 text-lg leading-tight", isPurchased && "line-through text-zinc-500 dark:text-zinc-400")}>
              {item.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", getStatusColor(item.status))}>
                {isPurchased ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                {isPurchased ? t("planning.itemPurchased") : t("planning.itemPending")}
              </span>
              <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full", getPriorityColor(item.priority))}>
                <Flag className="w-3 h-3" />
                {item.priority === "high" ? t("planning.itemPriorityHigh") : item.priority === "medium" ? t("planning.itemPriorityMedium") : t("planning.itemPriorityLow")}
              </span>
              {item.priceValue != null && (
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {formatPrice(item.priceValue * item.quantity, item.priceCurrency)}
                  {item.quantity > 1 && <span className="text-xs font-normal text-zinc-400 ml-1">({item.quantity} u.)</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {item.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
          )}

          {isPurchased && item.purchasedAt && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <p className="text-sm text-cyan-700 dark:text-cyan-300">{getTranslation(language, "planning.purchasedOn", { date: formatDate(item.purchasedAt!) })}</p>
            </div>
          )}

          {item.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs text-zinc-500 font-medium">
                <Tag className="w-3.5 h-3.5" />
                {t("planning.itemTags")}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.links.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                {t("planning.itemLinks")}
              </p>
              <div className="space-y-1.5">
                {item.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-colors group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-500 flex-shrink-0 transition-colors" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate transition-colors">
                      {link.label || link.url}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.notes && (
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                {t("planning.itemNotes")}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {!isPurchased && (
              <button
                onClick={() => onPurchase(item)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {t("planning.markAsPurchased")}
              </button>
            )}
            <button
              onClick={() => onEdit(item)}
              className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
