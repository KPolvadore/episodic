import type { ShowId, UserId } from "@/types/show";
import type { ShowFollow, ShowFollowState } from "@/types/showFollow";

export function isShowFollowed(
  follows: readonly ShowFollow[],
  showId: ShowId,
  userId: UserId,
) {
  return follows.some((follow) => follow.showId === showId && follow.userId === userId);
}

function getShowFollowerCount(follows: readonly ShowFollow[], showId: ShowId) {
  return follows.filter((follow) => follow.showId === showId).length;
}

export function getShowFollowerCountLabel(followerCount: number) {
  return followerCount === 1 ? "1 follower" : `${followerCount} followers`;
}

export function getInitialShowFollowState(params: {
  follows: readonly ShowFollow[];
  showId: ShowId;
  currentUserId: UserId | null;
}): ShowFollowState {
  const { follows, showId, currentUserId } = params;

  return {
    currentUserId,
    followerCount: getShowFollowerCount(follows, showId),
    isFollowed:
      currentUserId === null
        ? false
        : isShowFollowed(follows, showId, currentUserId),
    showId,
  };
}
