"use client";

import { useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import type { EIP1193Provider } from "viem";
import { createWalletClient, custom } from "viem";
import { mantleSepolia } from "@/lib/privy";

async function ensureMantleSepolia(provider: EIP1193Provider) {
  const targetChainHex = `0x${mantleSepolia.id.toString(16)}`;
  const currentChainHex = await provider.request({ method: "eth_chainId" }) as string;
  if (currentChainHex === targetChainHex) {
    return;
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainHex }],
    });
  } catch {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: targetChainHex,
        chainName: mantleSepolia.name,
        nativeCurrency: mantleSepolia.nativeCurrency,
        rpcUrls: mantleSepolia.rpcUrls.default.http,
        blockExplorerUrls: [mantleSepolia.blockExplorers.default.url],
      }],
    });
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainHex }],
    });
  }
}

export function usePrivyWalletClient() {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const getWalletClient = useCallback(async () => {
    if (!wallet) {
      throw new Error("Connect a wallet first.");
    }

    const provider = await wallet.getEthereumProvider();
    await ensureMantleSepolia(provider as EIP1193Provider);
    return createWalletClient({
      account: wallet.address as `0x${string}`,
      chain: mantleSepolia,
      transport: custom(provider),
    });
  }, [wallet]);

  return {
    wallet,
    getWalletClient,
  };
}
