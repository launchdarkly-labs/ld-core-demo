import { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import NavBar from "@/components/ui/navbar";
import { AnimatePresence } from "framer-motion";
import LoginHomePage from "@/components/LoginHomePage";
import { setCookie } from "cookies-next";
import LoginContext from "@/utils/contexts/login";
import InvestmentAccountHeader from "@/components/ui/investmentcomponents/InvestmentAccountHeader";

import { XIcon, ComputerIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import NewsCard from "@/components/ui/investmentcomponents/NewsCard";
import StockMoversCard from "@/components/ui/investmentcomponents/StockMoversCard";
import BalanceCard from "@/components/ui/investmentcomponents/BalanceCard";
import RetirementCard from "@/components/ui/investmentcomponents/RetirementCard";
import TradingTrainingCard from "@/components/ui/investmentcomponents/TradingTrainingCard";
import MarketCard from "@/components/ui/investmentcomponents/MarketCard";
import StockRecommendationCard from "@/components/ui/investmentcomponents/StockRecommendationCard";
import InvestmentDevLog from "@/components/ui/investmentcomponents/InvestmentDevLog";
import RecentTradesCard from "@/components/ui/investmentcomponents/RecentTradesCard";
import {newsData, investmentData, stockData} from '@/components/ui/investmentcomponents/InvestmentData';
import InfinityLoader from "@/components/ui/infinityloader";

export default function Airways() {

  const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext , logoutUser } = useContext(LoginContext);

  const ldclient = useLDClient();

  //TODO: either use this or the one in login.js
  //TODO: move this into navbar
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

    const getStocks = async () => {
      setIsLoadingStocks(false);

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

    const getNews = async () => {
      setIsLoadingNews(false);

      // if (newsData?.status === 429) return;
      setNews(newsData?.splice(0, 7));
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

    const getRecentTrade = async () => {
      const recentTradesData = investmentData;
      setIsLoadingRecentTrades(false);

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


  const releaseNewInvestmentStockApi = useFlags()["release-new-investment-stock-api"];

  const client = useLDClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const [runDemo, setRunDemo] = useState(false);
  const [loggedUser, setInitialUser] = useState();
  const [loggedEmail, setInitialEmail] = useState();

  const generateInitialData = (initialValue) => {
    const data = [];
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 10);

    for (let i = 0; i < 10; i++) {
      startTime.setMinutes(startTime.getMinutes() + 1);
      const value = Math.round(initialValue + (Math.random() - 0.5) * 10);
      data.push({
        time: startTime.toLocaleTimeString(),
        value: value,
        direction: null,
      });
    }

    return data;
  };

  const generateChartData = (stockData) => {
    const lastTenDataPoints = stockData.slice(-10);
    const secondLastValue =
      lastTenDataPoints.length > 1
        ? lastTenDataPoints[lastTenDataPoints.length - 2].value
        : lastTenDataPoints[0].value;
    const lastValue = lastTenDataPoints[lastTenDataPoints.length - 1].value;
    const directionColor =
      lastValue > secondLastValue
        ? "lightgreen"
        : lastValue < secondLastValue
          ? "red"
          : "rgba(255, 255, 255, 0.5)";

    return {
      labels: lastTenDataPoints.map((dataPoint) => dataPoint.time),
      datasets: [
        {
          data: lastTenDataPoints.map((dataPoint) => dataPoint.value),
          borderColor: directionColor,
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
        },
      ],
    };
  };

  const [stocksz, setStocksz] = useState([
    {
      ticker: "LD",
      name: "LaunchDarkly",
      data: generateInitialData(1025),
      image: "ld.png",
    },
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      data: generateInitialData(190),
      image: "apple.png",
    },
    {
      ticker: "TSLA",
      name: "Tesla",
      data: generateInitialData(205),
      image: "tesla.png",
    },
    {
      ticker: "NVDA",
      name: "Nvidia",
      data: generateInitialData(612),
      image: "nvidia.png",
    },
  ]);

  const elapsedTimeRef = useRef(elapsedTime);
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (!loggedUser) {
      setInitialUser(user);
      setInitialEmail(email);
    }

    let loginInterval: NodeJS.Timeout | null = null;
    let errorInterval: NodeJS.Timeout | null = null;
    if (runDemo) {
      loginInterval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime % 1 === 0) {
            updateAudienceContext();
          }
          return newTime;
        });
      }, 100);

      errorInterval = setInterval(async () => {
        let dynamicValue;
        if (client) {
          if (releaseNewInvestmentStockApi) {
            //75% chance of hitting errors
            if (Math.random() < 0.75) {
              client.track("stocks-api-error-rates");
              await client.flush();
              console.log("this hits here")
            }
            dynamicValue = Math.floor(Math.random() * (170 - 150 + 1)) + 150;
            console.log("dynamicValue 1", dynamicValue);
            client.track("stock-api-latency", undefined, dynamicValue);
            await client.flush();
          } else {
            //25% chance of hitting errors
            if (Math.random() < 0.25) {
              client.track("stocks-api-error-rates");
              await client.flush();
              console.log("this hits here 2")
            }
            dynamicValue = Math.floor(Math.random() * (60 - 50 + 1)) + 50;
            console.log("dynamicValue 2", dynamicValue);
            client.track("stock-api-latency", undefined, dynamicValue);
            await client.flush();
          }
        }
        setElapsedTime((prevTime) => prevTime + 1);
      }, 10);
    }
    const stocksinterval = setInterval(() => {
      const updatedStocks = stocksz.map((stock) => {
        let newValue = 0;
        const lastValue = stock.data[stock.data.length - 1].value;
        if (stock.ticker == "TSLA") {
          newValue = Math.floor(Math.random() * (200 - 210 + 1)) + 205;
        }
        if (stock.ticker == "AAPL") {
          newValue = Math.floor(Math.random() * (185 - 196 + 1)) + 190;
        }
        if (stock.ticker == "LD") {
          newValue = Math.floor(Math.random() * (1000 - 1050 + 1)) + 1025;
        }
        if (stock.ticker == "NVDA") {
          newValue = Math.floor(Math.random() * (600 - 620 + 1)) + 612;
        }
        const direction = newValue > lastValue ? "up" : newValue < lastValue ? "down" : null;
        const newTime = new Date().toLocaleTimeString();
        const newDataPoint = { time: newTime, value: newValue, direction };

        return {
          ...stock,
          data: [...stock.data, newDataPoint],
        };
      });

      setStocksz(updatedStocks);
    }, 3000);

    return () => {
      clearInterval(stocksinterval);
      if (runDemo) {
        if (loginInterval !== null) clearInterval(loginInterval);
        if (errorInterval !== null) clearInterval(errorInterval);
      }
    };
  }, [client, releaseNewInvestmentStockApi, runDemo]);

  const toggleRunDemo = () => {
    setRunDemo((prev) => !prev);
    if (runDemo == true) {
      loginUser(loggedUser, loggedEmail);
    }
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
            <NavBar variant={"investment"} handleLogout={handleLogout} />
            <InvestmentAccountHeader />
            {runDemo ? (
        <div className="flex justify-center items-center h-52">
          <div className=" font-bold font-sohne justify-center items-center text-xl">
            Generating Data
            <br />
            <div className="flex items-center mt-2 justify-center">
              <InfinityLoader />
            </div>
          </div>
        </div>
      ) : releaseNewInvestmentStockApi ? <button onClick={()=>toggleRunDemo()}>fwefaew</button> : null}
      
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
                    className={`card-1 ${cardStyle} ${patchCardUI} 
            lg:col-start-1 lg:col-end-3 
            investmentXL:col-start-1 investmentXL:col-end-3 
            lg:row-start-1 lg:row-end-5 flex flex-col justify-between `}
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
            lg:h-[19rem] flex flex-col justify-center `}
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
             lg:h-[35.5rem] flex flex-col justify-between`}
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
                              lg:h-[23rem] flex flex-col justify-between`}
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
            lg:h-[35rem] flex flex-col justify-between`}
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
            investmentXL:h-[100%] flex flex-col justify-between
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
            lg:h-[25rem] flex flex-col justify-between items-center`}
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
            lg:h-[15rem] flex flex-col justify-between`}
                    data-testid="stock-market-card-test-id"
                  >
                    <MarketCard isLoadingStocks={isLoadingStocks} />
                  </div>
                </div>
              </div>

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
