import { Badge } from "@/components/ui/badge";

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-lg font-bold text-[var(--text)]">{value}</span>
        <Badge>Live</Badge>
      </div>
    </div>
  );
}
