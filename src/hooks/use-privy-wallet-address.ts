"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";

export function usePrivyWalletAddress() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const address = wallets[0]?.address as `0x${string}` | undefined;

  return {
    ready,
    authenticated,
    login,
    logout,
    address,
    walletCount: wallets.length,
  };
}
