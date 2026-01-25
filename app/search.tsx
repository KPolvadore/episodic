import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const mockShows = [
  { id: "show1", title: "The Daily Grind" },
  { id: "show2", title: "Mystery Mansion" },
  { id: "show3", title: "Comedy Central" },
];

const mockTopics = [
  { id: "t1", title: "Horror" },
  { id: "t2", title: "Comedy" },
  { id: "t3", title: "Drama" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filteredShows = mockShows.filter((show) =>
    show.title.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredTopics = mockTopics.filter((topic) =>
    topic.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <ThemedText type="title" style={styles.headerImage}>
          🔍
        </ThemedText>
      }
    >
      <ThemedView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search shows or topics..."
          value={query}
          onChangeText={setQuery}
        />
        {query === "" ? (
          <ThemedText style={styles.hint}>
            Start typing to search for shows or topics...
          </ThemedText>
        ) : (
          <>
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Shows</ThemedText>
              {filteredShows.length > 0 ? (
                filteredShows.map((show) => (
                  <Pressable
                    key={show.id}
                    style={styles.item}
                    onPress={() => router.push(`/show/${show.id}`)}
                  >
                    <ThemedText>{show.title}</ThemedText>
                  </Pressable>
                ))
              ) : (
                <ThemedText>No shows found</ThemedText>
              )}
            </ThemedView>
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Topics</ThemedText>
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <Pressable
                    key={topic.id}
                    style={styles.item}
                    onPress={() => router.push(`/topic/${topic.id}`)}
                  >
                    <ThemedText>{topic.title}</ThemedText>
                  </Pressable>
                ))
              ) : (
                <ThemedText>No topics found</ThemedText>
              )}
            </ThemedView>
          </>
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
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  hint: {
    textAlign: "center",
    marginTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  item: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    marginBottom: 8,
  },
});
