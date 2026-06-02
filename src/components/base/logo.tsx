import { Leaf } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="asset-orb grid size-11 place-items-center rounded-2xl text-white shadow-lg shadow-teal-700/20">
        <Leaf className="size-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold tracking-tight">Gardena</p>
        <p className="hidden text-xs font-semibold text-[var(--text-muted)] sm:block">AI x RWA garden on Mantle</p>
      </div>
    </div>
  );
}
