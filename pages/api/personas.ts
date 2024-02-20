import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

import os from "os";

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

function getSubdomain(req: NextApiRequest): string | null {
  const host = req.headers.host;
  if (!host) return null;
  if (host.startsWith("localhost:") || host.startsWith("127.0.0.1:")) {
    return os.hostname().toLowerCase().replace(/\./g, "_");
  }
  const parts = host.split(".");
  return parts.length > 2 ? parts[0] : null;
}

async function createTableForSubdomain(
  db: ReturnType<typeof drizzle>,
  subdomain: string
) {
  const tableName = `personas_${subdomain}`;

  const checkTableExistsSQL = sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name   = ${tableName}
    );
  `;
  const tableExists = await db.execute(checkTableExistsSQL);
  if (!tableExists[0].exists) {
    const createTableSQL = sql`
  CREATE TABLE ${sql.identifier(tableName)} (
    id SERIAL PRIMARY KEY,
    personaname TEXT,
    personatype TEXT,
    personaimage TEXT,
    personaemail TEXT
  );
`;
    await db.execute(createTableSQL);
  }

  const personaschema = pgTable(tableName, {
    id: serial("id").primaryKey(),
    personaname: text("personaname"),
    personatype: text("personatype"),
    personaimage: text("personaimage"),
    personaemail: text("personaemail"),
  });

  return personaschema;
}

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

  const subdomain = getSubdomain(req);
  if (!subdomain) {
    res.status(400).json({ error: "Subdomain is required" });
    return;
  }
  const personaschema = await createTableForSubdomain(db, subdomain);

  const tableName = `personas_${subdomain}`;

  switch (req.method) {
    case "GET":
      await handleGet(req, res, db, personaschema);
      break;
    case "POST":
      await handlePost(req, res, db, personaschema);
      break;
    case "DELETE":
      await handleDelete(res, db, personaschema);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>,
  db: ReturnType<typeof drizzle>,
  personaschema: ReturnType<typeof pgTable>
) {
  const { personaToQuery } = req.query;
  if (typeof personaToQuery !== "string") {
    res.status(400).json({ error: "Invalid persona" });
    return;
  }

  let persona;

  if (personaToQuery === "all") {
    persona = await db.select().from(personaschema).execute();
    if (persona.length === 0) {
      const usersToAdd = [
        {
          personaname: "Cody",
          personatype: "Standard User",
          personaimage: "standard.jpg",
          personaemail: "cody@launchmail.io",
        },
        {
          personaname: "Alysha",
          personatype: "Beta User",
          personaimage: "beta.png",
          personaemail: "alysha@launchmail.io",
        },
        {
          personaname: "Jenn",
          personatype: "Developer",
          personaimage: "woman.png",
          personaemail: "jenn@launchmail.io",
        },
      ];

      try {
        for (const user of usersToAdd) {
          await db.insert(personaschema).values(user).execute();
        }
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
  db: ReturnType<typeof drizzle>,
  personaschema: ReturnType<typeof pgTable>
) {
  const { name, type, image, email } = req.body as PostData;
  if (!name || !type || !email || image === undefined) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const newPersona = await db
      .insert(personaschema)
      .values({
        personaname: name,
        personatype: type,
        personaimage: image,
        personaemail: email,
      })
      .execute();
    res.status(201).json(newPersona);
  } catch (error) {
  
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleDelete(
  res: NextApiResponse<Data[] | { error: string }>,
  db: ReturnType<typeof drizzle>,
  personaschema: ReturnType<typeof pgTable>
) {
  try {
    await db.delete(personaschema).execute();
    res.status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete personas" });
  }
}
