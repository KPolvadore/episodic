import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

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
import { useCreatorStore } from "@/src/state/creator-store";
import { useLibraryStore } from "@/src/state/library-store";

export default function ShowScreen() {
  const { id, fromSpecial, episodeId, fromContinue } = useLocalSearchParams<{
    id: string;
    fromSpecial?: string;
    episodeId?: string;
    fromContinue?: string;
  }>();

  const { isShowSaved, toggleShow } = useLibraryStore();
  const draftEpisodes = useCreatorStore((s) => s.getDraftEpisodesByShowId(id));
  const createdShow = useCreatorStore((s) => s.getShowById(id));

  type RenderEpisode = {
    id: string;
    title: string;
    seasonNumber: number;
    episodeNumber: number;
    isDraft: boolean;
    isTrailer: boolean;
    trailerForEpisodeNumber?: number;
  };

  const [episodes, setEpisodes] = useState<EpisodeWithShow["episode"][]>([]);
  const [specials, setSpecials] = useState<FeedItem[]>([]);
  const [showTitle, setShowTitle] = useState<string>("Unknown Show");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mergedEpisodes = useMemo(() => {
    const publishedMapped = episodes.map((e) => ({
      id: e.id,
      title: e.title,
      seasonNumber: e.seasonNumber ?? 1,
      episodeNumber: e.episodeNumber ?? 0,
      isDraft: false,
      isTrailer:
        (e as any).kind === "trailer" ||
        (e as any).episodeType === "trailer" ||
        (e as any).type === "trailer",
      trailerForEpisodeNumber: (e as any).trailerForEpisodeNumber,
    }));
    const draftsMapped = draftEpisodes.map((d) => ({
      id: d.id,
      title: d.title,
      seasonNumber: d.seasonNumber,
      episodeNumber: d.episodeNumber,
      isDraft: true,
      isTrailer: d.episodeType === "trailer",
      trailerForEpisodeNumber:
        d.episodeType === "trailer" ? d.episodeNumber : undefined,
    }));
    const combined = [...publishedMapped, ...draftsMapped];
    // De-dupe by id, preferring published if conflict
    const deduped = combined.reduce((acc, ep) => {
      if (!acc.some((existing) => existing.id === ep.id)) {
        acc.push(ep);
      }
      return acc;
    }, [] as RenderEpisode[]);
    // Sort: trailers first, then by season, then episode
    deduped.sort((a, b) => {
      if (a.isTrailer && !b.isTrailer) return -1;
      if (!a.isTrailer && b.isTrailer) return 1;
      if (a.seasonNumber !== b.seasonNumber)
        return a.seasonNumber - b.seasonNumber;
      return a.episodeNumber - b.episodeNumber;
    });
    return deduped;
  }, [episodes, draftEpisodes]);

  // IMPORTANT: keep season keys as strings (matches Object.entries keys + avoids TS mismatch)
  const [collapsedSeasons, setCollapsedSeasons] = useState<Set<string>>(
    new Set(),
  );
  const [offsets, setOffsets] = useState<Record<string, number>>({});

  const scrollRef = useRef<Animated.ScrollView>(null);
  const hasAutoScrolledRef = useRef(false);
  const [targetEpisodeId, setTargetEpisodeId] = useState<string | undefined>();

  const loadShow = useCallback(async () => {
    try {
      const showItems = await getShowEpisodes(id);

      if (showItems.length > 0) {
        setShowTitle(showItems[0].show.title);
        setEpisodes(showItems.map((item) => item.episode));
      } else {
        setShowTitle(createdShow?.title || "Unknown Show");
        setEpisodes([]);
      }

      const computedTargetEpisodeId =
        episodeId || (fromContinue ? showItems[0]?.episode.id : undefined);
      setTargetEpisodeId(computedTargetEpisodeId);

      // If we have a target episodeId, ensure its season is expanded so the row can be seen + measured.
      if (computedTargetEpisodeId) {
        const target = showItems.find(
          (item) => item.episode.id === computedTargetEpisodeId,
        );
        if (target) {
          const seasonKey = String(target.episode.seasonNumber ?? 1);
          setCollapsedSeasons((prev) => {
            const next = new Set(prev);
            next.delete(seasonKey);
            return next;
          });
        }
      }

      const mixedData = await getMixedFeed("new");
      const showSpecials = mixedData.filter(
        (item) => item.type === "special" && item.attachedShowIds?.includes(id),
      );
      setSpecials(showSpecials);
    } catch {
      setError("Failed to load show");
    } finally {
      setLoading(false);
    }
  }, [id, episodeId, fromContinue, createdShow]);

  useEffect(() => {
    loadShow();
    // When episodeId changes, allow one fresh auto-scroll attempt.
    hasAutoScrolledRef.current = false;
  }, [loadShow]);

  useFocusEffect(
    useCallback(() => {
      loadShow();
    }, [loadShow]),
  );

  useEffect(() => {
    if (
      targetEpisodeId &&
      offsets[targetEpisodeId] !== undefined &&
      !hasAutoScrolledRef.current
    ) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, offsets[targetEpisodeId] - 16),
        animated: true,
      });
      hasAutoScrolledRef.current = true;
    }
  }, [offsets, targetEpisodeId]);

  return (
    <ParallaxScrollView
      ref={scrollRef}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="tv"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{showTitle}</ThemedText>
        <ThemedText>Show ID: {id}</ThemedText>
      </ThemedView>

      <Pressable
        style={styles.createEpisodeButton}
        onPress={() =>
          id &&
          router.push({ pathname: "/create-episode", params: { showId: id } })
        }
      >
        <ThemedText>Create Episode</ThemedText>
        <ThemedText>Create a new episode for this show</ThemedText>
      </Pressable>

      <Pressable style={styles.saveButton} onPress={() => toggleShow(id)}>
        <ThemedText>{isShowSaved(id) ? "Saved ✓" : "Save"}</ThemedText>
      </Pressable>

      {fromSpecial && (
        <ThemedView style={styles.specialBanner}>
          <ThemedText>Opened from Special: {fromSpecial}</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && specials.length > 0 && (
        <ThemedView style={styles.specialsContainer}>
          <ThemedText type="subtitle">Specials</ThemedText>
          {specials.map((special) => {
            if (special.type !== "special") return null;

            return (
              <Pressable
                key={special.specialId}
                style={styles.specialItem}
                onPress={() =>
                  router.push({
                    pathname: "/special/[id]",
                    params: { id: special.specialId },
                  })
                }
              >
                <ThemedText type="subtitle">{special.title}</ThemedText>
                <ThemedText>{special.kind}</ThemedText>
              </Pressable>
            );
          })}
        </ThemedView>
      )}

      {loading && <ThemedText>Loading...</ThemedText>}
      {error && <ThemedText>Error: {error}</ThemedText>}

      {!loading && !error && episodes.length === 0 && (
        <ThemedText>No episodes yet</ThemedText>
      )}

      {!loading &&
        !error &&
        Object.entries(
          mergedEpisodes.reduce(
            (acc, episode) => {
              const seasonKey = String(episode.seasonNumber);
              if (!acc[seasonKey]) acc[seasonKey] = [];
              acc[seasonKey].push(episode);
              return acc;
            },
            {} as Record<string, RenderEpisode[]>,
          ),
        ).map(([seasonKey, eps]) => {
          eps.sort((a, b) => a.episodeNumber - b.episodeNumber);
          const isCollapsed = collapsedSeasons.has(seasonKey);

          return (
            <ThemedView key={seasonKey}>
              <Pressable
                onPress={() =>
                  setCollapsedSeasons((prev) => {
                    const next = new Set(prev);
                    if (next.has(seasonKey)) next.delete(seasonKey);
                    else next.add(seasonKey);
                    return next;
                  })
                }
              >
                <ThemedText type="subtitle">
                  Season {seasonKey} {isCollapsed ? "▸" : "▾"}
                </ThemedText>
              </Pressable>

              {!isCollapsed &&
                eps.map((episode) => (
                  <Pressable
                    key={episode.id}
                    style={[
                      styles.episodeContainer,
                      episode.isDraft && styles.draftEpisode,
                      targetEpisodeId && episode.id === targetEpisodeId
                        ? styles.episodeHighlighted
                        : null,
                    ]}
                    onLayout={(event) => {
                      // Store Y for auto-scroll targeting
                      const y = event.nativeEvent.layout.y;
                      setOffsets((prev) => {
                        if (prev[episode.id] !== y) {
                          return { ...prev, [episode.id]: y };
                        }
                        return prev;
                      });
                    }}
                    onPress={() => {
                      if (episode.isDraft) {
                        router.push({
                          pathname: "/create-episode",
                          params: { showId: id, draftEpisodeId: episode.id },
                        });
                      } else {
                        router.push({
                          pathname: "/episode/[id]" as any,
                          params: { id: episode.id },
                        });
                      }
                    }}
                  >
                    <ThemedText type="subtitle">
                      {episode.isTrailer
                        ? "Trailer"
                        : `Episode ${episode.episodeNumber}`}
                    </ThemedText>
                    <ThemedText>
                      {episode.title} {episode.isDraft ? "(Draft)" : ""}
                      {episode.isTrailer && episode.trailerForEpisodeNumber
                        ? ` (for Episode ${episode.trailerForEpisodeNumber})`
                        : ""}
                    </ThemedText>
                  </Pressable>
                ))}
            </ThemedView>
          );
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
  saveButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  createEpisodeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  specialBanner: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(255,0,0,0.1)",
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
  episodeContainer: {
    gap: 4,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  draftEpisode: {
    backgroundColor: "rgba(255,255,0,0.1)",
  },
  episodeHighlighted: {
    backgroundColor: "rgba(255,255,0,0.3)",
    borderWidth: 2,
    borderColor: "#ffff00",
  },
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
