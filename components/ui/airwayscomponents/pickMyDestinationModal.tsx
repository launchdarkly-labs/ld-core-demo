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
} from "@/components/ui/alert-dialog"
import { BounceLoader } from "react-spinners";
import { Button } from "../button";
import {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'

export default function DestinationPicker () {
const [recsGiven, setRecsGiven] = useState(false);
const [destinations, setDestinations] = useState<Array<any>>([]);
const [loading, setLoading] = useState(false);

const prompt =
  "give me three recommendations of places to travel based on popular travel destinations, strongly consider weather conditions at the time of the request, and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots every time I ask. Only respond using JSON format with the keys 'name' and 'reason', it should be an array of 3 JSON objects returned, limiting each response to 50 characters or less";

   async function getDestinations () {
    try {
        setRecsGiven(true);
        setLoading(true);
        const response = await fetch("/api/destination-picker", {
          method: "POST",
          body: JSON.stringify({ prompt: prompt}),
        });
        const data = await response.json()
        console.log(JSON.parse(data));
        setDestinations(JSON.parse(data))
        
    }
    catch {
        console.error(new Error("there was a problem with the API"))
    }
    finally {
        setLoading(false)
    }
    }   

    function resetDestinations () {
        setRecsGiven(false)
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-white text-black rounded-none h-full w-full text-3xl p-6 cursor-pointer hover:bg-zinc-200">
            Pick My Destination
          </Button>
        </AlertDialogTrigger>
        {recsGiven ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Your top three destinations!</AlertDialogTitle>
              <AlertDialogDescription>
                {loading ? (
                  <BounceLoader
                    color="rgb(59 130 246)"
                    size={50}
                    className="mt-10"
                  />
                ) : (
                  <div className="font-sohnelight">
                    {destinations.length > 0 ?
                    (
                        destinations.map(destination => (
                            <div className="flex flex-col">
                            <h2 className="flex text-base text-black">
                                {destination.name}
                            </h2>
                            <p className="flex pb-2">
                                {destination.reason}
                            </p>
                            </div>
                        ))
                    )
                     : (
                      <p className="text-zinc-300">
                        No response generated yet.
                      </p>
                    )}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={resetDestinations}
                className="bg-gradient-airways rounded-none h-full cursor-pointer"
              >
                Thanks!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Where do you want to go today?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Let us help you pick your next great vacation spot. Launch
                Airways AI destination recommendation tool will help you find
                the latest and greatest places for travel!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={getDestinations}
                className="bg-gradient-airways rounded-none h-full cursor-pointer"
              >
                Let's Go!
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    );
}