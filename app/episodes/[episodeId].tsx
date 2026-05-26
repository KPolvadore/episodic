import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  getEpisodeDisplayNumber,
  getEpisodeHookLabel,
  getEpisodeVideoStatusLabel,
  isValidEpisodeNumber,
} from "@/models/episode";
import type { Episode, EpisodeHookType } from "@/types/episode";

type EpisodeDetailParams = {
  description?: string;
  episodeId?: string;
  episodeNumber?: string;
  hookType?: EpisodeHookType;
  seasonNumber?: string;
  showCategory?: string;
  showDescription?: string;
  showId?: string;
  showTitle?: string;
  showVisibility?: string;
  title?: string;
  videoUrl?: string;
};

const fallbackEpisode: Pick<
  Episode,
  "seasonNumber" | "episodeNumber" | "hookType"
> = {
  episodeNumber: 1,
  hookType: "none",
  seasonNumber: 1,
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(value: string | string[] | undefined, fallback: number) {
  const numberValue = Number(getParamValue(value));

  return isValidEpisodeNumber(numberValue) ? numberValue : fallback;
}

function getHookTypeParam(value: string | string[] | undefined) {
  const hookType = getParamValue(value);

  switch (hookType) {
    case "question":
    case "poll":
    case "cliffhanger":
    case "challenge":
    case "reveal":
      return hookType;
    default:
      return fallbackEpisode.hookType;
  }
}

export default function EpisodeDetailScreen() {
  const params = useLocalSearchParams<EpisodeDetailParams>();

  const title = getParamValue(params.title) ?? "Untitled Episode";
  const description =
    getParamValue(params.description) ?? "Episode details are coming soon.";
  const showId = getParamValue(params.showId) ?? "unknown-show";
  const showCategory = getParamValue(params.showCategory) ?? "other";
  const showTitle = getParamValue(params.showTitle) ?? "Parent Show";
  const showDescription = getParamValue(params.showDescription) ?? "";
  const showVisibility = getParamValue(params.showVisibility) ?? "private";
  const videoUrl = getParamValue(params.videoUrl);
  const episodeNumber = getNumberParam(
    params.episodeNumber,
    fallbackEpisode.episodeNumber,
  );
  const seasonNumber = getNumberParam(
    params.seasonNumber,
    fallbackEpisode.seasonNumber,
  );
  const hookType = getHookTypeParam(params.hookType);
  const videoStatusLabel = getEpisodeVideoStatusLabel(videoUrl);

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.videoPlaceholder}>
          <ThemedText variant="subtitle">Video placeholder</ThemedText>
          <ThemedText variant="caption" style={styles.mutedText}>
            {videoStatusLabel}
          </ThemedText>
          <ThemedText variant="caption" style={styles.mutedText}>
            Real upload and playback will be connected later.
          </ThemedText>
        </View>

        <View style={styles.header}>
          <ThemedText variant="caption" style={styles.episodeNumber}>
            {getEpisodeDisplayNumber({ episodeNumber, seasonNumber })}
          </ThemedText>
          <ThemedText variant="title">{title}</ThemedText>
          <ThemedText variant="body" style={styles.description}>
            {description}
          </ThemedText>
        </View>

        <ThemedView variant="card" style={styles.detailCard}>
          <View style={styles.detailRow}>
            <ThemedText variant="caption">Hook</ThemedText>
            <ThemedText variant="body" style={styles.detailValue}>
              {getEpisodeHookLabel(hookType)}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText variant="caption">Video status</ThemedText>
            <ThemedText variant="body" style={styles.detailValue}>
              {videoStatusLabel}
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView variant="card" style={styles.showCard}>
          <ThemedText variant="caption" style={styles.mutedText}>
            Parent Show
          </ThemedText>
          <ThemedText variant="subtitle">{showTitle}</ThemedText>
          {showDescription ? (
            <ThemedText variant="body" style={styles.description}>
              {showDescription}
            </ThemedText>
          ) : null}
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]",
                params: {
                  category: showCategory,
                  description: showDescription,
                  showId,
                  title: showTitle,
                  visibility: showVisibility,
                },
              });
            }}
            style={styles.showButton}
          >
            <ThemedText variant="body" style={styles.showButtonText}>
              Back to Show
            </ThemedText>
          </Pressable>
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
  description: {
    color: theme.colors.text.secondary,
  },
  detailCard: {
    gap: theme.spacing.md,
  },
  detailRow: {
    gap: theme.spacing.xs,
  },
  detailValue: {
    color: theme.colors.brand.secondary,
  },
  episodeNumber: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  header: {
    gap: theme.spacing.md,
  },
  mutedText: {
    color: theme.colors.text.muted,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  showButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  showButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  showCard: {
    gap: theme.spacing.md,
  },
  videoPlaceholder: {
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    height: 220,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
});
