import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { investmentRecentTradesSchema } from "@/schema/schema";
// @ts-ignore

type Data = {
  id: number;
  name: string | null;
  price: number | null;
  date: string | null;
  shares: string | null;
  status: string | null;
  news: string | null;
  type: string | null;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>
) {
  
//     const { storename } = req.query;
//   if (typeof storename !== "string") {
//     res.status(400).json({ error: "Invalid storename" });
//     return;
//   }

  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString);
  const db = drizzle(client);
  // @ts-ignore

  const allRecentTrades = await db.select().from(investmentRecentTradesSchema);
  // @ts-ignore

  res.status(200).json(allRecentTrades);
}
