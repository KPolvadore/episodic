import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
    getMixedFeed,
    getShowEpisodes,
    type FeedItem,
    type FeedType,
} from "@/src/api/feed.api";
import { useCreatorStore } from "@/src/state/creator-store";
import { useFeedStore } from "@/src/state/feed-store";
import { useFollowStore } from "@/src/state/follow-store";

export default function HomeScreen() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedType, setSelectedFeedType] = useState<FeedType>("new");
  const [preferNewShowsOnly, setPreferNewShowsOnly] = useState(false);
  const [preferLocal, setPreferLocal] = useState(false);
  const { shows: creatorShows } = useCreatorStore();
  const { feedMode, hydrated, setFeedMode } = useFeedStore();
  const { isShowFollowed, getFollowedShowIds } = useFollowStore();

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const effectiveFeedType: FeedType = preferLocal
        ? "local"
        : preferNewShowsOnly
          ? "newShowsOnly"
          : selectedFeedType;
      const data = await getMixedFeed(effectiveFeedType);

      // Add eligible creator episodes
      const eligibleCreatorEpisodes: FeedItem[] = [];
      for (const show of creatorShows) {
        const episodes = await getShowEpisodes(show.id);
        if (episodes.length > 0) {
          eligibleCreatorEpisodes.push(...episodes);
        }
      }

      // Merge and deduplicate by episode id
      const allItems = [...data, ...eligibleCreatorEpisodes];
      const episodeMap = new Map<string, FeedItem>();
      allItems.forEach((item) => {
        if (item.type === "episode") {
          if (!episodeMap.has(item.episode.id)) {
            episodeMap.set(item.episode.id, item);
          }
        } else {
          // For specials, use specialId
          const key = item.specialId || item.title;
          if (!episodeMap.has(key)) {
            episodeMap.set(key, item);
          }
        }
      });
      const dedupedFeed = Array.from(episodeMap.values());

      // Filter for following mode if selected
      let finalFeed = dedupedFeed;
      if (feedMode === "following") {
        const followedShowIds = getFollowedShowIds();
        finalFeed = dedupedFeed.filter((item) => {
          if (item.type === "episode") {
            return followedShowIds.includes(item.show.id);
          }
          // For specials, check if any attached shows are followed
          if (item.type === "special" && item.attachedShowIds) {
            return item.attachedShowIds.some((showId) =>
              followedShowIds.includes(showId),
            );
          }
          return false;
        });
      }

      setFeed(finalFeed);
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [
    selectedFeedType,
    preferNewShowsOnly,
    preferLocal,
    creatorShows,
    feedMode,
    getFollowedShowIds,
  ]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [loadFeed]),
  );

  // Reload when creator shows change
  useEffect(() => {
    loadFeed();
  }, [creatorShows, loadFeed]);

  const feedTypes: FeedType[] = ["new", "continue", "newShowsOnly", "local"];

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

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
      <ThemedView style={styles.feedModeContainer}>
        <Pressable
          style={[
            styles.feedModeButton,
            feedMode === "discovery" && styles.feedModeButtonSelected,
          ]}
          onPress={() => setFeedMode("discovery")}
        >
          <ThemedText
            style={
              feedMode === "discovery"
                ? styles.feedModeTextSelected
                : styles.feedModeText
            }
          >
            Discovery
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.feedModeButton,
            feedMode === "following" && styles.feedModeButtonSelected,
          ]}
          onPress={() => setFeedMode("following")}
        >
          <ThemedText
            style={
              feedMode === "following"
                ? styles.feedModeTextSelected
                : styles.feedModeText
            }
          >
            Following
          </ThemedText>
        </Pressable>
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
      {!loading && !error && feedMode === "following" && feed.length === 0 && (
        <ThemedView style={styles.emptyStateContainer}>
          <ThemedText type="subtitle">No followed shows yet</ThemedText>
          <ThemedText>Follow shows to see episodes here.</ThemedText>
        </ThemedView>
      )}
      {!loading &&
        !error &&
        (feedMode === "discovery" || feed.length > 0) &&
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
                <ThemedView style={styles.showTitleRow}>
                  <ThemedText type="subtitle">{item.show.title}</ThemedText>
                  {isShowFollowed(item.show.id) && (
                    <ThemedView style={styles.followingBadge}>
                      <ThemedText style={styles.followingText}>
                        Following
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
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
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  feedModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  feedModeButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  feedModeText: {
    fontSize: 16,
  },
  feedModeTextSelected: {
    fontSize: 16,
    fontWeight: "bold",
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
  showTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  followingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(0,0,255,0.2)",
    borderRadius: 12,
  },
  followingText: {
    fontSize: 12,
    color: "#0066cc",
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
  emptyStateContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
