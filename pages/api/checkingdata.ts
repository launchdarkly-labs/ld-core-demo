// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type CheckingTransaction = {
  id: number;
  date: string;
  merchant: string;
  status: string;
  amount: number;
  accounttype: string;
  user: string;
};

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function formatISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function generateRecentTransactions(
  accountType: "checking" | "credit",
  count: number = 12
): CheckingTransaction[] {
  const merchants = [
    "SuperMarket",
    "Pharmacy",
    "GasStation",
    "Restaurant",
    "OnlineMarket",
    "TechStore",
    "CoffeeShop",
    "BookStore",
    "PetShop",
  ];

  const statuses = ["successful", "pending"];
  const now = new Date();

  const data: CheckingTransaction[] = Array.from({ length: count }).map(
    (_, index) => {
      const date = new Date(now);
      const daysBack = Math.floor(Math.random() * 14); // 0..13 days
      date.setDate(now.getDate() - daysBack);
      const amount = Number((Math.random() * 500 + 5).toFixed(2));

      return {
        id: index + 1,
        date: formatISODate(date),
        merchant: randomChoice(merchants),
        status: randomChoice(statuses),
        amount: amount,
        accounttype: accountType,
        user: "Default",
      };
    }
  );

  // Sort by most recent date first
  data.sort((a, b) => (a.date! < b.date! ? 1 : -1));
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckingTransaction[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const checking = generateRecentTransactions("checking", 25);
  res.status(200).json(checking);
}
