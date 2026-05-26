import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import { getShowFollowerCountLabel } from "@/models/showFollow";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type FollowedShowDisplayItem = {
  category: ShowCategory;
  description: string;
  followerCount: number;
  id: string;
  title: string;
  visibility: ShowVisibility;
};

const temporaryFollowedShows: FollowedShowDisplayItem[] = [
  {
    category: "drama",
    description:
      "A serialized mystery where each episode reveals one missing piece.",
    followerCount: 128,
    id: "temp-followed-show-1",
    title: "Midnight Archives",
    visibility: "public",
  },
  {
    category: "education",
    description:
      "Short episodes that teach one practical storytelling skill at a time.",
    followerCount: 42,
    id: "temp-followed-show-2",
    title: "Story Lab",
    visibility: "public",
  },
  {
    category: "lifestyle",
    description:
      "Weekly behind-the-scenes production notes and creator experiments.",
    followerCount: 19,
    id: "temp-followed-show-3",
    title: "Creator Field Notes",
    visibility: "private",
  },
];

export default function ProfileScreen() {
  const hasFollowedShows = temporaryFollowedShows.length > 0;

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title">Profile</ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            Followed Shows are local to this screen until account support is
            connected.
          </ThemedText>
        </View>

        <ThemedView variant="card" style={styles.followedSection}>
          <View style={styles.followedSectionHeader}>
            <ThemedText variant="subtitle">Followed Shows</ThemedText>
            <ThemedText variant="caption" style={styles.temporaryLabel}>
              UI-only preview
            </ThemedText>
          </View>

          {hasFollowedShows ? (
            <View style={styles.followedList}>
              {temporaryFollowedShows.map((show) => (
                <Pressable
                  key={show.id}
                  onPress={() => {
                    router.push({
                      pathname: "/shows/[showId]",
                      params: {
                        category: show.category,
                        description: show.description,
                        showId: show.id,
                        title: show.title,
                        visibility: show.visibility,
                      },
                    });
                  }}
                  style={styles.followedItem}
                >
                  <View style={styles.followedItemHeader}>
                    <ThemedText variant="caption" style={styles.followingLabel}>
                      Following
                    </ThemedText>
                    <ShowVisibilityBadge visibility={show.visibility} />
                  </View>
                  <ThemedText variant="body" style={styles.followedTitle}>
                    {show.title}
                  </ThemedText>
                  <ThemedText variant="body" style={styles.followedDescription}>
                    {show.description}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.followedMeta}>
                    {show.category}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.followedMeta}>
                    {getShowFollowerCountLabel(show.followerCount)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          ) : (
            <ThemedText variant="caption" style={styles.emptyState}>
              No followed Shows yet. Local preview data will appear here.
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing["3xl"],
  },
  emptyState: {
    color: theme.colors.text.muted,
  },
  followedDescription: {
    color: theme.colors.text.secondary,
  },
  followedItem: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  followedItemHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  followedList: {
    gap: theme.spacing.md,
  },
  followedMeta: {
    color: theme.colors.brand.secondary,
    textTransform: "capitalize",
  },
  followedSection: {
    gap: theme.spacing.md,
  },
  followedSectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  followedTitle: {
    fontWeight: theme.typography.weight.bold,
  },
  followingLabel: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  header: {
    gap: theme.spacing.xs,
  },
  helperText: {
    color: theme.colors.text.muted,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  temporaryLabel: {
    color: theme.colors.text.muted,
  },
});
