"use client";

import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/api";

type Health = { ok: boolean; db: string; ts: string };

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => getJson<Health>("/api/health"),
  });
}
