import { useContext, useState } from "react";
import { motion } from "framer-motion";
import LoginContext from "@/utils/contexts/login";

import { Sparkles, ChevronDown } from "lucide-react";
import airlineLoginHeroBackground from "@/public/airline/airline-login-hero-background.jpeg";

import { Button } from "../button";
import DestinationPicker from "./DestinationPicker";
import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";

import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";

import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment";
  name?: string;
}

const AirwaysHero = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("JFK");
  const [fromCity, setFromCity] = useState("New York");
  const [toCity, setToCity] = useState("San Francisco");
  const [toLocation, setToLocation] = useState("SFO");
  const [showSearch, setShowSearch] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const { bookedTrips, setBookedTrips } = useContext(TripsContext);
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  function bookTrip() {
    const startDate = `${
      date!.from.getMonth() + 1
    }/${date!.from.getDate()}/${date!.from.getFullYear()}`;
    const returnDate = `${date!.to.getMonth() + 1}/${date!.to.getDate()}/${date!.to.getFullYear()}`;
    const tripIdOutbound = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for outbound trip
    const tripIdReturn = Math.floor(Math.random() * 900) + 100; // Generate a random 3 digit number for return trip

    const outboundTrip = {
      id: tripIdOutbound,
      fromCity: fromCity,
      from: fromLocation,
      to: toLocation,
      toCity: toCity,
      depart: startDate,
      airplane: "a380",
      type: "Outbound",
    };
    const returnTrip = {
      id: tripIdReturn,
      from: toLocation,
      fromCity: toCity,
      to: fromLocation,
      toCity: fromCity,
      depart: returnDate,
      airplane: "a330",
      type: "Return",
    };

    setBookedTrips([...bookedTrips, outboundTrip, returnTrip]);

    toast({
      title: "Flight booked",
      description: `Your round trip from ${fromLocation} to ${toLocation} and back has been booked.`,
    });
  }

  return (
    <section className=" flex justify-center items-center mx-auto w-full md:h-[40rem] max-w-7xl rounded-3xl px-4 font-sohnelight mb-10">
      {/* Hero section */}
      <div className="relative bg-gray-900 w-full rounded-3xl h-full flex">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            alt=""
            src={airlineLoginHeroBackground.src}
            className="h-full w-full object-cover object-center  translate-y-[50%]  translate-x-[40%] scale-[2]"
          />
        </div>
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tl from-[#21212100] to-[#212121ff] rounded-3xl"
        /> */}

        <div
          className="py-14 sm:py-[4rem] px-6 sm:px-8 gap-y-4 md:gap-y-0  
        flex flex-col md:flex-row justify-center items-center"
        >
          <div
            className="grid grid-cols-2 md:flex flex-row md:flex-col
      text-airlineblack w-full md:w-1/2 pr-10 md:mb-0 gap-y-10 z-10"
          >
            <h1
              className="text-6xl xl:text-[70px] font-audimat col-span-2 sm:col-span-0 
            w-full bg-transparent bg-gradient-airways-2 text-transparent bg-clip-text cursor-auto"
            >
              Let Launch Airways take you further
            </h1>
            {/* <h2 className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
              Launch into the skies. In the air in milliseconds, reach your destination without
              risk, and ship your travel dreams faster than ever before
            </h2> */}

            <DestinationPicker>
              <Button className="bg-airlinedarkblue rounded-3xl w-[15rem] py-6 flex gap-2 animate-pulse hover:animate-none">
                <span>
                  <Sparkles />{" "}
                </span>
                Find your next trip with AI
              </Button>
            </DestinationPicker>
          </div>

          <div className="w-full  md:w-[25rem] z-10">
            <div className={` py-10 lg:py-10 px-10 bg-white rounded-3xl `}>
              <div className="grid lg:flex lg:flex-col items-start lg:items-center lg:justify-around gap-y-6 lg:gap-y-6">
                <AirlineDestination
                  setActiveField={setActiveField}
                  setShowSearch={setShowSearch}
                  fromLocation={fromLocation}
                  setFromCity={setFromCity}
                  fromCity={fromCity}
                  toCity={toCity}
                  toLocation={toLocation}
                  showSearch={showSearch}
                  activeField={activeField}
                  setToLocation={setToLocation}
                  setToCity={setToCity}
                  setFromLocation={setFromLocation}
                />

                <div className="flex justify-between gap-x-4 w-full text-sm sm:text-base ">
                  <Select defaultValue="Round Trip">
                    <SelectTrigger className="text-airlineblack flex items-center justify-between border-b-[1px] w-full gap-2 border-airlinelightgray pb-1">
                      <SelectValue placeholder="Select trip type" />
                      <ChevronDown className="text-airlinelightgray h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Round Trip">Round Trip</SelectItem>
                      {/* <SelectItem value="One Way">One Way</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="1 Passenger">
                    <SelectTrigger className="text-airlineblack flex items-center justify-between border-b-[1px] w-full  gap-2 border-airlinelightgray pb-1 ">
                      <SelectValue placeholder="Select Passengers" />{" "}
                      <ChevronDown className="text-airlinelightgray h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Passenger">1 Passenger</SelectItem>
                      <SelectItem value="2 Passenger">2 Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FlightCalendar date={date} setDate={setDate} />

                <div className=" mt-4 flex justify-center">
                  {fromLocation !== "From" && toLocation !== "To" && (
                    <motion.button
                      whileTap={{ scale: 0.5 }}
                      onClick={() => (isLoggedIn ? bookTrip() : null)}
                      className={`text-sm items-center border-2 ${
                        isLoggedIn
                          ? "border-airlinedarkblue text-airlinedarkblue animate-pulse hover:animate-none"
                          : "border-airlinegray text-airlinegray"
                      } rounded-3xl py-2 px-4`}
                    >
                      <p>{isLoggedIn ? "Book Your Trip" : "Sign In to Finish Booking"}</p>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirwaysHero;
