"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, type Address } from "viem";
import { mantleSepolia } from "@/lib/privy";
import { getManagedGardenAccountAddress, gardenManagedAccountAbi } from "@/lib/contracts/garden-managed-account";
import { getGardenDepositTokenAddress } from "@/lib/contracts/config";

export type ManagedGardenAccountSnapshot = {
  configured: boolean;
  mode: "managed";
  walletAddress?: Address;
  accountAddress?: Address;
  depositTokenAddress?: Address;
  executorAddress?: Address;
  balance: string;
  tokenBalance: string;
  depositReady: boolean;
  executorAuthorized: boolean;
};

const queryKeyBase = ["garden-managed-account"] as const;

function rpcUrl() {
  return process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? process.env.NEXT_PUBLIC_RPC_URL;
}

function createClient() {
  const url = rpcUrl();
  if (!url) {
    return null;
  }

  return createPublicClient({
    chain: mantleSepolia,
    transport: http(url),
  });
}

async function readManagedSnapshot(walletAddress?: Address): Promise<ManagedGardenAccountSnapshot> {
  const accountAddress = getManagedGardenAccountAddress();
  const depositTokenAddress = getGardenDepositTokenAddress();
  const executorAddress = process.env.NEXT_PUBLIC_AUTOPILOT_EXECUTOR_ADDRESS as Address | undefined;
  const configured = Boolean(accountAddress && depositTokenAddress);

  if (!walletAddress || !accountAddress || !depositTokenAddress) {
    return {
      configured,
      mode: "managed",
      walletAddress,
      accountAddress,
      depositTokenAddress,
      executorAddress,
      balance: "0",
      tokenBalance: "0",
      depositReady: false,
      executorAuthorized: false,
    };
  }

  const client = createClient();
  if (!client) {
    return {
      configured,
      mode: "managed",
      walletAddress,
      accountAddress,
      depositTokenAddress,
      executorAddress,
      balance: "0",
      tokenBalance: "0",
      depositReady: false,
      executorAuthorized: false,
    };
  }

  const [balance, tokenBalance, executorAuthorized] = await Promise.all([
    client.readContract({
      address: accountAddress,
      abi: gardenManagedAccountAbi,
      functionName: "balanceOf",
      args: [walletAddress],
    }).catch(() => 0n),
    client.readContract({
      address: accountAddress,
      abi: gardenManagedAccountAbi,
      functionName: "tokenBalanceOf",
      args: [walletAddress, depositTokenAddress],
    }).catch(() => 0n),
    executorAddress
      ? client.readContract({
          address: accountAddress,
          abi: gardenManagedAccountAbi,
          functionName: "executors",
          args: [executorAddress],
        }).catch(() => false)
      : Promise.resolve(false),
  ]);

  return {
    configured,
    mode: "managed",
    walletAddress,
    accountAddress,
    depositTokenAddress,
    executorAddress,
    balance: typeof balance === "bigint" ? balance.toString() : "0",
    tokenBalance: typeof tokenBalance === "bigint" ? tokenBalance.toString() : "0",
    depositReady: typeof tokenBalance === "bigint" ? tokenBalance > 0n : false,
    executorAuthorized: Boolean(executorAuthorized),
  };
}

export function useManagedGardenAccount() {
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address as Address | undefined;

  const query = useQuery({
    queryKey: [...queryKeyBase, walletAddress ?? "anonymous"],
    queryFn: () => readManagedSnapshot(walletAddress),
    refetchInterval: 20_000,
  });

  return {
    snapshot: query.data,
    walletAddress,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refresh: query.refetch,
    canInteract: Boolean(walletAddress),
    mode: query.data?.mode ?? "managed",
    depositReady: Boolean(query.data?.depositReady),
  };
}
