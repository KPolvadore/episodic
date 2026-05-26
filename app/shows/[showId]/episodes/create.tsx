import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  episodeHookOptions,
  getDefaultCreateEpisodeInput,
  getEpisodeDisplayNumber,
  getEpisodeVideoStatusLabel,
  isValidEpisodeNumber,
  isValidEpisodeTitle,
  normalizeEpisodeTitle,
} from "@/models/episode";
import type { EpisodeHookType } from "@/types/episode";
import type { CreateEpisodePollInput, EpisodePollOption } from "@/types/episodePoll";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type CreateEpisodeParams = {
  category?: ShowCategory;
  description?: string;
  showId?: string;
  title?: string;
  visibility?: ShowVisibility;
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberInputValue(value: number) {
  return Number.isFinite(value) ? String(value) : "";
}

function parsePositiveInteger(value: string) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

export default function CreateEpisodeScreen() {
  const params = useLocalSearchParams<CreateEpisodeParams>();
  const showId = getParamValue(params.showId) ?? "unknown-show";
  const showTitle = getParamValue(params.title) ?? "Untitled Show";
  const defaultEpisodeInput = useMemo(
    () => getDefaultCreateEpisodeInput(showId),
    [showId],
  );

  const [title, setTitle] = useState(defaultEpisodeInput.title);
  const [description, setDescription] = useState(
    defaultEpisodeInput.description ?? "",
  );
  const [seasonNumber, setSeasonNumber] = useState(
    defaultEpisodeInput.seasonNumber,
  );
  const [episodeNumber, setEpisodeNumber] = useState(
    defaultEpisodeInput.episodeNumber,
  );
  const [hookType, setHookType] = useState<EpisodeHookType>(
    defaultEpisodeInput.hookType ?? "none",
  );
  const [videoUrl, setVideoUrl] = useState(defaultEpisodeInput.videoUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    defaultEpisodeInput.thumbnailUrl ?? "",
  );
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<EpisodePollOption[]>([
    { id: "local-poll-option-1", label: "", order: 1 },
    { id: "local-poll-option-2", label: "", order: 2 },
  ]);
  const [isPollActive, setIsPollActive] = useState(true);

  const normalizedTitle = useMemo(() => normalizeEpisodeTitle(title), [title]);
  const trimmedPollQuestion = pollQuestion.trim();
  const nonEmptyPollOptions = pollOptions.filter(
    (option) => option.label.trim().length > 0,
  );
  const hasAnyPollOptionInput = pollOptions.some(
    (option) => option.label.trim().length > 0,
  );
  const pollQuestionRequiredError =
    hasAnyPollOptionInput && trimmedPollQuestion.length === 0;
  const minimumPollOptionsError =
    trimmedPollQuestion.length > 0 && nonEmptyPollOptions.length < 2;
  const pollDraftInput: CreateEpisodePollInput | null =
    trimmedPollQuestion.length > 0 && nonEmptyPollOptions.length >= 2
      ? {
          episodeId: "local-draft-episode",
          question: trimmedPollQuestion,
          options: nonEmptyPollOptions.map((option, index) => ({
            label: option.label.trim(),
            order: index + 1,
          })),
          isActive: isPollActive,
        }
      : null;
  const canSubmit =
    isValidEpisodeTitle(title) &&
    isValidEpisodeNumber(seasonNumber) &&
    isValidEpisodeNumber(episodeNumber);
  const videoStatusLabel = getEpisodeVideoStatusLabel(videoUrl);

  const updatePollOption = (optionId: string, nextLabel: string) => {
    setPollOptions((currentOptions) =>
      currentOptions.map((option) =>
        option.id === optionId ? { ...option, label: nextLabel } : option,
      ),
    );
  };

  const addPollOption = () => {
    setPollOptions((currentOptions) => [
      ...currentOptions,
      {
        id: `local-poll-option-${currentOptions.length + 1}`,
        label: "",
        order: currentOptions.length + 1,
      },
    ]);
  };

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title">Create Episode</ThemedText>
          <ThemedText variant="body" style={styles.helperText}>
            Add a local Episode draft for {showTitle}. Saving will be connected
            later.
          </ThemedText>
        </View>

        <ThemedView variant="card" style={styles.form}>
          <View style={styles.field}>
            <ThemedText variant="subtitle">Episode title</ThemedText>
            <TextInput
              onChangeText={setTitle}
              placeholder="Name this episode"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={title}
            />
            {!isValidEpisodeTitle(title) ? (
              <ThemedText variant="caption" style={styles.validationText}>
                A title is required before this can be created.
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Description</ThemedText>
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="What happens in this episode?"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, styles.descriptionInput]}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <View style={styles.numberRow}>
            <View style={[styles.field, styles.numberField]}>
              <ThemedText variant="subtitle">Season</ThemedText>
              <TextInput
                keyboardType="number-pad"
                onChangeText={(value) =>
                  setSeasonNumber(parsePositiveInteger(value))
                }
                placeholder="1"
                placeholderTextColor={theme.colors.text.muted}
                style={styles.input}
                value={getNumberInputValue(seasonNumber)}
              />
            </View>

            <View style={[styles.field, styles.numberField]}>
              <ThemedText variant="subtitle">Episode</ThemedText>
              <TextInput
                keyboardType="number-pad"
                onChangeText={(value) =>
                  setEpisodeNumber(parsePositiveInteger(value))
                }
                placeholder="1"
                placeholderTextColor={theme.colors.text.muted}
                style={styles.input}
                value={getNumberInputValue(episodeNumber)}
              />
            </View>
          </View>

          {!isValidEpisodeNumber(seasonNumber) ||
          !isValidEpisodeNumber(episodeNumber) ? (
            <ThemedText variant="caption" style={styles.validationText}>
              Season and episode numbers must be positive whole numbers.
            </ThemedText>
          ) : null}

          <View style={styles.field}>
            <ThemedText variant="subtitle">Hook type</ThemedText>
            <View style={styles.optionWrap}>
              {episodeHookOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setHookType(option.value)}
                  style={[
                    styles.option,
                    option.value === hookType ? styles.selectedOption : null,
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.optionText,
                      option.value === hookType
                        ? styles.selectedOptionText
                        : null,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Video URL</ThemedText>
            <TextInput
              autoCapitalize="none"
              onChangeText={setVideoUrl}
              placeholder="Video placeholder URL"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={videoUrl}
            />
            <ThemedText variant="caption" style={styles.helperText}>
              {videoStatusLabel}. Real upload and playback will be connected
              later.
            </ThemedText>
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Thumbnail URL</ThemedText>
            <TextInput
              autoCapitalize="none"
              onChangeText={setThumbnailUrl}
              placeholder="Thumbnail placeholder URL"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={thumbnailUrl}
            />
            <ThemedText variant="caption" style={styles.helperText}>
              Thumbnail values stay local until media storage is added later.
            </ThemedText>
          </View>

          <View style={styles.pollSection}>
            <ThemedText variant="subtitle">Episode poll (optional)</ThemedText>
            <ThemedText variant="caption" style={styles.helperText}>
              Draft a poll for what happens next. Poll saving and viewer voting
              will be connected later.
            </ThemedText>

            <View style={styles.field}>
              <ThemedText variant="subtitle">Poll question</ThemedText>
              <TextInput
                onChangeText={setPollQuestion}
                placeholder="What should happen next?"
                placeholderTextColor={theme.colors.text.muted}
                style={styles.input}
                value={pollQuestion}
              />
              {pollQuestionRequiredError ? (
                <ThemedText variant="caption" style={styles.validationText}>
                  Poll question is required when poll options are entered.
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText variant="subtitle">Poll options</ThemedText>
              {pollOptions.map((option, index) => (
                <TextInput
                  key={option.id}
                  onChangeText={(value) => updatePollOption(option.id, value)}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={theme.colors.text.muted}
                  style={styles.input}
                  value={option.label}
                />
              ))}
              {minimumPollOptionsError ? (
                <ThemedText variant="caption" style={styles.validationText}>
                  Add at least two non-empty options for this poll.
                </ThemedText>
              ) : (
                <ThemedText variant="caption" style={styles.helperText}>
                  Add at least two options if you want this Episode to include a
                  poll.
                </ThemedText>
              )}
            </View>

            <Pressable onPress={addPollOption} style={styles.secondaryButton}>
              <ThemedText variant="caption" style={styles.secondaryButtonText}>
                Add another option
              </ThemedText>
            </Pressable>

            <View style={styles.field}>
              <ThemedText variant="subtitle">Poll status</ThemedText>
              <View style={styles.optionWrap}>
                <Pressable
                  onPress={() => setIsPollActive(true)}
                  style={[
                    styles.option,
                    isPollActive ? styles.selectedOption : null,
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.optionText,
                      isPollActive ? styles.selectedOptionText : null,
                    ]}
                  >
                    Active
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setIsPollActive(false)}
                  style={[
                    styles.option,
                    !isPollActive ? styles.selectedOption : null,
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.optionText,
                      !isPollActive ? styles.selectedOptionText : null,
                    ]}
                  >
                    Inactive
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </ThemedView>

        <ThemedView variant="card" style={styles.preview}>
          <ThemedText variant="subtitle">Local preview</ThemedText>
          <ThemedText variant="caption" style={styles.episodeNumber}>
            {getEpisodeDisplayNumber({ episodeNumber, seasonNumber })}
          </ThemedText>
          <ThemedText variant="body">
            {normalizedTitle || "Untitled Episode"}
          </ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            {description || "No description yet."}
          </ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            This form is UI-only and does not update the Show detail list yet.
          </ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            {pollDraftInput
              ? `Poll draft ready with ${pollDraftInput.options.length} option(s).`
              : "Poll draft is optional and remains local only for now."}
          </ThemedText>
        </ThemedView>

        <Pressable
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          style={[styles.submitButton, !canSubmit ? styles.disabledButton : null]}
        >
          <ThemedText variant="body" style={styles.submitText}>
            Create Episode Later
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
  },
  descriptionInput: {
    minHeight: 112,
  },
  disabledButton: {
    opacity: 0.44,
  },
  episodeNumber: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  field: {
    gap: theme.spacing.sm,
  },
  form: {
    gap: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.sm,
  },
  helperText: {
    color: theme.colors.text.secondary,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.lineHeight.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  numberField: {
    flex: 1,
  },
  numberRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  option: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  optionText: {
    color: theme.colors.text.secondary,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  preview: {
    gap: theme.spacing.sm,
  },
  pollSection: {
    borderColor: theme.colors.border.subtle,
    borderTopWidth: 1,
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  secondaryButton: {
    alignSelf: "flex-start",
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  selectedOption: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  selectedOptionText: {
    color: theme.colors.text.primary,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  submitText: {
    fontWeight: theme.typography.weight.bold,
  },
  validationText: {
    color: theme.colors.state.warning,
  },
});
