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
  type EpisodeWithShow,
  type FeedItem,
  type FeedType,
} from "@/src/api/feed.api";
import { useCreatorStore } from "@/src/state/creator-store";
import { useFeedStore } from "@/src/state/feed-store";
import { useFollowStore } from "@/src/state/follow-store";
import { useVisibilityStore } from "@/src/state/visibility-store";

type FeedShowItem = {
  type: "show";
  show: EpisodeWithShow["show"];
  episode?: EpisodeWithShow["episode"];
};

type FeedViewItem = FeedShowItem | Extract<FeedItem, { type: "special" }>;

export default function HomeScreen() {
  const [feed, setFeed] = useState<FeedViewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedType, setSelectedFeedType] = useState<FeedType>("new");
  const [preferNewShowsOnly, setPreferNewShowsOnly] = useState(false);
  const [preferLocal, setPreferLocal] = useState(false);
  const { shows: creatorShows } = useCreatorStore();
  const { feedMode, hydrated, setFeedMode } = useFeedStore();
  const { isShowFollowed, getFollowedShowIds } = useFollowStore();
  const { isShowHidden, isEpisodeHidden } = useVisibilityStore();

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
      const episodeMap = new Map<string, EpisodeWithShow>();
      const specialsMap = new Map<string, Extract<FeedItem, { type: "special" }>>();
      allItems.forEach((item) => {
        if (item.type === "episode") {
          if (!episodeMap.has(item.episode.id)) {
            episodeMap.set(item.episode.id, item);
          }
        } else {
          const key = item.specialId || item.title;
          if (!specialsMap.has(key)) {
            specialsMap.set(key, item);
          }
        }
      });
      const dedupedEpisodes = Array.from(episodeMap.values());
      const dedupedSpecials = Array.from(specialsMap.values());

      // Filter for following mode if selected
      let filteredEpisodes = dedupedEpisodes.filter(
        (item) =>
          !isShowHidden(item.show.id) && !isEpisodeHidden(item.episode.id),
      );
      let filteredSpecials = dedupedSpecials.filter((item) => {
        if (!item.attachedShowIds || item.attachedShowIds.length === 0)
          return true;
        return item.attachedShowIds.some((showId) => !isShowHidden(showId));
      });
      if (feedMode === "following") {
        const followedShowIds = getFollowedShowIds();
        filteredEpisodes = filteredEpisodes.filter((item) =>
          followedShowIds.includes(item.show.id),
        );
        filteredSpecials = filteredSpecials.filter(
          (item) =>
            item.attachedShowIds?.some((showId) =>
              followedShowIds.includes(showId),
            ) ?? false,
        );
      }

      // Build show-centric cards (one per show)
      const showCardsMap = new Map<string, FeedShowItem>();
      const isContinueFeed = effectiveFeedType === "continue";
      filteredEpisodes.forEach((item) => {
        const existing = showCardsMap.get(item.show.id);
        if (!existing) {
          showCardsMap.set(item.show.id, {
            type: "show",
            show: item.show,
            episode: item.episode,
          });
          return;
        }
        if (isContinueFeed) {
          return;
        }
        const currentSeason = existing.episode?.seasonNumber ?? 1;
        const currentEpisode = existing.episode?.episodeNumber ?? 0;
        const nextSeason = item.episode.seasonNumber ?? 1;
        const nextEpisode = item.episode.episodeNumber ?? 0;
        const isLater =
          nextSeason > currentSeason ||
          (nextSeason === currentSeason && nextEpisode > currentEpisode);
        if (isLater) {
          showCardsMap.set(item.show.id, {
            type: "show",
            show: item.show,
            episode: item.episode,
          });
        }
      });

      const showCards = Array.from(showCardsMap.values());
      const finalFeed: FeedViewItem[] = [...showCards, ...filteredSpecials];

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
    isEpisodeHidden,
    isShowHidden,
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
          if (item.type === "show") {
            return (
              <Pressable
                key={item.show.id}
                style={styles.episodeContainer}
                onPress={() => {
                  const params: any = { id: item.show.id };
                  if (selectedFeedType === "continue" && item.episode?.id) {
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
                  <ThemedView style={styles.badgeRow}>
                    {item.episode && (
                      <ThemedView style={styles.newEpisodeBadge}>
                        <ThemedText style={styles.newEpisodeText}>
                          New Episode
                        </ThemedText>
                      </ThemedView>
                    )}
                    {isShowFollowed(item.show.id) && (
                      <ThemedView style={styles.followingBadge}>
                        <ThemedText style={styles.followingText}>
                          Following
                        </ThemedText>
                      </ThemedView>
                    )}
                  </ThemedView>
                </ThemedView>
                {item.episode ? (
                  <ThemedText>Latest: {item.episode.title}</ThemedText>
                ) : (
                  <ThemedText>Open show</ThemedText>
                )}
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
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newEpisodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(255,165,0,0.2)",
    borderRadius: 12,
  },
  newEpisodeText: {
    fontSize: 12,
    color: "#cc7a00",
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
