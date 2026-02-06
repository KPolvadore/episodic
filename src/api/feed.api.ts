// Stable feed API boundary for the Episodic App

import Constants from "expo-constants";
import { getCreatorStore, useCreatorStore } from "../state/creator-store";
import { logger } from "../lib/logger";

const runtimeExtra = (Constants.expoConfig?.extra ||
  (Constants as any)?.manifest?.extra ||
  {}) as Record<string, string | undefined>;

const API_BASE_URL = String(
  runtimeExtra.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "",
).trim();

const USE_MOCKS =
  String(
    runtimeExtra.EXPO_PUBLIC_FEATURE_USE_MOCKS ||
      process.env.EXPO_PUBLIC_FEATURE_USE_MOCKS ||
      "true",
  ).toLowerCase() !== "false";

let forceMocks = false;
let warnedApiFailure = false;

function markApiFailure(error: unknown, context: string) {
  forceMocks = true;
  if (!warnedApiFailure) {
    warnedApiFailure = true;
    logger.warn(`${context} API unavailable, falling back to mocks`, error);
  }
}

function shouldUseMocks() {
  return USE_MOCKS || forceMocks;
}

async function fetchJson<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not set");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return (await res.json()) as T;
}

function coerceDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function normalizeApiEpisodeWithShow(item: EpisodeWithShow): EpisodeWithShow {
  return {
    ...item,
    episode: {
      ...item.episode,
      createdAt: coerceDate((item.episode as any).createdAt),
      publishedAt: item.episode.publishedAt
        ? coerceDate((item.episode as any).publishedAt)
        : undefined,
    },
  };
}

function normalizeApiFeedItem(item: FeedItem): FeedItem {
  if (item.type === "episode") {
    return normalizeApiEpisodeWithShow(item);
  }
  return item;
}

// Domain types (minimal for this boundary)
export interface Show {
  id: string;
  title: string;
  creatorId: string;
  topicIds?: string[];
  topicName?: string;
  createdAtIso?: string;
}

export interface Episode {
  id: string;
  showId: string;
  episodeNumber: number;
  seasonNumber?: number;
  title: string;
  videoUrl: string;
  duration: number;
  createdAt: Date;
  publishedAt?: Date;
  trailerForEpisodeNumber?: number;
  topicIds?: string[];
}

export interface EpisodeWithShow {
  type: "episode";
  episode: Episode;
  show: Show;
}

// Special types
export type SpecialKind = "recap" | "trailer" | "bts" | "qna";

export interface Special {
  type: "special";
  specialId: string;
  title: string;
  kind: SpecialKind;
  attachedShowIds?: string[];
  attachedTopicIds?: string[];
  // Enforce: at least one of attachedShowIds or attachedTopicIds must be non-empty
}

export interface Topic {
  id: string;
  name: string;
  slug?: string;
}

export type FeedItem = EpisodeWithShow | Special;

// Feed types
export type FeedType =
  | "new"
  | "continue"
  | "library"
  | "newShowsOnly"
  | "local";

export type PublishEpisodeInput = {
  showId: string;
  showTitle?: string;
  creatorId?: string;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  videoUrl?: string;
  duration?: number;
  episodeType?: "episode" | "trailer";
  trailerForEpisodeNumber?: number;
};

export async function publishEpisode(
  input: PublishEpisodeInput,
): Promise<EpisodeWithShow> {
  // Resolve show
  let show: Show;
  const existing = await getShowById(input.showId);
  const creatorShow = useCreatorStore.getState().getShowById(input.showId);
  if (existing) {
    show = {
      ...existing,
      creatorId: input.creatorId ?? "creator-local",
      topicIds: creatorShow?.topicIds || [],
      topicName: creatorShow?.topicName,
    };
  } else {
    show = {
      id: input.showId,
      title: creatorShow?.title ?? input.showTitle ?? "New Show",
      creatorId: input.creatorId ?? "creator-local",
      topicIds: creatorShow?.topicIds || [],
      topicName: creatorShow?.topicName,
    };
  }

  // Create episode
  const isTrailer = input.episodeType === "trailer";
  const episodeNumber = isTrailer ? 0 : (input.episodeNumber ?? 1);
  const episodeId = `pub-${input.showId}-${episodeNumber}-${input.seasonNumber ?? 1}`;
  const existingEpisode = getCreatorStore().publishedEpisodes.find(
    (ep) => ep.id === episodeId,
  );
  if (existingEpisode) {
    return {
      type: "episode",
      episode: existingEpisode,
      show,
    };
  }
  const episode: PublishedEpisode = {
    id: episodeId,
    showId: input.showId,
    episodeNumber,
    seasonNumber: input.seasonNumber ?? 1,
    title: input.title,
    videoUrl: input.videoUrl ?? "mock-url-published",
    duration: input.duration ?? 30,
    createdAt: new Date(),
    publishedAt: new Date(),
    kind: input.episodeType ?? "episode",
    status: "published",
    ...(isTrailer && {
      trailerForEpisodeNumber: input.trailerForEpisodeNumber ?? 1,
    }),
  };
  const episodeWithShow: EpisodeWithShow = {
    type: "episode",
    episode,
    show,
  };
  getCreatorStore().addPublishedEpisode(episode, show);
  getCreatorStore().addLocalPublishedEpisode(input.showId, episodeWithShow);

  return episodeWithShow;
}

// Helper to normalize EpisodeWithShow for stable contract
function normalizeEpisodeWithShow(item: EpisodeWithShow): EpisodeWithShow {
  return {
    ...item,
    episode: {
      ...item.episode,
      seasonNumber: item.episode.seasonNumber ?? 1,
      episodeNumber: item.episode.episodeNumber ?? 0,
      title: item.episode.title || "Untitled Episode",
    },
    show: {
      ...item.show,
      title: item.show.title || "Unknown Show",
    },
  };
}

// Helper to compare episodes for resume selection (higher season/episode is "later")
function compareEpisodesForResume(a: Episode, b: Episode): number {
  const aSeason = a.seasonNumber ?? 1;
  const bSeason = b.seasonNumber ?? 1;
  if (aSeason !== bSeason) return aSeason - bSeason;
  const aEp = a.episodeNumber ?? 0;
  const bEp = b.episodeNumber ?? 0;
  return aEp - bEp;
}

// Feed API function
export async function getFeed(feedType: FeedType): Promise<EpisodeWithShow[]> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: EpisodeWithShow[] }>(
        `/v1/feeds?type=${feedType}`,
      );
      return (payload.data || []).map(normalizeApiEpisodeWithShow);
    } catch (error) {
      markApiFailure(error, "Feed");
    }
  }
  let mockShows: Show[] = [];
  let mockEpisodes: Episode[] = [];

  switch (feedType) {
    case "new":
      mockShows = [
        {
          id: "show1",
          title: "New Adventures",
          creatorId: "creator1",
          topicIds: ["topic1"],
        },
        {
          id: "show2",
          title: "Fresh Comedy",
          creatorId: "creator2",
          topicIds: ["topic2"],
        },
      ];
      mockEpisodes = [
        {
          id: "ep1",
          showId: "show1",
          episodeNumber: 1,
          seasonNumber: 1,
          title: "Latest Episode",
          videoUrl: "mock-url-1",
          duration: 300,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic1"],
        },
        {
          id: "ep3",
          showId: "show1",
          episodeNumber: 2,
          seasonNumber: 1,
          title: "Next Adventure",
          videoUrl: "mock-url",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic1"],
        },
        {
          id: "ep2",
          showId: "show2",
          episodeNumber: 1,
          title: "Hot Off the Press",
          videoUrl: "mock-url-2",
          duration: 250,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic2"],
        },
      ];
      break;
    case "continue":
      mockShows = [
        {
          id: "show3",
          title: "Ongoing Series",
          creatorId: "creator3",
          topicIds: ["topic3"],
        },
        {
          id: "show4",
          title: "Continuing Story",
          creatorId: "creator4",
          topicIds: ["topic1"],
        },
      ];
      mockEpisodes = [
        {
          id: "ep3-1",
          showId: "show3",
          episodeNumber: 1,
          seasonNumber: 1,
          title: "Episode 1: Beginning",
          videoUrl: "mock-url-3-1",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-2",
          showId: "show3",
          episodeNumber: 2,
          seasonNumber: 1,
          title: "Episode 2: Development",
          videoUrl: "mock-url-3-2",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-3",
          showId: "show3",
          episodeNumber: 3,
          seasonNumber: 1,
          title: "Episode 3: Twist",
          videoUrl: "mock-url-3-3",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-4",
          showId: "show3",
          episodeNumber: 4,
          seasonNumber: 1,
          title: "Episode 4: Rising Action",
          videoUrl: "mock-url-3-4",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-5",
          showId: "show3",
          episodeNumber: 5,
          seasonNumber: 1,
          title: "Episode 5: Midpoint",
          videoUrl: "mock-url-3-5",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-6",
          showId: "show3",
          episodeNumber: 6,
          seasonNumber: 1,
          title: "Episode 6: Complications",
          videoUrl: "mock-url-3-6",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-7",
          showId: "show3",
          episodeNumber: 7,
          seasonNumber: 1,
          title: "Episode 7: Challenges",
          videoUrl: "mock-url-3-7",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-8",
          showId: "show3",
          episodeNumber: 8,
          seasonNumber: 1,
          title: "Episode 8: Turning Point",
          videoUrl: "mock-url-3-8",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-9",
          showId: "show3",
          episodeNumber: 9,
          seasonNumber: 1,
          title: "Episode 9: Climax Build",
          videoUrl: "mock-url-3-9",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-10",
          showId: "show3",
          episodeNumber: 10,
          seasonNumber: 1,
          title: "Episode 10: Peak Moment",
          videoUrl: "mock-url-3-10",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-11",
          showId: "show3",
          episodeNumber: 11,
          seasonNumber: 1,
          title: "Episode 11: Resolution",
          videoUrl: "mock-url-3-11",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-12",
          showId: "show3",
          episodeNumber: 12,
          seasonNumber: 1,
          title: "Episode 12: Finale",
          videoUrl: "mock-url-3-12",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
        {
          id: "ep4",
          showId: "show4",
          episodeNumber: 3,
          seasonNumber: 1,
          title: "Continue Watching 2",
          videoUrl: "mock-url-4",
          duration: 320,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
      ];
      // Continue feed: one resume item per show
      const dedupedEpisodes = mockEpisodes.reduce(
        (acc, ep) => {
          const showId = ep.showId;
          if (!acc[showId] || compareEpisodesForResume(acc[showId], ep) < 0) {
            acc[showId] = ep;
          }
          return acc;
        },
        {} as Record<string, (typeof mockEpisodes)[0]>,
      );
      mockEpisodes = Object.values(dedupedEpisodes);
      break;
    case "library":
      mockShows = [
        { id: "show3", title: "Ongoing Series", creatorId: "creator3" },
      ];
      mockEpisodes = [
        {
          id: "ep3-1",
          showId: "show3",
          episodeNumber: 1,
          seasonNumber: 1,
          title: "Episode 1: Beginning",
          videoUrl: "mock-url-3-1",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
        {
          id: "ep3-2",
          showId: "show3",
          episodeNumber: 2,
          seasonNumber: 1,
          title: "Episode 2: Development",
          videoUrl: "mock-url-3-2",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
        {
          id: "ep3-3",
          showId: "show3",
          episodeNumber: 3,
          seasonNumber: 1,
          title: "Episode 3: Twist",
          videoUrl: "mock-url-3-3",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-4",
          showId: "show3",
          episodeNumber: 4,
          seasonNumber: 1,
          title: "Episode 4: Rising Action",
          videoUrl: "mock-url-3-4",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-5",
          showId: "show3",
          episodeNumber: 5,
          seasonNumber: 1,
          title: "Episode 5: Midpoint",
          videoUrl: "mock-url-3-5",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-6",
          showId: "show3",
          episodeNumber: 6,
          seasonNumber: 1,
          title: "Episode 6: Complications",
          videoUrl: "mock-url-3-6",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-7",
          showId: "show3",
          episodeNumber: 7,
          seasonNumber: 1,
          title: "Episode 7: Challenges",
          videoUrl: "mock-url-3-7",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-8",
          showId: "show3",
          episodeNumber: 8,
          seasonNumber: 1,
          title: "Episode 8: Turning Point",
          videoUrl: "mock-url-3-8",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-9",
          showId: "show3",
          episodeNumber: 9,
          seasonNumber: 1,
          title: "Episode 9: Climax Build",
          videoUrl: "mock-url-3-9",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-10",
          showId: "show3",
          episodeNumber: 10,
          seasonNumber: 1,
          title: "Episode 10: Peak Moment",
          videoUrl: "mock-url-3-10",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
          topicIds: ["topic3"],
        },
        {
          id: "ep3-11",
          showId: "show3",
          episodeNumber: 11,
          seasonNumber: 1,
          title: "Episode 11: Resolution",
          videoUrl: "mock-url-3-11",
          duration: 280,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
      ];
      break;
    case "newShowsOnly":
      mockShows = [
        { id: "show5", title: "Brand New Show", creatorId: "creator5" },
        { id: "show6", title: "Debut Series", creatorId: "creator6" },
      ];
      mockEpisodes = [
        {
          id: "ep5",
          showId: "show5",
          episodeNumber: 1,
          title: "Pilot",
          videoUrl: "mock-url-5",
          duration: 350,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
        {
          id: "ep6",
          showId: "show6",
          episodeNumber: 1,
          title: "First Episode",
          videoUrl: "mock-url-6",
          duration: 270,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
      ];
      break;
    case "local":
      mockShows = [
        { id: "show7", title: "Local Tales", creatorId: "creator7" },
        { id: "show8", title: "Neighborhood Stories", creatorId: "creator8" },
      ];
      mockEpisodes = [
        {
          id: "ep7",
          showId: "show7",
          episodeNumber: 1,
          title: "Local Episode 1",
          videoUrl: "mock-url-7",
          duration: 290,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
        {
          id: "ep8",
          showId: "show8",
          episodeNumber: 2,
          title: "Local Episode 2",
          videoUrl: "mock-url-8",
          duration: 310,
          createdAt: new Date(),
          publishedAt: new Date(),
        },
      ];
      break;
  }

  const result = mockEpisodes
    .map((episode) => ({
      type: "episode" as const,
      episode,
      show: mockShows.find((s) => s.id === episode.showId)!,
    }))
    .map(normalizeEpisodeWithShow);

  // Include locally published episodes in new and local feeds
  if (feedType === "new" || feedType === "local") {
    const allLocalEpisodes = Object.values(
      getCreatorStore().localPublishedEpisodesByShowId,
    ).flat();
    result.push(...allLocalEpisodes);
  }

  return result;
}

// Corrected helper to check if a show is eligible for public feeds
function isShowEligibleForPublicFeeds(showId: string): boolean {
  const publishedEpisodesForShow = getCreatorStore().publishedEpisodes.filter(
    (ep: PublishedEpisode) => ep.showId === showId,
  );
  const hasPublishedTrailer = publishedEpisodesForShow.some(
    (ep) => ep.kind === "trailer" && ep.status === "published",
  );
  return publishedEpisodesForShow.length > 0 || hasPublishedTrailer;
}

// Mixed feed with specials
export async function getMixedFeed(feedType: FeedType): Promise<FeedItem[]> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: FeedItem[] }>(
        `/v1/mixed-feed?type=${feedType}`,
      );
      return (payload.data || []).map(normalizeApiFeedItem);
    } catch (error) {
      markApiFailure(error, "Mixed feed");
    }
  }
  const episodes = await getFeed(feedType);
  const specials: Special[] = [];

  if (feedType === "new") {
    specials.push(
      {
        type: "special",
        specialId: "special1",
        title: "Behind the Scenes of New Adventures",
        kind: "bts",
        attachedShowIds: ["show1"],
      },
      {
        type: "special",
        specialId: "special2",
        title: "Q&A with Creators",
        kind: "qna",
        attachedTopicIds: ["topic1"],
        attachedShowIds: ["show1"],
      },
    );
  }

  // Filter episodes for public feeds
  const filteredEpisodes = episodes.filter((item) => {
    if (item.type !== "episode") return true; // Include specials
    return isShowEligibleForPublicFeeds(item.show.id);
  });

  return [...filteredEpisodes, ...specials];
}

// Show-centric API helpers
export async function getShowById(
  showId: string,
): Promise<{ id: string; title: string } | null> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: Show | null }>(
        `/v1/shows/${showId}`,
      );
      if (payload.data) return { id: payload.data.id, title: payload.data.title };
    } catch (error) {
      markApiFailure(error, "Show");
    }
  }
  const feeds: FeedType[] = ["new", "continue", "library"];
  for (const feed of feeds) {
    const data = await getFeed(feed);
    const show = data.find((item) => item.show.id === showId)?.show;
    if (show) return { id: show.id, title: show.title };
  }
  // Check published shows
  const publishedShow = getCreatorStore().publishedShows[showId];
  if (publishedShow)
    return { id: publishedShow.id, title: publishedShow.title };
  // Check creator store
  const creatorShow = useCreatorStore.getState().getShowById(showId);
  if (creatorShow) return { id: creatorShow.id, title: creatorShow.title };
  return null;
}

export async function resolveShowById(
  showId: string,
): Promise<{ show: Show; source: string; debug: any } | null> {
  const creatorShow = useCreatorStore.getState().getShowById(showId);
  let curatedShow: Show | null = null;
  // Check published first
  curatedShow = getCreatorStore().publishedShows[showId] || null;
  if (!curatedShow && !shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: Show | null }>(
        `/v1/shows/${showId}`,
      );
      curatedShow = payload.data || null;
    } catch (error) {
      markApiFailure(error, "Show");
    }
  }
  if (!curatedShow) {
    // Check feeds
    const feeds: FeedType[] = [
      "new",
      "continue",
      "library",
      "newShowsOnly",
      "local",
    ];
    for (const feed of feeds) {
      const data = await getFeed(feed);
      const item = data.find((i) => i.show.id === showId);
      if (item) {
        curatedShow = item.show;
        break;
      }
    }
  }
  if (creatorShow && curatedShow) {
    const merged: Show = {
      ...curatedShow,
      ...creatorShow,
      topicIds: creatorShow.topicIds || curatedShow.topicIds || [],
      topicName: creatorShow.topicName || curatedShow.topicName,
    };
    return {
      show: merged,
      source: "merged",
      debug: {
        hasCreator: true,
        hasCurated: true,
        creatorTopicId: creatorShow.topicIds?.[0],
        curatedTopicIds: curatedShow.topicIds,
      },
    };
  } else if (creatorShow) {
    const show: Show = {
      id: creatorShow.id,
      title: creatorShow.title,
      creatorId: "creator",
      topicIds: creatorShow.topicIds || [],
      topicName: creatorShow.topicName,
    };
    return {
      show,
      source: "creator",
      debug: { hasCreator: true, hasCurated: false },
    };
  } else if (curatedShow) {
    return {
      show: curatedShow,
      source: "curated",
      debug: { hasCreator: false, hasCurated: true },
    };
  } else {
    return null;
  }
}

// Canonical show episode list is normalized + sorted
export async function getShowEpisodes(
  showId: string,
): Promise<EpisodeWithShow[]> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: EpisodeWithShow[] }>(
        `/v1/shows/${showId}/episodes`,
      );
      return (payload.data || []).map(normalizeApiEpisodeWithShow);
    } catch (error) {
      markApiFailure(error, "Show episodes");
    }
  }
  // Get feed data for all shows (including user-created ones that may have become eligible)
  const [newData, libraryData, continueData] = await Promise.all([
    getFeed("new"),
    getFeed("library"),
    getFeed("continue"),
  ]);
  const allData = [...newData, ...libraryData, ...continueData];
  // Add published episodes for this show
  const publishedForShow = getCreatorStore()
    .publishedEpisodes.filter((episode) => episode.showId === showId)
    .map((episode) => {
      const show = getCreatorStore().publishedShows[episode.showId]!;
      return { type: "episode" as const, episode, show };
    });
  const localForShow =
    getCreatorStore().localPublishedEpisodesByShowId[showId] || [];
  const allDataWithPublished = [
    ...allData,
    ...publishedForShow,
    ...localForShow,
  ];
  const showEpisodes = allDataWithPublished.filter(
    (item) => item.show.id === showId,
  );

  // Normalize items
  const normalizedEpisodes = showEpisodes.map(normalizeEpisodeWithShow);

  // Dedupe by episode.id
  const episodeMap = new Map<string, EpisodeWithShow>();
  normalizedEpisodes.forEach((item) => {
    if (!episodeMap.has(item.episode.id)) {
      episodeMap.set(item.episode.id, item);
    }
  });

  const episodes = Array.from(episodeMap.values());

  // Sort: trailers first, then by seasonNumber asc, then episodeNumber asc
  episodes.sort((a, b) => {
    const aIsTrailer =
      (a.episode as any).kind === "trailer" ||
      (a.episode as any).episodeType === "trailer";
    const bIsTrailer =
      (b.episode as any).kind === "trailer" ||
      (b.episode as any).episodeType === "trailer";
    if (aIsTrailer && !bIsTrailer) return -1;
    if (!aIsTrailer && bIsTrailer) return 1;
    const aSeason = a.episode.seasonNumber ?? 1;
    const bSeason = b.episode.seasonNumber ?? 1;
    if (aSeason !== bSeason) return aSeason - bSeason;
    return (a.episode.episodeNumber ?? 0) - (b.episode.episodeNumber ?? 0);
  });

  return episodes;
}

// Topic helpers
export const mockTopics: Topic[] = [
  { id: "topic1", name: "Adventure", slug: "adventure" },
  { id: "topic2", name: "Comedy", slug: "comedy" },
  { id: "topic3", name: "Drama", slug: "drama" },
];

export async function getTopicById(
  topicId: string,
): Promise<Topic | undefined> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: Topic | null }>(
        `/v1/topics/${topicId}`,
      );
      return payload.data || undefined;
    } catch (error) {
      markApiFailure(error, "Topic");
    }
  }
  return mockTopics.find((topic) => topic.id === topicId);
}

export async function getShowsByTopic(topicId: string): Promise<Show[]> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: Show[] }>(
        `/v1/topics/${topicId}/shows`,
      );
      return payload.data || [];
    } catch (error) {
      markApiFailure(error, "Topic shows");
    }
  }
  const showIds = new Set<string>();
  // Collect showIds from feeds
  for (const feedType of [
    "new",
    "continue",
    "library",
    "newShowsOnly",
    "local",
  ] as FeedType[]) {
    const feed = await getFeed(feedType);
    feed.forEach((item) => showIds.add(item.show.id));
  }
  // Add published showIds
  Object.keys(getCreatorStore().publishedShows).forEach((id) =>
    showIds.add(id),
  );
  // Add creator showIds
  useCreatorStore.getState().shows.forEach((s) => showIds.add(s.id));
  // Resolve each
  const resolvedShows: Show[] = [];
  for (const id of showIds) {
    const resolved = await resolveShowById(id);
    if (resolved) resolvedShows.push(resolved.show);
  }
  return resolvedShows.filter((show) => show.topicIds?.includes(topicId));
}

export async function getEpisodesByTopic(
  topicId: string,
): Promise<EpisodeWithShow[]> {
  if (!shouldUseMocks()) {
    try {
      const payload = await fetchJson<{ data: EpisodeWithShow[] }>(
        `/v1/topics/${topicId}/episodes`,
      );
      return (payload.data || []).map(normalizeApiEpisodeWithShow);
    } catch (error) {
      markApiFailure(error, "Topic episodes");
    }
  }
  // Get all episodes from feeds
  const allEpisodes: EpisodeWithShow[] = [];
  for (const feedType of [
    "new",
    "continue",
    "library",
    "newShowsOnly",
    "local",
  ] as FeedType[]) {
    const feed = await getFeed(feedType);
    allEpisodes.push(...feed);
  }
  // Also include published episodes
  getCreatorStore().publishedEpisodes.forEach((episode) => {
    const show = getCreatorStore().publishedShows[episode.showId];
    if (show) {
      allEpisodes.push({ type: "episode", episode, show });
    }
  });
  // Include creator episodes
  const creatorShows = useCreatorStore
    .getState()
    .shows.filter((s) => s.topicIds?.includes(topicId));
  creatorShows.forEach((show) => {
    const episodes =
      getCreatorStore().localPublishedEpisodesByShowId[show.id] || [];
    episodes.forEach((item) => {
      allEpisodes.push({
        type: "episode",
        episode: item.episode,
        show: {
          id: show.id,
          title: show.title,
          creatorId: "creator",
          topicIds: show.topicIds || [],
          topicName: show.topicName,
        },
      });
    });
  });
  return allEpisodes.filter(
    (item) =>
      item.episode.topicIds?.includes(topicId) ||
      item.show.topicIds?.includes(topicId),
  );
}

// Define PublishedEpisode type
export interface PublishedEpisode extends Episode {
  kind: "trailer" | "episode";
  status: "published" | "draft";
}
