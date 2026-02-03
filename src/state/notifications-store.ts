import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationType = "invite" | "new_episode" | "poll";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAtIso: string;
  read: boolean;
  targetId?: string;
};

interface NotificationsState {
  notifications: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, "id" | "createdAtIso">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  seedSamples: () => void;
  reset: () => void;
}

export const notificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (item) => {
        const newItem: NotificationItem = {
          ...item,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAtIso: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newItem, ...state.notifications],
        }));
      },
      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        }));
      },
      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
        }));
      },
      seedSamples: () => {
        const hasExisting = get().notifications.length > 0;
        if (hasExisting) return;
        const now = new Date().toISOString();
        set({
          notifications: [
            {
              id: "notif-sample-1",
              type: "invite",
              title: "Writers Room Invite",
              body: "Ava invited you to join TestShow as an editor.",
              createdAtIso: now,
              read: false,
              targetId: "writers-room",
            },
            {
              id: "notif-sample-2",
              type: "new_episode",
              title: "New Episode",
              body: "TestShow — Episode 3 is live.",
              createdAtIso: now,
              read: false,
              targetId: "episode",
            },
            {
              id: "notif-sample-3",
              type: "poll",
              title: "Poll Posted",
              body: "Vote on what should happen next in TestShow.",
              createdAtIso: now,
              read: true,
              targetId: "poll",
            },
          ],
        });
      },
      reset: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "notifications-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useNotificationsStore = notificationsStore;
