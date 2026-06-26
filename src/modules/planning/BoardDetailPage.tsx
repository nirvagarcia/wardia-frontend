"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Loader2, Share2, ShieldOff, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";
import { formatPrice } from "./utils/helpers";
import { FilterChips } from "./components/filter-chips";
import { PlanningList } from "./components/planning-list";
import { AddListModal } from "./components/modals/add-list-modal";
import { AddItemModal } from "./components/modals/add-item-modal";
import { PurchaseModal } from "./components/modals/purchase-modal";
import { ItemDetailModal } from "./components/modals/item-detail-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { useBoardDetail } from "./hooks/use-board-detail";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface BoardDetailPageProps {
  boardId: string;
}

export default function BoardDetailPage({ boardId }: BoardDetailPageProps) {
  const { language } = usePreferencesStore();
  const {
    mounted, board, isLoading, stats, activeLists, t, router,
    activeFilter, setActiveFilter,
    isAddListOpen, setIsAddListOpen, editingList, setEditingList,
    deletingList, setDeletingList, completingList, setCompletingList,
    addItemListId, setAddItemListId, editingItem, setEditingItem,
    detailItem, setDetailItem, deletingItem, setDeletingItem,
    purchasingItem, setPurchasingItem, copiedShare,
    addList, updateList, deleteList, archiveList, completeList, reorderItems,
    deleteItem, toggleShare, handleSaveItem, handlePurchase, handleToggleShare, copyShareLink,
  } = useBoardDetail(boardId);

  if (!mounted) return null;

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;

  if (!board) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-zinc-500 mb-4">{t("planning.boardNotFound")}</p>
      <button onClick={() => router.push("/planning")} className="text-cyan-500 hover:text-cyan-600 text-sm">← {t("planning.backToBoards")}</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => router.push("/planning")} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />{t("planning.backToBoards")}
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{board.title}</h1>
            {board.description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{board.description}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleToggleShare} disabled={toggleShare.isPending} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors border", board.shareToken ? "border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800", toggleShare.isPending && "opacity-70 cursor-not-allowed")}>
              {toggleShare.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : board.shareToken ? <ShieldOff className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{toggleShare.isPending ? "Procesando..." : board.shareToken ? t("planning.stopSharing") : t("planning.shareBoard")}</span>
            </button>
            <button onClick={() => setIsAddListOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">{t("planning.newList")}</span>
            </button>
          </div>
        </div>

        {stats && stats.totalItems > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.purchasedItems}</span> / <span>{stats.totalItems} {t("planning.items")} {t("planning.purchased")}</span></span>
              <div className="flex items-center gap-3">
                {stats.purchasedTotal > 0 && <span className="text-xs text-emerald-500 font-medium">{formatPrice(stats.purchasedTotal, "PEN")} {t("planning.spent")}</span>}
                {stats.estimatedTotal > stats.purchasedTotal && <span className="text-xs text-zinc-400">{formatPrice(Math.round((stats.estimatedTotal - stats.purchasedTotal) * 100) / 100, "PEN")} {t("planning.pending")}</span>}
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">{stats.percentPurchased}%</span>
              </div>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${stats.percentPurchased}%` }} transition={{ duration: 0.8, ease: "easeOut" }} /></div>
          </div>
        )}

        {board.shareToken && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
            <Share2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <span className="flex-1 text-xs text-cyan-700 dark:text-cyan-300 truncate">{`${typeof window !== "undefined" ? window.location.origin : ""}/planning/shared/${board.shareToken}`}</span>
            <button onClick={copyShareLink} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs transition-colors flex-shrink-0"><LinkIcon className="w-3 h-3" />{copiedShare ? t("planning.linkCopied") : t("common.copy")}</button>
          </div>
        )}
      </div>

      <FilterChips active={activeFilter} onChange={setActiveFilter} />

      {activeLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-500 mb-2">{t("planning.noLists")}</p>
          <button onClick={() => setIsAddListOpen(true)} className="text-sm text-cyan-500 hover:text-cyan-600 transition-colors">+ {t("planning.noListsDesc")}</button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLists.map((list) => (
            <PlanningList key={list.id} list={list} activeFilter={activeFilter}
              onAddItem={setAddItemListId} onEditList={setEditingList} onDeleteList={setDeletingList}
              onArchiveList={(l) => archiveList.mutate(l.id, { onSuccess: () => toast.success(t("planning.listArchived")), onError: () => toast.error(t("planning.archiveError")) })}
              onCompleteList={setCompletingList}
              onItemClick={(item, listId) => setDetailItem({ item, listId })}
              onReorderItems={(listId, items) => reorderItems.mutate({ listId, items })}
            />
          ))}
        </div>
      )}

      <AddListModal isOpen={isAddListOpen || !!editingList} editingList={editingList ?? undefined} onClose={() => { setIsAddListOpen(false); setEditingList(null); }}
        onSave={async (data) => { if (editingList) { await updateList.mutateAsync({ listId: editingList.id, data }); toast.success(t("planning.listUpdated")); } else { await addList.mutateAsync(data); toast.success(t("planning.listCreated")); } setIsAddListOpen(false); setEditingList(null); }}
      />
      <AddItemModal isOpen={!!addItemListId || !!editingItem} editingItem={editingItem?.item} onClose={() => { setAddItemListId(null); setEditingItem(null); }} onSave={handleSaveItem} />
      <ItemDetailModal item={detailItem?.item ?? null} onClose={() => setDetailItem(null)}
        onEdit={(item) => { setEditingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
        onDelete={(item) => { setDeletingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
        onPurchase={(item) => { setPurchasingItem({ item, listId: detailItem!.listId }); setDetailItem(null); }}
      />
      <PurchaseModal isOpen={!!purchasingItem} item={purchasingItem?.item ?? null} onClose={() => setPurchasingItem(null)} onConfirm={handlePurchase} />

      {deletingList && <ConfirmModal isOpen title={t("planning.deleteList")} message={getTranslation(language, "planning.deleteConfirmList", { title: deletingList.title })} confirmText={t("common.delete")} cancelText={t("common.cancel")} variant="danger" onConfirm={() => deleteList.mutate(deletingList.id, { onSuccess: () => { toast.success(t("planning.listDeleted")); setDeletingList(null); }, onError: () => toast.error(t("planning.deleteError")) })} onClose={() => setDeletingList(null)} />}
      {completingList && <ConfirmModal isOpen title={t("planning.completeList")} message={getTranslation(language, "planning.completeConfirm", { title: completingList.title })} confirmText={t("planning.completeAll")} cancelText={t("common.cancel")} variant="warning" onConfirm={() => completeList.mutate(completingList.id, { onSuccess: () => { toast.success(t("planning.listCompleted")); setCompletingList(null); }, onError: () => toast.error(t("planning.completeListError")) })} onClose={() => setCompletingList(null)} />}
      {deletingItem && <ConfirmModal isOpen title={t("planning.deleteItem")} message={getTranslation(language, "planning.deleteConfirmItem", { title: deletingItem.item.title })} confirmText={t("common.delete")} cancelText={t("common.cancel")} variant="danger" onConfirm={() => deleteItem.mutate({ listId: deletingItem.listId, itemId: deletingItem.item.id }, { onSuccess: () => { toast.success(t("planning.itemDeleted")); setDeletingItem(null); }, onError: () => toast.error(t("planning.deleteError")) })} onClose={() => setDeletingItem(null)} />}
    </div>
  );
}
