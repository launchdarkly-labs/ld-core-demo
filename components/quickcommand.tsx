"use client";

import * as React from "react";
import { RotateCcw, FlaskConical, Beaker, ChevronDown } from "lucide-react"; // Import ChevronDown for scroll indication
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
import FunnelExperimentGenerator from "@/components/ui/marketcomponents/funnelexperimentgenerator";
import FeatureExperimentGenerator from "@/components/ui/marketcomponents/featureexperimentgenerator";
import FeatureExperimentGeneratorAI from "@/components/ui/airwayscomponents/featureexperimentgeneratorai";
import RollbackToggleBankAPIRelease from "@/components/ui/bankcomponents/rollbacktogglebankapirelease";
import GenerateToggleBankDatabaseGRresults from "@/components/ui/bankcomponents/generatetogglebankdatabasegrresults";

export function QuickCommandDialog({ children }) {
  const [open, setOpen] = React.useState(false);
  const location = useRouter();
  const [timer, setTimer] = React.useState(0);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [showScrollIcon, setShowScrollIcon] = React.useState(false); 
  const commandListRef = React.useRef(null);

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

  React.useEffect(() => {
    const checkOverflow = () => {
      if (commandListRef.current) {
        const { scrollHeight, clientHeight } = commandListRef.current;
        setShowScrollIcon(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [open]);

  const resetFeatureFlags = async () => {
    toast({
      title: "Resetting",
      description:
        "Currently resetting all LaunchDarkly flags for this environment. Give us 30 seconds.",
    });

    setTimer(30); 
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId); 
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
        <div className="pl-4 pt-4 font-bold">Info:</div>
        <ul className="p-4 pb-2 mr-4 list-disc list-inside">
          <li>Kindly refresh your browser after generating results to ensure all generators are properly closed</li>
          <li>Scroll for more Demo Tools</li>
          <li>If no results are generated for Guarded Release then please wait 5 minutes before LD resets your events queue </li>
        </ul>
        <div className="relative">
          <CommandList ref={commandListRef}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Demo Tools">
              <CommandItem>
                <RotateCcw className="mr-2 h-4 w-4" />
                {timer > 0 ? (
                  <p>Resetting in {timer}</p>
                ) : (
                  <div
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <div onClick={resetFeatureFlags}>
                      <p className="font-bold font-sohnelight text-lg">
                        Reset Feature Flags
                      </p>
                      {showTooltip && (
                        <div className="text-lg">
                          This tool resets all Feature Flags to the source
                          environment's values. To use it, navigate to your LD
                          project and open the template environment. Set your
                          desired Feature Flag values and targeting options there.
                          This tool will then use the template environment as a
                          blueprint to apply these settings to your LD
                          environment. This process takes 30 seconds to complete
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CommandItem>
              <CommandItem>
                <FlaskConical className="mr-2 h-4 w-4" />
                <FunnelExperimentGenerator />
              </CommandItem>
              <CommandItem>
                <Beaker className="mr-2 h-4 w-4" />
                <FeatureExperimentGenerator />
              </CommandItem>
              <CommandItem>
                <Beaker className="mr-2 h-4 w-4" />
                <FeatureExperimentGeneratorAI />
              </CommandItem>
              <CommandItem>
                <RotateCcw className="mr-2 h-4 w-4" />
                <RollbackToggleBankAPIRelease />
              </CommandItem>
              <CommandItem>
                <RotateCcw className="mr-2 h-4 w-4" />
                <GenerateToggleBankDatabaseGRresults />
              </CommandItem>
            </CommandGroup>
          </CommandList>
          {showScrollIcon && (
            <div className="absolute bottom-0 right-0 p-2">
              <ChevronDown className="h-4 w-4" />
            </div>
          )}
        </div>
      </CommandDialog>
    </>
  );
}