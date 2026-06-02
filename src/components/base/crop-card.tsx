import { ArrowUpRight, Flame, ShieldCheck, Sprout } from "lucide-react";
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

const toneBar = {
  steady: "bg-emerald-400",
  balanced: "bg-amber-400",
  bold: "bg-red-400",
};

export function CropCard({ name, risk, apy, asset, protocol, shareLabel, description, accent, tone }: CropCardProps) {
  const Icon = cropIcons[tone];

  return (
    <div className="card group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      {/* top accent bar */}
      <div className={cn("h-1 w-full", toneBar[tone])} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[var(--surface-soft)] text-[var(--primary)] transition group-hover:scale-105">
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-black", accent)}>{risk}</span>
        </div>

        <div className="mt-5 flex-1">
          <h3 className="text-base font-black text-[var(--text)]">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-[var(--text-muted)]">Target APY</span>
              <div className="mt-0.5 text-2xl font-black text-[var(--primary)]">{apy}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-3 font-semibold text-[var(--text-muted)]">
              <span>Asset</span><span className="font-bold text-[var(--text)]">{asset}</span>
            </div>
            <div className="flex items-center justify-between gap-3 font-semibold text-[var(--text-muted)]">
              <span>Route</span><span className="max-w-[160px] truncate font-bold text-[var(--text)]">{protocol}</span>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 font-bold text-[var(--primary)]">
              {shareLabel}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary mt-4 w-full justify-between"
        >
          Plant strategy
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
