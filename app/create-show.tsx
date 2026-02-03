import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { mockTopics } from "@/src/api/feed.api";
import { useCreatorStore } from "@/src/state/creator-store";

export default function CreateShowScreen() {
  const { addShow } = useCreatorStore();
  const [title, setTitle] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const canCreate = title.trim() && selectedTopicId;

  const handleCreateShow = () => {
    if (canCreate) {
      const id = `user-show-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const selectedTopic = mockTopics.find((t) => t.id === selectedTopicId);
      addShow({
        id,
        title: title.trim(),
        topicId: selectedTopicId || undefined,
        topicName: selectedTopic?.name || undefined,
      });
      router.push({ pathname: "/create-episode", params: { showId: id } });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
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
        <ThemedText type="title">Create Show</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Show Title</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Show title"
          value={title}
          onChangeText={setTitle}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Topic</ThemedText>
        {mockTopics.map((topic) => (
          <Pressable
            key={topic.id}
            style={styles.topicRow}
            onPress={() => setSelectedTopicId(topic.id)}
          >
            <ThemedText>{topic.name}</ThemedText>
            <IconSymbol
              size={20}
              color={selectedTopicId === topic.id ? "#007AFF" : "#ccc"}
              name={
                selectedTopicId === topic.id
                  ? "checkmark.circle.fill"
                  : "circle"
              }
            />
          </Pressable>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <Pressable
          disabled={!canCreate}
          style={[styles.createButton, !canCreate && styles.disabled]}
          onPress={handleCreateShow}
        >
          <ThemedText>Create Show</ThemedText>
        </Pressable>
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
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  topicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  createButton: {
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
