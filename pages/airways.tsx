import { Inter } from "next/font/google";
import { useContext, useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useFlags } from "launchdarkly-react-client-sdk";
import NavBar from "@/components/ui/navbar";
import AirlineInfoCard from "@/components/ui/airwayscomponents/airlineInfoCard";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";

import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";
import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import LoginContext from "@/utils/contexts/login";
import { addDays } from "date-fns";


export default function Airways() {
  const flags = useFlags();
  const { launchClubLoyalty } = useFlags();

  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("From");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("")
  const [toLocation, setToLocation] = useState("To");
  const [showSearch, setShowSearch] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const { bookedTrips, setBookedTrips } = useContext(TripsContext);
  const { setPlaneContext } = useContext(LoginContext)
  const [date, setDate] = useState<{from: Date, to: Date} | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  function setAirport() {
    setShowSearch(true);
  }

  useEffect(() => {
    console.log(date);
    console.log(bookedTrips);
  }, [bookedTrips]);

  function bookTrip() {
    const startDate = `${
      date!.from.getMonth() + 1
    }/${date!.from.getDate()}/${date!.from.getFullYear()}`;
    const returnDate = `${
      date!.to.getMonth() + 1
    }/${date!.to.getDate()}/${date!.to.getFullYear()}`;
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
      airplane: "a380",
      type: "Return",
    };

    setBookedTrips([...bookedTrips, outboundTrip, returnTrip]);

    setPlaneContext('a380')

    toast({
      title: "Flight booked",
      description: `Your round trip from ${fromLocation} to ${toLocation} and back has been booked.`,
    });
  }

  return (
    <>
      <Toaster />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex h-screen text-white flex-col font-audimat   `}
      >
        <NavBar launchClubLoyalty={launchClubLoyalty} variant={"airlines"} />

        <header className={`py-20 bg-gradient-airways`}>
          <div className="lg:mx-auto max-w-7xl px-[1.7rem] lg:px-[2rem]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-y-6 lg:gap-y-0">
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

              <div
                className={`flex items-center text-xl font-audimat ${
                  showSearch ? "" : ""
                }`}
              >
                <FlightCalendar
                  date={date}
                  setDate={setDate}
                  className="font-audimat"
                />
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
        </header>

        <AirlineHero launchClubLoyalty={launchClubLoyalty} showSearch={showSearch} />

        <section
          className={`relative flex flex-col sm:flex-row justify-center 
        gap-x-0 gap-y-6 sm:gap-x-6 lg:gap-x-24 py-14 z-0 bg-white !font-sohne px-6 ${
          showSearch ? "blur-lg" : ""
        }`}
        >
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
        </section>
      </motion.main>
    </>
  );
}
