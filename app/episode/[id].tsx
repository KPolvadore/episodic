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
    type EpisodeWithShow,
} from "@/src/api/feed.api";

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [episodeItem, setEpisodeItem] = useState<EpisodeWithShow | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<EpisodeWithShow | null>(null);
  const [nextEpisode, setNextEpisode] = useState<EpisodeWithShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const data = await getFeed("new");
        const found = data.find((item) => item.episode.id === id);
        if (found) {
          setEpisodeItem(found);
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
          {episodeItem.episode.seasonNumber &&
            episodeItem.episode.episodeNumber && (
              <ThemedText style={styles.badge}>
                S{episodeItem.episode.seasonNumber} • E
                {episodeItem.episode.episodeNumber}
              </ThemedText>
            )}
          <ThemedText>Episode ID: {id}</ThemedText>
          <ThemedView style={styles.videoPlaceholder}>
            <ThemedText>Video Placeholder</ThemedText>
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
});
