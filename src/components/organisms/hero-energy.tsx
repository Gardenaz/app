import { Button } from "@/components/ui/button";
import { MetricPill } from "@/components/molecules/metric-pill";

export function HeroEnergy() {
  return (
    <section className="grid gap-8 rounded-3xl border border-[var(--border)] bg-white p-6 md:grid-cols-2 md:p-10 shadow-xl shadow-emerald-100/40">
      <div className="space-y-5">
        <p className="inline-flex rounded-full bg-[var(--bg-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-strong)]">Gardena</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight text-[var(--text)]">Green Energy for Your DeFi Journey</h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg">Pick strategy like planting crops. AI handles execution with transparent policy guardrails and clean user control.</p>
        <div className="flex flex-wrap gap-3">
          <Button>Connect Wallet</Button>
          <Button variant="secondary">View Agent Diary</Button>
        </div>
      </div>

      <div className="grid gap-3 md:pl-8">
        <MetricPill label="Avg. setup time" value="< 2 min" />
        <MetricPill label="Policy blocked risk" value="Realtime" />
        <MetricPill label="Decision logs" value="Verifiable" />
      </div>
    </section>
  );
}
