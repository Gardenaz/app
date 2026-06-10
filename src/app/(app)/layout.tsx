import type { ReactNode } from "react";
import { AppNavbar } from "@/components/app/app-navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell relative isolate min-h-svh overflow-hidden">
      <AppNavbar />
      <div className="relative w-full">{children}</div>
    </div>
  );
}
