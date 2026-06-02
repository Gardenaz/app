import mantleSepoliaDeployment from "./mantle-sepolia.json";

export const mantleSepoliaContracts = mantleSepoliaDeployment.deployment;
export const contractAbis = mantleSepoliaDeployment.abis;

export type ContractName = keyof typeof contractAbis;
export type ContractAddressName = keyof typeof mantleSepoliaContracts.contracts;

export function getContractAddress(name: ContractAddressName) {
  return mantleSepoliaContracts.contracts[name];
}

export function getContractAbi(name: ContractName) {
  return contractAbis[name];
}
