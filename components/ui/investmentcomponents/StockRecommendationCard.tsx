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

//TODO: have values constantly change
//TODO: have change in stocks per reload?
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

    // stocks = recommendedStocks;
  }

  if (stocks.length === 0 || stocks === undefined) stocks = dummyStocks; //to deal with rate limit

  stocks = dummyStocks;
  const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext, logoutUser } =
    useContext(LoginContext);

  const releaseNewInvestmentStockApi = useFlags()["release-new-investment-stock-api"];

  const client = useLDClient();
  const [elapsedTime, setElapsedTime] = useState(0);

  const [runDemo, setRunDemo] = useState(false);
  const [loggedUser, setInitialUser] = useState();
  const [loggedEmail, setInitialEmail] = useState();

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
            }
            dynamicValue = Math.floor(Math.random() * (170 - 150 + 1)) + 150;
            client.track("stock-api-latency", undefined, dynamicValue);
            await client.flush();
          } else {
            //25% chance of hitting errors
            if (Math.random() < 0.25) {
              client.track("stocks-api-error-rates");
              await client.flush();
            }
            dynamicValue = Math.floor(Math.random() * (60 - 50 + 1)) + 50;
            client.track("stock-api-latency", undefined, dynamicValue);
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

  const toggleRunDemo = () => {
    setRunDemo((prev) => !prev);
    if (runDemo == true) {
      loginUser(loggedUser, loggedEmail);
    }
  };

  // const context = client?.getContext();

  return (
    <>
      <h3
        className={`text-lg font-sohnelight ${releaseNewInvestmentStockApi ? " animate-pulse hover:animate-none cursor-pointer hover:underline hover:text-investmentblue" : "" }`}
        onClick={() => releaseNewInvestmentStockApi?  toggleRunDemo() : null}
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
      ) : (
        // <StockCard
        //   title="Recommended Stocks to Buy"
        //   columnHeaders={[
        //     "Symbol",
        //     "Price ($)",
        //     showCloudMigrationTwoStagesLDFlag ? "Gain/Loss (%)" : null,
        //     showCloudMigrationTwoStagesLDFlag ? "Daily Trade Volume" : null,
        //   ]}
        //   stocks={stocks}
        //   isLoadingStocks={isLoadingStocks}
        //   data-testid={"recommended-stocks"}
        //   showMigration={true}
        //   showViewMore={true}
        // />

        <>
          <Table className="font-sohnelight my-2">
            {/* <TableCaption>Your Items</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Price ($)</TableHead>
                <TableHead>Gain/Loss (%)</TableHead>
                {releaseNewInvestmentStockApi ? (
                  <TableHead className="bg-gradient-investment text-transparent bg-clip-text">AI Assisted Information</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock, index) => {
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
                          <PopoverTrigger asChild>
                            <InfoIcon className="cursor-pointer text-investmentblue animate-pulse hover:animate-none" />
                          </PopoverTrigger>
                          <PopoverContent>Some AI Gen Info</PopoverContent>
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
