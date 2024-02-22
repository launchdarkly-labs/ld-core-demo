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
import LoginContext from "@/utils/contexts/login";
import {
  ArrowRight,
  PersonStanding,
  PlaneIcon,
  Wifi,
  Plane,
} from "lucide-react";
import { useFlags } from "launchdarkly-react-client-sdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BounceLoader } from "react-spinners";

export default function BookedFlights() {
  const { bookedTrips, setBookedTrips, cancelTrip } = useContext(TripsContext);
  const { enrolledInLaunchClub } = useContext(LoginContext);
  const {
    launchClubLoyalty,
    priorityBoarding,
    aiTravelInsights,
    mealPromoExperience,
  } = useFlags();
  const [status, setStatus] = useState("Economy");
  const [aiResponse, setAIResponse] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [loading, setLoading] = useState(false);

  async function travelLocationsInfo(start: any, end: any) {
    try {
      const prompt: string = `Provide estimated flight time details for traveling between these locations. Additionally provide example clothing to wear upon arrival at the destination. Finally, provide 1 sightseeing recommendation at the destination location. The source is ${start} and the end is ${end}. Limit your responses to an estimated 50 characters. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration.`;

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
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  async function planeDetails(airplane: any) {
    try {
      const prompt: string = `Provide me a 40 character informational description for the ${airplane} indicated at the end of this. The advertisement should make the customer excited to fly on it. Provide details on the manufacturer and size of the aircraft, and typical cruising altitude and speed. Do not show anything that would indicate a prompt response.`;

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
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setToAirport("");
      setLoading(false);
    }
  }

  async function submitQuery(airport: any) {
    try {
      const prompt: string = `Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${airport}, write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here. Place a hard limit on a 40 word response.Do not exceed this limit.`;

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
      return data.completion;
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setToAirport("");
      setLoading(false);
    }
  }

  const handleCancel = async (index: any) => {
    cancelTrip(index);
    await setBookedTrips(
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
        <button
          className="mx-0 sm:mx-1 xl:mx-6 lg:pb-12 mr-2 sm:mr-0 xl:mr-4 pt-0 xl:pt-1.5 text-sm font-sohnelight bg-transparent sm:flex sm:items-start sm:text-airlineinactive
    sm:hover:text-white sm:hover:bg-gradient-to-r sm:from-airlinepurple sm:to-airlinepink sm:bg-[length:100%_3px] sm:bg-no-repeat sm:bg-bottom relative"
        >
          <span className="hidden lg:block">My Bookings</span>
          <Plane className="block lg:hidden text-white" title="My Bookings" />
          {bookedTrips.length > 0 && (
            <span className="absolute bottom-[20px] right-[-20px] lg:bottom-[35px] lg:right-[-25px] bg-pink-700 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
              {bookedTrips.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:w-3/4 lg:w-1/2 overflow-y-scroll light"
        side="right"
      >
        <SheetHeader className="!text-center">
          <SheetTitle className="font-sohne text-2xl ">
            <div className="w-96 h-11 text-zinc-800 text-4xl font-medium leading-loose ">
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
                  fromCity: string;
                  toCity: string;
                  to: string;
                  type: string;
                  airplane: string;
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
                  <div className=" bg-white shadow-md w-full overflow-hidden items-stretch ">
                    <div className="md:flex">
                      <div className="pt-8 pl-2 relative w-2/3">
                        <p className="absolute top-2 left-2 text-black text-sm">
                          Ticket {trip.id}
                        </p>
                        <div className=" text-black">
                          <div className="flex justify-between items-center px-2">
                            <div className="uppercase tracking-wide text-md text-indigo-700 font-semibold">
                              {trip.type} flight
                            </div>
                            {aiTravelInsights ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <p
                                    onClick={() =>
                                      travelLocationsInfo(
                                        trip.toCity,
                                        trip.fromCity
                                      )
                                    }
                                    className="mt-2 uppercase  text-lg flex font-bold underline text-blue-500"
                                  >
                                    {trip.fromCity} <ArrowRight /> {trip.toCity}
                                  </p>
                                </PopoverTrigger>
                                <PopoverContent
                                  onCloseAutoFocus={() => setAIResponse("")}
                                >
                                  {loading ? (
                                    <div className="flex justify-center">
                                      <BounceLoader color="#2b6cb0" />
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-lg mb-4 font-sohne">
                                        AI Travel Insights{" "}
                                        <span className="text-sm">
                                          powereed by AWS Bedrock
                                        </span>{" "}
                                      </p>
                                      <p>{aiResponse}</p>
                                    </div>
                                  )}
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <p className="mt-2 uppercase  text-lg flex font-bold text-black ">
                                {trip.fromCity} <ArrowRight /> {trip.toCity}
                              </p>
                            )}
                          </div>
                          <div className="font-sohne px-2">
                            <div className="flex justify-between font-sohne">
                              <p className="mt-2 text-black">Travel Date</p>
                              <p className="mt-2 text-black">{trip.depart}</p>
                            </div>
                            <div className="flex justify-between font-sohne">
                              <p className="text-black">Aircraft</p>
                              {aiTravelInsights ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <p
                                      onClick={() =>
                                        planeDetails(trip.airplane)
                                      }
                                      className="cursor-pointer underline text-blue-500"
                                    >
                                      {trip.airplane}
                                    </p>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    onCloseAutoFocus={() => setAIResponse("")}
                                  >
                                    {loading ? (
                                      <div className="flex justify-center">
                                        <BounceLoader color="#2b6cb0" />
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-lg mb-4 font-sohne">
                                          AI Travel Insights{" "}
                                          <span className="text-sm">
                                            powered by Amazon Bedrock
                                          </span>{" "}
                                        </p>
                                        <p>{aiResponse}</p>
                                      </div>
                                    )}
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p className="text-black">{trip.airplane}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid lg:flex mx-auto items-center justify-center space-x-4 mt-4">
                            {enrolledInLaunchClub && launchClubLoyalty && (
                              <>
                                {priorityBoarding && (
                                  <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600   ">
                                    <PersonStanding className="text-blue-700 mr-2" />{" "}
                                    Launch Priority
                                  </p>
                                )}

                                <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-red-600  ">
                                  <Wifi className="text-green-700 mr-2" /> Free
                                  WiFi
                                </p>
                              </>
                            )}
                            {mealPromoExperience && (
                              <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-600  ">
                                <PlaneIcon className="text-green-700 mr-2" />{" "}
                                A380 Meal Promo
                              </p>
                            )}
                          </div>

                        </div>
                      </div>
                      <div className="p-8 w-full sm:w-1/3 bg-gradient-to-r from-purple-100 to-rose-100 md:flex-shrink-0">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          {" "}
                          {enrolledInLaunchClub && priorityBoarding ? (
                            <button className="bg-gradient-to-r from-pink-700 to-purple-700 text-white font-bold py-2 px-4 w-full">
                              Launch Priority Upgrade
                            </button>
                          ) : (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full">
                              Upgrade
                            </button>
                          )}
                          {aiTravelInsights && (
                            <Popover>
                              <PopoverTrigger className="hover:bg-purple-500 text-white font-bold py-2 px-4 bg-gradient-to-r from-purple-500 to-rose-500 w-full">
                                AI Travel Insights
                              </PopoverTrigger>
                              <PopoverContent
                                onCloseAutoFocus={() => setAIResponse("")}
                                className="relative w-[400px] h-[400px] mt-2"
                              >
                                <p className="text-lg mb-4 font-sohne">
                                  AI Travel Insights{" "}
                                  <span className="text-sm">
                                    powereed by Amazon Bedrock
                                  </span>{" "}
                                </p>
                                <div className=" overflow-y-auto flex justify-center items-center">
                                  {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                      <BounceLoader />
                                    </div>
                                  ) : (
                                    <div className="">
                                      <p>{aiResponse}</p>
                                    </div>
                                  )}
                                </div>
                                {!aiResponse && (
                                  <Button
                                    onClick={() => submitQuery(trip.to)}
                                    className="absolute flex bottom-5 right-5 bg-transparent  text-blue-700 hover:bg-transparent hover:text-black mx-auto"
                                  >
                                    Generate{" "}
                                    <ArrowRight className="text-blue-700" />
                                  </Button>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                          <div className="mt-4 text-right items-center justify-center">
                            {" "}
                            {/* Modified */}
                            <button
                              onClick={() => handleCancel(index)}
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
