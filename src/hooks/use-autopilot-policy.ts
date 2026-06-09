"use client";

import { useMutation } from "@tanstack/react-query";
import type { Address } from "viem";
import { createMantleSepoliaPublicClient } from "@/lib/agni-execution";
import { buildAutopilotPolicyContractArgs, type AutopilotPolicy } from "@/lib/agent/autopilot";
import { autopilotPolicyAbi, getAutopilotPolicyAddress } from "@/lib/contracts/autopilot-policy";
import { usePrivyWalletClient } from "@/hooks/use-privy-wallet-client";

export function useAutopilotPolicy() {
  const { getWalletClient, wallet } = usePrivyWalletClient();

  return useMutation({
    mutationFn: async ({ policy }: { policy: AutopilotPolicy }) => {
      if (!wallet) {
        throw new Error("Connect a wallet first.");
      }

      const autopilotPolicyAddress = getAutopilotPolicyAddress();
      if (!autopilotPolicyAddress) {
        throw new Error("AutopilotPolicy address missing.");
      }

      const walletClient = await getWalletClient();
      const publicClient = createMantleSepoliaPublicClient();
      const args = buildAutopilotPolicyContractArgs(policy);

      const hash = await walletClient.writeContract({
        account: wallet.address as Address,
        address: autopilotPolicyAddress,
        abi: autopilotPolicyAbi,
        functionName: "setAutopilotPolicy",
        args: [
          args.maxTxAmount,
          args.maxDailyLoss,
          args.maxRiskLevel,
          args.rebalanceInterval,
          args.oracleHeartbeat,
          args.protocols,
          args.executors,
          args.strategies,
          args.enabled,
        ],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return { hash };
    },
  });
}
