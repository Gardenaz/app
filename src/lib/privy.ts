import { defineChain } from "viem";
import { mantle } from "viem/chains";

export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { decimals: 18, name: "MNT", symbol: "MNT" },
  rpcUrls: { default: { http: ["https://rpc.sepolia.mantle.xyz"] } },
  blockExplorers: { default: { name: "Mantle Sepolia Explorer", url: "https://explorer.sepolia.mantle.xyz" } },
  testnet: true,
});

export const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
export const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || undefined;

export const privySupportedChains = [mantleSepolia, mantle] as const;

export function getPrivyAddressLabel(address?: string | null) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getPrivyChainLabel(chainId?: number | null) {
  if (!chainId) return "Unknown chain";
  if (chainId === mantleSepolia.id) return "Mantle Sepolia";
  if (chainId === mantle.id) return "Mantle Mainnet";
  return `Chain ${chainId}`;
}
