import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  getEpisodeDisplayNumber,
  getEpisodeHookLabel,
  getEpisodeVideoStatusLabel,
} from "@/models/episode";
import {
  getInitialShowFollowState,
  getShowFollowerCountLabel,
} from "@/models/showFollow";
import { showVisibilityOptions } from "@/models/show";
import type { Episode } from "@/types/episode";
import type {
  CreatorSupportTier,
  MonetizationFeature,
  MonetizationStatus,
  ShowPremiumAccess,
} from "@/types/monetization";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type ShowDetailParams = {
  category?: ShowCategory;
  description?: string;
  showId?: string;
  title?: string;
  visibility?: ShowVisibility;
};

type EpisodeDisplayItem = Pick<
  Episode,
  | "id"
  | "showId"
  | "seasonNumber"
  | "episodeNumber"
  | "title"
  | "description"
  | "recapText"
  | "hookType"
  | "videoUrl"
>;

const getTemporaryEpisodes = (showId: string): EpisodeDisplayItem[] => [
  {
    description:
      "A temporary Episode preview showing how ordered story entries will appear inside this Show.",
    episodeNumber: 1,
    hookType: "cliffhanger",
    id: `${showId}-episode-1`,
    recapText:
      "Previously, the host found a lost recording that hinted the first guest has been here before.",
    seasonNumber: 1,
    showId,
    title: "Pilot",
    videoUrl: null,
  },
  {
    description:
      "Another local placeholder for future Episode ordering and video status display.",
    episodeNumber: 2,
    hookType: "question",
    id: `${showId}-episode-2`,
    recapText: null,
    seasonNumber: 1,
    showId,
    title: "What Happens Next",
    videoUrl: null,
  },
];

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getShowVisibilityParam(value: string | string[] | undefined) {
  const visibility = getParamValue(value);

  return showVisibilityOptions.find((option) => option === visibility);
}

export default function ShowDetailScreen() {
  const params = useLocalSearchParams<ShowDetailParams>();

  const title = getParamValue(params.title) ?? "Untitled Show";
  const description =
    getParamValue(params.description) ?? "Show details are coming soon.";
  const category = getParamValue(params.category) ?? "other";
  const showId = getParamValue(params.showId) ?? "unknown-show";
  const visibility = getShowVisibilityParam(params.visibility) ?? "private";
  const episodes = getTemporaryEpisodes(showId);
  const initialFollowState = useMemo(
    () =>
      getInitialShowFollowState({
        currentUserId: null,
        follows: [],
        showId,
      }),
    [showId],
  );
  const [isFollowed, setIsFollowed] = useState(initialFollowState.isFollowed);
  const [followerCount, setFollowerCount] = useState(12);
  const followerCountLabel = getShowFollowerCountLabel(followerCount);
  const monetizationStatus: MonetizationStatus = "draft";
  const enabledMonetizationFeatures: MonetizationFeature[] = [
    "creator_support",
    "season_pass",
    "premium_episode",
  ];
  const localCreatorSupportTier: CreatorSupportTier = {
    id: `${showId}-support-tier-1`,
    showId,
    title: "Support this Show — coming later",
    description:
      "Creator support is a placeholder right now. No payment will be collected.",
    amountCents: 499,
    currency: "USD",
    option: "one_time_tip",
    isActive: true,
  };
  const localPremiumAccess: ShowPremiumAccess = {
    id: `${showId}-season-pass`,
    showId,
    episodeId: null,
    accessType: "season_pass",
    title: "Premium access placeholder",
    description:
      "Season pass and premium access will be connected later. This is UI-only.",
    amountCents: 999,
    currency: "USD",
    isActive: false,
  };

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cover}>
          <ThemedText variant="caption" style={styles.coverLabel}>
            Cover coming soon
          </ThemedText>
        </View>

        <View style={styles.header}>
          <ThemedText variant="title">{title}</ThemedText>
          <ThemedText variant="body" style={styles.description}>
            {description}
          </ThemedText>
          <ThemedView variant="card" style={styles.followCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setIsFollowed((currentValue) => {
                  const nextValue = !currentValue;
                  setFollowerCount((currentCount) => {
                    if (nextValue) {
                      return currentCount + 1;
                    }

                    return Math.max(0, currentCount - 1);
                  });

                  return nextValue;
                });
              }}
              style={[
                styles.followButton,
                isFollowed ? styles.followingButton : styles.followButtonDefault,
              ]}
            >
              <ThemedText variant="body" style={styles.followButtonText}>
                {isFollowed ? "Following (Tap to Unfollow)" : "Follow Show"}
              </ThemedText>
            </Pressable>
            <ThemedText variant="caption" style={styles.followerCountText}>
              {followerCountLabel}
            </ThemedText>
            <ThemedText variant="caption" style={styles.followHelperText}>
              Follow state and follower count are local to this screen until
              account support is connected.
            </ThemedText>
          </ThemedView>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]/edit",
                params: {
                  category,
                  description,
                  showId,
                  title,
                  visibility,
                },
              });
            }}
            style={styles.editButton}
          >
            <ThemedText variant="body" style={styles.editButtonText}>
              Edit Show
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]/writers-room",
                params: {
                  category,
                  description,
                  showId,
                  title,
                  visibility,
                },
              });
            }}
            style={styles.writersRoomButton}
          >
            <ThemedText variant="body" style={styles.writersRoomButtonText}>
              Open Writers Room
            </ThemedText>
          </Pressable>
        </View>

        <ThemedView variant="card" style={styles.metaCard}>
          <View style={styles.metaRow}>
            <ThemedText variant="caption">Category</ThemedText>
            <ThemedText variant="body" style={styles.metaValue}>
              {category}
            </ThemedText>
          </View>
          <View style={styles.metaRow}>
            <ThemedText variant="caption">Visibility</ThemedText>
            <ShowVisibilityBadge visibility={visibility} />
            {visibility === "private" ? (
              <ThemedText variant="caption" style={styles.description}>
                Private Shows are only visible to you once account support is
                connected.
              </ThemedText>
            ) : null}
          </View>
        </ThemedView>

        <ThemedView variant="card" style={styles.monetizationCard}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Show Monetization</ThemedText>
            <ThemedText variant="caption" style={styles.temporaryLabel}>
              Placeholder only
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={styles.mutedText}>
            Status: {monetizationStatus}
          </ThemedText>
          <ThemedText variant="caption" style={styles.mutedText}>
            Planned features: {enabledMonetizationFeatures.join(", ")}
          </ThemedText>
          <View style={styles.monetizationBlock}>
            <ThemedText variant="body" style={styles.monetizationTitle}>
              {localCreatorSupportTier.title}
            </ThemedText>
            <ThemedText variant="caption" style={styles.mutedText}>
              {localCreatorSupportTier.description}
            </ThemedText>
            <ThemedText variant="caption" style={styles.mutedText}>
              Suggested support amount: {localCreatorSupportTier.currency}{" "}
              {(localCreatorSupportTier.amountCents / 100).toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.monetizationBlock}>
            <ThemedText variant="body" style={styles.monetizationTitle}>
              {localPremiumAccess.title}
            </ThemedText>
            <ThemedText variant="caption" style={styles.mutedText}>
              {localPremiumAccess.description}
            </ThemedText>
            <ThemedText variant="caption" style={styles.mutedText}>
              Access type: {localPremiumAccess.accessType.replace("_", " ")} ·{" "}
              {localPremiumAccess.isActive ? "Unlocked" : "Locked placeholder"}
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={styles.mutedText}>
            No payments, subscriptions, or entitlements are active in this
            screen.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.episodeCard}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Episodes</ThemedText>
            <ThemedText variant="caption" style={styles.temporaryLabel}>
              UI-only preview
            </ThemedText>
          </View>

          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]/episodes/create",
                params: {
                  category,
                  description,
                  showId,
                  title,
                  visibility,
                },
              });
            }}
            style={styles.createEpisodeButton}
          >
            <ThemedText variant="body" style={styles.createEpisodeButtonText}>
              Create Episode
            </ThemedText>
          </Pressable>

          <View style={styles.episodeList}>
            {episodes.map((episode) => (
              <Pressable
                key={episode.id}
                onPress={() => {
                  router.push({
                    pathname: "/episodes/[episodeId]",
                    params: {
                      description: episode.description,
                      episodeId: episode.id,
                      episodeNumber: String(episode.episodeNumber),
                      hookType: episode.hookType,
                      recapText: episode.recapText ?? undefined,
                      seasonNumber: String(episode.seasonNumber),
                      showCategory: category,
                      showDescription: description,
                      showId,
                      showTitle: title,
                      showVisibility: visibility,
                      title: episode.title,
                      videoUrl: episode.videoUrl ?? "",
                    },
                  });
                }}
                style={styles.episodeItem}
              >
                <View style={styles.episodeItemHeader}>
                  <ThemedText variant="caption" style={styles.episodeNumber}>
                    {getEpisodeDisplayNumber(episode)}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.hookLabel}>
                    {getEpisodeHookLabel(episode.hookType)}
                  </ThemedText>
                </View>

                <ThemedText variant="body" style={styles.episodeTitle}>
                  {episode.title}
                </ThemedText>
                <ThemedText variant="body" style={styles.description}>
                  {episode.description}
                </ThemedText>

                <View style={styles.videoStatus}>
                  <ThemedText variant="caption" style={styles.videoStatusText}>
                    {getEpisodeVideoStatusLabel(episode.videoUrl)}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
  },
  cover: {
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    height: 180,
    justifyContent: "center",
  },
  coverLabel: {
    color: theme.colors.text.muted,
  },
  createEpisodeButton: {
    alignItems: "center",
    borderColor: theme.colors.brand.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  createEpisodeButtonText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  description: {
    color: theme.colors.text.secondary,
  },
  followButton: {
    alignItems: "center",
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  followButtonDefault: {
    backgroundColor: theme.colors.brand.secondary,
  },
  followButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  followCard: {
    gap: theme.spacing.sm,
  },
  followerCountText: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  followHelperText: {
    color: theme.colors.text.muted,
  },
  followingButton: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.strong,
    borderWidth: 1,
  },
  editButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  editButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  episodeCard: {
    gap: theme.spacing.md,
  },
  episodeItem: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  episodeItemHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
  },
  episodeList: {
    gap: theme.spacing.md,
  },
  episodeNumber: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  episodeTitle: {
    fontWeight: theme.typography.weight.bold,
  },
  header: {
    gap: theme.spacing.md,
  },
  hookLabel: {
    color: theme.colors.text.secondary,
  },
  metaCard: {
    gap: theme.spacing.md,
  },
  metaRow: {
    gap: theme.spacing.xs,
  },
  monetizationBlock: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  monetizationCard: {
    gap: theme.spacing.md,
  },
  monetizationTitle: {
    fontWeight: theme.typography.weight.bold,
  },
  mutedText: {
    color: theme.colors.text.muted,
  },
  metaValue: {
    color: theme.colors.brand.secondary,
    textTransform: "capitalize",
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
  },
  temporaryLabel: {
    color: theme.colors.text.muted,
  },
  videoStatus: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  videoStatusText: {
    color: theme.colors.text.secondary,
  },
  writersRoomButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.brand.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  writersRoomButtonText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
});
