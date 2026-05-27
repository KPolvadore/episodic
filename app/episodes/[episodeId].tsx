import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  getEpisodeDisplayNumber,
  getEpisodeHookLabel,
  hasEpisodeRecap,
  normalizeEpisodeRecap,
  getEpisodeVideoStatusLabel,
  isValidEpisodeNumber,
} from "@/models/episode";
import type { Episode, EpisodeHookType } from "@/types/episode";
import type { EpisodePoll, EpisodePollOption } from "@/types/episodePoll";

type EpisodeDetailParams = {
  description?: string;
  episodeId?: string;
  episodeNumber?: string;
  hookType?: EpisodeHookType;
  recapText?: string;
  seasonNumber?: string;
  showCategory?: string;
  showDescription?: string;
  showId?: string;
  showTitle?: string;
  showVisibility?: string;
  title?: string;
  videoUrl?: string;
};

const fallbackEpisode: Pick<
  Episode,
  "seasonNumber" | "episodeNumber" | "hookType"
> = {
  episodeNumber: 1,
  hookType: "none",
  seasonNumber: 1,
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(value: string | string[] | undefined, fallback: number) {
  const numberValue = Number(getParamValue(value));

  return isValidEpisodeNumber(numberValue) ? numberValue : fallback;
}

function getHookTypeParam(value: string | string[] | undefined) {
  const hookType = getParamValue(value);

  switch (hookType) {
    case "question":
    case "poll":
    case "cliffhanger":
    case "challenge":
    case "reveal":
      return hookType;
    default:
      return fallbackEpisode.hookType;
  }
}

export default function EpisodeDetailScreen() {
  const params = useLocalSearchParams<EpisodeDetailParams>();
  const [isRecapCollapsed, setIsRecapCollapsed] = useState(false);
  const [selectedPollOptionId, setSelectedPollOptionId] = useState<
    EpisodePollOption["id"] | null
  >(null);
  const [hasSubmittedLocalVote, setHasSubmittedLocalVote] = useState(false);

  const title = getParamValue(params.title) ?? "Untitled Episode";
  const description =
    getParamValue(params.description) ?? "Episode details are coming soon.";
  const showId = getParamValue(params.showId) ?? "unknown-show";
  const showCategory = getParamValue(params.showCategory) ?? "other";
  const showTitle = getParamValue(params.showTitle) ?? "Parent Show";
  const showDescription = getParamValue(params.showDescription) ?? "";
  const showVisibility = getParamValue(params.showVisibility) ?? "private";
  const videoUrl = getParamValue(params.videoUrl);
  const episodeNumber = getNumberParam(
    params.episodeNumber,
    fallbackEpisode.episodeNumber,
  );
  const seasonNumber = getNumberParam(
    params.seasonNumber,
    fallbackEpisode.seasonNumber,
  );
  const hookType = getHookTypeParam(params.hookType);
  const recapText = normalizeEpisodeRecap(getParamValue(params.recapText));
  const shouldShowPreviouslyOn = hasEpisodeRecap(recapText);
  const videoStatusLabel = getEpisodeVideoStatusLabel(videoUrl);
  const localPollOptions: EpisodePollOption[] = [
    {
      id: `${showId}-${params.episodeId ?? "episode"}-poll-option-1`,
      label: "Reveal a secret clue in the final scene",
      order: 1,
    },
    {
      id: `${showId}-${params.episodeId ?? "episode"}-poll-option-2`,
      label: "End on a cliffhanger with a surprise visitor",
      order: 2,
    },
  ];
  const localEpisodePoll: EpisodePoll = {
    id: `${showId}-${params.episodeId ?? "episode"}-poll`,
    episodeId: params.episodeId ?? "episode-detail-local",
    question: "What should happen next in this Show?",
    options: localPollOptions,
    isActive: true,
    createdAt: "2026-05-26T00:00:00.000Z",
    updatedAt: "2026-05-26T00:00:00.000Z",
  };
  const canSubmitVote =
    localEpisodePoll.isActive &&
    !hasSubmittedLocalVote &&
    selectedPollOptionId !== null;
  const selectedPollOptionLabel =
    localEpisodePoll.options.find((option) => option.id === selectedPollOptionId)
      ?.label ?? null;
  const localResultVoteCounts: Record<EpisodePollOption["id"], number> = {
    [localPollOptions[0].id]:
      selectedPollOptionId === localPollOptions[0].id ? 7 : 6,
    [localPollOptions[1].id]:
      selectedPollOptionId === localPollOptions[1].id ? 7 : 6,
  };
  const totalLocalResultVotes = Object.values(localResultVoteCounts).reduce(
    (totalVotes, voteCount) => totalVotes + voteCount,
    0,
  );

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {shouldShowPreviouslyOn ? (
          <ThemedView variant="card" style={styles.previouslyOnCard}>
            <View style={styles.previouslyOnHeader}>
              <ThemedText variant="caption" style={styles.mutedText}>
                Previously On
              </ThemedText>
              <Pressable
                onPress={() => {
                  setIsRecapCollapsed((currentValue) => !currentValue);
                }}
                style={styles.recapToggleButton}
              >
                <ThemedText variant="caption" style={styles.recapToggleText}>
                  {isRecapCollapsed ? "Show recap" : "Hide recap"}
                </ThemedText>
              </Pressable>
            </View>
            {!isRecapCollapsed ? (
              <ThemedText variant="body">{recapText}</ThemedText>
            ) : (
              <ThemedText variant="caption" style={styles.mutedText}>
                Recap hidden.
              </ThemedText>
            )}
            <ThemedText variant="caption" style={styles.mutedText}>
              Recap shown before episode playback in this local preview.
            </ThemedText>
            <Pressable style={styles.continueToEpisodeButton}>
              <ThemedText variant="caption" style={styles.continueToEpisodeText}>
                Continue to episode
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        <View style={styles.videoPlaceholder}>
          <ThemedText variant="subtitle">Video placeholder</ThemedText>
          <ThemedText variant="caption" style={styles.mutedText}>
            {videoStatusLabel}
          </ThemedText>
          <ThemedText variant="caption" style={styles.mutedText}>
            Real upload and playback will be connected later.
          </ThemedText>
        </View>

        <View style={styles.header}>
          <ThemedText variant="caption" style={styles.episodeNumber}>
            {getEpisodeDisplayNumber({ episodeNumber, seasonNumber })}
          </ThemedText>
          <ThemedText variant="title">{title}</ThemedText>
          <ThemedText variant="body" style={styles.description}>
            {description}
          </ThemedText>
        </View>

        <ThemedView variant="card" style={styles.detailCard}>
          <View style={styles.detailRow}>
            <ThemedText variant="caption">Hook</ThemedText>
            <ThemedText variant="body" style={styles.detailValue}>
              {getEpisodeHookLabel(hookType)}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText variant="caption">Video status</ThemedText>
            <ThemedText variant="body" style={styles.detailValue}>
              {videoStatusLabel}
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView variant="card" style={styles.pollCard}>
          <ThemedText variant="caption" style={styles.mutedText}>
            Episode Poll
          </ThemedText>
          <ThemedText variant="subtitle">{localEpisodePoll.question}</ThemedText>
          <ThemedText variant="caption" style={styles.pollStatus}>
            Status: {localEpisodePoll.isActive ? "Active" : "Inactive"}
          </ThemedText>
          <View style={styles.pollOptions}>
            {localEpisodePoll.options.map((option) => (
              <Pressable
                accessibilityState={{
                  disabled: hasSubmittedLocalVote || !localEpisodePoll.isActive,
                  selected: selectedPollOptionId === option.id,
                }}
                disabled={hasSubmittedLocalVote || !localEpisodePoll.isActive}
                key={option.id}
                onPress={() => setSelectedPollOptionId(option.id)}
                style={[
                  styles.pollOption,
                  selectedPollOptionId === option.id
                    ? styles.selectedPollOption
                    : null,
                  hasSubmittedLocalVote || !localEpisodePoll.isActive
                    ? styles.disabledPollOption
                    : null,
                ]}
              >
                <ThemedText
                  variant="body"
                  style={
                    selectedPollOptionId === option.id
                      ? styles.selectedPollOptionText
                      : undefined
                  }
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityState={{ disabled: !canSubmitVote }}
            disabled={!canSubmitVote}
            onPress={() => {
              if (!canSubmitVote) {
                return;
              }

              setHasSubmittedLocalVote(true);
            }}
            style={[
              styles.voteButton,
              !canSubmitVote ? styles.disabledVoteButton : null,
            ]}
          >
            <ThemedText variant="body" style={styles.voteButtonText}>
              {hasSubmittedLocalVote ? "Vote Submitted (Local)" : "Submit Vote"}
            </ThemedText>
          </Pressable>
          {hasSubmittedLocalVote && selectedPollOptionLabel ? (
            <ThemedText variant="caption" style={styles.pollStatus}>
              Your local vote is locked on: {selectedPollOptionLabel}
            </ThemedText>
          ) : null}
          {hasSubmittedLocalVote ? (
            <View style={styles.resultsSection}>
              <ThemedText variant="caption" style={styles.mutedText}>
                Local Demo Results
              </ThemedText>
              {localEpisodePoll.options.map((option) => {
                const voteCount = localResultVoteCounts[option.id] ?? 0;
                const votePercentage =
                  totalLocalResultVotes > 0
                    ? Math.round((voteCount / totalLocalResultVotes) * 100)
                    : 0;
                const isSelectedOption = selectedPollOptionId === option.id;

                return (
                  <View key={`result-${option.id}`} style={styles.resultRow}>
                    <View style={styles.resultRowHeader}>
                      <ThemedText variant="body">
                        {option.label}
                        {isSelectedOption ? " (Your vote)" : ""}
                      </ThemedText>
                      <ThemedText variant="caption" style={styles.pollStatus}>
                        {voteCount} votes · {votePercentage}%
                      </ThemedText>
                    </View>
                    <View style={styles.resultTrack}>
                      <View
                        style={[
                          styles.resultFill,
                          { width: `${votePercentage}%` },
                          isSelectedOption ? styles.selectedResultFill : null,
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
          <ThemedText variant="caption" style={styles.mutedText}>
            Voting is local to this screen for now and will be connected to
            account support later. Results shown here are temporary local demo
            values only.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.showCard}>
          <ThemedText variant="caption" style={styles.mutedText}>
            Parent Show
          </ThemedText>
          <ThemedText variant="subtitle">{showTitle}</ThemedText>
          {showDescription ? (
            <ThemedText variant="body" style={styles.description}>
              {showDescription}
            </ThemedText>
          ) : null}
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/shows/[showId]",
                params: {
                  category: showCategory,
                  description: showDescription,
                  showId,
                  title: showTitle,
                  visibility: showVisibility,
                },
              });
            }}
            style={styles.showButton}
          >
            <ThemedText variant="body" style={styles.showButtonText}>
              Back to Show
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
  },
  continueToEpisodeButton: {
    alignItems: "center",
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  continueToEpisodeText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  description: {
    color: theme.colors.text.secondary,
  },
  detailCard: {
    gap: theme.spacing.md,
  },
  detailRow: {
    gap: theme.spacing.xs,
  },
  detailValue: {
    color: theme.colors.brand.secondary,
  },
  episodeNumber: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  header: {
    gap: theme.spacing.md,
  },
  mutedText: {
    color: theme.colors.text.muted,
  },
  pollCard: {
    gap: theme.spacing.md,
  },
  previouslyOnCard: {
    gap: theme.spacing.sm,
  },
  previouslyOnHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recapToggleButton: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  recapToggleText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  pollOption: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  disabledPollOption: {
    opacity: 0.65,
  },
  pollOptions: {
    gap: theme.spacing.sm,
  },
  pollStatus: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  selectedPollOption: {
    borderColor: theme.colors.brand.primary,
    borderWidth: 2,
  },
  selectedPollOptionText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.medium,
  },
  resultFill: {
    backgroundColor: theme.colors.brand.secondary,
    borderRadius: theme.radius.pill,
    height: "100%",
  },
  resultRow: {
    gap: theme.spacing.xs,
  },
  resultRowHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultsSection: {
    gap: theme.spacing.sm,
  },
  resultTrack: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 10,
    overflow: "hidden",
  },
  selectedResultFill: {
    backgroundColor: theme.colors.brand.primary,
  },
  disabledVoteButton: {
    opacity: 0.5,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  showButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  showButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  showCard: {
    gap: theme.spacing.md,
  },
  voteButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  voteButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  videoPlaceholder: {
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    height: 220,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
});
