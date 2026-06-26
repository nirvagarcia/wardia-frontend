"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import {
  useBoardsQuery, useAddBoard, useDeleteBoard, useArchiveBoard,
  useCloneBoard, useToggleShare, useReorderBoards, useStorageUsage,
} from "@/shared/hooks/use-planning-query";
import type { IBoardSummary } from "@/shared/types/planning";

export function usePlanningPage() {
  const router = useRouter();
  const { language } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  const [mounted, setMounted] = useState(false);
  const [boards, setBoards] = useState<IBoardSummary[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<IBoardSummary | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<IBoardSummary | null>(null);
  const [shareBoard, setShareBoard] = useState<IBoardSummary | null>(null);

  const { data, isLoading } = useBoardsQuery();
  const { data: storageData } = useStorageUsage();
  const addBoard = useAddBoard();
  const deleteBoard = useDeleteBoard();
  const archiveBoard = useArchiveBoard();
  const cloneBoard = useCloneBoard();
  const toggleShare = useToggleShare();
  const reorderBoards = useReorderBoards();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (data) setBoards(data); }, [data]);
  useEffect(() => {
    if (storageData && storageData.usedPercent >= 80) {
      toast.warning(`⚠️ ${storageData.usedMB}/${storageData.totalMB} MB — ${t("planning.storageWarning")}`, {
        id: "storage-warning", duration: 8000,
      });
    }
  }, [storageData, t]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = boards.findIndex((b) => b.id === active.id);
    const newIndex = boards.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(boards, oldIndex, newIndex);
    setBoards(reordered);
    reorderBoards.mutate(reordered.map((b, i) => ({ id: b.id, order: i })));
  }, [boards, reorderBoards]);

  const handleShare = useCallback(async (board: IBoardSummary) => {
    try {
      const result = await toggleShare.mutateAsync(board.id);
      if (result.shareToken) {
        setShareBoard({ ...board, shareToken: result.shareToken });
      } else {
        toast.success(t("planning.stopSharing"));
      }
    } catch {
      toast.error("Error al cambiar compartido");
    }
  }, [toggleShare, t]);

  const handleSaveBoard = useCallback(async (
    data: { title: string; description?: string; coverImage?: string },
  ) => {
    const wasEditing = !!editingBoard;
    try {
      await addBoard.mutateAsync(data);
      setIsAddOpen(false);
      setEditingBoard(null);
      toast.success(wasEditing ? "Tablero actualizado" : "Tablero creado");
    } catch {
      toast.error("Error al guardar tablero");
    }
  }, [addBoard, editingBoard]);

  return {
    mounted, boards, isLoading, t, router,
    isAddOpen, setIsAddOpen,
    editingBoard, setEditingBoard,
    deletingBoard, setDeletingBoard,
    shareBoard, setShareBoard,
    addBoard, deleteBoard, archiveBoard, cloneBoard,
    sensors, handleDragEnd, handleShare, handleSaveBoard,
  };
}
