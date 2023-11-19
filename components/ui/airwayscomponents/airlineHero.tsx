import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LaunchSignUp from "./launchSignup";
import LoginContext from "@/utils/contexts/login";

const AirlineHero = ({ showSearch, launchClubLoyalty }: { showSearch: any, launchClubLoyalty: any }) => {

  const { isLoggedIn, enrolledInLaunchClub } = useContext(LoginContext)

  return (
    <section className={`airline-hero-image ${showSearch ? "blur-lg" : ""}`}>
      <div className="flex flex-col">
        <div className={`relative`}>
          <div aria-hidden="true" className="absolute hidden h-full w-1/2 lg:block" />
          <div className="relative bg-transparent">
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 lg:px-8 `}>
              <div className=" max-w-2xl py-32 lg:max-w-none lg:py-32 z-10">
                <div className="flex flex-row">
                <div className={`flex flex-col`}>
                  <h1 className={`text-4xl md:text-6xl xl:text-7xl pb-4 font-audimat`}>
                    Launch Airways
                  </h1>
                  <p className={`text-lg md:text-xl xl:text-2xl font-light pt-4  `}>
                    Launch into the skies. In the air in milliseconds, reach your destination
                    without risk, and ship your travel dreams faster than ever before.
                  </p>
                  <div className="mt-10">
                    <Button className="bg-pink-600 rounded-none h-full w-1/2 sm:w-1/3 text-3xl px-2 py-4">
                      Book Now
                    </Button>
                  </div>
                </div>
                
                </div>
                
              </div>
              {launchClubLoyalty && isLoggedIn && !enrolledInLaunchClub &&
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 50 }}
              className="grid z-30 mx-auto h-[300px] w-[500px] bg-gradient-releases shadow-2xl my-32 lg:absolute lg:right-10 rounded-lg text-white">
                <div className="m-4">
                  <p className="text-4xl pb-4 text-center">Are you ready to Launch?!</p>
                <p className=" text-xl text-left">Join Launch Club for exlucisve access to flights, rewards, and much more. See details within!</p>
                </div>
                <div className="flex mb-4 justify-center">
                <LaunchSignUp />
                </div>

              </motion.div>
              }
            </div>
          </div>
          <div className={`w-full h-full absolute top-0 lg:h-full lg:w-full`}>
            <img
              src={"dudeguy.png"}
              alt={"imageType"}
              className="h-full w-full object-cover object-center"
              aria-label={`hero image`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirlineHero;
