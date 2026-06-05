import { type Address } from "viem";
import { getContractAbi, getContractAddress } from "@/lib/contracts/config";

export const autopilotPolicyAbi = getContractAbi("AutopilotPolicy");

export function getAutopilotPolicyAddress(env: NodeJS.ProcessEnv = process.env): Address | undefined {
  const value = env.NEXT_PUBLIC_AUTOPILOT_POLICY_ADDRESS;
  if (!value) {
    return getContractAddress("autopilotPolicy") as Address;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error("NEXT_PUBLIC_AUTOPILOT_POLICY_ADDRESS must be a valid address");
  }
  return value as Address;
}
