import "dotenv/config";

import type { ExpoConfig, ConfigContext } from "@expo/config";
import appJson from "./app.json";

const { expo } = appJson as { expo: ExpoConfig };

const env = {
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  EXPO_PUBLIC_SUPABASE_ANON_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  EXPO_PUBLIC_MUX_TOKEN_ID: process.env.EXPO_PUBLIC_MUX_TOKEN_ID ?? "",
  EXPO_PUBLIC_MUX_TOKEN_SECRET: process.env.EXPO_PUBLIC_MUX_TOKEN_SECRET ?? "",
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
  EXPO_PUBLIC_FEATURE_USE_MOCKS:
    process.env.EXPO_PUBLIC_FEATURE_USE_MOCKS ?? "true",
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...expo,
  ...config,
  extra: {
    ...expo.extra,
    ...config.extra,
    ...env,
  },
});
