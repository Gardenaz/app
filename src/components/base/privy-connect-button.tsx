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
      className="btn-secondary disabled:pointer-events-none disabled:opacity-50"
    >
      {authenticated ? (
        <LogOut className="size-4 text-[var(--text-muted)]" />
      ) : (
        <Wallet className="size-4  text-[var(--primary)]" />
      )}
      <span>
        {authenticated
          ? getPrivyAddressLabel(address)
          : compact
            ? "Connect"
            : "Connect wallet"}
      </span>
    </button>
  );
}
