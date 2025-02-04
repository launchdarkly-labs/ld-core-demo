import React, { useState, useContext, useCallback } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLDClient } from "launchdarkly-react-client-sdk";
import LoginContext from "@/utils/contexts/login";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { v4 as uuidv4 } from "uuid";

export default function GenerateToggleBankDatabaseGRresults() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shouldStop, setShouldStop] = useState(false);
  const { updateUserContextWithUserId } = useContext(LoginContext);
  const ldClient = useLDClient();
  const currentContext = ldClient?.getContext();
  const { logLDMetricSent } = useContext(LiveLogsContext);

  const startGeneration = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    setShouldStop(false);

    const metrics = [
      { key: "recent-trades-db-errors", type: "occurrence" },
      { key: "recent-trades-db-latency", type: "event" },
    ];
    const featureFlagKey = "togglebankDBGuardedRelease";

    try {
      const trueVariationContexts = [];
      const falseVariationContexts = [];

      while (trueVariationContexts.length < 100 && !shouldStop) {
        const userContexts = Array.from({ length: 1000 }, () => ({
          key: uuidv4(),
        }));

        for (const context of userContexts) {
          if (shouldStop) break;
          updateUserContextWithUserId(context.key);
          const variation = await ldClient?.variation(featureFlagKey, true);
          console.log("Variation: ", variation);
          if (variation) {
            trueVariationContexts.push(context);
            console.log("Length of trueVariationContexts: ", trueVariationContexts.length);
          } else {
            falseVariationContexts.push(context);
          }
        }
        if (trueVariationContexts.length < 100) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        } else {
          console.log("Received 100 true variation contexts");
          break; 
        }
      }

      const processMetrics = async (contexts, latencyRange) => {
        for (const context of contexts) {
          if (shouldStop) break;
          for (const metric of metrics) {
            if (shouldStop) break;
            const latencyNumber =
              metric.type === "event"
                ? Math.floor(
                    Math.random() * (latencyRange.max - latencyRange.min + 1)
                  ) + latencyRange.min
                : undefined;
            if (metric.type === "event") {
              await ldClient?.track(metric.key, undefined, latencyNumber);
            } else {
              await ldClient?.track(metric.key);
            }
            logLDMetricSent(metric.key, context);
            await ldClient?.flush();
          }
        }
      };

      console.log("True variation contexts:", trueVariationContexts);
      await processMetrics(trueVariationContexts, { min: 100, max: 200 });
      await processMetrics(falseVariationContexts, { min: 250, max: 300 });

      if (!shouldStop) {
        setTimeout(() => {
          setProgress(100);
        }, 100);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      updateUserContextWithUserId(currentContext?.key);
      setIsGenerating(false);
    }
  }, [ldClient, updateUserContextWithUserId, currentContext, shouldStop]);

  const stopGeneration = useCallback(() => {
    setShouldStop(true);
    setIsGenerating(false);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="font-bold font-sohnelight text-lg">
          Generate Toggle Bank Database GR Results
        </p>
      </DialogTrigger>
      <DialogContent>
        {isGenerating ? (
          <div className="flex justify-center items-center h-52">
            <div className="font-bold font-sohne justify-center items-center text-xl">
              Generating Data
              <br />
              <button
                onClick={stopGeneration}
                className="mt-2 bg-red-500 p-2 rounded-sm hover:text-black hover:brightness-125 text-white mx-auto block"
              >
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-xl font-bold items-center h-full">
            <button
              onClick={startGeneration}
              className="mt-2 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-sm hover:text-black hover:brightness-125 text-white"
            >
              Start Generate Toggle Bank Database GR Results
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
