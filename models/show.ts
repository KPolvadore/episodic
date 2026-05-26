import type {
  CreateShowInput,
  ShowCategory,
  ShowVisibility,
  UserId,
} from "@/types/show";

export const defaultShowCategory: ShowCategory = "other";

export const defaultShowVisibility: ShowVisibility = "public";

export const showCategories = [
  "comedy",
  "documentary",
  "drama",
  "education",
  "lifestyle",
  "music",
  "reality",
  "sports",
  "other",
] as const satisfies readonly ShowCategory[];

export const showVisibilityOptions = [
  "public",
  "private",
] as const satisfies readonly ShowVisibility[];

export function isShowPublic(visibility: ShowVisibility) {
  return visibility === "public";
}

export function getShowVisibility(isPublic: boolean): ShowVisibility {
  return isPublic ? "public" : "private";
}

export function normalizeShowTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function isValidShowTitle(title: string) {
  return normalizeShowTitle(title).length > 0;
}

export function getDefaultCreateShowInput(
  ownerUserId: UserId,
): CreateShowInput {
  return {
    category: defaultShowCategory,
    coverUrl: null,
    description: "",
    isPublic: isShowPublic(defaultShowVisibility),
    ownerUserId,
    title: "",
  };
}
