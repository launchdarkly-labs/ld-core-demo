import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState, useEffect, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { LDClient } from "launchdarkly-js-client-sdk";
import {
  generateSuggestedItemsFeatureExperimentResults,
  generateAIChatBotFeatureExperimentResults,
  generateNewSearchEngineFeatureExperimentResults,
} from "@/experimentation-automation/featureExperimentGeneratorFunctions";
import {
  generateStoreHeaderFunnelExperimentResults,
  generateShortenCollectionsPageFunnelExperimentResults,
} from "@/experimentation-automation/funnelExperimentGeneratorFunctions";
import { Beaker, FlaskConical } from "lucide-react";
import {
  AIRWAYS_CHATBOT_AI_EXPERIMENTATION_KEY,
  MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY,
  MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY,
  MARKETPLACE_SUGGESTED_ITEMS_EXPERIMENTATION_KEY,
  MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY,
} from "@/experimentation-automation/experimentationConstants";
import { LoginContextType } from "@/utils/typescriptTypesInterfaceLogin";

export default function ExperimentGenerator({
  title,
  experimentationKey,
}: {
  title: string;
  experimentationKey: string;
}) {
  const client:LDClient | undefined = useLDClient();
  const { updateAudienceContext }:LoginContextType = useContext(LoginContext);
  const [expGenerator, setExpGenerator] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const updateContext = async (): Promise<void> => {
    updateAudienceContext();
  };

  useEffect(() => {
    if (expGenerator) {
      switch (experimentationKey) {
        case MARKETPLACE_SUGGESTED_ITEMS_EXPERIMENTATION_KEY:
          generateSuggestedItemsFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
          });
          break;
        case AIRWAYS_CHATBOT_AI_EXPERIMENTATION_KEY:
          generateAIChatBotFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
          });
          break;
        case MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY:
          generateNewSearchEngineFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
          });
          break;
        case MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY:
          generateStoreHeaderFunnelExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
          });
          break;
        case MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY:
          generateShortenCollectionsPageFunnelExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
          });
          break;
        default:
          alert("No function exist for feature experimentation");
      }
    }
  }, [expGenerator]);

  return (
    <>
      {experimentationKey?.includes("funnel") ? (
        <FlaskConical className="mr-2 h-4 w-4" />
      ) : (
        <Beaker className="mr-2 h-4 w-4" />
      )}
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
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
                className={`mt-2 ${
                  experimentationKey.includes("airlines")
                    ? "bg-gradient-airways"
                    : "bg-gradient-experimentation"
                } p-2 rounded-sm hover:brightness-125 text-white`}
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
