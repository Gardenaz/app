export const env = {
  appName: "Mantle Garden",
  mantleRpcUrl: process.env.NEXT_PUBLIC_MANTLE_RPC_URL ?? "",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
