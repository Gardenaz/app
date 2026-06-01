type Health = { ok: boolean; db: string; ts: string };

export async function dbHealthCheck(): Promise<Health> {
  return {
    ok: true,
    db: "supabase-placeholder",
    ts: new Date().toISOString(),
  };
}
