import type { WeatherMood } from "@/components/sections/farm-scene";
import type { FarmerCompanionContext } from "@/components/base/farmer-companion";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import { crops } from "@/lib/crops/data";
import { proofRows } from "@/lib/gardena-content";

export function toWeatherMood(mood?: "bullish" | "neutral" | "bearish"): WeatherMood {
  if (mood === "bullish") return "sunny";
  if (mood === "bearish") return "rainy";
  return "cloudy";
}

export function marketLabel(weather: WeatherMood) {
  return weather === "sunny" ? "Bull" : weather === "cloudy" ? "Neutral" : weather === "rainy" ? "Bear" : "Crash";
}

export function marketEmoji(weather: WeatherMood) {
  return weather === "sunny" ? "☀️" : weather === "cloudy" ? "⛅" : weather === "rainy" ? "🌧️" : "⛈️";
}

export function buildAssistantContext(params: {
  mode: FarmerCompanionContext["mode"];
  view: FarmerCompanionContext["view"];
  weather: WeatherMood;
  marketLabel?: string;
  weatherReason: string;
  gUsdBalance: string;
  plantedCount: number;
  onchainPositions: Array<{
    positionId: number;
    cropKey: "steady" | "growth" | "boost";
    currentValue: string;
    principal: string;
    harvested: boolean;
  }>;
  data?: GardenAgentResult | null;
}): FarmerCompanionContext {
  const activePositions = params.onchainPositions.slice(0, 3).map((position) => ({
    id: position.positionId,
    title: `${position.cropKey === "steady" ? "Rice" : position.cropKey === "growth" ? "Corn" : "Chili"} #${position.positionId}`,
    value: `${position.currentValue}/${position.principal}`,
    status: position.harvested ? "Harvested" : "Growing",
  }));

  return {
    mode: params.mode,
    view: params.view,
    marketLabel: params.marketLabel ?? marketLabel(params.weather),
    weatherReason: params.weatherReason,
    gUsdBalance: params.gUsdBalance,
    plantedCount: params.plantedCount,
    positionCount: params.onchainPositions.length,
    activePositions,
    latestDecision: params.data?.decision.summary ?? params.data?.beginnerExplanation ?? null,
    proofRows,
    seedCatalog: crops.map((crop) => ({
      name: crop.name,
      price: crop.price,
      returnLabel: crop.returnLabel,
      asset: crop.asset,
      risk: crop.risk,
    })),
  };
}
