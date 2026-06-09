import { type Address } from "viem";
import { getContractAddress } from "@/lib/contracts/config";

export const gardenManagedAccountAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenBalanceOf",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "executors",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "depositToken",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawToken",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setExecutor",
    stateMutability: "nonpayable",
    inputs: [
      { name: "executor", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    outputs: [],
  },
] as const;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function isZeroAddress(value?: string) {
  return !value || value.toLowerCase() === ZERO_ADDRESS;
}

export function getManagedGardenAccountAddress(env: NodeJS.ProcessEnv = process.env): Address | undefined {
  const override = env.NEXT_PUBLIC_GARDEN_MANAGED_ACCOUNT_ADDRESS;
  if (override) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(override)) {
      throw new Error("NEXT_PUBLIC_GARDEN_MANAGED_ACCOUNT_ADDRESS must be a valid address");
    }
    return override === ZERO_ADDRESS ? undefined : (override as Address);
  }

  const deploymentAddress = getContractAddress("gardenManagedAccount");
  if (isZeroAddress(deploymentAddress)) {
    return undefined;
  }
  return deploymentAddress as Address;
}
