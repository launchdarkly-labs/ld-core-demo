import React, { useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  //don't render if flag is off
  if (!aiFraudDetectionGuardedRelease) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-xl shadow-xl p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-full p-3">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sohne text-gray-900 flex items-center gap-2">
              AI Fraud Detection
              <Badge className="bg-blue-600 text-white text-xs">Beta</Badge>
            </h3>
            <p className="text-sm text-gray-600 font-sohnelight mt-1">
              Check your recent transactions for suspicious activity
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleFraudCheck}
          disabled={isChecking}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
        >
          {isChecking ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing Transactions...
            </span>
          ) : (
            "Run Fraud Check"
          )}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                All Clear
              </p>
              <p className="text-xs text-green-700 font-sohnelight">
                No suspicious activity detected
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

