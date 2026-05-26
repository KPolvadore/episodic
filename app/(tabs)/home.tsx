import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ShowVisibilityBadge } from "@/components/ShowVisibilityBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type PlaceholderShow = {
  id: string;
  title: string;
  description: string;
  category: ShowCategory;
  visibility: ShowVisibility;
};

const placeholderShows: PlaceholderShow[] = [
  {
    category: "documentary",
    description: "A serialized look at neighborhood cooks building a weekend pop-up.",
    id: "local-show-1",
    title: "Kitchen After Hours",
    visibility: "public",
  },
  {
    category: "music",
    description: "A rehearsal diary following a band as they write their first EP.",
    id: "local-show-2",
    title: "Basement Sessions",
    visibility: "public",
  },
  {
    category: "drama",
    description: "A private concept show tracking scenes for a short-form mystery.",
    id: "local-show-3",
    title: "The Last Clue",
    visibility: "private",
  },
];

export default function HomeScreen() {
  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title">Shows</ThemedText>
          <ThemedText variant="body" style={styles.headerCopy}>
            Follow serialized stories and come back for what happens next.
          </ThemedText>
        </View>

        <View style={styles.list}>
          {placeholderShows.map((show) => (
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
            >
              <ThemedView variant="card" style={styles.card}>
                <View style={styles.cardHeader}>
                  <ThemedText variant="subtitle" style={styles.cardTitle}>
                    {show.title}
                  </ThemedText>
                  <ShowVisibilityBadge visibility={show.visibility} />
                </View>

                <ThemedText variant="body" style={styles.description}>
                  {show.description}
                </ThemedText>

                <View style={styles.metaRow}>
                  <ThemedText variant="caption" style={styles.category}>
                    {show.category}
                  </ThemedText>
                  <ThemedText variant="caption">Episodes coming soon</ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          ))}
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
    alignItems: "flex-start",
    gap: theme.spacing.sm,
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
    gap: theme.spacing.xs,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
});
