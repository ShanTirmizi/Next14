import { Server } from '@prisma/client';
import { create } from 'zustand';

type ModalType =
  | 'createServer'
  | 'invite'
  | 'serverSettings'
  | 'manageMembers'
  | 'createChannel'
  | 'leaveServer'
  | 'initialServer';

interface ModalData {
  server?: Server;
}

interface ModalProps {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  open: (type: ModalType, data?: ModalData) => void;
  close: () => void;
}

export const useModal = create<ModalProps>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  open: (type, data = {}) => set({ type, isOpen: true, data }),
  close: () => set({ isOpen: false, type: null }),
}));
