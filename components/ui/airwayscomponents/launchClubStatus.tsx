import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LoginContext, { LoginProvider } from "@/utils/contexts/login";
import { PlaneIcon } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../button";
import { AnimatePresence, motion } from "framer-motion";

const LaunchClubStatus = () => {
  const { launchClubStatus, upgradeLaunchClub } = useContext(LoginContext);

  const dividerBottomBorderStyle =
    "bg-no-repeat bg-bottom bg-gradient-airline-buttons bg-[length:100%_3px] outline-none pb-4 ";

  return (
    <Popover>
      <PopoverTrigger className="flex text-sm sm:text-xl items-center animate-pulse hover:animate-none">
        <PlaneIcon className="mr-2 " />
        Launch Club
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px] bg-white border-0 text-black shadow-2xl mt-1 font-audimat">
        <div className="h-1/4 px-4 bg-gradient-airways ">
          <div className="flex py-4 text-white justify-between items-center">
            <div>
              <p className="text-3xl">Good Day</p>
              <p className="text-sm">#8235232113</p>
            </div>
            <div className="flex items-center">
              <img src="launch-airways.svg" className="h-24 w-24 items-center" />
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-y-4">
          <div className={`${dividerBottomBorderStyle}`}>
            <div className="flex justify-between">
              <p className="text-xl font-audimat font-bold">My Launch Status</p>
              <p className="flex text-xl uppercase pb-2">{launchClubStatus}</p>
            </div>

            {launchClubStatus !== "platinum" ? (
              <div className="my-2">
                <Button
                  onClick={() => upgradeLaunchClub("platinum")}
                  className="flex mx-auto text-xl rounded-none bg-gradient-airline-buttons hover:brightness-[120%] animate-pulse hover:animate-none"
                >
                  Unlock Platinum Status
                </Button>
              </div>
            ) : (
              <div className="h-14"></div>
            )}
            
          </div>

          <div className={` ${dividerBottomBorderStyle}`}>
            <p className="text-xl font-audimat font-bold ">Lifetime Flight Stats</p>
            <div className="flex justify-between">
              <p>Current Miles</p>
              <p>96,412</p>
            </div>
            <div className="flex justify-between">
              <p>Total Flights</p>
              <p>248</p>
            </div>
          </div>

          <div>
            <p className="text-xl font-audimat font-bold ">Flight Perks</p>
            {launchClubStatus !== "platinum" ? (
              <div className="">
                <div className="flex justify-between">
                  <p>AI Travel Insights</p>
                  <p>Locked</p>
                </div>
                <div className="flex justify-between">
                  <p>Free Checked Baggage</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
                <div className="flex justify-between">
                  <p>Free First Class Upgrades</p>
                  <p>Locked</p>
                </div>
                <div className="flex justify-between">
                  <p>Priority Boarding</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex justify-between">
                  <p>AI Travel Insights</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
                <div className="flex justify-between">
                  <p>Free Checked Baggage</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
                <div className="flex justify-between">
                  <p>Free First Class Upgrades</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
                <div className="flex justify-between">
                  <p>Priority Boarding</p>
                  <p className="text-airlinepink">Unlocked</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LaunchClubStatus;