import type { EpisodeId } from "./episode";
import type { ISODateString, ShowId, UserId } from "./show";

export type MonetizationFeature =
  | "creator_support"
  | "season_pass"
  | "premium_episode"
  | "ad_supported"
  | "ad_free_subscription";

export type MonetizationStatus = "draft" | "active" | "paused" | "disabled";

export type CreatorSupportOption = "one_time_tip" | "monthly_support";

export type PremiumAccessType = "season_pass" | "premium_episode";

export type ViewerSubscriptionStatus =
  | "not_subscribed"
  | "active"
  | "paused"
  | "canceled";

export type CreatorMonetizationEligibilityStatus =
  | "unknown"
  | "eligible"
  | "ineligible"
  | "under_review";

export type ShowMonetizationSettings = {
  showId: ShowId;
  status: MonetizationStatus;
  enabledFeatures: MonetizationFeature[];
  creatorSupportEnabled: boolean;
  premiumAccessEnabled: boolean;
  adsEligible: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreatorSupportTierId = string;

export type CreatorSupportTier = {
  id: CreatorSupportTierId;
  showId: ShowId;
  title: string;
  description: string;
  amountCents: number;
  currency: string;
  option: CreatorSupportOption;
  isActive: boolean;
};

export type ShowPremiumAccessId = string;

export type ShowPremiumAccess = {
  id: ShowPremiumAccessId;
  showId: ShowId;
  episodeId: EpisodeId | null;
  accessType: PremiumAccessType;
  title: string;
  description: string;
  amountCents: number;
  currency: string;
  isActive: boolean;
};

export type ViewerSubscriptionTierId = string;

export type ViewerSubscriptionTier = {
  id: ViewerSubscriptionTierId;
  title: string;
  description: string;
  amountCents: number;
  currency: string;
  benefits: string[];
  includesAdFree: boolean;
  isActive: boolean;
};

export type CreatorMonetizationEligibility = {
  showId: ShowId;
  creatorUserId: UserId;
  status: CreatorMonetizationEligibilityStatus;
  reason: string | null;
  reviewedAt: ISODateString | null;
  updatedAt: ISODateString;
};

export type CreateShowMonetizationSettingsInput = {
  showId: ShowId;
  status?: MonetizationStatus;
  enabledFeatures?: MonetizationFeature[];
  creatorSupportEnabled?: boolean;
  premiumAccessEnabled?: boolean;
  adsEligible?: boolean;
};

export type UpdateShowMonetizationSettingsInput = Partial<
  Pick<
    ShowMonetizationSettings,
    | "status"
    | "enabledFeatures"
    | "creatorSupportEnabled"
    | "premiumAccessEnabled"
    | "adsEligible"
  >
>;
