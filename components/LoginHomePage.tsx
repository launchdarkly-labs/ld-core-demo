import { useContext } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/ui/navbar";
import LoginContext from "@/utils/contexts/login";
import { LoginComponent } from "@/components/ui/logincomponent";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
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
import airlineLoginHeroBackground from "@/assets/img/airways/airline-login-hero-background.jpeg";
import { useFlags } from "launchdarkly-react-client-sdk";
import FourColumnFooter from "./ui/govcomponents/FourColumnFooter";
import ImageWithContentHero from "./ui/govcomponents/ImageWithContentHero";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment" | "government";
  name: string;
}

export default function LoginHomePage({ variant, name, ...props }: LoginHomePageProps) {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } = useContext(LoginContext);
  const showCardsSectionComponentFlag = variant?.includes("government")
    ? useFlags()["show-cards-section-component"]
    : true;
  const patchShowCardsSectionComponentFlag = useFlags()["patch-show-cards-section-component"];
  const showHeroRedesignFlag = useFlags()["show-hero-redesign"];
  const showDifferentHeroImageFlag = variant?.includes("government")
    ? useFlags()["show-different-hero-image-string"]
    : "imageA";

  return (
    <motion.main
      className={`relative w-full h-screen font-audimat`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar variant={variant} />

    { !variant.includes("government") && <header
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
{/* TODO: remove experiment from here */}
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
            {showHeroRedesignFlag?.includes("text-left") && variant?.includes("government") ? (
              <>
                <p className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
                  Welcome to {homePageVariants[variant]?.name}{" "}
                </p>
                <p className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
                  {homePageVariants[variant]?.industryMessages}
                </p>
              </>
            ) : showHeroRedesignFlag?.includes("text-right") && variant?.includes("government") ? (
              !isLoggedIn ? (
                <LoginComponent
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loginUser={loginUser}
                  variant={variant}
                  name={name}
                />
              ) : null
            ) : (
              <>
                <p className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
                  Welcome to {homePageVariants[variant]?.name}{" "}
                </p>
                <p className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
                  {homePageVariants[variant]?.industryMessages}
                </p>
              </>
            )}
          </div>
          {/* TODO: fix logic here to render */}

          {showHeroRedesignFlag?.includes("text-right") && variant?.includes("government") ? (
            <div
              className="grid grid-cols-2 sm:flex flex-row sm:flex-col 
                          text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10"
            >
              <>
                <p className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
                  Welcome to {homePageVariants[variant]?.name}{" "}
                </p>
                <p className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
                  {homePageVariants[variant]?.industryMessages}
                </p>
              </>
            </div>
          ) : showHeroRedesignFlag?.includes("text-left") && variant?.includes("government") ? (
            !isLoggedIn ? (
              <div className="w-full sm:w-auto z-10">
                <LoginComponent
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  loginUser={loginUser}
                  variant={variant}
                  name={name}
                />
              </div>
            ) : null
          ) : (
            <div className="w-full sm:w-auto z-10">
              <LoginComponent
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                loginUser={loginUser}
                variant={variant}
                name={name}
              />
            </div>
          )}
        </div>
      </header>}
      {
        variant.includes("government") && <ImageWithContentHero
          variant={variant}
          homePageContent = {homePageVariants[variant]}
        />
      }
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
                {/* <Banknote size={96} strokeWidth={1} className="pb-2" /> */}
                <p className="text-xl lg:text-2xl ">{ele?.title} </p>
              </div>
            );
          })}
        </section>
      )}
     
      {showCardsSectionComponentFlag ? (
        <HomePageCardWrapper>
          {homePageVariants[variant]?.cards.map((card: any, index: number) => {
            const patchCardGovernmentLogic =
              !patchShowCardsSectionComponentFlag && variant?.includes("government") && index === 0;
            return (
              <HomePageInfoCard
                imgSrc={patchCardGovernmentLogic ? null : card?.imgSrc}
                headerTitleText={card?.titleText}
                subtitleText={card?.subtitleText}
                key={index}
              />
            );
          })}
        </HomePageCardWrapper>
      ) : null}
      <FourColumnFooter />
    </motion.main>
  );
}

const homePageVariants: any = {
  bank: {
    name:"ToggleBank",
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
    name:"Frontier Capital",
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
    name:"Launch Airways",
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
    name:"The Bureau of Risk Reduction",
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
  },
};
