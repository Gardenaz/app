"use client";

import { LogOut, Wallet } from "lucide-react";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { getPrivyAddressLabel } from "@/lib/privy";

export function PrivyConnectButton({ compact = false }: { compact?: boolean }) {
  const { ready, authenticated, login, logout, address } = usePrivyWalletAddress();

  return (
    <button
      type="button"
      onClick={() => (authenticated ? logout() : login())}
      disabled={!ready}
      className="group inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/30 bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(20,184,166,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-teal-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {authenticated ? <LogOut className="size-4" /> : <Wallet className="size-4" />}
      <span>{authenticated ? getPrivyAddressLabel(address) : compact ? "Connect" : "Connect wallet"}</span>
    </button>
  );
}
