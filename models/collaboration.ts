import type {
  AddWritersRoomMemberInput,
  CreateWritersRoomInput,
  WritersRoomRole,
  WritersRoomMemberStatus,
} from "@/types/collaboration";
import type { ShowId, UserId } from "@/types/show";

export const defaultWritersRoomRole: WritersRoomRole = "contributor";

export const defaultAddWritersRoomMemberStatus: NonNullable<
  AddWritersRoomMemberInput["status"]
> = "pending";

export const writersRoomRoleOptions = [
  "owner",
  "coCreator",
  "editor",
  "viewer",
  "contributor",
] as const satisfies readonly WritersRoomRole[];

export const writersRoomMemberStatusOptions = [
  "active",
  "invited",
  "pending",
  "removed",
] as const satisfies readonly WritersRoomMemberStatus[];

export const writersRoomRoleLabels = {
  owner: "Owner",
  coCreator: "Co-creator",
  editor: "Editor",
  viewer: "Viewer",
  contributor: "Contributor",
} as const satisfies Record<WritersRoomRole, string>;

export const writersRoomMemberStatusLabels = {
  active: "Active",
  invited: "Invited",
  pending: "Pending",
  removed: "Removed",
} as const satisfies Record<WritersRoomMemberStatus, string>;

export function getWritersRoomRoleLabel(role: WritersRoomRole) {
  return writersRoomRoleLabels[role];
}

export function getWritersRoomMemberStatusLabel(status: WritersRoomMemberStatus) {
  return writersRoomMemberStatusLabels[status];
}

export function getDefaultCreateWritersRoomInput(
  showId: ShowId,
): CreateWritersRoomInput {
  return {
    description: "",
    name: "",
    showId,
  };
}

export function getDefaultAddWritersRoomMemberInput(params: {
  showId: ShowId;
  userId: UserId;
  writersRoomId: AddWritersRoomMemberInput["writersRoomId"];
}): AddWritersRoomMemberInput {
  return {
    invitedAt: null,
    joinedAt: null,
    role: defaultWritersRoomRole,
    showId: params.showId,
    status: defaultAddWritersRoomMemberStatus,
    userId: params.userId,
    writersRoomId: params.writersRoomId,
  };
}

// UI-facing helper for showing management affordances; not permission enforcement.
export function canRoleManageWritersRoom(role: WritersRoomRole) {
  return role === "owner" || role === "coCreator";
}
