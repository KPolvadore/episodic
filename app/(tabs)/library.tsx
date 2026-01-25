import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getMixedFeed, type FeedItem } from "@/src/api/feed.api";
import { useLibraryStore } from "@/src/state/library-store";

export default function LibraryScreen() {
  const { savedShowIds, savedTopicIds, hydrate } = useLibraryStore();
  const [continueItems, setContinueItems] = useState<FeedItem[]>([]);
  const [showMap, setShowMap] = useState<Map<string, string>>(new Map());
  const [topicMap, setTopicMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await hydrate();
      setLoading(true);
      try {
        // Load continue watching
        const continueData = await getMixedFeed("continue");
        setContinueItems(continueData);

        // Load all feeds for show/topic maps
        const [newFeed, continueFeed, localFeed, newShowsOnlyFeed] =
          await Promise.all([
            getMixedFeed("new"),
            getMixedFeed("continue"),
            getMixedFeed("local"),
            getMixedFeed("newShowsOnly"),
          ]);
        const allItems = [
          ...newFeed,
          ...continueFeed,
          ...localFeed,
          ...newShowsOnlyFeed,
        ];

        const shows = new Map<string, string>();
        const topics = new Map<string, string>();
        allItems.forEach((item) => {
          if (item.type === "episode" && item.show) {
            shows.set(item.show.id, item.show.title);
          }
          if (item.type === "special" && item.attachedTopicIds) {
            item.attachedTopicIds.forEach((topicId) => {
              // For topics, we might not have title, so use id as fallback
              topics.set(topicId, item.title || `Topic ${topicId}`);
            });
          }
        });
        setShowMap(shows);
        setTopicMap(topics);
      } catch (error) {
        console.error("Failed to load library data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [hydrate]);

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">Library</ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Continue Watching</ThemedText>
        {continueItems.length === 0 ? (
          <ThemedText>No continue watching items</ThemedText>
        ) : (
          continueItems.map((item) => {
            if (item.type !== "episode") return null;
            return (
              <Pressable
                key={item.episode.id}
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: "/show/[id]",
                    params: {
                      id: item.show.id,
                      episodeId: item.episode.id,
                      fromContinue: "1",
                    },
                  })
                }
              >
                <ThemedText type="subtitle">{item.show.title}</ThemedText>
                <ThemedText>
                  S{item.episode.seasonNumber ?? 1}E{item.episode.episodeNumber}{" "}
                  - {item.episode.title}
                </ThemedText>
              </Pressable>
            );
          })
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Saved Shows</ThemedText>
        {savedShowIds.length === 0 ? (
          <ThemedText>Nothing saved yet</ThemedText>
        ) : (
          savedShowIds.map((showId) => (
            <Pressable
              key={showId}
              style={styles.item}
              onPress={() =>
                router.push({
                  pathname: "/show/[id]",
                  params: { id: showId },
                })
              }
            >
              <ThemedText>{showMap.get(showId) || `Show ${showId}`}</ThemedText>
            </Pressable>
          ))
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Saved Topics</ThemedText>
        {savedTopicIds.length === 0 ? (
          <ThemedText>Nothing saved yet</ThemedText>
        ) : (
          savedTopicIds.map((topicId) => (
            <Pressable
              key={topicId}
              style={styles.item}
              onPress={() =>
                router.push({
                  pathname: "/topic/[id]",
                  params: { id: topicId },
                })
              }
            >
              <ThemedText>
                {topicMap.get(topicId) || `Topic ${topicId}`}
              </ThemedText>
            </Pressable>
          ))
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  item: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
});
