import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RateLimitedAction = "comment" | "report";

type RateLimitConfig = {
  windowMs: number;
  max: number;
};

const RATE_LIMITS: Record<RateLimitedAction, RateLimitConfig> = {
  report: { windowMs: 30_000, max: 2 },
  comment: { windowMs: 30_000, max: 5 },
};

interface RateLimitState {
  historyByAction: Record<RateLimitedAction, number[]>;
  canPerform: (action: RateLimitedAction) => boolean;
  recordAction: (action: RateLimitedAction) => void;
  getRemainingMs: (action: RateLimitedAction) => number;
  reset: () => void;
}

const prune = (timestamps: number[], windowMs: number, now: number) =>
  timestamps.filter((ts) => now - ts <= windowMs);

export const rateLimitStore = create<RateLimitState>()(
  persist(
    (set, get) => ({
      historyByAction: {
        comment: [],
        report: [],
      },
      canPerform: (action) => {
        const now = Date.now();
        const { windowMs, max } = RATE_LIMITS[action];
        const history = get().historyByAction[action] || [];
        const pruned = prune(history, windowMs, now);
        return pruned.length < max;
      },
      recordAction: (action) => {
        const now = Date.now();
        const { windowMs } = RATE_LIMITS[action];
        set((state) => {
          const history = state.historyByAction[action] || [];
          const pruned = prune(history, windowMs, now);
          return {
            historyByAction: {
              ...state.historyByAction,
              [action]: [...pruned, now],
            },
          };
        });
      },
      getRemainingMs: (action) => {
        const now = Date.now();
        const { windowMs, max } = RATE_LIMITS[action];
        const history = get().historyByAction[action] || [];
        const pruned = prune(history, windowMs, now);
        if (pruned.length < max) return 0;
        const earliest = Math.min(...pruned);
        return Math.max(0, windowMs - (now - earliest));
      },
      reset: () => {
        set({
          historyByAction: {
            comment: [],
            report: [],
          },
        });
      },
    }),
    {
      name: "rate-limit-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useRateLimitStore = rateLimitStore;
