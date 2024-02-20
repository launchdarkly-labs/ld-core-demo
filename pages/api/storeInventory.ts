import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { galaxymarketplace } from "@/schema/schema";
// @ts-ignore

type Data = {
  id: number;
  item: string | null;
  vendor: string | null;
  cost: number | null;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>
) {

  const { storename } = req.query;
  if (typeof storename !== "string") {
    res.status(400).json({ error: "Invalid storename" });
    return;
  }

  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString);
  const db = drizzle(client);
  // @ts-ignore

  let storeInventory;
  if (storename === "all") {
    storeInventory = await db.select().from(galaxymarketplace);
  } else {
    storeInventory = await db
      .select()
      .from(galaxymarketplace)
      .where(eq(galaxymarketplace.vendor, storename));
  }
  // @ts-ignore


  res.status(200).json(storeInventory);
}
