import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface FraudDetectionCardProps {
  // Props will be added as needed
}

export default function FraudDetectionCard({}: FraudDetectionCardProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFraudCheck = async () => {
    setIsChecking(true);
    setResult(null);

    // Placeholder - will be implemented in Phase 4
    setTimeout(() => {
      setIsChecking(false);
      setResult("Fraud check completed");
    }, 1000);
  };

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

