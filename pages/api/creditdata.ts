// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm';
import postgres from 'postgres'
import { transactions } from '@/schema/schema'
import { creditData } from '@/lib/creditInserts';
import { getServerClient } from '@/utils/ld-server';
import { getCookie } from 'cookies-next';
import * as ld from '@launchdarkly/node-server-sdk';

type Data = {
    id: number,
    date: string | null,
    merchant: string | null,
    status: string | null,
    amount: number | null,
    accounttype: string | null,
    user: string | null
}[]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {

    const connectionString = process.env.DB_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set')
    }
    const client = postgres(connectionString)
    const db = drizzle(client);
    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const clientContext: any = getCookie('ldcontext', { req, res })
const config: ld.LDMigrationOptions = {
      readOld: async(key?: string) => {
        //@ts-ignore
        return [
        ld.LDMigrationSuccess,
        creditData
        ]
      },

      readNew: async(key?: string) => {      
        let creditTransactions;
        creditTransactions = await db.select().from(transactions).where(eq(transactions.accounttype, 'checking'))
      // @ts-ignore
        return [
        ld.LDMigrationSuccess,
        creditTransactions
        ]
      },

      WriteOld: async(params?: {key: string, value: any}) => {
            res.status(200)

      },

      WriteNew: async(params?: {key: string, value: any}) => {
            res.status(200)
      },

      execution: new ld.LDConcurrentExecution(),
      latencyTracking: true,
      errorTracking: true,

    }

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
  const creditTransactions = await migration.read('financialDBMigration', jsonObject, 'off')
  res.status(200).json(creditTransactions[1])
   
}
}
