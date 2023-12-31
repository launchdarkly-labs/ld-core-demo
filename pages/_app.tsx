import "@/styles/globals.css";
import "@/styles/bank.css";
import "@/styles/home.css";
import type { AppProps } from "next/app";
import NoSSRWrapper from "@/components/no-ssr";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from "uuid";
import { TripsProvider } from "@/utils/contexts/TripContext";
import { LoginProvider } from "@/utils/contexts/login";
import KeyboardNavigation from "@/components/KeyboardNavigation";
import Head from "next/head";

let c;

if (typeof window !== "undefined") {
  const uniqueKey = uuidv4().slice(0, 4);

  const LDProvider = await asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY || "",
    reactOptions: {
      useCamelCaseFlagKeys: false,
    },
    context: {
      kind: "multi",
      user: {
        key: uniqueKey,
        name: "Jenn",
        appName: "DefaultDemo",
      },
      device: {
        key: uniqueKey,
        operating_system: "MacOS",
        mobile_device: "False",
      },
      location: {
        key: uniqueKey,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        country: "US",
      },
      experience: {
        key: uniqueKey,
        airplane: "a380",
      },
    },
  });

  c = ({ Component, pageProps }: AppProps) => {
    return (
      <NoSSRWrapper>
        <LDProvider>
          <LoginProvider>
            <TripsProvider>
              <KeyboardNavigation />
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                />
              </Head>
              <Component {...pageProps} />
            </TripsProvider>
          </LoginProvider>
        </LDProvider>
      </NoSSRWrapper>
    );
  };
} else {
  c = () => null;
}

export default c;
