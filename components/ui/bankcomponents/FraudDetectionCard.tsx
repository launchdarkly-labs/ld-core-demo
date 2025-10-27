import React, { useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Button } from "@/components/ui/button";

interface FraudDetectionCardProps {
  // props will be added as needed
}

export default function FraudDetectionCard({}: FraudDetectionCardProps) {
  const { aiFraudDetectionGuardedRelease } = useFlags();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFraudCheck = async () => {
    setIsChecking(true);
    setResult(null);

    // placeholder
    setTimeout(() => {
      setIsChecking(false);
      setResult("Fraud check completed");
    }, 1000);
  };

  // Don't render if flag is off
  if (!aiFraudDetectionGuardedRelease) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>AI Fraud Detection</h3>
        <p>Check your recent transactions for suspicious activity</p>
      </div>

      <div>
        <Button onClick={handleFraudCheck} disabled={isChecking}>
          {isChecking ? "Checking..." : "Run Fraud Check"}
        </Button>

        {result && <div>{result}</div>}
      </div>
    </div>
  );
}

