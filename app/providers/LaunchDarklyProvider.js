"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";
import { buildLaunchDarklyContext } from "../../lib/utm";
import LaunchDarklyUtmSync from "./LaunchDarklyUtmSync";

const clientSideID = process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID;

export default function LaunchDarklyProvider({ children }) {
  if (!clientSideID) {
    return children;
  }

  return (
    <LDProvider
      clientSideID={clientSideID}
      reactOptions={{ useCamelCaseFlagKeys: false }}
      context={buildLaunchDarklyContext()}
    >
      <LaunchDarklyUtmSync />
      {children}
    </LDProvider>
  );
}
