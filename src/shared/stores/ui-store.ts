/**
 * Zustand store for transient UI state management.
 * Handles global UI state like modals, sidebars, and active tabs.
 */

import { create } from "zustand";

interface UIState {
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  openModal: (content: React.ReactNode): void =>
    set({ isModalOpen: true, modalContent: content }),
  closeModal: (): void =>
    set({ isModalOpen: false, modalContent: null }),

  activeRoute: "/dashboard",
  setActiveRoute: (route: string): void =>
    set({ activeRoute: route }),
}));
