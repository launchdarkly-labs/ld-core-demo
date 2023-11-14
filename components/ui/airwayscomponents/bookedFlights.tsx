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
        <Button className="bg-blue-700 text-xl font-audimat text-white">
          View Current Flights
        </Button>
      </SheetTrigger>
      <SheetContent className="w-1/2 overflow-y-scroll dark" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Your Booked Flights
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Thank you for flying with us!
          </SheetDescription>
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
                trip: { id: number; from: string; to: string },
                index: number
              ) => (
                <motion.div
                  key={trip.id}
                  className="w-full border-2 border-black/10 shadow-2xl rounded-2xl mb-4 mt-8 bg-slate-900 text-white"
                  variants={childVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit" // Add this line
                >
                  <div key={index} className="flex justify-between p-4">
                    <div className="flex flex-col text-white">
                      <p className="text-2xl">
                        <span className="font-bold">Confirmation Number:</span>{" "}
                        {trip.id}
                      </p>
                      <p className="text-2xl">
                        <span className="font-bold">Traveling from:</span>{" "}
                        {trip.from}
                      </p>
                      <p className="text-2xl">
                        <span className="font-bold">Destiation:</span> {trip.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-white text-2xl">Fare Type: {status}</p>
                    </div>
                    <div className="grid">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleCancel(index)}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
                        >
                          Platinum Upgrade
                        </button>
                        <button
                          onClick={() => handleCancel(index)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2"
                        >
                          Cancel Flight
                        </button>
                      </div>
                      <div className="flex items-center mx-auto">
                        <Button className="bg-awsorange text-white font-audimat text-xl">AI Travel Insights</Button>
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
