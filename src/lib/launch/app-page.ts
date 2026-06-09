import type { WeatherMood } from "@/components/sections/farm-scene";
import type { FarmerCompanionContext } from "@/components/base/farmer-companion";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import type { AgentHistoryRow } from "@/lib/agent/types";
import { LAUNCH_SETTINGS_STORAGE_KEY } from "@/lib/launch/settings-state";
import { historyRowToCropCard } from "@/lib/agent/history-cards";
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

export const APP_LAUNCH_SETTINGS_STORAGE_KEY = LAUNCH_SETTINGS_STORAGE_KEY;

export const APP_WELCOME_COPY = {
  title: "Welcome to managed mode first",
  body: "Managed mode means the draft saves your lane, amount, risk, and execution authority while the modal stays open until wallet, deposit to garden, and policy are actually ready. It still keeps on-chain benchmarking on Mantle and ERC-8004 identity in view, and the preview summary lives in chat so it does not look like a live position before it is executed.",
  bullets: [
    "On-chain benchmarking means the app can write a real proof trail on Mantle instead of only showing a mock summary.",
    "ERC-8004 identity gives the wallet and agent a shared identity layer so the proof record stays traceable.",
    "Deposit to garden means moving capital into the garden account before the agent starts shaping a route.",
  ],
  cta: "Start guided flow",
} as const;

export const APP_ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome",
    body: "Learn the managed-mode-first flow and what the assistant is allowed to do.",
    cta: "Open welcome",
  },
  {
    id: "connect-wallet",
    title: "Connect wallet",
    body: "Tie the garden to your wallet before any deposit or policy setup.",
    cta: "Connect wallet",
  },
  {
    id: "deposit-to-garden",
    title: "Deposit to garden",
    body: "Move capital into the garden account preview so the next plan has something to work with.",
    cta: "Review deposit",
  },
  {
    id: "set-policy",
    title: "Set policy",
    body: "Choose risk limits, route guardrails, and execution authority before the assistant plans a move.",
    cta: "Set policy",
  },
  {
    id: "preview-plan",
    title: "Preview plan",
    body: "Read the summary in assistant chat before anything is treated as a live garden state.",
    cta: "Preview plan",
  },
  {
    id: "execute-move",
    title: "Execute move",
    body: "Send the on-chain move only after the preview still matches your intent.",
    cta: "Execute move",
  },
] as const;

export function buildAssistantContext(params: {
  mode: FarmerCompanionContext["mode"];
  view: FarmerCompanionContext["view"];
  weather: WeatherMood;
  marketLabel?: string;
  weatherReason: string;
  gUsdBalance: string;
  plantedCount: number;
  historyRows?: AgentHistoryRow[];
  onchainPositions: Array<{
    positionId: number;
    cropKey: "steady" | "growth" | "boost";
    currentValue: string;
    principal: string;
    harvested: boolean;
  }>;
  data?: GardenAgentResult | null;
  latestDecision?: string | null;
}): FarmerCompanionContext {
  const fallbackPositions = params.onchainPositions.slice(0, 3).map((position) => ({
    id: position.positionId,
    title: `${position.cropKey === "steady" ? "Rice" : position.cropKey === "growth" ? "Corn" : "Chili"} #${position.positionId}`,
    value: `${position.currentValue}/${position.principal}`,
    status: position.harvested ? "Harvested" : "Growing",
  }));
  const liveHistoryRows = (params.historyRows ?? []).filter((row) => row.proofStatus === "live" || row.outcome === "success");
  const activePositions = liveHistoryRows.slice(0, 3).map((row, index) => {
    const card = historyRowToCropCard(row);
    return {
      id: row.decisionId || index + 1,
      title: card.title,
      value: `${card.durationLabel} · ${card.pnlLabel}`,
      status: card.proofLabel,
    };
  });
  const positions = activePositions.length > 0 ? activePositions : fallbackPositions;

  return {
    mode: params.mode,
    view: params.view,
    marketLabel: params.marketLabel ?? marketLabel(params.weather),
    weatherReason: params.weatherReason,
    gUsdBalance: params.gUsdBalance,
    plantedCount: params.plantedCount,
    positionCount: positions.length,
    activePositions: positions,
    latestDecision: params.latestDecision ?? params.data?.decision.summary ?? params.data?.beginnerExplanation ?? null,
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
