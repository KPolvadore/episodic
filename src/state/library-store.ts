import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const SAVED_SHOWS_KEY = "library:savedShows";
const SAVED_TOPICS_KEY = "library:savedTopics";

export function useLibraryStore() {
  const [savedShowIds, setSavedShowIds] = useState<string[]>([]);
  const [savedTopicIds, setSavedTopicIds] = useState<string[]>([]);

  const hydrate = async () => {
    try {
      const [shows, topics] = await Promise.all([
        AsyncStorage.getItem(SAVED_SHOWS_KEY),
        AsyncStorage.getItem(SAVED_TOPICS_KEY),
      ]);
      setSavedShowIds(shows ? JSON.parse(shows) : []);
      setSavedTopicIds(topics ? JSON.parse(topics) : []);
    } catch (error) {
      console.error("Failed to hydrate library store:", error);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const saveShows = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(SAVED_SHOWS_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to save shows:", error);
    }
  };

  const saveTopics = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(SAVED_TOPICS_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to save topics:", error);
    }
  };

  const toggleShow = (id: string) => {
    const newIds = savedShowIds.includes(id)
      ? savedShowIds.filter((s) => s !== id)
      : [...savedShowIds, id];
    setSavedShowIds(newIds);
    saveShows(newIds);
  };

  const addShow = (id: string) => {
    if (!savedShowIds.includes(id)) {
      const newIds = [...savedShowIds, id];
      setSavedShowIds(newIds);
      saveShows(newIds);
    }
  };

  const toggleTopic = (id: string) => {
    const newIds = savedTopicIds.includes(id)
      ? savedTopicIds.filter((t) => t !== id)
      : [...savedTopicIds, id];
    setSavedTopicIds(newIds);
    saveTopics(newIds);
  };

  const isShowSaved = (id: string) => savedShowIds.includes(id);
  const isTopicSaved = (id: string) => savedTopicIds.includes(id);

  return {
    savedShowIds,
    savedTopicIds,
    toggleShow,
    toggleTopic,
    addShow,
    isShowSaved,
    isTopicSaved,
    hydrate,
  };
}
