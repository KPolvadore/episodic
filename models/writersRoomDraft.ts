import type {
  CreateWritersRoomDraftInput,
  CreateWritersRoomSceneInput,
  WritersRoomDraft,
  WritersRoomDraftStatus,
  WritersRoomDraftType,
  WritersRoomScene,
  WritersRoomSceneType,
} from "@/types/writersRoomDraft";

export const defaultWritersRoomDraftStatus: WritersRoomDraftStatus = "idea";

export const defaultWritersRoomDraftType: WritersRoomDraftType = "episodePlan";

export const defaultWritersRoomSceneType: WritersRoomSceneType = "setup";

export const writersRoomDraftStatusOptions = [
  "idea",
  "outline",
  "inReview",
  "ready",
] as const satisfies readonly WritersRoomDraftStatus[];

export const writersRoomDraftTypeOptions = [
  "episodePlan",
  "storyArc",
  "characterArc",
  "other",
] as const satisfies readonly WritersRoomDraftType[];

export const writersRoomSceneTypeOptions = [
  "intro",
  "setup",
  "conflict",
  "reveal",
  "cliffhanger",
  "resolution",
  "transition",
  "other",
] as const satisfies readonly WritersRoomSceneType[];

export const writersRoomDraftStatusLabels = {
  idea: "Idea",
  outline: "Outline",
  inReview: "In review",
  ready: "Ready",
} as const satisfies Record<WritersRoomDraftStatus, string>;

export const writersRoomDraftTypeLabels = {
  episodePlan: "Episode plan",
  storyArc: "Story arc",
  characterArc: "Character arc",
  other: "Other",
} as const satisfies Record<WritersRoomDraftType, string>;

export const writersRoomSceneTypeLabels = {
  intro: "Intro",
  setup: "Setup",
  conflict: "Conflict",
  reveal: "Reveal",
  cliffhanger: "Cliffhanger",
  resolution: "Resolution",
  transition: "Transition",
  other: "Other",
} as const satisfies Record<WritersRoomSceneType, string>;

export function getWritersRoomDraftStatusLabel(status: WritersRoomDraftStatus) {
  return writersRoomDraftStatusLabels[status];
}

export function getWritersRoomDraftTypeLabel(draftType: WritersRoomDraftType) {
  return writersRoomDraftTypeLabels[draftType];
}

export function getWritersRoomSceneTypeLabel(sceneType: WritersRoomSceneType) {
  return writersRoomSceneTypeLabels[sceneType];
}

export function normalizeWritersRoomDraftTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function isValidWritersRoomDraftTitle(title: string) {
  return normalizeWritersRoomDraftTitle(title).length > 0;
}

export function getDefaultCreateWritersRoomDraftInput(params: {
  createdByUserId: CreateWritersRoomDraftInput["createdByUserId"];
  showId: CreateWritersRoomDraftInput["showId"];
  writersRoomId: CreateWritersRoomDraftInput["writersRoomId"];
}): CreateWritersRoomDraftInput {
  return {
    createdByUserId: params.createdByUserId,
    draftType: defaultWritersRoomDraftType,
    showId: params.showId,
    status: defaultWritersRoomDraftStatus,
    summary: "",
    targetEpisodeNumber: null,
    targetSeasonNumber: null,
    title: "",
    writersRoomId: params.writersRoomId,
  };
}

export function getDefaultCreateWritersRoomSceneInput(params: {
  createdByUserId: CreateWritersRoomSceneInput["createdByUserId"];
  draftId: CreateWritersRoomSceneInput["draftId"];
  order: CreateWritersRoomSceneInput["order"];
}): CreateWritersRoomSceneInput {
  return {
    createdByUserId: params.createdByUserId,
    description: "",
    draftId: params.draftId,
    order: params.order,
    sceneType: defaultWritersRoomSceneType,
    title: "",
  };
}

export function sortWritersRoomScenesByOrder<
  T extends Pick<WritersRoomScene, "order">,
>(scenes: readonly T[]) {
  return [...scenes].sort((a, b) => a.order - b.order);
}

export function getNextWritersRoomSceneOrder(
  scenes: readonly Pick<WritersRoomScene, "order">[],
) {
  if (scenes.length === 0) {
    return 1;
  }

  return Math.max(...scenes.map((scene) => scene.order)) + 1;
}

export function getWritersRoomDraftDisplayTarget(
  draft: Pick<WritersRoomDraft, "targetSeasonNumber" | "targetEpisodeNumber">,
) {
  if (draft.targetSeasonNumber == null || draft.targetEpisodeNumber == null) {
    return "Target episode not set";
  }

  return `S${draft.targetSeasonNumber}:E${draft.targetEpisodeNumber}`;
}
