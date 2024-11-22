import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GridLoader } from "react-spinners";
import { Button } from "../button";
import { ReactElement, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
// import { MapPinned } from "lucide-react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { DEFAULT_AI_MODEL } from "@/utils/constants";

export default function DestinationPicker({ children }: { children: ReactElement }) {
  const destinationPickerNewAIModelLDFlag =
    useFlags()["destination-picker-new-ai-model"] == undefined
      ? DEFAULT_AI_MODEL
      : useFlags()["destination-picker-new-ai-model"];
  const [recsGiven, setRecsGiven] = useState(false);
  const [destinations, setDestinations] = useState("");
  const [loading, setLoading] = useState(false);

  let prompt = "";

  if (destinationPickerNewAIModelLDFlag?.model?.modelId.includes("cohere")) {
    prompt =
      "give me three recommendations of places to travel based on popular travel destinations, consider best air fare prices and places tourists / travelers are visiting currently and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time.";
  }

  if (destinationPickerNewAIModelLDFlag?.model?.modelId.includes("anthropic")) {
    prompt =
      "give me three recommendations of places to travel based on popular travel destinations, strongly consider weather conditions at the time of the request, and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. Limit your responses to 50 characters or less";
  }

  async function getDestinations() {
    try {
      setRecsGiven(true);
      setLoading(true);
      const response = await fetch("/api/destination-picker", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
      });
      const data = await response.json();
   
      setDestinations(data);
    } catch {
      console.error(new Error("there was a problem with the API"));
    } finally {
      setLoading(false);
    }
  }

  function resetDestinations() {
    setRecsGiven(false);
  }

  useEffect(() => {
    setDestinations(destinations);
  }, [recsGiven]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      {recsGiven ? (
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center text-2xl">
            <Image
              src="/airline/launch-airways.svg"
              className=" pb-4"
              height={100}
              width={100}
              alt="Launch Airways"
            />
            <AlertDialogTitle className="text-2xl flex w-full justify-center ">
              Destination Recommendations
            </AlertDialogTitle>
            <p className="flex w-full justify-center text-base text-zinc-600 font-sohnelight">
              powered by&nbsp;
              {destinationPickerNewAIModelLDFlag?.model?.modelId.includes("cohere") && (
                <span className="text-cohereColor"> Cohere Command </span>
              )} 
              {destinationPickerNewAIModelLDFlag?.model?.modelId.includes("anthropic") && (
                <span className="text-anthropicColor">Anthropic Claude </span>
              )}
              &nbsp;with&nbsp;
              <span className="text-amazonColor"> Amazon Bedrock </span>
            </p>
          </AlertDialogHeader>
          {loading ? (
            <div className="w-full flex items-center justify-center pb-6">
              <GridLoader color="#405BFF" size={25} className="mt-10" />
            </div>
          ) : (
            <>
              {destinations.length > 0 ? (
                // destinations.map((destination) => (
                <ReactMarkdown className="markdown font-sohnelight w-full h-full">{destinations}</ReactMarkdown>
              ) : (
                <p className="text-zinc-300">No response generated yet.</p>
              )}
            </>
          )}

          <AlertDialogFooter className="flex  items-center align-center sm:!justify-center !sm:space-x-1">
            <AlertDialogAction
              onClick={resetDestinations}
              className={`flex bg-gradient-airways text-white hover:bg-zinc-100 rounded-full h-full 
                w-1/2 cursor-pointer ${!loading && "animate-pulse hover:animate-none"}`}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-sohne">
              <div className="flex flex-col w-full">
                <div className="flex justify-center pb-6">
                  <div className="flex w-full justify-center pb-2">
                    <Image
                      src="/airline/launch-airways.svg"
                      height={100}
                      width={100}
                      alt="Launch Airways"
                    />
                  </div>
                </div>
                <div className="flex items-center text-center justify-center">
                  <p>Where do you want to go today?</p>
                </div>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pb-6">
              Let us help you pick your next great vacation spot. Launch Airways AI destination
              recommendation tool will help you find the latest and greatest places for travel!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={getDestinations}
              className="bg-gradient-airways rounded-3xl h-full cursor-pointer shadow-xl w-full animate-pulse hover:animate-none"
            >
              Let's Go!
            </Button>
            <AlertDialogCancel className="rounded-3xl shadow-xl w-full">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
