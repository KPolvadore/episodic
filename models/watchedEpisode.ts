import type { CreateWatchedEpisodeInput } from "@/types/watchedEpisode";
import type { Episode, EpisodeId } from "@/types/episode";
import type { ShowId } from "@/types/show";
import type { WatchedEpisode } from "@/types/watchedEpisode";

const MIN_PROGRESS_SECONDS = 0;
const EPSILON = 1e-6;

export function getWatchProgressPercent(params: {
  progressSeconds: number;
  durationSeconds: number;
}) {
  const { progressSeconds, durationSeconds } = params;

  if (durationSeconds <= 0) {
    return 0;
  }

  const rawPercent = (progressSeconds / durationSeconds) * 100;

  return Math.max(0, Math.min(100, rawPercent));
}

export function isEpisodeCompleted(params: {
  progressSeconds: number;
  durationSeconds: number;
  completed?: boolean;
}) {
  const { progressSeconds, durationSeconds, completed = false } = params;

  if (completed) {
    return true;
  }

  if (durationSeconds <= 0) {
    return false;
  }

  return progressSeconds + EPSILON >= durationSeconds;
}

export function getInitialWatchedEpisodeState(
  input: CreateWatchedEpisodeInput,
): Required<Pick<CreateWatchedEpisodeInput, "progressSeconds" | "durationSeconds" | "completed">> {
  const progressSeconds = Math.max(
    MIN_PROGRESS_SECONDS,
    input.progressSeconds ?? MIN_PROGRESS_SECONDS,
  );
  const durationSeconds = Math.max(
    MIN_PROGRESS_SECONDS,
    input.durationSeconds ?? MIN_PROGRESS_SECONDS,
  );

  return {
    completed: input.completed ?? isEpisodeCompleted({ durationSeconds, progressSeconds }),
    durationSeconds,
    progressSeconds,
  };
}

export function getWatchedEpisodeProgressLabel(params: {
  progressSeconds: number;
  durationSeconds: number;
  completed: boolean;
}) {
  if (params.completed) {
    return "Completed";
  }

  const percent = Math.round(
    getWatchProgressPercent({
      durationSeconds: params.durationSeconds,
      progressSeconds: params.progressSeconds,
    }),
  );

  return `${percent}% watched`;
}

export function sortEpisodesBySeasonAndEpisode<T extends Pick<Episode, "seasonNumber" | "episodeNumber">>(
  episodes: readonly T[],
) {
  return [...episodes].sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) {
      return a.seasonNumber - b.seasonNumber;
    }

    return a.episodeNumber - b.episodeNumber;
  });
}

export function getCompletedEpisodeIds(
  watchedEpisodes: readonly WatchedEpisode[],
  showId: ShowId,
) {
  const completedEpisodeIds = new Set<EpisodeId>();

  watchedEpisodes.forEach((record) => {
    if (record.showId !== showId) {
      return;
    }

    if (
      isEpisodeCompleted({
        completed: record.completed,
        durationSeconds: record.durationSeconds,
        progressSeconds: record.progressSeconds,
      })
    ) {
      completedEpisodeIds.add(record.episodeId);
    }
  });

  return completedEpisodeIds;
}

export function isEpisodeWatched(
  episodeId: EpisodeId,
  completedEpisodeIds: ReadonlySet<EpisodeId>,
) {
  return completedEpisodeIds.has(episodeId);
}

export function getNextUnwatchedEpisode(
  episodes: readonly Episode[],
  watchedEpisodes: readonly WatchedEpisode[],
  showId: ShowId,
) {
  const orderedShowEpisodes = sortEpisodesBySeasonAndEpisode(
    episodes.filter((episode) => episode.showId === showId),
  );
  const completedEpisodeIds = getCompletedEpisodeIds(watchedEpisodes, showId);

  return (
    orderedShowEpisodes.find(
      (episode) => !isEpisodeWatched(episode.id, completedEpisodeIds),
    ) ?? null
  );
}
