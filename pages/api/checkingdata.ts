// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm';
import postgres from 'postgres'
import { transactions } from '@/schema/schema'

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
    res: NextApiResponse<Data[]>
) {
    const connectionString = process.env.DB_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set')
    }
    const client = postgres(connectionString)
    const db = drizzle(client);

    const checkingTransactions = await db.select().from(transactions).where(eq(transactions.accounttype, 'checking'))
    // @ts-ignore
    res.status(200).json(checkingTransactions)
}
