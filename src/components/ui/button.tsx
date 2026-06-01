import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-emerald-500 text-emerald-950 hover:bg-emerald-400",
    secondary: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
    danger: "bg-red-500 text-white hover:bg-red-400",
  };
  return <button className={cn("rounded-md px-4 py-2 text-sm font-semibold transition", variants[variant], className)} {...props} />;
}
