"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFearGreedReading } from "@/lib/fear-greed";

const queryKey = ["fear-greed-index"] as const;

export function useFearGreedIndex() {
  return useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchFearGreedReading(signal),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
