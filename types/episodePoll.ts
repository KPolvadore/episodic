import type { EpisodeId } from "./episode";
import type { ISODateString, UserId } from "./show";

export type EpisodePollId = string;

export type EpisodePollOptionId = string;

export type EpisodePollVoteId = string;

export type EpisodePollOption = {
  id: EpisodePollOptionId;
  label: string;
  order: number;
};

export type EpisodePoll = {
  id: EpisodePollId;
  episodeId: EpisodeId;
  question: string;
  options: EpisodePollOption[];
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type EpisodePollVote = {
  id: EpisodePollVoteId;
  pollId: EpisodePollId;
  optionId: EpisodePollOptionId;
  userId: UserId;
  createdAt: ISODateString;
};

export type CreateEpisodePollInput = {
  episodeId: EpisodeId;
  question: string;
  options: Array<Pick<EpisodePollOption, "label" | "order">>;
  isActive?: boolean;
};

export type UpdateEpisodePollInput = Partial<
  Pick<EpisodePoll, "question" | "options" | "isActive">
>;

export type CreateEpisodePollVoteInput = {
  pollId: EpisodePollId;
  optionId: EpisodePollOptionId;
  userId: UserId;
};
