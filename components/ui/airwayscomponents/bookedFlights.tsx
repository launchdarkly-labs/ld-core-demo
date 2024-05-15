import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import TripsContext from "@/utils/contexts/TripContext";
import LoginContext from "@/utils/contexts/login";
import { ArrowRight, PersonStanding, Star, PlaneIcon, Wifi, Plane } from "lucide-react";
import { useFlags } from "launchdarkly-react-client-sdk";
import CheckIn from "@/components/ui/airwayscomponents/checkin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BounceLoader } from "react-spinners";

export default function BookedFlights() {
  const { bookedTrips, setBookedTrips, cancelTrip } = useContext(TripsContext);
  const { enrolledInLaunchClub } = useContext(LoginContext);
  const { launchClubLoyalty, priorityBoarding, aiTravelInsights } = useFlags();
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
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
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
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
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
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
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
    await setBookedTrips(bookedTrips.filter((_: any, tripIndex: number) => tripIndex !== index));
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
  const navLinkStyling =
    "lg:pb-12 lg:pt-1.5 lg:mr-4 flex items-start text-sm font-sohnelight font-medium lg:transition-colors lg:bg-no-repeat lg:bg-bottom lg:bg-transparent";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={`${navLinkStyling} relative lg:mx-6 lg:hover:bg-gradient-airline-buttons bg-[length:100%_3px] cursor-poiner animate-pulse hover:animate-none`}
        >
          <div className="block sm:hidden lg:block cursor-pointer sm:text-airlineinactive sm:focus:text-airlinetext  sm:hover:text-white ">
            <span className="">My Bookings</span>
            {bookedTrips.length > 0 && (
              <span className="absolute ml-2 lg:ml-0 lg:bottom-[35px] lg:right-[-25px] bg-gradient-airways rounded-full text-white text-xs w-5 h-5 pt-[.12rem] pr-[0.05rem] ">
                {bookedTrips.length}
              </span>
            )}
          </div>

          <div className="hidden sm:block lg:hidden relative">
            <Plane className="text-block sm:text-white" title="My Bookings" />

            {bookedTrips.length > 0 && (
              <span className="absolute top-[-13px] right-[-20px] bg-airlinepink rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                {bookedTrips.length}
              </span>
            )}
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        className="p-4 sm:p-8 w-full lg:w-3/4 xl:w-1/2 overflow-y-scroll light"
        side="right"
      >
        <SheetHeader className="">
          <SheetTitle className="font-sohne text-2xl ">
            <div className=" text-zinc-800 text-4xl font-medium leading-loose ">
              Your booked flights
            </div>
          </SheetTitle>
        </SheetHeader>

        <motion.div
          className="w-full flex flex-col gap-y-4"
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
                  flightNumber: string;
                },
                index: number
              ) => (
                <motion.div
                  key={trip.id}
                  className=" bg-white shadow-xl sm:shadow-xl w-full overflow-hidden flex flex-col sm:flex-row"
                  variants={childVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit" // Add this line
                >
                  <div className="ticket-content-left-side py-4 px-6 relative w-full sm:w-2/3 font-sohne">

                    <div className="ticket-main-wrapper flex flex-col gap-y-4 my-4 ">
                      <div className="ticket-main-informationflex flex-col gap-y-[.1rem]">
                        <div className="flex justify-between items-center">

                          <p className="ticket-type-flight  tracking-wide text-md bg-clip-text bg-gradient-airline font-semibold">
                            {trip.type} flight
                          </p>

                          {aiTravelInsights ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <p
                                  onClick={() => travelLocationsInfo(trip.toCity, trip.fromCity)}
                                  className=" uppercase flex font-bold animate-pulse hover:animate-none text-airlinepink gap-x-1 hover:underline cursor-pointer"
                                >
                                  <span className="text-air" style={{ color: "#405BFF" }}>{trip.fromCity}</span> <ArrowRight />
                                  <span className="text-end" style={{ color: "#405BFF" }}>{trip.toCity}</span>
                                </p>
                              </PopoverTrigger>

                              <PopoverContent onCloseAutoFocus={() => setAIResponse("")}>
                                {loading ? (
                                  <div className="flex justify-center">
                                    <BounceLoader color="#FF386B" />
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-lg mb-4 font-sohne">
                                      AI Travel Insights{" "}
                                      <span className="text-sm">powered by AWS Bedrock</span>{" "}
                                    </p>
                                    <p>{aiResponse}</p>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <p className="text-lg flex font-bold text-[#405BFF] ">
                              {trip.fromCity} <ArrowRight color="black" width={20} className="ml-2 mr-2" /> {trip.toCity}
                            </p>
                          )}
                        </div>

                        <div className="border-2 mt-2 border-[#E6E6E6]" />

                        <div className="flex justify-between mt-4">
                          <p className="text-black">Travel Date</p>
                          <p className=" text-black">{trip.depart}</p>
                        </div>

                        <div className="flex justify-between mt-2">
                          <p className="text-black">Aircraft</p>


                          {aiTravelInsights ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <p
                                  onClick={() => planeDetails(trip.airplane)}
                                  className="  animate-pulse hover:animate-none text-airlinepink uppercase hover:underline "
                                >
                                  {trip.airplane}
                                </p>
                              </PopoverTrigger>
                              <PopoverContent onCloseAutoFocus={() => setAIResponse("")} className="pt-0 pr-0 pl-0 flex items-center max-h-screen mx-auto my-auto">

                                {loading ? (
                                  <div className="flex justify-center mx-auto my-auto pt-2 pb-0">
                                    <BounceLoader color="#FF386B" />
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-lg mb-4 font-sohne  bg-gradient-airways-red text-white p-4">
                                      AI Travel Insights{" "}
                                      <span className="text-sm">powered by Amazon Bedrock</span>{" "}
                                    </p>
                                    <p className="p-4 font-normal font-sohne">{aiResponse}</p>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <p className="text-black">{trip.airplane}</p>
                          )}
                        </div>

                        <div className="flex justify-between mt-2">
                          <p className="text-black font-shone text-l">Ticket Number</p>
                          <p className=" text-black font-shone text-l">{trip.id}</p>
                        </div>
                      </div>
                      <div className="border-2 mt-2 border-[#E6E6E6]" />
                      <div className="ticket-benefits-list flex justify-between align-center gap-x-1">
                        {enrolledInLaunchClub && launchClubLoyalty && (
                          <>
                            {priorityBoarding && (
                              <p className="flex text-black bg-clip-text text-transparent bg-black  ">
                                <Star className="mr-2 " color="blue" /> Launch
                                Priority
                              </p>
                            )}

                            <p className="flex text-black bg-clip-text text-transparent bg-black ">
                              <Wifi className=" mr-2" color="blue" /> Free WiFi
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 xl:p-6 w-full sm:w-1/3 bg-[#F8F8F8] grid ticket-content-right-side ">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      {enrolledInLaunchClub && priorityBoarding ? (
                        <button className="bg-gradient-airways text-white font-bold py-2 px-4 w-full cursor-default">
                          Launch Priority Upgrade
                        </button>
                      ) : (
                        <button className="bg-[#405BFF] text-white  p-4 w-full py-3 font-shone cursor-default">
                          Upgrade
                        </button>
                      )}
                      <CheckIn trip={trip} />
                      {aiTravelInsights && (
                        <Popover>
                          <PopoverTrigger className="relative bg-gradient-airways-red text-white font-bold py-3 px-4 bg-gradient-airline-buttons w-full   animate-pulse hover:animate-none">
                            AI Travel Insights
                          </PopoverTrigger>
                          <PopoverContent
                            onCloseAutoFocus={() => setAIResponse("")}
                            className="w-full sm:w-[400px] h-[300px] sm:h-[400px] mt-2 sm:absolute sm:right-[0%]"
                          >
                            <div className="flex justify-center items-center bg-gradient-airways-red text-white sm:justify-normal">
                              <p className="text-lg mb-4 mt-4 font-sohne ml-4 mr-4">
                                AI Travel Insights{" "}
                                <span className="text-sm">powered by Amazon Bedrock</span>
                              </p>
                            </div>
                            <div className=" overflow-y-auto flex justify-center items-center ">
                              {loading ? (
                                <div className="flex justify-center items-center h-full pt-2 pb-2">
                                  <BounceLoader color="#FF386B" />
                                </div>
                              ) : (
                                <div className="p-4 font-normal font-sohne ">
                                  <p>{aiResponse}</p>
                                </div>
                              )}
                            </div>
                            {!aiResponse && !loading ? (
                              <Button
                                onClick={() => submitQuery(trip.to)}
                                className="bg-transparent  text-blue-700 hover:bg-transparent hover:text-black mx-auto "
                              >
                                Generate <ArrowRight className="text-blue-700" />
                              </Button>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      )}
                      <div className="mt-4 text-right items-center justify-center">
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
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

