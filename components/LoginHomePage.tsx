import { motion } from "framer-motion";
import { LoginComponent } from "@/components/ui/logincomponent";
import HomePageInfoCard from "./ui/HomePageInfoCard";
import HomePageCardWrapper from "./ui/HomePageCardWrapper";
import investmentCardImg1 from "@/public/investment/investment_image1.png";
import investmentCardImg2 from "@/public/investment/investment_image2.jpeg";
import investmentCardImg3 from "@/public/investment/investment_image3.jpeg";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";

import { CSNav } from "@/components/ui/csnav";

import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import {  BANK } from "@/utils/constants";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment";
  name?: string;
}

export default function LoginHomePage({ variant, name, ...props }: LoginHomePageProps) {
  return (
    <motion.main
      className={`relative w-full h-screen font-audimat`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavWrapper>
        <>
          <CSNavWrapper>
            <CSNav />
          </CSNavWrapper>

          <NavLogo srcHref={NAV_ELEMENTS_VARIANT[variant]?.logoImg?.src} altText={variant} />
        </>
      </NavWrapper>

      <section
        className={`w-full relative ${
          variant ? homePageVariants[variant]?.gradiantColor : "bg-gradient-bank"
        }`}
      >
        <div
          className="w-full max-w-7xl py-14 sm:py-[8rem] px-4 xl:px-4 xl:mx-auto flex flex-col sm:flex-row justify-between
             items-center"
        >
          <div
            className="grid grid-cols-2 sm:flex flex-row sm:flex-col 
              text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10"
          >
            <h1 className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
              Welcome to {homePageVariants[variant]?.name}{" "}
            </h1>
            <h2 className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
              {homePageVariants[variant]?.industryMessages}
            </h2>
          </div>

          <div className="w-full sm:w-auto z-10">
            <LoginComponent variant={variant} />
          </div>
        </div>
      </section>

      {variant?.includes(BANK) && (
        <section
          className="w-3/4 grid grid-cols-2 sm:flex sm:flex-row font-sohnelight text-center justify-center mx-auto gap-y-8 
            sm:gap-y-0 gap-x-8
          sm:gap-x-12 lg:gap-x-24 py-8"
        >
          {homePageVariants[variant]?.bankingServicesArr.map((ele: any, i: number) => {
            return (
              <div className="grid items-center justify-items-center" key={i}>
                <img src={ele?.imgSrc} width={96} className="pb-2" />
                {/* <Banknote size={96} strokeWidth={1} className="pb-2" /> */}
                <p className="text-xl lg:text-2xl ">{ele?.title} </p>
              </div>
            );
          })}
        </section>
      )}

      <HomePageCardWrapper>
        {homePageVariants[variant]?.cards.map((card: any, index: number) => {
          return (
            <HomePageInfoCard
              imgSrc={card?.imgSrc}
              headerTitleText={card?.titleText}
              subtitleText={card?.subtitleText}
              key={index}
            />
          );
        })}
      </HomePageCardWrapper>
    </motion.main>
  );
}

const homePageVariants: any = {
  bank: {
    name: "ToggleBank",
    industryMessages: "More than 100,000 customers worldwide",
    gradiantColor: "bg-gradient-bank",
    bankingServicesArr: [
      { imgSrc: "Checking.png", title: "Checking" },
      { imgSrc: "Business.png", title: "Business" },
      { imgSrc: "Credit.png", title: "Credit Card" },
      { imgSrc: "Savings.png", title: "Savings" },
      { imgSrc: "Mortgage.png", title: "Mortgages" },
    ],
    cards: [
      {
        titleText: "Home Mortgages",
        subtitleText: "Toggle the light on and come home. Were here to help.",
        imgSrc: "House.png",
      },
      {
        titleText: "Wealth Management",
        subtitleText: "Use next generation tooling to ensure your future is safe.",
        imgSrc: "Smoochy.png",
      },
      {
        titleText: "Sign Up For Toggle Card",
        subtitleText: "Special offers for our most qualified members. Terms apply.",
        imgSrc: "Cards.png",
      },
    ],
  },
  investment: {
    name: "Frontier Capital",
    industryMessages: "Serving more than 100,000 customers, and 10 trillion in capital every day",
    gradiantColor: "bg-gradient-investment",
    cards: [
      {
        titleText: "Are returns worth the risk in investing in the market?",
        subtitleText:
          "Emerging-market local-currency bonds have rallied sharply since last October, along with other risky segments of the global bond market. ",
        imgSrc: investmentCardImg1.src,
      },
      {
        titleText: "Fed to consumers: Inflation trending lower daily.",
        subtitleText:
          "Inflation looks to still be trending lower, but a relatively stubborn decline will likely inspire the Fed to start cutting rates later (and slower) than expected.",
        imgSrc: investmentCardImg2.src,
      },
      {
        titleText: "Here’s how markets are moving this week.",
        subtitleText:
          "With thematic investing, you can choose from 40+ customizable themes, each with up to 25 research-backed stocks.",
        imgSrc: investmentCardImg3.src,
      },
    ],
  },
  // airlines: {
  //   name: "Launch Airways",
  //   industryMessages:
  //     "Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before",
  //   gradiantColor: "bg-gradient-airways ",
  //   heroImg: {
  //     imageA: airlineLoginHeroBackground.src,
  //     imageB: airlineLoginHeroBackground.src,
  //     imageC: airlineLoginHeroBackground.src,
  //   },
  //   cards: [
  //     {
  //       titleText: "Wheels up",
  //       subtitleText:
  //         "You deserve to arrive refreshed, stretch out in one of our luxurious cabins.",
  //       imgSrc: airplaneImg.src,
  //     },
  //     {
  //       titleText: "Ready for an adventure",
  //       subtitleText: "The world is open for travel. Plan your next adventure.",
  //       imgSrc: hotAirBalloonImg.src,
  //     },
  //     {
  //       titleText: "Experience luxury",
  //       subtitleText: "Choose Launch Platinum. Select on longer flights.",
  //       imgSrc: airplaneDining.src,
  //     },
  //   ],
  // },
  // market: {
  //   industryMessages: "Shop for the latest tech gadgets and more.",
  //   gradiantColor: " bg-market-header grid items-center justify-center",
  // },
};
