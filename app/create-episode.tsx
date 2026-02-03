import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    getShowEpisodes,
    publishEpisode,
    PublishEpisodeInput,
} from "@/src/api/feed.api";
import { useCreatorStore } from "@/src/state/creator-store";
import { useWritersRoomStore } from "@/src/state/writers-room-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    AppState,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    TextInput,
} from "react-native";

const hookTemplates = [
  { id: "cliffhanger", label: "Cliffhanger" },
  { id: "question", label: "Cold open question" },
  { id: "recap", label: "Quick recap" },
  { id: "twist", label: "Plot twist tease" },
] as const;

export default function CreateEpisodeScreen() {
  const colorScheme = useColorScheme();
  const { showId, draftEpisodeId } = useLocalSearchParams<{
    showId?: string;
    draftEpisodeId?: string;
  }>();
  const selectedShowId = typeof showId === "string" ? showId : "";
  const {
    addDraftEpisode,
    updateDraftEpisode,
    getDraftEpisodeById,
    getDraftEpisodesByShowId,
    removeDraftEpisode,
    shareDraft,
    unshareDraft,
  } = useCreatorStore();
  const activeDraft = useCreatorStore((s) =>
    draftEpisodeId ? s.getDraftEpisodeById(draftEpisodeId) : undefined,
  );
  const { roleByShowId, seedShow } = useWritersRoomStore();
  const myRole = roleByShowId[selectedShowId] || "viewer";
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "failed" | "success"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [failNext, setFailNext] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [uploadSessionId, setUploadSessionId] = useState<string | null>(null);
  const [selectedHookTemplateId, setSelectedHookTemplateId] =
    useState("cliffhanger");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeType, setEpisodeType] = useState<"episode" | "trailer">(
    "episode",
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [showIdError, setShowIdError] = useState<string | null>(null);
  const [draftMeta, setDraftMeta] = useState<{
    title: string;
    showId: string;
    hookTemplateId: string;
    nextDropIso: string | null;
    previouslyOnEpisodeIds: string[];
  } | null>(null);
  const [nextDropDate, setNextDropDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previouslyOnEpisodeIds, setPreviouslyOnEpisodeIds] = useState<
    string[]
  >([]);
  const [priorEpisodes, setPriorEpisodes] = useState<
    { id: string; title: string; seasonNumber: number; episodeNumber: number }[]
  >([]);
  const [publishedResult, setPublishedResult] = useState<{
    type: "episode";
    episode: any;
    show: any;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [draftCreated, setDraftCreated] = useState<{
    episodeNumber: number;
    showId: string;
  } | null>(null);
  const [currentDraft, setCurrentDraft] = useState<any>(null);

  useEffect(() => {
    if (selectedShowId) {
      seedShow(selectedShowId);
    }
    const loadPriorEpisodes = async () => {
      if (selectedShowId) {
        try {
          const episodes = await getShowEpisodes(selectedShowId);
          setPriorEpisodes(
            episodes.map((item) => ({
              id: item.episode.id,
              title: item.episode.title,
              seasonNumber: item.episode.seasonNumber ?? 1,
              episodeNumber: item.episode.episodeNumber ?? 0,
            })),
          );
        } catch {
          setPriorEpisodes([]);
        }
      } else {
        setPriorEpisodes([]);
      }
    };
    loadPriorEpisodes();
  }, [selectedShowId, seedShow]);

  useEffect(() => {
    if (draftEpisodeId) {
      const draft = getDraftEpisodeById(draftEpisodeId);
      if (draft) {
        setCurrentDraft(draft);
        setEpisodeTitle(draft.title);
        setSelectedHookTemplateId(draft.hookTemplateId || "cliffhanger");
        setNextDropDate(draft.nextDropIso ? new Date(draft.nextDropIso) : null);
        setPreviouslyOnEpisodeIds(draft.previouslyOnEpisodeIds || []);
        setEpisodeType(draft.episodeType || "episode");
      }
    }
  }, [draftEpisodeId, getDraftEpisodeById]);

  useEffect(() => {
    if (uploadStatus !== "uploading" && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [uploadStatus]);

  const startUploadInterval = useCallback(() => {
    if (timerRef.current) return; // Already running
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 6) + 5; // 5-10
        if (newProgress >= 100) {
          setUploadStatus("success");
          setUploadSessionId(null);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 100;
        }
        if (failNext && newProgress > 40 && newProgress < 60) {
          setUploadStatus("failed");
          setFailNext(false);
          setUploadSessionId(null);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return newProgress;
        }
        return newProgress;
      });
    }, 500); // Slower for testing
  }, [failNext]);

  const startUpload = () => {
    const sessionId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setUploadSessionId(sessionId);
    setUploadStatus("uploading");
    setProgress(0);
    startUploadInterval();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Resume upload if in progress
        if (
          uploadStatus === "uploading" &&
          uploadSessionId &&
          progress < 100 &&
          !timerRef.current
        ) {
          startUploadInterval();
        }
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        // Stop interval when going to background
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [uploadStatus, uploadSessionId, progress, startUploadInterval]);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="camera"
            style={styles.headerImage}
          />
        }
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText>Back</ThemedText>
        </Pressable>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Create Episode</ThemedText>
          <ThemedText>
            {selectedShowId
              ? `For Show: ${selectedShowId}`
              : "No show selected"}
          </ThemedText>
          {currentDraft && (
            <ThemedText style={styles.editingLabel}>
              Editing Draft: S{currentDraft.seasonNumber}E
              {currentDraft.episodeNumber}
            </ThemedText>
          )}
          {activeDraft && activeDraft.sharedWithWritersRoom && (
            <ThemedView style={styles.sharedBadge}>
              <ThemedText style={styles.sharedBadgeText}>Shared</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Permissions</ThemedText>
          <ThemedView style={styles.permissionRow}>
            <ThemedText>Camera: Not requested</ThemedText>
          </ThemedView>
          <ThemedView style={styles.permissionRow}>
            <ThemedText>Microphone: Not requested</ThemedText>
          </ThemedView>
          <ThemedText style={styles.note}>
            Real permission prompts added in Phase 2 Step 03.
          </ThemedText>
        </ThemedView>

        {activeDraft && (myRole === "owner" || myRole === "editor") && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Writers Room</ThemedText>
            <Pressable
              style={styles.shareButton}
              onPress={() => {
                if (activeDraft.sharedWithWritersRoom) {
                  unshareDraft(selectedShowId, activeDraft.id);
                  Alert.alert("Unshared from Writers Room");
                } else {
                  shareDraft(selectedShowId, activeDraft.id);
                  Alert.alert("Shared", "Draft shared to Writer’s Room", [
                    { text: "Stay here" },
                    {
                      text: "Go to Writer’s Room",
                      onPress: () =>
                        router.push(`/writers-room/${selectedShowId}`),
                    },
                  ]);
                }
              }}
            >
              <ThemedText>
                {activeDraft.sharedWithWritersRoom
                  ? "Unshare from Writers Room"
                  : "Share with Writers Room"}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recorder</ThemedText>
          <ThemedView style={styles.recorderCard}>
            <ThemedText>Record UI coming next</ThemedText>
            <Pressable style={[styles.recordButton, styles.disabled]}>
              <ThemedText>Start Recording</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Episode Title</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Episode title"
            value={episodeTitle}
            onChangeText={(text: string) => {
              setEpisodeTitle(text);
              if (titleError) setTitleError(null);
              if (currentDraft) {
                updateDraftEpisode(currentDraft.id, { title: text });
              }
            }}
          />
          {titleError && (
            <ThemedText style={styles.errorText}>{titleError}</ThemedText>
          )}
          {showIdError && (
            <ThemedText style={styles.errorText}>{showIdError}</ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Episode Type</ThemedText>
          <ThemedView style={styles.typeRow}>
            <Pressable
              style={[
                styles.typeButton,
                episodeType === "episode" && styles.typeButtonSelected,
              ]}
              onPress={() => {
                setEpisodeType("episode");
                if (currentDraft) {
                  updateDraftEpisode(currentDraft.id, {
                    episodeType: "episode",
                  });
                }
              }}
            >
              <ThemedText
                style={
                  episodeType === "episode"
                    ? styles.typeTextSelected
                    : styles.typeText
                }
              >
                Episode
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                episodeType === "trailer" && styles.typeButtonSelected,
              ]}
              onPress={() => {
                setEpisodeType("trailer");
                if (currentDraft) {
                  updateDraftEpisode(currentDraft.id, {
                    episodeType: "trailer",
                  });
                }
              }}
            >
              <ThemedText
                style={
                  episodeType === "trailer"
                    ? styles.typeTextSelected
                    : styles.typeText
                }
              >
                Trailer
              </ThemedText>
            </Pressable>
          </ThemedView>
          {episodeType === "trailer" && (
            <ThemedText style={styles.trailerBadge}>Trailer</ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Hook Template</ThemedText>
          {hookTemplates.map((template) => (
            <Pressable
              key={template.id}
              style={styles.templateRow}
              onPress={() => {
                setSelectedHookTemplateId(template.id);
                if (currentDraft) {
                  updateDraftEpisode(currentDraft.id, {
                    hookTemplateId: template.id,
                  });
                }
              }}
            >
              <ThemedText>
                {template.label}{" "}
                {selectedHookTemplateId === template.id ? "✓" : ""}
              </ThemedText>
            </Pressable>
          ))}
          <Pressable
            style={[
              styles.createDraftButton,
              (!selectedShowId || !episodeTitle.trim()) && styles.disabled,
            ]}
            disabled={!selectedShowId || !episodeTitle.trim()}
            onPress={async () => {
              if (!selectedShowId) {
                setShowIdError("Show must be selected");
                return;
              }
              const trimmedTitle = episodeTitle.trim();
              if (!trimmedTitle) {
                setTitleError("Title is required");
                return;
              }
              setTitleError(null);
              setShowIdError(null);
              if (currentDraft) {
                updateDraftEpisode(currentDraft.id, {
                  title: trimmedTitle,
                  hookTemplateId: selectedHookTemplateId,
                  nextDropIso: nextDropDate
                    ? nextDropDate.toISOString().slice(0, 10)
                    : null,
                  previouslyOnEpisodeIds,
                });
              } else {
                setDraftMeta({
                  title: trimmedTitle,
                  showId: selectedShowId,
                  hookTemplateId: selectedHookTemplateId,
                  nextDropIso: nextDropDate
                    ? nextDropDate.toISOString().slice(0, 10)
                    : null,
                  previouslyOnEpisodeIds,
                });
              }
            }}
          >
            <ThemedText>Create Draft Metadata</ThemedText>
          </Pressable>
          {!selectedShowId && (
            <ThemedText style={styles.errorText}>
              Select a show first
            </ThemedText>
          )}
          {draftMeta && (
            <ThemedText style={styles.draftInfo}>
              Draft: showId={draftMeta.showId}, hookTemplate=
              {draftMeta.hookTemplateId}, nextDrop=
              {draftMeta.nextDropIso
                ? draftMeta.nextDropIso.slice(0, 10)
                : "none"}
              , previouslyOn=[{draftMeta.previouslyOnEpisodeIds.join(", ")}]
            </ThemedText>
          )}
          <Pressable
            style={[
              styles.createDraftEpisodeButton,
              ((!draftMeta && !currentDraft) || !episodeTitle.trim()) &&
                styles.disabled,
            ]}
            disabled={(!draftMeta && !currentDraft) || !episodeTitle.trim()}
            onPress={async () => {
              if (!draftMeta && !currentDraft) return;
              const trimmedTitle = episodeTitle.trim();
              if (!trimmedTitle) {
                setTitleError("Title is required");
                return;
              }
              setTitleError(null);
              try {
                if (currentDraft) {
                  // Update existing draft
                  updateDraftEpisode(currentDraft.id, {
                    title: trimmedTitle,
                    hookTemplateId: selectedHookTemplateId,
                    nextDropIso: nextDropDate
                      ? nextDropDate.toISOString().slice(0, 10)
                      : null,
                    previouslyOnEpisodeIds,
                  });
                  setDraftCreated({
                    episodeNumber: currentDraft.episodeNumber,
                    showId: currentDraft.showId,
                  });
                } else {
                  const existingPublished =
                    await getShowEpisodes(selectedShowId);
                  const seasonEpisodes = existingPublished.filter(
                    (item) =>
                      item.episode.seasonNumber === 1 &&
                      (item.episode as any).kind !== "trailer",
                  );
                  const publishedMax =
                    seasonEpisodes.length > 0
                      ? Math.max(
                          ...seasonEpisodes.map(
                            (item) => item.episode.episodeNumber,
                          ),
                        )
                      : 0;
                  const existingDrafts =
                    getDraftEpisodesByShowId(selectedShowId);
                  const seasonDrafts = existingDrafts.filter(
                    (d) => d.seasonNumber === 1 && d.episodeType !== "trailer",
                  );
                  const draftMax =
                    seasonDrafts.length > 0
                      ? Math.max(...seasonDrafts.map((d) => d.episodeNumber))
                      : 0;
                  const nextEpisodeNumber =
                    Math.max(publishedMax, draftMax) + 1;
                  const title = draftMeta!.title || "Episode Draft";
                  addDraftEpisode({
                    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    showId: selectedShowId,
                    title,
                    seasonNumber: 1,
                    episodeNumber: nextEpisodeNumber,
                    hookTemplateId: draftMeta!.hookTemplateId,
                    nextDropIso: draftMeta!.nextDropIso,
                    previouslyOnEpisodeIds: draftMeta!.previouslyOnEpisodeIds,
                    episodeType: "episode", // Default for new drafts
                  });
                  setDraftCreated({
                    episodeNumber: nextEpisodeNumber,
                    showId: selectedShowId,
                  });
                }
              } catch {
                // Handle error if needed
              }
            }}
          >
            <ThemedText>Create Draft Episode</ThemedText>
          </Pressable>
          {draftCreated && (
            <>
              <ThemedText style={styles.draftInfo}>
                Draft created: S1E{draftCreated.episodeNumber}
              </ThemedText>
              <Pressable
                style={styles.viewShowButton}
                onPress={() =>
                  router.push({
                    pathname: "/show/[id]",
                    params: { id: draftCreated.showId },
                  })
                }
              >
                <ThemedText>View Show</ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Previously on...</ThemedText>
          {priorEpisodes.length === 0 ? (
            <ThemedText>No prior episodes yet</ThemedText>
          ) : (
            priorEpisodes.map((episode) => (
              <Pressable
                key={episode.id}
                style={[
                  styles.templateRow,
                  previouslyOnEpisodeIds.includes(episode.id) && {
                    backgroundColor: colorScheme === "dark" ? "#555" : "#ddd",
                  },
                ]}
                onPress={() => {
                  const newIds = previouslyOnEpisodeIds.includes(episode.id)
                    ? previouslyOnEpisodeIds.filter((id) => id !== episode.id)
                    : [...previouslyOnEpisodeIds, episode.id];
                  setPreviouslyOnEpisodeIds(newIds);
                  if (currentDraft) {
                    updateDraftEpisode(currentDraft.id, {
                      previouslyOnEpisodeIds: newIds,
                    });
                  }
                }}
              >
                <ThemedText>
                  S{episode.seasonNumber}E{episode.episodeNumber}:{" "}
                  {episode.title}{" "}
                  {previouslyOnEpisodeIds.includes(episode.id) ? "✓" : ""}
                </ThemedText>
              </Pressable>
            ))
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Next Drop</ThemedText>
          <Pressable
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText>
              {nextDropDate
                ? nextDropDate.toISOString().slice(0, 10)
                : "YYYY-MM-DD"}
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.helperText}>Tap to select date</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Upload</ThemedText>
          <ThemedText>
            Upload Status:{" "}
            {uploadStatus === "idle"
              ? "Ready"
              : uploadStatus === "uploading"
                ? "In Progress"
                : uploadStatus === "failed"
                  ? "Failed"
                  : "Complete"}
          </ThemedText>
          {uploadStatus === "uploading" && (
            <ThemedText>Progress: {progress}%</ThemedText>
          )}
          <ThemedView style={styles.uploadRow}>
            <ThemedText>Fail next upload</ThemedText>
            <Switch value={failNext} onValueChange={setFailNext} />
          </ThemedView>
          {(uploadStatus === "idle" ||
            uploadStatus === "failed" ||
            uploadStatus === "success") && (
            <Pressable style={styles.uploadButton} onPress={startUpload}>
              <ThemedText>Start Upload</ThemedText>
            </Pressable>
          )}
          {uploadStatus === "failed" && (
            <ThemedText>Upload failed — tap Start Upload to retry</ThemedText>
          )}
          {uploadStatus === "success" && (
            <ThemedText>Upload complete</ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Publish</ThemedText>
          <Pressable
            style={[
              styles.publishButton,
              (uploadStatus !== "success" ||
                !selectedShowId ||
                !episodeTitle.trim()) &&
                styles.disabled,
            ]}
            onPress={async () => {
              const trimmedTitle = episodeTitle.trim();
              if (!selectedShowId) {
                setShowIdError("Show must be selected");
                return;
              }
              if (!trimmedTitle) {
                setTitleError("Title is required");
                return;
              }
              setTitleError(null);
              setShowIdError(null);
              try {
                setPublishError(null);
                const showId =
                  draftMeta?.showId ?? currentDraft?.showId ?? selectedShowId;
                const seasonNumber = currentDraft?.seasonNumber ?? 1;
                let episodeNumber: number;
                let trailerForEpisodeNumber: number | undefined;
                if (episodeType === "trailer") {
                  // Trailers always have episodeNumber = 0 and trailerForEpisodeNumber = 1 (or preserve existing)
                  episodeNumber = 0;
                  trailerForEpisodeNumber = currentDraft?.episodeNumber ?? 1;
                } else {
                  // Regular episodes: calculate next number excluding trailers
                  if (currentDraft) {
                    episodeNumber = currentDraft.episodeNumber;
                  } else {
                    const existing = await getShowEpisodes(showId);
                    const seasonEpisodes = existing.filter(
                      (item) =>
                        item.episode.seasonNumber === seasonNumber &&
                        (item.episode as any).kind !== "trailer",
                    );
                    const publishedMax =
                      seasonEpisodes.length > 0
                        ? Math.max(
                            ...seasonEpisodes.map(
                              (item) => item.episode.episodeNumber,
                            ),
                          )
                        : 0;
                    const existingDrafts = getDraftEpisodesByShowId(showId);
                    const seasonDrafts = existingDrafts.filter(
                      (d) =>
                        d.seasonNumber === seasonNumber &&
                        d.episodeType !== "trailer",
                    );
                    const draftMax =
                      seasonDrafts.length > 0
                        ? Math.max(...seasonDrafts.map((d) => d.episodeNumber))
                        : 0;
                    episodeNumber = Math.max(publishedMax, draftMax) + 1;
                  }
                }
                const input: PublishEpisodeInput = {
                  showId,
                  title: trimmedTitle,
                  seasonNumber,
                  episodeNumber,
                  duration: 30,
                  videoUrl: "mock-url-published",
                  episodeType: episodeType,
                  ...(trailerForEpisodeNumber && { trailerForEpisodeNumber }),
                };
                const result = await publishEpisode(input);
                setPublishedResult(result);
                setDraftMeta(null); // Clear after publish
                setDraftCreated(null);
                if (currentDraft) {
                  removeDraftEpisode(currentDraft.id);
                  setCurrentDraft(null);
                }
              } catch {
                setPublishError("Failed to publish episode");
              }
            }}
            disabled={
              uploadStatus !== "success" ||
              !selectedShowId ||
              !episodeTitle.trim()
            }
          >
            <ThemedText>Publish Episode</ThemedText>
          </Pressable>
          {publishError && (
            <ThemedText style={styles.errorText}>{publishError}</ThemedText>
          )}
          {publishedResult && (
            <>
              <ThemedText>
                Published ✅ {publishedResult.episode.title}
              </ThemedText>
              <ThemedText>
                Published as S{publishedResult.episode.seasonNumber}E
                {publishedResult.episode.episodeNumber}
              </ThemedText>
              <Pressable
                style={styles.viewShowButton}
                onPress={() =>
                  router.push({
                    pathname: "/show/[id]",
                    params: {
                      id: publishedResult.show.id,
                      episodeId: publishedResult.episode.id,
                      fromContinue: "1",
                    },
                  })
                }
              >
                <ThemedText>View Show</ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>
      </ParallaxScrollView>
      {showDatePicker && (
        <Modal transparent={true} animationType="slide">
          <ThemedView style={styles.modalContainer}>
            <ThemedView
              style={[
                styles.pickerContainer,
                { backgroundColor: colorScheme === "dark" ? "#333" : "white" },
              ]}
            >
              <DateTimePicker
                value={nextDropDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                style={Platform.OS === "ios" ? { height: 216 } : undefined}
                themeVariant={colorScheme ?? "light"}
                textColor={colorScheme === "dark" ? "white" : "black"}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setNextDropDate(selectedDate);
                    if (currentDraft) {
                      updateDraftEpisode(currentDraft.id, {
                        nextDropIso: selectedDate.toISOString().slice(0, 10),
                      });
                    }
                  }
                }}
              />
              {Platform.OS === "ios" && (
                <Pressable
                  style={styles.doneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <ThemedText>Done</ThemedText>
                </Pressable>
              )}
            </ThemedView>
          </ThemedView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  backButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editingLabel: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
  section: {
    marginTop: 24,
  },
  permissionRow: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  recorderCard: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  recordButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  uploadButton: {
    padding: 12,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  templateRow: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  createDraftButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  createDraftEpisodeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,255,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  draftInfo: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    minHeight: 300,
  },
  doneButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 8,
  },
  createShowButton: {
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  publishButton: {
    padding: 12,
    backgroundColor: "rgba(255,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  viewShowButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  typeButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  typeText: {
    fontSize: 16,
  },
  typeTextSelected: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trailerBadge: {
    marginTop: 8,
    fontSize: 14,
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
  },
  sharedBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  sharedBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  shareButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
});
