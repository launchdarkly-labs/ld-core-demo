import type { NextApiRequest, NextApiResponse } from "next";
import * as ld from "@launchdarkly/node-server-sdk";
import { recordErrorToLD } from "@/utils/observability/server";

let ldClient: ld.LDClient | null = null;

if (process.env.NEXT_PUBLIC_LD_SDK_KEY) {
  ldClient = ld.init(process.env.NEXT_PUBLIC_LD_SDK_KEY);
}

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "alert" | "success" | "warning";
};

type NotificationsResponse = {
  success: boolean;
  notifications: Notification[];
  error?: string;
};

const normalNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(Date.now() - 300000),
    read: false,
    type: "alert",
  },
  {
    id: "notif-2",
    title: "Transaction Completed",
    message: "Your transfer of $500 has been processed successfully",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    type: "success",
  },
  {
    id: "notif-3",
    title: "Account Update",
    message: "Your profile information was updated",
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    type: "info",
  },
];

const spamNotifications: Notification[] = [
  {
    id: "spam-1",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(),
    read: false,
    type: "alert",
  },
  {
    id: "spam-2",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(),
    read: false,
    type: "alert",
  },
  {
    id: "spam-3",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(),
    read: false,
    type: "alert",
  },
  {
    id: "spam-4",
    title: "Transaction Alert",
    message: "Unusual activity detected on your account",
    timestamp: new Date(),
    read: false,
    type: "warning",
  },
  {
    id: "spam-5",
    title: "Transaction Alert",
    message: "Unusual activity detected on your account",
    timestamp: new Date(),
    read: false,
    type: "warning",
  },
  {
    id: "spam-6",
    title: "Account Update",
    message: "Your settings have been changed",
    timestamp: new Date(),
    read: false,
    type: "info",
  },
  {
    id: "spam-7",
    title: "Account Update",
    message: "Your settings have been changed",
    timestamp: new Date(),
    read: false,
    type: "info",
  },
  {
    id: "spam-8",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(),
    read: false,
    type: "alert",
  },
  {
    id: "spam-9",
    title: "Transaction Alert",
    message: "Unusual activity detected on your account",
    timestamp: new Date(),
    read: false,
    type: "warning",
  },
  {
    id: "spam-10",
    title: "Security Alert",
    message: "New device login detected from Chrome on MacOS",
    timestamp: new Date(),
    read: false,
    type: "alert",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotificationsResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      notifications: [],
      error: "Method not allowed",
    });
  }

  try {
    // simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let simulateNotificationLoop = false;

    if (ldClient) {
      try {
        await ldClient.waitForInitialization({ timeout: 3 });

        const { userId = "anonymous" } = req.query;
        
        const user = {
          key: userId as string,
          anonymous: userId === "anonymous",
        };

        simulateNotificationLoop = await ldClient.variation(
          "simulateNotificationLoop",
          user,
          false
        );
      } catch (ldError) {
        console.warn("LaunchDarkly not available, using default values:", ldError);
      }
    }

    if (simulateNotificationLoop) {
      return res.status(200).json({
        success: true,
        notifications: spamNotifications,
      });
    }

    return res.status(200).json({
      success: true,
      notifications: normalNotifications,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    if (error instanceof Error) {
      await recordErrorToLD(
        error,
        "Failed to fetch notifications",
        {
          component: "NotificationsAPI",
          endpoint: "/api/notifications",
        }
      );
    }
    return res.status(500).json({
      success: false,
      notifications: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

