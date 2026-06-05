import type { WeatherMood } from "@/components/sections/farm-scene";

export type FearGreedReading = {
  score: number;
  classification: string;
  timestamp: number;
  timeUntilUpdateSeconds: number | null;
  source: "alternative.me";
};

function toNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function fetchFearGreedReading(signal?: AbortSignal): Promise<FearGreedReading> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1&format=json", {
    signal,
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Fear & Greed API HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: Array<{
      value?: string;
      value_classification?: string;
      timestamp?: string;
      time_until_update?: string;
    }>;
  };

  const latest = json.data?.[0];
  if (!latest) {
    throw new Error("Fear & Greed API returned no data");
  }

  return {
    score: toNumber(latest.value),
    classification: latest.value_classification?.trim() || "Neutral",
    timestamp: toNumber(latest.timestamp),
    timeUntilUpdateSeconds: latest.time_until_update ? toNumber(latest.time_until_update) : null,
    source: "alternative.me",
  };
}

export function fearGreedToWeather(score: number): WeatherMood {
  if (score <= 24) return "stormy";
  if (score <= 44) return "rainy";
  if (score <= 64) return "cloudy";
  return "sunny";
}

export function fearGreedToLabel(reading: FearGreedReading) {
  return `${reading.classification} ${reading.score}/100`;
}

export function fearGreedToReason(reading: FearGreedReading) {
  const updated = Number.isFinite(reading.timestamp) ? new Date(reading.timestamp * 1000).toLocaleString() : "recently";
  const updateWindow = reading.timeUntilUpdateSeconds && reading.timeUntilUpdateSeconds > 0
    ? ` Next update in about ${Math.ceil(reading.timeUntilUpdateSeconds / 60)} minute${Math.ceil(reading.timeUntilUpdateSeconds / 60) > 1 ? "s" : ""}.`
    : "";
  return `Market sentiment is ${reading.classification} at ${reading.score}/100 from Alternative.me. Updated ${updated}.${updateWindow}`;
}
