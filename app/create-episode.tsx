import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function CreateEpisodeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="camera"
          style={styles.headerImage}
        />
      }
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ThemedText>Back</ThemedText>
      </Pressable>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Create Episode</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Permissions</ThemedText>
        <ThemedView style={styles.permissionRow}>
          <ThemedText>Camera: Not requested</ThemedText>
        </ThemedView>
        <ThemedView style={styles.permissionRow}>
          <ThemedText>Microphone: Not requested</ThemedText>
        </ThemedView>
        <ThemedText style={styles.note}>
          Real permission prompts added in Phase 2 Step 03.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recorder</ThemedText>
        <ThemedView style={styles.recorderCard}>
          <ThemedText>Record UI coming next</ThemedText>
          <Pressable style={[styles.recordButton, styles.disabled]}>
            <ThemedText>Start Recording</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  backButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  section: {
    marginTop: 24,
  },
  permissionRow: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  recorderCard: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  recordButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
