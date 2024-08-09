// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "../../utils/ld-server";
import { getCookie } from "cookies-next";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { transactions } from "@/schema/schema";
import { oldCheckingData } from "@/lib/oldCheckingData";
import { newCheckingData } from "@/lib/newCheckingData";
import * as ld from "@launchdarkly/node-server-sdk";
import { check } from "drizzle-orm/pg-core";
import { BankingDataInterface } from "@/utils/apiTypesInterface";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";

function delay(low: number, high: number) {
  const min = low * 1000;
  const max = high * 1000;
  const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
  //console.log("Delay is: "+randomDelay)
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}
interface UserContextInterface {
  user: { anonymous: boolean };
  kind: string;
  device?: object;
  location?: object;
  experience?: object;
  audience?: object;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankingDataInterface[] | { error: string }>
) {
  const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
  let clientSideContext: UserContextInterface = JSON.parse(
    getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}"
  );

  // let clientSideContext: UserContextInterface = {
  //   kind: "multi",
  //   user: { anonymous: true },
  //   device: {
  //     key: "Desktop",
  //     name: "Desktop",
  //     operating_system: "macOS",
  //     platform: "Desktop",
  //   },
  //   location: {
  //     key: "America/New_York",
  //     name: "America/New_York",
  //     timeZone: "America/New_York",
  //     country: "US",
  //   },
  //   experience: { key: "a380", name: "a380", airplane: "a380" },
  //   audience: { key: "52ba904d-c" },
  // };



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

  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString);
  const db = drizzle(client);

  const config: ld.LDMigrationOptions = {
    //it always hit readOld
    readOld: async (key?: string) => {
      async function getMyData() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        console.log("random failure number: " + randomNumber);
        if (randomNumber <= 20) {
          //console.log("Error caught -")
          throw new Error("Simulated failure");
        }
        // console.log("Waiting delay")
        await delay(1, 3);
        // console.log("Delay complete")
        return oldCheckingData;
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
      let checkingTransactions: BankingDataInterface[];
      checkingTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.accounttype, "checking"));
      console.log("awefawefawe line 76", checkingTransactions);
      if (checkingTransactions) {
        return ld.LDMigrationSuccess(checkingTransactions);
      } else {
        // @ts-ignore
        console.log("triggeed");
        return ld.LDMigrationSuccess(newCheckingData);
        //return ld.LDMigrationError(checkingTransactions.error as Error);
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
  const migration: ld = new ld.createMigration(ldClient, config);

  if (req.method === "GET") {
    const checkingTransactions: {
      origin: string;
      success: boolean;
      result: BankingDataInterface[];
    } = await migration.read("financialDBMigration", clientSideContext, "off");
    console.log("checkingTransactions line 106", checkingTransactions);

    if (checkingTransactions.success) {
      //console.log("the success is - " + JSON.stringify(checkingTransactions))
      if (checkingTransactions.result.length < 9 && checkingTransactions?.origin?.includes("new")) {
        res.status(200).json(newCheckingData); //send this data if there is an error and the data isn't sent from the db
        return;
      }
      res.status(200).json(checkingTransactions.result);
    } else {
      //("the failure is - " + JSON.stringify(checkingTransactions))
      res.status(502).json({ error: "Server encountered an error processing the request." });
    }
  }
}
