import { useEffect } from 'react';
import { useLDClient } from "launchdarkly-react-client-sdk";
import { register } from "@launchdarkly/browser-telemetry";
import Observability from "@launchdarkly/observability";
import SessionReplay from "@launchdarkly/session-replay";
const TelemetryWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useLDClient();

  useEffect(() => {

    if (client) {
      register(client);
      client.addHook(new Observability(process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
        serviceName: process.env.NEXT_PUBLIC_PROJECT_KEY+"-observability",
        tracingOrigins: true,
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }
      }));
      client.addHook(new SessionReplay(process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
        serviceName: process.env.NEXT_PUBLIC_PROJECT_KEY+"-session-replay",
        tracingOrigins: true,
        inlineImages: true,
        inlineVideos: true,
        inlineStylesheet: true
      }));
    }
  }, [client]);


return <>
    {children}
  </>;
};

export default TelemetryWrapper;