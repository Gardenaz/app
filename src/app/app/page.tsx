"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Fingerprint, Sprout, ShieldCheck } from "lucide-react";
import { CropGridSection } from "@/components/sections/crop-grid";
import { AgentHistorySection } from "@/components/sections/agent-history";
import {
  FarmScene,
  INITIAL_SLOTS,
  CROP_OPTIONS,
  type PotSlot,
  type WeatherMood,
} from "@/components/sections/farm-scene";
import { FarmerCompanion, type FarmerCompanionContext } from "@/components/base/farmer-companion";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { GardenRwaVaultSection } from "@/components/sections/garden-rwa-vault";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGardenAgent } from "@/hooks/use-garden-agent";
import { useGardenRwaVault } from "@/hooks/use-garden-rwa-vault";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { crops } from "@/lib/crops/data";
import { proofRows } from "@/lib/gardena-content";
import type { RiskLevel } from "@/lib/agent/types";
import type { GardenRwaCropKey } from "@/lib/contracts/garden-rwa";

/* ── Weather background themes ────────────────────────────────── */
const pageTheme: Record<WeatherMood, { bg: string; headerBg: string }> = {
  sunny: { bg: "bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-50", headerBg: "bg-white/90 border-emerald-100" },
  cloudy: { bg: "bg-gradient-to-br from-slate-100 via-gray-50 to-emerald-50/60", headerBg: "bg-white/85 border-gray-200" },
  rainy: { bg: "bg-gradient-to-br from-slate-200 via-blue-50 to-teal-100", headerBg: "bg-white/80 border-slate-200" },
  stormy: { bg: "bg-gradient-to-br from-slate-300 via-gray-200 to-emerald-100/60", headerBg: "bg-white/75 border-gray-300" },
};

function PlantedSummary({ slots, onClear }: { slots: PotSlot[]; onClear: (id: string) => void }) {
  const planted = slots.filter((s) => s.state !== "empty");
  if (!planted.length) return null;

  return (
    <Card className="p-3.5">
      <p className="kicker mb-2">Filled pots</p>
      <div className="flex flex-wrap gap-2">
        {planted.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="text-sm">{s.crop === "Rice" ? "🌾" : s.crop === "Corn" ? "🌽" : "🌶️"}</span>
            <div>
              <p className="text-xs font-black text-emerald-800">{s.crop}</p>
              <p className="text-[9px] font-bold text-emerald-600">{s.apy.toFixed(1)}% · {s.asset}</p>
            </div>
            <button
              type="button"
              onClick={() => onClear(s.id)}
              className="ml-1 rounded-full p-0.5 text-gray-400 transition hover:bg-white hover:text-red-400"
              aria-label={`Remove ${s.crop}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function toWeatherMood(mood?: "bullish" | "neutral" | "bearish"): WeatherMood {
  if (mood === "bullish") return "sunny";
  if (mood === "bearish") return "rainy";
  return "cloudy";
}

function marketLabel(weather: WeatherMood) {
  return weather === "sunny" ? "Bull" : weather === "cloudy" ? "Neutral" : weather === "rainy" ? "Bear" : "Crash";
}

function marketEmoji(weather: WeatherMood) {
  return weather === "sunny" ? "☀️" : weather === "cloudy" ? "⛅" : weather === "rainy" ? "🌧️" : "⛈️";
}

export default function LaunchAppPage() {
  const [view, setView] = useState<"canvas" | "shop" | "audit">("canvas");
  const [message, setMessage] = useState("I want a safe beginner move, plant 1000 gUSD first");
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<RiskLevel>(1);
  const [manualAddr, setManualAddr] = useState("0x1111111111111111111111111111111111111111");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<PotSlot[]>(INITIAL_SLOTS);

  const { address } = usePrivyWalletAddress();
  const garden = useGardenAgent();
  const gardenVault = useGardenRwaVault();

  const userAddress = useMemo(
    () => (address ?? manualAddr) as `0x${string}`,
    [address, manualAddr],
  );

  const data = garden.data;
  const onchainPositions = gardenVault.snapshot?.positions ?? [];
  const portfolioWeather = useMemo(() => {
    if (!onchainPositions.length) return null;
    const totalPrincipal = onchainPositions.reduce((sum, position) => sum + Number(position.principal), 0);
    const totalCurrent = onchainPositions.reduce((sum, position) => sum + Number(position.currentValue), 0);
    if (!totalPrincipal) return null;
    const ratio = totalCurrent / totalPrincipal;
    const weather = ratio > 1.03 ? "sunny" : ratio < 0.98 ? "rainy" : "cloudy";
    return {
      weather,
      label: marketLabel(weather),
      reason: `Onchain pots are ${((ratio - 1) * 100).toFixed(1)}% vs principal across ${onchainPositions.length} position${onchainPositions.length > 1 ? "s" : ""}.`,
    } as const;
  }, [onchainPositions]);

  const weather: WeatherMood = portfolioWeather?.weather ?? toWeatherMood(data?.marketMood.mood);
  const theme = pageTheme[weather];
  const plantedCount = slots.filter((s) => s.state !== "empty").length;
  const weatherReason = portfolioWeather?.reason ?? data?.marketMood.reason ?? "Live weather waits for a position to grow.";
  const gUsdBalance = gardenVault.snapshot?.tokenBalance ? Number(gardenVault.snapshot.tokenBalance).toFixed(2) : "0.00";
  const assistantContext: FarmerCompanionContext = useMemo(() => {
    const activePositions = onchainPositions.slice(0, 3).map((position) => ({
      id: position.positionId,
      title: `${position.cropKey === "steady" ? "Rice" : position.cropKey === "growth" ? "Corn" : "Chili"} #${position.positionId}`,
      value: `${position.currentValue}/${position.principal}`,
      status: position.harvested ? "Harvested" : "Growing",
    }));

    return {
      view,
      marketLabel: marketLabel(weather),
      weatherReason,
      gUsdBalance,
      plantedCount,
      positionCount: onchainPositions.length,
      activePositions,
      latestDecision: data?.decision.summary ?? data?.beginnerExplanation ?? null,
      proofRows,
      seedCatalog: crops.map((crop) => ({
        name: crop.name,
        price: crop.price,
        returnLabel: crop.returnLabel,
        asset: crop.asset,
        risk: crop.risk,
      })),
    };
  }, [data?.beginnerExplanation, data?.decision.summary, gUsdBalance, onchainPositions, plantedCount, view, weather, weatherReason]);

  const handleCropPick = useCallback((slotId: string, cropId: typeof CROP_OPTIONS[number]["id"]) => {
    const opt = CROP_OPTIONS.find((c) => c.id === cropId)!;
    const lvl: RiskLevel = cropId === "steady" ? 1 : cropId === "growth" ? 2 : 3;
    const apy = cropId === "steady" ? 5.2 : cropId === "growth" ? 9.6 : 17.6;

    setSlots((prev) => prev.map((s) =>
      s.id === slotId
        ? { ...s, strategyId: cropId, crop: opt.crop, asset: opt.asset, apy, health: 100, state: "planted" }
        : s,
    ));
    setSelectedId(null);

    setTimeout(() => {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, state: "growing" } : s)));
    }, 900);

    const intent = `tanam ${opt.crop} ${opt.asset} ${amount}`;
    setMessage(intent);
    setRisk(lvl);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: lvl, execute: false });
  }, [amount, userAddress, garden]);

  const handleClearSlot = useCallback((slotId: string) => {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...INITIAL_SLOTS.find((i) => i.id === slotId)! } : s)));
  }, []);

  const handleSlotClick = useCallback((slot: PotSlot) => {
    setSelectedId((prev) => (prev === slot.id ? null : slot.id));
  }, []);

  function handleFarmerAction(action: "plant" | "analyze" | "protect" | "harvest") {
    if (action === "analyze" || action === "plant" || action === "protect") {
      garden.mutate({ user: userAddress, message, amount, riskPreference: action === "protect" ? 1 : risk, execute: false });
    }
    if (action === "plant") {
      const cropKey = (garden.data?.intent.parsedStrategy ?? "steady") as GardenRwaCropKey;
      if (!gardenVault.canInteract) return;
      void gardenVault.plant({ cropKey, amount });
    }
    if (action === "harvest" && gardenVault.snapshot?.positions.length) {
      const nextPosition = gardenVault.snapshot.positions.find((position) => !position.harvested);
      if (nextPosition) {
        void gardenVault.harvest(nextPosition.positionId);
      }
    }
  }

  function handleFarmerMessage(msg: string) {
    setMessage(msg);
    garden.mutate({ user: userAddress, message: msg, amount, riskPreference: risk, execute: false });
  }

  return (
    <div className={`shell min-h-svh transition-colors duration-700 ${theme.bg}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-lg ${theme.headerBg}`}>
        <div className="mx-auto flex h-13 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="btn-ghost !p-2" aria-label="Back to home">
              <ArrowLeft className="size-4" />
            </Link>
            <Logo compact />
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              key={weather}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black sm:inline-flex ${
                weather === "sunny"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : weather === "cloudy"
                    ? "border-gray-200 bg-gray-100 text-gray-600"
                    : weather === "rainy"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span>{marketEmoji(weather)}</span>
              <span>{marketLabel(weather)}</span>
              <span className="text-[10px] opacity-60">· Mantle</span>
            </motion.span>
            <PrivyConnectButton compact />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="kicker">Gardenaz Audit Garden</p>
              <h1 className="mt-0.5 text-xl font-black tracking-tight text-[var(--text)] sm:text-2xl">
                {view === "canvas" ? "Garden canvas" : view === "shop" ? "Seed ledger" : "Proof room"}
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--text-muted)]">
                {view === "canvas"
                    ? "Pick a pot, plant a seed, and let Pak Tani work in the background."
                    : view === "shop"
                    ? "Compare seed rows by price, expected return, and risk."
                    : "Review positions, proof, and live onchain history."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                className="shrink-0 !py-2 !px-4"
                disabled={garden.isPending}
                onClick={() => garden.mutate({ user: userAddress, message, amount, riskPreference: risk, execute: false })}
              >
                <ShieldCheck className="size-4" />
                Plan safe move
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="shrink-0 !py-2 !px-4"
                disabled={!gardenVault.canInteract || gardenVault.isFauceting}
                onClick={() => gardenVault.faucet("1000")}
              >
                <Sprout className="size-4" />
                Top up gUSD
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="canvas">Canvas</TabsTrigger>
                <TabsTrigger value="shop">Seed shop</TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[var(--surface-soft)] text-[var(--text-muted)]">{marketLabel(weather)}</Badge>
              <Badge className="bg-[var(--surface-soft)] text-[var(--text-muted)]">{plantedCount} pots</Badge>
              <Badge className="bg-[var(--surface-soft)] text-[var(--text-muted)]">
                gUSD {gardenVault.snapshot?.tokenBalance ? Number(gardenVault.snapshot.tokenBalance).toFixed(0) : "0"}
              </Badge>
            </div>
          </div>
        </Card>

        <Tabs value={view} onValueChange={(value) => setView(value as typeof view)} className="mt-4">
          <TabsContent value="canvas" className="mt-0">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="overflow-hidden p-0">
                <div className="p-3 sm:p-4">
                  <FarmScene
                    weather={weather}
                    slots={slots}
                    agentData={data}
                    onSlotClick={handleSlotClick}
                    onCropPick={handleCropPick}
                    selectedSlotId={selectedId}
                    isLoading={garden.isPending}
                  />
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-4">
                  <p className="kicker">Quick plant</p>
                  <div className="mt-3 grid gap-2">
                    {CROP_OPTIONS.map((opt) => (
                      <Button
                        key={opt.id}
                        type="button"
                        variant={opt.id === "steady" ? "primary" : "secondary"}
                        className="justify-between"
                        onClick={() => {
                          const slot = slots.find((item) => item.state === "empty")?.id;
                          if (!slot) return;
                          handleCropPick(slot, opt.id);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span>{opt.emoji}</span>
                          {opt.crop}
                        </span>
                        <span className="text-xs opacity-80">{opt.apy}</span>
                      </Button>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="kicker">Action bar</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button type="button" variant="primary" onClick={() => setView("shop")}>
                      Open seed shop
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setView("audit")}>
                      Review proof
                    </Button>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                    The canvas stays simple. Details live in Shop and Audit.
                  </p>
                </Card>
              </div>
            </div>

            <AnimatePresence>
              {plantedCount > 0 && (
                <div className="mt-4">
                  <PlantedSummary slots={slots} onClear={handleClearSlot} />
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="shop" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-4">
                <CropGridSection />
              </div>
              <div className="space-y-4">
                <GardenRwaVaultSection agentData={data} amount={amount} className="p-4" />
                <Card className="p-4">
                  <p className="kicker">Shop tip</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    Keep the choice count small. Three seeds are enough for beginners: Rice, Corn, Chili.
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="p-4">
                <p className="kicker">Decision diary</p>
                <h3 className="mt-0.5 mb-3 text-sm font-black text-[var(--text)]">Live agent history</h3>
                <AgentHistorySection />
              </Card>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="orb-teal grid size-9 shrink-0 place-items-center rounded-xl text-white">
                      <Fingerprint className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="kicker">Agent Identity</p>
                      <h3 className="text-sm font-black text-[var(--text)]">ERC-8004 Ready</h3>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {proofRows.map(([label, value]) => (
                      <div key={label} className="card-soft px-3 py-2">
                        <p className="kicker">{label}</p>
                        <p className="mt-0.5 truncate text-xs font-bold text-[var(--text)]">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <GardenRwaVaultSection agentData={data} amount={amount} className="p-4" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FarmerCompanion
        weather={weather}
        agentData={data}
        pageContext={assistantContext}
        isPending={garden.isPending}
        onSendMessage={handleFarmerMessage}
        onAction={handleFarmerAction}
      />
    </div>
  );
}
