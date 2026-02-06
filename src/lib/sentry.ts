import Constants from "expo-constants";

const IS_EXPO_GO = Constants.appOwnership === "expo";

type SentryModule = typeof import("@sentry/react-native");

const noop = () => {};
const flushNoop = async () => true;
const wrapNoop = <T>(component: T) => component;

let sentry: SentryModule | null = null;
if (!IS_EXPO_GO) {
  // Lazy-require to avoid native module errors in Expo Go.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sentry = require("@sentry/react-native");
}

export const Sentry = sentry ?? {
  init: noop,
  captureException: noop,
  flush: flushNoop,
  wrap: wrapNoop,
};

export const isExpoGo = IS_EXPO_GO;
