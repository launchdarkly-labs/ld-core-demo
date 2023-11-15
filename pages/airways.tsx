import { Inter } from "next/font/google";
import { ArrowRightCircle, CalendarIcon, MoveHorizontalIcon, Plane } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import AirportPicker from "@/components/ui/airwayscomponents/airportPicker";
import { motion, useAnimation, useInView } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useFlags } from "launchdarkly-react-client-sdk";
import { CSNav } from "@/components/ui/csnav";
import { RegistrationForm } from "@/components/ui/airwayscomponents/stepregistration";
import LoginScreen from "@/components/ui/airwayscomponents/login";
import NavBar from "@/components/ui/navbar";
import AirlineInfoCard from "@/components/ui/airwayscomponents/airlineInfoCard";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";
import { Button } from "@/components/ui/button";
import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const flags = useFlags();
  console.log(flags);
  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("From");
  const [toLocation, setToLocation] = useState("To");
  const [showSearch, setShowSearch] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const { bookedTrips, setBookedTrips } = useContext(TripsContext);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  function setAirport() {
    setShowSearch(true);
  }

  useEffect(() => {
    console.log(date);
    console.log(bookedTrips);
  }, [bookedTrips]);

  function bookTrip() {
    const startDate = `${
      date.from.getMonth() + 1
    }/${date.from.getDate()}/${date.from.getFullYear()}`;
    const returnDate = `${date.to.getMonth() + 1}/${date.to.getDate()}/${date.to.getFullYear()}`;
    const tripIdOutbound = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for outbound trip
    const tripIdReturn = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for return trip

    const outboundTrip = {
      id: tripIdOutbound,
      from: fromLocation,
      to: toLocation,
      depart: startDate,
      type: "Outbound",
    };
    const returnTrip = {
      id: tripIdReturn,
      from: toLocation,
      to: fromLocation,
      depart: returnDate,
      type: "Return",
    };

    setBookedTrips([...bookedTrips, outboundTrip, returnTrip]);

    toast({
      title: "Flight booked",
      description: `Your round trip from ${fromLocation} to ${toLocation} and back has been booked.`,
    });
  }

  const pageVariants = {
    initial: { x: "100%" },
    in: { x: 0 },
    out: { x: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`flex h-screen  text-white flex-col font-audimat`}
      >
        <NavBar variant={"airlines"} />
        <div className="flex flex-row py-20  space-x-20 items-center bg-gradient-airways">
          <div className="flex items-center mx-auto">
            <motion.div
              initial={{ scale: 0.25, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex"
            >
              <div className="relative">
                <button
                  onClick={() => {
                    setActiveField("from");
                    setShowSearch(true);
                  }}
                >
                  <p className="text-3xl md:text-4xl xl:text-6xl font-audimat px-4 py-2 ">
                    {fromLocation}
                  </p>
                </button>
                <p className="text-center text-xs font-audimat uppercase">Origin</p>
              </div>
              <MoveHorizontalIcon
                strokeWidth={1}
                width={50}
                size={50}
                className="stroke-ldblue mr-8"
              />
              <div className="relative">
                <button
                  onClick={() => {
                    setActiveField("to");
                    setShowSearch(true);
                  }}
                >
                  <p className="text-3xl md:text-4xl xl:text-6xl font-audimat  px-4   py-2 ">
                    {toLocation}
                  </p>
                </button>
                <p className="text-center text-xs font-audimat uppercase">Destination</p>
              </div>
              {showSearch && activeField && (
                <AirportPicker
                  setToLocation={setToLocation}
                  setFromLocation={setFromLocation}
                  setShowSearch={setShowSearch}
                  activeField={activeField}
                  toLocation={toLocation}
                  fromLocation={fromLocation}
                />
              )}
            </motion.div>

            <div className="">
              <div className="flex items-center text-xl px-16 font-audimat">
                <FlightCalendar date={date} setDate={setDate} className="font-audimat" />
                {/* <div>
                <Popover>
                  <PopoverTrigger asChild>
                    
                      {startDate ? (
                        <div className="flex flex-col items-center">
                          <p className="text-2xl">Depart</p>
                          <p className="text-3xl">{startDate.toLocaleDateString("en-US")}</p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 border-b-2 border-gray-600 py-2 pr-12">
                          <CalendarIcon size={30} />
                          <p className="text-2xl md:text-3xl xl:text-4xl text-muted-foreground">
                            Depart
                          </p>
                        </div>
                      )}
                    
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="range"
                      // selected={startDate}
                      
                      // onSelect={setStartDate}
                      className=""
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      {returnDate ? (
                        <div className="flex flex-col items-center">
                          <p className="text-2xl">Return</p>
                          <p className="text-3xl">{returnDate.toLocaleDateString("en-US")}</p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 border-b-2 border-gray-600 py-2 pr-12">
                          <CalendarIcon size={30} />
                          <p className="text-2xl md:text-3xl xl:text-4xl text-muted-foreground  ">
                            Return
                          </p>
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div> */}
                <div className="ml-20">
                  <motion.button
                    whileTap={{ scale: 0.5 }}
                    onClick={() => bookTrip()}
                    className={` items-center `}
                  >
                    <img src="ArrowButton.png" width={75} className="" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AirlineHero />

        <div className="relative flex flex-col sm:flex-row justify-center gap-x-0 gap-y-6 sm:gap-x-24 py-14 z-0 bg-white !font-sohne ">
          <AirlineInfoCard
            headerTitleText="Wheels up"
            subtitleText="You deserve to arrive refreshed, stretch out in one of our luxurious cabins."
            imgSrc={airplaneImg}
          />
          <AirlineInfoCard
            headerTitleText="Ready for an adventure"
            subtitleText="The world is open for travel. Plan your next adventure."
            imgSrc={hotAirBalloonImg}
          />
          <AirlineInfoCard
            headerTitleText="Experience luxury"
            subtitleText="Choose Launch Platinum. Select on longer flights."
            imgSrc={airplaneDining}
          />
        </div>
      </motion.main>
    </>
  );
}
