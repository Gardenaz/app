import mantleSepoliaDeployment from "./mantle-sepolia.json";

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

function readAddress(name: string, value: string | undefined) {
  if (!value) return undefined;
  if (!ADDRESS_PATTERN.test(value)) {
    throw new Error(`${name} must be a valid address`);
  }
  return value as `0x${string}`;
}

const deploymentOverrides = {
  agentIdentity: readAddress("NEXT_PUBLIC_AGENT_IDENTITY_ADDRESS", process.env.NEXT_PUBLIC_AGENT_IDENTITY_ADDRESS),
  decisionLog: readAddress("NEXT_PUBLIC_DECISION_LOG_ADDRESS", process.env.NEXT_PUBLIC_DECISION_LOG_ADDRESS),
  autopilotPolicy: readAddress("NEXT_PUBLIC_AUTOPILOT_POLICY_ADDRESS", process.env.NEXT_PUBLIC_AUTOPILOT_POLICY_ADDRESS),
};

export const mantleSepoliaContracts = {
  ...mantleSepoliaDeployment.deployment,
  contracts: {
    ...mantleSepoliaDeployment.deployment.contracts,
    ...Object.fromEntries(Object.entries(deploymentOverrides).filter(([, value]) => Boolean(value))),
  },
};
export const contractAbis = mantleSepoliaDeployment.abis;
export const mantleSepoliaRegistration = {
  agentWallet: process.env.NEXT_PUBLIC_AUTOPILOT_EXECUTOR_ADDRESS ?? "",
};

export type ContractName = keyof typeof contractAbis;
export type ContractAddressName = keyof typeof mantleSepoliaContracts.contracts;

// Keep address lookup permissive during the Agni migration while the app still contains vault-era call sites.
export function getContractAddress(name: string) {
  return mantleSepoliaContracts.contracts[name as ContractAddressName];
}

export function getContractAbi(name: ContractName) {
  return contractAbis[name];
}
