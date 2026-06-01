import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] shadow-sm",
    secondary: "border border-[var(--border)] bg-white text-[var(--text)] hover:bg-[var(--bg-soft)]",
    danger: "bg-red-500 text-white hover:bg-red-400",
  };

  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
