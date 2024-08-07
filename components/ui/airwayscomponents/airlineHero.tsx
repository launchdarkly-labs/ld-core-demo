import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LaunchSignUp from "./launchSignup";
import LoginContext from "@/utils/contexts/login";
import DestinationPicker from "./pickMyDestinationModal";
import { LoginContextType } from "@/utils/typescriptTypesInterfaceLogin";

const AirlineHero = ({ showSearch }: { showSearch: any }) => {
  const { isLoggedIn, userObject }:LoginContextType = useContext(LoginContext);

  return (
    <section
      className={`airline-hero-image text-white  ${
        showSearch ? "blur-lg" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className={`relative`}>
          <div
            aria-hidden="true"
            className="absolute hidden h-full w-1/2 lg:block"
          />
          <div className="relative lg:bg-transparent">
            <div
              className={`mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 lg:px-12 xl:px-4 `}
            >
              <div className=" mx-auto max-w-2xl py-[5rem] lg:max-w-none lg:py-32 z-10 lg:pr-10">
                <div className={`flex flex-col items-center lg:items-start`}>
                  <h1
                    className={`text-4xl md:text-6xl xl:text-7xl pb-4 font-audimat`}
                  >
                    Launch Airways
                  </h1>
                  <p
                    className={`text-lg md:text-xl xl:text-2xl font-light pt-4 text-center lg:text-start `}
                  >
                    Launch into the skies. In the air in milliseconds, reach
                    your destination without risk, and ship your travel dreams
                    faster than ever before.
                  </p>
                  <div className="flex flex-row">
                    <div className="mt-10 flex">
                      <Button className="bg-gradient-airways rounded-none h-full w-full text-3xl p-6 cursor-pointer">
                        Book Now
                      </Button>
                    </div>
                    <div className="flex mt-10 ml-2">
                      <DestinationPicker />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-[5rem] lg:mb-0  w-full flex justify-center items-center">
                {isLoggedIn && !userObject.personaEnrolledInLaunchClub && (
                  <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="flex flex-col justify-center p-10 gap-y-8 z-30 w-full lg:w-4/5 xl:w-2/3 
                bg-gradient-airways shadow-2xl  rounded-lg text-white mx-[2.5rem] lg:mx-0"
                  >
                    <div className="text-center">
                      <h3 className="text-4xl text-center mb-4">
                        Are you ready to Launch?!
                      </h3>
                      <p className="text-xl ">
                        Join Launch Club for exclusive access to flights,
                        rewards, and much more. See details within!
                      </p>
                    </div>

                    <LaunchSignUp />
                  </motion.div>
                )}
              </div>
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
