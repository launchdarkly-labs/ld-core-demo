import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { personaschema } from "@/schema/schema";
// @ts-ignore

type Data = {
  id: number;
  name: string | null;
  email: string | null;
  image: number | null;
}[];

type PostData = {
  name: string;
  type: string;
  image: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>
) {
  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString);
  const db = drizzle(client);

  switch (req.method) {
    case 'GET':
      await handleGet(req, res, db);
      break;
    case 'POST':
      await handlePost(req, res, db);
      break;
    case 'DELETE':
      await handleDelete(res, db);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>,
  db: ReturnType<typeof drizzle>
) {
  const { personaToQuery } = req.query;
  if (typeof personaToQuery !== "string") {
    res.status(400).json({ error: "Invalid persona" });
    return;
  }

  let persona;
  if (personaToQuery === "all") {
    persona = await db.select().from(personaschema);
    
    if (persona.length === 0) {
      const usersToAdd = [
        { personaName: 'Cody', personaType: 'Standard User', personaImage: 'standard.jpg', personaEmail: 'cody@launchmail.io' },
        { personaName: 'Alysha', personaType: 'Beta User', personaImage: 'beta.png', personaEmail: 'alysha@launchmail.io' },
        { personaName: 'Jenn', personaType: 'Developer', personaImage: 'woman.png', personaEmail: 'jenn@launchmail.io' }
      ];

      try {
        for (const user of usersToAdd) {
          await db
            .insert(personaschema)
            .values(user)
            .execute();
        }
        persona = await db.select().from(personaschema);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add new users" });
        return;
      }
    }
  }  
    // @ts-ignore
  res.status(200).json(persona);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>,
  db: ReturnType<typeof drizzle>
) {
  const { name, type, image, email } = req.body as PostData;
  if (!name || !type || !email || image === undefined) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const newPersona = await db
      .insert(personaschema)
      .values({ personaName: name, personaType: type, personaImage: image, personaEmail: email })
      .execute();
    res.status(201).json(newPersona);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleDelete(
  res: NextApiResponse<Data[] | { error: string }>,
  db: ReturnType<typeof drizzle>
) {
  try {
    await db.delete(personaschema).execute();
    res.status(201)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete personas" });
  }
}

