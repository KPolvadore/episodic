import { create } from "zustand";

interface WritersRoomMember {
  id: string;
  displayName: string;
  email?: string;
  role: "owner" | "editor" | "viewer";
  addedAt: string;
}

interface WritersRoomState {
  membersByShowId: Record<string, WritersRoomMember[]>;
  roleByShowId: Record<string, "owner" | "editor" | "viewer">;
  seedShow: (showId: string) => void;
  invite: (
    showId: string,
    member: Omit<WritersRoomMember, "id" | "addedAt">,
  ) => void;
  remove: (showId: string, memberId: string) => void;
  setMyRole: (showId: string, role: "owner" | "editor" | "viewer") => void;
}

export const useWritersRoomStore = create<WritersRoomState>((set, get) => ({
  membersByShowId: {},
  roleByShowId: {},
  seedShow: (showId) => {
    if (!get().membersByShowId[showId]) {
      const initialMembers: WritersRoomMember[] = [
        {
          id: "current-user",
          displayName: "You",
          role: "owner",
          addedAt: new Date().toISOString(),
        },
      ];
      set((state) => ({
        membersByShowId: { ...state.membersByShowId, [showId]: initialMembers },
        roleByShowId: { ...state.roleByShowId, [showId]: "owner" },
      }));
    }
  },
  invite: (showId, member) => {
    const newMember: WritersRoomMember = {
      ...member,
      id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      addedAt: new Date().toISOString(),
    };
    set((state) => ({
      membersByShowId: {
        ...state.membersByShowId,
        [showId]: [...(state.membersByShowId[showId] || []), newMember],
      },
    }));
  },
  remove: (showId, memberId) => {
    set((state) => ({
      membersByShowId: {
        ...state.membersByShowId,
        [showId]: (state.membersByShowId[showId] || []).filter(
          (m) => m.id !== memberId,
        ),
      },
    }));
  },
  setMyRole: (showId, role) => {
    set((state) => ({
      roleByShowId: { ...state.roleByShowId, [showId]: role },
    }));
  },
}));
