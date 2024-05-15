import { useContext } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/ui/navbar";
import LoginContext from "@/utils/contexts/login";
import BankInfoCard from "@/components/ui/bankcomponents/bankInfoCard";
import { LoginComponent } from "@/components/ui/logincomponent";
import AirlineInfoCard from "@/components/ui/airwayscomponents/airlineInfoCard";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import MarketInfoCard from "@/components/ui/marketcomponents/marketInfoCard";
import HomePageInfoCard from "./ui/HomePageInfoCard";
import HomePageCardWrapper from "./ui/HomePageCardWrapper";
import Image from "next/image";
import investmentCardImg1 from "@/public/investment/investment_image1.png";
import investmentCardImg2 from "@/public/investment/investment_image2.jpeg";
import investmentCardImg3 from "@/public/investment/investment_image3.jpeg";
import airlineLoginHeroBackground from "@/assets/img/airways/airline-login-hero-background.jpeg";

interface LoginHomePageProps {
  variant: "bank" | "airlines" | "market" | "investment";
  name: string;
}

export default function LoginHomePage({ variant, name, ...props }: LoginHomePageProps) {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } = useContext(LoginContext);

  const industryMessages = {
    bank: "More than 100,000 customers worldwide",
    investment: "Serving more than 100,000 customers, and 10 trillion in capital every day",
    airlines:
      "Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before",
    market: "Shop for the latest tech gadgets and more.",
  };

  const bankingServicesArr = [
    { imgSrc: "Checking.png", title: "Checking" },
    { imgSrc: "Business.png", title: "Business" },
    { imgSrc: "Credit.png", title: "Credit Card" },
    { imgSrc: "Savings.png", title: "Savings" },
    { imgSrc: "Mortgage.png", title: "Mortgages" },
  ];

  const message = industryMessages[variant];

  return (
    <motion.main
      className={`relative w-full h-screen font-audimat`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar variant={variant} />

      <header
        className={` ${
          variant === "bank"
            ? "bg-gradient-releases"
            : variant === "airlines"
            ? "bg-gradient-airways w-full mb-[4rem] relative"
            : variant === "investment"
            ? "bg-gradient-investment"
            : variant === "market"
            ? " bg-market-header grid items-center justify-center"
            : ""
        }`}
      >
        {variant === "market" && (
          <div>
            <img src="elipse.png" alt="Market" className="absolute right-0 top-0" />
            <img src="union.png" className="absolute left-0 bottom-0" />
          </div>
        )}

        {variant === "airlines" ? (
          <>
            <Image
              src={airlineLoginHeroBackground}
              alt="Airline Login Hero Background"
              layout="fill"
              objectFit="cover"
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
              text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-[1]"
          >
            <p className="text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
              Welcome to {name}{" "}
            </p>
            <p className="col-span-2 sm:col-span-0 text-2xl lg:text-4xl font-sohnelight w-full">
              {message}
            </p>
          </div>

          <div className="w-full sm:w-auto z-10">
            <LoginComponent
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              loginUser={loginUser}
              variant={variant}
              name={name}
            />
          </div>
        </div>
      </header>

      {variant === "bank" && (
        <section
          className="w-3/4 grid grid-cols-2 sm:flex sm:flex-row font-sohnelight text-center justify-center mx-auto gap-y-8 
            sm:gap-y-0 gap-x-8
          sm:gap-x-12 lg:gap-x-24 py-8"
        >
          {bankingServicesArr.map((ele, i) => {
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

      {variant === "bank" && (
        <section
          className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 lg:gap-x-14
           mx-auto py-12 justify-center px-4 lg:px-8"
        >
          <BankInfoCard
            imgSrc="House.png"
            headerTitleText="Home Mortgages"
            subtitleText="Toggle the light on and come home. Were here to help."
            key={1}
          />
          <BankInfoCard
            imgSrc="Smoochy.png"
            headerTitleText="Wealth Management"
            subtitleText="Use next generation tooling to ensure your future is safe."
            key={2}
          />
          <BankInfoCard
            imgSrc="Cards.png"
            headerTitleText="Sign Up For Toggle Card"
            subtitleText="Special offers for our most qualified members. Terms apply."
            key={3}
          />
        </section>
      )}
      {/* TODO: need to apply this to all other home pages */}
      {variant === "investment" && (
        <HomePageCardWrapper>
          <HomePageInfoCard
            imgSrc={investmentCardImg1.src}
            headerTitleText="Are returns worth the risk in investing in the market?"
            subtitleText="Emerging-market local-currency bonds have rallied sharply since last October, along with other risky segments of the global bond market. "
            key={1}
          />
          <HomePageInfoCard
            imgSrc={investmentCardImg2.src}
            headerTitleText="Fed to consumers: Inflation trending lower daily."
            subtitleText="Inflation looks to still be trending lower, but a relatively stubborn decline will likely inspire the Fed to start cutting rates later (and slower) than expected."
            key={2}
          />
          <HomePageInfoCard
            imgSrc={investmentCardImg3.src}
            headerTitleText="Here’s how markets are moving this week."
            subtitleText="With thematic investing, you can choose from 40+ customizable themes, each with up to 25 research-backed stocks."
            key={3}
          />
        </HomePageCardWrapper>
      )}

      {variant === "airlines" && (
        <section
          className="flex flex-col gap-y-8 sm:gap-y-0 sm:flex-row sm:gap-x-6 lg:gap-x-14
           xl:mx-auto w-full max-w-7xl py-12 justify-between px-4 xl:px-0"
        >
          <AirlineInfoCard
            headerTitleText="Wheels up"
            subtitleText="You deserve to arrive refreshed, stretch out in one of our luxurious cabins."
            imgSrc={airplaneImg}
          />
          <AirlineInfoCard
            headerTitleText="Ready for an adventure"
            subtitleText="The world is open for travel. Plan your next adventure."
            imgSrc={hotAirBalloonImg}
          />
          <AirlineInfoCard
            headerTitleText="Experience luxury"
            subtitleText="Choose Launch Platinum. Select on longer flights."
            imgSrc={airplaneDining}
          />
        </section>
      )}

      {variant === "market" && (
        <section
          className="relative flex flex-col sm:flex-row justify-center 
        gap-x-0 gap-y-6 sm:gap-x-6 lg:gap-x-24 py-14 z-0 bg-white !font-sohne px-6"
        >
          <MarketInfoCard
            headerTitleText="Shop Latest Gadgets"
            subtitleText="Shop the latest gadgets and accessories."
            imgSrc="marketinfo1.png"
          />
          <MarketInfoCard
            headerTitleText="Exclusive Offers"
            subtitleText="Get exclusive offers and deals on the latest gadgets."
            imgSrc="marketinfo2.png"
          />
          <MarketInfoCard
            headerTitleText="Shop Popular Brands"
            subtitleText="Shop popular brands like Apple, Samsung, and more."
            imgSrc="marketinfo3.png"
          />
        </section>
      )}
    </motion.main>
  );
}
