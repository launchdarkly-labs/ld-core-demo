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

export default function DestinationPicker({ children }: { children: ReactElement }) {
  const flags = useFlags();
  const destinationPickerNewAIModelLDFlag = flags["destination-picker-new-ai-model"];
  const [recsGiven, setRecsGiven] = useState(false);
  const [destinations, setDestinations] = useState("");
  const [loading, setLoading] = useState(false);

  let prompt = "";
  
  if (destinationPickerNewAIModelLDFlag?.model?.modelId.includes("cohere")) {
    prompt = "give me three recommendations of places to travel based on popular travel destinations, consider best air fare prices and places tourists / travelers are visiting currently and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time.";
  }

  if (destinationPickerNewAIModelLDFlag?.model?.modelId.includes("anthropic")) {
    prompt = "give me three recommendations of places to travel based on popular travel destinations, strongly consider weather conditions at the time of the request, and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. Limit your responses to 50 characters or less";
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
      console.log(data);
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
          <AlertDialogHeader>
            <AlertDialogTitle className="">
              <div className="flex w-full justify-center pb-2">
                <Image
                  src="/airline/launch-airways.svg"
                  height={100}
                  width={100}
                  alt="Launch Airways"
                />
              </div>
              <div className="flex w-full justify-center pb-2 text-2xl">
                Destination Recommendations
              </div>
              <div className="flex w-full justify-center pb-6 text-base text-zinc-600 font-sohnelight">
                powered by
                {destinationPickerNewAIModelLDFlag?.model?.modelId.includes("cohere") && (
                  <strong className="text-cohereColor pl-1">Cohere Command</strong>
                )}
                {destinationPickerNewAIModelLDFlag?.model?.modelId.includes("anthropic") && (
                  <strong className="text-anthropicColor pl-1">Anthropic Claude</strong>
                )}
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {loading ? (
                <div className="w-full flex items-center justify-center pb-6">
                  <GridLoader color="#405BFF" size={25} className="mt-10" />
                </div>
              ) : (
                <div className="font-sohnelight">
                  {destinations.length > 0 ? (
                    // destinations.map((destination) => (
                    <ReactMarkdown className="markdown">{destinations}</ReactMarkdown>
                  ) : (
                    <p className="text-zinc-300">No response generated yet.</p>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center items-center align-center">
            <AlertDialogAction
              onClick={resetDestinations}
              className="flex bg-transparent text-zinc-700 hover:bg-zinc-100 rounded-none h-full w-full cursor-pointer"
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
              className="bg-gradient-airways rounded-3xl h-full cursor-pointer shadow-xl w-full"
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