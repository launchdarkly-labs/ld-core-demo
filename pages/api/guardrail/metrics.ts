import type { NextApiRequest, NextApiResponse } from "next";

type Metric = {
    ts: number;
    sourceFidelity?: number;
    relevance?: number;
    accuracy?: number;
    cost?: number;
    clamped?: boolean;
    trigger?: string;
    inputSnippet?: string;
};

// Simple in-memory buffer for demo purposes
const buffer: Metric[] = [];

export function pushMetric(m: Metric) {
    buffer.push(m);
    if (buffer.length > 100) buffer.shift();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ metrics: buffer });
}


