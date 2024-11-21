import { useContext, useEffect, useState, useRef } from "react";
import InfinityLoader from "@/components/ui/infinityloader";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import StockCard from "./StockCard";
import LoginContext from "@/utils/contexts/login";
import { STOCK_LOGO_IMAGE } from "@/utils/constants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyTrailingZero } from "@/utils/utils";
import { investmentColors } from "@/utils/styleUtils";
import { InfoIcon, Brain } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BounceLoader } from "react-spinners";
import { wait, randomLatency } from "@/utils/utils";
import { stockData } from "./InvestmentData";

//TODO: have values constantly change
//TODO: have change in stocks per reload?
const StockRecommendationCard = () => {
  const { loginUser, userObject, updateUserContext } = useContext(LoginContext);

  const releaseNewInvestmentStockApi = useFlags()["release-new-investment-stock-api"];

  const client = useLDClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const [runDemo, setRunDemo] = useState(false);
  const [loggedUser, setInitialUser] = useState();
  const [loggedEmail, setInitialEmail] = useState();
  const [aiResponse, setAIResponse] = useState("");
  const [loadingBedrock, setLoadingBedrock] = useState(false);
  const [loadingStocksTable, setStocksTable] = useState(false);

  const elapsedTimeRef = useRef(elapsedTime);
  const tableRef = useRef(null);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    const waiting = async () => {
      setStocksTable(true);
      await wait(1);
      setStocksTable(false);
    };
    waiting();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.parentNode.style["overflow-y"] = "hidden";
    }
  }, []);

  useEffect(() => {
    if (!loggedUser) {
      setInitialUser(userObject.personaname);
      setInitialEmail(userObject.personaemail);
    }

    let loginInterval: NodeJS.Timeout | null = null;
    let errorInterval: NodeJS.Timeout | null = null;

    if (runDemo) {
      loginInterval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime % 1 === 0) {
            updateUserContext();
          }
          return newTime;
        });
      }, 100);

      errorInterval = setInterval(async () => {
        let dynamicValue1;
        let dynamicValue2;
        if (client) {
          if (releaseNewInvestmentStockApi) {
            //75% chance of hitting errors
            if (Math.random() < 0.75) {
              await client.track("stocks-api-error-rates");
              await client.flush();
            }
            dynamicValue1 = Math.floor(Math.random() * (21)) + 600;
            await client.track("stock-api-latency", undefined, dynamicValue1);
            dynamicValue1 = 0;
            await client.flush();
          } else {
            //25% chance of hitting errors
            if (Math.random() < 0.25) {
              await client.track("stocks-api-error-rates");
              await client.flush();
            }
            dynamicValue2 = Math.floor(Math.random() * (60 - 50 + 1)) + 50;
            await client.track("stock-api-latency", undefined, dynamicValue2);
            dynamicValue2 = 0;
            await client.flush();
          }
        }
        setElapsedTime((prevTime) => prevTime + 1);
      }, 50);
    }

    return () => {
      if (runDemo) {
        if (loginInterval !== null) clearInterval(loginInterval);
        if (errorInterval !== null) clearInterval(errorInterval);
      }
    };
  }, [client, releaseNewInvestmentStockApi, runDemo]);

  async function fetchBedrockAIResponse(stockName: string) {
    try {
      const prompt: string = `As an investment advisor, advise whether to buy, hold, or sell ${stockName}. Limit your responses to an estimated 150 characters. Answer in a professional tone.`;

      setLoadingBedrock(true);
      const response = await fetch("/api/bedrock", {
        method: "POST",
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Check API Server Logs.`);
      }

      const data = await response.json();
      setAIResponse(data.completion);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      wait(1);
      setLoadingBedrock(false);
    }
  }

  const toggleRunDemo = () => {
    setRunDemo((prev) => !prev);
    if (runDemo == true) {
      loginUser(loggedEmail);
    }
  };

  // const context = client?.getContext();

  return (
    <>
      <h3
        className={`text-lg font-sohnelight  ${" animate-pulse hover:animate-none cursor-pointer hover:underline hover:text-investmentblue "}`}
        onClick={() => toggleRunDemo()}
        title="Click Here to Run Release Guardian Simulator, generating stocks over many user context to simulate latency and error rate"
      >
        Recommended Stocks to Buy
      </h3>
      {runDemo ? (
        <div className="flex justify-center items-center h-full  flex-col gap-y-2">
          <h2 className=" font-bold font-sohne text-center text-xl">Generating Data</h2>
          <div className="flex ">
            <InfinityLoader />
          </div>
        </div>
      ) : loadingStocksTable ? (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <>
          <Table className="font-sohnelight my-2" ref={tableRef}>
            {/* <TableCaption>Your Items</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Price ($)</TableHead>
                <TableHead>Gain/Loss (%)</TableHead>
                {releaseNewInvestmentStockApi ? (
                  <TableHead className="bg-gradient-investment text-transparent bg-clip-text">
                    AI Assisted Information
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.slice(0, 3).map((stock, index) => {
                const percentageChange = formatMoneyTrailingZero(
                  Math.round((stock.c - stock.o) * 100) / 100
                );
                const position = percentageChange.toString().includes("-")
                  ? "negative"
                  : "positive";
                return (
                  <TableRow key={index}>
                    <TableCell className="flex items-center gap-y-2">
                      <img
                        src={STOCK_LOGO_IMAGE[stock?.T].src}
                        alt={stock?.T}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm object-fit"
                      />

                      <span>{stock?.T}</span>
                    </TableCell>
                    <TableCell className="">${stock.c}</TableCell>
                    <TableCell className={`${investmentColors[position]}`}>
                      {percentageChange}%
                    </TableCell>
                    {releaseNewInvestmentStockApi ? (
                      <TableCell className={`text-investmentgrey `}>
                        <Popover>
                          <PopoverTrigger asChild onClick={() => fetchBedrockAIResponse(stock?.T)}>
                            <InfoIcon className="cursor-pointer text-investmentblue animate-pulse hover:animate-none" />
                          </PopoverTrigger>

                          <PopoverContent>
                            <h3 className="text-center font-bold mb-2">
                              Information on {stock?.T}
                            </h3>
                            {loadingBedrock ? (
                              <div className="flex justify-center items-center h-full">
                                <BounceLoader color="#FF386B" />
                              </div>
                            ) : (
                              <p>{aiResponse}</p>
                            )}
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default StockRecommendationCard;
