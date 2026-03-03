"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { LDClientProvider } from "./LDClientProvider";

const SessionContext = createContext(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  return ctx ?? { projectKey: "", sdkKey: "", clientSideId: null, setSession: () => {} };
}

/**
 * Connect response shape: { projectKey, sdkKey, clientSideId?, environmentKey, environmentName }
 */
export function SessionProvider({ children }) {
  const [session, setSessionState] = useState({ projectKey: "", sdkKey: "", clientSideId: null });
  const setSession = useCallback((data) => {
    if (!data) return;
    setSessionState({
      projectKey: data.projectKey ?? "",
      sdkKey: data.sdkKey ?? "",
      clientSideId: data.clientSideId ?? null,
    });
  }, []);

  const value = {
    projectKey: session.projectKey,
    sdkKey: session.sdkKey,
    clientSideId: session.clientSideId,
    setSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/**
 * Wraps children with LDClientProvider only when a project has been set up (user connected).
 * Client-side LD (Observability + Session Replay) is not initialized until then.
 */
export function LDClientWrapper({
  observabilityServiceName,
  sessionReplayPrivacy,
  children,
}) {
  const { clientSideId } = useSession();

  return (
    <LDClientProvider
      clientSideID={clientSideId || undefined}
      observabilityServiceName={observabilityServiceName}
      sessionReplayPrivacy={sessionReplayPrivacy}
    >
      {children}
    </LDClientProvider>
  );
}
