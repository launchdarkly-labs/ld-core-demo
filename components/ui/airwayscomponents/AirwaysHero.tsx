import { useContext } from "react";
import { motion } from "framer-motion";
import LoginContext from "@/utils/contexts/login";
import { LoginComponent } from "@/components/ui/logincomponent";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import Image from "next/image";

import airlineLoginHeroBackground from "@/assets/img/airways/airline-login-hero-background.jpeg";
import { useFlags } from "launchdarkly-react-client-sdk";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment";
  name?: string;
}
const AirwaysHero = () => {
  const variant = "airlines";

  return (
    <section className=" flex justify-center mx-auto w-full max-w-7xl rounded-3xl px-4">
      {/* Hero section */}
      <div className="relative bg-gray-900 w-full rounded-3xl">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            alt=""
            src={airlineLoginHeroBackground.src}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-[#21212100] to-[#212121ff] rounded-3xl"
        />

        <div
          className="w-full max-w-7xl py-14 sm:py-[8rem] px-4 xl:px-0 xl:mx-auto flex flex-col sm:flex-row justify-between
     items-center"
        >
          <div
            className="grid grid-cols-2 sm:flex flex-row sm:flex-col
      text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10"
          >
            <h1 className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
              Welcome to Launch Airways
            </h1>
            <h2 className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
              Launch into the skies. In the air in milliseconds, reach your destination without
              risk, and ship your travel dreams faster than ever before
            </h2>
          </div>

          <div className="w-full sm:w-auto z-10">
            <LoginComponent variant={"airlines"} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirwaysHero;

{
  /* <div className="flex justify-center mx-auto w-full max-w-7xl px-4">
  <header className={`w-full relative `}>
    <Image
      src={airlineLoginHeroBackground.src}
      alt={
        "Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before"
      }
      layout="fill"
      className="object-cover rounded-2xl "
      quality={100}
    />
    <div className="absolute inset-0 bg-gradient-to-l from-[#21212100] to-[#212121ff]"></div>{" "}
    <div
      className="w-full max-w-7xl py-14 sm:py-[8rem] px-4 xl:px-0 xl:mx-auto flex flex-col sm:flex-row justify-between
     items-center"
    >
      <div
        className="grid grid-cols-2 sm:flex flex-row sm:flex-col
      text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10"
      >
        <h1 className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
          Welcome to Launch Airways
        </h1>
        <h2 className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
          Launch into the skies. In the air in milliseconds, reach your destination without
          risk, and ship your travel dreams faster than ever before
        </h2>
      </div>

      <div className="w-full sm:w-auto z-10">
        <LoginComponent variant={variant} />
      </div>
    </div>
  </header>
</div> */
}
