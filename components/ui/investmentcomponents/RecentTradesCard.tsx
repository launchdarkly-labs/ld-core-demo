import { useContext, useEffect, useState, useRef } from "react";
import InfinityLoader from "@/components/ui/infinityloader";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { investmentData } from "./InvestmentData";
import { BounceLoader } from "react-spinners";

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

  const [recentTrades, setRecentTrades] = useState([]);
  const client = useLDClient();
  // const context = client?.getContext();

  function wait(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }
  const randomLatency = (min: number,max :number) => 
    max === undefined ? Math.random()*min
    : min + Math.random()*(max - min + 1)
  
  useEffect(() => {
    // if (releasNewInvestmentRecentTradeDBFlag) {
    //   console.log("postgress");
    //   setTimeout(() => {
    //     setRecentTrades(investmentData); //TODO: set interface?
    //   }, 500);
    // } else {
    //   setTimeout(() => {
    //     setRecentTrades(investmentData); //TODO: set interface?
    //   }, 5000);
    // }

    const runSomething = async () => {
      if (releasNewInvestmentRecentTradeDBFlag) {
        const t1 = Date.now();
        console.log("releasNewInvestmentRecentTradeDBFlag is enabled");
        console.log("t1", t1);
        // try {
        // if (!connectionString) {
        //     throw new Error('DATABASE_URL is not set')
        // }
        // const client = postgres(connectionString)
        // const db = drizzle(client);
        // const allAirports = await db.select().from(airports)
    

        await wait(randomLatency(0.5,1.5));

        setRecentTrades(investmentData); //TODO: set interface?

        console.log(recentTrades);
        const t2 = Date.now();
        console.log("t2", t2);
        console.log("PostgreSQL speed is: " + (t2 - t1) + "ms");
        const speed = t2 - t1;
        client.track("recent-trades-db-latency", undefined, speed);
        await client.flush();

        // return Response.json({ allAirports })
        // } catch (error) {
        //   client.track("recent-trades-db-errors");
        //   client.flush();
        //   console.log("error");

        // }
      } else {
        const t1 = Date.now();
        console.log("FlightDb is disabled");
        // try {
        // const redis = new Redis(process.env.REDIS_URL || '');
        // const airportsRedisJson = await redis.get('allAirports');
        // const allAirports = JSON.parse(airportsRedisJson!);

        await wait(randomLatency(4,6));

        setRecentTrades(investmentData);

        const t2 = Date.now();
        console.log("local speed is: " + (t2 - t1) + "ms");
        const speed = t2 - t1;
        console.log(speed);
        client.track("recent-trades-db-latency", undefined, speed);
        await client.flush();
        //   } catch (error) {
        //     client.track("recent-trades-db-errors");
        //     client.flush();
        //     console.log("error");
        //   }
      }
    };

    runSomething();
    // fetch("/api/recenttrades")
    // .then((response) => response.json())
    // .then((data) => console.log(data));
  }, []);

  //const { isLoggedIn, setIsLoggedIn, loginUser, user, email, updateAudienceContext, logoutUser } =useContext(LoginContext);

  //TODO: done - create a fake load a really long one to get the stocks showing. if time is short, then have another local one with settimer be shorter than the first
  //TODO: fetch
  //TODO: create a dialog or sheet idk showing the log as you are fetching user data?
  //TODO: done - so like in the useeffect you would have a flag between the local and the postegress db
  //TODO: then press that button to run the simulator, have an array to show all the logs, do the useeffect

  return (
    <>
      <h3 className=" text-lg font-sohnelight">Recent Trades</h3>
      <Table className="font-sohnelight my-2">
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
          {recentTrades.length === 0 ? (
            <TableRow className="h-full   flex justify-center items-center">
              <BounceLoader color="#FF386B" />
            </TableRow>
          ) : (
            recentTrades?.map((stock, index) => {
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
            })
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default RecentTradesCard;
