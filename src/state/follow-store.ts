import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FollowStore {
  followedShowIds: string[];
  isShowFollowed: (showId: string) => boolean;
  followShow: (showId: string) => void;
  unfollowShow: (showId: string) => void;
  toggleFollowShow: (showId: string) => void;
  getFollowedShowIds: () => string[];
}

export const useFollowStore = create<FollowStore>()(
  persist(
    (set, get) => ({
      followedShowIds: [],
      isShowFollowed: (showId: string) => {
        return get().followedShowIds.includes(showId);
      },
      followShow: (showId: string) => {
        set((state) => {
          if (state.followedShowIds.includes(showId)) return state;
          return { followedShowIds: [showId, ...state.followedShowIds] };
        });
      },
      unfollowShow: (showId: string) => {
        set((state) => ({
          followedShowIds: state.followedShowIds.filter((id) => id !== showId),
        }));
      },
      toggleFollowShow: (showId: string) => {
        const { isShowFollowed, followShow, unfollowShow } = get();
        if (isShowFollowed(showId)) {
          unfollowShow(showId);
        } else {
          followShow(showId);
        }
      },
      getFollowedShowIds: () => {
        return get().followedShowIds;
      },
    }),
    {
      name: "follow-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
