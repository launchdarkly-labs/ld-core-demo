import { useEffect } from 'react';
import { useLDClient } from "launchdarkly-react-client-sdk";
import { initializeTelemetry, SessionReplay } from "@launchdarkly/browser-telemetry";

const TelemetryWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useLDClient();

  useEffect(() => {
    const session = new SessionReplay();
    const telemetry = initializeTelemetry({collectors: [session]});

    if (client && telemetry) {
      telemetry.register(client);
    }
  }, [client]);

  return <>{children}</>;
};

export default TelemetryWrapper;