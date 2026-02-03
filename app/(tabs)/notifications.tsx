import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationsStore } from "@/src/state/notifications-store";

export default function NotificationsScreen() {
  const notifications = useNotificationsStore((s) => s.notifications);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const seedSamples = useNotificationsStore((s) => s.seedSamples);

  useEffect(() => {
    seedSamples();
  }, [seedSamples]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="bell.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleRow}>
        <ThemedText type="title">Notifications</ThemedText>
        {notifications.length > 0 && (
          <Pressable style={styles.markAll} onPress={markAllRead}>
            <ThemedText style={styles.markAllText}>Mark all read</ThemedText>
          </Pressable>
        )}
      </ThemedView>

      {notifications.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText type="subtitle">No notifications yet</ThemedText>
          <ThemedText>Invites, new episodes, and polls show up here.</ThemedText>
        </ThemedView>
      ) : (
        notifications.map((notif) => (
          <Pressable
            key={notif.id}
            style={[
              styles.notificationCard,
              !notif.read && styles.notificationUnread,
            ]}
            onPress={() => markRead(notif.id)}
          >
            <ThemedView style={styles.cardHeader}>
              <ThemedText type="subtitle">{notif.title}</ThemedText>
              {!notif.read && <ThemedView style={styles.unreadDot} />}
            </ThemedView>
            <ThemedText>{notif.body}</ThemedText>
            <ThemedText style={styles.meta}>
              {new Date(notif.createdAtIso).toLocaleString()}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  markAll: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,255,0.1)",
    borderRadius: 12,
  },
  markAllText: {
    fontSize: 12,
    color: "#0066cc",
  },
  emptyState: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    gap: 8,
  },
  notificationCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    gap: 6,
  },
  notificationUnread: {
    borderWidth: 1,
    borderColor: "rgba(0,123,255,0.4)",
    backgroundColor: "rgba(0,123,255,0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007bff",
  },
  meta: {
    fontSize: 11,
    color: "#888",
  },
});
