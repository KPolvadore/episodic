import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";

type DraftScene = {
  id: string;
  title: string;
  createdAtIso: string;
};

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
  const [nextDropDate, setNextDropDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previouslyOnEpisodeIds, setPreviouslyOnEpisodeIds] = useState<
    string[]
  >([]);
  const [scenes, setScenes] = useState<DraftScene[]>([]);
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const [priorEpisodes, setPriorEpisodes] = useState<
    { id: string; title: string; seasonNumber: number; episodeNumber: number }[]
  >([]);
  const [publishedResult, setPublishedResult] = useState<{
    type: "episode";
    episode: any;
    show: any;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [currentDraft, setCurrentDraft] = useState<any>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveInFlightRef = useRef(false);
  const saveDebounceRef = useRef<number | null>(null);
  const hydrateTimerRef = useRef<number | null>(null);
  const allowAutoSaveRef = useRef(false);

  const getNextEpisodeNumber = useCallback(
    async (showId: string, seasonNumber: number) => {
      const existingPublished = await getShowEpisodes(showId);
      const seasonEpisodes = existingPublished.filter(
        (item) =>
          item.episode.seasonNumber === seasonNumber &&
          (item.episode as any).kind !== "trailer",
      );
      const publishedMax =
        seasonEpisodes.length > 0
          ? Math.max(
              ...seasonEpisodes.map((item) => item.episode.episodeNumber),
            )
          : 0;
      const existingDrafts = getDraftEpisodesByShowId(showId);
      const seasonDrafts = existingDrafts.filter(
        (d) => d.seasonNumber === seasonNumber && d.episodeType !== "trailer",
      );
      const draftMax =
        seasonDrafts.length > 0
          ? Math.max(...seasonDrafts.map((d) => d.episodeNumber))
          : 0;
      return Math.max(publishedMax, draftMax) + 1;
    },
    [getDraftEpisodesByShowId],
  );

  const createDraftFromState = useCallback(async (): Promise<boolean> => {
    if (saveInFlightRef.current || currentDraft) return false;
    if (!selectedShowId) return false;
    const trimmedTitle = episodeTitle.trim();
    if (!trimmedTitle) return false;
    if (typeof draftEpisodeId === "string") return false;

    saveInFlightRef.current = true;
    try {
      const nextEpisodeNumber = await getNextEpisodeNumber(selectedShowId, 1);
      const draftId = `draft-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      addDraftEpisode({
        id: draftId,
        showId: selectedShowId,
        title: trimmedTitle,
        seasonNumber: 1,
        episodeNumber: nextEpisodeNumber,
        hookTemplateId: selectedHookTemplateId,
        nextDropIso: nextDropDate
          ? nextDropDate.toISOString().slice(0, 10)
          : null,
        previouslyOnEpisodeIds,
        episodeType,
        scenes,
      });
      const createdDraft = getDraftEpisodeById(draftId);
      setCurrentDraft(
        createdDraft || {
          id: draftId,
          showId: selectedShowId,
          title: trimmedTitle,
          seasonNumber: 1,
          episodeNumber: nextEpisodeNumber,
          createdAtIso: new Date().toISOString(),
          updatedAtIso: new Date().toISOString(),
        },
      );
      return true;
    } finally {
      saveInFlightRef.current = false;
    }
  }, [
    addDraftEpisode,
    currentDraft,
    draftEpisodeId,
    episodeTitle,
    episodeType,
    getDraftEpisodeById,
    getNextEpisodeNumber,
    nextDropDate,
    previouslyOnEpisodeIds,
    scenes,
    selectedHookTemplateId,
    selectedShowId,
  ]);

  const maybeAutoSaveDraft = useCallback(async (): Promise<boolean> => {
    if (saveInFlightRef.current) return false;
    if (!selectedShowId) return false;
    const trimmedTitle = episodeTitle.trim();
    if (!trimmedTitle && !currentDraft) return false;

    if (currentDraft) {
      saveInFlightRef.current = true;
      const titleToSave = trimmedTitle || currentDraft.title;
      try {
        updateDraftEpisode(currentDraft.id, {
          title: titleToSave,
          hookTemplateId: selectedHookTemplateId,
          nextDropIso: nextDropDate
            ? nextDropDate.toISOString().slice(0, 10)
            : null,
          previouslyOnEpisodeIds,
          episodeType,
          scenes,
        });
        return true;
      } finally {
        saveInFlightRef.current = false;
      }
    }

    return await createDraftFromState();
  }, [
    createDraftFromState,
    currentDraft,
    episodeTitle,
    episodeType,
    nextDropDate,
    previouslyOnEpisodeIds,
    scenes,
    selectedHookTemplateId,
    selectedShowId,
    updateDraftEpisode,
  ]);

  const performAutoSave = useCallback(async () => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }
    if (typeof draftEpisodeId === "string" && !currentDraft) {
      setSaveState("idle");
      return;
    }
    setSaveState("saving");
    const didSave = await maybeAutoSaveDraft();
    if (didSave) {
      setLastSavedAt(new Date());
      setSaveState("saved");
    } else {
      setSaveState("idle");
    }
  }, [currentDraft, draftEpisodeId, maybeAutoSaveDraft]);

  useEffect(() => {
    if (!allowAutoSaveRef.current) return;
    if (!selectedShowId) return;
    if (!episodeTitle.trim() && !currentDraft) return;
    if (typeof draftEpisodeId === "string" && !currentDraft) return;
    setSaveState("saving");
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }
    saveDebounceRef.current = setTimeout(() => {
      void performAutoSave();
    }, 800);
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
        saveDebounceRef.current = null;
      }
    };
  }, [
    currentDraft,
    draftEpisodeId,
    episodeTitle,
    episodeType,
    nextDropDate,
    performAutoSave,
    previouslyOnEpisodeIds,
    scenes,
    selectedHookTemplateId,
    selectedShowId,
  ]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!allowAutoSaveRef.current) return;
        void performAutoSave();
      };
    }, [performAutoSave]),
  );

  useEffect(() => {
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
        saveDebounceRef.current = null;
      }
      if (hydrateTimerRef.current) {
        clearTimeout(hydrateTimerRef.current);
        hydrateTimerRef.current = null;
      }
    };
  }, []);

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
        allowAutoSaveRef.current = false;
        if (hydrateTimerRef.current) {
          clearTimeout(hydrateTimerRef.current);
        }
        setCurrentDraft(draft);
        setEpisodeTitle(draft.title);
        setSelectedHookTemplateId(draft.hookTemplateId || "cliffhanger");
        setNextDropDate(draft.nextDropIso ? new Date(draft.nextDropIso) : null);
        setPreviouslyOnEpisodeIds(draft.previouslyOnEpisodeIds || []);
        setEpisodeType(draft.episodeType || "episode");
        setScenes(draft.scenes || []);
        if (draft.updatedAtIso) {
          setLastSavedAt(new Date(draft.updatedAtIso));
          setSaveState("saved");
        }
        hydrateTimerRef.current = setTimeout(() => {
          allowAutoSaveRef.current = true;
          hydrateTimerRef.current = null;
        }, 0);
        return;
      }
    }
    allowAutoSaveRef.current = true;
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
          <ThemedView style={styles.titleRow}>
            <ThemedText type="title">Create Episode</ThemedText>
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
          <ThemedView style={styles.metaRow}>
            <ThemedText>
              {selectedShowId
                ? `For Show: ${selectedShowId}`
                : "No show selected"}
            </ThemedText>
            {saveState === "saving" && (
              <ThemedText style={styles.autoSavedText}>Saving…</ThemedText>
            )}
            {saveState === "saved" && lastSavedAt && (
              <ThemedText style={styles.autoSavedText}>
                Saved {lastSavedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            )}
          </ThemedView>
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
          <ThemedTextInput
            style={styles.textInput}
            placeholder="Episode title"
            value={episodeTitle}
            onChangeText={(text: string) => {
              setEpisodeTitle(text);
              if (titleError) setTitleError(null);
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
          <ThemedText type="subtitle">Scenes</ThemedText>
          <ThemedView style={styles.sceneRow}>
            <ThemedTextInput
              style={[styles.textInput, styles.sceneInput]}
              placeholder="Scene title"
              value={newSceneTitle}
              onChangeText={setNewSceneTitle}
            />
            <Pressable
              style={[
                styles.addSceneButton,
                !newSceneTitle.trim() && styles.disabled,
              ]}
              disabled={!newSceneTitle.trim()}
              onPress={() => {
                const title = newSceneTitle.trim();
                if (!title) return;
                const newScene: DraftScene = {
                  id: `scene-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,
                  title,
                  createdAtIso: new Date().toISOString(),
                };
                const nextScenes = [...scenes, newScene];
                setScenes(nextScenes);
                setNewSceneTitle("");
              }}
            >
              <ThemedText>Add</ThemedText>
            </Pressable>
          </ThemedView>

          {scenes.length === 0 ? (
            <ThemedText style={styles.helperText}>
              No scenes yet. Add your first scene.
            </ThemedText>
          ) : (
            scenes.map((scene, index) => (
              <ThemedView key={scene.id} style={styles.sceneItem}>
                <ThemedView style={styles.sceneInfo}>
                  <ThemedText>
                    {index + 1}. {scene.title}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.sceneActions}>
                  <Pressable
                    style={[
                      styles.sceneActionButton,
                      index === 0 && styles.disabled,
                    ]}
                    disabled={index === 0}
                    onPress={() => {
                      if (index === 0) return;
                      const nextScenes = scenes.slice();
                      const [moved] = nextScenes.splice(index, 1);
                      nextScenes.splice(index - 1, 0, moved);
                      setScenes(nextScenes);
                    }}
                  >
                    <ThemedText>Up</ThemedText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.sceneActionButton,
                      index === scenes.length - 1 && styles.disabled,
                    ]}
                    disabled={index === scenes.length - 1}
                    onPress={() => {
                      if (index === scenes.length - 1) return;
                      const nextScenes = scenes.slice();
                      const [moved] = nextScenes.splice(index, 1);
                      nextScenes.splice(index + 1, 0, moved);
                      setScenes(nextScenes);
                    }}
                  >
                    <ThemedText>Down</ThemedText>
                  </Pressable>
                  <Pressable
                    style={styles.sceneDeleteButton}
                    onPress={() => {
                      const nextScenes = scenes.filter(
                        (s) => s.id !== scene.id,
                      );
                      setScenes(nextScenes);
                    }}
                  >
                    <ThemedText style={styles.sceneDeleteText}>
                      Remove
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            ))
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.helperText}>
            {selectedShowId
              ? "Drafts auto-save as you edit."
              : "Select a show to enable auto-save."}
          </ThemedText>
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
                const draftFromId =
                  typeof draftEpisodeId === "string"
                    ? getDraftEpisodeById(draftEpisodeId)
                    : undefined;
                const draftToPublish = currentDraft ?? draftFromId;
                const showId = draftToPublish?.showId ?? selectedShowId;
                const seasonNumber = draftToPublish?.seasonNumber ?? 1;
                const draftToRemove = draftToPublish?.id;
                let episodeNumber: number;
                let trailerForEpisodeNumber: number | undefined;
                if (episodeType === "trailer") {
                  // Trailers always have episodeNumber = 0 and trailerForEpisodeNumber = 1 (or preserve existing)
                  episodeNumber = 0;
                  trailerForEpisodeNumber = draftToPublish?.episodeNumber ?? 1;
                } else {
                  // Regular episodes: calculate next number excluding trailers
                  if (draftToPublish) {
                    episodeNumber = draftToPublish.episodeNumber;
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
                if (currentDraft) {
                  removeDraftEpisode(currentDraft.id);
                  setCurrentDraft(null);
                } else if (draftToRemove) {
                  removeDraftEpisode(draftToRemove);
                }
                setEpisodeTitle("");
                setSelectedHookTemplateId("cliffhanger");
                setEpisodeType("episode");
                setNextDropDate(null);
                setPreviouslyOnEpisodeIds([]);
                setScenes([]);
                setLastSavedAt(null);
                setSaveState("idle");
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
    flexDirection: "column",
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  editingLabel: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
  autoSavedText: {
    fontSize: 12,
    color: "#4CAF50",
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
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  textInput: {
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
  sceneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  sceneInput: {
    flex: 1,
  },
  addSceneButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
  },
  sceneItem: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  sceneInfo: {
    marginBottom: 8,
  },
  sceneActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  sceneActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
  },
  sceneDeleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,0,0,0.1)",
    borderRadius: 6,
  },
  sceneDeleteText: {
    color: "#ff4d4d",
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
