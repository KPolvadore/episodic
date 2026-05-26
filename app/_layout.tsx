import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="shows/[showId]" options={{ title: "Show" }} />
      <Stack.Screen name="shows/[showId]/edit" options={{ title: "Edit Show" }} />
    </Stack>
  );
}
