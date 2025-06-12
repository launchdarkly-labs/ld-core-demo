import { useEffect } from 'react';
import { useLDClient } from "launchdarkly-react-client-sdk";
import { register } from "@launchdarkly/browser-telemetry";
const TelemetryWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useLDClient();

  useEffect(() => {
    if (client) {
      register(client);
    }
  }, [client]);


return <>
    {children}
  </>;
};

export default TelemetryWrapper;