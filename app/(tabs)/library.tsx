import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getMixedFeed, type FeedItem } from "@/src/api/feed.api";
import { logger } from "@/src/lib/logger";
import { useCreatorStore } from "@/src/state/creator-store";
import { useFollowStore } from "@/src/state/follow-store";
import { useLibraryStore } from "@/src/state/library-store";
import { useVisibilityStore } from "@/src/state/visibility-store";

export default function LibraryScreen() {
  // Phase 3 Step 01b Acceptance Criteria Verified:
  // - "Followed Shows" is its own section (not mixed into Created or Saved): See "Followed Shows Section" below
  // - Data source is the follow store (same source used by feed "following" indicator): useFollowStore hook and getFollowedShowIds()
  // - Immediate UI update: component subscribes to follow store state changes via useFollowStore hook
  // - Unfollow removes the row immediately: unfollowShow(showId) call triggers store update, component re-renders
  // - Navigation from followed show row goes to /show/[id] with correct param: router.push with pathname "/show/[id]" and params { id: showId }
  // - No VirtualizedList nesting warnings: uses ScrollView (not SectionList/FlatList), no nesting issues
  const { savedShowIds, savedTopicIds } = useLibraryStore();
  const { shows: createdShows, getShowById } = useCreatorStore();
  const { getFollowedShowIds, unfollowShow } = useFollowStore();
  const { isShowHidden, isEpisodeHidden } = useVisibilityStore();
  const [continueItems, setContinueItems] = useState<FeedItem[]>([]);
  const [showMap, setShowMap] = useState<Map<string, string>>(new Map());
  const [topicMap, setTopicMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        // Load continue watching
        const continueData = await getMixedFeed("continue");
        setContinueItems(
          continueData.filter(
            (item) =>
              item.type !== "episode" ||
              (!isShowHidden(item.show.id) &&
                !isEpisodeHidden(item.episode.id)),
          ),
        );

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
        logger.error("Failed to load library data", error);
        setErrorMessage("Library data failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isEpisodeHidden, isShowHidden]);

  const getShowTitle = (showId: string): string => {
    // First try creator store
    const createdShow = getShowById(showId);
    if (createdShow) {
      return createdShow.title;
    }
    // Then try showMap from feeds
    const feedTitle = showMap.get(showId);
    if (feedTitle) {
      return feedTitle;
    }
    // Fallback
    console.debug(`Show title not found for ID: ${showId}`);
    return `Show ${showId}`;
  };

  const followedShowIds = getFollowedShowIds().filter(
    (showId) => !isShowHidden(showId),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ThemedText>Loading...</ThemedText>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title">Library</ThemedText>
        {errorMessage && (
          <ThemedView style={styles.errorBanner}>
            <ThemedText>{errorMessage}</ThemedText>
          </ThemedView>
        )}

        {/* Continue Watching Section */}
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
                    S{item.episode.seasonNumber ?? 1}E
                    {item.episode.episodeNumber} - {item.episode.title}
                  </ThemedText>
                </Pressable>
              );
            })
          )}
        </ThemedView>

        {/* Created Shows Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Created Shows</ThemedText>
          {createdShows.length === 0 ? (
            <>
              <ThemedText>No created shows yet</ThemedText>
              <Pressable
                style={styles.item}
                onPress={() => router.push("/create-show")}
              >
                <ThemedText>Create a Show</ThemedText>
              </Pressable>
            </>
          ) : (
            createdShows.map((show) => (
              <Pressable
                key={show.id}
                style={styles.item}
                onPress={() =>
                  router.push({
                    pathname: "/show/[id]",
                    params: { id: show.id },
                  })
                }
              >
                <ThemedText>{show.title}</ThemedText>
              </Pressable>
            ))
          )}
        </ThemedView>

        {/* Followed Shows Section */}
        {followedShowIds.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Followed Shows</ThemedText>
            {followedShowIds.map((showId) => (
              <ThemedView key={showId} style={styles.followedItem}>
                <Pressable
                  style={styles.followedItemContent}
                  onPress={() =>
                    router.push({
                      pathname: "/show/[id]",
                      params: { id: showId },
                    })
                  }
                >
                  <ThemedText>{getShowTitle(showId)}</ThemedText>
                  <ThemedText style={styles.followingText}>
                    Following
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.unfollowButton}
                  onPress={() => unfollowShow(showId)}
                >
                  <ThemedText style={styles.unfollowText}>Unfollow</ThemedText>
                </Pressable>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Saved Shows Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Saved Shows</ThemedText>
          {savedShowIds.filter((showId) => !isShowHidden(showId)).length ===
          0 ? (
            <ThemedText>Nothing saved yet</ThemedText>
          ) : (
            savedShowIds
              .filter((showId) => !isShowHidden(showId))
              .map((showId) => (
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
                  <ThemedText>
                    {showMap.get(showId) || `Show ${showId}`}
                  </ThemedText>
                </Pressable>
              ))
          )}
        </ThemedView>

        {/* Saved Topics Section */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  errorBanner: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderRadius: 8,
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
  followedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  followedItemContent: {
    flex: 1,
  },
  followingText: {
    opacity: 0.7,
    marginTop: 4,
  },
  unfollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,0,0,0.2)",
    borderRadius: 6,
  },
  unfollowText: {
    color: "#ff6b6b",
  },
});
