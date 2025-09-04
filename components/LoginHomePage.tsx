import { motion } from "framer-motion";
import NavBar from "@/components/ui/navbar";
import { LoginComponent } from "@/components/ui/logincomponent";
import airplaneImg from "@/public/airline/airplane.jpg";
import hotAirBalloonImg from "@/public/airline/hotairBalloon.jpg";
import airplaneDining from "@/public/airline/airplaneDining.jpg";
import HomePageInfoCard from "./ui/HomePageInfoCard";
import HomePageCardWrapper from "./ui/HomePageCardWrapper";
import Image from "next/image";
import investmentCardImg1 from "@/public/investment/investment_image1.png";
import investmentCardImg2 from "@/public/investment/investment_image2.jpeg";
import investmentCardImg3 from "@/public/investment/investment_image3.jpeg";
import governmentHeroImg1 from "@/public/government/government-building.jpg";
import governmentHeroImg2 from "@/public/government/governmentBuildingB.jpeg";
import governmentHeroImg3 from "@/public/government/governmentBuildingC.jpeg";
import governmentCardImg1 from "@/public/government/crypto.png";
import governmentCardImg2 from "@/public/government/farm.png";
import governmentCardImg3 from "@/public/government/military-family.jpg";
import governmentCardImg4 from "@/public/government/rocket.jpg";

import airlineLoginHeroBackground from "@/public/airline/airline-login-hero-background.jpeg";
import { useFlags } from "launchdarkly-react-client-sdk";
import FourColumnFooter from "./ui/govcomponents/FourColumnFooter";
import ImageWithContentHero from "./ui/govcomponents/ImageWithContentHero";
import ServiceCards from "./ui/govcomponents/ServiceCards";
import NewsCards from "./ui/govcomponents/NewsCards";
import RiskAssessmentDashboard from "./ui/govcomponents/RiskAssessmentDashboard";
import RiskAlertsPanel from "./ui/govcomponents/RiskAlertsPanel";
import { IoShieldCheckmark } from "react-icons/io5";
import { BsArrowsExpandVertical } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import { VariantInterface } from "@/utils/typescriptTypesInterfaceLogin";

export default function LoginHomePage({ variant }: VariantInterface) {
  const showCardsSectionComponentFlag = useFlags()["showCardsSectionComponent"];
  const patchShowCardsSectionComponentFlag = useFlags()["patchShowCardsSectionComponent"];
  const showDifferentHeroImageFlag = variant?.includes("government")
    ? useFlags()["showDifferentHeroImageString"]
    : "imageA";

  return (
    <motion.main
      className={`relative w-full h-screen font-audimat`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar variant={variant} />

      {!variant?.includes("government") && (
        <header
          className={`w-full relative ${
            variant ? homePageVariants[variant]?.gradiantColor : "bg-gradient-bank"
          }`}
        >
          {variant?.includes("market") && (
            <div>
              <img src="elipse.png" alt="Market" className="absolute right-0 top-0" />
              <img src="union.png" className="absolute left-0 bottom-0" />
            </div>
          )}

          {variant?.includes("airline") ? (
            <>
              <Image
                src={homePageVariants[variant]?.heroImg[showDifferentHeroImageFlag]}
                alt={homePageVariants[variant]?.industryMessages}
                layout="fill"
                className="object-cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#21212100] to-[#212121ff]"></div>{" "}
            </>
          ) : null}

          <div
            className="w-full max-w-7xl py-14 sm:py-[8rem] px-4 xl:px-0 xl:mx-auto flex flex-col sm:flex-row justify-between
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
              <LoginComponent
                variant={variant}
              />
            </div>
          </div>
        </header>
      )}

      {variant?.includes("government") && (
        <ImageWithContentHero variant={variant} homePageContent={homePageVariants[variant]} />
      )}

      {variant?.includes("bank") && (
        <section
          className="w-3/4 grid grid-cols-2 sm:flex sm:flex-row font-sohnelight text-center justify-center mx-auto gap-y-8 
            sm:gap-y-0 gap-x-8
          sm:gap-x-12 lg:gap-x-24 py-8"
        >
          {homePageVariants[variant]?.bankingServicesArr.map((ele: any, i: number) => {
            return (
              <div className="grid items-center justify-items-center" key={i}>
                <img src={ele?.imgSrc} width={96} className="pb-2" />
                <p className="text-xl lg:text-2xl ">{ele?.title} </p>
              </div>
            );
          })}
        </section>
      )}

      {!variant?.includes("government") && (
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
      )}

      {variant?.includes("government") && (
        <HomePageCardWrapper>
          {homePageVariants[variant]?.serviceCards.map((service: any, index: number) => {
            return <ServiceCards key={index} serviceCardContent={service} />;
          })}
        </HomePageCardWrapper>
      )}

      {variant?.includes("government") && showCardsSectionComponentFlag && (
        <HomePageCardWrapper>
          {homePageVariants[variant]?.newsCards.map((news: any, index: number) => {
            const patchCardGovernmentLogic = !patchShowCardsSectionComponentFlag && index === 0;
            return (
              <NewsCards key={index} newsCardContent={patchCardGovernmentLogic ? null : news} />
            );
          })}
        </HomePageCardWrapper>
      )}

      {variant?.includes("government") && <RiskAssessmentDashboard />}
      {variant?.includes("government") && <RiskAlertsPanel />}
      {variant?.includes("government") && <FourColumnFooter variant={variant} homePageContent={homePageVariants[variant]}/>}
    </motion.main>
  );
}

const homePageVariants:any = {
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
  airlines: {
    name: "Launch Airways",
    industryMessages:
      "Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before",
    gradiantColor: "bg-gradient-airways ",
    heroImg: {
      imageA: airlineLoginHeroBackground.src,
      imageB: airlineLoginHeroBackground.src,
      imageC: airlineLoginHeroBackground.src,
    },
    cards: [
      {
        titleText: "Wheels up",
        subtitleText:
          "You deserve to arrive refreshed, stretch out in one of our luxurious cabins.",
        imgSrc: airplaneImg.src,
      },
      {
        titleText: "Ready for an adventure",
        subtitleText: "The world is open for travel. Plan your next adventure.",
        imgSrc: hotAirBalloonImg.src,
      },
      {
        titleText: "Experience luxury",
        subtitleText: "Choose Launch Platinum. Select on longer flights.",
        imgSrc: airplaneDining.src,
      },
    ],
  },
  // market: {
  //   industryMessages: "Shop for the latest tech gadgets and more.",
  //   gradiantColor: " bg-market-header grid items-center justify-center",
  // },
  government: {
    name: "The Bureau of Risk Reduction",
    industryMessages:
      "We improve control, availability, and security of government applications and sites.",
    gradiantColor: "bg-gradient-bank ",
    heroImg: {
      imageA: governmentHeroImg1.src,
      imageB: governmentHeroImg2.src,
      imageC: governmentHeroImg3.src,
    },
    cards: [
      {
        titleText: "Cybersecurity",
        subtitleText: "FedRAMP Authorized",
        imgSrc: governmentCardImg1.src,
      },
      {
        titleText: "Resiliency",
        subtitleText: "Scalable architecture with 99.99% SLA",
        imgSrc: governmentCardImg2.src,
      },
      {
        titleText: "Trust",
        subtitleText: "Optimized citizen services",
        imgSrc: governmentCardImg3.src,
      },
      {
        titleText: "Quality",
        subtitleText: "Dark launches reduce risk",
        imgSrc: governmentCardImg4.src,
      },
    ],
    serviceCards: [
      {
        icon: <IoShieldCheckmark className="h-full w-full" />,
        title: "Cybersecurity",
        subtitle: "FedRAMP Authorized",
      },
      {
        icon: <BsArrowsExpandVertical className="h-full w-full" />,
        title: "Resiliency",
        subtitle: "Scalable architecture with 99.99% SLA",
      },
      {
        icon: <FaHandsHelping className="h-full w-full" />,
        title: "Trust",
        subtitle: "Optimized citizen services",
      },
      {
        icon: <FaMedal className="h-full w-full" />,
        title: "Quality",
        subtitle: "Dark launches reduce risk",
      },
    ],
    newsCards: [
      {
        imgSrc: "/government/one_woman.svg",
        title: "BRR’s 2022 Year In Review",
        newsCategory: "Blogs and Newsroom",
      },
      {
        imgSrc: "/government/capitol_building.svg",
        title: "Updated resilience planning framework",
        newsCategory: "Recent Announcements",
      },
      {
        imgSrc: "/government/two_women.svg",
        title: "Find BRR agency job postings?",
        newsCategory: "How Do I?",
      },
    ],
  },
};
