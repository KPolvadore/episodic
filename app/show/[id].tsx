import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getMixedFeed,
  getShowEpisodes,
  getTopicById,
  resolveShowById,
  type EpisodeWithShow,
  type FeedItem,
} from "@/src/api/feed.api";
import { useCreatorStore } from "@/src/state/creator-store";
import { useEntitlementsStore } from "@/src/state/entitlements-store";
import { useFollowStore } from "@/src/state/follow-store";
import { useLibraryStore } from "@/src/state/library-store";
import { useRateLimitStore } from "@/src/state/rate-limit-store";
import { useTipsStore } from "@/src/state/tips-store";
import { useReportsStore } from "@/src/state/reports-store";
import { useVisibilityStore } from "@/src/state/visibility-store";

export default function ShowScreen() {
  const { id, fromSpecial, episodeId, fromContinue } = useLocalSearchParams<{
    id: string;
    fromSpecial?: string;
    episodeId?: string;
    fromContinue?: string;
  }>();

  const { isShowSaved, toggleShow } = useLibraryStore();
  const { isShowFollowed, toggleFollowShow } = useFollowStore();
  const { hasSeasonPass, purchaseSeasonPass } = useEntitlementsStore();
  const { addTip } = useTipsStore();
  const { addReport } = useReportsStore();
  const { canPerform, recordAction, getRemainingMs } = useRateLimitStore();
  const {
    isShowHidden,
    isEpisodeHidden,
    hideShow,
    unhideShow,
    hideEpisode,
    unhideEpisode,
  } = useVisibilityStore();
  const draftEpisodes = useCreatorStore((s) => s.getDraftEpisodesByShowId(id));
  const isCreatorShow = !!useCreatorStore((s) => s.getShowById(id));
  const isEntitled = isCreatorShow || hasSeasonPass(id);
  const showHidden = isShowHidden(id);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [selectedTipAmount, setSelectedTipAmount] = useState<number | null>(
    null,
  );
  const [lastReceipt, setLastReceipt] = useState<{
    showTitle: string;
    amount: number;
    createdAtIso: string;
  } | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState<
    string | null
  >(null);
  const reportReasons = [
    "Spam or misleading",
    "Hate or harassment",
    "Violence or harmful content",
    "Copyright infringement",
    "Other",
  ];

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
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("unknown");
  const [resolvedTopicId, setResolvedTopicId] = useState<string | undefined>();
  const [resolvedTopicName, setResolvedTopicName] = useState<
    string | undefined
  >();
  const [rawTopicKeys, setRawTopicKeys] = useState<string[]>([]);
  const [resolvedShow, setResolvedShow] = useState<any>(null);

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
      const resolved = await resolveShowById(id);
      if (!resolved) {
        setError("Show not found");
        return;
      }

      setResolvedShow(resolved.show);
      setSource(resolved.source);
      setShowTitle(resolved.show.title);

      const showItems = await getShowEpisodes(id);
      setEpisodes(showItems.map((item) => item.episode));

      // Set raw topic keys
      setRawTopicKeys(
        Object.keys(resolved.show).filter((key) =>
          ["topic", "topicId", "topicName", "genre", "category"].includes(key),
        ),
      );

      // Load topics for the show
      const show = resolved.show;
      if (show.topicIds && show.topicIds.length > 0) {
        const topicPromises = show.topicIds.map((topicId: string) =>
          getTopicById(topicId),
        );
        const loadedTopics = await Promise.all(topicPromises);
        const filteredTopics = loadedTopics.filter((t: any) => t !== null);
        setTopics(filteredTopics);
        if (filteredTopics.length > 0) {
          setResolvedTopicId(filteredTopics[0]?.id);
          setResolvedTopicName(filteredTopics[0]?.name);
        } else {
          setResolvedTopicId(undefined);
          setResolvedTopicName(undefined);
        }
      } else {
        setTopics([]);
        setResolvedTopicId(undefined);
        setResolvedTopicName(undefined);
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
  }, [id, episodeId, fromContinue]);

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
    console.log("[ShowHubDiagnostics]", {
      id,
      source,
      topicId: resolvedTopicId,
      topicName: resolvedTopicName,
      showKeys: Object.keys(resolvedShow ?? {}),
    });
  }, [id, source, resolvedTopicId, resolvedTopicName, resolvedShow]);

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
    <>
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
        {__DEV__ && (
          <ThemedText style={{ fontSize: 12, color: "gray" }}>
            DEV: source={source} topicId={resolvedTopicId || "none"} topicName=
            {resolvedTopicName || "none"} keys=[{rawTopicKeys.join(",")}]
          </ThemedText>
        )}
      </ThemedView>

      {topics.length > 0 && (
        <ThemedView style={styles.topicsContainer}>
          <ThemedText type="subtitle">Topics</ThemedText>
          <ThemedView style={styles.topicsChips}>
            {topics.map((topic) => (
              <Pressable
                key={topic.id}
                style={styles.topicChip}
                onPress={
                  topic.id
                    ? () =>
                        router.push({
                          pathname: "/topic/[id]",
                          params: { id: topic.id },
                        })
                    : undefined
                }
              >
                <ThemedText style={styles.topicChipText}>
                  {topic.name}
                  {!topic.id ? " (missing topic id)" : ""}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      )}

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

      {!isEntitled && (
        <ThemedView style={styles.paywallCard}>
          <ThemedText type="subtitle">Season Pass Required</ThemedText>
          <ThemedText>
            Unlock all episodes for this show with a season pass.
          </ThemedText>
          <Pressable
            style={styles.purchaseButton}
            onPress={() => purchaseSeasonPass(id)}
          >
            <ThemedText>Unlock Season Pass (Mock)</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      <Pressable style={styles.saveButton} onPress={() => toggleShow(id)}>
        <ThemedText>{isShowSaved(id) ? "Saved ✓" : "Save"}</ThemedText>
      </Pressable>

      <Pressable
        style={styles.followButton}
        onPress={() => toggleFollowShow(id)}
      >
        <ThemedText>{isShowFollowed(id) ? "Following" : "Follow"}</ThemedText>
      </Pressable>

      {isCreatorShow && (
        <Pressable
          style={styles.hideShowButton}
          onPress={() => {
            if (showHidden) {
              unhideShow(id);
            } else {
              hideShow(id);
            }
          }}
        >
          <ThemedText>{showHidden ? "Unhide Show" : "Hide Show"}</ThemedText>
        </Pressable>
      )}

      <Pressable
        style={styles.writersRoomButton}
        onPress={() =>
          id &&
          router.push({
            pathname: "/writers-room/[showId]",
            params: { showId: id },
          })
        }
      >
        <ThemedText>Writers Room</ThemedText>
        <ThemedText>Manage collaborators</ThemedText>
      </Pressable>

      <Pressable
        style={styles.reportButton}
        onPress={() => setReportModalVisible(true)}
      >
        <ThemedText>Report Show</ThemedText>
        <ThemedText>Flag this show</ThemedText>
      </Pressable>

      <Pressable
        style={styles.tipButton}
        onPress={() => setTipModalVisible(true)}
      >
        <ThemedText>Tip This Show</ThemedText>
        <ThemedText>Support the creator</ThemedText>
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

      {!loading && !error && showHidden && !isCreatorShow && (
        <ThemedView style={styles.hiddenBanner}>
          <ThemedText>This show is currently hidden.</ThemedText>
        </ThemedView>
      )}

      {!loading && !error && episodes.length === 0 && !showHidden && (
        <ThemedText>No episodes yet</ThemedText>
      )}

      {!loading &&
        !error &&
        !showHidden &&
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
                eps
                  .filter(
                    (episode) =>
                      isCreatorShow || !isEpisodeHidden(episode.id),
                  )
                  .map((episode) => (
                  <Pressable
                    key={episode.id}
                    style={[
                      styles.episodeContainer,
                      !isEntitled && !episode.isDraft && styles.lockedEpisode,
                      episode.isDraft && styles.draftEpisode,
                      isEpisodeHidden(episode.id) && styles.hiddenEpisode,
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
                      if (!isEntitled && !episode.isDraft) {
                        Alert.alert(
                          "Season Pass Required",
                          "Purchase a season pass to watch this episode.",
                        );
                        return;
                      }
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
                      {!isEntitled && !episode.isDraft ? " • Locked" : ""}
                      {isCreatorShow && isEpisodeHidden(episode.id)
                        ? " • Hidden"
                        : ""}
                    </ThemedText>
                    {isCreatorShow && !episode.isDraft && (
                      <Pressable
                        style={styles.hideToggleButton}
                        onPress={() => {
                          if (isEpisodeHidden(episode.id)) {
                            unhideEpisode(episode.id);
                          } else {
                            hideEpisode(episode.id);
                          }
                        }}
                      >
                        <ThemedText style={styles.hideToggleText}>
                          {isEpisodeHidden(episode.id) ? "Unhide" : "Hide"}
                        </ThemedText>
                      </Pressable>
                    )}
                  </Pressable>
                ))}
            </ThemedView>
          );
        })}
      </ParallaxScrollView>
      <Modal visible={tipModalVisible} transparent animationType="slide">
        <ThemedView style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <ThemedText type="subtitle">Send a Tip</ThemedText>
            <ThemedText>{showTitle}</ThemedText>
            <ThemedView style={styles.tipRow}>
              {[2, 5, 10].map((amount) => (
                <Pressable
                  key={amount}
                  style={[
                    styles.tipAmount,
                    selectedTipAmount === amount && styles.tipAmountSelected,
                  ]}
                  onPress={() => setSelectedTipAmount(amount)}
                >
                  <ThemedText>${amount}</ThemedText>
                </Pressable>
              ))}
            </ThemedView>
            <Pressable
              style={[
                styles.tipConfirmButton,
                !selectedTipAmount && styles.tipConfirmDisabled,
              ]}
              disabled={!selectedTipAmount}
              onPress={() => {
                if (!selectedTipAmount) return;
                const receipt = addTip({
                  showId: id,
                  showTitle,
                  amount: selectedTipAmount,
                });
                setLastReceipt({
                  showTitle: receipt.showTitle,
                  amount: receipt.amount,
                  createdAtIso: receipt.createdAtIso,
                });
                setSelectedTipAmount(null);
              }}
            >
              <ThemedText>Send Tip (Mock)</ThemedText>
            </Pressable>
            {lastReceipt && (
              <ThemedView style={styles.receiptCard}>
                <ThemedText type="subtitle">Receipt</ThemedText>
                <ThemedText>{lastReceipt.showTitle}</ThemedText>
                <ThemedText>Amount: ${lastReceipt.amount}</ThemedText>
                <ThemedText style={styles.meta}>
                  {new Date(lastReceipt.createdAtIso).toLocaleString()}
                </ThemedText>
              </ThemedView>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setTipModalVisible(false)}
            >
              <ThemedText>Close</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Modal>
      <Modal visible={reportModalVisible} transparent animationType="slide">
        <ThemedView style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <ThemedText type="subtitle">Report Show</ThemedText>
            <ThemedText>{showTitle}</ThemedText>
            <ThemedView style={styles.reportReasons}>
              {reportReasons.map((reason) => (
                <Pressable
                  key={reason}
                  style={[
                    styles.reportReason,
                    selectedReportReason === reason &&
                      styles.reportReasonSelected,
                  ]}
                  onPress={() => setSelectedReportReason(reason)}
                >
                  <ThemedText>{reason}</ThemedText>
                </Pressable>
              ))}
            </ThemedView>
            <Pressable
              style={[
                styles.tipConfirmButton,
                !selectedReportReason && styles.tipConfirmDisabled,
              ]}
              disabled={!selectedReportReason}
              onPress={() => {
                if (!selectedReportReason) return;
                if (!canPerform("report")) {
                  const remaining = getRemainingMs("report");
                  Alert.alert(
                    "Slow down",
                    `You're submitting reports too quickly. Try again in ${Math.ceil(
                      remaining / 1000,
                    )}s.`,
                  );
                  return;
                }
                addReport({
                  targetType: "show",
                  targetId: id,
                  reason: selectedReportReason,
                });
                recordAction("report");
                setSelectedReportReason(null);
                setReportModalVisible(false);
                Alert.alert(
                  "Report submitted",
                  "Thanks for helping keep Episodic safe.",
                );
              }}
            >
              <ThemedText>Submit Report</ThemedText>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setReportModalVisible(false)}
            >
              <ThemedText>Cancel</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
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
  followButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  hideShowButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(255,0,0,0.12)",
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
  writersRoomButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  hideToggleButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "rgba(255,0,0,0.12)",
    alignSelf: "flex-start",
  },
  hideToggleText: {
    fontSize: 12,
    color: "#cc3333",
  },
  hiddenBanner: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,0,0,0.12)",
    borderRadius: 8,
  },
  tipButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,123,255,0.12)",
    borderRadius: 8,
    alignItems: "center",
  },
  reportButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255,0,0,0.12)",
    borderRadius: 8,
    alignItems: "center",
  },
  paywallCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,165,0,0.12)",
    borderRadius: 10,
    gap: 8,
  },
  purchaseButton: {
    padding: 10,
    backgroundColor: "rgba(255,165,0,0.2)",
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
  hiddenEpisode: {
    opacity: 0.7,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
  },
  tipAmount: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  tipAmountSelected: {
    backgroundColor: "rgba(0,123,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(0,123,255,0.5)",
  },
  tipConfirmButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,123,255,0.18)",
    alignItems: "center",
  },
  tipConfirmDisabled: {
    opacity: 0.5,
  },
  receiptCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.06)",
    gap: 4,
  },
  reportReasons: {
    gap: 8,
  },
  reportReason: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  reportReasonSelected: {
    backgroundColor: "rgba(255,0,0,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,0,0,0.4)",
  },
  meta: {
    fontSize: 11,
    color: "#666",
  },
  closeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
  },
  lockedEpisode: {
    opacity: 0.6,
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
