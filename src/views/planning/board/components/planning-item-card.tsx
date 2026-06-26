"use client";

import Image from "next/image";
import { ExternalLink, CheckCircle2, Circle, ImageIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { IPlanningItem } from "@/shared/types/planning";
import { getStatusColor, formatPrice } from "../../utils/helpers";

interface PlanningItemCardProps {
  item: IPlanningItem;
  onClick: () => void;
}

export function PlanningItemCard({ item, onClick }: PlanningItemCardProps) {
  const isPurchased = item.status === "purchased";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full",
        !isPurchased && "hover:shadow-md"
      )}
    >
      <div className="relative h-32 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className={cn("object-cover transition-transform duration-300", !isPurchased && "group-hover:scale-105", isPurchased && "brightness-75")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/80">
            <ImageIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
          </div>
        )}
      </div>

      <div className={cn("p-3 flex flex-col flex-1", isPurchased && "opacity-50")}>
        <div className="flex items-start gap-1.5 mb-1">
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", isPurchased ? "bg-emerald-500" : "bg-yellow-400")} />
          <p className={cn("text-sm font-medium leading-snug line-clamp-1", isPurchased ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100")}>
            {item.title}
          </p>
        </div>

        {item.priceValue != null && (
          <div className="mt-1 ml-3.5">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatPrice(item.priceValue * item.quantity, item.priceCurrency)}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 mt-2 ml-3.5 h-5 overflow-hidden">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] leading-none whitespace-nowrap">
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none whitespace-nowrap">
              +{item.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2.5 ml-3.5">
          <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", getStatusColor(item.status))}>
            {isPurchased ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
            {isPurchased ? "Comprado" : "Pendiente"}
          </span>
          {item.links.length > 0 && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {item.links.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label ?? link.url}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-cyan-500 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
              {item.links.length > 2 && <span className="text-xs text-zinc-400">+{item.links.length - 2}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
