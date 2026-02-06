import Constants from "expo-constants";

type LogLevel = "debug" | "info" | "warn" | "error";

const runtimeExtra = (Constants.expoConfig?.extra ||
  (Constants as any)?.manifest?.extra ||
  {}) as Record<string, string | undefined>;

const APP_ENV = String(runtimeExtra.EXPO_PUBLIC_APP_ENV || "development");
const IS_PROD = APP_ENV === "production";

const REDACT_KEYS = [
  "password",
  "token",
  "auth",
  "authorization",
  "session",
  "secret",
  "key",
  "email",
];

function shouldRedact(key: string) {
  const lower = key.toLowerCase();
  return REDACT_KEYS.some((value) => lower.includes(value));
}

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[redacted]";
  if (Array.isArray(value)) {
    return value.map((entry) => sanitize(entry, depth + 1));
  }
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      output[key] = shouldRedact(key) ? "[redacted]" : sanitize(entry, depth + 1);
    });
    return output;
  }
  return value;
}

function shouldLog(level: LogLevel) {
  if (!IS_PROD) return true;
  return level === "warn" || level === "error";
}

function log(level: LogLevel, message: string, data?: unknown) {
  if (!shouldLog(level)) return;
  const payload = data === undefined ? undefined : sanitize(data);
  const prefix = `[${APP_ENV}]`;
  switch (level) {
    case "debug":
      console.debug(prefix, message, payload);
      break;
    case "info":
      console.info(prefix, message, payload);
      break;
    case "warn":
      console.warn(prefix, message, payload);
      break;
    case "error":
      console.error(prefix, message, payload);
      break;
    default:
      console.log(prefix, message, payload);
  }
}

export const logger = {
  debug: (message: string, data?: unknown) => log("debug", message, data),
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
};
