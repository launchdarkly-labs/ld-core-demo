"use client";

import { useEffect, useRef } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { buildLaunchDarklyContext, resolveUtmParams } from "../../lib/utm";

export default function LaunchDarklyUtmSync() {
  const ldClient = useLDClient();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!ldClient || syncedRef.current) return;

    const utm = resolveUtmParams();
    if (!Object.keys(utm).length) return;

    syncedRef.current = true;
    const context = buildLaunchDarklyContext(utm);

    ldClient.identify(context).catch((err) => {
      syncedRef.current = false;
      console.warn("[LaunchDarkly] failed to identify with UTM context", err);
    });
  }, [ldClient]);

  return null;
}
