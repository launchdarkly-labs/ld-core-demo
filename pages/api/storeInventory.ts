import type { NextApiRequest, NextApiResponse } from "next";

type InventoryItem = {
  id: number;
  item: string;
  vendor: string;
  cost: string; // keep string to match UI expectations
  dateAdded: string; // within last 14 days
};

function formatISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function generateInventory(vendor: string, count: number = 6): InventoryItem[] {
  const items = [
    "VR Headset",
    "Gaming Monitor",
    "Wireless Controller",
    "GPU",
    "Laptop",
    "Headphones",
    "Mechanical Keyboard",
    "Smart Speaker",
  ];
  const now = new Date();
  return Array.from({ length: count }).map((_, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - Math.floor(Math.random() * 14));
    return {
      id: idx + 1,
      item: items[Math.floor(Math.random() * items.length)],
      vendor,
      cost: (Math.random() * 900 + 20).toFixed(2),
      dateAdded: formatISODate(d),
    };
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InventoryItem[] | { error: string }>
) {
  const { storename } = req.query;
  if (typeof storename !== "string") {
    res.status(400).json({ error: "Invalid storename" });
    return;
  }

  if (storename === "all") {
    const vendors = ["vrgalaxy", "macrocenter", "boominbox"];
    const all = vendors.flatMap((v) => generateInventory(v, 4));
    res.status(200).json(all);
  } else {
    res.status(200).json(generateInventory(storename, 6));
  }
}
