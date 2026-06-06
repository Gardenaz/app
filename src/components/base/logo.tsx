import { Leaf } from "lucide-react";

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="orb-teal grid size-9 place-items-center rounded-xl text-white shadow-sm shadow-teal-900/15">
        <Leaf className="size-4" />
      </div>
      <div>
        <p className={`font-display text-xl font-semibold tracking-tight transition-colors duration-300 ${light ? "text-white" : "text-[var(--text)]"}`}>Gardenaz</p>
        {!compact && (
          <p className={`hidden text-xs transition-colors duration-300 sm:block ${light ? "text-white/65" : "text-[var(--text-muted)]"}`}>AI × RWA on Mantle</p>
        )}
      </div>
    </div>
  );
}
