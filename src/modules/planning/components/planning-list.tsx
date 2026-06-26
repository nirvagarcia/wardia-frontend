"use client";

import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2, ArchiveX, CheckSquare, Plus, GripVertical } from "lucide-react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { cn } from "@/shared/utils/cn";
import type { IPlanningItem, IPlanningList } from "@/shared/types/planning";
import { PlanningItemCard } from "./planning-item-card";
import { computeListStats, filterItems, formatPrice } from "../utils/helpers";
import type { FilterType } from "./filter-chips";

function SortableItem({
  item, onItemClick,
}: {
  item: IPlanningItem;
  activeFilter: FilterType;
  onItemClick: (item: IPlanningItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative h-full">
      <div
        {...listeners}
        className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>
      <PlanningItemCard item={item} onClick={() => onItemClick(item)} />
    </div>
  );
}

interface PlanningListProps {
  list: IPlanningList;
  activeFilter: FilterType;
  onAddItem: (listId: string) => void;
  onEditList: (list: IPlanningList) => void;
  onDeleteList: (list: IPlanningList) => void;
  onArchiveList: (list: IPlanningList) => void;
  onCompleteList: (list: IPlanningList) => void;
  onItemClick: (item: IPlanningItem, listId: string) => void;
  onReorderItems: (listId: string, items: { id: string; order: number }[]) => void;
}

export function PlanningList({
  list, activeFilter, onAddItem, onEditList, onDeleteList, onArchiveList, onCompleteList, onItemClick, onReorderItems,
}: PlanningListProps) {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<IPlanningItem[]>(list.items);
  const stats = computeListStats(list);
  const visibleItems = filterItems(items, activeFilter);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    onReorderItems(list.id, reordered.map((it, idx) => ({ id: it.id, order: idx })));
  };

  React.useEffect(() => { setItems(list.items); }, [list.items]);

  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="bg-zinc-50/80 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{list.title}</h3>
            <span className="flex-shrink-0 text-xs text-zinc-400 font-normal">
              {stats.purchased}/{stats.total}
            </span>
          </div>
          {stats.estimatedTotal > 0 && (
            <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
              {stats.purchasedTotal > 0 && (
                <span className="text-emerald-500 font-medium">{formatPrice(stats.purchasedTotal, "PEN")} {t("planning.spent")}</span>
              )}
              {stats.purchasedTotal > 0 && stats.pendingTotal > 0 && <span>·</span>}
              {stats.pendingTotal > 0 && (
                <span>{formatPrice(stats.pendingTotal, "PEN")} {t("planning.pending")}</span>
              )}
              {stats.purchasedTotal === 0 && (
                <span>{formatPrice(stats.estimatedTotal, "PEN")} {t("planning.estimated")}</span>
              )}
            </div>
          )}
        </div>

        {stats.total > 0 && (
          <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mx-3 flex-shrink-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentPurchased}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddItem(list.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 min-w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                  {[
                    { icon: Edit2, label: t("planning.editList"), action: () => onEditList(list) },
                    { icon: CheckSquare, label: t("planning.completeList"), action: () => onCompleteList(list), disabled: pendingCount === 0 },
                    { icon: ArchiveX, label: t("planning.archiveList"), action: () => onArchiveList(list) },
                    { icon: Trash2, label: t("planning.deleteList"), action: () => onDeleteList(list), danger: true },
                  ].map(({ icon: Icon, label, action, danger, disabled }) => (
                    <button
                      key={label}
                      disabled={disabled}
                      onClick={() => { action(); setMenuOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed",
                        danger
                          ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-3">
        {visibleItems.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-zinc-400">
              {activeFilter !== "all" ? t("planning.noItemsFilter") : t("planning.noItems")}
            </p>
            {activeFilter === "all" && (
              <button
                onClick={() => onAddItem(list.id)}
                className="mt-2 text-xs text-cyan-500 hover:text-cyan-600 transition-colors"
              >
                {t("planning.addFirstItem")}
              </button>
            )}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={visibleItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {visibleItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    activeFilter={activeFilter}
                    onItemClick={(i) => onItemClick(i, list.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
