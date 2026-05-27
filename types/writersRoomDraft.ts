import type { WritersRoomId } from "./collaboration";
import type { Episode } from "./episode";
import type { ISODateString, ShowId, UserId } from "./show";

export type WritersRoomDraftId = string;

export type WritersRoomDraftStatus =
  | "idea"
  | "outline"
  | "inReview"
  | "ready";

export type WritersRoomDraftType =
  | "episodePlan"
  | "storyArc"
  | "characterArc"
  | "other";

export type WritersRoomDraft = {
  id: WritersRoomDraftId;
  writersRoomId: WritersRoomId;
  showId: ShowId;
  createdByUserId: UserId;
  title: string;
  summary: string;
  status: WritersRoomDraftStatus;
  draftType: WritersRoomDraftType;
  targetSeasonNumber: Episode["seasonNumber"] | null;
  targetEpisodeNumber: Episode["episodeNumber"] | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type WritersRoomSceneId = string;

export type WritersRoomSceneType =
  | "intro"
  | "setup"
  | "conflict"
  | "reveal"
  | "cliffhanger"
  | "resolution"
  | "transition"
  | "other";

export type WritersRoomScene = {
  id: WritersRoomSceneId;
  draftId: WritersRoomDraftId;
  title: string;
  description: string;
  sceneType: WritersRoomSceneType;
  order: number;
  createdByUserId: UserId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateWritersRoomDraftInput = {
  writersRoomId: WritersRoomId;
  showId: ShowId;
  createdByUserId: UserId;
  title: string;
  summary?: string;
  status?: WritersRoomDraftStatus;
  draftType?: WritersRoomDraftType;
  targetSeasonNumber?: Episode["seasonNumber"] | null;
  targetEpisodeNumber?: Episode["episodeNumber"] | null;
};

export type UpdateWritersRoomDraftInput = Partial<
  Pick<
    WritersRoomDraft,
    | "title"
    | "summary"
    | "status"
    | "draftType"
    | "targetSeasonNumber"
    | "targetEpisodeNumber"
  >
>;

export type CreateWritersRoomSceneInput = {
  draftId: WritersRoomDraftId;
  title: string;
  description?: string;
  sceneType?: WritersRoomSceneType;
  order: number;
  createdByUserId: UserId;
};

export type UpdateWritersRoomSceneInput = Partial<
  Pick<WritersRoomScene, "title" | "description" | "sceneType" | "order">
>;
