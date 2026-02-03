import { create } from "zustand";

interface FollowStore {
  followedShowIds: Set<string>;
  isShowFollowed: (showId: string) => boolean;
  followShow: (showId: string) => void;
  unfollowShow: (showId: string) => void;
  toggleFollowShow: (showId: string) => void;
  getFollowedShowIds: () => string[];
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  followedShowIds: new Set<string>(),
  isShowFollowed: (showId: string) => {
    return get().followedShowIds.has(showId);
  },
  followShow: (showId: string) => {
    set((state) => {
      const newSet = new Set(state.followedShowIds);
      newSet.add(showId);
      return { followedShowIds: newSet };
    });
  },
  unfollowShow: (showId: string) => {
    set((state) => {
      const newSet = new Set(state.followedShowIds);
      newSet.delete(showId);
      return { followedShowIds: newSet };
    });
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
    return Array.from(get().followedShowIds);
  },
}));
