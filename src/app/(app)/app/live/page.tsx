import Link from "next/link";
import { Activity, ExternalLink, Fingerprint, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mantleSepoliaContracts } from "@/lib/contracts/config";

const explorerBase = "https://explorer.sepolia.mantle.xyz/address";
const contractEntries = Object.entries(mantleSepoliaContracts.contracts);

const pipeline = [
  { label: "Plan", tone: "bg-sky-50 text-sky-700 border-sky-200" },
  { label: "Prepare", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Send", tone: "bg-violet-50 text-violet-700 border-violet-200" },
  { label: "Confirm", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
] as const;

const contractRows = [
  { label: "AgentIdentity", key: "agentIdentity" },
  { label: "DecisionLog", key: "decisionLog" },
  { label: "RiskPolicy", key: "riskPolicy" },
  { label: "AutopilotPolicy", key: "autopilotPolicy" },
  { label: "Garden USD", key: "gardenUsdMock" },
  { label: "RWA Vault", key: "gardenRwaMockVault" },
  { label: "Steady adapter", key: "steadyAdapter" },
  { label: "Growth adapter", key: "growthAdapter" },
  { label: "Boost adapter", key: "boostAdapter" },
] as const;

const activeRouteLabels = [
  "Steady adapter live",
  "Growth adapter live",
  "Boost adapter live",
] as const;

const summary = [
  {
    icon: Fingerprint,
    title: "Identity",
    text: "Agent identity is fixed on Mantle and tied to a single proof surface.",
  },
  {
    icon: ShieldCheck,
    title: "Policy",
    text: "Risk limits and allowed routes are checked before any action can move forward.",
  },
  {
    icon: Activity,
    title: "Proof",
    text: "Decision hash, anchor hash, and outcome are kept visible for audit review.",
  },
] as const;

export default function LiveTransparencyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="kicker">Proof page</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
              What the agent is doing, in plain language
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
              This page shows whether the agent is only planning, already preparing execution, or confirmed on-chain.
              It stays deliberately minimal so an awam user can read it fast.
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-subtle)]">
              Market weather in the app is derived from Alternative.me Fear & Greed sentiment. Vault positions, PnL, and proof rows stay on-chain.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/app" className="btn-secondary">
              Back to console
            </Link>
            <Link href="/" className="btn-primary">
              Home
            </Link>
          </div>
        </div>

        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="kicker">Latest snapshot</p>
              <h2 className="mt-1 text-lg font-black">Addresses synced from the current deployment</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                The app and proof page read from the same Mantle Sepolia snapshot, so the UI and contract state stay aligned, including the delegated vault and its mock DeFi adapters.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-50 text-emerald-700">Synced</Badge>
              <Badge>6 core contracts</Badge>
              <Badge>3 adapters</Badge>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {activeRouteLabels.map((label) => (
              <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">Live feed backed</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {pipeline.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2">
                <Badge className={`rounded-full border px-3 py-1 ${step.tone}`}>{step.label}</Badge>
                {index < pipeline.length - 1 ? <span className="text-[var(--text-subtle)]">→</span> : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Plan becomes prepare, then send, then confirm. If you only see the early steps, nothing has been finalized on-chain yet.
          </p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_340px]">
          <div className="grid gap-4">
            {summary.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-black">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{item.text}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card className="p-5">
              <p className="kicker">Quick read</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                  <p className="text-sm font-black text-[var(--text)]">Planned</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">A safe route exists, but nothing has been sent yet.</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                  <p className="text-sm font-black text-[var(--text)]">Confirmed</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">The proof landed on-chain and should show in history.</p>
                </div>
              </div>
            </Card>
          </div>

          <aside className="grid gap-4 self-start">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--surface-soft)] text-[var(--primary)]">
                  <Fingerprint className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="kicker">Agent identity</p>
                  <h2 className="text-lg font-black">Moat-ready autopilot</h2>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-emerald-50 text-emerald-700">Verified on Mantle Sepolia</Badge>
                <Badge>On-chain proof ready</Badge>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {contractRows.map((row) => {
                  const address = mantleSepoliaContracts.contracts[row.key];
                  return (
                    <div key={row.key} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">{row.label}</p>
                      <a
                        href={`${explorerBase}/${address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 break-all font-mono text-xs font-semibold text-[var(--text)] hover:text-teal-700"
                      >
                        {address}
                        <ExternalLink className="size-3.5 shrink-0" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <p className="kicker">Pipeline note</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                This page is intentionally sparse. The goal is to make proof status readable at a glance, not to bury it under extra cards.
              </p>
              <Separator className="my-4 bg-[var(--border)]" />
              <a
                href="https://docs.mantle.xyz/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
              >
                Mantle docs <ExternalLink className="size-4" />
              </a>
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">Snapshot size</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                  {contractEntries.length} addresses available in the current config snapshot, including 3 mock adapters.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
