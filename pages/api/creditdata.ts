// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { recordErrorToLD } from "@/utils/observability/server";

type CreditTransaction = {
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

function generateRecentCreditTransactions(count: number = 10): CreditTransaction[] {
  const merchants = [
    "OnlineMarket",
    "TechStore",
    "Restaurant",
    "GasStation",
    "SuperMarket",
    "Pharmacy",
  ];
  const statuses = ["successful", "pending"];
  const now = new Date();

  const data: CreditTransaction[] = Array.from({ length: count }).map((_, index) => {
    const date = new Date(now);
    const daysBack = Math.floor(Math.random() * 14); // within last 2 weeks
    date.setDate(now.getDate() - daysBack);

    return {
      id: index + 1,
      date: formatISODate(date),
      merchant: randomChoice(merchants),
      status: randomChoice(statuses),
      amount: Number((Math.random() * 800 + 10).toFixed(2)),
      accounttype: "credit",
      user: "Default",
    };
  });

  data.sort((a, b) => (a.date < b.date ? 1 : -1));
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreditTransaction[] | { error: string }>
) {
  if (req.method !== "GET") {
    const errorObj = new Error("Method not allowed");
    await recordErrorToLD(
      errorObj,
      "Invalid HTTP method for credit data endpoint",
      {
        component: "CreditDataAPI",
        endpoint: "/api/creditdata",
        method: req.method || "unknown",
      }
    );
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const credit = generateRecentCreditTransactions(25);
    res.status(200).json(credit);
  } catch (error) {
    console.error("Error generating credit transactions:", error);
    if (error instanceof Error) {
      await recordErrorToLD(
        error,
        "Failed to generate credit account transactions",
        {
          component: "CreditDataAPI",
          endpoint: "/api/creditdata",
        }
      );
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
