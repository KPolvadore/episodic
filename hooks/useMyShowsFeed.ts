import { useEffect, useState } from "react";

import {
    getFeed,
    type EpisodeWithShow,
    type FeedType,
} from "@/src/api/feed.api";

export type FeedAlgo = "new" | "continue" | "newShowsOnly" | "local";

export function useMyShowsFeed(
  preferLocal: boolean,
  preferNewShowsOnly: boolean,
) {
  const [selectedAlgo, setSelectedAlgo] = useState<FeedAlgo>("new");
  const [feed, setFeed] = useState<EpisodeWithShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const effectiveFeedType: FeedType = preferNewShowsOnly
        ? "newShowsOnly"
        : preferLocal
          ? "local"
          : selectedAlgo;
      const data = await getFeed(effectiveFeedType);
      setFeed(data);
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [selectedAlgo, preferLocal, preferNewShowsOnly]);

  return {
    feed,
    loading,
    error,
    selectedAlgo,
    setSelectedAlgo,
    reload: loadFeed,
  };
}
