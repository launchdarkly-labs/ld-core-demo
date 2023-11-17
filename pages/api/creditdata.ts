// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm';
import postgres from 'postgres'
import { transactions } from '@/schema/schema'
import { creditData } from '@/lib/creditInserts';
import { getServerClient } from '@/utils/ld-server';
import { getCookie } from 'cookies-next';

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

    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const clientContext: any = getCookie('ldcontext', { req, res })

    let dbMigration;
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

    dbMigration = await ldClient.variation("financialDBMigration", jsonObject, 'off')

    const connectionString = process.env.DB_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set')
    }
    const client = postgres(connectionString)
    const db = drizzle(client);


    if (dbMigration === 'complete') {

        const creditTransactions = await db.select().from(transactions).where(eq(transactions.accounttype, 'credit'))
        // @ts-ignore 
        res.status(200).json(creditTransactions)
    } else {
        // @ts-ignore 
        res.status(200).json(creditData)
    }
}
