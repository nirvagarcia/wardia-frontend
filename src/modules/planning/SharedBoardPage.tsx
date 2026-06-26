"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LayoutGrid, Loader2, ExternalLink } from "lucide-react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { planningService } from "@/shared/services/planning-service";
import type { IPlanningBoard } from "@/shared/types/planning";
import { computeBoardStats, computeListStats, formatPrice, getPriorityDot } from "./utils/helpers";
import { cn } from "@/shared/utils/cn";

interface SharedBoardPageProps {
  shareToken: string;
}

export default function SharedBoardPage({ shareToken }: SharedBoardPageProps) {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [board, setBoard] = useState<IPlanningBoard | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    planningService.getSharedBoard(shareToken)
      .then(setBoard)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [shareToken]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;

  if (notFound || !board) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-center p-6">
      <LayoutGrid className="w-12 h-12 text-zinc-300 mb-4" />
      <h1 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t("planning.boardNotFound")}</h1>
      <p className="text-zinc-500 text-sm">{t("planning.boardNotFoundDesc")}</p>
    </div>
  );

  const stats = computeBoardStats(board);
  const activeLists = board.lists.filter((l) => !l.archived);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-cyan-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Wardia</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">{t("planning.sharedView")}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{board.title}</h1>
          {board.description && <p className="text-sm text-zinc-500 mt-1">{board.description}</p>}
          {stats.totalItems > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">{stats.purchasedItems} / {stats.totalItems} {t("planning.items")} {t("planning.purchased")}</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{stats.percentPurchased}%</span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all" style={{ width: `${stats.percentPurchased}%` }} />
              </div>
            </div>
          )}
        </div>

        {activeLists.map((list) => {
          const listStats = computeListStats(list);
          return (
            <div key={list.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{list.title}</h3>
                  {list.description && <p className="text-xs text-zinc-400">{list.description}</p>}
                </div>
                <div className="text-xs text-zinc-400">{listStats.purchased}/{listStats.total}</div>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {list.items.map((item) => {
                  const isPurchased = item.status === "purchased";
                  return (
                    <div key={item.id} className={cn("bg-zinc-50 dark:bg-zinc-800 rounded-xl border overflow-hidden", isPurchased ? "border-emerald-200 dark:border-emerald-800/60 opacity-70" : "border-zinc-200 dark:border-zinc-700")}>
                      {item.imageUrl && (
                        <div className="relative h-28 overflow-hidden">
                          <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width:640px) 50vw,33vw" className={cn("object-cover", isPurchased && "grayscale-[30%]")} />
                        </div>
                      )}
                      <div className="p-2.5">
                        <div className="flex items-start gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", getPriorityDot(item.priority))} />
                          <p className={cn("text-xs font-medium line-clamp-2 leading-snug", isPurchased ? "text-zinc-400 line-through" : "text-zinc-800 dark:text-zinc-200")}>{item.title}</p>
                        </div>
                        {item.priceValue != null && <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1 ml-3">{formatPrice(item.priceValue, item.priceCurrency)}</p>}
                        <div className="flex items-center justify-between mt-2 ml-3">
                          <span className={cn("text-xs", isPurchased ? "text-emerald-500" : "text-zinc-400")}>{isPurchased ? `✓ ${t("planning.itemPurchased")}` : t("planning.itemPending")}</span>
                          {item.links.length > 0 && <a href={item.links[0]?.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-500 transition-colors"><ExternalLink className="w-3 h-3" /></a>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


interface SharedBoardPageProps {
  shareToken: string;
}

export default function SharedBoardPage({ shareToken }: SharedBoardPageProps) {
  const [board, setBoard] = useState<IPlanningBoard | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    planningService.getSharedBoard(shareToken)
      .then(setBoard)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [shareToken]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;

  if (notFound || !board) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-center p-6">
      <LayoutGrid className="w-12 h-12 text-zinc-300 mb-4" />
      <h1 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Tablero no encontrado</h1>
      <p className="text-zinc-500 text-sm">Este tablero no existe o el compartido fue desactivado.</p>
    </div>
  );

  const stats = computeBoardStats(board);
  const activeLists = board.lists.filter((l) => !l.archived);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-cyan-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Wardia</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">Vista compartida</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{board.title}</h1>
          {board.description && <p className="text-sm text-zinc-500 mt-1">{board.description}</p>}
          {stats.totalItems > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">{stats.purchasedItems} / {stats.totalItems} items comprados</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{stats.percentPurchased}%</span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all" style={{ width: `${stats.percentPurchased}%` }} />
              </div>
            </div>
          )}
        </div>

        {activeLists.map((list) => {
          const listStats = computeListStats(list);
          return (
            <div key={list.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{list.title}</h3>
                  {list.description && <p className="text-xs text-zinc-400">{list.description}</p>}
                </div>
                <div className="text-xs text-zinc-400">{listStats.purchased}/{listStats.total}</div>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {list.items.map((item) => {
                  const isPurchased = item.status === "purchased";
                  return (
                    <div key={item.id} className={cn("bg-zinc-50 dark:bg-zinc-800 rounded-xl border overflow-hidden", isPurchased ? "border-emerald-200 dark:border-emerald-800/60 opacity-70" : "border-zinc-200 dark:border-zinc-700")}>
                      {item.imageUrl && (
                        <div className="relative h-28 overflow-hidden">
                          <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width:640px) 50vw,33vw" className={cn("object-cover", isPurchased && "grayscale-[30%]")} />
                        </div>
                      )}
                      <div className="p-2.5">
                        <div className="flex items-start gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", getPriorityDot(item.priority))} />
                          <p className={cn("text-xs font-medium line-clamp-2 leading-snug", isPurchased ? "text-zinc-400 line-through" : "text-zinc-800 dark:text-zinc-200")}>{item.title}</p>
                        </div>
                        {item.priceValue != null && <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1 ml-3">{formatPrice(item.priceValue, item.priceCurrency)}</p>}
                        <div className="flex items-center justify-between mt-2 ml-3">
                          <span className={cn("text-xs", isPurchased ? "text-emerald-500" : "text-zinc-400")}>{isPurchased ? "✓ Comprado" : "Pendiente"}</span>
                          {item.links.length > 0 && <a href={item.links[0]?.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-500 transition-colors"><ExternalLink className="w-3 h-3" /></a>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
