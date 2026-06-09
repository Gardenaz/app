import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HeroEnergy() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
      <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,244,0.98))] p-6 sm:p-8">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-[var(--text)]">
            Gardenaz on Mantle
          </span>
          <h1 className="max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            Start with a garden deposit, then let the agent explain every move.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)]">
            Gardenaz is a beginner-friendly managed garden app where users fund a garden account, approve a simple policy, and get an autopilot plan without first learning every part of DeFi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/app" className="btn-primary">
              Start here <ArrowRight className="size-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See the flow
            </a>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[var(--surface-soft)]">
              <Wallet className="size-4 text-[var(--text-muted)]" />
            </div>
            <div>
              <p className="kicker">Clear balances</p>
              <h3 className="mt-1 text-lg font-black text-[var(--text)]">See wallet money and garden money separately.</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Users can tell what is still sitting in the wallet and what is already ready for the agent inside the garden account.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[var(--surface-soft)]">
              <Bot className="size-4 text-[var(--text-muted)]" />
            </div>
            <div>
              <p className="kicker">Plain-language planning</p>
              <h3 className="mt-1 text-lg font-black text-[var(--text)]">The agent speaks like a guide, not a trading terminal.</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                New users get step-by-step guidance first, while deeper technical proof remains available later in the audit view.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[var(--surface-soft)]">
              <ShieldCheck className="size-4 text-[var(--text-muted)]" />
            </div>
            <div>
              <p className="kicker">Bounded automation</p>
              <h3 className="mt-1 text-lg font-black text-[var(--text)]">The agent works inside user policy.</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Automation is allowed only after the user gives access, and every move is still shaped by policy, managed-account state, and proof logging.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
