// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { transactions } from "@/schema/schema";
import { creditData } from "@/lib/creditInserts";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import * as ld from "@launchdarkly/node-server-sdk";
import { BankingDataInterface, UserContextInterface,MigrationTransactionsInterface } from "@/utils/apiTypesInterface";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { delay } from "@/utils/utils";
import { newCheckingData } from "@/lib/newCheckingData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankingDataInterface[]>
) {
  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString);
  const db = drizzle(client);
  const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
  let clientSideContext: UserContextInterface = JSON.parse(
    getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}"
  );

  if (clientSideContext == undefined) {
    clientSideContext = {
      kind: "multi",
      user: { anonymous: true },
      device: {
        key: "Desktop",
        name: "Desktop",
        operating_system: "macOS",
        platform: "Desktop",
      },
      location: {
        key: "America/New_York",
        name: "America/New_York",
        timeZone: "America/New_York",
        country: "US",
      },
      experience: { key: "a380", name: "a380", airplane: "a380" },
      audience: { key: "52ba904d-c" },
    };
  }

  const config: ld.LDMigrationOptions = {
    readOld: async (key?: string) => {
      async function getMyData() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        // console.log("random failure number: " + randomNumber);
        if (randomNumber <= 20) {
          //console.log("Error caught -")
          throw new Error("Simulated failure");
        }
        // console.log("Waiting delay")
        await delay(1, 3);
        // console.log("Delay complete")
        return creditData;
      }

      const result = await getMyData();
      if (result) {
        return ld.LDMigrationSuccess(result);
      } else {
        //@ts-ignore
        return ld.LDMigrationError(new Error("Simulated failure"));
      }
    },

    readNew: async (key?: string) => {
      let creditTransactions: BankingDataInterface[];
      creditTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.accounttype, "checking"));
      if (creditTransactions) {
        return ld.LDMigrationSuccess(creditTransactions);
      } else {
        // @ts-ignore
        return ld.LDMigrationError(creditTransactions.error as Error);
      }
    },

    WriteOld: async (params?: { key: string; value: any }) => {
      res.status(200);
    },

    WriteNew: async (params?: { key: string; value: any }) => {
      res.status(200);
    },

    execution: new ld.LDConcurrentExecution(),
    latencyTracking: true,
    errorTracking: true,
  };
  //@ts-ignore
  const migration = new ld.createMigration(ldClient, config);

  if (req.method === "GET") {
    const creditTransactions: MigrationTransactionsInterface = await migration.read("financialDBMigration", clientSideContext, "off");
    if (creditTransactions.success) {
      //console.log("the success is - " + JSON.stringify(checkingTransactions))
      if (creditTransactions.result.length < 9 && creditTransactions?.origin?.includes("new")) {
        res.status(200).json(newCheckingData); //send this data if data from db is not the new data 
        return;
      }
      res.status(200).json(creditTransactions.result);
    } else {
      //("the failure is - " + JSON.stringify(checkingTransactions))
      res.status(502).json({ error: "Server encountered an error processing the request." });
    }
  }
}
