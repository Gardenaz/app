import type { ReactNode } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
