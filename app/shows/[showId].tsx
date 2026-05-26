import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import { showVisibilityOptions } from "@/models/show";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type ShowDetailParams = {
  category?: ShowCategory;
  description?: string;
  showId?: string;
  title?: string;
  visibility?: ShowVisibility;
};

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
  const visibility = getShowVisibilityParam(params.visibility) ?? "private";

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
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]/edit",
                params: {
                  category,
                  description,
                  showId: getParamValue(params.showId) ?? "unknown-show",
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

        <ThemedView variant="card" style={styles.episodeCard}>
          <ThemedText variant="subtitle">Episodes</ThemedText>
          <ThemedText variant="body" style={styles.description}>
            Episodes coming soon.
          </ThemedText>
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
  description: {
    color: theme.colors.text.secondary,
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
    gap: theme.spacing.sm,
  },
  header: {
    gap: theme.spacing.md,
  },
  metaCard: {
    gap: theme.spacing.md,
  },
  metaRow: {
    gap: theme.spacing.xs,
  },
  metaValue: {
    color: theme.colors.brand.secondary,
    textTransform: "capitalize",
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
});
