import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from 'crypto-js';
import { setCookie } from "cookies-next";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [LDProvider, setLDProvider] = useState<any>(null);

  useEffect(() => {
    const initializeLDProvider = async () => {
      const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
      const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';

      const context = {
        kind: "multi",
        user: {
          key: CryptoJS.SHA256("user@launchmail.io").toString(),
          name: "User",
          email: CryptoJS.SHA256("user@launchmail.io").toString(),
          appName: "LD Demo",
        },
        device: {
          key: device,
          name: device,
          operating_system: operatingSystem,
          platform: device,
        },
        location: {
          key: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          country: "US",
        },
        experience: {
          key: "a380",
          name: "a380",
          airplane: "a380",
        },
        audience: {
          key: uuidv4().slice(0, 10),
        }
      };

      setCookie(LD_CONTEXT_COOKIE_KEY, context);
      console.log(context);

      const Provider = await asyncWithLDProvider({
        clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY || "",
        reactOptions: {
          useCamelCaseFlagKeys: false,
        },
        options: {
          application: {
            id: "launch-investments",
          },
          privateAttributes: ['email', 'name']
        },
        context: context
      });

      setLDProvider(() => Provider);
    };

    initializeLDProvider();
  }, []);

  if (!LDProvider) {
    // Return a loading indicator or null
    return <div>Loading LaunchDarkly...</div>;
  }

  return <LDProvider>{children}</LDProvider>;
};

export default ContextProvider;