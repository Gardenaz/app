import { createPublicClient, http } from "viem";
import { mantleSepolia } from "@/lib/privy";

export function createMantleSepoliaPublicClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? process.env.NEXT_PUBLIC_RPC_URL;
  if (!rpcUrl) {
    throw new Error("NEXT_PUBLIC_MANTLE_RPC_URL is required for live Agni execution.");
  }

  return createPublicClient({
    chain: mantleSepolia,
    transport: http(rpcUrl),
  });
}
