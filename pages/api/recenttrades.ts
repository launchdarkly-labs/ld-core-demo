import type { NextApiRequest, NextApiResponse } from "next";

type RecentTrade = {
  id: number;
  name: string;
  price: string; // formatted as $123.45 like UI expects
  shares: string;
  status: "success" | "processing";
  news: string;
  type: string;
};

const SYMBOLS = ["TSLA", "AAPL", "WMT", "NVDA", "SHOP", "CRM", "MSFT", "AMZN"];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRecentTrades(count: number = 6): RecentTrade[] {
  return Array.from({ length: count }).map((_, idx) => {
    const price = (Math.random() * 500 + 20).toFixed(2);
    const shares = Math.floor(Math.random() * 20) + 1;
    return {
      id: idx + 1,
      name: randomChoice(SYMBOLS),
      price: `$${price}`,
      shares: `${shares}`,
      status: Math.random() < 0.8 ? "success" : "processing",
      news: "Auto-generated trade in the last two weeks.",
      type: "investment",
    };
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecentTrade[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const data = generateRecentTrades(6);
  res.status(200).json(data);
}
