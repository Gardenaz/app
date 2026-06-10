import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-10 pt-4 sm:px-6">{children}</main>
  );
}
