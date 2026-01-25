import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
    getMixedFeed,
    getShowEpisodes,
    type EpisodeWithShow,
    type FeedItem,
} from "@/src/api/feed.api";
import { useLibraryStore } from "@/src/state/library-store";

const TopicScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [specials, setSpecials] = useState<FeedItem[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeWithShow[]>([]);
  const [attachedShowIds, setAttachedShowIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isTopicSaved, toggleTopic } = useLibraryStore();

  useEffect(() => {
    const loadSpecials = async () => {
      setLoading(true);
      setError(null);
      try {
        const feed = await getMixedFeed("new");
        const matchingSpecials = feed.filter((item) => {
          if (item.type === "special") {
            const topics = item.attachedTopicIds ?? [];
            return topics.includes(id);
          }
          return false;
        });
        setSpecials(matchingSpecials);
        const showIds = Array.from(
          new Set(
            matchingSpecials
              .filter(
                (
                  s,
                ): s is FeedItem & {
                  type: "special";
                  attachedShowIds: string[];
                } => s.type === "special" && !!s.attachedShowIds,
              )
              .flatMap((s) => s.attachedShowIds),
          ),
        );
        setAttachedShowIds(showIds);
      } catch {
        setError("Failed to load specials");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadSpecials();
    }
  }, [id]);

  useEffect(() => {
    const loadEpisodes = async () => {
      if (attachedShowIds.length === 0) {
        setEpisodes([]);
        return;
      }
      try {
        const allEpisodes: EpisodeWithShow[] = [];
        for (const showId of attachedShowIds) {
          const showEpisodes = await getShowEpisodes(showId);
          allEpisodes.push(...showEpisodes);
        }
        const episodeMap = new Map<string, EpisodeWithShow>();
        allEpisodes.forEach((item) => {
          if (!episodeMap.has(item.episode.id)) {
            episodeMap.set(item.episode.id, item);
          }
        });
        const deduped = Array.from(episodeMap.values());
        deduped.sort((a, b) => {
          if (a.show.title !== b.show.title) {
            return a.show.title.localeCompare(b.show.title);
          }
          const aSeason = a.episode.seasonNumber ?? 1;
          const bSeason = b.episode.seasonNumber ?? 1;
          if (aSeason !== bSeason) return aSeason - bSeason;
          return (
            (a.episode.episodeNumber ?? 0) - (b.episode.episodeNumber ?? 0)
          );
        });
        setEpisodes(deduped);
      } catch {
        // Ignore errors for episodes
      }
    };
    loadEpisodes();
  }, [attachedShowIds]);

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
      <ThemedText type="title">Topic</ThemedText>

      <Pressable style={styles.saveButton} onPress={() => toggleTopic(id)}>
        <ThemedText>{isTopicSaved(id) ? "Saved ✓" : "Save"}</ThemedText>
      </Pressable>
      <ThemedText>Topic ID: {id}</ThemedText>
      {(() => {
        const showTitles = new Map(
          episodes
            .filter((e) => e.type === "episode")
            .map((e) => [e.episode.showId, e.show.title]),
        );
        return (
          <ThemedView style={styles.showsContainer}>
            <ThemedText type="subtitle">Attached Shows</ThemedText>
            {attachedShowIds.length > 0 ? (
              attachedShowIds.map((showId) => (
                <Pressable
                  key={showId}
                  style={styles.showItem}
                  onPress={() =>
                    router.push({
                      pathname: "/show/[id]",
                      params: { id: showId },
                    })
                  }
                >
                  <ThemedText>
                    {showTitles.get(showId) || `Show: ${showId}`}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              <ThemedText>No attached shows</ThemedText>
            )}
          </ThemedView>
        );
      })()}
      <ThemedView style={styles.specialsContainer}>
        {specials.map((special) => {
          if (special.type === "special") {
            return (
              <Pressable
                key={special.specialId}
                style={styles.specialItem}
                onPress={() => router.push(`/special/${special.specialId}`)}
              >
                <ThemedText type="subtitle">{special.title}</ThemedText>
                <ThemedText>{special.kind}</ThemedText>
              </Pressable>
            );
          }
          return null;
        })}
      </ThemedView>
      <ThemedView style={styles.episodesContainer}>
        <ThemedText type="subtitle">Episodes in this Topic</ThemedText>
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
          <ThemedText>No episodes found for attached shows</ThemedText>
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
  showsContainer: {
    marginTop: 16,
  },
  showItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  specialsContainer: {
    marginTop: 16,
  },
  specialItem: {
    gap: 4,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
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
