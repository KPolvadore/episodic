import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  getEpisodeDisplayNumber,
  getEpisodeHookLabel,
  getEpisodeVideoStatusLabel,
} from "@/models/episode";
import { isShowPublic } from "@/models/show";
import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import type { ShowCategory, ShowVisibility } from "@/types/show";

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

export default function HomeScreen() {
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("allPublic");
  const visibleFeedEpisodes = useMemo(() => {
    if (feedFilter === "followedShows") {
      return publicFeedEpisodes.filter((item) => item.isFollowedShow);
    }

    return publicFeedEpisodes;
  }, [feedFilter]);

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
                      params: {
                        description: item.episodeDescription,
                        episodeId: item.id,
                        episodeNumber: String(item.episodeNumber),
                        hookType: item.hookType,
                        seasonNumber: String(item.seasonNumber),
                        showCategory: item.showCategory,
                        showDescription: item.showDescription,
                        showId: item.showId,
                        showTitle: item.showTitle,
                        showVisibility: item.showVisibility,
                        title: item.episodeTitle,
                        videoUrl: item.videoUrl ?? undefined,
                      },
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
