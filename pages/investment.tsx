import { useContext } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import LoginContext from "@/utils/contexts/login";
import InvestmentAccountHeader from "@/components/ui/investmentcomponents/InvestmentAccountHeader";
import NewsCard from "@/components/ui/investmentcomponents/NewsCard";
import StockMoversCard from "@/components/ui/investmentcomponents/StockMoversCard";
import BalanceCard from "@/components/ui/investmentcomponents/BalanceCard";
import RetirementCard from "@/components/ui/investmentcomponents/RetirementCard";
import TradingTrainingCard from "@/components/ui/investmentcomponents/TradingTrainingCard";
import MarketCard from "@/components/ui/investmentcomponents/MarketCard";
import StockRecommendationCard from "@/components/ui/investmentcomponents/StockRecommendationCard";
import RecentTradesCard from "@/components/ui/investmentcomponents/RecentTradesCard";

import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import NavbarLeftSideWrapper from "@/components/ui/NavComponent/NavbarLeftSideWrapper";
import NavLinkButton from "@/components/ui/NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "@/components/ui/NavComponent/NavbarLogin";
import NavbarDropdownMenu from "@/components/ui/NavComponent/NavbarDropdownMenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CSNav } from "@/components/ui/csnav";
import {
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";

import { INVESTMENT } from "@/utils/constants";

export default function Investment() {
  const { isLoggedIn } = useContext(LoginContext);

  const cardStyle = "rounded-lg shadow-lg p-5 sm:p-5 bg-white";

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <LoginHomePage variant={INVESTMENT} />
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex h-full flex-col  bg-investment-graident-background`}
          >
            <NavWrapper>
              <>
                <CSNavWrapper>
                  <CSNav />
                </CSNavWrapper>

                <NavLogo
                  srcHref={NAV_ELEMENTS_VARIANT[INVESTMENT]?.logoImg?.src}
                  altText={INVESTMENT}
                />

                <NavbarDropdownMenu>
                  <>
                    {NAV_ELEMENTS_VARIANT[INVESTMENT]?.navLinks.map((navLink, index) => {
                      return (
                        <DropdownMenuItem href={navLink?.href} key={index}>
                          {navLink?.text}
                        </DropdownMenuItem>
                      );
                    })}
                  </>
                </NavbarDropdownMenu>

                {/* left side navbar template */}

                <NavbarLeftSideWrapper>
                  <>
                    {NAV_ELEMENTS_VARIANT[INVESTMENT]?.navLinks.map((navLink, index) => {
                      return (
                        <NavLinkButton
                          text={navLink?.text}
                          href={navLink?.href}
                          navLinkColor={NAV_ELEMENTS_VARIANT[INVESTMENT]?.navLinkColor}
                          index={index}
                          key={index}
                        />
                      );
                    })}
                  </>
                </NavbarLeftSideWrapper>

                {/* right side navbar template */}
                <NavbarRightSideWrapper>
                  <>
                    
                    <NavbarLogin variant={INVESTMENT} />
                  </>
                </NavbarRightSideWrapper>
              </>
            </NavWrapper>

            <InvestmentAccountHeader />
            <div className="my-8 " data-testid="salient-accounts-test-id">
              <div className="mx-auto max-w-7xl font-sohnelight ">
                <div
                  className="main-investment-card-wrapper grid gap-3 grid-cols-1 
          lg:grid-cols-[repeat(4,minmax(175px,1fr))] 
          investmentXL:grid-cols-[repeat(6,minmax(180px,1fr))] 
          lg:grid-rows-[repeat(12,10rem)]
          investmentXL:grid-rows-[repeat(9,10rem)]
         px-4 xl:px-0"
                >
                  <div
                    className={`card-1 ${cardStyle} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-1 investmentXL:col-end-3 
            lg:row-start-1 lg:row-end-5 flex flex-col justify-between `}
                    data-testid="stock-balance-card-test-id"
                  >
                    <BalanceCard />
                  </div>
                  <div
                    className={`card-2 ${cardStyle} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-5 investmentXL:col-end-7 
            lg:row-start-1 lg:row-end-3 
            investmentXL:row-start-1 investmentXL:row-end-3 
            lg:h-[19rem] flex flex-col justify-center `}
                    data-testid="stock-trading-training-card-test-id"
                  >
                    <TradingTrainingCard />
                  </div>
                  <div
                    className={`card-3 ${cardStyle} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-3 lg:row-end-5
            investmentXL:row-start-1 investmentXL:row-end-3 
            lg:mt-[-2rem] 
            investmentXL:mt-[0rem] 
             lg:h-[35.5rem] flex flex-col`}
                    data-testid="recent-trades-card-test-id"
                  >
                    <RecentTradesCard />
                  </div>

                  <div
                    className={`card-4 ${cardStyle} 
                              lg:col-start-1 lg:col-end-3 
                              investmentXL:col-start-5 investmentXL:col-end-7 
                              lg:row-start-5 lg:row-end-7
                              investmentXL:row-start-2 investmentXL:row-end-4 
                              lg:mt-[-.25rem] 
                              investmentXL:mt-[9rem] 
                              lg:h-[23rem] flex flex-col justify-between`}
                    data-testid="stock-recommendation-card-test-id"
                  >
                    <StockRecommendationCard />
                  </div>

                  <div
                    className={`card-5 ${cardStyle} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-1 investmentXL:col-end-3  
            lg:row-start-6 lg:row-end-8 
            investmentXL:row-start-5 investmentXL:row-end-7 
            lg:mt-[2rem] 
            investmentXL:mt-[0rem] 
            lg:h-[35rem] flex flex-col justify-between`}
                    data-testid="stock-movers-card-test-id"
                  >
                    <StockMoversCard />
                  </div>
                  <div
                    className={`card-6 ${cardStyle} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-7 lg:row-end-9
            investmentXL:row-start-4 investmentXL:row-end-7  
            lg:mt-[2rem] 
            investmentXL:mt-[4rem] 
            lg:h-[31rem]
            investmentXL:h-[100%] flex flex-col justify-between
            `}
                    data-testid="stock-news-card-test-id"
                  >
                    <NewsCard />
                  </div>
                  <div
                    className={`card-7 ${cardStyle} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-5 investmentXL:col-end-7 
            lg:row-start-7 lg:row-end-9
            investmentXL:row-start-4 investmentXL:row-end-5  
            lg:mt-[33.5rem] 
            investmentXL:mt-[11.25rem] 
            lg:h-[25rem] flex flex-col justify-between items-center`}
                    data-testid="stock-retirement-card-test-id"
                  >
                    <RetirementCard />
                  </div>
                  <div
                    className={`card-8 ${cardStyle} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-7 lg:row-end-9 
            investmentXL:row-start-7 investmentXL:row-end-8  
            lg:mt-[27rem] 
            investmentXL:mt-[4rem] 
            lg:h-[15rem] flex flex-col justify-between`}
                    data-testid="stock-market-card-test-id"
                  >
                    <MarketCard />
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
