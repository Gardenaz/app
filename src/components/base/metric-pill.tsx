import { Badge } from "@/components/ui/badge";

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <div className="text-xs font-bold uppercase text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-lg font-black text-[var(--text)]">{value}</span>
        <Badge>Live</Badge>
      </div>
    </div>
  );
}
