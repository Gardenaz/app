"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMantleSepoliaPublicClient } from "@/lib/agni-execution";
import { usePrivyWalletClient } from "@/hooks/use-privy-wallet-client";
import type { AgentDecision } from "@/lib/agent/types";
import { mantleSepolia } from "@/lib/privy";

type ExecutionPayload = {
  decision: AgentDecision;
  execution?: {
    mode: "disabled" | "blocked" | "prepared" | "sent";
    target?: `0x${string}`;
    calldata?: `0x${string}`;
    approval?: {
      token: `0x${string}`;
      spender: `0x${string}`;
      amount: string;
      calldata: `0x${string}`;
    };
    preview?: {
      quotedInputAmount?: string;
      quotedOutputAmount?: string;
    };
  };
};

async function recordOutcome(input: {
  decision: AgentDecision;
  executionTxHash: `0x${string}`;
  quotedInputAmount?: string;
  quotedOutputAmount?: string;
}) {
  await fetch("/api/agent/outcome", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  }).then(async (res) => {
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  });
}

export function useAgniExecution() {
  const { getWalletClient, wallet } = usePrivyWalletClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ decision, execution }: ExecutionPayload) => {
      if (!wallet) {
        throw new Error("Connect a wallet first.");
      }
      if (!execution?.target) {
        throw new Error("No Agni execution target available.");
      }

      const walletClient = await getWalletClient();
      const publicClient = createMantleSepoliaPublicClient();

      if (execution.mode === "blocked" && execution.approval) {
        const approvalTxHash = await walletClient.sendTransaction({
          account: wallet.address as `0x${string}`,
          to: execution.approval.token,
          data: execution.approval.calldata,
          value: 0n,
          chain: mantleSepolia,
        });

        await publicClient.waitForTransactionReceipt({ hash: approvalTxHash });
        return {
          stage: "approved" as const,
          txHash: approvalTxHash,
        };
      }

      if (execution.mode !== "prepared" || !execution.calldata) {
        throw new Error("This route is not ready for live execution.");
      }

      const executionTxHash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: execution.target,
        data: execution.calldata,
        value: 0n,
        chain: mantleSepolia,
      });

      await publicClient.waitForTransactionReceipt({ hash: executionTxHash });
      await recordOutcome({
        decision,
        executionTxHash,
        quotedInputAmount: execution.preview?.quotedInputAmount,
        quotedOutputAmount: execution.preview?.quotedOutputAmount,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agent-history"] }),
      ]);

      return {
        stage: "executed" as const,
        txHash: executionTxHash,
      };
    },
  });
}
