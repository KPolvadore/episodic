import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VisibilityState {
  hiddenShowIds: string[];
  hiddenEpisodeIds: string[];
  hideShow: (showId: string) => void;
  unhideShow: (showId: string) => void;
  hideEpisode: (episodeId: string) => void;
  unhideEpisode: (episodeId: string) => void;
  isShowHidden: (showId: string) => boolean;
  isEpisodeHidden: (episodeId: string) => boolean;
  reset: () => void;
}

export const visibilityStore = create<VisibilityState>()(
  persist(
    (set, get) => ({
      hiddenShowIds: [],
      hiddenEpisodeIds: [],
      hideShow: (showId) =>
        set((state) =>
          state.hiddenShowIds.includes(showId)
            ? state
            : { hiddenShowIds: [showId, ...state.hiddenShowIds] },
        ),
      unhideShow: (showId) =>
        set((state) => ({
          hiddenShowIds: state.hiddenShowIds.filter((id) => id !== showId),
        })),
      hideEpisode: (episodeId) =>
        set((state) =>
          state.hiddenEpisodeIds.includes(episodeId)
            ? state
            : { hiddenEpisodeIds: [episodeId, ...state.hiddenEpisodeIds] },
        ),
      unhideEpisode: (episodeId) =>
        set((state) => ({
          hiddenEpisodeIds: state.hiddenEpisodeIds.filter(
            (id) => id !== episodeId,
          ),
        })),
      isShowHidden: (showId) => get().hiddenShowIds.includes(showId),
      isEpisodeHidden: (episodeId) =>
        get().hiddenEpisodeIds.includes(episodeId),
      reset: () => set({ hiddenShowIds: [], hiddenEpisodeIds: [] }),
    }),
    {
      name: "visibility-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useVisibilityStore = visibilityStore;
