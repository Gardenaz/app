import { ArrowUpRight, Flame, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CropCardProps = {
  name: string;
  risk: string;
  apy: string;
  asset: string;
  protocol: string;
  shareLabel: string;
  description: string;
  accent: string;
  tone: "steady" | "balanced" | "bold";
};

const cropIcons = {
  steady: ShieldCheck,
  balanced: Sprout,
  bold: Flame,
};

export function CropCard({ name, risk, apy, asset, protocol, shareLabel, description, accent, tone }: CropCardProps) {
  const Icon = cropIcons[tone];

  return (
    <Card className="group relative min-h-[310px] overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--mint)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="grid size-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--primary-strong)] transition group-hover:scale-105">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-black", accent)}>{risk}</span>
      </div>

      <div className="mt-7">
        <h3 className="text-xl font-black tracking-tight text-[var(--text)]">{name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>

      <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase text-[var(--text-muted)]">Target APY</span>
            <div className="mt-1 text-3xl font-black tracking-tight text-[var(--primary-strong)]">{apy}</div>
          </div>
          <Leaf className="size-5 text-[var(--gold)]" aria-hidden="true" />
        </div>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[var(--text-muted)]">
          <div className="flex items-center justify-between gap-3"><span>Asset</span><span className="text-[var(--text)]">{asset}</span></div>
          <div className="flex items-center justify-between gap-3"><span>Route</span><span className="max-w-[170px] truncate text-[var(--text)]">{protocol}</span></div>
          <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-[var(--primary-strong)]">{shareLabel}</div>
        </div>
      </div>

      <Button className="mt-5 w-full justify-between" type="button">
        Plant strategy
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Button>
    </Card>
  );
}
