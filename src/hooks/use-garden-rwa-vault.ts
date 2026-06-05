"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createPublicClient, encodeFunctionData, formatUnits, http, parseEther, type Address, type Hash } from "viem";
import { mantleSepolia } from "@/lib/privy";
import { mantleSepoliaRegistration } from "@/lib/contracts/config";
import { autopilotPolicyAbi, getAutopilotPolicyAddress } from "@/lib/contracts/autopilot-policy";
import { crops } from "@/lib/crops/data";
import { gardenUsdMockAbi, getGardenUsdMockAddress } from "@/lib/contracts/garden-usd";
import {
  gardenRwaMockVaultAbi,
  getGardenRwaCropKey,
  getGardenRwaVaultAddress,
  gardenRwaCropKeys,
  type GardenRwaCropKey,
} from "@/lib/contracts/garden-rwa";

export type GardenRwaRoute = {
  cropKey: GardenRwaCropKey;
  name: string;
  asset: string;
  price: string | null;
};

export type GardenRwaPosition = {
  positionId: number;
  cropKey: GardenRwaCropKey;
  owner: Address;
  principal: string;
  assetAmount: string;
  plantedPrice: string;
  currentValue: string;
  harvestedValue: string;
  harvested: boolean;
  plantedAt: string;
  lastRebalancedAt: string;
  harvestedAt: string | null;
};

export type GardenRwaVaultSnapshot = {
  configured: boolean;
  vaultAddress?: Address;
  walletAddress?: Address;
  settlementTokenAddress?: Address;
  tokenBalance?: string;
  vaultCashBalance?: string;
  operatorApproved?: boolean;
  autopilotPolicyEnabled?: boolean;
  autopilotProtocolAllowed?: boolean;
  autopilotEmergencyPaused?: boolean;
  routes: GardenRwaRoute[];
  positions: GardenRwaPosition[];
};

const queryKeyBase = ["garden-rwa-vault"] as const;
const faucetCooldownMs = 24 * 60 * 60 * 1000;
const faucetStoragePrefix = "gardenaz.gusd-faucet";

function rpcUrl() {
  return process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? process.env.NEXT_PUBLIC_RPC_URL;
}

function createClient() {
  const url = rpcUrl();
  if (!url) throw new Error("NEXT_PUBLIC_MANTLE_RPC_URL is required for Gardenaz vault reads");
  return createPublicClient({
    chain: mantleSepolia,
    transport: http(url),
  });
}

async function waitForReceipt(hash: Hash) {
  const client = createClient();
  await client.waitForTransactionReceipt({
    hash,
    pollingInterval: 2_000,
    retryCount: 60,
  });
}

function toDate(value: bigint) {
  return new Date(Number(value) * 1000).toISOString();
}

function formatAmount(value: bigint) {
  return formatUnits(value, 18);
}

function cropMeta(cropKey: GardenRwaCropKey) {
  const meta = crops.find((crop) =>
    cropKey === "steady" ? crop.asset === "USDY" && crop.name.includes("Rice")
      : cropKey === "growth" ? crop.asset === "mETH" && crop.name.includes("Corn")
        : crop.asset === "USDY/mETH");
  if (meta) return meta;
  return cropKey === "steady" ? crops[0] : cropKey === "growth" ? crops[1] : crops[2];
}

function faucetStorageKey(address?: Address) {
  return address ? `${faucetStoragePrefix}:${address.toLowerCase()}` : null;
}

function readFaucetCooldown(address?: Address) {
  if (typeof window === "undefined") return 0;
  const key = faucetStorageKey(address);
  if (!key) return 0;
  const value = window.localStorage.getItem(key);
  if (!value) return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

function writeFaucetCooldown(address: Address) {
  if (typeof window === "undefined") return;
  const key = faucetStorageKey(address);
  if (!key) return;
  window.localStorage.setItem(key, String(Date.now() + faucetCooldownMs));
}

async function readSnapshot(owner?: Address, operator?: Address): Promise<GardenRwaVaultSnapshot> {
  const vaultAddress = getGardenRwaVaultAddress();
  const settlementTokenAddress = getGardenUsdMockAddress();
  const autopilotPolicyAddress = getAutopilotPolicyAddress();
  if (!vaultAddress) {
    return { configured: false, routes: [], positions: [], walletAddress: owner, settlementTokenAddress };
  }

  const client = createClient();
  const tokenBalance = owner && settlementTokenAddress
    ? formatAmount(await client.readContract({
      address: settlementTokenAddress,
      abi: gardenUsdMockAbi,
      functionName: "balanceOf",
      args: [owner],
    }) as bigint)
    : undefined;
  const vaultCashBalance = owner
    ? formatAmount(await client.readContract({
      address: vaultAddress,
      abi: gardenRwaMockVaultAbi,
      functionName: "cashBalance",
      args: [owner],
    }) as bigint)
    : undefined;
  const operatorApproved = owner && operator
    ? await client.readContract({
      address: vaultAddress,
      abi: gardenRwaMockVaultAbi,
      functionName: "isVaultOperator",
      args: [owner, operator],
    }) as boolean
    : undefined;
  const autopilotPolicy = owner && autopilotPolicyAddress
    ? await client.readContract({
      address: autopilotPolicyAddress,
      abi: autopilotPolicyAbi,
      functionName: "policies",
      args: [owner],
    }) as readonly [bigint, bigint, number, bigint, boolean, boolean, bigint, bigint, bigint]
    : undefined;
  const autopilotProtocolAllowed = owner && autopilotPolicyAddress
    ? await client.readContract({
      address: autopilotPolicyAddress,
      abi: autopilotPolicyAbi,
      functionName: "allowedProtocols",
      args: [owner, vaultAddress],
    }) as boolean
    : undefined;

  const routes = (
    await Promise.all(
      gardenRwaCropKeys.map(async (cropKey) => {
        const meta = cropMeta(cropKey);
        try {
          const price = await client.readContract({
            address: vaultAddress,
            abi: gardenRwaMockVaultAbi,
            functionName: "routePrice",
            args: [cropKey],
          }) as bigint;
          return {
            cropKey,
            name: meta.name,
            asset: meta.asset,
            price: formatAmount(price),
          } satisfies GardenRwaRoute;
        } catch {
          return {
            cropKey,
            name: meta.name,
            asset: meta.asset,
            price: null,
          } satisfies GardenRwaRoute;
        }
      }),
    )
  ).filter((route) => route.price !== null || owner);

  const positionIds = owner
    ? await client.readContract({
      address: vaultAddress,
      abi: gardenRwaMockVaultAbi,
      functionName: "positionIdsOf",
      args: [owner],
    }) as bigint[]
    : Array.from(
      { length: Number(await client.readContract({
        address: vaultAddress,
        abi: gardenRwaMockVaultAbi,
        functionName: "positionCount",
      })) },
      (_, index) => BigInt(index + 1),
    );

  const positions = await Promise.all(
    positionIds.map(async (positionIdValue) => {
      const positionId = Number(positionIdValue);
      const row = await client.readContract({
        address: vaultAddress,
        abi: gardenRwaMockVaultAbi,
        functionName: "positions",
        args: [positionIdValue],
      }) as readonly [Address, `0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean];

      const [ownerAddress, cropHash, principal, assetAmount, plantedPrice, harvestedValue, plantedAt, lastRebalancedAt, harvestedAt, harvested] = row;
      const currentValue = await client.readContract({
        address: vaultAddress,
        abi: gardenRwaMockVaultAbi,
        functionName: "currentValue",
        args: [positionIdValue],
      }) as bigint;

      return {
        positionId,
        cropKey: getGardenRwaCropKey(cropHash) ?? "steady",
        owner: ownerAddress,
        principal: formatAmount(principal),
        assetAmount: formatAmount(assetAmount),
        plantedPrice: formatAmount(plantedPrice),
        currentValue: formatAmount(currentValue),
        harvestedValue: formatAmount(harvestedValue),
        harvested,
        plantedAt: toDate(plantedAt),
        lastRebalancedAt: toDate(lastRebalancedAt),
        harvestedAt: harvestedAt > 0n ? toDate(harvestedAt) : null,
      } satisfies GardenRwaPosition;
    }),
  );

  return {
    configured: true,
    vaultAddress,
    walletAddress: owner,
    settlementTokenAddress,
    tokenBalance,
    vaultCashBalance,
    operatorApproved,
    autopilotPolicyEnabled: autopilotPolicy?.[4],
    autopilotEmergencyPaused: autopilotPolicy?.[5],
    autopilotProtocolAllowed,
    routes,
    positions,
  };
}

export function useGardenRwaVault() {
  const [now, setNow] = useState(() => Date.now());
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const queryClient = useQueryClient();
  const walletAddress = wallets[0]?.address as Address | undefined;
  const vaultAddress = getGardenRwaVaultAddress();
  const settlementTokenAddress = getGardenUsdMockAddress();
  const autopilotPolicyAddress = getAutopilotPolicyAddress();
  const operatorAddress = (process.env.NEXT_PUBLIC_AUTOPILOT_EXECUTOR_ADDRESS ?? mantleSepoliaRegistration.agentWallet) as Address | undefined;
  const faucetCooldownUntil = readFaucetCooldown(walletAddress);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const faucetAvailableInMs = Math.max(0, faucetCooldownUntil - now);
  const canFaucet = Boolean(settlementTokenAddress && walletAddress && faucetAvailableInMs === 0);

  const snapshotQuery = useQuery({
    queryKey: [...queryKeyBase, walletAddress ?? "anonymous"],
    queryFn: () => readSnapshot(walletAddress, operatorAddress),
    refetchInterval: 20_000,
  });

  const allSnapshotQuery = useQuery({
    queryKey: [...queryKeyBase, "all"],
    queryFn: () => readSnapshot(undefined, operatorAddress),
    refetchInterval: 20_000,
  });

  async function refreshSnapshots() {
    await Promise.all([snapshotQuery.refetch(), allSnapshotQuery.refetch()]);
  }

  const faucetMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!settlementTokenAddress) throw new Error("Garden USD token address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      if (faucetAvailableInMs > 0) {
        const remainingHours = Math.ceil(faucetAvailableInMs / (60 * 60 * 1000));
        throw new Error(`Faucet is cooling down. Try again in about ${remainingHours} hour${remainingHours > 1 ? "s" : ""}.`);
      }
      const data = encodeFunctionData({
        abi: gardenUsdMockAbi,
        functionName: "faucet",
        args: [parseEther(amount)],
      });
      const result = await sendTransaction({ to: settlementTokenAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      writeFaucetCooldown(walletAddress);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  async function approveGardenUsd(amount: string) {
    if (!settlementTokenAddress) throw new Error("Garden USD token address is not configured");
    if (!walletAddress) throw new Error("Connect a Privy wallet first");
    if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
    const data = encodeFunctionData({
      abi: gardenUsdMockAbi,
      functionName: "approve",
      args: [vaultAddress, parseEther(amount)],
    });
    const result = await sendTransaction({ to: settlementTokenAddress, data }, { address: walletAddress });
    await waitForReceipt(result.hash as Hash);
    return result.hash;
  }

  const depositMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      await approveGardenUsd(amount);
      const data = encodeFunctionData({
        abi: gardenRwaMockVaultAbi,
        functionName: "deposit",
        args: [parseEther(amount)],
      });
      const result = await sendTransaction({ to: vaultAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      const data = encodeFunctionData({
        abi: gardenRwaMockVaultAbi,
        functionName: "withdraw",
        args: [parseEther(amount)],
      });
      const result = await sendTransaction({ to: vaultAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  const setOperatorMutation = useMutation({
    mutationFn: async (allowed: boolean) => {
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      if (!operatorAddress) throw new Error("Autopilot executor address is not configured");
      const data = encodeFunctionData({
        abi: gardenRwaMockVaultAbi,
        functionName: "setVaultOperator",
        args: [operatorAddress, allowed],
      });
      const result = await sendTransaction({ to: vaultAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  const setAutopilotPolicyMutation = useMutation({
    mutationFn: async (input: {
      amount: string;
      maxDailyLossAmount?: string;
      riskLevel: number;
      enabled?: boolean;
      rebalanceIntervalSeconds?: number;
    }) => {
      if (!autopilotPolicyAddress) throw new Error("Autopilot policy address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      const maxDailyLossAmount = input.maxDailyLossAmount ?? input.amount;
      const data = encodeFunctionData({
        abi: autopilotPolicyAbi,
        functionName: "setAutopilotPolicy",
        args: [
          parseEther(input.amount),
          parseEther(maxDailyLossAmount),
          input.riskLevel,
          BigInt(input.rebalanceIntervalSeconds ?? 6 * 60 * 60),
          [vaultAddress],
          input.enabled ?? true,
        ],
      });
      const result = await sendTransaction({ to: autopilotPolicyAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  const plantMutation = useMutation({
    mutationFn: async (input: { cropKey: GardenRwaCropKey; amount: string }) => {
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      await approveGardenUsd(input.amount);
      const data = encodeFunctionData({
        abi: gardenRwaMockVaultAbi,
        functionName: "plant",
        args: [input.cropKey, parseEther(input.amount)],
      });
      const result = await sendTransaction({ to: vaultAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  const harvestMutation = useMutation({
    mutationFn: async (positionId: number) => {
      if (!vaultAddress) throw new Error("Garden RWA vault address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      const data = encodeFunctionData({
        abi: gardenRwaMockVaultAbi,
        functionName: "harvest",
        args: [BigInt(positionId)],
      });
      const result = await sendTransaction({ to: vaultAddress, data }, { address: walletAddress });
      await waitForReceipt(result.hash as Hash);
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, "all"] });
      await refreshSnapshots();
      return result.hash;
    },
  });

  return {
    walletAddress,
    vaultAddress,
    settlementTokenAddress,
    autopilotPolicyAddress,
    operatorAddress,
    snapshot: snapshotQuery.data,
    allSnapshot: allSnapshotQuery.data,
    isLoading: snapshotQuery.isLoading,
    isFetching: snapshotQuery.isFetching,
    error: snapshotQuery.error,
    refresh: snapshotQuery.refetch,
    faucet: faucetMutation.mutateAsync,
    isFauceting: faucetMutation.isPending,
    faucetError: faucetMutation.error,
    faucetAvailableInMs,
    canFaucet,
    plant: plantMutation.mutateAsync,
    deposit: depositMutation.mutateAsync,
    withdraw: withdrawMutation.mutateAsync,
    harvest: harvestMutation.mutateAsync,
    setVaultOperator: setOperatorMutation.mutateAsync,
    setAutopilotPolicy: setAutopilotPolicyMutation.mutateAsync,
    isPlanting: plantMutation.isPending,
    isDepositing: depositMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isHarvesting: harvestMutation.isPending,
    isSettingOperator: setOperatorMutation.isPending,
    isSettingPolicy: setAutopilotPolicyMutation.isPending,
    txError: depositMutation.error ?? withdrawMutation.error ?? setOperatorMutation.error ?? setAutopilotPolicyMutation.error ?? plantMutation.error ?? harvestMutation.error,
    canInteract: Boolean(vaultAddress && walletAddress),
  };
}
