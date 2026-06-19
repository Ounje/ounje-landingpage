import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../utils/apiClient";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isSocketConnected: boolean;
  setSocketConnected: (connected: boolean) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<NotificationItem, "isRead" | "createdAt"> & { isRead?: boolean; createdAt?: string }) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isSocketConnected: false,

      setSocketConnected: (connected) => set({ isSocketConnected: connected }),

      fetchNotifications: async () => {
        try {
          const res: any = await apiClient.get("/api/notifications");
          if (res && res.success && Array.isArray(res.data)) {
            const list: NotificationItem[] = res.data.map((item: any) => ({
              id: item._id || item.id,
              title: item.title || "Alert",
              body: item.body || item.message || "",
              type: item.type || "general",
              isRead: item.isRead ?? false,
              createdAt: item.createdAt || new Date().toISOString(),
              relatedId: item.relatedId || item.orderId || item.vendorId,
            }));
            const unread = list.filter((n) => !n.isRead).length;
            set({ notifications: list, unreadCount: unread });
          }
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      },

      markAsRead: async (id) => {
        try {
          await apiClient.put(`/api/notifications/${id}/read`);
          
          set((state) => {
            const list = state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            );
            const unread = list.filter((n) => !n.isRead).length;
            return { notifications: list, unreadCount: unread };
          });
        } catch (err) {
          console.error(`Failed to mark notification ${id} as read:`, err);
        }
      },

      markAllAsRead: async () => {
        try {
          await apiClient.put("/api/notifications/read-all");

          set((state) => {
            const list = state.notifications.map((n) => ({ ...n, isRead: true }));
            return { notifications: list, unreadCount: 0 };
          });
        } catch (err) {
          console.error("Failed to mark all notifications as read:", err);
        }
      },

      addNotification: (item) => {
        const newItem: NotificationItem = {
          id: item.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          body: item.body,
          type: item.type,
          isRead: item.isRead ?? false,
          createdAt: item.createdAt || new Date().toISOString(),
          relatedId: item.relatedId,
        };

        set((state) => {
          // Prevent duplicates by ID
          if (state.notifications.some((n) => n.id === newItem.id)) {
            return state;
          }
          const list = [newItem, ...state.notifications];
          const unread = list.filter((n) => !n.isRead).length;
          return { notifications: list, unreadCount: unread };
        });
      },
    }),
    {
      name: "ounje_notification_store",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
