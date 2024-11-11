import { useContext, useState } from "react";
import { motion } from "framer-motion";
import LoginContext from "@/utils/contexts/login";
import { LoginComponent } from "@/components/ui/logincomponent";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import airlineLoginHeroBackground from "@/assets/img/airways/airline-login-hero-background.jpeg";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Button } from "../button";

import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";

import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { Toaster } from "@/components/ui/toaster";
import HomePageInfoCard from "@/components/ui/HomePageInfoCard";
import HomePageCardWrapper from "@/components/ui/HomePageCardWrapper";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";
import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment";
  name?: string;
}

const AirwaysHero = () => {
  const variant = "airlines";

  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("From");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [toLocation, setToLocation] = useState("To");
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
    <section className=" flex justify-center mx-auto w-full h-[40rem] max-w-7xl rounded-3xl px-4">
      {/* Hero section */}
      <div className="relative bg-gray-900 w-full rounded-3xl">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            alt=""
            src={airlineLoginHeroBackground.src}
            className="h-full w-full object-cover object-center"
          />
        </div>
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-[#21212100] to-[#212121ff] rounded-3xl"
        /> */}

        <div className="  py-14 sm:py-[4rem] px-10 sm:px-2  flex flex-col sm:flex-row justify-center items-center">
          <div
            className="grid grid-cols-2 sm:flex flex-row sm:flex-col
      text-airlineblack w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10"
          >
            <h1 className="text-6xl xl:text-[70px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full bg-transparent bg-gradient-airways-2 text-transparent bg-clip-text cursor-auto">
              Let Launch Airways take you further
            </h1>
            {/* <h2 className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
              Launch into the skies. In the air in milliseconds, reach your destination without
              risk, and ship your travel dreams faster than ever before
            </h2> */}
            <Button className="bg-airlineblue rounded-3xl w-[15rem] py-6">
              <span>
                <Sparkles />{" "}
              </span>
              Find your next trip with AI
            </Button>
          </div>

          <div className="w-full sm:w-auto z-10">
            {/* <LoginComponent variant={"airlines"} /> */}

            <section className={` py-10 lg:py-10 px-10 bg-white rounded-3xl `}>
              <div className="grid lg:flex lg:flex-col items-start lg:items-center lg:justify-around gap-y-6 lg:gap-y-0 lg:space-x-4">
                <AirlineDestination
                  setActiveField={setActiveField}
                  setShowSearch={setShowSearch}
                  fromLocation={fromLocation}
                  setFromCity={setFromCity}
                  toLocation={toLocation}
                  showSearch={showSearch}
                  activeField={activeField}
                  setToLocation={setToLocation}
                  setToCity={setToCity}
                  setFromLocation={setFromLocation}
                />

                <div className="flex justify-between w-full  ">
                  <Select defaultValue="Round Trip">
                    <SelectTrigger className="text-airlineblack">
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Round Trip">Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="1 Passenger">
                    <SelectTrigger className="text-airlineblack">
                      <SelectValue placeholder="Select Passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Passenger">1 Passenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className={`items-center text-xl font-audimat border-b-2 pb-2 border-white/40 ${
                    showSearch ? "" : ""
                  }`}
                >
                  <FlightCalendar date={date} setDate={setDate} className="font-audimat" />
                </div>
                <div className="grid h-10 border-b-2 border-white/40 text-4xl md:text-3xl  pb-12 lg:text-2xl xl:text-4xl px-4 items-center text-center justify-center">
                 
                </div>
                <div className="flex mx-auto">
                  {fromLocation !== "From" && toLocation !== "To" && (
                    <motion.button
                      whileTap={{ scale: 0.5 }}
                      onClick={() => bookTrip()}
                      className={` items-center border-2 rounded-3xl py-2 px-4`}
                    >
                      <p>Book Your Trip</p>
                    </motion.button>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirwaysHero;
