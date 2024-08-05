import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState, useEffect, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useLDClient } from "launchdarkly-react-client-sdk";
import {
  generateSuggestedItemsFeatureExperimentResults,
  generateAIChatBotFeatureExperimentResults,
} from "@/experimentation-automation/featureExperimentGeneratorFunctions";
import { Beaker } from "lucide-react";

export default function FeatureExperimentGenerator({
  title,
  type,
}: {
  title: string;
  type: string;
}) {
  const client = useLDClient();
  const { updateAudienceContext } = useContext(LoginContext);
  const [expGenerator, setExpGenerator] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateContext = async () => {
    updateAudienceContext();
  };

  useEffect(() => {
    if (expGenerator) {
      if (type?.includes("marketplace-suggested-item")) {
        generateSuggestedItemsFeatureExperimentResults({
          client,
          updateContext,
          setProgress,
          setExpGenerator,
        });
      } else if (type?.includes("airlines-chatbot-ai")) {
        generateAIChatBotFeatureExperimentResults({
          client,
          updateContext,
          setProgress,
          setExpGenerator,
        });
      }
    }
  }, [expGenerator]);

  return (
    <>
      <Beaker className="mr-2 h-4 w-4" />
      <Dialog>
        <DialogTrigger asChild>
          <p className="font-bold font-sohnelight text-lg">{title}</p>
        </DialogTrigger>
        <DialogContent>
          {expGenerator ? (
            <div className="flex justify-center items-center h-52">
              <div className=" font-bold font-sohne justify-center items-center text-xl">
                Generating Data
                <br />
                <div className="flex items-center mt-2 justify-center">
                  <p>{progress.toFixed(0)}% Complete</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-xl font-bold items-center h-full">
              <button
                onClick={() => setExpGenerator(true)}
                className="mt-2 bg-gradient-experimentation p-2 rounded-sm hover:text-black hover:brightness-125 text-white"
              >
                Generate {title}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
