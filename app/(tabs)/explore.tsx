import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getMixedFeed, type FeedItem, type FeedType } from "@/src/api/feed.api";

export default function TabTwoScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<{
    shows: { id: string; title: string }[];
    topics: { id: string; title: string }[];
  }>({ shows: [], topics: [] });

  useEffect(() => {
    const loadIndex = async () => {
      setLoading(true);
      setError(null);
      try {
        const feedTypes: FeedType[] = [
          "new",
          "continue",
          "newShowsOnly",
          "local",
        ];
        const results = await Promise.all(
          feedTypes.map((t) => getMixedFeed(t)),
        );
        const data = results.flat();
        const showMap = new Map<string, { id: string; title: string }>();
        const topicMap = new Map<string, { id: string; title: string }>();
        data.forEach((item: FeedItem) => {
          if (item.type === "episode" && item.show) {
            if (!showMap.has(item.show.id)) {
              showMap.set(item.show.id, {
                id: item.show.id,
                title: item.show.title,
              });
            }
          }
          // Topics not implemented in types yet, skip
        });
        setIndex({
          shows: Array.from(showMap.values()),
          topics: Array.from(topicMap.values()),
        });
      } catch {
        setError("Failed to load search index");
      } finally {
        setLoading(false);
      }
    };
    loadIndex();
  }, []);

  const q = query.trim().toLowerCase();
  const showResults = q
    ? index.shows.filter((s) => s.title.toLowerCase().includes(q))
    : [];
  const topicResults = q
    ? index.topics.filter((t) => t.title.toLowerCase().includes(q))
    : [];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        {loading && <ThemedText>Loading...</ThemedText>}
        {error && <ThemedText>Error: {error}</ThemedText>}
        <TextInput
          style={styles.input}
          placeholder="Search shows or topics..."
          value={query}
          onChangeText={setQuery}
        />
        {q === "" ? (
          <ThemedText style={styles.hint}>Search shows or topics…</ThemedText>
        ) : (
          <>
            {showResults.length === 0 && topicResults.length === 0 ? (
              <ThemedText style={styles.hint}>No results</ThemedText>
            ) : (
              <>
                {showResults.length > 0 && (
                  <ThemedView style={styles.section}>
                    <ThemedText type="subtitle">Shows</ThemedText>
                    {showResults.map((show) => (
                      <Pressable
                        key={show.id}
                        style={styles.item}
                        onPress={() => router.push(`/show/${show.id}`)}
                      >
                        <ThemedText>{show.title}</ThemedText>
                      </Pressable>
                    ))}
                  </ThemedView>
                )}
                {topicResults.length > 0 && (
                  <ThemedView style={styles.section}>
                    <ThemedText type="subtitle">Topics</ThemedText>
                    {topicResults.map((topic) => (
                      <Pressable
                        key={topic.id}
                        style={styles.item}
                        onPress={() => router.push(`/topic/${topic.id}`)}
                      >
                        <ThemedText>{topic.title}</ThemedText>
                      </Pressable>
                    ))}
                  </ThemedView>
                )}
              </>
            )}
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  hint: {
    textAlign: "center",
    marginTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  item: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    marginBottom: 8,
  },
});
