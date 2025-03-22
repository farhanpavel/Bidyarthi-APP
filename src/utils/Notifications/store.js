// store.js
import { create } from 'zustand';

export const useNotificationModalStore = create((set) => ({
  isNotificationModalOpen: false,
  openNotificationModal: () => set({ isNotificationModalOpen: true }),
  closeNotificationModal: () => set({ isNotificationModalOpen: false }),
  hasNewNotification: false, // Track new notifications
  setHasNewNotification: (value) => set({ hasNewNotification: value }), // Update new notification state
}));
