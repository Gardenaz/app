import { Leaf } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="orb-teal grid size-9 place-items-center rounded-xl text-white shadow-sm shadow-teal-900/15">
        <Leaf className="size-4" />
      </div>
      <div>
        <p className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">Gardena</p>
        {!compact && (
          <p className="hidden text-xs text-[var(--text-muted)] sm:block">AI × RWA on Mantle</p>
        )}
      </div>
    </div>
  );
}
