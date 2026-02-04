import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TipReceipt = {
  id: string;
  showId: string;
  showTitle: string;
  amount: number;
  createdAtIso: string;
};

interface TipsState {
  receipts: TipReceipt[];
  addTip: (input: Omit<TipReceipt, "id" | "createdAtIso">) => TipReceipt;
  getReceiptsForShow: (showId: string) => TipReceipt[];
  reset: () => void;
}

export const tipsStore = create<TipsState>()(
  persist(
    (set, get) => ({
      receipts: [],
      addTip: (input) => {
        const receipt: TipReceipt = {
          ...input,
          id: `tip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAtIso: new Date().toISOString(),
        };
        set((state) => ({
          receipts: [receipt, ...state.receipts],
        }));
        return receipt;
      },
      getReceiptsForShow: (showId) =>
        get().receipts.filter((r) => r.showId === showId),
      reset: () => set({ receipts: [] }),
    }),
    {
      name: "tips-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useTipsStore = tipsStore;
