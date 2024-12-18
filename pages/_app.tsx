import "@/styles/globals.css";
import "@/styles/bank.css";
import "@/styles/home.css";
import type { AppProps } from "next/app";
import NoSSRWrapper from "@/components/no-ssr";
import dynamic from "next/dynamic";
import { TripsProvider } from "@/utils/contexts/TripContext";
import { LoginProvider } from "@/utils/contexts/login";
import KeyboardNavigation from "@/components/KeyboardNavigation";
import Head from "next/head";
import { QuickCommandDialog } from "@/components/quickcommand";
import { LiveLogsProvider } from "@/utils/contexts/LiveLogsContext";
import LiveLogsPopUp from "@/components/ui/LiveLogsPopUp";

let c;

if (typeof window !== "undefined") {
  const DynamicContextProvider = dynamic(() => import("@/components/ContextProvider"), {
    ssr: false,
  });

  const DynamicTelemetryProvider = dynamic(() => import("@/components/TelemetryProvider"), {
    ssr: false,
  });

  c = ({ Component, pageProps }: AppProps) => {
    return (
      <NoSSRWrapper>
        <LiveLogsProvider>
          <DynamicContextProvider>
            <DynamicTelemetryProvider>
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
                    <div className="">
                      <Component {...pageProps} />
                      <LiveLogsPopUp/>
                    </div>
                  </TripsProvider>
                </QuickCommandDialog>
              </LoginProvider>
            </DynamicTelemetryProvider>
          </DynamicContextProvider>
        </LiveLogsProvider>
      </NoSSRWrapper>
    );
  };
} else {
  c = () => null;
}

export default c;
