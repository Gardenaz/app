import { promises as fs } from "node:fs";
import path from "node:path";
import type { AgentDecision } from "@/lib/agent/types";

const DATA_DIR = path.resolve(process.cwd(), ".runtime-data");
const FILE = path.join(DATA_DIR, "agent-decisions.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE); } catch { await fs.writeFile(FILE, "[]", "utf8"); }
}

export async function saveDecision(decision: AgentDecision & { anchorTxHash?: `0x${string}` | null }) {
  await ensureFile();
  const rows = await listDecisions();
  rows.unshift(decision);
  await fs.writeFile(FILE, JSON.stringify(rows.slice(0, 100), null, 2), "utf8");
}

export async function listDecisions(): Promise<Array<AgentDecision & { anchorTxHash?: `0x${string}` | null }>> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try { return JSON.parse(raw); } catch { return []; }
}
