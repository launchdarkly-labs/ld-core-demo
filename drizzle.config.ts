import type { Config } from "drizzle-kit";
 
export default {
  schema: "./schema/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL || "postgresql://postgres:LDD3v3xp@fielddemodb.cii3vie7naoe.us-west-2.rds.amazonaws.com:5432",
  }
} satisfies Config;