import type { ISODateString, ShowId, UserId } from "@/types/show";

export type ShowFollowId = string;

export type ShowFollow = {
  id: ShowFollowId;
  showId: ShowId;
  userId: UserId;
  createdAt: ISODateString;
};

export type CreateShowFollowInput = {
  showId: ShowId;
  userId: UserId;
};

export type RemoveShowFollowInput = {
  showId: ShowId;
  userId: UserId;
};

export type ShowFollowState = {
  showId: ShowId;
  currentUserId: UserId | null;
  isFollowed: boolean;
  followerCount: number;
};
