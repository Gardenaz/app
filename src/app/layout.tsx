import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/base/providers";

export const metadata: Metadata = {
  title: "Gardenaz - AI x RWA Farming",
  description: "Beginner-friendly AI x RWA farming on Mantle. Grow crops, follow live oracle prices, and let AI manage your strategy.",
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
