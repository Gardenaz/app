import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/base/providers";

export const metadata: Metadata = {
  title: "Gardenaz - AI Moat for Guided DeFi",
  description: "Gardenaz pairs policy-bound automation, clear reasoning, and onchain proof so everyday users can follow what the agent does and why.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
