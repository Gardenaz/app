import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text)]">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm md:text-base text-[var(--text-muted)]">{subtitle}</p> : null}
    </div>
  );
}
