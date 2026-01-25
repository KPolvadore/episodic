// Stable feed API boundary for the Episodic App

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
          videoUrl: "mock-url-3",
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

  return mockEpisodes
    .map((episode) => ({
      type: "episode" as const,
      episode,
      show: mockShows.find((s) => s.id === episode.showId)!,
    }))
    .map(normalizeEpisodeWithShow);
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

  return [...episodes, ...specials];
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
  return null;
}

// Canonical show episode list is normalized + sorted
export async function getShowEpisodes(
  showId: string,
): Promise<EpisodeWithShow[]> {
  const [newData, libraryData, continueData] = await Promise.all([
    getFeed("new"),
    getFeed("library"),
    getFeed("continue"),
  ]);
  const allData = [...newData, ...libraryData, ...continueData];
  const showEpisodes = allData.filter((item) => item.show.id === showId);

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

  // Sort by seasonNumber asc, then episodeNumber asc
  episodes.sort((a, b) => {
    const aSeason = a.episode.seasonNumber ?? 1;
    const bSeason = b.episode.seasonNumber ?? 1;
    if (aSeason !== bSeason) return aSeason - bSeason;
    return (a.episode.episodeNumber ?? 0) - (b.episode.episodeNumber ?? 0);
  });

  return episodes;
}
