import type { AgentDecision } from "./types";

export type AssistantMode = "guided" | "autopilot";

function safeText(value?: string | null, fallback = "Not available") {
  return value?.trim() || fallback;
}

function strategyName(decision: AgentDecision) {
  return safeText(decision.plan?.title, "Strategy");
}

function bestAlternative(decision: AgentDecision) {
  if (decision.plan?.consumerTheme) return decision.plan.consumerTheme;
  if (decision.plan?.trackFit) return decision.plan.trackFit;
  if (decision.plan?.shareLabel) return decision.plan.shareLabel;
  return "Keep capital in the safer lane if you want lower variance.";
}

export function buildGuidedAssistantSummary(decision: AgentDecision, anchorTxHash?: `0x${string}` | null) {
  const best = strategyName(decision);
  const why = safeText(decision.plan?.explanation, decision.summary);
  const risk = safeText(decision.policy?.reason, "Policy check completed");
  const next = decision.policy?.allow
    ? "If this looks good, move money into the vault or use the manual controls."
    : "Nothing will move until your safety rules allow it.";
  const proof = anchorTxHash
    ? `Decision anchored on-chain: \`${anchorTxHash}\`.`
    : "Decision proof will appear after the vault action is confirmed.";

  return [
    `**Best option:** ${best}`,
    `**Why:** ${why}`,
    `**Alternative:** ${bestAlternative(decision)}`,
    `**Risk:** ${risk}`,
    `**Next:** ${next.trim()}`,
    `**Proof:** ${proof}`,
  ].join("\n\n");
}

export function buildAutopilotAssistantSummary(decision: AgentDecision, anchorTxHash?: `0x${string}` | null) {
  const title = strategyName(decision);
  const why = safeText(decision.summary, decision.plan?.explanation);
  const risk = safeText(decision.policy?.reason, "Policy check completed");
  const proof = anchorTxHash
    ? `Proof anchored on-chain: \`${anchorTxHash}\`.`
    : decision.anchorTxHash
      ? `Proof anchored on-chain: \`${decision.anchorTxHash}\`.`
      : "Proof is pending anchor confirmation.";

  return [
    `**Current plan:** ${title}`,
    `**Why:** ${why}`,
    `**Safety check:** ${risk}`,
    `**Proof:** ${proof}`,
    `**Next:** Autopilot can keep reviewing vault cash and active positions inside your policy.`,
  ].join("\n\n");
}

export function buildAssistantSummary(mode: AssistantMode, decision: AgentDecision, anchorTxHash?: `0x${string}` | null) {
  return mode === "autopilot"
    ? buildAutopilotAssistantSummary(decision, anchorTxHash)
    : buildGuidedAssistantSummary(decision, anchorTxHash);
}
