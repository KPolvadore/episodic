import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  getWritersRoomMemberStatusLabel,
  getWritersRoomRoleLabel,
  writersRoomMemberStatusOptions,
  writersRoomRoleOptions,
} from "@/models/collaboration";
import {
  getDefaultCreateWritersRoomDraftInput,
  getDefaultCreateWritersRoomSceneInput,
  getNextWritersRoomSceneOrder,
  getWritersRoomDraftDisplayTarget,
  getWritersRoomDraftStatusLabel,
  getWritersRoomDraftTypeLabel,
  getWritersRoomSceneTypeLabel,
  isValidWritersRoomDraftTitle,
  normalizeWritersRoomDraftTitle,
  sortWritersRoomScenesByOrder,
  writersRoomDraftStatusOptions,
  writersRoomDraftTypeOptions,
  writersRoomSceneTypeOptions,
} from "@/models/writersRoomDraft";
import type { WritersRoomMember, WritersRoomRole } from "@/types/collaboration";
import type {
  CreateWritersRoomDraftInput,
  CreateWritersRoomSceneInput,
  WritersRoomDraft,
  WritersRoomScene,
} from "@/types/writersRoomDraft";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type WritersRoomParams = {
  category?: ShowCategory;
  description?: string;
  showId?: string;
  title?: string;
  visibility?: ShowVisibility;
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getTemporaryMembers(showId: string): WritersRoomMember[] {
  return [
    {
      id: `${showId}-member-1`,
      invitedAt: "2026-05-27T10:00:00.000Z",
      joinedAt: "2026-05-27T10:05:00.000Z",
      removedAt: null,
      role: "owner",
      showId,
      status: "active",
      userId: "local-owner-user",
      writersRoomId: `${showId}-writers-room`,
    },
    {
      id: `${showId}-member-2`,
      invitedAt: "2026-05-27T10:10:00.000Z",
      joinedAt: null,
      removedAt: null,
      role: "editor",
      showId,
      status: "invited",
      userId: "local-editor-user",
      writersRoomId: `${showId}-writers-room`,
    },
  ];
}

function getTemporaryDrafts(showId: string): WritersRoomDraft[] {
  return [
    {
      createdAt: "2026-05-27T11:00:00.000Z",
      createdByUserId: "local-owner-user",
      draftType: "episodePlan",
      id: `${showId}-draft-1`,
      showId,
      status: "inReview",
      summary:
        "The crew traces a signal through three locations before discovering the source is inside their own studio archive.",
      targetEpisodeNumber: 3,
      targetSeasonNumber: 1,
      title: "Archive Signal Episode Plan",
      updatedAt: "2026-05-27T11:15:00.000Z",
      writersRoomId: `${showId}-writers-room`,
    },
    {
      createdAt: "2026-05-27T11:20:00.000Z",
      createdByUserId: "local-editor-user",
      draftType: "storyArc",
      id: `${showId}-draft-2`,
      showId,
      status: "idea",
      summary:
        "Build a mid-season trust arc where each episode reveals one hidden motive behind the host's investigation.",
      targetEpisodeNumber: null,
      targetSeasonNumber: null,
      title: "Mid-season Trust Arc",
      updatedAt: "2026-05-27T11:26:00.000Z",
      writersRoomId: `${showId}-writers-room`,
    },
  ];
}

function getTemporaryScenes(showId: string): WritersRoomScene[] {
  return [
    {
      createdAt: "2026-05-27T11:02:00.000Z",
      createdByUserId: "local-owner-user",
      description:
        "Open on the host replaying the previous episode's last line while pinning new clues on the wall.",
      draftId: `${showId}-draft-1`,
      id: `${showId}-draft-1-scene-2`,
      order: 2,
      sceneType: "setup",
      title: "Evidence Wall Reset",
      updatedAt: "2026-05-27T11:02:00.000Z",
    },
    {
      createdAt: "2026-05-27T11:01:00.000Z",
      createdByUserId: "local-owner-user",
      description:
        "A short cold open in the archive hallway introduces the unknown signal before the title card.",
      draftId: `${showId}-draft-1`,
      id: `${showId}-draft-1-scene-1`,
      order: 1,
      sceneType: "intro",
      title: "Cold Open: Archive Hallway",
      updatedAt: "2026-05-27T11:01:00.000Z",
    },
    {
      createdAt: "2026-05-27T11:03:00.000Z",
      createdByUserId: "local-editor-user",
      description:
        "The team realizes the signal map points back to a locked room they already cleared.",
      draftId: `${showId}-draft-1`,
      id: `${showId}-draft-1-scene-3`,
      order: 3,
      sceneType: "reveal",
      title: "Signal Loop Reveal",
      updatedAt: "2026-05-27T11:03:00.000Z",
    },
    {
      createdAt: "2026-05-27T11:22:00.000Z",
      createdByUserId: "local-editor-user",
      description:
        "A private aside hints that one teammate is withholding an old case connection.",
      draftId: `${showId}-draft-2`,
      id: `${showId}-draft-2-scene-1`,
      order: 1,
      sceneType: "conflict",
      title: "Private Motive Hint",
      updatedAt: "2026-05-27T11:22:00.000Z",
    },
  ];
}

const roleDisplayOrder: WritersRoomRole[] = [
  "owner",
  "coCreator",
  "editor",
  "contributor",
  "viewer",
];

export default function WritersRoomScreen() {
  const params = useLocalSearchParams<WritersRoomParams>();

  const showId = getParamValue(params.showId) ?? "unknown-show";
  const showTitle = getParamValue(params.title) ?? "Untitled Show";
  const showDescription =
    getParamValue(params.description) ?? "Show details are coming soon.";
  const showCategory = getParamValue(params.category) ?? "other";
  const showVisibility = getParamValue(params.visibility) ?? "private";

  const members = getTemporaryMembers(showId);
  const drafts = getTemporaryDrafts(showId);
  const scenes = getTemporaryScenes(showId);
  const [createDraftInput, setCreateDraftInput] = useState<CreateWritersRoomDraftInput>(
    getDefaultCreateWritersRoomDraftInput({
      createdByUserId: "local-owner-user",
      showId,
      writersRoomId: `${showId}-writers-room`,
    }),
  );
  const [createDraftError, setCreateDraftError] = useState<string | null>(null);
  const [createDraftResult, setCreateDraftResult] = useState<string | null>(null);
  const [createSceneInput, setCreateSceneInput] = useState<CreateWritersRoomSceneInput>(
    getDefaultCreateWritersRoomSceneInput({
      createdByUserId: "local-owner-user",
      draftId: drafts[0]?.id ?? `${showId}-draft-1`,
      order: getNextWritersRoomSceneOrder(scenes),
    }),
  );
  const [createSceneError, setCreateSceneError] = useState<string | null>(null);
  const [createSceneResult, setCreateSceneResult] = useState<string | null>(null);

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView variant="card" style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Room Overview</ThemedText>
            <ThemedText variant="caption" style={styles.previewLabel}>
              UI-only preview
            </ThemedText>
          </View>
          <ThemedText variant="title">{showTitle} Writers Room</ThemedText>
          <ThemedText variant="body" style={styles.secondaryText}>
            {showDescription}
          </ThemedText>
          <ThemedText variant="caption" style={styles.secondaryText}>
            Show ID: {showId}
          </ThemedText>
          <ThemedText variant="caption" style={styles.secondaryText}>
            Category: {showCategory}
          </ThemedText>
          <ThemedText variant="caption" style={styles.secondaryText}>
            Visibility: {showVisibility}
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.section}>
          <ThemedText variant="subtitle">Collaborators</ThemedText>
          <View style={styles.list}>
            {members.map((member) => (
              <View key={member.id} style={styles.item}>
                <ThemedText variant="body" style={styles.itemTitle}>
                  {member.userId}
                </ThemedText>
                <ThemedText variant="caption" style={styles.secondaryText}>
                  {getWritersRoomRoleLabel(member.role)} · {getWritersRoomMemberStatusLabel(member.status)}
                </ThemedText>
              </View>
            ))}
          </View>
          <ThemedText variant="caption" style={styles.helperText}>
            Collaborator invitations, identity, and persistence are placeholders and
            will be connected later.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.section}>
          <ThemedText variant="subtitle">Roles</ThemedText>
          <View style={styles.list}>
            {roleDisplayOrder.map((role) => (
              <ThemedText key={role} variant="body" style={styles.secondaryText}>
                {getWritersRoomRoleLabel(role)}
              </ThemedText>
            ))}
          </View>
          <ThemedText variant="caption" style={styles.helperText}>
            Role behavior and permissions are not enforced yet.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Create Draft</ThemedText>
            <ThemedText variant="caption" style={styles.previewLabel}>
              UI-only local form
            </ThemedText>
          </View>
          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Draft title *
            </ThemedText>
            <TextInput
              onChangeText={(value) => {
                setCreateDraftInput((currentValue) => ({
                  ...currentValue,
                  title: value,
                }));
                setCreateDraftError(null);
                setCreateDraftResult(null);
              }}
              placeholder="Enter draft title"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={createDraftInput.title}
            />
          </View>

          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Summary
            </ThemedText>
            <TextInput
              multiline
              onChangeText={(value) => {
                setCreateDraftInput((currentValue) => ({
                  ...currentValue,
                  summary: value,
                }));
                setCreateDraftResult(null);
              }}
              placeholder="Add a short planning summary"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, styles.multilineInput]}
              textAlignVertical="top"
              value={createDraftInput.summary ?? ""}
            />
          </View>

          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Draft type
            </ThemedText>
            <View style={styles.optionWrap}>
              {writersRoomDraftTypeOptions.map((draftType) => {
                const isSelected = createDraftInput.draftType === draftType;

                return (
                  <Pressable
                    key={draftType}
                    onPress={() => {
                      setCreateDraftInput((currentValue) => ({
                        ...currentValue,
                        draftType,
                      }));
                      setCreateDraftResult(null);
                    }}
                    style={[
                      styles.optionPill,
                      isSelected ? styles.optionPillSelected : styles.optionPillDefault,
                    ]}
                  >
                    <ThemedText variant="caption" style={styles.optionPillText}>
                      {getWritersRoomDraftTypeLabel(draftType)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Draft status
            </ThemedText>
            <View style={styles.optionWrap}>
              {writersRoomDraftStatusOptions.map((status) => {
                const isSelected = createDraftInput.status === status;

                return (
                  <Pressable
                    key={status}
                    onPress={() => {
                      setCreateDraftInput((currentValue) => ({
                        ...currentValue,
                        status,
                      }));
                      setCreateDraftResult(null);
                    }}
                    style={[
                      styles.optionPill,
                      isSelected ? styles.optionPillSelected : styles.optionPillDefault,
                    ]}
                  >
                    <ThemedText variant="caption" style={styles.optionPillText}>
                      {getWritersRoomDraftStatusLabel(status)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.numberRow}>
            <View style={[styles.formField, styles.numberField]}>
              <ThemedText variant="caption" style={styles.secondaryText}>
                Target season
              </ThemedText>
              <TextInput
                keyboardType="number-pad"
                onChangeText={(value) => {
                  const parsedValue = Number.parseInt(value, 10);
                  setCreateDraftInput((currentValue) => ({
                    ...currentValue,
                    targetSeasonNumber:
                      Number.isInteger(parsedValue) && parsedValue > 0
                        ? parsedValue
                        : null,
                  }));
                  setCreateDraftResult(null);
                }}
                placeholder="e.g. 1"
                placeholderTextColor={theme.colors.text.muted}
                style={styles.input}
                value={createDraftInput.targetSeasonNumber?.toString() ?? ""}
              />
            </View>
            <View style={[styles.formField, styles.numberField]}>
              <ThemedText variant="caption" style={styles.secondaryText}>
                Target episode
              </ThemedText>
              <TextInput
                keyboardType="number-pad"
                onChangeText={(value) => {
                  const parsedValue = Number.parseInt(value, 10);
                  setCreateDraftInput((currentValue) => ({
                    ...currentValue,
                    targetEpisodeNumber:
                      Number.isInteger(parsedValue) && parsedValue > 0
                        ? parsedValue
                        : null,
                  }));
                  setCreateDraftResult(null);
                }}
                placeholder="e.g. 3"
                placeholderTextColor={theme.colors.text.muted}
                style={styles.input}
                value={createDraftInput.targetEpisodeNumber?.toString() ?? ""}
              />
            </View>
          </View>

          <Pressable
            onPress={() => {
              const normalizedTitle = normalizeWritersRoomDraftTitle(
                createDraftInput.title,
              );

              if (!isValidWritersRoomDraftTitle(normalizedTitle)) {
                setCreateDraftError("Draft title is required.");
                setCreateDraftResult(null);
                return;
              }

              setCreateDraftInput((currentValue) => ({
                ...currentValue,
                title: normalizedTitle,
              }));
              setCreateDraftError(null);
              setCreateDraftResult(
                "Draft saved locally for preview only. Persistence will be connected later.",
              );
            }}
            style={styles.saveDraftButton}
          >
            <ThemedText variant="body" style={styles.saveDraftButtonText}>
              Save Draft (UI-only)
            </ThemedText>
          </Pressable>

          {createDraftError ? (
            <ThemedText variant="caption" style={styles.errorText}>
              {createDraftError}
            </ThemedText>
          ) : null}
          {createDraftResult ? (
            <ThemedText variant="caption" style={styles.helperText}>
              {createDraftResult}
            </ThemedText>
          ) : null}
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Create Scene</ThemedText>
            <ThemedText variant="caption" style={styles.previewLabel}>
              UI-only local form
            </ThemedText>
          </View>
          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Parent draft
            </ThemedText>
            <View style={styles.optionWrap}>
              {drafts.map((draft) => {
                const isSelected = createSceneInput.draftId === draft.id;

                return (
                  <Pressable
                    key={draft.id}
                    onPress={() => {
                      const nextOrder = getNextWritersRoomSceneOrder(
                        scenes.filter((scene) => scene.draftId === draft.id),
                      );
                      setCreateSceneInput((currentValue) => ({
                        ...currentValue,
                        draftId: draft.id,
                        order: nextOrder,
                      }));
                      setCreateSceneResult(null);
                    }}
                    style={[
                      styles.optionPill,
                      isSelected ? styles.optionPillSelected : styles.optionPillDefault,
                    ]}
                  >
                    <ThemedText variant="caption" style={styles.optionPillText}>
                      {draft.title}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Scene title *
            </ThemedText>
            <TextInput
              onChangeText={(value) => {
                setCreateSceneInput((currentValue) => ({
                  ...currentValue,
                  title: value,
                }));
                setCreateSceneError(null);
                setCreateSceneResult(null);
              }}
              placeholder="Enter scene title"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={createSceneInput.title}
            />
          </View>
          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Description
            </ThemedText>
            <TextInput
              multiline
              onChangeText={(value) => {
                setCreateSceneInput((currentValue) => ({
                  ...currentValue,
                  description: value,
                }));
                setCreateSceneResult(null);
              }}
              placeholder="Add scene description"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, styles.multilineInput]}
              textAlignVertical="top"
              value={createSceneInput.description ?? ""}
            />
          </View>
          <View style={styles.formField}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Scene type
            </ThemedText>
            <View style={styles.optionWrap}>
              {writersRoomSceneTypeOptions.map((sceneType) => {
                const isSelected = createSceneInput.sceneType === sceneType;

                return (
                  <Pressable
                    key={sceneType}
                    onPress={() => {
                      setCreateSceneInput((currentValue) => ({
                        ...currentValue,
                        sceneType,
                      }));
                      setCreateSceneResult(null);
                    }}
                    style={[
                      styles.optionPill,
                      isSelected ? styles.optionPillSelected : styles.optionPillDefault,
                    ]}
                  >
                    <ThemedText variant="caption" style={styles.optionPillText}>
                      {getWritersRoomSceneTypeLabel(sceneType)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={[styles.formField, styles.numberField]}>
            <ThemedText variant="caption" style={styles.secondaryText}>
              Scene order
            </ThemedText>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => {
                const parsedValue = Number.parseInt(value, 10);
                setCreateSceneInput((currentValue) => ({
                  ...currentValue,
                  order:
                    Number.isInteger(parsedValue) && parsedValue > 0
                      ? parsedValue
                      : 1,
                }));
                setCreateSceneResult(null);
              }}
              placeholder="e.g. 1"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={createSceneInput.order.toString()}
            />
          </View>
          <Pressable
            onPress={() => {
              const normalizedTitle = createSceneInput.title.trim().replace(/\s+/g, " ");
              if (normalizedTitle.length === 0) {
                setCreateSceneError("Scene title is required.");
                setCreateSceneResult(null);
                return;
              }

              setCreateSceneInput((currentValue) => ({
                ...currentValue,
                title: normalizedTitle,
              }));
              setCreateSceneError(null);
              setCreateSceneResult(
                "Scene saved locally for preview only. Persistence will be connected later.",
              );
            }}
            style={styles.saveSceneButton}
          >
            <ThemedText variant="body" style={styles.saveSceneButtonText}>
              Save Scene (UI-only)
            </ThemedText>
          </Pressable>
          {createSceneError ? (
            <ThemedText variant="caption" style={styles.errorText}>
              {createSceneError}
            </ThemedText>
          ) : null}
          {createSceneResult ? (
            <ThemedText variant="caption" style={styles.helperText}>
              {createSceneResult}
            </ThemedText>
          ) : null}
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Draft Planning</ThemedText>
            <ThemedText variant="caption" style={styles.previewLabel}>
              Local temporary content
            </ThemedText>
          </View>
          <View style={styles.list}>
            {drafts.map((draft) => {
              const orderedScenes = sortWritersRoomScenesByOrder(
                scenes.filter((scene) => scene.draftId === draft.id),
              );

              return (
                <View key={draft.id} style={styles.item}>
                  <ThemedText variant="body" style={styles.itemTitle}>
                    {draft.title}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.secondaryText}>
                    {getWritersRoomDraftStatusLabel(draft.status)} ·{" "}
                    {getWritersRoomDraftTypeLabel(draft.draftType)}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.secondaryText}>
                    {getWritersRoomDraftDisplayTarget(draft)}
                  </ThemedText>
                  <ThemedText variant="body" style={styles.secondaryText}>
                    {draft.summary}
                  </ThemedText>

                  <View style={styles.sceneList}>
                    {orderedScenes.map((scene) => (
                      <View key={scene.id} style={styles.sceneItem}>
                        <ThemedText variant="caption" style={styles.sceneOrder}>
                          Scene {scene.order}
                        </ThemedText>
                        <ThemedText variant="body" style={styles.itemTitle}>
                          {scene.title}
                        </ThemedText>
                        <ThemedText variant="caption" style={styles.secondaryText}>
                          {getWritersRoomSceneTypeLabel(scene.sceneType)}
                        </ThemedText>
                        <ThemedText variant="body" style={styles.secondaryText}>
                          {scene.description}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
          <ThemedText variant="caption" style={styles.helperText}>
            Drafts and scenes are local to this screen and will connect to
            persistence and collaboration flows later.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.section}>
          <ThemedText variant="subtitle">Future Planning Tools</ThemedText>
          <View style={styles.list}>
            <ThemedText variant="body" style={styles.secondaryText}>
              Story beats and outlines (coming later)
            </ThemedText>
            <ThemedText variant="body" style={styles.secondaryText}>
              Collaboration workflow and assignments (coming later)
            </ThemedText>
            <ThemedText variant="body" style={styles.secondaryText}>
              Shared draft planning surfaces (coming later)
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={styles.helperText}>
            Chat, tasks, drafts, file uploads, and backend collaboration state are
            out of scope for this placeholder.
          </ThemedText>
        </ThemedView>

        <ThemedView variant="card" style={styles.section}>
          <ThemedText variant="subtitle">Supported Options</ThemedText>
          <ThemedText variant="caption" style={styles.secondaryText}>
            Roles: {writersRoomRoleOptions.map((role) => getWritersRoomRoleLabel(role)).join(", ")}
          </ThemedText>
          <ThemedText variant="caption" style={styles.secondaryText}>
            Statuses: {writersRoomMemberStatusOptions
              .map((status) => getWritersRoomMemberStatusLabel(status))
              .join(", ")}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing["3xl"],
  },
  errorText: {
    color: theme.colors.state.danger,
  },
  formField: {
    gap: theme.spacing.xs,
  },
  helperText: {
    color: theme.colors.text.muted,
  },
  input: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  item: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  itemTitle: {
    fontWeight: theme.typography.weight.bold,
  },
  list: {
    gap: theme.spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
  },
  numberField: {
    flex: 1,
  },
  numberRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  optionPill: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  optionPillDefault: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.border.subtle,
  },
  optionPillSelected: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.brand.secondary,
  },
  optionPillText: {
    color: theme.colors.text.secondary,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  previewLabel: {
    color: theme.colors.text.muted,
  },
  saveDraftButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.secondary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  saveDraftButtonText: {
    fontWeight: theme.typography.weight.bold,
  },
  saveSceneButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.brand.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  saveSceneButtonText: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  sceneItem: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  sceneList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  sceneOrder: {
    color: theme.colors.brand.secondary,
    fontWeight: theme.typography.weight.bold,
  },
  secondaryText: {
    color: theme.colors.text.secondary,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
