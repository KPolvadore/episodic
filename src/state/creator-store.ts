import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type EpisodeWithShow, type Show as FeedShow } from "../api/feed.api";

const EMPTY_DRAFTS: DraftEpisode[] = [];

interface Show {
  id: string;
  title: string;
  topicIds?: string[];
  topicName?: string;
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
  sharedWithWritersRoom?: boolean;
  sharedAt?: string;
}

interface PublishedEpisode {
  id: string;
  showId: string;
  episodeNumber: number;
  seasonNumber?: number;
  title: string;
  videoUrl: string;
  duration: number;
  createdAt: Date;
  publishedAt?: Date;
  trailerForEpisodeNumber?: number;
  kind: "trailer" | "episode";
  status: "published" | "draft";
}

interface CreatorStore {
  shows: Show[];
  draftEpisodesByShowId: Record<string, DraftEpisode[]>;
  publishedEpisodes: PublishedEpisode[];
  publishedShows: Record<string, FeedShow>;
  localPublishedEpisodesByShowId: Record<string, EpisodeWithShow[]>;
  addShow: (input: {
    id: string;
    title: string;
    topicId?: string;
    topicName?: string;
  }) => void;
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
  shareDraft: (showId: string, draftId: string) => void;
  unshareDraft: (showId: string, draftId: string) => void;
  getSharedDraftsByShowId: (showId: string) => DraftEpisode[];
  removeDraftEpisode: (id: string) => void;
  addPublishedEpisode: (episode: PublishedEpisode, show: FeedShow) => void;
  addLocalPublishedEpisode: (showId: string, item: EpisodeWithShow) => void;
  reset: () => void;
}

export const creatorStore = create<CreatorStore>()(
  persist(
    (set, get) => ({
      shows: [],
      draftEpisodesByShowId: {},
      publishedEpisodes: [],
      publishedShows: {},
      localPublishedEpisodesByShowId: {},
      addShow: (input) => {
        const newShow: Show = {
          id: input.id,
          title: input.title,
          topicIds: input.topicId ? [input.topicId] : [],
          topicName: input.topicName,
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
          const existingDrafts =
            state.draftEpisodesByShowId[input.showId] || [];
          const existingIndex = existingDrafts.findIndex(
            (d) => d.id === input.id,
          );
          let updatedDrafts;
          if (existingIndex >= 0) {
            updatedDrafts = existingDrafts.map((d, i) =>
              i === existingIndex ? newDraft : d,
            );
          } else {
            updatedDrafts = [...existingDrafts, newDraft];
          }
          return {
            draftEpisodesByShowId: {
              ...state.draftEpisodesByShowId,
              [input.showId]: updatedDrafts,
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
      shareDraft: (showId, draftId) => {
        set((state) => {
          const drafts = state.draftEpisodesByShowId[showId] || [];
          const updatedDrafts = drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  sharedWithWritersRoom: true,
                  sharedAt: d.sharedAt || new Date().toISOString(),
                }
              : d,
          );
          return {
            draftEpisodesByShowId: {
              ...state.draftEpisodesByShowId,
              [showId]: updatedDrafts,
            },
          };
        });
      },
      unshareDraft: (showId, draftId) => {
        set((state) => {
          const drafts = state.draftEpisodesByShowId[showId] || [];
          const updatedDrafts = drafts.map((d) =>
            d.id === draftId ? { ...d, sharedWithWritersRoom: false } : d,
          );
          return {
            draftEpisodesByShowId: {
              ...state.draftEpisodesByShowId,
              [showId]: updatedDrafts,
            },
          };
        });
      },
      getSharedDraftsByShowId: (showId) => {
        const drafts = get().draftEpisodesByShowId[showId] || [];
        return drafts
          .filter((d) => d.sharedWithWritersRoom)
          .sort((a, b) => {
            const aTime = a.sharedAt || a.createdAtIso;
            const bTime = b.sharedAt || b.createdAtIso;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
      },
      updateDraftEpisode: (id, patch) => {
        set((state) => {
          const newDraftsByShowId = { ...state.draftEpisodesByShowId };
          for (const showId in newDraftsByShowId) {
            const drafts = newDraftsByShowId[showId];
            const index = drafts.findIndex((d) => d.id === id);
            if (index >= 0) {
              const updatedDrafts = drafts.map((d) =>
                d.id === id
                  ? {
                      ...d,
                      ...patch,
                      updatedAtIso: new Date().toISOString(),
                    }
                  : d,
              );
              newDraftsByShowId[showId] = updatedDrafts;
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
      addPublishedEpisode: (episode, show) => {
        set((state) => ({
          publishedEpisodes: [...state.publishedEpisodes, episode],
          publishedShows: { ...state.publishedShows, [show.id]: show },
        }));
      },
      addLocalPublishedEpisode: (showId, item) => {
        set((state) => {
          const existing = state.localPublishedEpisodesByShowId[showId] || [];
          return {
            localPublishedEpisodesByShowId: {
              ...state.localPublishedEpisodesByShowId,
              [showId]: [...existing, item],
            },
          };
        });
      },
      reset: () => {
        set({
          shows: [],
          draftEpisodesByShowId: {},
          publishedEpisodes: [],
          publishedShows: {},
          localPublishedEpisodesByShowId: {},
        });
      },
    }),
    {
      name: "creator-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useCreatorStore = creatorStore;
export const getCreatorStore = () => creatorStore.getState();
