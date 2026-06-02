export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-4 py-3 transition hover:-translate-y-px">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</div>
      <div className="mt-1 text-lg font-black text-[var(--text)]">{value}</div>
    </div>
  );
}
