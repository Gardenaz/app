import type { WeatherMood } from "@/components/sections/farm-scene";

export type FarmerCompanionMood = "happy" | "thinking" | "worried" | "excited";

export function getFarmerCompanionMood(weather: WeatherMood, isPending: boolean): FarmerCompanionMood {
  if (isPending) return "thinking";
  if (weather === "sunny") return "happy";
  if (weather === "cloudy") return "thinking";
  if (weather === "rainy") return "worried";
  return "excited";
}
