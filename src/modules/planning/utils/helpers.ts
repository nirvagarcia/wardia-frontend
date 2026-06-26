import type { IPlanningBoard, IPlanningList, IPlanningItem, ItemPriority, ItemStatus, IBoardSummary } from "@/shared/types/planning";

export function computeBoardStats(board: IPlanningBoard | IBoardSummary) {
  const allItems = board.lists.flatMap((l) => l.items as Pick<IPlanningItem, "status" | "priceValue" | "quantity">[]);
  const purchased = allItems.filter((i) => i.status === "purchased");
  const estimatedTotal = allItems.reduce((s, i) => s + (i.priceValue ?? 0) * (i.quantity ?? 1), 0);
  const purchasedTotal = purchased.reduce((s, i) => s + (i.priceValue ?? 0) * (i.quantity ?? 1), 0);
  return {
    totalItems: allItems.length,
    purchasedItems: purchased.length,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
    purchasedTotal: Math.round(purchasedTotal * 100) / 100,
    percentPurchased: allItems.length > 0 ? Math.round((purchased.length / allItems.length) * 100) : 0,
  };
}

export function computeListStats(list: IPlanningList) {
  const purchased = list.items.filter((i) => i.status === "purchased");
  const estimatedTotal = list.items.reduce((s, i) => s + (i.priceValue ?? 0) * (i.quantity ?? 1), 0);
  const purchasedTotal = purchased.reduce((s, i) => s + (i.priceValue ?? 0) * (i.quantity ?? 1), 0);
  const pendingTotal = estimatedTotal - purchasedTotal;
  return {
    total: list.items.length,
    purchased: purchased.length,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
    purchasedTotal: Math.round(purchasedTotal * 100) / 100,
    pendingTotal: Math.round(pendingTotal * 100) / 100,
    percentPurchased: list.items.length > 0 ? Math.round((purchased.length / list.items.length) * 100) : 0,
  };
}

export function getPriorityColor(priority: ItemPriority): string {
  return {
    low: "text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
    medium: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    high: "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
  }[priority];
}

export function getPriorityDot(priority: ItemPriority): string {
  return {
    low: "bg-zinc-400",
    medium: "bg-amber-400",
    high: "bg-rose-500",
  }[priority];
}

export function getStatusColor(status: ItemStatus): string {
  return status === "purchased"
    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
    : "text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700";
}

export function filterItems(items: IPlanningItem[], filter: "all" | "pending" | "purchased" | "high"): IPlanningItem[] {
  if (filter === "all") return items;
  if (filter === "high") return items.filter((i) => i.priority === "high");
  return items.filter((i) => i.status === filter);
}

export function formatPrice(value: number | null | undefined, currency: string): string {
  if (value == null) return "";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency || "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export const PURCHASE_CATEGORIES = [
  "Hogar", "Electrodomésticos", "Muebles", "Ropa", "Electrónica",
  "Alimentos", "Salud", "Deportes", "Entretenimiento", "Regalo", "Viaje", "Otro",
] as const;
