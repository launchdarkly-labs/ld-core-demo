import { Inter } from "next/font/google";
import {
  ArrowRightCircle,
  CalendarIcon,
  MoveHorizontalIcon,
  Plane,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import AirportPicker from "@/components/ui/airwayscomponents/airportPicker";
import { motion, useAnimation, useInView } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useFlags } from "launchdarkly-react-client-sdk";
import { CSNav } from "@/components/ui/csnav";
import { RegistrationForm } from "@/components/ui/airwayscomponents/stepregistration";
import LoginScreen from "@/components/ui/airwayscomponents/login";
import NavBar from "@/components/ui/navbar";

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  function setAirport() {
    setShowSearch(true);
  }

  function bookTrip() {
    const tripId = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number
    setBookedTrips([
      ...bookedTrips,
      { id: tripId, from: fromLocation, to: toLocation, startDate, returnDate },
    ]);

    toast({
      title: "Flight booked",
      description: `Your flight from ${fromLocation} to ${toLocation} has been booked.`,
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
        className={`flex h-full bg-slate-950 text-white flex-col font-audimat`}
      >
        <NavBar variant={"airlines"} />
        <div className="flex h-20 shadow-2xl"></div>
        <div className="flex flex-row items-center place-content-center mx-auto my-4">
          <motion.div
            initial={{ scale: 0.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex items-center mx-auto"
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
              <p className="text-center text-xs font-audimat uppercase">
                Origin
              </p>
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
              <p className="text-center text-xs font-audimat uppercase">
                Destination
              </p>
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

          <motion.div
            initial={{ scale: 0.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full flex justify-center"
          >
            <div className="flex space-x-10 items-center text-xl px-16 font-audimat">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      {startDate ? (
                        <div className="flex flex-col items-center">
                          <p className="text-2xl">Depart</p>
                          <p className="text-3xl">
                            {startDate.toLocaleDateString("en-US")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 border-b-2 border-gray-600 py-2 pr-12">
                          <CalendarIcon size={30} />
                          <p className="text-2xl md:text-3xl xl:text-4xl text-muted-foreground">
                            Depart
                          </p>
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border"
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
                          <p className="text-3xl">
                            {returnDate.toLocaleDateString("en-US")}
                          </p>
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
              </div>
              <div className="px-16">
                <motion.button
                  whileTap={{ scale: 0.5, color: "green" }}
                  onClick={() => bookTrip()}
                  className={` items-center fill-blue-800 ${
                    !toLocation ||
                    toLocation === "To" ||
                    !fromLocation ||
                    fromLocation === "From" ||
                    !startDate ||
                    !returnDate
                      ? "opacity-50 cursor-not-allowed "
                      : ""
                  }`}
                  disabled={
                    !toLocation ||
                    toLocation === "To" ||
                    !fromLocation ||
                    fromLocation === "From" ||
                    !startDate ||
                    !returnDate
                  }
                >
                  <ArrowRightCircle
                    className="fill-blue-900"
                    strokeWidth={1}
                    size={64}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="relative grid xl:flex xl:py-24 mb-8 w-full shadow-2xl items-center text-white">
          <img
            src="interior.png"
            className="absolute w-full h-full object-cover z-10 opacity-30"
          />
          <div className="flex mx-auto w-2/3 z-10">
            <div className="grid mx-auto w-2/3">
              <div className="grid mx-auto text-center">
                <p className="text-4xl md:text-6xl xl:text-7xl pb-4 font-audimat ">
                  Launch Airways
                </p>

                <p className="textlg: md:text-xl xl:text-2xl font-light pt-4 w-4/5 xl:w-2/3 mx-auto ">
                  Launch into the skies. In the air in milliseconds, reach your
                  destination without risk, and ship your travel dreams faster
                  than ever before.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center  gap-x-24 mb-14 z-0 ">
          <Card className="flex w-[320px] h-auto border-0 relative flex-col justify-center items-center animate-fade-in grid-rows-2 bg-slate-900 z-0">
            <CardHeader>
              <img src="planefleet.jpg" className="mx-auto" />
            </CardHeader>
            <CardTitle className="flex justify-center p-2 py-4">
              <p className="font-bold text-3xl text-gray-300 font-audimat text-center">
                Wheels-Up On Launch Airways!
              </p>
            </CardTitle>
            <CardContent>
              <p className="text-gray-300 font-robotolight pt-2 text-lg text-center">
                Launch into the skies. Live the life of comfort, spead, and
                excitement as board any of our hundreds of flights a month.
                Travel globally, without the risk.
              </p>
            </CardContent>
          </Card>
          <Card className="flex w-[320px] h-auto border-0  relative flex-col justify-center items-center animate-fade-in grid-rows-2 bg-slate-900">
            <CardHeader>
              <img src="travel.jpg" className="mx-auto" />
            </CardHeader>
            <CardTitle className="flex justify-center p-2 py-4">
              <p className="font-bold text-3xl text-gray-300 font-audimat text-center">
                Toggle "On" Your Next Get Away
              </p>
            </CardTitle>
            <CardContent>
              <p className="text-gray-300 font-robotolight  pt-2 text-lg text-center">
                With more than 100 points of presence globally, you'll be able
                to fly anywhere you need in the blink of eye. Resolve your
                travel, ship your family faster.
              </p>
            </CardContent>
          </Card>
          <Card className="flex w-[320px] h-auto border-0 relative flex-col justify-center items-center animate-fade-in grid-rows-2 bg-slate-900">
            <CardHeader>
              <img src="travelticket.jpg" className="mx-auto" />
            </CardHeader>
            <CardTitle className="flex justify-center p-2 py-4">
              <p className="font-bold text-3xl text-gray-300 font-audimat  text-center">
                Launch Club Loyalty Program
              </p>
            </CardTitle>
            <CardContent>
              <p className="text-gray-300 font-robotolight pt-2 text-lg text-center">
                The more you fly, the more your status grows. Enjoy free
                upgrades, priority boarding, exlusive flights and more! Reach{" "}
                <span className="font-bold">Platinum Tier</span> status today!
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.main>
    </>
  );
}
