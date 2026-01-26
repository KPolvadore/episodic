import { create } from "zustand";

const EMPTY_DRAFTS: DraftEpisode[] = [];

interface Show {
  id: string;
  title: string;
  topicId?: string;
  createdAtIso: string;
}

interface DraftEpisode {
  id: string;
  showId: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  createdAtIso: string;
  updatedAtIso: string;
  hookTemplateId?: string;
  nextDropIso?: string | null;
  previouslyOnEpisodeIds?: string[];
  episodeType?: "episode" | "trailer";
}

interface CreatorStore {
  shows: Show[];
  draftEpisodesByShowId: Record<string, DraftEpisode[]>;
  addShow: (input: { id: string; title: string; topicId?: string }) => void;
  addDraftEpisode: (
    input: Omit<DraftEpisode, "createdAtIso" | "updatedAtIso">,
  ) => void;
  updateDraftEpisode: (
    id: string,
    patch: Partial<Omit<DraftEpisode, "id" | "showId" | "createdAtIso">>,
  ) => void;
  getDraftEpisodeById: (id: string) => DraftEpisode | undefined;
  getShowById: (id: string) => Show | undefined;
  getDraftEpisodesByShowId: (showId: string) => DraftEpisode[];
  removeDraftEpisode: (id: string) => void;
  reset: () => void;
}

export const useCreatorStore = create<CreatorStore>((set, get) => ({
  shows: [],
  draftEpisodesByShowId: {},
  addShow: (input) => {
    const newShow: Show = {
      id: input.id,
      title: input.title,
      topicId: input.topicId,
      createdAtIso: new Date().toISOString(),
    };
    set((state) => ({ shows: [...state.shows, newShow] }));
  },
  addDraftEpisode: (input) => {
    const newDraft: DraftEpisode = {
      ...input,
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
    };
    set((state) => {
      const existingDrafts = state.draftEpisodesByShowId[input.showId] || [];
      const existingIndex = existingDrafts.findIndex((d) => d.id === input.id);
      if (existingIndex >= 0) {
        // Update existing
        existingDrafts[existingIndex] = newDraft;
      } else {
        // Add new
        existingDrafts.push(newDraft);
      }
      return {
        draftEpisodesByShowId: {
          ...state.draftEpisodesByShowId,
          [input.showId]: existingDrafts,
        },
      };
    });
  },
  getShowById: (id: string) => {
    return get().shows.find((show) => show.id === id);
  },
  getDraftEpisodesByShowId: (showId) => {
    return get().draftEpisodesByShowId[showId] || EMPTY_DRAFTS;
  },
  updateDraftEpisode: (id, patch) => {
    set((state) => {
      const newDraftsByShowId = { ...state.draftEpisodesByShowId };
      for (const showId in newDraftsByShowId) {
        const drafts = newDraftsByShowId[showId];
        const index = drafts.findIndex((d) => d.id === id);
        if (index >= 0) {
          drafts[index] = {
            ...drafts[index],
            ...patch,
            updatedAtIso: new Date().toISOString(),
          };
          break;
        }
      }
      return { draftEpisodesByShowId: newDraftsByShowId };
    });
  },
  getDraftEpisodeById: (id) => {
    for (const drafts of Object.values(get().draftEpisodesByShowId)) {
      const draft = drafts.find((d) => d.id === id);
      if (draft) return draft;
    }
    return undefined;
  },
  removeDraftEpisode: (id) => {
    set((state) => {
      const newDraftsByShowId = { ...state.draftEpisodesByShowId };
      for (const showId in newDraftsByShowId) {
        newDraftsByShowId[showId] = newDraftsByShowId[showId].filter(
          (d) => d.id !== id,
        );
      }
      return { draftEpisodesByShowId: newDraftsByShowId };
    });
  },
  reset: () => {
    set({ shows: [], draftEpisodesByShowId: {} });
  },
}));
