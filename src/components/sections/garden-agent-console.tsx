"use client";

import { useMemo, useState } from "react";
import { CloudRain, Loader2, ShieldCheck, Sprout, Sun } from "lucide-react";
import { useGardenAgent } from "@/hooks/use-garden-agent";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import type { RiskLevel } from "@/lib/agent/types";

const fallbackSlots = [
  { strategyId: "steady-rwa-usdy", title: "Rice / Safe Harvest", crop: "Rice", apy: 5.2, health: 92, selected: true },
  { strategyId: "growth-meth-yield", title: "Corn / Growth Field", crop: "Corn", apy: 9.6, health: 86, selected: false },
  { strategyId: "boost-rwa-meth-dynamic", title: "Chili / Boost Farm", crop: "Chili", apy: 17.6, health: 72, selected: false },
];

const moods = {
  sunny: { label: "Sunny", icon: Sun, tone: "text-[#166534]", bg: "bg-[#eef8ee]" },
  cloudy: { label: "Cloudy", icon: Sprout, tone: "text-[#525252]", bg: "bg-[#f5f1e8]" },
  rainy: { label: "Rainy", icon: CloudRain, tone: "text-[#1d4ed8]", bg: "bg-[#edf2f7]" },
} as const;

export function GardenAgentConsole() {
  const [message, setMessage] = useState("pemula mau aman, tanam 1000 USDY dulu");
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<RiskLevel>(1);
  const [manualAddr, setManualAddr] = useState("0x1111111111111111111111111111111111111111");
  const { address } = usePrivyWalletAddress();
  const garden = useGardenAgent();

  const userAddress = useMemo(() => (address ?? manualAddr) as `0x${string}`, [address, manualAddr]);
  const data = garden.data;
  const slots = data?.simulation.potSlots.length ? data.simulation.potSlots : fallbackSlots;
  const weather = data?.simulation.weather ?? "sunny";
  const mood = moods[weather];
  const WeatherIcon = mood.icon;

  return (
    <section className="rounded-[28px] border border-[#161616] bg-[#f8f3e7] p-3 shadow-[8px_8px_0_#161616] sm:p-4">
      <div className="rounded-[22px] border border-[#161616] bg-[#fffdf8] p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#6b5f48]">Playable Garden Agent</p>
                <h2 className="mt-2 max-w-xl text-2xl font-black leading-tight tracking-[-0.04em] text-[#111111] sm:text-4xl">
                  Paper garden. Real agent plan.
                </h2>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border border-[#161616] ${mood.bg} px-3 py-2 font-mono text-xs font-black ${mood.tone}`}>
                <WeatherIcon className="size-4" aria-hidden="true" /> {mood.label} market
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#161616] bg-[#e8f3df] p-3 shadow-inner">
              <div className="relative min-h-[245px] overflow-hidden rounded-[18px] border border-[#161616] bg-[#f6efd9]">
                <div className="absolute inset-x-0 top-0 h-24 bg-[repeating-linear-gradient(0deg,rgba(17,17,17,0.04)_0_1px,transparent_1px_9px)]" />
                <div className="absolute inset-x-4 bottom-5 grid grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <div key={slot.strategyId} className={`rounded-[18px] border border-[#161616] bg-[#fffdf8] p-3 text-center shadow-[4px_4px_0_#161616] ${slot.selected ? "-translate-y-3" : ""}`}>
                      <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#161616] bg-[#dff0d3]">
                        <Sprout className="size-7 text-[#166534]" aria-hidden="true" />
                      </div>
                      <p className="mt-2 text-sm font-black text-[#111111]">{slot.crop}</p>
                      <p className="font-mono text-[10px] font-bold uppercase text-[#6b5f48]">{slot.apy.toFixed(2)}% APY · {slot.health}%</p>
                    </div>
                  ))}
                </div>
                <div className="absolute left-4 top-4 max-w-[230px] rounded-2xl border border-[#161616] bg-[#fffdf8] p-3 shadow-[4px_4px_0_#161616]">
                  <p className="font-mono text-[10px] font-bold uppercase text-[#6b5f48]">Farmer says</p>
                  <p className="mt-1 text-sm font-bold leading-5 text-[#111111]">
                    {data?.beginnerExplanation ?? "Ask intent. Agent maps market into crop, weather, and guarded plan."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#161616] bg-[#ffffff] p-4 shadow-[6px_6px_0_#161616]">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl border border-[#161616] bg-[#111111] text-white">農</div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5f48]">Agent input</p>
                <h3 className="text-lg font-black text-[#111111]">Ask farmer</h3>
              </div>
            </div>

            <label className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5f48]">Wallet</label>
            <input className="mt-1 w-full rounded-xl border border-[#161616] bg-[#fffdf8] px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[#16A34A]/30" value={userAddress} onChange={(e) => setManualAddr(e.target.value)} disabled={Boolean(address)} />

            <label className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5f48]">Intent</label>
            <textarea className="mt-1 min-h-24 w-full rounded-xl border border-[#161616] bg-[#fffdf8] px-3 py-2 text-sm font-bold leading-5 outline-none focus:ring-2 focus:ring-[#16A34A]/30" value={message} onChange={(e) => setMessage(e.target.value)} />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5f48]">Amount</label>
                <input className="mt-1 w-full rounded-xl border border-[#161616] bg-[#fffdf8] px-3 py-2 font-mono text-sm outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5f48]">Risk</label>
                <select className="mt-1 w-full rounded-xl border border-[#161616] bg-[#fffdf8] px-3 py-2 font-mono text-sm outline-none" value={risk} onChange={(e) => setRisk(Number(e.target.value) as RiskLevel)}>
                  <option value={1}>1 Safe</option>
                  <option value={2}>2 Growth</option>
                  <option value={3}>3 Boost</option>
                </select>
              </div>
            </div>

            <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#161616] bg-[#111111] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0_#16A34A] transition hover:-translate-y-0.5 disabled:opacity-60" disabled={garden.isPending} onClick={() => garden.mutate({ user: userAddress, message, amount, riskPreference: risk, execute: false })}>
              {garden.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Plan safe move
            </button>

            {garden.isError && <p className="mt-3 rounded-xl border border-red-700 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{(garden.error as Error).message}</p>}
            {data && <p className="mt-3 rounded-xl border border-[#161616] bg-[#eef8ee] px-3 py-2 font-mono text-[11px] font-bold text-[#166534]">{data.simulation.actionLabel} · {data.decision.decisionHash.slice(0, 10)}…</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
