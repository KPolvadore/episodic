import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
    getFeed,
    getShowEpisodes,
    getTopicById,
    resolveShowById,
    type EpisodeWithShow,
} from "@/src/api/feed.api";
import { getCreatorStore } from "@/src/state/creator-store";

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [episodeItem, setEpisodeItem] = useState<EpisodeWithShow | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<EpisodeWithShow | null>(null);
  const [nextEpisode, setNextEpisode] = useState<EpisodeWithShow | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<
    "loading" | "ready" | "error" | "buffering"
  >("loading");

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        // Search all episodes from feeds and published
        const allEpisodes: EpisodeWithShow[] = [];
        for (const feedType of [
          "new",
          "continue",
          "library",
          "newShowsOnly",
          "local",
        ] as const) {
          const feed = await getFeed(feedType);
          allEpisodes.push(...feed);
        }
        // Add published episodes
        getCreatorStore().publishedEpisodes.forEach((episode) => {
          const show = getCreatorStore().publishedShows[episode.showId];
          if (show) {
            allEpisodes.push({ type: "episode", episode, show });
          }
        });
        // Add local published episodes
        Object.values(getCreatorStore().localPublishedEpisodesByShowId).forEach(
          (episodes) => {
            episodes.forEach((item) => {
              allEpisodes.push(item);
            });
          },
        );

        const found = allEpisodes.find((item) => item.episode.id === id);
        if (found) {
          // Resolve the show using canonical resolver
          const resolved = await resolveShowById(found.show.id);
          const resolvedShow = resolved ? resolved.show : found.show;

          const resolvedItem = { ...found, show: resolvedShow };
          setEpisodeItem(resolvedItem);

          // Load topics for the show
          const show = resolvedShow;
          if (show.topicIds && show.topicIds.length > 0) {
            const topicPromises = show.topicIds.map((topicId: string) =>
              getTopicById(topicId),
            );
            const loadedTopics = await Promise.all(topicPromises);
            setTopics(loadedTopics.filter((t: any) => t !== null));
          } else {
            setTopics([]);
          }

          // Compute prev and next episodes using canonical list
          const showEpisodes = await getShowEpisodes(found.show.id);
          const currentIndex = showEpisodes.findIndex(
            (item) => item.episode.id === id,
          );
          const prev = showEpisodes[currentIndex - 1] || null;
          const next = showEpisodes[currentIndex + 1] || null;
          setPrevEpisode(prev);
          setNextEpisode(next);
        } else {
          setError("Episode not found");
        }
      } catch {
        setError("Failed to load episode");
      } finally {
        setLoading(false);
      }
    };
    loadEpisode();
  }, [id]);

  useEffect(() => {
    if (episodeItem) {
      setPlayerState("loading");
      const timer = setTimeout(() => {
        const url = episodeItem.episode.videoUrl;
        if (!url || url.trim() === "" || url === "mock-url") {
          setPlayerState("error");
        } else {
          setPlayerState("ready");
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [episodeItem]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="play.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Episode Player</ThemedText>
      </ThemedView>
      {loading && <ThemedText>Loading...</ThemedText>}
      {error && <ThemedText>Error: {error}</ThemedText>}
      {episodeItem && (
        <>
          <ThemedText type="subtitle">{episodeItem.show.title}</ThemedText>
          <ThemedText>{episodeItem.episode.title}</ThemedText>
          {topics.length > 0 && (
            <ThemedView style={styles.topicsContainer}>
              <ThemedText type="subtitle">Topics</ThemedText>
              <ThemedView style={styles.topicsChips}>
                {topics.map((topic) => (
                  <Pressable
                    key={topic.id}
                    style={styles.topicChip}
                    onPress={() =>
                      router.push({
                        pathname: "/topic/[id]",
                        params: { id: topic.id },
                      })
                    }
                  >
                    <ThemedText style={styles.topicChipText}>
                      {topic.name}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </ThemedView>
          )}
          {episodeItem.episode.seasonNumber &&
            episodeItem.episode.episodeNumber && (
              <ThemedText style={styles.badge}>
                S{episodeItem.episode.seasonNumber} • E
                {episodeItem.episode.episodeNumber}
              </ThemedText>
            )}
          <ThemedText>Episode ID: {id}</ThemedText>
          <ThemedView style={styles.videoPlaceholder}>
            {playerState === "loading" && <ThemedText>Loading…</ThemedText>}
            {playerState === "buffering" && <ThemedText>Buffering…</ThemedText>}
            {playerState === "ready" && (
              <Pressable
                style={styles.videoArea}
                onPress={() => {
                  setPlayerState("buffering");
                  setTimeout(() => setPlayerState("ready"), 400);
                }}
              >
                <ThemedText>Tap to buffer</ThemedText>
              </Pressable>
            )}
            {playerState === "error" && (
              <ThemedView>
                <ThemedText>Video unavailable</ThemedText>
                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    setPlayerState("loading");
                    setTimeout(() => {
                      const url = episodeItem.episode.videoUrl;
                      if (!url || url.trim() === "" || url === "mock-url") {
                        setPlayerState("error");
                      } else {
                        setPlayerState("ready");
                      }
                    }, 700);
                  }}
                >
                  <ThemedText>Retry</ThemedText>
                </Pressable>
              </ThemedView>
            )}
          </ThemedView>
          <ThemedView style={styles.upNextContainer}>
            <ThemedText type="subtitle">Previously on...</ThemedText>
            {prevEpisode ? (
              <Pressable
                style={styles.nextEpisodeButton}
                onPress={() =>
                  router.push({
                    pathname: "/episode/[id]" as any,
                    params: { id: prevEpisode.episode.id },
                  })
                }
              >
                <ThemedText>
                  S{prevEpisode.episode.seasonNumber}E
                  {prevEpisode.episode.episodeNumber}:{" "}
                  {prevEpisode.episode.title}
                </ThemedText>
              </Pressable>
            ) : (
              <ThemedText>No previous episode yet</ThemedText>
            )}
          </ThemedView>
          <ThemedView style={styles.upNextContainer}>
            <ThemedText type="subtitle">Up Next</ThemedText>
            {nextEpisode ? (
              <Pressable
                style={styles.nextEpisodeButton}
                onPress={() =>
                  router.push({
                    pathname: "/episode/[id]" as any,
                    params: { id: nextEpisode.episode.id },
                  })
                }
              >
                <ThemedText>{nextEpisode.episode.title}</ThemedText>
              </Pressable>
            ) : (
              <ThemedText>No next episode yet</ThemedText>
            )}
          </ThemedView>
          <ThemedView style={styles.upNextContainer}>
            <ThemedText type="subtitle">Next episode drops in…</ThemedText>
            {nextEpisode ? (
              <>
                <ThemedText>Next drop: Soon</ThemedText>
                <ThemedText>
                  Next: Episode {nextEpisode.episode.episodeNumber} —{" "}
                  {nextEpisode.episode.title}
                </ThemedText>
              </>
            ) : (
              <ThemedText>No next drop scheduled yet</ThemedText>
            )}
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  videoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 4,
  },
  upNextContainer: {
    marginTop: 16,
    gap: 8,
  },
  nextEpisodeButton: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  badge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginTop: 4,
  },
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  topicsContainer: {
    marginTop: 16,
  },
  topicsChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(0,123,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,123,255,0.3)",
  },
  topicChipText: {
    fontSize: 14,
    color: "#007bff",
  },
});
