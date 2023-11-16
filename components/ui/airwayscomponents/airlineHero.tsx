import React from "react";
import { Button } from "@/components/ui/button";

const AirlineHero = ({ showSearch }: { showSearch: any }) => {
  return (
    <section className={`airline-hero-image ${showSearch ? "blur-lg" : ""}`}>
      <div className="flex flex-col">
        <div className={`relative`}>
          <div aria-hidden="true" className="absolute hidden h-full w-1/2 lg:block" />
          <div className="relative bg-transparent">
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 lg:px-8 `}>
              <div className=" max-w-2xl py-32 lg:max-w-none lg:py-32 z-10">
                <div className={`flex flex-col`}>
                  <h1 className={`text-4xl md:text-6xl xl:text-7xl pb-4 font-audimat`}>
                    Launch Airways
                  </h1>
                  <p className={`text-lg md:text-xl xl:text-2xl font-light pt-4  `}>
                    Launch into the skies. In the air in milliseconds, reach your destination
                    without risk, and ship your travel dreams faster than ever before.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-pink-600 rounded-none h-full w-1/2 sm:w-1/3 text-3xl px-2 py-8 mt-8">
                      Book Now
                    </Button>
                  </div>
                </div>
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
