"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, type Address } from "viem";
import { mantleSepolia } from "@/lib/privy";
import { getContractAbi, getContractAddress } from "@/lib/contracts/config";

export type GardenRwaCropKey = "steady" | "growth" | "boost";

export type GardenWalletPreview = {
  configured: boolean;
  mode: "preview";
  walletAddress?: Address;
  agentIdentityAddress?: Address;
  autopilotPolicyAddress?: Address;
  decisionLogAddress?: Address;
  hasAgentIdentity?: boolean;
  policyEnabled?: boolean;
  policyPaused?: boolean;
  policyVersion?: string;
  tokenBalance?: string;
  vaultCashBalance?: string;
  operatorApproved?: boolean;
  autopilotPolicyEnabled?: boolean;
  autopilotProtocolAllowed?: boolean;
  autopilotEmergencyPaused?: boolean;
  positions: Array<{
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
  }>;
};

const queryKeyBase = ["garden-agni-preview"] as const;

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

async function readPreview(walletAddress?: Address): Promise<GardenWalletPreview> {
  const agentIdentityAddress = getContractAddress("agentIdentity") as Address | undefined;
  const autopilotPolicyAddress = getContractAddress("autopilotPolicy") as Address | undefined;
  const decisionLogAddress = getContractAddress("decisionLog") as Address | undefined;
  const configured = Boolean(agentIdentityAddress && autopilotPolicyAddress && decisionLogAddress);

  if (!walletAddress || !configured) {
    return {
      configured,
      mode: "preview",
      walletAddress,
      agentIdentityAddress,
      autopilotPolicyAddress,
      decisionLogAddress,
      tokenBalance: "0",
      vaultCashBalance: "0",
      operatorApproved: false,
      autopilotPolicyEnabled: false,
      autopilotProtocolAllowed: false,
      autopilotEmergencyPaused: false,
      positions: [],
    };
  }

  const client = createClient();
  if (!client) {
    return {
      configured,
      mode: "preview",
      walletAddress,
      agentIdentityAddress,
      autopilotPolicyAddress,
      decisionLogAddress,
      tokenBalance: "0",
      vaultCashBalance: "0",
      operatorApproved: false,
      autopilotPolicyEnabled: false,
      autopilotProtocolAllowed: false,
      autopilotEmergencyPaused: false,
      positions: [],
    };
  }

  const identityAddress = agentIdentityAddress as Address;
  const policyAddress = autopilotPolicyAddress as Address;

  const [identityBalance, policyRow, policyVersion] = await Promise.all([
    client.readContract({
      address: identityAddress,
      abi: getContractAbi("AgentIdentity"),
      functionName: "balanceOf",
      args: [walletAddress],
    }).catch(() => 0n),
    client.readContract({
      address: policyAddress,
      abi: getContractAbi("AutopilotPolicy"),
      functionName: "policies",
      args: [walletAddress],
    }).catch(() => null),
    client.readContract({
      address: policyAddress,
      abi: getContractAbi("AutopilotPolicy"),
      functionName: "policyVersion",
      args: [walletAddress],
    }).catch(() => null),
  ]);

  const policy = policyRow as readonly [
    bigint,
    bigint,
    number,
    bigint,
    bigint,
    boolean,
    boolean,
    bigint,
    bigint,
    bigint,
  ] | null;

  return {
    configured,
    mode: "preview",
    walletAddress,
    agentIdentityAddress,
    autopilotPolicyAddress,
    decisionLogAddress,
    hasAgentIdentity: Number(identityBalance) > 0,
    policyEnabled: policy?.[5] ?? false,
    policyPaused: policy?.[6] ?? false,
    policyVersion: typeof policyVersion === "bigint" ? policyVersion.toString() : undefined,
    tokenBalance: "0",
    vaultCashBalance: "0",
    operatorApproved: false,
    autopilotPolicyEnabled: policy?.[5] ?? false,
    autopilotProtocolAllowed: false,
    autopilotEmergencyPaused: policy?.[6] ?? false,
    positions: [],
  };
}

export function useGardenRwaVault() {
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address as Address | undefined;

  const previewQuery = useQuery({
    queryKey: [...queryKeyBase, walletAddress ?? "anonymous"],
    queryFn: () => readPreview(walletAddress),
    refetchInterval: 20_000,
  });

  const snapshot = previewQuery.data;
  const previewError = new Error("Preview-only mode: Agni approval and execution are not wired in this phase.");
  const disabledAction = async (..._args: unknown[]) => {
    throw previewError;
  };

  return {
    walletAddress,
    snapshot,
    allSnapshot: snapshot,
    isLoading: previewQuery.isLoading,
    isFetching: previewQuery.isFetching,
    error: previewQuery.error,
    refresh: previewQuery.refetch,
    faucet: disabledAction,
    isFauceting: false,
    faucetError: null,
    faucetAvailableInMs: 0,
    canFaucet: false,
    plant: disabledAction,
    deposit: disabledAction,
    withdraw: disabledAction,
    harvest: disabledAction,
    setVaultOperator: disabledAction,
    setAutopilotPolicy: disabledAction,
    isPlanting: false,
    isDepositing: false,
    isWithdrawing: false,
    isHarvesting: false,
    isSettingOperator: false,
    isSettingPolicy: false,
    txError: null,
    canInteract: Boolean(walletAddress),
    mode: snapshot?.mode ?? "preview",
  };
}
