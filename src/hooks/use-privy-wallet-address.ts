"use client";

import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export function usePrivyWalletAddress() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const address = wallets[0]?.address as `0x${string}` | undefined;
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function readChainId() {
      const wallet = wallets[0];
      if (!wallet) {
        setChainId(null);
        return;
      }

      try {
        const provider = await wallet.getEthereumProvider();
        const rawChainId = await provider.request({ method: "eth_chainId" }) as string;
        if (!cancelled) {
          setChainId(Number.parseInt(rawChainId, 16));
        }
      } catch {
        if (!cancelled) {
          setChainId(null);
        }
      }
    }

    void readChainId();
    return () => {
      cancelled = true;
    };
  }, [wallets]);

  return {
    ready,
    authenticated,
    login,
    logout,
    address,
    chainId,
    walletCount: wallets.length,
  };
}
