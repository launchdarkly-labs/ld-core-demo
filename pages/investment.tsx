import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import NavBar from "@/components/ui/navbar";
import AirlineInfoCard from "@/components/ui/airwayscomponents/airlineInfoCard";
import airplaneImg from "@/assets/img/airways/airplane.jpg";
import hotAirBalloonImg from "@/assets/img/airways/hotairBalloon.jpg";
import airplaneDining from "@/assets/img/airways/airplaneDining.jpg";
import { FlightCalendar } from "@/components/ui/airwayscomponents/flightCalendar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { setCookie } from "cookies-next";
import { ArrowRight } from "lucide-react";
import AirlineHero from "@/components/ui/airwayscomponents/airlineHero";
import AirlineDestination from "@/components/ui/airwayscomponents/airlineDestination";
import LoginContext from "@/utils/contexts/login";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import HomePageCardWrapper from "@/components/ui/HomePageCardWrapper";
import HomePageInfoCard from "@/components/ui/HomePageInfoCard";

import { XIcon, ComputerIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import NewsCard from "@/components/ui/investmentcomponents/NewsCard";
import StockMoversCard from "@/components/ui/investmentcomponents/StockMoversCard";
import BalanceCard from "@/components/ui/investmentcomponents/BalanceCard";
import RetirementCard from "@/components/ui/investmentcomponents/RetirementCard";
import TradingTrainingCard from "@/components/ui/investmentcomponents/TradingTrainingCard";
import MarketCard from "@/components/ui/investmentcomponents/MarketCard";
import InvestmentSearchBar from "@/components/ui/investmentcomponents/InvestmentSearchBar";
import StockRecommendationCard from "@/components/ui/investmentcomponents/StockRecommendationCard";
import InvestmentDevLog from "@/components/ui/investmentcomponents/InvestmentDevLog";
import RecentTradesCard from "@/components/ui/investmentcomponents/RecentTradesCard";

export default function Airways() {
  const { toast } = useToast();

  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser } = useContext(LoginContext);

  const ldclient = useLDClient();

  //TODO: either use this or the one in login.js
  function handleLogout() {
    logoutUser();
    const context: any = ldclient?.getContext();
    context.user.tier = null;
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingRecentTrades, setIsLoadingRecentTrades] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const userObject = {};
  const isDeveloper = false;
  const showCloudMigrationTwoStagesLDFlag = true;
  const isCloudMigrationAWS = true;
  const isLocalAPIMigration = true;
  const showInvestmentDatabaseMigrationSixStagesLDFlag = true;
  const isCloudDatabaseMigrationATLAS = true;
  const isLocalDatabaseMigration = true;
  const showPatchCloudMigrationLDFlag = true;
  const showChatbotWidgetLDFlag = true;

  let patchCardUI;

  useEffect(() => {
    let isFetched = true;

    const stockAPI = async () => {
      const response = await fetch(
        "http://toggleapp-aws.launchdarklydemos.com/api/investment/getStocks",
        {
          method: "get",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      return response.json();
    };

    const getStocks = async () => {
      const apiResponse = await stockAPI();
      const stockData = apiResponse?.data;
      setIsLoadingStocks(false);

      if (stockData?.status === 429) return;
      const filteredStock = [];
      stockData?.forEach((element) => {
        if (
          element.T.includes("NVDA") ||
          element.T.includes("TSLA") ||
          element.T.includes("AMZN") ||
          element.T.includes("SHOP") ||
          element.T.includes("MSFT") ||
          element.T.includes("WMT")
        ) {
          filteredStock.push(element);
        }
      });
      setStocks(filteredStock);
    };

    // if (isLocalAPIMigration) return setIsLoadingStocks(false);

    if (isFetched) {
      getStocks();
    }

    return () => {
      isFetched = false;
      setStocks([]);
    };
  }, []);

  useEffect(() => {
    let isFetched = true;
    const newsAPI = async () => {
      const response = await fetch(
        "http://toggleapp-aws.launchdarklydemos.com/api/investment/getNews",
        {
          method: "get",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      return response.json();
    };

    const getNews = async () => {
      const apiResponse = await newsAPI();
      const newsData = apiResponse?.data;
      setIsLoadingNews(false);

      if (newsData?.status === 429) return;
      setNews(newsData?.splice(0, 5));
    };

    // if (isLocalAPIMigration) return setIsLoadingNews(false);

    if (isFetched) {
      getNews();
    }

    return () => {
      isFetched = false;
      setNews([]);
    };
  }, []);

  useEffect(() => {
    let isFetched = true;

    const recentTradeAPI = async () => {
      const response = await fetch(
        "http://toggleapp-aws.launchdarklydemos.com/api/database/getInvestments",
        {
          method: "get",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      return response.json();
    };

    const getRecentTrade = async () => {
      const recentTradesData = await recentTradeAPI();

      setIsLoadingRecentTrades(false);
      if (recentTradesData?.status === 429) return;

      setRecentTrades(recentTradesData);
    };

    // if (isLocalDatabaseMigration) return setIsLoadingRecentTrades(false);

    if (isFetched) {
      getRecentTrade();
    }

    return () => {
      isFetched = false;
      setRecentTrades([]);
    };
  }, []);

  if (isCloudMigrationAWS && showPatchCloudMigrationLDFlag && isDeveloper) {
    patchCardUI = "border-4 border-green-500";
  } else if (isCloudMigrationAWS && !showPatchCloudMigrationLDFlag && isDeveloper) {
    patchCardUI = "border-4 border-red-500";
  } else {
    patchCardUI = "";
  }

  const cloudMigrationCardUI =
    isCloudMigrationAWS && isDeveloper ? "border-4 border-green-500" : "";

  const databaseMigrationCardUI =
    isCloudDatabaseMigrationATLAS && isDeveloper ? "border-4 border-green-500" : "";

  const cardStyle = "rounded-lg shadow-lg p-5 sm:p-5 bg-white";

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <LoginHomePage variant="investment" name="Frontier Capital" />
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex h-full flex-col  bg-investmentbackgroundgrey`}
          >
            <NavBar variant={"airlines"} handleLogout={handleLogout} />
            <div className="mt-8 " data-testid="salient-accounts-test-id">
              <main
                className="main-investment-card-wrapper grid gap-3 grid-cols-1 
          lg:grid-cols-[repeat(4,minmax(175px,1fr))] 
          investmentXL:grid-cols-[repeat(6,minmax(180px,1fr))] 
          lg:grid-rows-[repeat(12,10rem)]
          investmentXL:grid-rows-[repeat(9,10rem)]
         px-4 sm:px-6 lg:px-8 mx-auto max-w-8xl "
              >
                <div
                  className={`card-1 ${cardStyle} ${patchCardUI} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-1 investmentXL:col-end-3 
            lg:row-start-1 lg:row-end-5`}
                  data-testid="stock-balance-card-test-id"
                >
                  <BalanceCard isLoadingStocks={isLoadingStocks} />
                </div>
                <div
                  className={`card-2 ${cardStyle} ${cloudMigrationCardUI} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-5 investmentXL:col-end-7 
            lg:row-start-1 lg:row-end-3 
            investmentXL:row-start-1 investmentXL:row-end-3 
            lg:h-[19rem]`}
                  data-testid="stock-trading-training-card-test-id"
                >
                  <TradingTrainingCard
                    stocks={stocks}
                    setRecentTrades={setRecentTrades}
                    recentTrades={recentTrades}
                  />
                </div>
                <div
                  className={`card-3 ${cardStyle} ${databaseMigrationCardUI} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-3 lg:row-end-5
            investmentXL:row-start-1 investmentXL:row-end-3 
            lg:mt-[-2rem] 
            investmentXL:mt-[0rem] 
             lg:h-[35.5rem]`}
                  data-testid="recent-trades-card-test-id"
                >
                  <RecentTradesCard
                    recentTrades={recentTrades}
                    isLoadingRecentTrades={isLoadingRecentTrades}
                  />
                </div>

                <div
                  className={`card-4 ${cardStyle} ${cloudMigrationCardUI} 
                              lg:col-start-1 lg:col-end-3 
                              investmentXL:col-start-5 investmentXL:col-end-7 
                              lg:row-start-5 lg:row-end-7
                              investmentXL:row-start-2 investmentXL:row-end-4 
                              lg:mt-[-.25rem] 
                              investmentXL:mt-[9rem] 
                              lg:h-[23rem]`}
                  data-testid="stock-recommendation-card-test-id"
                >
                  <StockRecommendationCard stocks={stocks} isLoadingStocks={isLoadingStocks} />
                </div>

                <div
                  className={`card-5 ${cardStyle} ${cloudMigrationCardUI} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-1 investmentXL:col-end-3  
            lg:row-start-6 lg:row-end-8 
            investmentXL:row-start-5 investmentXL:row-end-7 
            lg:mt-[2rem] 
            investmentXL:mt-[0rem] 
            lg:h-[35rem]`}
                  data-testid="stock-movers-card-test-id"
                >
                  <StockMoversCard stocks={stocks} isLoadingStocks={isLoadingStocks} />
                </div>
                <div
                  className={`card-6 ${cardStyle} ${cloudMigrationCardUI} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-7 lg:row-end-9
            investmentXL:row-start-4 investmentXL:row-end-7  
            lg:mt-[2rem] 
            investmentXL:mt-[4rem] 
            lg:h-[31rem]
            investmentXL:h-[100%]
            `}
                  data-testid="stock-news-card-test-id"
                >
                  <NewsCard news={news} isLoadingNews={isLoadingNews} />
                </div>
                <div
                  className={`card-7 ${cardStyle} ${cloudMigrationCardUI} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-5 investmentXL:col-end-7 
            lg:row-start-7 lg:row-end-9
            investmentXL:row-start-4 investmentXL:row-end-5  
            lg:mt-[33.5rem] 
            investmentXL:mt-[11.25rem] 
            lg:h-[25rem]`}
                  data-testid="stock-retirement-card-test-id"
                >
                  <RetirementCard />
                </div>
                <div
                  className={`card-8 ${cardStyle} ${cloudMigrationCardUI} 
            lg:col-start-3 lg:col-end-5 
            investmentXL:col-start-3 investmentXL:col-end-5 
            lg:row-start-7 lg:row-end-9 
            investmentXL:row-start-7 investmentXL:row-end-8  
            lg:mt-[27rem] 
            investmentXL:mt-[4rem] 
            lg:h-[15rem]`}
                  data-testid="stock-market-card-test-id"
                >
                  <MarketCard isLoadingStocks={isLoadingStocks} />
                </div>
              </main>
              {isOpen ? (
                <InvestmentDevLog
                  isOpen={isOpen}
                  onClose={onClose}
                  logs={logs}
                  isLoadingStocks={isLoadingStocks}
                  isLoadingRecentTrades={isLoadingRecentTrades}
                />
              ) : null}
              {isDeveloper ? (
                <Button
                  className={`p-3 ${
                    showChatbotWidgetLDFlag
                      ? "right-[6rem] sm:right-[8rem] bottom-[1rem] sm:bottom-[2rem] "
                      : "right-[1rem] sm:right-[3rem] bottom-[1rem] sm:bottom-[2rem] "
                  } w-[4rem] h-[4rem]
        z-[20]
          bg-primary border-0 fixed rounded-full shadow-xl`}
                  id="investment-dev-log-button"
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                  title="Investment Dev Log"
                  data-testid="investment-page-dev-log-button"
                >
                  {isOpen ? (
                    <XIcon className="text-primary-text" />
                  ) : (
                    <ComputerIcon className="text-primary-text" />
                  )}
                </Button>
              ) : null}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
