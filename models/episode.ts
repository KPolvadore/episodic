import type {
  CreateEpisodeInput,
  Episode,
  EpisodeHookType,
} from "@/types/episode";

export const defaultEpisodeHookType: EpisodeHookType = "none";

export const defaultSeasonNumber = 1;

export const defaultEpisodeNumber = 1;

export const episodeHookTypes = [
  "none",
  "question",
  "poll",
  "cliffhanger",
  "challenge",
  "reveal",
] as const satisfies readonly EpisodeHookType[];

export const episodeHookLabels = {
  none: "None",
  question: "Question",
  poll: "Poll",
  cliffhanger: "Cliffhanger",
  challenge: "Challenge",
  reveal: "Reveal",
} as const satisfies Record<EpisodeHookType, string>;

export const episodeHookOptions = episodeHookTypes.map((hookType) => ({
  label: episodeHookLabels[hookType],
  value: hookType,
}));

export function hasEpisodeVideoPlaceholder(videoUrl: string | null | undefined) {
  return Boolean(videoUrl?.trim());
}

export function getEpisodeVideoStatusLabel(
  videoUrl: string | null | undefined,
) {
  return hasEpisodeVideoPlaceholder(videoUrl) ? "Video URL added" : "No video yet";
}

export function getEpisodeHookLabel(hookType: EpisodeHookType) {
  return episodeHookLabels[hookType];
}

export function normalizeEpisodeTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function normalizeEpisodeRecap(recapText: string | null | undefined) {
  if (recapText == null) {
    return null;
  }

  const normalizedRecap = recapText.trim().replace(/\s+/g, " ");
  return normalizedRecap.length > 0 ? normalizedRecap : null;
}

export function hasEpisodeRecap(recapText: string | null | undefined) {
  return normalizeEpisodeRecap(recapText) !== null;
}

export function getEpisodeRecapPreview(
  recapText: string | null | undefined,
  maxLength = 120,
) {
  const normalizedRecap = normalizeEpisodeRecap(recapText);
  if (normalizedRecap === null) {
    return null;
  }

  if (normalizedRecap.length <= maxLength) {
    return normalizedRecap;
  }

  return `${normalizedRecap.slice(0, maxLength).trimEnd()}…`;
}

export function isValidEpisodeTitle(title: string) {
  return normalizeEpisodeTitle(title).length > 0;
}

export function isValidEpisodeNumber(number: number) {
  return Number.isInteger(number) && number > 0;
}

export function getEpisodeDisplayNumber(
  episode: Pick<Episode, "seasonNumber" | "episodeNumber">,
) {
  return `S${episode.seasonNumber}:E${episode.episodeNumber}`;
}

export function getDefaultCreateEpisodeInput(
  showId: CreateEpisodeInput["showId"],
): CreateEpisodeInput {
  return {
    description: "",
    episodeNumber: defaultEpisodeNumber,
    hookType: defaultEpisodeHookType,
    recapText: null,
    seasonNumber: defaultSeasonNumber,
    showId,
    thumbnailUrl: null,
    title: "",
    videoUrl: null,
  };
}

export function getNextEpisodeNumber(
  episodes: readonly Pick<
    Episode,
    "showId" | "seasonNumber" | "episodeNumber"
  >[],
  showId: CreateEpisodeInput["showId"],
  seasonNumber = defaultSeasonNumber,
) {
  const existingEpisodeNumbers = episodes
    .filter(
      (episode) =>
        episode.showId === showId && episode.seasonNumber === seasonNumber,
    )
    .map((episode) => episode.episodeNumber);

  if (existingEpisodeNumbers.length === 0) {
    return defaultEpisodeNumber;
  }

  return Math.max(...existingEpisodeNumbers) + 1;
}
