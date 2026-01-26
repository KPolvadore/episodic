import AsyncStorage from "@react-native-async-storage/async-storage";

export type DraftEpisode = {
  id: string;
  showId: string;
  title: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  status: "draft" | "uploading" | "failed" | "published";
};

export const DRAFTS_STORAGE_KEY = "drafts:v1";

export async function hydrateDrafts(): Promise<DraftEpisode[]> {
  try {
    const data = await AsyncStorage.getItem(DRAFTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to hydrate drafts:", error);
  }
  return [];
}

export async function saveDrafts(drafts: DraftEpisode[]): Promise<void> {
  try {
    await AsyncStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error("Failed to save drafts:", error);
  }
}

export function createDraft(
  drafts: DraftEpisode[],
  input: { showId: string; title: string },
): DraftEpisode[] {
  const now = new Date().toISOString();
  const newDraft: DraftEpisode = {
    id: `${Date.now()}-${Math.random()}`,
    showId: input.showId,
    title: input.title,
    createdAt: now,
    updatedAt: now,
    status: "draft",
  };
  return [...drafts, newDraft];
}

export function updateDraft(
  drafts: DraftEpisode[],
  id: string,
  patch: Partial<Pick<DraftEpisode, "title" | "status">>,
): DraftEpisode[] {
  return drafts.map((draft) =>
    draft.id === id
      ? { ...draft, ...patch, updatedAt: new Date().toISOString() }
      : draft,
  );
}

export function deleteDraft(
  drafts: DraftEpisode[],
  id: string,
): DraftEpisode[] {
  return drafts.filter((draft) => draft.id !== id);
}
