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
    ? "If this looks good, approve the next Agni step or keep it in guided mode."
    : "Nothing will move until your safety rules allow it.";
  const proof = anchorTxHash
    ? `Decision anchored on-chain: \`${anchorTxHash}\`.`
    : "Decision proof will appear after the Mantle benchmark write is confirmed.";

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
      : "Proof is pending Mantle benchmark confirmation.";

  return [
    `**Current action:** ${title}`,
    `**Why it moved:** ${why}`,
    `**Safety check:** ${risk}`,
    `**Proof:** ${proof}`,
    `**Next review:** Autopilot can keep reviewing Agni-ready positions and policy-safe opportunities on Mantle.`,
  ].join("\n\n");
}

export function buildAssistantSummary(mode: AssistantMode, decision: AgentDecision, anchorTxHash?: `0x${string}` | null) {
  return mode === "autopilot"
    ? buildAutopilotAssistantSummary(decision, anchorTxHash)
    : buildGuidedAssistantSummary(decision, anchorTxHash);
}
