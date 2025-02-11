import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  lastAccessedDate: any;
  appVersion: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const data = {
    lastAccessedDate: process.env.NEXT_PUBLIC_CREATED_DATE,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
  };

  res.status(200).json(data);
}
