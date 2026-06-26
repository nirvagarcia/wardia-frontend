"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { planningService } from "@/shared/services/planning-service";
import type { IPlanningBoard, IPlanningItem, IPurchaseItemPayload } from "@/shared/types/planning";

export const BOARDS_QUERY_KEY = ["planning", "boards"] as const;
export const ARCHIVED_QUERY_KEY = ["planning", "archived"] as const;
export const BOARD_DETAIL_KEY = (boardId: string) => ["planning", "board", boardId] as const;
export const STORAGE_USAGE_KEY = ["planning", "storage"] as const;

export function useBoardsQuery() {
  return useQuery({
    queryKey: BOARDS_QUERY_KEY,
    queryFn: () => planningService.getBoards(),
  });
}

export function useArchivedBoardsQuery() {
  return useQuery({
    queryKey: ARCHIVED_QUERY_KEY,
    queryFn: () => planningService.getArchivedBoards(),
  });
}

export function useBoardDetailQuery(boardId: string) {
  return useQuery({
    queryKey: BOARD_DETAIL_KEY(boardId),
    queryFn: () => planningService.getBoardDetail(boardId),
    enabled: !!boardId,
  });
}

export function useStorageUsage() {
  return useQuery({
    queryKey: STORAGE_USAGE_KEY,
    queryFn: () => planningService.getStorageUsage(),
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: false,
  });
}

export function useAddBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof planningService.createBoard>[0]) =>
      planningService.createBoard(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY }),
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: string; data: Parameters<typeof planningService.updateBoard>[1] }) =>
      planningService.updateBoard(boardId, data),
    onSuccess: (board: IPlanningBoard) => {
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(board.id) });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => planningService.deleteBoard(boardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY }),
  });
}

export function useArchiveBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => planningService.archiveBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ARCHIVED_QUERY_KEY });
    },
  });
}

export function useCloneBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => planningService.cloneBoard(boardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY }),
  });
}

export function useToggleShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => planningService.toggleShare(boardId),
    onSuccess: (_data, boardId) => {
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
    },
  });
}

export function useReorderBoards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) => planningService.reorderBoards(items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY }),
  });
}

// ─── Lists ────────────────────────────────────────────────────────────────────

export function useAddList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      planningService.createList(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) }),
  });
}

export function useUpdateList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: Partial<{ title: string; description: string }> }) =>
      planningService.updateList(boardId, listId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) }),
  });
}

export function useDeleteList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => planningService.deleteList(boardId, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
}

export function useArchiveList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => planningService.archiveList(boardId, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: ARCHIVED_QUERY_KEY });
    },
  });
}

export function useCompleteList(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => planningService.completeList(boardId, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: ARCHIVED_QUERY_KEY });
    },
  });
}

export function useReorderLists(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) =>
      planningService.reorderLists(boardId, items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) }),
  });
}

// ─── Items ────────────────────────────────────────────────────────────────────

export function useAddItem(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: Parameters<typeof planningService.createItem>[2] }) =>
      planningService.createItem(boardId, listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
}

export function useUpdateItem(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, itemId, data }: { listId: string; itemId: string; data: Parameters<typeof planningService.updateItem>[3] }) =>
      planningService.updateItem(boardId, listId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
}

export function useDeleteItem(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      planningService.deleteItem(boardId, listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
}

export function usePurchaseItem(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, itemId, data }: { listId: string; itemId: string; data: IPurchaseItemPayload }) =>
      planningService.purchaseItem(boardId, listId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) });
      queryClient.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
}

export function useReorderItems(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, items }: { listId: string; items: { id: string; order: number }[] }) =>
      planningService.reorderItems(boardId, listId, items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_DETAIL_KEY(boardId) }),
  });
}

// ─── Storage warning hook ─────────────────────────────────────────────────────

export function useStorageWarning() {
  const { data } = useStorageUsage();
  if (data && data.usedPercent >= 80) {
    toast.warning(`⚠️ Espacio en imágenes casi lleno: ${data.usedMB} / ${data.totalMB} MB usados (${data.usedPercent}%)`, {
      id: "storage-warning",
      duration: 8000,
    });
  }
}

// ─── Image upload helper ──────────────────────────────────────────────────────

export async function uploadPlanningImage(file: File): Promise<string> {
  const params = await planningService.getUploadParams();
  if (params.storageWarning) {
    toast.warning(`⚠️ Espacio en imágenes casi lleno: ${params.storageWarning ? "Menos del 20% disponible" : ""}`, {
      id: "storage-warning",
    });
  }
  return planningService.uploadToCloudinary(file, params);
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

export function computeBoardStats(board: IPlanningBoard) {
  const allItems: IPlanningItem[] = board.lists.flatMap((l) => l.items);
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

export function computeListStats(list: { items: IPlanningItem[] }) {
  const purchased = list.items.filter((i) => i.status === "purchased");
  const estimatedTotal = list.items.reduce((s, i) => s + (i.priceValue ?? 0) * (i.quantity ?? 1), 0);
  return {
    total: list.items.length,
    purchased: purchased.length,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
  };
}
