"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Plus, Archive, MoreVertical, Edit2, Copy, ArchiveX, Trash2, Share2, ShieldOff, Loader2, Link as LinkIcon } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import type { IBoardSummary } from "@/shared/types/planning";
import { computeBoardStats, formatPrice } from "./utils/helpers";
import { AddBoardModal } from "./components/modals/add-board-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { usePlanningPage } from "./hooks/use-planning-page";

export default function PlanningPage() {
  const {
    mounted, boards, isLoading, t, router,
    isAddOpen, setIsAddOpen, editingBoard, setEditingBoard,
    deletingBoard, setDeletingBoard, shareBoard, setShareBoard,
    deleteBoard, archiveBoard, cloneBoard,
    sensors, handleDragEnd, handleShare, handleSaveBoard,
  } = usePlanningPage();

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-cyan-500" />
            {t("planning.title")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t("planning.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/planning/archived")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">{t("planning.archived")}</span>
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            {t("planning.newBoard")}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">{t("planning.noBoards")}</p>
          <p className="text-sm text-zinc-400 mb-6 max-w-xs">{t("planning.noBoardsDesc")}</p>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />{t("planning.newBoard")}
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={boards.map((b) => b.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {boards.map((board) => (
                  <SortableBoardCard key={board.id} board={board}
                    onOpen={(b) => router.push(`/planning/${b.id}`)}
                    onEdit={setEditingBoard} onDelete={setDeletingBoard}
                    onArchive={(b) => archiveBoard.mutate(b.id, { onSuccess: () => toast.success("Tablero archivado"), onError: () => toast.error("Error al archivar") })}
                    onClone={(b) => cloneBoard.mutate(b.id, { onSuccess: () => toast.success("Tablero clonado"), onError: () => toast.error("Error al clonar") })}
                    onShare={handleShare}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AddBoardModal isOpen={isAddOpen || !!editingBoard} editingBoard={editingBoard ?? undefined} onClose={() => { setIsAddOpen(false); setEditingBoard(null); }} onSave={handleSaveBoard} />

      {deletingBoard && (
        <ConfirmModal isOpen title={t("planning.deleteBoard")} message={t("planning.deleteConfirmBoard").replace("{title}", deletingBoard.title)} confirmText="Eliminar" cancelText="Cancelar" variant="danger"
          onConfirm={() => deleteBoard.mutate(deletingBoard.id, { onSuccess: () => { toast.success("Tablero eliminado"); setDeletingBoard(null); }, onError: () => toast.error("Error al eliminar") })}
          onClose={() => setDeletingBoard(null)}
        />
      )}

      {shareBoard && <ShareModal board={shareBoard} onClose={() => setShareBoard(null)} />}
    </div>
  );
}

function SortableBoardCard({ board, onEdit, onDelete, onArchive, onClone, onShare, onOpen }: {
  board: IBoardSummary;
  onEdit: (b: IBoardSummary) => void; onDelete: (b: IBoardSummary) => void;
  onArchive: (b: IBoardSummary) => void; onClone: (b: IBoardSummary) => void;
  onShare: (b: IBoardSummary) => void; onOpen: (b: IBoardSummary) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id });
  const [menuOpen, setMenuOpen] = useState(false);
  const stats = computeBoardStats(board);
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div layout className={cn("group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80", "hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer")} onClick={() => onOpen(board)}>
        <div className="relative h-28 overflow-hidden">
          {board.coverImage ? <Image src={board.coverImage} alt={board.title} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 via-teal-400/10 to-zinc-100 dark:from-cyan-900/30 dark:via-teal-900/10 dark:to-zinc-800" />}
          <div {...listeners} onClick={(e) => e.stopPropagation()} className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-md bg-white/70 dark:bg-zinc-900/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"><span className="text-zinc-400 text-xs select-none">⠿</span></div>
          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMenuOpen((p) => !p)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 dark:bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-800"><MoreVertical className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /></button>
            {menuOpen && <BoardMenu board={board} onClose={() => setMenuOpen(false)} onEdit={onEdit} onDelete={onDelete} onArchive={onArchive} onClone={onClone} onShare={onShare} />}
          </div>
          {board.shareToken && <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/90 text-white text-xs"><Share2 className="w-3 h-3" />Compartido</div>}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-0.5">{board.title}</h3>
          {board.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-3">{board.description}</p>}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span>{stats.purchasedItems} / {stats.totalItems} items</span>
            {stats.estimatedTotal > 0 && <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatPrice(stats.estimatedTotal, "PEN")}</span>}
          </div>
          {stats.totalItems > 0 && <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${stats.percentPurchased}%` }} transition={{ duration: 0.6, ease: "easeOut" }} /></div>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-400">{board.lists.length} listas</span>
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">{stats.percentPurchased}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function BoardMenu({ board, onClose, onEdit, onDelete, onArchive, onClone, onShare }: { board: IBoardSummary; onClose: () => void; onEdit: (b: IBoardSummary) => void; onDelete: (b: IBoardSummary) => void; onArchive: (b: IBoardSummary) => void; onClone: (b: IBoardSummary) => void; onShare: (b: IBoardSummary) => void; }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-8 z-20 min-w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
        {[
          { icon: Edit2, label: "Editar", action: () => { onEdit(board); onClose(); } },
          { icon: Copy, label: "Clonar", action: () => { onClone(board); onClose(); } },
          { icon: board.shareToken ? ShieldOff : Share2, label: board.shareToken ? "Dejar de compartir" : "Compartir", action: () => { onShare(board); onClose(); } },
          { icon: ArchiveX, label: "Archivar", action: () => { onArchive(board); onClose(); } },
          { icon: Trash2, label: "Eliminar", action: () => { onDelete(board); onClose(); }, danger: true },
        ].map(({ icon: Icon, label, action, danger }) => (
          <button key={label} onClick={action} className={cn("w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors text-left", danger ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800")}>
            <Icon className="w-4 h-4 flex-shrink-0" />{label}
          </button>
        ))}
      </div>
    </>
  );
}

function ShareModal({ board, onClose }: { board: IBoardSummary; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/planning/shared/${board.shareToken}`;
  const copy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Compartir tablero</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Cualquiera con este link puede ver el tablero (solo lectura)</p>
        <div className="flex gap-2">
          <input readOnly value={shareUrl} className="flex-1 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 truncate" />
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors"><LinkIcon className="w-3.5 h-3.5" />{copied ? "¡Copiado!" : "Copiar"}</button>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cerrar</button>
      </div>
    </div>
  );
}
