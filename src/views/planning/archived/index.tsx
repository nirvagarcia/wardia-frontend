"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Archive, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useArchivedBoardsQuery, useArchiveBoard, useDeleteBoard } from "@/shared/hooks/use-planning-query";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import type { IBoardSummary } from "@/shared/types/planning";
import { computeBoardStats, formatPrice } from "../utils/helpers";
import { cn } from "@/shared/utils/cn";

export function ArchivedView() {
  const router = useRouter();
  const [deletingBoard, setDeletingBoard] = useState<IBoardSummary | null>(null);
  const { data: boards, isLoading } = useArchivedBoardsQuery();
  const archiveBoard = useArchiveBoard();
  const deleteBoard = useDeleteBoard();

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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <Archive className="w-6 h-6 text-zinc-400" />
          Tableros Archivados
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : !boards || boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Archive className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-3" />
          <p className="text-zinc-500">Nada archivado aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => {
            const stats = computeBoardStats(board);
            return (
              <div key={board.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                {board.coverImage && (
                  <div className="h-20 overflow-hidden">
                    <Image src={board.coverImage} alt={board.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover grayscale-[40%]" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 truncate mb-0.5">{board.title}</h3>
                  <p className="text-xs text-zinc-400 mb-3">{stats.totalItems} items • {stats.purchasedItems} comprados</p>
                  {stats.estimatedTotal > 0 && (
                    <p className="text-xs text-zinc-400 mb-3">{formatPrice(stats.estimatedTotal, "PEN")} estimado</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        archiveBoard.mutate(board.id, {
                          onSuccess: () => toast.success("Tablero restaurado"),
                          onError: () => toast.error("Error al restaurar"),
                        });
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors",
                        "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar
                    </button>
                    <button
                      onClick={() => setDeletingBoard(board)}
                      className="flex items-center justify-center px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deletingBoard && (
        <ConfirmModal
          isOpen
          title="Eliminar Tablero"
          message={`¿Seguro que quieres eliminar "${deletingBoard.title}" permanentemente? Esto eliminará todas sus listas e items.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={() => {
            deleteBoard.mutate(deletingBoard.id, {
              onSuccess: () => { toast.success("Tablero eliminado"); setDeletingBoard(null); },
              onError: () => toast.error("Error al eliminar"),
            });
          }}
          onClose={() => setDeletingBoard(null)}
        />
      )}
    </div>
  );
}
