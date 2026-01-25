import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getMixedFeed, type FeedItem } from "@/src/api/feed.api";

const SpecialScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [special, setSpecial] = useState<FeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpecial = async () => {
      setLoading(true);
      setError(null);
      try {
        const feed = await getMixedFeed("new");
        const foundSpecial = feed.find(
          (item) => item.type === "special" && item.specialId === id,
        );
        if (foundSpecial && foundSpecial.type === "special") {
          setSpecial(foundSpecial);
        } else {
          setError("Special not found");
        }
      } catch {
        setError("Failed to load special");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadSpecial();
    }
  }, [id]);

  if (loading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="star"
            style={styles.headerImage}
          />
        }
      >
        <ThemedText>Loading...</ThemedText>
      </ParallaxScrollView>
    );
  }

  if (error || !special || special.type !== "special") {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="star"
            style={styles.headerImage}
          />
        }
      >
        <ThemedText>{error || "Special not found"}</ThemedText>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="star"
          style={styles.headerImage}
        />
      }
    >
      <ThemedText type="title">Special</ThemedText>
      <ThemedText type="subtitle">{special.title}</ThemedText>
      <ThemedText>Kind: {special.kind}</ThemedText>
      {special.attachedShowIds && special.attachedShowIds.length > 0 && (
        <>
          <ThemedText>
            Attached shows: {special.attachedShowIds.join(", ")}
          </ThemedText>
          <Pressable
            style={styles.viewShowButton}
            onPress={() =>
              router.push({
                pathname: "/show/[id]",
                params: { id: special.attachedShowIds![0], fromSpecial: id },
              })
            }
          >
            <ThemedText>View attached show</ThemedText>
          </Pressable>
        </>
      )}
      {special.attachedTopicIds && special.attachedTopicIds.length > 0 && (
        <ThemedView style={styles.topicsContainer}>
          <ThemedText type="subtitle">Topics</ThemedText>
          {special.attachedTopicIds.map((topicId) => (
            <Pressable
              key={topicId}
              style={styles.topicItem}
              onPress={() => router.push(`/topic/${topicId}`)}
            >
              <ThemedText>{topicId}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
};

export default SpecialScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  viewShowButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  topicsContainer: {
    marginTop: 16,
  },
  topicItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
});
