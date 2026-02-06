import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Sentry } from "@/src/lib/sentry";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCreatorStore } from "@/src/state/creator-store";

export default function CreateScreen() {
  const { shows: creatorShows } = useCreatorStore();
  const [query, setQuery] = useState("");

  const filteredShows = creatorShows.filter((show) =>
    show.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Studio</ThemedText>
      </ThemedView>
      <Pressable
        style={styles.createShowButton}
        onPress={() => router.push("/create-show" as any)}
      >
        <ThemedText>Create Show</ThemedText>
      </Pressable>
      <Pressable
        style={styles.earningsButton}
        onPress={() => router.push("/earnings" as any)}
      >
        <ThemedText>Earnings</ThemedText>
      </Pressable>
      <Pressable
        style={styles.moderationButton}
        onPress={() => router.push("/moderation-queue" as any)}
      >
        <ThemedText>Moderation Queue</ThemedText>
      </Pressable>
      {__DEV__ && (
        <Pressable
          style={styles.sentryButton}
          onPress={async () => {
            const eventId = Sentry.captureException(
              new Error("Sentry test error"),
            );
            await Sentry.flush(2000);
            Alert.alert(
              "Sentry",
              `Sent test event: ${eventId}. Check Issues.`,
            );
          }}
        >
          <ThemedText>Send Test Error</ThemedText>
        </Pressable>
      )}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Search Shows</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Search your shows..."
          value={query}
          onChangeText={setQuery}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">My Shows</ThemedText>
        {filteredShows.length === 0 ? (
          <ThemedView style={styles.empty}>
            <ThemedText>No shows yet</ThemedText>
            <ThemedText>
              Create your first show to start publishing episodes.
            </ThemedText>
          </ThemedView>
        ) : (
          filteredShows.map((show) => (
            <ThemedView key={show.id} style={styles.showCard}>
              <ThemedText style={styles.showTitle}>{show.title}</ThemedText>
              {show.createdAtIso && (
                <ThemedText style={styles.meta}>
                  Created{" "}
                  {new Date(show.createdAtIso).toISOString().slice(0, 10)}
                </ThemedText>
              )}
              <ThemedView style={styles.actionsRow}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/create-episode",
                      params: { showId: show.id },
                    })
                  }
                >
                  <ThemedText>Create Episode</ThemedText>
                </Pressable>
                <Pressable
                  style={styles.actionButtonSecondary}
                  onPress={() =>
                    router.push({
                      pathname: "/show/[id]",
                      params: { id: show.id },
                    })
                  }
                >
                  <ThemedText>View Show</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  createShowButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  earningsButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(0,123,255,0.12)",
    borderRadius: 8,
    alignItems: "center",
  },
  moderationButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255,0,0,0.12)",
    borderRadius: 8,
    alignItems: "center",
  },
  sentryButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255,165,0,0.14)",
    borderRadius: 8,
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 8,
  },
  showCard: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 8,
  },
  showTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  meta: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonSecondary: {
    flex: 1,
    padding: 8,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  empty: {
    alignItems: "center",
    padding: 16,
  },
});
