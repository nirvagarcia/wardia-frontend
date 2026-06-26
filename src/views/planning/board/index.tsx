"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Plus, Loader2, Share2, ShieldOff, Link as LinkIcon } from "lucide-react";
import {
  useBoardDetailQuery, useAddList, useUpdateList, useDeleteList, useArchiveList, useCompleteList,
  useAddItem, useUpdateItem, useDeleteItem, usePurchaseItem, useReorderItems, useToggleShare,
  computeBoardStats,
} from "@/shared/hooks/use-planning-query";
import type { IPlanningItem, IPlanningList, IPurchaseItemPayload } from "@/shared/types/planning";
import { FilterChips, type FilterType } from "./components/filter-chips";
import { PlanningList } from "./components/planning-list";
import { AddListModal } from "./modals/add-list-modal";
import { AddItemModal, type ItemFormPayload } from "./modals/add-item-modal";
import { PurchaseModal } from "./modals/purchase-modal";
import { ItemDetailModal } from "./modals/item-detail-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { formatPrice } from "../utils/helpers";
import { cn } from "@/shared/utils/cn";

interface BoardDetailViewProps {
  boardId: string;
}

export function BoardDetailView({ boardId }: BoardDetailViewProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [editingList, setEditingList] = useState<IPlanningList | null>(null);
  const [deletingList, setDeletingList] = useState<IPlanningList | null>(null);
  const [completingList, setCompletingList] = useState<IPlanningList | null>(null);

  const [addItemListId, setAddItemListId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: IPlanningItem; listId: string } | null>(null);
  const [detailItem, setDetailItem] = useState<{ item: IPlanningItem; listId: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ item: IPlanningItem; listId: string } | null>(null);
  const [purchasingItem, setPurchasingItem] = useState<{ item: IPlanningItem; listId: string } | null>(null);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const { data: board, isLoading } = useBoardDetailQuery(boardId);
  const addList = useAddList(boardId);
  const updateList = useUpdateList(boardId);
  const deleteList = useDeleteList(boardId);
  const archiveList = useArchiveList(boardId);
  const completeList = useCompleteList(boardId);
  const addItem = useAddItem(boardId);
  const updateItem = useUpdateItem(boardId);
  const deleteItem = useDeleteItem(boardId);
  const purchaseItem = usePurchaseItem(boardId);
  const reorderItems = useReorderItems(boardId);
  const toggleShare = useToggleShare();

  useEffect(() => { setMounted(true); }, []);

  const stats = board ? computeBoardStats(board) : null;
  const activeLists = board?.lists.filter((l) => !l.archived) ?? [];

  const handleSaveItem = useCallback(async (data: ItemFormPayload) => {
    const castData = data as Parameters<typeof addItem.mutateAsync>[0]["data"];
    if (editingItem) {
      await updateItem.mutateAsync({ listId: editingItem.listId, itemId: editingItem.item.id, data: castData });
      setEditingItem(null);
      toast.success("Item actualizado");
    } else if (addItemListId) {
      await addItem.mutateAsync({ listId: addItemListId, data: castData });
      setAddItemListId(null);
      toast.success("Item agregado");
    }
  }, [editingItem, addItemListId, addItem, updateItem]);

  const handlePurchase = useCallback(async (data: IPurchaseItemPayload) => {
    if (!purchasingItem) return;
    await purchaseItem.mutateAsync({ listId: purchasingItem.listId, itemId: purchasingItem.item.id, data });
    setPurchasingItem(null);
    setDetailItem(null);
    toast.success("¡Item marcado como comprado! 🎉");
  }, [purchasingItem, purchaseItem]);

  const handleToggleShare = useCallback(async () => {
    try {
      const result = await toggleShare.mutateAsync(boardId);
      if (result.shareToken) {
        const url = `${window.location.origin}/planning/shared/${result.shareToken}`;
        setShareUrl(url);
      } else {
        setShareUrl(null);
        toast.success("Compartido desactivado");
      }
    } catch {
      toast.error("Error al cambiar compartido");
    }
  }, [boardId, toggleShare]);

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-zinc-500 mb-4">Tablero no encontrado</p>
        <button onClick={() => router.push("/planning")} className="text-cyan-500 hover:text-cyan-600 text-sm">← Volver a mis tableros</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.push("/planning")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis Tableros
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{board.title}</h1>
            {board.description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{board.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleToggleShare}
              disabled={toggleShare.isPending}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors border",
                board.shareToken
                  ? "border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                toggleShare.isPending && "opacity-70 cursor-not-allowed"
              )}
            >
              {toggleShare.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : board.shareToken ? <ShieldOff className="w-4 h-4" /> : <Share2 className="w-4 h-4" />
              }
              <span className="hidden sm:inline">
                {toggleShare.isPending ? "Procesando..." : board.shareToken ? "Compartido" : "Compartir"}
              </span>
            </button>
            <button
              onClick={() => setIsAddListOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Lista</span>
            </button>
          </div>
        </div>

        {stats && stats.totalItems > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.purchasedItems}</span>
                {" "}/{" "}
                <span>{stats.totalItems} items comprados</span>
              </span>
              <div className="flex items-center gap-3">
                {stats.purchasedTotal > 0 && (
                  <span className="text-xs text-emerald-500 font-medium">{formatPrice(stats.purchasedTotal, "PEN")} gastado</span>
                )}
                {stats.estimatedTotal > stats.purchasedTotal && (
                  <span className="text-xs text-zinc-400">{formatPrice(Math.round((stats.estimatedTotal - stats.purchasedTotal) * 100) / 100, "PEN")} pendiente</span>
                )}
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{stats.percentPurchased}%</span>
              </div>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentPurchased}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {board.shareToken && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
            <Share2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <span className="flex-1 text-xs text-cyan-700 dark:text-cyan-300 truncate">
              {`${typeof window !== "undefined" ? window.location.origin : ""}/planning/shared/${board.shareToken}`}
            </span>
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs transition-colors flex-shrink-0"
            >
              <LinkIcon className="w-3 h-3" />
              {copiedShare ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        )}
      </div>

      <FilterChips active={activeFilter} onChange={setActiveFilter} />

      {activeLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-500 mb-2">Sin listas aún</p>
          <button onClick={() => setIsAddListOpen(true)} className="text-sm text-cyan-500 hover:text-cyan-600 transition-colors">
            + Agregar primera lista
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLists.map((list) => (
            <PlanningList
              key={list.id}
              list={list}
              activeFilter={activeFilter}
              onAddItem={setAddItemListId}
              onEditList={setEditingList}
              onDeleteList={setDeletingList}
              onArchiveList={(l) => {
                archiveList.mutate(l.id, {
                  onSuccess: () => toast.success("Lista archivada"),
                  onError: () => toast.error("Error al archivar"),
                });
              }}
              onCompleteList={setCompletingList}
              onItemClick={(item, listId) => setDetailItem({ item, listId })}
              onReorderItems={(listId, items) => reorderItems.mutate({ listId, items })}
            />
          ))}
        </div>
      )}

      <AddListModal
        isOpen={isAddListOpen || !!editingList}
        editingList={editingList ?? undefined}
        onClose={() => { setIsAddListOpen(false); setEditingList(null); }}
        onSave={async (data) => {
          if (editingList) {
            await updateList.mutateAsync({ listId: editingList.id, data });
            toast.success("Lista actualizada");
          } else {
            await addList.mutateAsync(data);
            toast.success("Lista creada");
          }
          setIsAddListOpen(false); setEditingList(null);
        }}
      />

      <AddItemModal
        isOpen={!!addItemListId || !!editingItem}
        editingItem={editingItem?.item}
        onClose={() => { setAddItemListId(null); setEditingItem(null); }}
        onSave={handleSaveItem}
      />

      <ItemDetailModal
        item={detailItem?.item ?? null}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => { setEditingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
        onDelete={(item) => { setDeletingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
        onPurchase={(item) => { setPurchasingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
      />

      <PurchaseModal
        isOpen={!!purchasingItem}
        item={purchasingItem?.item ?? null}
        onClose={() => setPurchasingItem(null)}
        onConfirm={handlePurchase}
      />

      {deletingList && (
        <ConfirmModal
          isOpen
          title="Eliminar Lista"
          message={`¿Seguro que quieres eliminar la lista "${deletingList.title}" y todos sus items? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={() => {
            deleteList.mutate(deletingList.id, {
              onSuccess: () => { toast.success("Lista eliminada"); setDeletingList(null); },
              onError: () => toast.error("Error al eliminar"),
            });
          }}
          onClose={() => setDeletingList(null)}
        />
      )}

      {completingList && (
        <ConfirmModal
          isOpen
          title="Completar Lista"
          message={`¿Marcar todos los items de "${completingList.title}" como comprados y archivar la lista?`}
          confirmText="Completar todo"
          cancelText="Cancelar"
          variant="warning"
          onConfirm={() => {
            completeList.mutate(completingList.id, {
              onSuccess: () => { toast.success("Lista completada y archivada 🎉"); setCompletingList(null); },
              onError: () => toast.error("Error al completar"),
            });
          }}
          onClose={() => setCompletingList(null)}
        />
      )}

      {deletingItem && (
        <ConfirmModal
          isOpen
          title="Eliminar Item"
          message={`¿Seguro que quieres eliminar "${deletingItem.item.title}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={() => {
            deleteItem.mutate({ listId: deletingItem.listId, itemId: deletingItem.item.id }, {
              onSuccess: () => { toast.success("Item eliminado"); setDeletingItem(null); },
              onError: () => toast.error("Error al eliminar"),
            });
          }}
          onClose={() => setDeletingItem(null)}
        />
      )}
    </div>
  );
}
