import type { ReactNode } from "react";
import { AppNavbar } from "@/components/app/app-navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell relative isolate overflow-hidden">
      <AppNavbar />
      <main className="relative mx-auto w-full max-w-[1320px] px-4 pb-10 pt-4 sm:px-6">{children}</main>
    </div>
  );
}
