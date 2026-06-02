import Link from "next/link";
import { Activity, BrainCircuit, CheckCircle2, ExternalLink, Fingerprint, Radio, ShieldCheck, Sprout } from "lucide-react";
import { mantleSepoliaContracts } from "@/lib/contracts/config";

const events = [
  {
    title: "ERC-8004 identity minted",
    detail: "Gardena Autopilot Agent registered as agentId 1 with an ERC-721 identity NFT.",
    status: "verified",
    icon: Fingerprint,
  },
  {
    title: "LLM advisor reasoning",
    detail: "LangGraph calls the AI advisor node for market summary, risk notes, and strategy recommendation.",
    status: "live",
    icon: BrainCircuit,
  },
  {
    title: "Deterministic policy gate",
    detail: "Risk level, max amount, allowed protocols, and rebalance interval are checked before action.",
    status: "enforced",
    icon: ShieldCheck,
  },
  {
    title: "Decision benchmark",
    detail: "DecisionLog stores decision hash, strategy, amount, risk level, and target protocol on Mantle.",
    status: "on-chain",
    icon: Activity,
  },
  {
    title: "Real RWA execution path",
    detail: "Execution adapter can prepare guarded Odos routes for USDY/mETH on Mantle mainnet.",
    status: "guarded",
    icon: Sprout,
  },
  {
    title: "Outcome benchmark",
    detail: "Execution result can be recorded back to DecisionLog as outcome metadata, output amount, and tx hash.",
    status: "ready",
    icon: CheckCircle2,
  },
];

export default function LiveTransparencyPage() {
  return (
    <main className="min-h-screen bg-white text-[var(--text)]">
      <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">Radical transparency</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
              Live AI x RWA benchmark feed
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Every agent step is designed to be observable: identity, reasoning, policy gate, decision proof, execution route, and outcome benchmark.
            </p>
          </div>
          <Link href="/app" className="btn-primary">
            Back to console
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="card-lg p-5">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-teal-600" />
              <h2 className="text-lg font-black">Agent timeline</h2>
            </div>
            <div className="mt-5 space-y-3">
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.title} className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-black">{event.title}</h3>
                          <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-teal-700">
                            {event.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{event.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-lg p-5">
              <p className="kicker">ERC-8004 agent</p>
              <h2 className="mt-2 text-xl font-black">Gardena Autopilot Agent</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--text-muted)]">Agent ID</dt>
                  <dd className="font-mono font-bold">1</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">Identity NFT</dt>
                  <dd className="break-all font-mono text-xs font-bold">{mantleSepoliaContracts.contracts.agentIdentity}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">DecisionLog</dt>
                  <dd className="break-all font-mono text-xs font-bold">{mantleSepoliaContracts.contracts.decisionLog}</dd>
                </div>
              </dl>
            </div>

            <div className="card-lg p-5">
              <p className="kicker">Tool surface</p>
              <h2 className="mt-2 text-xl font-black">MCP-style tools</h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                <li>plan_autopilot_strategy</li>
                <li>quote_rwa_route</li>
                <li>execute_rwa_route</li>
                <li>log_decision</li>
              </ul>
              <a href="/api/agent/plan" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-teal-700">
                Agent API <ExternalLink className="size-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
