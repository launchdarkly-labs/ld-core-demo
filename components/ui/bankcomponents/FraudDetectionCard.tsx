import React, { useState } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, X, Sparkles } from "lucide-react";

interface FraudDetectionCardProps {
  // props will be added as needed
}

interface FraudCheckResult {
  success: boolean;
  status: "clear" | "suspicious" | "error";
  message: string;
  transactionsChecked?: number;
  error?: string;
}

export default function FraudDetectionCard({}: FraudDetectionCardProps) {
  const { enhancedFraudDetectionGuardedRelease } = useFlags();
  const ldClient = useLDClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FraudCheckResult | null>(null);

  const handleFraudCheck = async () => {
    setIsChecking(true);
    setResult(null);

    try {
      const userId = ldClient?.getContext()?.key || "anonymous";
      
      const response = await fetch("/api/fraud-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data: FraudCheckResult = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        status: "error",
        message: "Failed to perform fraud check",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (!enhancedFraudDetectionGuardedRelease) {
    return null;
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-[12px] right-[90px] z-40 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
          
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
            <Shield className="h-6 w-6" strokeWidth={2.5} />
          </div>
          
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        </div>
        
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-xl">
            Enhanced Fraud Detection
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8 pr-8">
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-lg opacity-40" />
                        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
                          <Shield className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold font-sohne bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                          Enhanced Fraud Detection
                        </h3>
                        <p className="text-sm text-gray-600 font-sohnelight leading-relaxed">
                          Real-time monitoring system that analyzes your transactions to detect and prevent fraudulent activity
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleFraudCheck}
                      disabled={isChecking}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isChecking ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-base">Analyzing Transactions...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Shield className="h-5 w-5" />
                          <span className="text-base">Run Fraud Check</span>
                        </span>
                      )}
                    </Button>

                    {result && result.status === "clear" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 rounded-full p-2">
                            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-green-900 mb-1 font-sohne">
                              All Clear
                            </p>
                            <p className="text-sm text-green-700 font-sohnelight">
                              {result.message}. Checked {result.transactionsChecked} transactions.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {result && result.status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 p-5 shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-red-100 rounded-full p-2">
                            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-red-900 mb-1 font-sohne">
                              Service Error
                            </p>
                            <p className="text-sm text-red-700 font-sohnelight mb-2">
                              {result.message}
                            </p>
                            {result.error && (
                              <p className="text-xs text-red-600 font-mono bg-red-100 px-2 py-1 rounded">
                                {result.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

