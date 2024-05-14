//@ts-nocheck
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
import { Card, CardHeader, CardTitle, CardContent } from "../card";
import TripsContext from "@/utils/contexts/TripContext";
import BookedFlights from "./bookedFlights";
import LoginContext from "@/utils/contexts/login";
import { useLDClient } from "launchdarkly-react-client-sdk";

export default function LaunchSignUp() {
  const client = useLDClient();

  const { bookedTrips, cancelTrip, setBookedTrips } = useContext(TripsContext);

  const {
    isLoggedIn,
    setIsLoggedIn,
    loginUser,
    logoutUser,
    enrolledInLaunchClub,
    setEnrolledInLaunchClub,
    setLaunchClubStatus,
  } = useContext(LoginContext);
  const [status, setStatus] = useState("Economy");

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutUser();
    setUsername("");
  };

  const enrollLaunchClub = async () => {
    setEnrolledInLaunchClub(true);
    setLaunchClubStatus("standard");
    const context = await client?.getContext();
    context.user.launchclub = "standard";
    client.identify(context);
  };

  const perks = [
    {
      name: "Priority Boarding",
      img: "/airline/boarding.png",
      description: "Be the first to board, with priority boarding",
    },
    {
      name: "Free Checked Bag",
      img: "/airline/checkedbag.png",
      description: "Launch Club members get free bags on flights",
    },
    {
      name: "LaunchPad Access",
      img: "/airline/launchpad.png",
      description: "Access to LaunchPad locations worldwide",
    },
  ];

  const rewards = [
    {
      name: "Current Tier",
      value: "Platinum",
      description: "Your Launch Club status, higher tiers gain more rewards!",
    },
    {
      name: "Flights Taken",
      value: "500",
      description: "How many times you've flown with us!",
    },
    {
      name: "Launch Miles",
      value: "100,000",
      description: "How far have you traveled? Redeem miles for tickets.",
    },
  ];

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
      <SheetTrigger className="text-white z-50" asChild>
        <Button className="bg-gradient-airways-grey rounded-none mx-auto text-3xl p-6 h-full  animate-pulse hover:animate-none">
          Join Launch Club
        </Button>
      </SheetTrigger>
      {!enrolledInLaunchClub ? (
        <SheetContent
          className="w-full lg:w-2/3 xl:w-1/2 overflow-y-scroll bg-white grid items-center "
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="font-sohne text-3xl flex items-center justify-center"></SheetTitle>
            <div className="font-sohnelight flex flex-col items-center justify-center text-center">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="175" className="pr-2">
                  <image
                    href="/airline/launch-airways.svg"
                    height="100"
                    width="150"
                    alt="Launch Airways"
                  />
                </svg>
                <p className="text-black text-4xl">Launch Club Loyalty Program</p>
              </div>
              <div className="flex text-xl my-4  text-black text-center lg:mx-40 sm:mx-auto">
                Introducing our the new Launch Airways loyalty program. Join now for exclusive
                member perks that increase the more you fly!
              </div>
              <div className="flex flex-col sm:flex-row gap-4 place-content-between w-full my-10">
                {perks.map((perks, index) => (
                  <Card
                    key={index}
                    className="flex flex-col items-center justify-center h-auto w-full
                    align-items-center drop-shadow-2xl p-4 gap-y-2"
                  >
                    <CardHeader className="!p-0">
                      <img src={perks.img} height={100} width={100} alt="image" className="h-20 w-20"/>
                    </CardHeader>
                    <CardTitle className="text-lg font-shone font-normal ">{perks.name}</CardTitle>
                    <CardContent className="text-normal font-shone text-center font-light !p-2 mx-10 sm:mx-2">
                      {perks.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex flex-col">
                <SheetTrigger
                  aschild = "true"
                  onClick={() => {
                    enrollLaunchClub();
                  }}
                  className="bg-[#405BFF] text-white text-lg h-full w-full py-4 mt-4 px-10 font-shone cursor-default rounded-none "
                >
                  Enroll Today!
                </SheetTrigger>
              </div>
            </div>
          </SheetHeader>

          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          ></motion.div>
        </SheetContent>
      ) : (
        <SheetContent className="w-1/2 overflow-y-scroll bg-white" side="right">
          <SheetHeader>
            <SheetTitle className="font-sohnelight text-3xl flex items-center justify-center">
              <div className="mx-auto flex place-content-center w-full">
                <img src="woman.png" className="rounded-full h-48" />
              </div>
            </SheetTitle>
            <SheetDescription className="font-sohne flex flex-col items-center justify-center">
              <div className="flex">
                <h1 className="text-black text-4xl">Welcome Launch Club Member</h1>
              </div>
              <div className="flex text-xl my-4 text-black text-center">
                Track your tier, see the number of flights taken, and redeem miles for tickets and
                other purchases. Thank you for being a member!
              </div>
              <div className="flex flex-row gap-4 place-content-between w-full my-10">
                {rewards.map((rewards, index) => (
                  <Card
                    key={index}
                    className="h-1/3 w-1/3 align-items-center bg-zinc-300 drop-shadow-2xl flex flex-col items-center justify-center"
                  >
                    <CardHeader className="bg-gradient-airways text-transparent bg-clip-text text-6xl">
                      {rewards.value}
                    </CardHeader>
                    <CardTitle className="text-lg">{rewards.name}</CardTitle>
                    <CardContent className="m-2 text-sm text-center">
                      {rewards.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>

          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          ></motion.div>
        </SheetContent>
      )}
    </Sheet>
  );
}
