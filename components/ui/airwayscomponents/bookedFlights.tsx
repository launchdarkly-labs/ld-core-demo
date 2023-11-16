import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import TripsContext from "@/utils/contexts/TripContext";
import { ArrowRight, PersonStanding } from "lucide-react";
import { useFlags } from "launchdarkly-react-client-sdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function BookedFlights() {
  const { bookedTrips, cancelTrip, setBookedTrips, enrolledInLaunchClub } =
    useContext(TripsContext);
  const { priorityBoarding } = useFlags();
  const [status, setStatus] = useState("Economy");
  const [aiResponse, setAIResponse] = useState("")
  const [toAirport, setToAirport] = useState("")
  const [loading, setLoading] = useState(false)

  console.log(bookedTrips);


  

  async function submitQuery(airport: any) {
    try {
      const prompt: string = `Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${airport}, write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here.`;

      console.log(prompt);
      setLoading(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}. Check API Server Logs.`
        );
      }

      const data = await response.json();
      setAIResponse(data.completion);
      console.log(data.completion);
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setToAirport("")
      setLoading(false);
    }
  }





  const handleCancel = (index: any) => {
    // Maybe show a confirmation dialog here
    cancelTrip(index);
    // Remove the trip from the bookedTrips array
    setBookedTrips(
      bookedTrips.filter((_: any, tripIndex: number) => tripIndex !== index)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const childVariants = {
    hidden: { x: -300, opacity: 0 },
    show: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="mx-6 pb-12 text-sm font-sohnelight pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom">
          My Bookings
        </button>
      </SheetTrigger>
      <SheetContent className="w-1/2 overflow-y-scroll light" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            <div className="w-96 h-11 text-zinc-800 text-4xl font-medium leading-loose">
              Your booked flights
            </div>
          </SheetTitle>
        </SheetHeader>

        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {bookedTrips.map(
              (
                trip: {
                  id: number;
                  from: string;
                  to: string;
                  type: string;
                  depart: string;
                },
                index: number
              ) => (
                <motion.div
                  key={trip.id}
                  className=" mb-4 mt-8 text-white items-stretch w-full flex justify-center"
                  variants={childVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit" // Add this line
                >
                  <div className=" bg-white shadow-md overflow-hidden items-stretch ">
                    <div className="md:flex">
                      <div className="p-8 relative">
                        <p className="absolute top-2 left-2 text-black text-sm">
                          Ticket {trip.id}
                        </p>
                        <div className="uppercase tracking-wide text-md text-indigo-700 font-semibold">
                          {trip.type} flight
                        </div>

                        <p className="mt-2 text-black">{trip.depart}</p>
                        <p className="mt-2 text-black">
                          {trip.from} - {trip.to}
                        </p>

                        {priorityBoarding && (
                          <p className="flex mt-2 text-black border-2 px-2 py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 ">
                            <PersonStanding className="text-blue-700" /> Launch
                            Club Priority
                          </p>
                        )}
                      </div>
                      <div className="p-8 bg-gradient-to-r from-purple-100 to-rose-100 md:flex-shrink-0">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          {" "}
                          {/* Modified */}
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full">
                            Upgrade
                          </button>
                          <Popover>
                            <PopoverTrigger className="hover:bg-purple-500 text-white font-bold py-2 px-4 bg-gradient-to-r from-purple-500 to-rose-500 w-full">
                              AI Travel Insights
                            </PopoverTrigger>
                            <PopoverContent onCloseAutoFocus={() => setAIResponse("")} className="relative w-[400px] h-[400px] mt-2">
                              <p className="text-lg mb-4 font-sohne">AI Travel Insights <span className="text-sm">powereed by AWS Bedrock</span> </p>
                              <p className="max-h-[250px] overflow-y-auto">{aiResponse}</p>
                              <Button onClick={() => submitQuery(trip.to)} className="absolute flex bottom-5 right-5 bg-transparent  text-blue-700 hover:bg-transparent hover:text-black mx-auto">
                                Generate <ArrowRight className="text-blue-700" />
                              </Button>
                            </PopoverContent>
                          </Popover>
                          <div className="mt-4 text-right items-center justify-center">
                            {" "}
                            {/* Modified */}
                            <button
                              onClick={handleCancel}
                              className="text-sm text-black underline hover:text-indigo-500"
                            >
                              Cancel Flight
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
