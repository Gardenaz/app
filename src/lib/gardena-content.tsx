import { Bot, DatabaseZap, Sparkles } from "lucide-react";

export const navItems = ["Product", "Tracks", "How it works", "Proof", "FAQ"];

export const strategies = [
  {
    name: "Rice / Safe Harvest",
    risk: "Low risk",
    apy: "4-6%",
    asset: "USDY",
    route: "Mantle RWA USDY Route",
    desc: "Conservative USDY lane for stable RWA yield and clean policy proof.",
  },
  {
    name: "Corn / Growth Field",
    risk: "Medium risk",
    apy: "7-11%",
    asset: "mETH",
    route: "Mantle mETH Yield Route",
    desc: "mETH route for measured compounding with volatility guardrails.",
  },
  {
    name: "Chili / Boost Farm",
    risk: "High risk",
    apy: "12-20%",
    asset: "USDY/mETH",
    route: "Mantle Dynamic RWA Route",
    desc: "Dynamic allocation with stricter preflight checks before any rebalance.",
  },
];

export const features = [
  {
    icon: <Bot className="size-5" />,
    title: "Bounded AI agent",
    text: "Agent recommends and executes only inside user policy: max amount, max risk, route allowlist, and rebalance interval.",
  },
  {
    icon: <DatabaseZap className="size-5" />,
    title: "On-chain benchmark trail",
    text: "Every decision can produce a hash, Mantle log, benchmark outcome, and reputation update for auditability.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Consumer garden UX",
    text: "Complex RWA yield becomes crops, harvest cards, diary entries, and shareable proof instead of raw DeFi jargon.",
  },
];

export const steps = [
  ["01", "Connect", "Login with Privy, use embedded wallet or external wallet, then choose a crop lane."],
  ["02", "Set policy", "Pick amount, risk preference, allowed routes, and rebalance interval."],
  ["03", "Agent plans", "LangGraph agent scores USDY/mETH routes and blocks unsafe strategy changes."],
  ["04", "Proof lands", "Decision hash, Mantle tx, and benchmark outcome become garden proof."],
] as const;

export const proofRows = [
  ["Agent identity", "ERC-8004-style identity NFT + reputation registry"],
  ["Decision hash", "0xa71e...f09c · policy-safe rebalance"],
  ["Benchmark", "USDY harvest +5.2% APY · outcome pending log"],
  ["Transparency", "Readable diary + on-chain DecisionLog"],
] as const;

export const faq = [
  ["Is Gardena a Bybit trading bot?", "No. Current MVP focuses AI x RWA on Mantle with USDY/mETH strategies. Bybit/CEX adapter can be future extension, not core."],
  ["Can agent move funds freely?", "No. Policy fences define max amount, risk level, allowed routes, rebalance interval, and emergency pause."],
  ["Why crops?", "Crops make yield strategy understandable and shareable for consumer users without hiding benchmark proof."],
] as const;
