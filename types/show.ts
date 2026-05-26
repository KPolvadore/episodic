export type ShowId = string;

export type UserId = string;

export type ISODateString = string;

export type ShowCategory =
  | "comedy"
  | "documentary"
  | "drama"
  | "education"
  | "lifestyle"
  | "music"
  | "reality"
  | "sports"
  | "other";

export type ShowVisibility = "public" | "private";

export type Show = {
  id: ShowId;
  ownerUserId: UserId;
  title: string;
  description: string;
  coverUrl: string | null;
  category: ShowCategory;
  isPublic: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateShowInput = {
  ownerUserId: UserId;
  title: string;
  description?: string;
  coverUrl?: string | null;
  category?: ShowCategory;
  isPublic?: boolean;
};

export type UpdateShowInput = Partial<
  Pick<Show, "title" | "description" | "coverUrl" | "category" | "isPublic">
>;
