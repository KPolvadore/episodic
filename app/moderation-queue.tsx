import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useReportsStore } from "@/src/state/reports-store";
import { router } from "expo-router";

export default function ModerationQueueScreen() {
  const reports = useReportsStore((s) => s.reports);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="exclamationmark.triangle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Moderation Queue</ThemedText>
        <ThemedText style={styles.disclaimer}>
          Stub queue — no real moderation actions.
        </ThemedText>
      </ThemedView>

      {reports.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText type="subtitle">No reports yet</ThemedText>
          <ThemedText>
            Reported shows and episodes will appear here.
          </ThemedText>
        </ThemedView>
      ) : (
        reports.map((report) => (
          <Pressable
            key={report.id}
            style={styles.reportCard}
            onPress={() => {
              if (report.targetType === "show") {
                router.push({
                  pathname: "/show/[id]",
                  params: { id: report.targetId },
                });
              } else {
                router.push({
                  pathname: "/episode/[id]" as any,
                  params: { id: report.targetId },
                });
              }
            }}
          >
            <ThemedText type="subtitle">
              {report.targetType === "show" ? "Show" : "Episode"} Report
            </ThemedText>
            <ThemedText>Reason: {report.reason}</ThemedText>
            <ThemedText style={styles.meta}>
              {new Date(report.createdAtIso).toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.meta}>
              Target: {report.targetId}
            </ThemedText>
          </Pressable>
        ))
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer: {
    gap: 6,
  },
  disclaimer: {
    fontSize: 12,
    color: "#888",
  },
  emptyState: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    gap: 8,
  },
  reportCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    gap: 6,
  },
  meta: {
    fontSize: 11,
    color: "#666",
  },
});
