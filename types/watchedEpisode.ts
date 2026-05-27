import type { EpisodeId } from "./episode";
import type { ISODateString, ShowId, UserId } from "./show";

export type WatchedEpisodeId = string;

export type WatchedEpisodeProgress = {
  progressSeconds: number;
  durationSeconds: number;
  completed: boolean;
};

export type WatchedEpisode = {
  id: WatchedEpisodeId;
  userId: UserId;
  showId: ShowId;
  episodeId: EpisodeId;
  watchedAt: ISODateString;
} & WatchedEpisodeProgress;

export type CreateWatchedEpisodeInput = {
  userId: UserId;
  showId: ShowId;
  episodeId: EpisodeId;
  watchedAt?: ISODateString;
  progressSeconds?: number;
  durationSeconds?: number;
  completed?: boolean;
};

export type UpdateWatchedEpisodeProgressInput = {
  watchedAt?: ISODateString;
  progressSeconds?: number;
  durationSeconds?: number;
  completed?: boolean;
};

export type WatchedEpisodeState = {
  currentUserId: UserId | null;
  records: readonly WatchedEpisode[];
};
