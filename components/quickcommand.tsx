"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { toast } from "./ui/use-toast";
import ExperimentGenerator from "@/experimentation-automation/experimentGeneratorGeneral";
import {
  AIRWAYS_CHATBOT_AI_EXPERIMENTATION_KEY,
  MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY,
  MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY,
  MARKETPLACE_SUGGESTED_ITEMS_EXPERIMENTATION_KEY,
  MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY,
} from "@/experimentation-automation/experimentationConstants";

import {
  generateSuggestedItemsFeatureExperimentResults,
  generateAIChatBotFeatureExperimentResults,
  generateNewSearchEngineFeatureExperimentResults,
} from "@/experimentation-automation/featureExperimentGeneratorFunctions";
import {
  generateStoreHeaderFunnelExperimentResults,
  generateShortenCollectionsPageFunnelExperimentResults,
} from "@/experimentation-automation/funnelExperimentGeneratorFunctions";

export function QuickCommandDialog({ children }: { children: any }) {
  const [open, setOpen] = React.useState(false);
  const location = useRouter();
  const [timer, setTimer] = React.useState(0);
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const resetFeatureFlags = async () => {
    toast({
      title: "Resetting",
      description:
        "Currently resetting all LaunchDarkly flags for this environment. Give us 30 seconds.",
    });

    setTimer(30); // Start the timer at 30 seconds
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId); // Clear interval when timer reaches 0
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    await fetch("/api/ldreset");
    location.reload();
    location.push("/");
  };

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandList className="!max-h-[100rem] h-full">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Demo Tools">
            <CommandItem className="cursor-pointer">
              <RotateCcw className="mr-2 h-4 w-4" />
              {timer > 0 ? (
                <p>Resetting in {timer}</p>
              ) : (
                <div
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <p onClick={resetFeatureFlags} className="font-bold font-sohnelight text-lg">
                    Reset Feature Flags
                  </p>
                  {showTooltip && (
                    <div className="text-lg">
                      This tool resets all Feature Flags to the source environment's values. To use
                      it, navigate to your LD project and open the template environment. Set your
                      desired Feature Flag values and targeting options there. This tool will then
                      use the template environment as a blueprint to apply these settings to your LD
                      environment. This process takes 30 seconds to complete
                    </div>
                  )}
                </div>
              )}
            </CommandItem>
            <CommandItem>
              <ExperimentGenerator
                title={"[Airlines] Feature Experiment Results Generator for AI Chatbot"}
                experimentationKey={AIRWAYS_CHATBOT_AI_EXPERIMENTATION_KEY}
                functionGenerator={generateAIChatBotFeatureExperimentResults}
              />
            </CommandItem>
            <CommandItem>
              <ExperimentGenerator
                title={"[Marketplace] Feature Experiment Results Generator for Suggested Items"}
                experimentationKey={MARKETPLACE_SUGGESTED_ITEMS_EXPERIMENTATION_KEY}
                functionGenerator={generateSuggestedItemsFeatureExperimentResults}
              />
            </CommandItem>
            <CommandItem>
              <ExperimentGenerator
                title={"[Marketplace] Feature Experiment Results Generator for New Search Engine"}
                experimentationKey={MARKETPLACE_NEW_SEARCH_ENGINE_EXPERIMENTATION_KEY}
                functionGenerator={generateNewSearchEngineFeatureExperimentResults}
              />
            </CommandItem>
            <CommandItem>
              <ExperimentGenerator
                title={"[Marketplace] Funnel Experiment Results Generator for Store Header"}
                experimentationKey={MARKETPLACE_STORE_HEADER_EXPERIMENTATION_KEY}
                functionGenerator={generateStoreHeaderFunnelExperimentResults}
              />
            </CommandItem>
            <CommandItem>
              <ExperimentGenerator
                title={
                  "[Marketplace] Funnel Experiment Results Generator for Shorten Collections Page"
                }
                experimentationKey={MARKETPLACE_SHORTEN_COLLECTIONS_PAGE_EXPERIMENTATION_KEY}
                functionGenerator={generateShortenCollectionsPageFunnelExperimentResults}
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
