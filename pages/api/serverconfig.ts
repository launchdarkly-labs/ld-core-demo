import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

type ResponseData = {
  lastAccessedDate: any;
  appVersion: string;
};

const { publicRuntimeConfig } = getConfig();
const data = {
  lastAccessedDate: publicRuntimeConfig.lastAccessedDate,
  appVersion: publicRuntimeConfig.appVersion,
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json(data);
}
