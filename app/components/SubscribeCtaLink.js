"use client";

import { useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import {
  getSubscriberFlowEvaluation,
  getSubscriberFlowVariation,
  subscribeFlowHref,
} from "../../lib/checkout";

export default function SubscribeCtaLink({
  className,
  style,
  children,
  plan,
}) {
  const ldClient = useLDClient();
  const evaluation = getSubscriberFlowEvaluation(ldClient);
  const variation = getSubscriberFlowVariation(ldClient);
  const href = subscribeFlowHref(variation);

  useEffect(() => {
    if (!ldClient) return;
    console.log("[subscriber-flow-version]", {
      variation,
      href,
      flagInPayload: evaluation.flagInPayload,
      usedCodeDefault: evaluation.usedDefault,
      reason: evaluation.reason,
      sdkFlagKeys: Object.keys(ldClient.allFlags()).sort(),
    });
  }, [variation, href, ldClient, evaluation]);

  return (
    <a
      href={href}
      className={className}
      style={style}
      data-checkout-version={variation ?? "v1"}
      data-plan={plan}
    >
      {children}
    </a>
  );
}
