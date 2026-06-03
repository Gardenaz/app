"use client";

import Link from "next/link";
import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Loader2,
  Play,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { AgentPlannerSection } from "@/components/sections/agent-planner";
import {
  FarmScene,
  INITIAL_SLOTS,
  CROP_OPTIONS,
  type PotSlot,
  type WeatherMood,
} from "@/components/sections/farm-scene";
import { FarmerCompanion } from "@/components/base/farmer-companion";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { useGardenAgent } from "@/hooks/use-garden-agent";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { proofRows, strategies } from "@/lib/gardena-content";
import type { RiskLevel } from "@/lib/agent/types";

/* ── Weather background themes ────────────────────────────────── */
const pageTheme: Record<WeatherMood, { bg: string; headerBg: string }> = {
  sunny:  { bg: "bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-50",          headerBg: "bg-white/90 border-emerald-100"  },
  cloudy: { bg: "bg-gradient-to-br from-slate-100 via-gray-50 to-emerald-50/60",    headerBg: "bg-white/85 border-gray-200"     },
  rainy:  { bg: "bg-gradient-to-br from-slate-200 via-blue-50 to-teal-100",         headerBg: "bg-white/80 border-slate-200"    },
  stormy: { bg: "bg-gradient-to-br from-slate-300 via-gray-200 to-emerald-100/60",  headerBg: "bg-white/75 border-gray-300"     },
};

/* ── Planted slot summary strip ────────────────────────────────── */
function PlantedSummary({ slots, onClear }: { slots: PotSlot[]; onClear: (id: string) => void }) {
  const planted = slots.filter((s) => s.state !== "empty");
  if (!planted.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-lg p-3.5">
      <p className="kicker mb-2">Pot terisi</p>
      <div className="flex flex-wrap gap-2">
        {planted.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="text-sm">{s.crop === "Rice" ? "🌾" : s.crop === "Corn" ? "🌽" : "🌶️"}</span>
            <div>
              <p className="text-xs font-black text-emerald-800">{s.crop}</p>
              <p className="text-[9px] font-bold text-emerald-600">{s.apy.toFixed(1)}% · {s.asset}</p>
            </div>
            <button type="button" onClick={() => onClear(s.id)}
              className="ml-1 rounded-full p-0.5 text-gray-400 transition hover:bg-white hover:text-red-400"
              aria-label={`Hapus ${s.crop}`}>✕</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function LaunchAppPage() {
  const [message,    setMessage]    = useState("pemula mau aman, tanam 1000 USDY dulu");
  const [amount,     setAmount]     = useState("1000");
  const [risk,       setRisk]       = useState<RiskLevel>(1);
  const [manualAddr, setManualAddr] = useState("0x1111111111111111111111111111111111111111");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots,      setSlots]      = useState<PotSlot[]>(INITIAL_SLOTS);

  const { address } = usePrivyWalletAddress();
  const garden      = useGardenAgent();

  const userAddress = useMemo(
    () => (address ?? manualAddr) as `0x${string}`,
    [address, manualAddr],
  );

  const data       = garden.data;
  const rawWeather = data?.simulation.weather ?? "sunny";
  const weather: WeatherMood =
    rawWeather === "rainy"
      ? data?.marketMood.mood === "bearish" ? "rainy" : "cloudy"
      : rawWeather === "cloudy" ? "cloudy" : "sunny";

  const theme        = pageTheme[weather];
  const plantedCount = slots.filter((s) => s.state !== "empty").length;

  /* Crop pick — fill a pot + fire agent */
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

    // growing after 900ms
    setTimeout(() => {
      setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, state: "growing" } : s));
    }, 900);

    const intent = `tanam ${opt.crop} ${opt.asset} ${amount}`;
    setMessage(intent);
    setRisk(lvl);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: lvl, execute: false });
  }, [amount, userAddress, garden]);

  /* Clear pot */
  const handleClearSlot = useCallback((slotId: string) => {
    setSlots((prev) => prev.map((s) =>
      s.id === slotId ? { ...INITIAL_SLOTS.find((i) => i.id === slotId)! } : s,
    ));
  }, []);

  /* Select / deselect */
  const handleSlotClick = useCallback((slot: PotSlot) => {
    setSelectedId((prev) => prev === slot.id ? null : slot.id);
  }, []);

  function handleFarmerAction(action: "plant" | "analyze" | "protect" | "harvest") {
    if (action === "analyze" || action === "plant") {
      garden.mutate({ user: userAddress, message, amount, riskPreference: risk, execute: false });
    }
  }
  function handleFarmerMessage(msg: string) {
    setMessage(msg);
    garden.mutate({ user: userAddress, message: msg, amount, riskPreference: risk, execute: false });
  }

  return (
    <div className={`shell min-h-svh transition-colors duration-700 ${theme.bg}`}>
      {/* ── Nav ── */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-lg ${theme.headerBg}`}>
        <div className="mx-auto flex h-13 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="btn-ghost !p-2" aria-label="Back to home"><ArrowLeft className="size-4" /></Link>
            <Logo compact />
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span key={weather}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black sm:inline-flex ${
                  weather === "sunny" ? "border-amber-200 bg-amber-50 text-amber-700"
                  : weather === "cloudy" ? "border-gray-200 bg-gray-100 text-gray-600"
                  : weather === "rainy" ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-red-200 bg-red-50 text-red-700"}`}>
                <span>{weather === "sunny" ? "☀️" : weather === "cloudy" ? "⛅" : weather === "rainy" ? "🌧️" : "⛈️"}</span>
                <span>{weather === "sunny" ? "Bull" : weather === "cloudy" ? "Neutral" : weather === "rainy" ? "Bear" : "Crash"}</span>
                <span className="text-[10px] opacity-60">· Mantle</span>
              </motion.span>
            </AnimatePresence>
            <PrivyConnectButton compact />
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
        {/* Farm scene */}
        <div className="mb-4">
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

        {/* Planted summary strip */}
        <AnimatePresence>
          {plantedCount > 0 && (
            <div className="mb-4">
              <PlantedSummary slots={slots} onClear={handleClearSlot} />
            </div>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">

          {/* ── Left column ── */}
          <div className="min-w-0 space-y-4">

            {/* Compact stat bar */}
            <div className="card-lg p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="kicker">Garden Console</p>
                  <h1 className="mt-0.5 text-xl font-black tracking-tight text-[var(--text)] sm:text-2xl">
                    RWA Farm{" "}
                    <span className="font-normal text-[var(--text-muted)]">
                      — {weather === "sunny" ? "☀️ Cerah" : weather === "cloudy" ? "⛅ Mendung" : weather === "rainy" ? "🌧️ Hujan" : "⛈️ Badai"}
                    </span>
                  </h1>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {plantedCount === 0
                      ? "Klik pot kosong di atas untuk mulai tanam."
                      : `${plantedCount} dari 5 pot terisi — klik pot untuk ganti crop.`}
                  </p>
                </div>
                <button type="button" className="btn-primary shrink-0 !py-2 !px-4"
                  disabled={garden.isPending}
                  onClick={() => garden.mutate({ user: userAddress, message, amount, riskPreference: risk, execute: false })}>
                  {garden.isPending ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                  {garden.isPending ? "Analisa..." : "Run autopilot"}
                </button>
              </div>

              {/* Metrics row */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: "Pot terisi", value: `${plantedCount} / 5` },
                  { label: "Benchmark",  value: "+5.2% APY" },
                  { label: "Market",     value: data?.marketMood.mood ?? "—" },
                  { label: "Status",     value: data ? "Planned" : "Dry-run" },
                ].map((m) => (
                  <div key={m.label} className="card-soft px-3 py-2.5">
                    <p className="kicker">{m.label}</p>
                    <p className="mt-0.5 text-sm font-black capitalize text-[var(--text)]">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Agent input console ── */}
            <div className="card-lg p-4 sm:p-5">
              <p className="kicker">Instruksi ke Petani</p>
              <h2 className="mt-0.5 text-lg font-black text-[var(--text)]">Playable Agent Console</h2>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="kicker mb-1 block">Wallet</label>
                  <input
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-teal-400/30"
                    value={userAddress}
                    onChange={(e) => setManualAddr(e.target.value)}
                    disabled={Boolean(address)}
                  />
                </div>
                <div>
                  <label className="kicker mb-1 block">Intent</label>
                  <textarea
                    className="min-h-[72px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-medium leading-5 outline-none focus:ring-2 focus:ring-teal-400/30"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contoh: mau tanam aman 1000 USDY, risk rendah..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="kicker mb-1 block">Jumlah</label>
                    <input
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-teal-400/30"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="kicker mb-1 block">Risk</label>
                    <select
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-teal-400/30"
                      value={risk}
                      onChange={(e) => setRisk(Number(e.target.value) as RiskLevel)}
                    >
                      <option value={1}>1 — Safe 🟢</option>
                      <option value={2}>2 — Growth 🟡</option>
                      <option value={3}>3 — Boost 🔴</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary mt-4 w-full justify-center"
                disabled={garden.isPending}
                onClick={() =>
                  garden.mutate({ user: userAddress, message, amount, riskPreference: risk, execute: false })
                }
              >
                {garden.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="size-4" aria-hidden="true" />}
                {garden.isPending ? "Petani lagi analisa…" : "Plan safe move"}
              </button>

              {garden.isError && (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                  {(garden.error as Error).message}
                </p>
              )}
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5"
                >
                  <p className="font-mono text-[11px] font-black text-emerald-700">
                    ✅ {data.simulation.actionLabel} · {data.decision.decisionHash.slice(0, 10)}…
                  </p>
                  {data.marketMood.reason && (
                    <p className="mt-1 text-[11px] leading-5 text-emerald-600">{data.marketMood.reason}</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Strategy cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {strategies.map((s, i) => {
                const bar   = ["bg-emerald-400", "bg-amber-400", "bg-red-400"][i];
                const badge = ["bg-emerald-50 text-emerald-700", "bg-amber-50 text-amber-700", "bg-red-50 text-red-700"][i];
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="card overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
                  >
                    <div className={`h-1 w-full ${bar}`} />
                    <div className="p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${badge}`}>{s.risk}</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">{s.asset}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-black text-[var(--text)]">{s.name}</h3>
                      <p className="text-base font-black text-teal-700">{s.apy} APY</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{s.desc}</p>
                      <Link href="#agent-planner" className="btn-secondary mt-3 w-full !py-1.5 text-xs">
                        Use strategy <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Agent planner */}
            <div id="agent-planner">
              <p className="kicker mb-1">Planner</p>
              <h2 className="mb-3 text-lg font-black text-[var(--text)]">Agent configuration</h2>
              <AgentPlannerSection />
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="min-w-0 space-y-4">

            {/* Crop guide */}
            <div className="card-lg p-4">
              <p className="kicker">Panduan Crop</p>
              <h3 className="mt-0.5 mb-3 text-sm font-black text-[var(--text)]">3 pilihan sesuai kondisi pasar</h3>
              <div className="space-y-2">
                {CROP_OPTIONS.map((opt) => {
                  const isRec = opt.recommended(weather);
                  return (
                    <div key={opt.id} className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      isRec ? "border-teal-200 bg-teal-50/60" : "border-[var(--border)] bg-[var(--surface-soft)]"}`}>
                      <span className="shrink-0 text-xl">{opt.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-[var(--text)]">{opt.crop}</p>
                          {isRec && <span className="rounded-full bg-teal-500 px-1.5 py-px text-[8px] font-black text-white">Cocok sekarang</span>}
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)]">{opt.asset} · {opt.apy}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black ${opt.riskColor}`}>{opt.risk}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-[10px] leading-4 text-[var(--text-muted)]">
                💡 Klik pot kosong di garden untuk tanam, atau tanya <strong>Pak Tani</strong> buat rekomendasi.
              </p>
            </div>

            {/* Agent identity */}
            <div className="card-lg p-4">
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
                {proofRows.map(([lbl, val]) => (
                  <div key={lbl} className="card-soft px-3 py-2">
                    <p className="kicker">{lbl}</p>
                    <p className="mt-0.5 truncate text-xs font-bold text-[var(--text)]">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market weather */}
            <div className="card-lg p-4">
              <p className="kicker">Market Weather</p>
              <h3 className="mt-0.5 text-sm font-black text-[var(--text)]">
                {weather === "sunny" ? "☀️ Cerah — Bull" : weather === "cloudy" ? "⛅ Mendung — Neutral"
                  : weather === "rainy" ? "🌧️ Hujan — Bear" : "⛈️ Badai — Crash"}
              </h3>
              {data?.marketMood.reason && (
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-muted)]">{data.marketMood.reason}</p>
              )}
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {(["sunny","cloudy","rainy"] as const).map((w) => (
                  <div key={w} className={`rounded-xl p-2 text-center transition ${
                    weather === w ? "border border-teal-300 bg-teal-100" : "border border-transparent bg-[var(--surface-soft)]"}`}>
                    <p className="text-lg">{w === "sunny" ? "☀️" : w === "cloudy" ? "⛅" : "🌧️"}</p>
                    <p className="text-[9px] font-black text-gray-600">{w === "sunny" ? "Bull" : w === "cloudy" ? "Neutral" : "Bear"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmer diary */}
            <div className="card-lg p-4">
              <p className="kicker">AI Farmer Diary</p>
              <h3 className="mt-0.5 mb-3 text-sm font-black text-[var(--text)]">Latest decisions</h3>
              <div className="space-y-1.5">
                <DiaryEntry icon={<CheckCircle2 className="size-4 text-emerald-600" />}
                  title={data?.simulation.actionLabel ?? "USDY Harvest Approved"}
                  text={data?.beginnerExplanation ?? "Policy allowed Rice route. Decision hash prepared."} />
                <DiaryEntry icon={<ShieldCheck className="size-4 text-amber-500" />}
                  title="mETH Rebalance Paused" text="Volatility exceeded user risk preference." />
                <DiaryEntry icon={<Wallet className="size-4 text-[var(--primary)]" />}
                  title="Proof Card Ready" text="Shareable consumer proof includes crop, asset, and tx hash." />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FarmerCompanion
        weather={weather} agentData={data} isPending={garden.isPending}
        onSendMessage={handleFarmerMessage} onAction={handleFarmerAction}
      />
    </div>
  );
}

/* ── DiaryEntry ────────────────────────────────────────────────── */
function DiaryEntry({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card-soft p-3">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <span className="text-xs font-black text-[var(--text)]">{title}</span>
      </div>
      <p className="text-xs leading-5 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}
