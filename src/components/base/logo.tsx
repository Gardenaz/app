import { Leaf } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="asset-orb grid size-10 place-items-center rounded-2xl text-white shadow-lg shadow-teal-700/15">
        <Leaf className="size-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold tracking-tight">Gardena</p>
        {!compact ? <p className="hidden text-xs font-semibold text-[var(--text-muted)] sm:block">AI x RWA garden on Mantle</p> : null}
      </div>
    </div>
  );
}
