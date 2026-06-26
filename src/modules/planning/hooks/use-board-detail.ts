"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import {
  useBoardDetailQuery, useAddList, useUpdateList, useDeleteList,
  useArchiveList, useCompleteList, useAddItem, useUpdateItem, useDeleteItem,
  usePurchaseItem, useReorderItems, useToggleShare, computeBoardStats,
} from "@/shared/hooks/use-planning-query";
import type { IPlanningItem, IPlanningList, IPurchaseItemPayload } from "@/shared/types/planning";
import type { ItemFormPayload } from "../components/modals/add-item-modal";
import type { FilterType } from "../components/filter-chips";

export function useBoardDetail(boardId: string) {
  const router = useRouter();
  const { language } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);

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
      toast.success(t("planning.itemUpdated"));
    } else if (addItemListId) {
      await addItem.mutateAsync({ listId: addItemListId, data: castData });
      setAddItemListId(null);
      toast.success(t("planning.itemAdded"));
    }
  }, [editingItem, addItemListId, addItem, updateItem]);

  const handlePurchase = useCallback(async (data: IPurchaseItemPayload) => {
    if (!purchasingItem) return;
    await purchaseItem.mutateAsync({ listId: purchasingItem.listId, itemId: purchasingItem.item.id, data });
    setPurchasingItem(null);
    setDetailItem(null);
    toast.success(t("planning.itemMarkedPurchased"));
  }, [purchasingItem, purchaseItem]);

  const handleToggleShare = useCallback(async () => {
    try {
      const result = await toggleShare.mutateAsync(boardId);
      if (!result.shareToken) toast.success(t("planning.stopSharing"));
    } catch {
      toast.error(t("planning.shareError"));
    }
  }, [boardId, toggleShare, t]);

  const copyShareLink = useCallback(() => {
    if (!board?.shareToken) return;
    const url = `${window.location.origin}/planning/shared/${board.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  }, [board]);

  return {
    mounted, board, isLoading, stats, activeLists, t, router,
    activeFilter, setActiveFilter,
    isAddListOpen, setIsAddListOpen,
    editingList, setEditingList,
    deletingList, setDeletingList,
    completingList, setCompletingList,
    addItemListId, setAddItemListId,
    editingItem, setEditingItem,
    detailItem, setDetailItem,
    deletingItem, setDeletingItem,
    purchasingItem, setPurchasingItem,
    copiedShare,
    addList, updateList, deleteList, archiveList, completeList, reorderItems,
    deleteItem, toggleShare,
    handleSaveItem, handlePurchase, handleToggleShare, copyShareLink,
  };
}
