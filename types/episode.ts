import type { ISODateString, ShowId } from "./show";

export type EpisodeId = string;

export type EpisodeHookType =
  | "none"
  | "question"
  | "poll"
  | "cliffhanger"
  | "challenge"
  | "reveal";

export type Episode = {
  id: EpisodeId;
  showId: ShowId;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  hookType: EpisodeHookType;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateEpisodeInput = {
  showId: ShowId;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  hookType?: EpisodeHookType;
};

export type UpdateEpisodeInput = Partial<
  Pick<
    Episode,
    | "seasonNumber"
    | "episodeNumber"
    | "title"
    | "description"
    | "videoUrl"
    | "thumbnailUrl"
    | "hookType"
  >
>;
