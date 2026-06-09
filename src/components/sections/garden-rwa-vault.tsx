"use client";

import { Loader2, ShieldCheck, Sprout, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGardenRwaVault } from "@/hooks/use-garden-rwa-vault";
import type { GardenRwaCropKey } from "@/lib/contracts/garden-rwa";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

type Props = {
  agentData?: GardenAgentResult | null;
  amount: string;
  className?: string;
};

function cropLabel(cropKey: GardenRwaCropKey) {
  return cropKey === "steady"
    ? "Safe lane for USDY"
    : cropKey === "growth"
      ? "Growth lane for mETH"
      : "Dynamic lane for active rebalancing";
}

function shortAddress(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not ready";
}

function formatTxError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Preview state is unavailable right now.";
}

export function GardenRwaVaultSection({ agentData, amount, className }: Props) {
  const { snapshot, walletAddress, isLoading, error } = useGardenRwaVault();
  const recommendedCrop = (agentData?.intent.parsedStrategy ?? "steady") as GardenRwaCropKey;
  const livePolicyReady = Boolean(snapshot?.policyEnabled && !snapshot?.policyPaused);
  const liveIdentityReady = Boolean(snapshot?.hasAgentIdentity);

  const setupSteps = [
    {
      title: "Connect wallet",
      body: walletAddress
        ? `Dompetmu sudah tersambung di Mantle Sepolia sebagai ${shortAddress(walletAddress)}.`
        : "Sambungkan dompet agar Gardenaz bisa membaca kebunmu sebelum agen memberi saran.",
      ready: Boolean(walletAddress),
    },
    {
      title: "Set policy",
      body: livePolicyReady
        ? `Policy on-chain sudah hidup${snapshot?.policyVersion ? ` (v${snapshot.policyVersion})` : ""}, jadi batas amanmu sudah terbaca.`
        : "Atur pagar risiko lebih dulu. Di fase ini kami hanya menampilkan status policy, bukan tombol eksekusi palsu.",
      ready: livePolicyReady,
    },
    {
      title: "Preview move",
      body: agentData
        ? `Agen saat ini condong ke ${cropLabel(recommendedCrop).toLowerCase()} untuk sekitar ${amount} dengan bahasa yang tetap ramah pemula.`
        : "Minta rencana dari agen untuk melihat saran tanam pertama sebelum alur approval dan eksekusi Agni dibuka.",
      ready: Boolean(agentData),
    },
  ];

  return (
    <section className={className ?? "card-lg p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker">Agni Garden Preview</p>
          <h3 className="mt-0.5 text-sm font-black text-[var(--text)]">
            Hubungkan dompet, pasang pagar risiko, lalu lihat rencana tanam AI tanpa layar lama yang menyesatkan.
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--text-muted)]">
            Gardenaz sedang dipindahkan ke alur Agni-first untuk USDY dan mETH. Fase ini jujur: kami baru menampilkan
            wallet, policy, dan preview langkah sebelum approval dan execute move dihidupkan.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--text-muted)]">
          Preview only
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Wallet</p>
          <p className="mt-1 text-sm font-black text-[var(--text)]">{walletAddress ? "Connected" : "Waiting"}</p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-subtle)]">{shortAddress(walletAddress)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Policy</p>
          <p className="mt-1 text-sm font-black text-[var(--text)]">
            {livePolicyReady ? "Guardrails live" : snapshot?.configured ? "Needs setup" : "Contracts missing"}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-subtle)]">
            {snapshot?.policyPaused ? "Paused on-chain" : snapshot?.policyVersion ? `Version ${snapshot.policyVersion}` : "Preview checks only"}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="kicker">Proof</p>
          <p className="mt-1 text-sm font-black text-[var(--text)]">{liveIdentityReady ? "Identity ready" : "Identity pending"}</p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-subtle)]">
            Decision log {snapshot?.decisionLogAddress ? "connected" : "not wired"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--surface-soft)] p-2 text-[var(--text)]">
              <Sprout className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="kicker">Recommended lane</p>
              <p className="mt-1 text-sm font-black text-[var(--text)]">{cropLabel(recommendedCrop)}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                {agentData?.beginnerExplanation ??
                  "Belum ada rencana terbaru. Saat agen selesai membaca suasana pasar, kartu ini akan menjelaskan langkah tanam berikutnya dengan bahasa kebun."}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--surface-soft)] p-2 text-[var(--text)]">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="kicker">What is still coming</p>
              <p className="mt-1 text-sm font-black text-[var(--text)]">Approval and execute move stay disabled in this phase</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Tidak ada tombol pendanaan atau kontrol agen palsu di layar ini. Saat jalur Agni live siap, bagian ini akan berubah menjadi approval token dan execute move yang nyata.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {setupSteps.map((step, index) => (
          <div key={step.title} className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3">
            <p className="kicker">Step {index + 1}</p>
            <div className="mt-1 flex items-center gap-2">
              {index === 0 ? <WalletCards className="size-4 text-[var(--text-subtle)]" /> : <Sprout className="size-4 text-[var(--text-subtle)]" />}
              <p className="text-sm font-black text-[var(--text)]">{step.title}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{step.body}</p>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              {step.ready ? "Ready" : "Pending"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
        <p className="kicker">Live anchors</p>
        <div className="mt-2 grid gap-2 text-[11px] leading-5 text-[var(--text-subtle)] md:grid-cols-3">
          <p>AgentIdentity: {shortAddress(snapshot?.agentIdentityAddress)}</p>
          <p>AutopilotPolicy: {shortAddress(snapshot?.autopilotPolicyAddress)}</p>
          <p>DecisionLog: {shortAddress(snapshot?.decisionLogAddress)}</p>
        </div>
      </div>

      {isLoading && !snapshot && (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
            <Loader2 className="size-4 animate-spin" />
            Reading wallet and policy preview...
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Checking whether the Agni-first trust layer is visible on Mantle Sepolia.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
          {formatTxError(error)}
        </p>
      )}
    </section>
  );
}
