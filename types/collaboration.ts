import type { ISODateString, ShowId, UserId } from "./show";

export type WritersRoomId = string;

export type WritersRoomMemberId = string;

export type WritersRoomRole =
  | "owner"
  | "coCreator"
  | "editor"
  | "viewer"
  | "contributor";

export type WritersRoomMemberStatus =
  | "active"
  | "invited"
  | "pending"
  | "removed";

export type WritersRoom = {
  id: WritersRoomId;
  showId: ShowId;
  name: string;
  description: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type WritersRoomMember = {
  id: WritersRoomMemberId;
  writersRoomId: WritersRoomId;
  showId: ShowId;
  userId: UserId;
  role: WritersRoomRole;
  status: WritersRoomMemberStatus;
  joinedAt: ISODateString | null;
  invitedAt: ISODateString | null;
  removedAt: ISODateString | null;
};

export type CreateWritersRoomInput = {
  showId: ShowId;
  name: string;
  description?: string;
};

export type UpdateWritersRoomInput = Partial<
  Pick<WritersRoom, "name" | "description">
>;

export type AddWritersRoomMemberInput = {
  writersRoomId: WritersRoomId;
  showId: ShowId;
  userId: UserId;
  role: WritersRoomRole;
  status?: Extract<WritersRoomMemberStatus, "active" | "invited" | "pending">;
  invitedAt?: ISODateString | null;
  joinedAt?: ISODateString | null;
};

export type UpdateWritersRoomMemberInput = {
  memberId: WritersRoomMemberId;
  role?: WritersRoomRole;
  status?: WritersRoomMemberStatus;
  joinedAt?: ISODateString | null;
  invitedAt?: ISODateString | null;
  removedAt?: ISODateString | null;
};

export type RemoveWritersRoomMemberInput = {
  memberId: WritersRoomMemberId;
  removedAt?: ISODateString | null;
};
