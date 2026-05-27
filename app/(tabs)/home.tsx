import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  getEpisodeDisplayNumber,
  getEpisodeHookLabel,
  getEpisodeVideoStatusLabel,
} from "@/models/episode";
import { isShowPublic } from "@/models/show";
import {
  getNextUnwatchedEpisode,
  getWatchedEpisodeProgressLabel,
  isEpisodeCompleted,
} from "@/models/watchedEpisode";
import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import type { ShowCategory, ShowVisibility } from "@/types/show";
import type { Episode } from "@/types/episode";
import type { WatchedEpisode } from "@/types/watchedEpisode";

type PlaceholderFeedEpisode = {
  id: string;
  showId: string;
  showTitle: string;
  showDescription: string;
  showCategory: ShowCategory;
  showVisibility: ShowVisibility;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  episodeDescription: string;
  hookType: "none" | "question" | "poll" | "cliffhanger" | "challenge" | "reveal";
  videoUrl: string | null;
  publishedAt: string;
  isFollowedShow: boolean;
};

type FeedFilter = "allPublic" | "followedShows";

type ContinueWatchingSeed = {
  id: string;
  showId: string;
  showTitle: string;
  watchedEpisodes: WatchedEpisode[];
};

type EpisodeDetailRouteParamsInput = {
  description: string;
  episodeId: string;
  episodeNumber: number;
  hookType: PlaceholderFeedEpisode["hookType"];
  seasonNumber: number;
  showCategory: ShowCategory;
  showDescription: string;
  showId: string;
  showTitle: string;
  showVisibility: ShowVisibility;
  title: string;
  videoUrl: string | null;
};

function buildEpisodeDetailRouteParams(input: EpisodeDetailRouteParamsInput) {
  return {
    description: input.description,
    episodeId: input.episodeId,
    episodeNumber: String(input.episodeNumber),
    hookType: input.hookType,
    seasonNumber: String(input.seasonNumber),
    showCategory: input.showCategory,
    showDescription: input.showDescription,
    showId: input.showId,
    showTitle: input.showTitle,
    showVisibility: input.showVisibility,
    title: input.title,
    videoUrl: input.videoUrl ?? undefined,
  };
}

function deduplicateContinueWatchingSeedsByShow(
  seeds: readonly ContinueWatchingSeed[],
) {
  const seedsByShowId = new Map<string, ContinueWatchingSeed>();

  seeds.forEach((seed) => {
    const existing = seedsByShowId.get(seed.showId);

    if (!existing) {
      seedsByShowId.set(seed.showId, {
        ...seed,
        watchedEpisodes: [...seed.watchedEpisodes],
      });
      return;
    }

    existing.watchedEpisodes = [
      ...existing.watchedEpisodes,
      ...seed.watchedEpisodes,
    ];
  });

  return [...seedsByShowId.values()];
}

const placeholderFeedEpisodes: PlaceholderFeedEpisode[] = [
  {
    episodeDescription: "The crew tests tonight's menu in one borrowed kitchen before opening weekend.",
    episodeNumber: 1,
    episodeTitle: "Pilot Service",
    hookType: "question",
    id: "local-episode-1",
    isFollowedShow: true,
    seasonNumber: 1,
    showCategory: "documentary",
    showDescription: "A serialized look at neighborhood cooks building a weekend pop-up.",
    showId: "local-show-1",
    showTitle: "Kitchen After Hours",
    showVisibility: "public",
    videoUrl: null,
    publishedAt: "2026-05-24T19:30:00.000Z",
  },
  {
    episodeDescription: "A new bassline changes the whole song minutes before their first live rehearsal.",
    episodeNumber: 2,
    episodeTitle: "Rewrite at Midnight",
    hookType: "cliffhanger",
    id: "local-episode-2",
    isFollowedShow: false,
    seasonNumber: 1,
    showCategory: "music",
    showDescription: "A rehearsal diary following a band as they write their first EP.",
    showId: "local-show-2",
    showTitle: "Basement Sessions",
    showVisibility: "public",
    videoUrl: "https://example.com/basement-sessions-s1e2.mp4",
    publishedAt: "2026-05-26T15:45:00.000Z",
  },
  {
    episodeDescription: "A witness finally speaks, but the recording ends before the final name is said.",
    episodeNumber: 3,
    episodeTitle: "The Missing Name",
    hookType: "reveal",
    id: "local-episode-3",
    isFollowedShow: true,
    seasonNumber: 1,
    showCategory: "drama",
    showDescription: "A private concept show tracking scenes for a short-form mystery.",
    showId: "local-show-3",
    showTitle: "The Last Clue",
    showVisibility: "private",
    videoUrl: null,
    publishedAt: "2026-05-26T18:00:00.000Z",
  },
];

const publicFeedEpisodes = [...placeholderFeedEpisodes]
  .filter((item) => isShowPublic(item.showVisibility))
  .sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );

const continueWatchingEpisodes: Episode[] = placeholderFeedEpisodes.map((item) => ({
  createdAt: item.publishedAt,
  description: item.episodeDescription,
  episodeNumber: item.episodeNumber,
  hookType: item.hookType,
  id: item.id,
  seasonNumber: item.seasonNumber,
  showId: item.showId,
  thumbnailUrl: null,
  title: item.episodeTitle,
  updatedAt: item.publishedAt,
  videoUrl: item.videoUrl,
}));

const continueWatchingEpisodeDetailsById = new Map(
  placeholderFeedEpisodes.map((item) => [item.id, item] as const),
);

const placeholderContinueWatchingSeeds: ContinueWatchingSeed[] = [
  {
    id: "continue-local-1",
    showId: "local-show-1",
    showTitle: "Kitchen After Hours",
    watchedEpisodes: [
      {
        completed: true,
        durationSeconds: 900,
        episodeId: "local-episode-1",
        id: "watched-local-1",
        progressSeconds: 900,
        showId: "local-show-1",
        userId: "local-user-1",
        watchedAt: "2026-05-26T14:00:00.000Z",
      },
    ],
  },
  {
    id: "continue-local-2",
    showId: "local-show-2",
    showTitle: "Basement Sessions",
    watchedEpisodes: [
      {
        completed: false,
        durationSeconds: 1200,
        episodeId: "local-episode-2",
        id: "watched-local-2",
        progressSeconds: 420,
        showId: "local-show-2",
        userId: "local-user-1",
        watchedAt: "2026-05-26T16:10:00.000Z",
      },
    ],
  },
  {
    id: "continue-local-3",
    showId: "local-show-2",
    showTitle: "Basement Sessions",
    watchedEpisodes: [],
  },
];

const deduplicatedContinueWatchingSeeds = deduplicateContinueWatchingSeedsByShow(
  placeholderContinueWatchingSeeds,
);

export default function HomeScreen() {
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("allPublic");
  const visibleFeedEpisodes = useMemo(() => {
    if (feedFilter === "followedShows") {
      return publicFeedEpisodes.filter((item) => item.isFollowedShow);
    }

    return publicFeedEpisodes;
  }, [feedFilter]);
  const continueWatchingItems = useMemo(() => {
    return deduplicatedContinueWatchingSeeds
      .map((seed) => {
        const nextEpisode = getNextUnwatchedEpisode(
          continueWatchingEpisodes,
          seed.watchedEpisodes,
          seed.showId,
        );

        if (!nextEpisode) {
          return null;
        }

        const details = continueWatchingEpisodeDetailsById.get(nextEpisode.id);

        if (!details) {
          return null;
        }

        const matchingWatchRecord = seed.watchedEpisodes.find(
          (record) =>
            record.episodeId === nextEpisode.id &&
            !isEpisodeCompleted({
              completed: record.completed,
              durationSeconds: record.durationSeconds,
              progressSeconds: record.progressSeconds,
            }),
        );

        const progressLabel = matchingWatchRecord
          ? getWatchedEpisodeProgressLabel({
              completed: matchingWatchRecord.completed,
              durationSeconds: matchingWatchRecord.durationSeconds,
              progressSeconds: matchingWatchRecord.progressSeconds,
            })
          : "Not started yet";

        return {
          details,
          id: seed.id,
          nextEpisode,
          progressLabel,
          showTitle: seed.showTitle,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, []);

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title">Home Feed</ThemedText>
          <ThemedText variant="body" style={styles.headerCopy}>
            Follow what happens next.
          </ThemedText>
          <ThemedText variant="caption" style={styles.filterHelperText}>
            Followed feed is local to this screen until account support is
            connected.
          </ThemedText>
        </View>

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => {
              setFeedFilter("allPublic");
            }}
            style={[
              styles.filterButton,
              feedFilter === "allPublic"
                ? styles.filterButtonActive
                : styles.filterButtonInactive,
            ]}
          >
            <ThemedText variant="caption" style={styles.filterButtonText}>
              All Public
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setFeedFilter("followedShows");
            }}
            style={[
              styles.filterButton,
              feedFilter === "followedShows"
                ? styles.filterButtonActive
                : styles.filterButtonInactive,
            ]}
          >
            <ThemedText variant="caption" style={styles.filterButtonText}>
              Followed Shows
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.continueWatchingSection}>
          <ThemedText variant="subtitle">Continue Watching</ThemedText>
          <ThemedText variant="caption" style={styles.continueWatchingHelperText}>
            Local preview only. Continue Watching progress is temporary on this
            screen until account support is connected.
          </ThemedText>

          {continueWatchingItems.length === 0 ? (
            <ThemedView variant="card" style={styles.emptyStateCard}>
              <ThemedText variant="body" style={styles.emptyStateText}>
                No local Continue Watching items yet.
              </ThemedText>
            </ThemedView>
          ) : (
            continueWatchingItems.map((item) => (
              <ThemedView key={item.id} variant="card" style={styles.card}>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/episodes/[episodeId]",
                      params: buildEpisodeDetailRouteParams({
                        description: item.nextEpisode.description,
                        episodeId: item.nextEpisode.id,
                        episodeNumber: item.nextEpisode.episodeNumber,
                        hookType: item.nextEpisode.hookType,
                        seasonNumber: item.nextEpisode.seasonNumber,
                        showCategory: item.details.showCategory,
                        showDescription: item.details.showDescription,
                        showId: item.nextEpisode.showId,
                        showTitle: item.details.showTitle,
                        showVisibility: item.details.showVisibility,
                        title: item.nextEpisode.title,
                        videoUrl: item.nextEpisode.videoUrl,
                      }),
                    });
                  }}
                  style={styles.episodePressArea}
                >
                  <ThemedText variant="caption" style={styles.seriesLabel}>
                    {item.showTitle}
                  </ThemedText>
                  <ThemedText variant="subtitle" style={styles.cardTitle}>
                    {item.nextEpisode.title}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.episodeNumber}>
                    Next up · {getEpisodeDisplayNumber(item.nextEpisode)}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.continueWatchingProgress}>
                    {item.progressLabel}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            ))
          )}
        </View>

        <View style={styles.list}>
          {visibleFeedEpisodes.length === 0 ? (
            <ThemedView variant="card" style={styles.emptyStateCard}>
              <ThemedText variant="body" style={styles.emptyStateText}>
                No followed-show episodes yet in this local preview.
              </ThemedText>
            </ThemedView>
          ) : (
            visibleFeedEpisodes.map((item) => (
              <ThemedView key={item.id} variant="card" style={styles.card}>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/episodes/[episodeId]",
                      params: buildEpisodeDetailRouteParams({
                        description: item.episodeDescription,
                        episodeId: item.id,
                        episodeNumber: item.episodeNumber,
                        hookType: item.hookType,
                        seasonNumber: item.seasonNumber,
                        showCategory: item.showCategory,
                        showDescription: item.showDescription,
                        showId: item.showId,
                        showTitle: item.showTitle,
                        showVisibility: item.showVisibility,
                        title: item.episodeTitle,
                        videoUrl: item.videoUrl,
                      }),
                    });
                  }}
                  style={styles.episodePressArea}
                >
                  <ThemedText variant="caption" style={styles.seriesLabel}>
                    Episode from
                  </ThemedText>

                  <View style={styles.showRow}>
                    <ThemedText variant="subtitle" style={styles.showTitle}>
                      {item.showTitle}
                    </ThemedText>
                    <ShowVisibilityBadge visibility={item.showVisibility} />
                  </View>

                  <View style={styles.cardHeader}>
                    <ThemedText variant="caption" style={styles.episodeNumber}>
                      Latest episode · {getEpisodeDisplayNumber(item)}
                    </ThemedText>
                    <ThemedText variant="subtitle" style={styles.cardTitle}>
                      {item.episodeTitle}
                    </ThemedText>
                  </View>

                  <ThemedText variant="body" style={styles.description}>
                    {item.episodeDescription}
                  </ThemedText>

                  <View style={styles.metaRow}>
                    <ThemedText variant="caption">
                      {getEpisodeHookLabel(item.hookType)}
                    </ThemedText>
                    <ThemedText variant="caption">
                      {getEpisodeVideoStatusLabel(item.videoUrl)}
                    </ThemedText>
                  </View>

                  <View style={styles.metaRow}>
                    <ThemedText variant="caption" style={styles.category}>
                      {item.showCategory}
                    </ThemedText>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/shows/[showId]",
                      params: {
                        category: item.showCategory,
                        description: item.showDescription,
                        showId: item.showId,
                        title: item.showTitle,
                        visibility: item.showVisibility,
                      },
                    });
                  }}
                  style={styles.showActionButton}
                >
                  <ThemedText variant="body" style={styles.showActionText}>
                    View Show
                  </ThemedText>
                </Pressable>
              </ThemedView>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  cardHeader: {
    gap: theme.spacing.xs,
  },
  cardTitle: {
    color: theme.colors.text.primary,
  },
  category: {
    color: theme.colors.brand.secondary,
    textTransform: "capitalize",
  },
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
  },
  continueWatchingHelperText: {
    color: theme.colors.text.muted,
  },
  continueWatchingProgress: {
    color: theme.colors.text.secondary,
  },
  continueWatchingSection: {
    gap: theme.spacing.md,
  },
  description: {
    color: theme.colors.text.secondary,
  },
  emptyStateCard: {
    alignItems: "center",
  },
  emptyStateText: {
    color: theme.colors.text.muted,
  },
  episodePressArea: {
    gap: theme.spacing.md,
  },
  filterButton: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  filterButtonInactive: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
  },
  filterButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  filterHelperText: {
    color: theme.colors.text.muted,
  },
  filterRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  header: {
    gap: theme.spacing.sm,
  },
  headerCopy: {
    color: theme.colors.text.secondary,
  },
  list: {
    gap: theme.spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "space-between",
  },
  episodeNumber: {
    color: theme.colors.brand.secondary,
  },
  seriesLabel: {
    color: theme.colors.text.muted,
  },
  showRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  showActionButton: {
    alignItems: "center",
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  showActionText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  showTitle: {
    color: theme.colors.text.primary,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
});
