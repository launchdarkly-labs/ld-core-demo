import { useEffect } from 'react';
import { useLDClient } from "launchdarkly-react-client-sdk";
import { register } from "@launchdarkly/browser-telemetry";
import { HighlightInit, H } from '@highlight-run/next/client'

const TelemetryWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = useLDClient();

  useEffect(() => {

    if (client) {
      register(client);
      H.registerLD(client);
    }
  }, [client]);

  return <>
    <HighlightInit
				projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
				serviceName="launch-investments"
				tracingOrigins
        inlineImages={true}
        inlineVideos={true}
        inlineStylesheet={true}
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>
    {children}
  </>;
};

export default TelemetryWrapper;