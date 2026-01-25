import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getMixedFeed, type FeedItem, type FeedType } from "@/src/api/feed.api";
import { router } from "expo-router";

export default function HomeScreen() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedType, setSelectedFeedType] = useState<FeedType>("new");
  const [preferNewShowsOnly, setPreferNewShowsOnly] = useState(false);
  const [preferLocal, setPreferLocal] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      setError(null);
      try {
        const effectiveFeedType: FeedType = preferLocal
          ? "local"
          : preferNewShowsOnly
            ? "newShowsOnly"
            : selectedFeedType;
        const data = await getMixedFeed(effectiveFeedType);
        setFeed(data);
      } catch {
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, [selectedFeedType, preferNewShowsOnly, preferLocal]);

  const feedTypes: FeedType[] = ["new", "continue", "newShowsOnly", "local"];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Episodic Feed</ThemedText>
      </ThemedView>
      <ThemedView style={styles.preferenceContainer}>
        <ThemedText>New shows only</ThemedText>
        <Switch
          value={preferNewShowsOnly}
          onValueChange={setPreferNewShowsOnly}
        />
      </ThemedView>
      <ThemedView style={styles.preferenceContainer}>
        <ThemedText>Prefer local</ThemedText>
        <Switch value={preferLocal} onValueChange={setPreferLocal} />
      </ThemedView>
      <ThemedView style={styles.feedTypeContainer}>
        {feedTypes.map((type) => (
          <Pressable
            key={type}
            style={[
              styles.feedTypeButton,
              selectedFeedType === type && styles.feedTypeButtonSelected,
              (preferNewShowsOnly || preferLocal) &&
                styles.feedTypeButtonDisabled,
            ]}
            onPress={() => setSelectedFeedType(type)}
            disabled={preferNewShowsOnly || preferLocal}
          >
            <ThemedText
              style={
                selectedFeedType === type
                  ? styles.feedTypeTextSelected
                  : preferNewShowsOnly || preferLocal
                    ? styles.feedTypeTextDisabled
                    : styles.feedTypeText
              }
            >
              {type}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>
      {loading && <ThemedText>Loading...</ThemedText>}
      {error && <ThemedText>Error: {error}</ThemedText>}
      {!loading &&
        !error &&
        feed.map((item) => {
          if (item.type === "episode") {
            return (
              <Pressable
                key={item.episode.id}
                style={styles.episodeContainer}
                onPress={() => {
                  const params: any = { id: item.show.id };
                  if (selectedFeedType === "continue") {
                    params.episodeId = item.episode.id;
                    params.fromContinue = "1";
                  }
                  router.push({
                    pathname: "/show/[id]",
                    params,
                  });
                }}
              >
                <ThemedText type="subtitle">{item.show.title}</ThemedText>
                <ThemedText>{item.episode.title}</ThemedText>
              </Pressable>
            );
          } else if (item.type === "special") {
            return (
              <Pressable
                key={item.specialId}
                style={styles.specialContainer}
                onPress={() =>
                  router.push({
                    pathname: "/special/[id]",
                    params: { id: item.specialId },
                  })
                }
              >
                <ThemedText type="subtitle">Special</ThemedText>
                <ThemedText>{item.title}</ThemedText>
              </Pressable>
            );
          }
          return null;
        })}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preferenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  feedTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  feedTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  feedTypeButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  feedTypeButtonDisabled: {
    opacity: 0.5,
  },
  feedTypeText: {
    fontSize: 14,
  },
  feedTypeTextSelected: {
    fontSize: 14,
    fontWeight: "bold",
  },
  feedTypeTextDisabled: {
    fontSize: 14,
    color: "#666",
  },
  episodeContainer: {
    gap: 4,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  specialContainer: {
    gap: 4,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255,0,0,0.1)",
    borderRadius: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
