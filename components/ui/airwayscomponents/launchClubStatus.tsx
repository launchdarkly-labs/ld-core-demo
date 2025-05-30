import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LoginContext from "@/utils/contexts/login";
import { PlaneIcon } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../button";
import { LAUNCH_CLUB_PLATINUM, } from "@/utils/constants";

const LaunchClubStatus = () => {
  const { upgradeLaunchClubStatus, userObject } = useContext(LoginContext);

  return (
    <Popover>
      <PopoverTrigger className="flex text-lg items-center text-airlinedarkblue animate-pulse hover:animate-none">
        <PlaneIcon className="mr-2" />
        Launch Club
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px] h-auto bg-white border-0 text-black shadow-2xl  font-audimat">
        <div className="h-1/4 px-4 bg-[#F5F7FF] ">
          <div className="flex py-4 text-white justify-between items-center">
            <div>
              <p className="text-3xl font-sohne font-light text-black">Good Day</p>
              <p className="text-sm text-black font-light italic font-sohne">#8235232113</p>
            </div>
            <div className="flex items-center">
              <img src="/airline/launch-airways.svg" className="h-24 w-24 items-center" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-row">
            <div className="bg-no-repeat bg-bottom bg-gradient-airways bg-[length:100%_3px] outline-none w-full">
              <div className="flex justify-between">
                <p className="text-xl font-sohne font-bold">My Launch Status</p>
                <p className="flex text-xl uppercase pb-2">{userObject.personalaunchclubstatus}</p>
              </div>
              {userObject.personalaunchclubstatus != LAUNCH_CLUB_PLATINUM && (
                <div className="my-2">
                  <Button
                    onClick={() => upgradeLaunchClubStatus()}
                    className="flex text-xl font-sohnelight rounded-full w-full h-full bg-gradient-airways hover:bg-gradient-airways-grey hover:text-white animate-pulse hover:animate-none"
                  >
                    Unlock Platinum Status
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex justify-between ">
              <p className="font-sohnelight">Current Miles</p>
              <p className="font-sohne">96,412</p>
            </div>
            <div className="flex justify-between">
              <p className="font-sohnelight">Total Flights</p>
              <p className="font-sohne">248</p>
            </div>

            <div>
              <p className="text-xl font-sohne font-bold bg-no-repeat bg-bottom bg-gradient-airways bg-[length:100%_3px] outline-none pb-2 pt-2">
                Flight Perks
              </p>

              <div className="pt-2">
                <div className="flex justify-between">
                  <p>AI Travel Insights</p>
                  <p
                    className={
                      userObject.personalaunchclubstatus.includes(LAUNCH_CLUB_PLATINUM)
                        ? `bg-clip-text text-transparent bg-gradient-airways`
                        : ""
                    }
                  >
                    {userObject.personalaunchclubstatus.includes(LAUNCH_CLUB_PLATINUM)
                      ? "Unlocked"
                      : "Locked"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Free Checked Baggage</p>
                  <p className="bg-clip-text text-transparent bg-gradient-airways">Unlocked</p>
                </div>
                <div className="flex justify-between">
                  <p>Free First Class Upgrades</p>
                  <p
                    className={
                      userObject.personalaunchclubstatus.includes(LAUNCH_CLUB_PLATINUM)
                        ? `bg-clip-text text-transparent bg-gradient-airways`
                        : ""
                    }
                  >
                    {userObject.personalaunchclubstatus.includes(LAUNCH_CLUB_PLATINUM)
                      ? "Unlocked"
                      : "Locked"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Priority Boarding</p>
                  <p className="bg-clip-text text-transparent bg-gradient-airways">Unlocked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LaunchClubStatus;
