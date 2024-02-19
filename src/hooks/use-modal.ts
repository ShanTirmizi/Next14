import { create } from 'zustand';

type ModalType = 'createServer';

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  open: (type: ModalType) => void;
  close: () => void;
}

export const useModal = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  open: (type) => set({ type, isOpen: true }),
  close: () => set({ isOpen: false, type: null }),
}));
