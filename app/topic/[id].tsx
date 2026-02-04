import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  type EpisodeWithShow,
  getEpisodesByTopic,
  getShowsByTopic,
  getTopicById,
} from "@/src/api/feed.api";
import { useLibraryStore } from "@/src/state/library-store";
import { useVisibilityStore } from "@/src/state/visibility-store";

const TopicScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [attachedShows, setAttachedShows] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeWithShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isTopicSaved, toggleTopic } = useLibraryStore();
  const { isShowHidden, isEpisodeHidden } = useVisibilityStore();

  useEffect(() => {
    const loadTopicData = async () => {
      setLoading(true);
      setError(null);
      try {
        const topicData = await getTopicById(id);
        if (!topicData) {
          setError("Topic not found");
          return;
        }
        setTopic(topicData);

        const shows = await getShowsByTopic(id);
        setAttachedShows(shows.filter((show) => !isShowHidden(show.id)));

        const topicEpisodes = await getEpisodesByTopic(id);
        const dedupedEpisodes = Array.from(
          new Map(topicEpisodes.map((e) => [e.episode.id, e])).values(),
        );
        setEpisodes(
          dedupedEpisodes.filter(
            (episode) =>
              !isShowHidden(episode.show.id) &&
              !isEpisodeHidden(episode.episode.id),
          ),
        );
      } catch {
        setError("Failed to load topic data");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadTopicData();
    }
  }, [id, isEpisodeHidden, isShowHidden]);

  if (loading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="tag"
            style={styles.headerImage}
          />
        }
      >
        <ThemedText>Loading...</ThemedText>
      </ParallaxScrollView>
    );
  }

  if (error) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="tag"
            style={styles.headerImage}
          />
        }
      >
        <ThemedText>{error}</ThemedText>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="tag"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{topic?.name || "Topic"}</ThemedText>
        <Pressable style={styles.saveButton} onPress={() => toggleTopic(id)}>
          <ThemedText>{isTopicSaved(id) ? "Saved ✓" : "Save"}</ThemedText>
        </Pressable>
        <ThemedText>Topic ID: {id}</ThemedText>
      </ThemedView>
      {(() => {
        return (
          <ThemedView style={styles.showsContainer}>
            <ThemedText type="subtitle">Attached Shows</ThemedText>
            {attachedShows.length > 0 ? (
              attachedShows.map((show) => (
                <Pressable
                  key={show.id}
                  style={styles.showItem}
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
            ) : (
              <ThemedText>No attached shows</ThemedText>
            )}
          </ThemedView>
        );
      })()}

      <ThemedView style={styles.episodesContainer}>
        <ThemedText type="subtitle">Episodes</ThemedText>
        {episodes.length > 0 ? (
          episodes.map((episode) => {
            const episodeId = episode.episode.id;
            return (
              <Pressable
                key={episodeId}
                style={styles.episodeItem}
                onPress={() => router.push(`/episode/${episodeId}`)}
              >
                <ThemedText type="subtitle">{episode.episode.title}</ThemedText>
                <ThemedText>{episode.show.title}</ThemedText>
                {episode.episode.seasonNumber &&
                  episode.episode.episodeNumber && (
                    <ThemedText>
                      S{episode.episode.seasonNumber}E
                      {episode.episode.episodeNumber}
                    </ThemedText>
                  )}
              </Pressable>
            );
          })
        ) : (
          <ThemedText>No episodes found</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default TopicScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  showsContainer: {
    marginTop: 16,
  },
  showItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  episodesContainer: {
    marginTop: 16,
  },
  episodeItem: {
    gap: 4,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
});
