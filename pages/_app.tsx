import "@/styles/globals.css";
import "@/styles/bank.css";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';
import "@/styles/home.css";
import type { AppProps } from "next/app";
import NoSSRWrapper from "@/components/no-ssr";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from "uuid";
import { TripsProvider } from "@/utils/contexts/TripContext";
import { LoginProvider } from "@/utils/contexts/login";
import KeyboardNavigation from "@/components/KeyboardNavigation";
import Head from "next/head";
import { PersonaProvider } from "@/components/personacontext";
import { QuickCommandDialog } from "@/components/quickcommand";


let c;

if (typeof window !== "undefined") {
  //const uniqueKey = uuidv4().slice(0, 4);

  const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
  const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';

  const LDProvider = await asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY || "",
    reactOptions: {
      useCamelCaseFlagKeys: false,
    },
    context: {
      kind: "multi",
      user: {
        key: "jenn@launchmail.io",
        name: "Jenn",
        email: "jenn@launchmail.io",
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
        key: uuidv4().slice(0, 6),
      }
    },
  });

  c = ({ Component, pageProps }: AppProps) => {
    return (
      <NoSSRWrapper>
        <LDProvider>
          <PersonaProvider>
            
              <LoginProvider>
              <QuickCommandDialog>
                <TripsProvider>
                  <KeyboardNavigation />
                  <Head>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                    />
                    <link rel="apple-touch-icon" href="/apple-icon.png" />
                  </Head>
                  <Component {...pageProps} />
                </TripsProvider>
                </QuickCommandDialog>
              </LoginProvider>
          </PersonaProvider>
        </LDProvider>
      </NoSSRWrapper>
    );
  };
} else {
  c = () => null;
}

export default c;
