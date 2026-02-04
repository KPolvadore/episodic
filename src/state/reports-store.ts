import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ReportTargetType = "show" | "episode";

export type ReportItem = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  createdAtIso: string;
};

interface ReportsState {
  reports: ReportItem[];
  addReport: (input: Omit<ReportItem, "id" | "createdAtIso">) => void;
  reset: () => void;
}

export const reportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      reports: [],
      addReport: (input) => {
        const report: ReportItem = {
          ...input,
          id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAtIso: new Date().toISOString(),
        };
        set((state) => ({ reports: [report, ...state.reports] }));
      },
      reset: () => set({ reports: [] }),
    }),
    {
      name: "reports-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useReportsStore = reportsStore;
