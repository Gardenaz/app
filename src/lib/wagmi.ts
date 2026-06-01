"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { mantle } from "viem/chains";

const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { decimals: 18, name: "MNT", symbol: "MNT" },
  rpcUrls: { default: { http: ["https://rpc.sepolia.mantle.xyz"] } },
  blockExplorers: { default: { name: "Mantle Sepolia Explorer", url: "https://explorer.sepolia.mantle.xyz" } },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "Gardena",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "gardena-dev",
  chains: [mantleSepolia, mantle],
  ssr: true,
});
