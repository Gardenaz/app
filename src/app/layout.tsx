import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/base/providers";

export const metadata: Metadata = {
  title: "Gardena - AI DeFi Farming",
  description: "Gamified DeFi farming for beginners on Mantle. Grow crops, earn yield, let AI manage your strategy.",
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
