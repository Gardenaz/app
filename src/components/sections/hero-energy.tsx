import { ArrowRight, BookOpenText, CheckCircle2, CircleDollarSign, LockKeyhole, Route, Sparkles } from "lucide-react";
import { MetricPill } from "@/components/base/metric-pill";
import { SystemStatus } from "@/components/base/system-status";

export function HeroEnergy() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      {/* Left */}
      <div className="card-lg p-6 sm:p-8">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-teal-700">
            <Sparkles className="size-3.5" aria-hidden="true" />
            AI × RWA farming on Mantle
          </span>
          <h1 className="text-balance text-3xl font-black leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            Grow USDY and mETH yield with an AI agent that shows its work.
          </h1>
          <p className="max-w-lg text-base leading-7 text-[var(--text-muted)]">
            Choose a crop lane, set guardrails, and watch every agent decision become a verifiable benchmark trail.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary">
              Start farming <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className="btn-secondary">
              <BookOpenText className="size-4" aria-hidden="true" />
              Read agent notes
            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <MetricPill label="Primary track" value="AI × RWA" />
          <MetricPill label="Assets" value="USDY/mETH" />
          <MetricPill label="Proof" value="On-chain" />
        </div>
      </div>

      {/* Right */}
      <div className="space-y-4">
        <div className="card-lg overflow-hidden p-1">
          <div className="rounded-[22px] bg-[var(--text)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="kicker !text-teal-400">Strategy console</div>
                <div className="mt-1 text-lg font-black text-white">Rice / Safe Harvest</div>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-400">
                LOW RISK
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { icon: CircleDollarSign, label: "RWA asset", value: "USDY on Mantle" },
                { icon: LockKeyhole, label: "Policy limit", value: "No high-risk rebalance" },
                { icon: Route, label: "Agent action", value: "Log decision before move" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-teal-400">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wide text-white/40">{item.label}</div>
                      <div className="truncate text-sm font-bold text-white">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl bg-teal-600/20 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-teal-400">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Agent note
              </div>
              <p className="mt-2 text-sm leading-5 text-white/70">
                This USDY route keeps the first harvest conservative. Policy checks and benchmark outcome logged before any execution.
              </p>
            </div>
          </div>
        </div>

        <SystemStatus />
      </div>
    </section>
  );
}
