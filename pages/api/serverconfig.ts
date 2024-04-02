import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  lastAccessedDate: any;
  appVersion: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const data = {
    lastAccessedDate: process.env.lastAccessedDate,
    appVersion: process.env.appVersion,
  };

  res.status(200).json(data);
}
