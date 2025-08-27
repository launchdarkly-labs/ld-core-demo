import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState, useEffect, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useLDClient } from "launchdarkly-react-client-sdk";
import {
  generateSuggestedItemsFeatureExperimentResults,
  generateAIChatBotFeatureExperimentResults,
  generateNewSearchEngineFeatureExperimentResults,
  generateToggleBankSpecialOffersFeatureExperimentResults,
} from "@/components/generators/experimentation-automation/featureExperimentGeneratorFunctions";
import {
  generateStoreHeaderFunnelExperimentResults,
  generateShortenCollectionsPageFunnelExperimentResults,
  generateToggleBankSignupFunnelExperimentResults,
} from "@/components/generators/experimentation-automation/funnelExperimentGeneratorFunctions";
import { Beaker, FlaskConical } from "lucide-react";
import {
  TOGGLEBANK_CHATBOT_AI_EXPERIMENTATION_KEY,
  TOGGLEBANK_SIGNUP_FUNNEL_EXPERIMENTATION_KEY,
  TOGGLEBANK_SPECIAL_OFFERS_EXPERIMENTATION_KEY,
  MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY,
  MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY,
  MARKETPLACE_SUGGESTED_ITEMS_EXPERIMENTATION_KEY,
  MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY,
} from "@/components/generators/experimentation-automation/experimentationConstants";
import { useLDClientError } from "launchdarkly-react-client-sdk";
import { capitalizeFirstLetter } from "@/utils/utils";

export default function ExperimentGenerator({
  title,
  experimentationKey,
  functionGenerator,
}: {
  title: string;
  experimentationKey: string;
  functionGenerator: void;
}) {
  const client = useLDClient();
  const { updateUserContext } = useContext(LoginContext);
  const [expGenerator, setExpGenerator] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [experimentTypeObj, setExperimentTypeObj] = useState<{
    experimentType: string;
    numOfRuns: number;
  }>({ experimentType: "", numOfRuns: 0 });
  const ldClientError = useLDClientError();

  if (ldClientError) {
    alert("Error in LaunchDarkly Client");
  }

  const updateContext = async (): Promise<void> => {
    updateUserContext();
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
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case TOGGLEBANK_CHATBOT_AI_EXPERIMENTATION_KEY:
          generateAIChatBotFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case TOGGLEBANK_SIGNUP_FUNNEL_EXPERIMENTATION_KEY:
          generateToggleBankSignupFunnelExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case TOGGLEBANK_SPECIAL_OFFERS_EXPERIMENTATION_KEY:
          generateToggleBankSpecialOffersFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY:
          generateNewSearchEngineFeatureExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY:
          generateStoreHeaderFunnelExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        case MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY:
          generateShortenCollectionsPageFunnelExperimentResults({
            client: client,
            updateContext: updateContext,
            setProgress: setProgress,
            setExpGenerator: setExpGenerator,
            experimentTypeObj: experimentTypeObj,
          });
          break;
        default:
          alert("No function exist for feature experimentation");
      }
    }

    return () => {
      setExperimentTypeObj({ experimentType: "", numOfRuns: 0 });
    };
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
          {experimentTypeObj.experimentType !== "" ? (
            <div className="flex justify-center items-center h-52">
              <div className=" font-bold font-sohne justify-center items-center text-xl text-center">
                Generating Data {capitalizeFirstLetter(experimentTypeObj.experimentType)}{" "}
                Experimentation
                <br />
                Running {experimentTypeObj.numOfRuns} runs...
                <br />
                <div className="flex items-center mt-2 justify-center">
                  <p>{progress.toFixed(2)}% Complete</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center text-xl font-bold items-center h-full gap-y-4">
              <h2>{title}</h2>
              <div className="flex gap-x-4">
                <button
                  onClick={async () => {

                    const bayesianExperimentTypeObj = { experimentType: "bayesian", numOfRuns: 500 };
                    setExperimentTypeObj(bayesianExperimentTypeObj);
                    //generatorFunction(experimentationKey,bayesianExperimentTypeObj );
                    setExpGenerator(true);
          
                  }}
                  className={`mt-2 ${"bg-gradient-airways"} p-2 rounded-sm hover:brightness-125 text-white`}
                >
                  Bayesian Experimentation
                </button>

                <button
                  onClick={async () => {
                    const frequentistExperimentTypeObj = { experimentType: "frequentist", numOfRuns: 10000 };
                    setExperimentTypeObj(frequentistExperimentTypeObj);
                    //generatorFunction(experimentationKey,frequentistExperimentTypeObj );
                    setExpGenerator(true);
                  }}
                  className={`mt-2 ${"bg-gradient-experimentation"} p-2 rounded-sm hover:brightness-125 text-white`}
                >
                  Frequentist Experimentation
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
