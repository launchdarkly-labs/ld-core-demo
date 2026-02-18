"use client";

import { useMemo, useState, useEffect } from "react";
import { LDProvider } from "launchdarkly-react-client-sdk";
import Observe from "@launchdarkly/observability";
import Record from "@launchdarkly/session-replay";

const DEFAULT_SERVICE_NAME = "policy-agent-node";

/**
 * Client-side LaunchDarkly provider with Observability and Session Replay.
 */
export function LDClientProvider({
  children,
  clientSideID,
  observabilityServiceName,
  sessionReplayPrivacy,
}) {
  const [contextKey, setContextKey] = useState(null);

  // LD_SESSION_REPLAY_PRIVACY: default (default) | strict
  const privacy = sessionReplayPrivacy === "strict" ? "strict" : "default";

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
        new Record({ privacySetting: privacy }),
      ],
    }),
    [observabilityServiceName, privacy]
  );

  useEffect(() => {
    try {
      const key = [...crypto.getRandomValues(new Uint8Array(8))].map((x) => x.toString(16)).join("");
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
