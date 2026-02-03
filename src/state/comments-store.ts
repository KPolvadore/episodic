import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Comment = {
  id: string;
  episodeId: string;
  body: string;
  authorName: string;
  createdAtIso: string;
};

interface CommentsState {
  commentsByEpisodeId: Record<string, Comment[]>;
  addComment: (episodeId: string, body: string) => void;
  getComments: (episodeId: string) => Comment[];
  reset: () => void;
}

const MAX_COMMENT_LENGTH = 240;
const EMPTY_COMMENTS: Comment[] = [];

export const commentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      commentsByEpisodeId: {},
      addComment: (episodeId, body) => {
        const trimmed = body.trim();
        if (!trimmed) return;
        if (trimmed.length > MAX_COMMENT_LENGTH) return;
        const newComment: Comment = {
          id: `comment-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          episodeId,
          body: trimmed,
          authorName: "You",
          createdAtIso: new Date().toISOString(),
        };
        set((state) => {
          const existing = state.commentsByEpisodeId[episodeId] || [];
          return {
            commentsByEpisodeId: {
              ...state.commentsByEpisodeId,
              [episodeId]: [newComment, ...existing],
            },
          };
        });
      },
      getComments: (episodeId) => {
        return get().commentsByEpisodeId[episodeId] || EMPTY_COMMENTS;
      },
      reset: () => {
        set({ commentsByEpisodeId: {} });
      },
    }),
    {
      name: "comments-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useCommentsStore = commentsStore;
export const COMMENTS_MAX_LENGTH = MAX_COMMENT_LENGTH;
