import React, { useState, useEffect, useRef, useContext } from "react";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdRemoveCircleOutline,
} from "react-icons/io";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import LoginContext from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import InfinityLoader from "../infinityloader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockData {
  time: string;
  value: number;
  direction: "up" | "down" | null;
}

interface Stock {
  ticker: string;
  name: string;
  data: StockData[];
  image: string;
}

export const StocksComponent: React.FC = () => {
  let { stocksAPI } = useFlags();
  const client = useLDClient();
  const [elapsedTime, setElapsedTime] = useState(0);
  const { loginUser, user, email, updateAudienceContext } = useContext(LoginContext);
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

  const [stocks, setStocks] = useState([
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

      errorInterval = setInterval(() => {
        let dynamicValue;
        if (client) {
          if (stocksAPI) {
            //75% chance of hitting errors
            if (Math.random() < 0.75) {
              client.track("Stock API Error Rates");
            }
            dynamicValue = Math.floor(Math.random() * (170 - 150 + 1)) + 150;
            client.track("stock-api-latency", undefined, dynamicValue);
          } else {
            //25% chance of hitting errors
            if (Math.random() < 0.25) {
              client.track("stocks-api-error-rates");
            }
            dynamicValue = Math.floor(Math.random() * (60 - 50 + 1)) + 50;
            client.track("stock-api-latency", undefined, dynamicValue);
          }
        }
        setElapsedTime((prevTime) => prevTime + 1);
      }, 10);
    }
    const stocksinterval = setInterval(() => {
      const updatedStocks = stocks.map((stock) => {
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

      setStocks(updatedStocks);
    }, 3000);

    return () => {
      clearInterval(stocksinterval);
      if (runDemo) {
        if (loginInterval !== null) clearInterval(loginInterval);
        if (errorInterval !== null) clearInterval(errorInterval);
      }
    };
  }, [client, stocksAPI, runDemo]);

  const toggleRunDemo = () => {
    setRunDemo((prev) => !prev);
    if (runDemo == true) {
      loginUser(loggedUser, loggedEmail);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10 border-2 ${runDemo ? "border-white" : "border-current"
          }`}
      >
        <img src="stocksicon.png" onClick={toggleRunDemo} />
      </div>
      <p className=" font-bold font-sohne text-lg pt-2">Stocks</p>

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
      ) : stocksAPI ? (
        <div className="space-y-4 ">
          {stocks.map((stock, index) => (
            <div key={index} className="mt-4 rounded-lg">

              <div className="flex flex-row sm:flex-row justify-between items-center gap-x-3">
                <div className="flex items-center gap-x-1">
                  <img
                    src={`${stock.image}`}
                    alt={`${stock.ticker} logo`}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-bold  font-sohne">{stock.name}</span>
                </div>
                <div className="w-[25%] h-[20%] xl:w-10 xl:h-10 mx-auto hidden sm:block">
                  <Line
                    data={generateChartData(stock.data)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      elements: {
                        line: {
                          tension: 0.6,
                        },
                      },
                    }}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-right block ">
                    {stock.data[stock.data.length - 1].value}
                  </span>
                  {stock.data[stock.data.length - 1].direction === "up" ? (
                    <IoIosArrowDropupCircle className="text-green-500" />
                  ) : stock.data[stock.data.length - 1].direction === "down" ? (
                    <IoIosArrowDropdownCircle className="text-red-500" />
                  ) : stock.data[stock.data.length - 1].direction === null ? (
                    <IoMdRemoveCircleOutline className="" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-52">
          <div className=" font-bold font-sohne text-xl">COMING SOON</div>
        </div>
      )}
    </div>
  );
};
