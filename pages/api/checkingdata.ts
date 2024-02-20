// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient } from '../../utils/ld-server';
import { getCookie } from 'cookies-next';
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm';
import postgres from 'postgres'
import { transactions } from '@/schema/schema'
import { checkData } from '@/lib/checkingdata';
import * as ld from '@launchdarkly/node-server-sdk'


type Data = {
  id: number,
  date: string | null,
  merchant: string | null,
  status: string | null,
  amount: string | null,
  accounttype: string | null,
  user: string | null
}[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { error: string }>
) {

  function delay(low: number, high: number) {
    const min = low * 1000;
    const max = high * 1000; 
    const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
    //console.log("Delay is: "+randomDelay)
    return new Promise(resolve => setTimeout(resolve, randomDelay));
  }
  const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
  const clientContext: any = getCookie('ldcontext', { req, res })
  const connectionString = process.env.DB_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  const client = postgres(connectionString)
  const db = drizzle(client);

  const config: ld.LDMigrationOptions = {
    readOld: async (key?: string) => {
      async function getMyData() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        //console.log("random failure number: " + randomNumber)
        if (randomNumber <= 20) {
          //console.log("Error caught -")
          throw new Error('Simulated failure');
        }
        // console.log("Waiting delay")
        await delay(1,3)
        // console.log("Delay complete")
        return checkData
      }

      const result = await getMyData()

      if (result) {

        return ld.LDMigrationSuccess(result);
      } else {
        //@ts-ignore
        return ld.LDMigrationError(new Error('Simulated failure'))
      }
    },

    readNew: async (key?: string) => {
      let checkingTransactions;
      checkingTransactions = await db.select().from(transactions).where(eq(transactions.accounttype, 'checking'))

      if (checkingTransactions) {
        //console.log(checkingTransactions)
        return ld.LDMigrationSuccess(checkingTransactions)
      } else {
        // @ts-ignore
        return ld.LDMigrationError(checkingTransactions.error as Error)
      }
    },

    WriteOld: async (params?: { key: string, value: any }) => {
      res.status(200)

    },

    WriteNew: async (params?: { key: string, value: any }) => {
      res.status(200)
    },

    execution: new ld.LDConcurrentExecution(),
    latencyTracking: true,
    errorTracking: true,

  }
  //@ts-ignore
  const migration = new ld.createMigration(ldClient, config)

  let jsonObject

  if (clientContext == undefined) {
    jsonObject = {
      key: '12234',
      user: "Anonymous"
    }
  } else {
    const json = decodeURIComponent(clientContext);
    jsonObject = JSON.parse(json);
  }

  if (req.method === 'GET') {
    const checkingTransactions = await migration.read('financialDBMigration', jsonObject, 'off')

    if (checkingTransactions.success) {
      //console.log("the success is - " + JSON.stringify(checkingTransactions))
      res.status(200).json(checkingTransactions.result)
    } else {
      //("the failure is - " + JSON.stringify(checkingTransactions))
      res.status(502).json({ error: 'Server encountered an error processing the request.' })
    }
  }
}
