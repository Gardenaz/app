"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";
import { createPublicClient, encodeFunctionData, formatUnits, http, parseEther, keccak256, stringToHex, type Address } from "viem";
import { mantleSepolia } from "@/lib/privy";
import { crops } from "@/lib/crops/data";
import { gardenUsdMockAbi, getGardenUsdMockAddress } from "@/lib/contracts/garden-usd";
import {
  gardenRwaMockVaultAbi,
  getGardenRwaCropKey,
  getGardenRwaVaultAddress,
  type GardenRwaCropKey,
} from "@/lib/contracts/garden-rwa";

export type GardenRwaRoute = {
  cropKey: GardenRwaCropKey;
  name: string;
  asset: string;
  price: string;
};

export type GardenRwaPosition = {
  positionId: number;
  cropKey: GardenRwaCropKey;
  owner: Address;
  principal: string;
  plantedPrice: string;
  currentValue: string;
  harvestedValue: string;
  harvested: boolean;
  plantedAt: string;
  harvestedAt: string | null;
};

export type GardenRwaVaultSnapshot = {
  configured: boolean;
  vaultAddress?: Address;
  walletAddress?: Address;
  settlementTokenAddress?: Address;
  tokenBalance?: string;
  routes: GardenRwaRoute[];
  positions: GardenRwaPosition[];
};

const queryKeyBase = ["garden-rwa-vault"] as const;

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

async function readSnapshot(owner?: Address): Promise<GardenRwaVaultSnapshot> {
  const vaultAddress = getGardenRwaVaultAddress();
  const settlementTokenAddress = getGardenUsdMockAddress();
  if (!vaultAddress) {
    return { configured: false, routes: [], positions: [], walletAddress: owner, settlementTokenAddress };
  }

  const client = createClient();
  const tokenBalance = owner && settlementTokenAddress
    ? formatUnits(await client.readContract({
      address: settlementTokenAddress,
      abi: gardenUsdMockAbi,
      functionName: "balanceOf",
      args: [owner],
    }) as bigint, 18)
    : undefined;
  const routeReads = await Promise.all(
    (["steady", "growth", "boost"] as const).map(async (cropKey) => {
      const meta = cropMeta(cropKey);
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
        price: formatUnits(price, 18),
      } satisfies GardenRwaRoute;
    }),
  );

  const count = Number(await client.readContract({
    address: vaultAddress,
    abi: gardenRwaMockVaultAbi,
    functionName: "positionCount",
  }));

  const positionReads = await Promise.all(
    Array.from({ length: count }, async (_, index) => {
      const positionId = index + 1;
      const row = await client.readContract({
        address: vaultAddress,
        abi: gardenRwaMockVaultAbi,
        functionName: "positions",
        args: [BigInt(positionId)],
      }) as readonly [Address, `0x${string}`, bigint, bigint, bigint, bigint, bigint, boolean];

      const [positionOwner, cropHash, principal, plantedPrice, harvestedValue, plantedAt, harvestedAt, harvested] = row;
      if (owner && positionOwner.toLowerCase() !== owner.toLowerCase()) {
        return null;
      }

      const cropKey = getGardenRwaCropKey(cropHash) ?? "steady";
      const currentValue = await client.readContract({
        address: vaultAddress,
        abi: gardenRwaMockVaultAbi,
        functionName: "currentValue",
        args: [BigInt(positionId)],
      }) as bigint;

      return {
        positionId,
        cropKey,
        owner: positionOwner,
        principal: formatAmount(principal),
        plantedPrice: formatAmount(plantedPrice),
        currentValue: formatAmount(currentValue),
        harvestedValue: formatAmount(harvestedValue),
        harvested,
        plantedAt: toDate(plantedAt),
        harvestedAt: harvestedAt > 0n ? toDate(harvestedAt) : null,
      } satisfies GardenRwaPosition;
    }),
  );

  const positions = positionReads.filter((row): row is GardenRwaPosition => row !== null);

  return {
    configured: true,
    vaultAddress,
    walletAddress: owner,
    settlementTokenAddress,
    tokenBalance,
    routes: routeReads,
    positions,
  };
}

export function useGardenRwaVault() {
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const queryClient = useQueryClient();
  const walletAddress = wallets[0]?.address as Address | undefined;
  const vaultAddress = getGardenRwaVaultAddress();
  const settlementTokenAddress = getGardenUsdMockAddress();

  const snapshotQuery = useQuery({
    queryKey: [...queryKeyBase, walletAddress ?? "anonymous"],
    queryFn: () => readSnapshot(walletAddress),
    refetchInterval: 20_000,
  });

  const faucetMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!settlementTokenAddress) throw new Error("Garden USD token address is not configured");
      if (!walletAddress) throw new Error("Connect a Privy wallet first");
      const data = encodeFunctionData({
        abi: gardenUsdMockAbi,
        functionName: "faucet",
        args: [parseEther(amount)],
      });
      const result = await sendTransaction(
        { to: settlementTokenAddress, data },
        { address: walletAddress },
      );
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      return result.hash;
    },
  });

  async function approveGardenUsd(amount: string) {
    if (!settlementTokenAddress) throw new Error("Garden USD token address is not configured");
    if (!walletAddress) throw new Error("Connect a Privy wallet first");
    const data = encodeFunctionData({
      abi: gardenUsdMockAbi,
      functionName: "approve",
      args: [vaultAddress as Address, parseEther(amount)],
    });
    const result = await sendTransaction(
      { to: settlementTokenAddress, data },
      { address: walletAddress },
    );
    return result.hash;
  }

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
      const result = await sendTransaction(
        { to: vaultAddress, data },
        { address: walletAddress },
      );
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
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
      const result = await sendTransaction(
        { to: vaultAddress, data },
        { address: walletAddress },
      );
      await queryClient.invalidateQueries({ queryKey: [...queryKeyBase, walletAddress] });
      return result.hash;
    },
  });

  return {
    walletAddress,
    vaultAddress,
    settlementTokenAddress,
    snapshot: snapshotQuery.data,
    isLoading: snapshotQuery.isLoading,
    isFetching: snapshotQuery.isFetching,
    error: snapshotQuery.error,
    refresh: snapshotQuery.refetch,
    faucet: faucetMutation.mutateAsync,
    isFauceting: faucetMutation.isPending,
    faucetError: faucetMutation.error,
    plant: plantMutation.mutateAsync,
    harvest: harvestMutation.mutateAsync,
    isPlanting: plantMutation.isPending,
    isHarvesting: harvestMutation.isPending,
    txError: plantMutation.error ?? harvestMutation.error,
    canInteract: Boolean(vaultAddress && walletAddress),
  };
}
