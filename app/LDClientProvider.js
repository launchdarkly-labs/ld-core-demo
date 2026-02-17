"use client";

import { useMemo, useState, useEffect } from "react";
import { LDProvider } from "launchdarkly-react-client-sdk";
import Observe from "@launchdarkly/observability";
import Record from "@launchdarkly/session-replay";

const DEFAULT_SERVICE_NAME = "policy-agent-node";

/**
 * Client-side LaunchDarkly provider with Observability and Session Replay.
 * Receives LD_CLIENT_ID and LD_OBSERVABILITY_SERVICE_NAME from the server layout.
 */
export function LDClientProvider({ children, clientSideID, observabilityServiceName }) {
  const [contextKey, setContextKey] = useState(null);

  const ldOptions = useMemo(
    () => ({
      plugins: [
        new Observe({
          serviceName: observabilityServiceName || DEFAULT_SERVICE_NAME,
          tracingOrigins: true,
          networkRecording: {
            enabled: true,
            recordHeadersAndBody: false,
          },
        }),
        new Record({ privacySetting: "strict" }),
      ],
    }),
    [observabilityServiceName]
  );

  useEffect(() => {
    try {
      let key = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("ld-anon-key") : null;
      if (!key) {
        key = [...crypto.getRandomValues(new Uint8Array(8))].map((x) => x.toString(16)).join("");
        if (typeof sessionStorage !== "undefined") sessionStorage.setItem("ld-anon-key", key);
      }
      setContextKey(key);
    } catch (_) {
      setContextKey(`anon-${Date.now()}`);
    }
  }, []);

  if (!clientSideID) {
    return children;
  }

  if (contextKey === null) {
    return children;
  }

  return (
    <LDProvider
      clientSideID={clientSideID}
      context={{ kind: "user", key: contextKey }}
      options={ldOptions}
      timeout={10}
    >
      {children}
    </LDProvider>
  );
}
