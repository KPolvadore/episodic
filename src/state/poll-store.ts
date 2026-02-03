import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PollChoice = {
  id: string;
  label: string;
};

export type Poll = {
  id: string;
  episodeId: string;
  question: string;
  choices: PollChoice[];
};

type PollTemplate = {
  question: string;
  choices: string[];
};

const POLL_TEMPLATES: PollTemplate[] = [
  {
    question: "What should happen next?",
    choices: ["Big reveal", "Quiet twist", "Unexpected ally"],
  },
  {
    question: "Which scene should open the next episode?",
    choices: ["Cold open chase", "Flashback moment", "Character confession"],
  },
  {
    question: "What tone should the next episode have?",
    choices: ["Funny", "Tense", "Emotional"],
  },
];

const hashEpisodeId = (episodeId: string) => {
  let hash = 0;
  for (let i = 0; i < episodeId.length; i += 1) {
    hash = (hash * 31 + episodeId.charCodeAt(i)) % 100000;
  }
  return hash;
};

const buildPoll = (episodeId: string): Poll => {
  const hash = hashEpisodeId(episodeId);
  const template = POLL_TEMPLATES[hash % POLL_TEMPLATES.length];
  return {
    id: `poll-${episodeId}`,
    episodeId,
    question: template.question,
    choices: template.choices.map((label, index) => ({
      id: `choice-${index + 1}`,
      label,
    })),
  };
};

export const getPollForEpisode = (episodeId: string): Poll | null => {
  const hash = hashEpisodeId(episodeId);
  if (hash % 2 !== 0) return null;
  return buildPoll(episodeId);
};

export const getGuaranteedPollForEpisode = (episodeId: string): Poll => {
  return buildPoll(episodeId);
};

interface PollState {
  votesByPollId: Record<string, string>;
  vote: (pollId: string, choiceId: string) => void;
  getVote: (pollId: string) => string | undefined;
  reset: () => void;
}

export const pollStore = create<PollState>()(
  persist(
    (set, get) => ({
      votesByPollId: {},
      vote: (pollId, choiceId) => {
        set((state) => ({
          votesByPollId: { ...state.votesByPollId, [pollId]: choiceId },
        }));
      },
      getVote: (pollId) => get().votesByPollId[pollId],
      reset: () => {
        set({ votesByPollId: {} });
      },
    }),
    {
      name: "poll-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const usePollStore = pollStore;
