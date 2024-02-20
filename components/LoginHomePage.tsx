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

interface LoginHomePageProps {
  variant: 'bank' | 'airlines' | 'market';
  name: string;
}

export default function LoginHomePage({ variant, name, ...props }: LoginHomePageProps) {

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);


  const industryMessages = {
    "bank": "Serving more than 100,000 customers, and 10 trillion in capital every day",
    "airlines": "Launch into the skies. In the air in milliseconds, reach your destination without risk, and ship your travel dreams faster than ever before",
    "market": "Shop for the latest tech gadgets and more."
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
      <div className="flex h-20 shadow-2xl bg-ldgrey ">
        <NavBar variant={variant} />
      </div>

      <header className={`w-full ${variant === 'bank' ? 'bg-bankblue' :
        variant === 'airlines' ? 'bg-gradient-airways' :
          variant === 'market' ? ' bg-market-header grid items-center justify-center' : ''
        } mb-[4rem]`}>
        {variant === 'market' && (
          <div>
            <img src="elipse.png" alt="Market" className="absolute right-0 top-0" />
            <img src="union.png" className="absolute left-0 bottom-0" />
          </div>
        )}
        <div
          className="w-full py-14 sm:py-[8rem] px-12 xl:px-32 2xl:px-[300px] 3xl:px-[400px] flex flex-col sm:flex-row justify-between
             items-center sm:items-start"
        >
          <div
            className="grid grid-cols-2 sm:flex flex-row sm:flex-col 
              text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10"
          >
            {/* <img src="ToggleBankHeader.png" width={52} className="pb-0" /> */}
            <p className="text-2xl lg:text-6xl xl:text-[80px] 3xl:text-[112px] font-audimat col-span-2 sm:col-span-0 w-full">
              Welcome to {name}{" "}
            </p>
            <p className="col-span-2 sm:col-span-0 text-xl lg:text-2xl 3xl:text-4xl font-sohnelight w-full">
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

      {variant === 'bank' && (
        <section
          className="w-3/4 grid grid-cols-2 sm:flex sm:flex-row font-sohnelight text-center justify-center mx-auto gap-y-8 
            sm:gap-y-0 gap-x-8
          sm:gap-x-12 lg:gap-x-24"
        >

          {bankingServicesArr.map((ele,i) => {
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
      {variant === 'bank' && (
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

      {variant === 'airlines' && (
        <section
          className="flex flex-col gap-y-8 sm:gap-y-8 sm:flex-row sm:gap-x-6 lg:gap-x-14
           mx-auto py-12 justify-center px-4 lg:px-8"
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

      {variant === 'market' && (
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
      </section>)}
    </motion.main>
  )
}