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

export default function BookedFlights() {
  const { bookedTrips, cancelTrip, setBookedTrips } = useContext(TripsContext);
  const [status, setStatus] = useState("Economy");

  console.log(bookedTrips);

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
        <button
          className="mx-6 pb-12 text-sm font-sohnelight pt-1.5 bg-transparent mr-4 flex items-start text-airlineinactive hover:text-white hover:bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] bg-no-repeat bg-bottom"
        >
          My Bookings
        </button>
      </SheetTrigger>
      <SheetContent className="w-1/2 overflow-y-scroll light" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            <div className="w-96 h-11 text-zinc-800 text-4xl font-medium leading-loose">Your booked flights</div>
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
                trip: { id: number; from: string; to: string, type: string, depart: string },
                index: number
              ) => (
                <motion.div
                  key={trip.id}
                  className=" mb-4 mt-8 text-white items-stretch flex justify-center"
                  variants={childVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit" // Add this line
                >

                  <div className="max-w-lg bg-white shadow-md overflow-hidden items-stretch ">
                    <div className="md:flex">
                      <div className="p-8">
                        <div className="uppercase tracking-wide text-md text-indigo-700 font-semibold">{trip.type} flight</div>

                        <p className="mt-2 text-black">{trip.depart}</p>
                        <p className="mt-2 text-black">{trip.from} - {trip.to}</p>
                        <p className="mt-2 text-black">Confirmation Number: {trip.id}</p>
                      </div>
                      <div className="p-8 bg-gradient-to-r from-purple-100 to-rose-100 md:flex-shrink-0">
                        <div className="flex flex-col items-center justify-center space-y-4"> {/* Modified */}
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full">
                            Upgrade
                          </button>

                          <button className="hover:bg-purple-500 text-white font-bold py-2 px-4 bg-gradient-to-r from-purple-500 to-rose-500 w-full">
                            AI Travel Insights
                          </button>
                          <div className="mt-4 text-right items-center justify-center"> {/* Modified */}
                            <a href="#" className="text-sm text-black underline hover:text-indigo-500">Cancel Flight</a>
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
