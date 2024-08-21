import { useContext, useState } from "react";
import { motion } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/ui/navbar";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { Toaster } from "@/components/ui/toaster";
import HomePageInfoCard from "@/components/ui/HomePageInfoCard";
import HomePageCardWrapper from "@/components/ui/HomePageCardWrapper";

import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";
import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import LoginContext from "@/utils/contexts/login";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import Chatbot from "@/components/chatbot/ChatBot";
import { AIRLINES } from "@/utils/constants";
// import IndexPage from "@/components/chatbot/(chat)/page";


export default function Airways() {

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

  const { isLoggedIn } = useContext(LoginContext);


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
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <LoginHomePage variant="airlines" />
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex h-screen text-white flex-col font-audimat`}
          >
            <NavBar
              variant="airlines"
            />

            <header className={` py-10 lg:py-20 bg-gradient-airways`}>
              <div className="lg:mx-auto max-w-7xl px-2 sm:px-8 xl:px-0">
                <div className="grid lg:flex lg:flex-row items-start lg:items-center lg:justify-around gap-y-6 lg:gap-y-0 lg:space-x-4">
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

                  <div className="grid h-10 border-b-2 border-white/40 text-4xl lg:text-3xl xl:text-4xl px-4 pb-12 items-center text-center justify-center">
                    <Select defaultValue="Round Trip">
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Round Trip">Round Trip</SelectItem>
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
                    <Select defaultValue="1 Passenger">
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder="Select Passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Passenger">1 Passenger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex mx-auto">
                    {fromLocation !== "From" && toLocation !== "To" && (
                      <motion.button
                        whileTap={{ scale: 0.5 }}
                        onClick={() => bookTrip()}
                        className={` items-center `}
                      >
                        <img src="ArrowButton.png" width={60} className="" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <AirlineHero showSearch={showSearch} />

            <HomePageCardWrapper>
              <HomePageInfoCard
                imgSrc={airplaneImg.src}
                headerTitleText="Wheels up"
                subtitleText="You deserve to arrive refreshed, stretch out in one of our luxurious cabins."
                key={1}
              />
              <HomePageInfoCard
                imgSrc={hotAirBalloonImg.src}
                headerTitleText="Ready for an adventure"
                subtitleText="The world is open for travel. Plan your next adventure."
                key={2}
              />
              <HomePageInfoCard
                imgSrc={airplaneDining.src}
                headerTitleText="Experience luxury"
                subtitleText="Choose Launch Platinum. Select on longer flights."
                key={3}
              />
            </HomePageCardWrapper>
          </motion.main>
        )}
      </AnimatePresence>

      <Chatbot variant={AIRLINES}/>
    </>
  );
}
