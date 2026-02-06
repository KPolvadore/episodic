import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Sentry, isExpoGo } from '@/src/lib/sentry';

export const unstable_settings = {
  anchor: '(tabs)',
};

const runtimeExtra = (Constants.expoConfig?.extra ||
  (Constants as any)?.manifest?.extra ||
  {}) as Record<string, string | undefined>;

const SENTRY_DSN = String(runtimeExtra.EXPO_PUBLIC_SENTRY_DSN || '').trim();
const APP_ENV = String(runtimeExtra.EXPO_PUBLIC_APP_ENV || 'development');
const SENTRY_ENABLED = Boolean(SENTRY_DSN) && !isExpoGo;

console.log('Sentry DSN loaded:', Boolean(SENTRY_DSN), 'ExpoGo:', isExpoGo);

let sentryInitialized = false;
if (!sentryInitialized && !isExpoGo) {
  Sentry.init({
    dsn: SENTRY_DSN || undefined,
    enabled: SENTRY_ENABLED,
    environment: APP_ENV,
    tracesSampleRate: APP_ENV === 'production' ? 0.2 : 1.0,
    enableInExpoDevelopment: true,
    debug: __DEV__,
  });
  sentryInitialized = true;
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
