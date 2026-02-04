import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EntitlementsState {
  seasonPassByShowId: Record<string, boolean>;
  hasSeasonPass: (showId: string) => boolean;
  purchaseSeasonPass: (showId: string) => void;
  revokeSeasonPass: (showId: string) => void;
  reset: () => void;
}

export const entitlementsStore = create<EntitlementsState>()(
  persist(
    (set, get) => ({
      seasonPassByShowId: {},
      hasSeasonPass: (showId) => !!get().seasonPassByShowId[showId],
      purchaseSeasonPass: (showId) => {
        set((state) => ({
          seasonPassByShowId: { ...state.seasonPassByShowId, [showId]: true },
        }));
      },
      revokeSeasonPass: (showId) => {
        set((state) => ({
          seasonPassByShowId: { ...state.seasonPassByShowId, [showId]: false },
        }));
      },
      reset: () => {
        set({ seasonPassByShowId: {} });
      },
    }),
    {
      name: "entitlements-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useEntitlementsStore = entitlementsStore;
