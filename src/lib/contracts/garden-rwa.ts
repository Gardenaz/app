import { keccak256, stringToHex, type Address } from "viem";
import { getContractAddress, type ContractAddressName } from "@/lib/contracts/config";

export const gardenRwaMockVaultAbi = [
  {
    type: "function",
    name: "positionCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "positions",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "cropKeyHash", type: "bytes32" },
      { name: "principal", type: "uint256" },
      { name: "assetAmount", type: "uint256" },
      { name: "plantedPrice", type: "uint256" },
      { name: "harvestedValue", type: "uint256" },
      { name: "plantedAt", type: "uint256" },
      { name: "lastRebalancedAt", type: "uint256" },
      { name: "harvestedAt", type: "uint256" },
      { name: "harvested", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "currentValue",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "routePrice",
    stateMutability: "view",
    inputs: [{ name: "cropKey", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "openPositionFor",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "cropKey", type: "string" },
      { name: "principal", type: "uint256" },
      { name: "decisionHash", type: "bytes32" },
    ],
    outputs: [{ name: "positionId", type: "uint256" }],
  },
  {
    type: "function",
    name: "rebalancePosition",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "newCropKey", type: "string" },
      { name: "decisionHash", type: "bytes32" },
    ],
    outputs: [{ name: "nextAssetAmount", type: "uint256" }],
  },
  {
    type: "function",
    name: "closePosition",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "decisionHash", type: "bytes32" },
    ],
    outputs: [{ name: "harvestedValue", type: "uint256" }],
  },
  {
    type: "function",
    name: "plant",
    stateMutability: "nonpayable",
    inputs: [
      { name: "cropKey", type: "string" },
      { name: "principal", type: "uint256" },
    ],
    outputs: [{ name: "positionId", type: "uint256" }],
  },
  {
    type: "function",
    name: "harvest",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "harvestedValue", type: "uint256" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "cashBalance",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "setVaultOperator",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "isVaultOperator",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "positionIdsOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "activePositionIdsOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
] as const;

export const gardenRwaCropKeys = ["steady", "growth", "boost"] as const;
export type GardenRwaCropKey = typeof gardenRwaCropKeys[number];

const cropKeyHashes = Object.fromEntries(
  gardenRwaCropKeys.map((key) => [key, keccak256(stringToHex(key))]),
) as Record<GardenRwaCropKey, `0x${string}`>;

export function getGardenRwaCropKey(hash: `0x${string}`): GardenRwaCropKey | null {
  const found = (Object.entries(cropKeyHashes) as Array<[GardenRwaCropKey, `0x${string}`]>)
    .find(([, value]) => value === hash);
  return found?.[0] ?? null;
}

export function getGardenRwaCropHash(cropKey: GardenRwaCropKey): `0x${string}` {
  return cropKeyHashes[cropKey];
}

export function getGardenRwaVaultAddress(env: NodeJS.ProcessEnv = process.env): Address | undefined {
  const value = env.NEXT_PUBLIC_GARDEN_RWA_MOCK_VAULT_ADDRESS;
  if (!value) {
    return getContractAddress("gardenRwaMockVault") as Address;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error("NEXT_PUBLIC_GARDEN_RWA_MOCK_VAULT_ADDRESS must be a valid address");
  }
  return value as Address;
}

export function getGardenRwaRouteAdapterAddress(
  cropKey: GardenRwaCropKey,
  env: NodeJS.ProcessEnv = process.env,
): Address | undefined {
  const envKey =
    cropKey === "steady"
      ? "NEXT_PUBLIC_STEADY_ADAPTER_ADDRESS"
      : cropKey === "growth"
        ? "NEXT_PUBLIC_GROWTH_ADAPTER_ADDRESS"
        : "NEXT_PUBLIC_BOOST_ADAPTER_ADDRESS";
  const contractKey: ContractAddressName =
    cropKey === "steady" ? "steadyAdapter" : cropKey === "growth" ? "growthAdapter" : "boostAdapter";
  const value = env[envKey];
  if (!value) {
    return getContractAddress(contractKey) as Address;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`${envKey} must be a valid address`);
  }
  return value as Address;
}
