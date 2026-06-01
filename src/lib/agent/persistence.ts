import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import type { AgentDecision } from "@/lib/agent/types";

const dataDir = path.join(process.cwd(), "..", "..", ".runtime-data");
const filePath = path.join(dataDir, "agent-decisions.jsonl");

export async function saveAgentDecision(decision: AgentDecision) {
  await mkdir(dataDir, { recursive: true });
  const record = { ...decision, savedAt: new Date().toISOString() };
  await appendFile(filePath, `${JSON.stringify(record)}
`, "utf8");
  return { storage: "jsonl", path: filePath };
}
