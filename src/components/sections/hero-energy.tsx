import { ArrowRight, BookOpenText, CheckCircle2, CircleDollarSign, LockKeyhole, Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricPill } from "@/components/base/metric-pill";
import { SystemStatus } from "@/components/base/system-status";

export function HeroEnergy() {
  return (
    <section className="relative grid gap-8 rounded-[2rem] border border-white/80 bg-white/82 p-5 shadow-[var(--shadow)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mint)] to-transparent" />
      <div className="flex flex-col justify-between gap-8">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-black uppercase text-[var(--primary-strong)]">
            <Sparkles className="size-3.5" aria-hidden="true" />
AI x RWA farming on Mantle
          </p>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Grow USDY and mETH yield with an AI agent that shows its work.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] md:text-lg">
              Gardena turns Mantle RWA strategies into a guided farming flow: choose a crop lane, set guardrails, and watch every agent decision become a verifiable benchmark trail.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button">
              Start farming
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="secondary">
              <BookOpenText className="size-4" aria-hidden="true" />
              Read agent notes
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MetricPill label="Primary track" value="AI x RWA" />
          <MetricPill label="Assets" value="USDY/mETH" />
          <MetricPill label="Proof" value="On-chain" />
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg)] p-4 shadow-inner">
        <div className="rounded-[1.25rem] border border-white bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase text-[var(--text-muted)]">Strategy console</div>
              <div className="mt-1 text-lg font-black text-[var(--text)]">Rice / Safe Harvest</div>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-[var(--primary-strong)]">
              LOW RISK
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              { icon: CircleDollarSign, label: "RWA asset", value: "USDY on Mantle" },
              { icon: LockKeyhole, label: "Policy limit", value: "No high-risk rebalance" },
              { icon: Route, label: "Agent action", value: "Log decision before move" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-3 py-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]"
                  key={item.label}
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-strong)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase text-[var(--text-muted)]">{item.label}</div>
                    <div className="truncate text-sm font-black text-[var(--text)]">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-[var(--text)] p-4 text-white shadow-lg shadow-emerald-950/10">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-100">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Agent note
            </div>
            <p className="mt-3 text-sm leading-6 text-emerald-50/90">
              This USDY route keeps the first harvest conservative. I log policy checks and benchmark outcome before any future execution.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <SystemStatus />
        </div>
      </div>
    </section>
  );
}
