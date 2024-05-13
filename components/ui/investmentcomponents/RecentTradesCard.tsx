import { useContext, useEffect, useState, useRef } from "react";
import InfinityLoader from "@/components/ui/infinityloader";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { investmentData } from "./InvestmentData";
import { BounceLoader } from "react-spinners";
import { debounce } from "lodash";
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
import { STOCK_LOGO_IMAGE } from "@/utils/constants";
import StatusBubble from "@/components/ui/investmentcomponents/StatusBubble";
import { useSearchParams } from "next/navigation";
import LoginContext from "@/utils/contexts/login";
import { wait } from "@/utils/utils";

const dummyStocks = [
  {
    name: "TSLA",
    price: "$87.36",
    date: "07/18/2023",
    shares: "99",
    status: "success",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
  {
    name: "AAPL",
    price: "$227.12",
    date: "07/16/2023",
    shares: "42",
    status: "success",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
  {
    name: "WMT",
    price: "$156.28",
    date: "07/19/2023",
    shares: "22",
    status: "processing",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
  {
    name: "NVDA",
    price: "$87.36",
    date: "07/19/2023",
    shares: "43",
    status: "success",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
  {
    name: "SHOP",
    price: "$227.12",
    date: "07/19/2023",
    shares: "12",
    status: "success",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
  {
    name: "CRM",
    price: "$156.28",
    date: "07/19/2023",
    shares: "70",
    status: "success",
    news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  },
];

const RecentTradesCard = () => {
  const releasNewInvestmentRecentTradeDBFlag = useFlags()["investment-recent-trade-db"];

  // if (recentTrades?.length === 0 || recentTrades === undefined) recentTrades = dummyStocks; //to deal with rate limit

  // if (recentTrades?.length > 0) {
  //   const standardizedTradeArr = [];

  //   recentTrades.forEach((trade) => {
  //     const totalProfit = formatMoneyTrailingZero(
  //       Math.round(
  //         parseFloat(trade?.price?.split("$").splice(1, 2).join("")) *
  //           parseFloat(trade?.shares) *
  //           100
  //       ) / 100
  //     );
  //     const newObj = showInvestmentDatabaseMigrationSixStages
  //       ? {
  //           T: trade?.name,
  //           c: trade?.price?.split("$").splice(1, 2).join(""), //to remove the $
  //           shares: trade?.shares,
  //           total: `$${totalProfit}`,
  //           status: trade?.status?.includes("completed") ? "success" : trade?.status,
  //           news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
  //         }
  //       : {
  //           T: trade?.name,
  //           c: trade?.price?.split("$").splice(1, 2).join(""), //to remove the $
  //         };
  //     return standardizedTradeArr.push(newObj);
  //   });

  //   recentTrades = standardizedTradeArr;
  // }

  const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext, logoutUser } =
    useContext(LoginContext);

  const [recentTrades, setRecentTrades] = useState([]);
  const client = useLDClient();
  const context = client?.getContext();

  const [elapsedTime, setElapsedTime] = useState(0);

  const [runDemo, setRunDemo] = useState(false);
  const [loggedUser, setInitialUser] = useState();
  const [loggedEmail, setInitialEmail] = useState();

  const elapsedTimeRef = useRef(elapsedTime);
  const tableRef = useRef(null);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.parentNode.style["overflow-y"] = "hidden";
    }
  }, []);

  const randomLatency = (min: number, max: number) =>
    max === undefined ? Math.random() * min : min + Math.random() * (max - min + 1);

  const runDBScript = async () => {
    if (releasNewInvestmentRecentTradeDBFlag) {
      // const t1 = Date.now();
      // console.log("releasNewInvestmentRecentTradeDBFlag is enabled");
      // console.log("t1", t1);
      // // await wait(randomLatency(0.5, 1.5));

      // try {
      //    fetch("/api/recenttrades")
      //     .then((response) => response.json())
      //     .then(async (data) => {
      //       setRecentTrades(data);
      //       const t2 = Date.now();
      //       const speed = t2 - t1;
      //       console.log("PostgreSQL speed is: " + speed + "ms");
      //       client?.track("recent-trades-db-latency", context, speed);
      //       await client?.flush();
      //       //10% chance of hitting errors
      //       // if (Math.random() < 0.1) {
      //       //   client?.track("stocks-api-error-rates");
      //       //   client?.flush();
      //       // }
      //     });
      // } catch (error) {
      //   console.log("error", error);
      //   client?.track("stocks-api-error-rates");
      //   await client?.flush();
      // }

      const t1 = Date.now();
      console.log("releasNewInvestmentRecentTradeDBFlag is enabled");
      await wait(randomLatency(0.5, 1.5));
      setRecentTrades(investmentData);

      const t2 = Date.now();
      const speed = t2 - t1;
      console.log("postgres speed is: " + speed + "ms");
      client?.track("recent-trades-db-latency", context, speed);
      //10% chance of hitting errors
      if (Math.random() < 0.1) {
        client?.track("stocks-api-error-rates");
      }
      await client?.flush();
    } else {
      const t1 = Date.now();
      console.log("releasNewInvestmentRecentTradeDBFlag is disabled");
      await wait(randomLatency(4, 6));
      setRecentTrades(investmentData);

      const t2 = Date.now();
      const speed = t2 - t1;
      console.log("local speed is: " + speed + "ms");
      client?.track("recent-trades-db-latency", context, speed);
      //75% chance of hitting errors
      if (Math.random() < 0.75) {
        client?.track("stocks-api-error-rates");
      }
      await client?.flush();
    }
  };

  useEffect(() => {
    runDBScript();
  }, []);

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
      }, 7100);

      errorInterval = setInterval(async () => {
        if (client) {
          runDBScript();
        }
        setElapsedTime((prevTime) => prevTime + 1);
      }, 7000);
    }

    return () => {
      if (loginInterval !== null) clearInterval(loginInterval);
      if (errorInterval !== null) clearInterval(errorInterval);
    };
  }, [client, releasNewInvestmentRecentTradeDBFlag, runDemo]);

  //const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext, logoutUser } =useContext(LoginContext);

  const toggleRunDemo = () => {
    if (runDemo == true && !releasNewInvestmentRecentTradeDBFlag) {
      setRunDemo((prev) => !prev); // cancel running test despite flag being off
      return;
    }

    setRunDemo((prev) => !prev);

    if (runDemo == true) {
      loginUser(loggedUser, loggedEmail);
    }
  };

  return (
    <>
      <h3
        className={`text-lg font-sohnelight ${
          releasNewInvestmentRecentTradeDBFlag
            ? " animate-pulse hover:animate-none cursor-pointer hover:underline hover:text-investmentblue  "
            : ""
        }`}
        onClick={() => (releasNewInvestmentRecentTradeDBFlag ? toggleRunDemo() : null)}
        title="Click Here to Run Release Guardian Simulator, generating stocks over many user context to simulate latency and error rate."
      >
        Recent Trades
      </h3>
      {runDemo ? (
        <div className="flex justify-center items-center h-full  flex-col gap-y-2">
          <h2 className=" font-bold font-sohne text-center text-xl">Generating Data</h2>
          <div className="flex ">
            <InfinityLoader />
          </div>
        </div>
      ) : recentTrades.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <Table className="font-sohnelight my-2 !overflow-none" ref={tableRef}>
          {/* <TableCaption>Your Items</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Trade Amount ($)</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTrades?.map((stock, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="">
                    <div
                      className="text-left stock-icon-group flex items-center gap-x-2"
                      data-testid={`stock-card-column-icon-${index}-modal-mobile-test-id`}
                    >
                      <img
                        src={STOCK_LOGO_IMAGE[stock?.name].src}
                        alt={stock?.name}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm bg-red object-fit"
                      />

                      <p>{stock?.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="">{stock.price}</TableCell>
                  <TableCell className={``}>{stock.shares}</TableCell>
                  <TableCell className={``}>
                    <StatusBubble status={stock?.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default RecentTradesCard;
