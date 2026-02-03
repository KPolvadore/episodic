import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FeedStore {
  feedMode: "discovery" | "following";
  hydrated: boolean;
  setFeedMode: (mode: "discovery" | "following") => void;
  setHydrated: () => void;
}

export const useFeedStore = create<FeedStore>()(
  persist(
    (set, get) => ({
      feedMode: "discovery",
      hydrated: false,
      setFeedMode: (mode) => set({ feedMode: mode }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "episodic.feedMode",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    },
  ),
);
