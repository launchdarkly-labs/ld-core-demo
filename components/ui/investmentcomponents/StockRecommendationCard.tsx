import { useContext, useEffect, useState, useRef } from "react";
import InfinityLoader from "@/components/ui/infinityloader";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import StockCard from "./StockCard";
import LoginContext from "@/utils/contexts/login";

const dummyStocks = [
  {
    T: "AMZN",
    c: "87.36",
    o: "87.46",
    v: 61166283,
  },
  {
    T: "MSFT",
    c: "227.12",
    o: "226.45",
    v: 20567159,
  },
  {
    T: "NVDA",
    c: "156.28",
    o: "152.84",
    v: 47788389,
  },
];

// const noStocks = [
//   {
//     T: "AMZN",
//     c: "0",
//     o: "x",
//   },
//   {
//     T: "MSFT",
//     c: "0",
//     o: "x",
//   },
//   {
//     T: "STOCK",
//     c: "0",
//     o: "x",
//   },
// ];

const StockRecommendationCard = ({
  stocks,
  isLoadingStocks,
}: {
  stocks: any;
  isLoadingStocks: boolean;
}) => {
  const showCloudMigrationTwoStagesLDFlag = true;

  if (stocks.length > 0) {
    const recommendedStocks = [];

    stocks.forEach((stock) => {
      if (stock?.T?.includes("AMZN") || stock?.T?.includes("MSFT") || stock?.T?.includes("NVDA")) {
        return recommendedStocks.push(stock);
      }
    });

    stocks = recommendedStocks;
  }

  if (stocks.length === 0 || stocks === undefined) stocks = dummyStocks; //to deal with rate limit

  const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext, logoutUser } =
    useContext(LoginContext);

  const releaseNewInvestmentStockApi = useFlags()["release-new-investment-stock-api"];


  const {stocksAPI} = useFlags();

  const client = useLDClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const [runDemo, setRunDemo] = useState(false);
  const [loggedUser, setInitialUser] = useState();
  const [loggedEmail, setInitialEmail] = useState();

  // const generateInitialData = (initialValue) => {
  //   const data = [];
  //   const startTime = new Date();
  //   startTime.setMinutes(startTime.getMinutes() - 10);

  //   for (let i = 0; i < 10; i++) {
  //     startTime.setMinutes(startTime.getMinutes() + 1);
  //     const value = Math.round(initialValue + (Math.random() - 0.5) * 10);
  //     data.push({
  //       time: startTime.toLocaleTimeString(),
  //       value: value,
  //       direction: null,
  //     });
  //   }

  //   return data;
  // };

  // const generateChartData = (stockData) => {
  //   const lastTenDataPoints = stockData.slice(-10);
  //   const secondLastValue =
  //     lastTenDataPoints.length > 1
  //       ? lastTenDataPoints[lastTenDataPoints.length - 2].value
  //       : lastTenDataPoints[0].value;
  //   const lastValue = lastTenDataPoints[lastTenDataPoints.length - 1].value;
  //   const directionColor =
  //     lastValue > secondLastValue
  //       ? "lightgreen"
  //       : lastValue < secondLastValue
  //         ? "red"
  //         : "rgba(255, 255, 255, 0.5)";

  //   return {
  //     labels: lastTenDataPoints.map((dataPoint) => dataPoint.time),
  //     datasets: [
  //       {
  //         data: lastTenDataPoints.map((dataPoint) => dataPoint.value),
  //         borderColor: directionColor,
  //         backgroundColor: "rgba(255, 255, 255, 0)",
  //         borderWidth: 2,
  //         pointRadius: 0,
  //         tension: 0.2,
  //       },
  //     ],
  //   };
  // };

  // const [stocksz, setStocksz] = useState([
  //   {
  //     ticker: "LD",
  //     name: "LaunchDarkly",
  //     data: generateInitialData(1025),
  //     image: "ld.png",
  //   },
  //   {
  //     ticker: "AAPL",
  //     name: "Apple Inc.",
  //     data: generateInitialData(190),
  //     image: "apple.png",
  //   },
  //   {
  //     ticker: "TSLA",
  //     name: "Tesla",
  //     data: generateInitialData(205),
  //     image: "tesla.png",
  //   },
  //   {
  //     ticker: "NVDA",
  //     name: "Nvidia",
  //     data: generateInitialData(612),
  //     image: "nvidia.png",
  //   },
  // ]);

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
              console.log("this hits here");
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
              console.log("this hits here 2");
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
    // const stocksinterval = setInterval(() => {
    //   const updatedStocks = stocksz.map((stock) => {
    //     let newValue = 0;
    //     const lastValue = stock.data[stock.data.length - 1].value;
    //     if (stock.ticker == "TSLA") {
    //       newValue = Math.floor(Math.random() * (200 - 210 + 1)) + 205;
    //     }
    //     if (stock.ticker == "AAPL") {
    //       newValue = Math.floor(Math.random() * (185 - 196 + 1)) + 190;
    //     }
    //     if (stock.ticker == "LD") {
    //       newValue = Math.floor(Math.random() * (1000 - 1050 + 1)) + 1025;
    //     }
    //     if (stock.ticker == "NVDA") {
    //       newValue = Math.floor(Math.random() * (600 - 620 + 1)) + 612;
    //     }
    //     const direction = newValue > lastValue ? "up" : newValue < lastValue ? "down" : null;
    //     const newTime = new Date().toLocaleTimeString();
    //     const newDataPoint = { time: newTime, value: newValue, direction };

    //     return {
    //       ...stock,
    //       data: [...stock.data, newDataPoint],
    //     };
    //   });

    //   setStocksz(updatedStocks);
    // }, 3000);

    return () => {
      // clearInterval(stocksinterval);
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
console.log(releaseNewInvestmentStockApi)
const context =  client?.getContext();
console.log("loginUser",context)
  return (
    <>
      <button onClick={() => toggleRunDemo()}>fwefaew</button>
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
      ) : releaseNewInvestmentStockApi ? (
        <StockCard
          title="Recommended Stocks to Buy"
          columnHeaders={[
            "Symbol",
            "Price ($)",
            showCloudMigrationTwoStagesLDFlag ? "Gain/Loss (%)" : null,
            // showCloudMigrationTwoStagesLDFlag ? "Daily Trade Volume" : null,
          ]}
          stocks={stocks}
          isLoadingStocks={isLoadingStocks}
          data-testid={"recommended-stocks"}
          showMigration={showCloudMigrationTwoStagesLDFlag}
          showViewMore={true}
        />
      ) : (
        "Coming Soon"
      )}
    </>
  );
};

export default StockRecommendationCard;
