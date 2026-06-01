import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--primary)] text-white shadow-sm shadow-emerald-900/15 hover:-translate-y-0.5 hover:bg-[var(--primary-strong)] hover:shadow-md hover:shadow-emerald-900/20",
    secondary:
      "border border-[var(--border)] bg-white text-[var(--text)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]",
    ghost: "text-[var(--primary-strong)] hover:bg-[var(--primary-soft)]",
    danger: "bg-red-500 text-white hover:bg-red-400",
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
