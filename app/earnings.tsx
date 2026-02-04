import { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCreatorStore } from "@/src/state/creator-store";
import { useEntitlementsStore } from "@/src/state/entitlements-store";
import { useTipsStore } from "@/src/state/tips-store";
import { router } from "expo-router";

export default function EarningsScreen() {
  const { receipts } = useTipsStore();
  const { seasonPassByShowId } = useEntitlementsStore();
  const { shows } = useCreatorStore();

  const totals = useMemo(() => {
    const totalTips = receipts.reduce((sum, r) => sum + r.amount, 0);
    const tipCount = receipts.length;
    const passCount = Object.values(seasonPassByShowId).filter(Boolean).length;
    return { totalTips, tipCount, passCount };
  }, [receipts, seasonPassByShowId]);

  const tipsByShow = useMemo(() => {
    const map = new Map<string, { showTitle: string; total: number }>();
    receipts.forEach((r) => {
      const existing = map.get(r.showId);
      if (existing) {
        existing.total += r.amount;
      } else {
        map.set(r.showId, { showTitle: r.showTitle, total: r.amount });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [receipts]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="dollarsign.circle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.backButton}>
        <Pressable onPress={() => router.back()}>
          <IconSymbol size={24} color="#007AFF" name="chevron.left" />
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Creator Earnings</ThemedText>
        <ThemedText style={styles.disclaimer}>
          This is a mock earnings view. No real payouts.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="subtitle">Summary</ThemedText>
        <ThemedText>Total tips: ${totals.totalTips}</ThemedText>
        <ThemedText>Tips received: {totals.tipCount}</ThemedText>
        <ThemedText>Season passes sold: {totals.passCount}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="subtitle">Your Shows</ThemedText>
        {shows.length === 0 ? (
          <ThemedText>No created shows yet.</ThemedText>
        ) : (
          shows.map((show) => (
            <ThemedView key={show.id} style={styles.showRow}>
              <ThemedText>{show.title}</ThemedText>
            </ThemedView>
          ))
        )}
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="subtitle">Tips by Show</ThemedText>
        {tipsByShow.length === 0 ? (
          <ThemedText>No tips yet.</ThemedText>
        ) : (
          tipsByShow.map((row) => (
            <ThemedView key={row.showTitle} style={styles.showRow}>
              <ThemedText>{row.showTitle}</ThemedText>
              <ThemedText>${row.total}</ThemedText>
            </ThemedView>
          ))
        )}
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
    gap: 6,
  },
  disclaimer: {
    fontSize: 12,
    color: "#888",
  },
  summaryCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    gap: 6,
  },
  showRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
});
