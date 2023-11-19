import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoginContext, { LoginProvider } from "@/utils/contexts/login";
import { PlaneIcon } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../button";
import { AnimatePresence, motion } from "framer-motion";

const LaunchClubStatus = () => {
  const { launchClubStatus, upgradeLaunchClub } = useContext(LoginContext);

  return (
    <Popover>
      <PopoverTrigger className="flex text-xl items-center">
        <PlaneIcon className="mr-2" />
        Launch Club
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px] h-[500px] bg-white border-0 text-black shadow-2xl mt-1 font-audimat">
        <div className="h-1/4 px-4 bg-pink-700 ">
          <div className="flex py-4 text-white justify-between items-center">
            <div>
              <p className="text-3xl">Good Day</p>
              <p className="text-sm">#8235232113</p>
            </div>
            <div className="flex items-center">
              <img
                src="launch-airways.svg"
                className="h-24 w-24 items-center"
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-row">
            <div className="bg-no-repeat bg-bottom bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] outline-none w-full">
              <div className="flex justify-between">
                <p className="text-xl font-audimat font-bold">
                  My Launch Status
                </p>
                <p className="flex text-xl uppercase pb-2">
                  {launchClubStatus}
                </p>
              </div>
              {launchClubStatus != "platinum" && (
                <div className="my-2">
                  <Button
                    onClick={() => upgradeLaunchClub("platinum")}
                    className="flex mx-auto text-xl rounded-none bg-pink-700 hover:bg-pink-700/80 "
                  >
                    Unlock Platinum Status
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 pt-4 font-audimat">
            <div className="flex justify-between">
              <p>Current Miles</p>
              <p>96,412</p>
            </div>
            <div className="flex justify-between">
              <p>Total Flights</p>
              <p>248</p>
            </div>
            <div>
              <p className="text-xl font-audimat font-bold bg-no-repeat bg-bottom bg-gradient-to-r from-airlinepurple to-airlinepink bg-[length:100%_3px] outline-none pb-2 pt-2">
                Flight Perks
              </p>
              {launchClubStatus !== "platinum" ? (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <p>AI Travel Insights</p>
                    <p>Locked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Free Checked Baggage</p>
                    <p className="text-pink-700">Unlocked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Free First Class Upgrades</p>
                    <p>Locked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Priority Boarding</p>
                    <p>Locked</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <p>AI Travel Insights</p>
                    <p className="text-pink-700">Unlocked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Free Checked Baggage</p>
                    <p className="text-pink-700">Unlocked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Free First Class Upgrades</p>
                    <p className="text-pink-700">Unlocked</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Priority Boarding</p>
                    <p className="text-pink-700">Unlocked</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LaunchClubStatus;
