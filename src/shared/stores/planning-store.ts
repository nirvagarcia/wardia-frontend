import { create } from "zustand";
import type { IBoardSummary, IPlanningBoard } from "@/shared/types/planning";
import { planningService } from "@/shared/services/planning-service";

interface PlanningState {
  boards: IBoardSummary[];
  archivedBoards: IBoardSummary[];
  currentBoard: IPlanningBoard | null;
  isLoading: boolean;
  error: string | null;

  setBoards: (boards: IBoardSummary[]) => void;
  setArchivedBoards: (boards: IBoardSummary[]) => void;
  setCurrentBoard: (board: IPlanningBoard | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  reorderBoards: (boards: IBoardSummary[]) => Promise<void>;
}

export const usePlanningStore = create<PlanningState>((set, get) => ({
  boards: [],
  archivedBoards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  setBoards: (boards) => set({ boards }),
  setArchivedBoards: (boards) => set({ archivedBoards: boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  reorderBoards: async (boards) => {
    const previous = get().boards;
    set({ boards });
    try {
      await planningService.reorderBoards(boards.map((b, i) => ({ id: b.id, order: i })));
    } catch {
      set({ boards: previous });
    }
  },
}));
