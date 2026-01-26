// Stable feed API boundary for the Episodic App

import { useCreatorStore } from "../state/creator-store";

// Domain types (minimal for this boundary)
export interface Show {
  id: string;
  title: string;
  creatorId: string;
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

export type FeedItem = EpisodeWithShow | Special;

// Feed types
export type FeedType =
  | "new"
  | "continue"
  | "library"
  | "newShowsOnly"
  | "local";

// In-memory stores for published content
const publishedShows = new Map<string, Show>();
const publishedEpisodes: PublishedEpisode[] = [];
const localPublishedEpisodesByShowId: Record<string, EpisodeWithShow[]> = {};

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
    show = { ...existing, creatorId: input.creatorId ?? "creator-local" };
  } else {
    show = {
      id: input.showId,
      title: creatorShow?.title ?? input.showTitle ?? "New Show",
      creatorId: input.creatorId ?? "creator-local",
    };
  }
  publishedShows.set(show.id, show);

  // Create episode
  const isTrailer = input.episodeType === "trailer";
  const episodeNumber = isTrailer ? 0 : (input.episodeNumber ?? 1);
  const episodeId = `pub-${input.showId}-${episodeNumber}-${input.seasonNumber ?? 1}`;
  const existingEpisode = publishedEpisodes.find((ep) => ep.id === episodeId);
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
  if (!localPublishedEpisodesByShowId[input.showId]) {
    localPublishedEpisodesByShowId[input.showId] = [];
  }
  localPublishedEpisodesByShowId[input.showId].push(episodeWithShow);

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
  let mockShows: Show[] = [];
  let mockEpisodes: Episode[] = [];

  switch (feedType) {
    case "new":
      mockShows = [
        { id: "show1", title: "New Adventures", creatorId: "creator1" },
        { id: "show2", title: "Fresh Comedy", creatorId: "creator2" },
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
        },
      ];
      break;
    case "continue":
      mockShows = [
        { id: "show3", title: "Ongoing Series", creatorId: "creator3" },
        { id: "show4", title: "Continuing Story", creatorId: "creator4" },
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
      localPublishedEpisodesByShowId,
    ).flat();
    result.push(...allLocalEpisodes);
  }

  return result;
}

// Corrected helper to check if a show is eligible for public feeds
function isShowEligibleForPublicFeeds(showId: string): boolean {
  const publishedEpisodesForShow = publishedEpisodes.filter(
    (ep: PublishedEpisode) => ep.showId === showId,
  );
  const hasPublishedTrailer = publishedEpisodesForShow.some(
    (ep) => ep.kind === "trailer" && ep.status === "published",
  );
  return publishedEpisodesForShow.length > 0 || hasPublishedTrailer;
}

// Mixed feed with specials
export async function getMixedFeed(feedType: FeedType): Promise<FeedItem[]> {
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
  const feeds: FeedType[] = ["new", "continue", "library"];
  for (const feed of feeds) {
    const data = await getFeed(feed);
    const show = data.find((item) => item.show.id === showId)?.show;
    if (show) return { id: show.id, title: show.title };
  }
  // Check published shows
  const publishedShow = publishedShows.get(showId);
  if (publishedShow)
    return { id: publishedShow.id, title: publishedShow.title };
  // Check creator store
  const creatorShow = useCreatorStore.getState().getShowById(showId);
  if (creatorShow) return { id: creatorShow.id, title: creatorShow.title };
  return null;
}

// Canonical show episode list is normalized + sorted
export async function getShowEpisodes(
  showId: string,
): Promise<EpisodeWithShow[]> {
  // Get feed data for all shows (including user-created ones that may have become eligible)
  const [newData, libraryData, continueData] = await Promise.all([
    getFeed("new"),
    getFeed("library"),
    getFeed("continue"),
  ]);
  const allData = [...newData, ...libraryData, ...continueData];
  // Add published episodes for this show
  const publishedForShow = publishedEpisodes
    .filter((ep) => ep.showId === showId)
    .map((episode) => {
      const show = publishedShows.get(episode.showId)!;
      return { type: "episode" as const, episode, show };
    });
  const localForShow = localPublishedEpisodesByShowId[showId] || [];
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

// Define PublishedEpisode type
export interface PublishedEpisode extends Episode {
  kind: "trailer" | "episode";
  status: "published" | "draft";
}
