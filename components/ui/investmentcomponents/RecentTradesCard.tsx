import { useContext, useEffect, useState, useRef } from "react";
import InfinityLoader from "@/components/ui/infinityloader";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { investmentData } from "./InvestmentData";
import { BounceLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STOCK_LOGO_IMAGE } from "@/utils/constants";
import StatusBubble from "@/components/ui/investmentcomponents/StatusBubble";
import LoginContext from "@/utils/contexts/login";
import { wait, randomLatency } from "@/utils/utils";

const RecentTradesCard = () => {
  const releasNewInvestmentRecentTradeDBFlag = useFlags()["investment-recent-trade-db"];

  const { loginUser, user, email, updateAudienceContext } = useContext(LoginContext);

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

  const runDBScript = async () => {
    if (releasNewInvestmentRecentTradeDBFlag) {
      const t1 = Date.now();
      console.log("releasNewInvestmentRecentTradeDBFlag is enabled");

      if (runDemo) {
        client?.track("recent-trades-db-latency", undefined, randomLatency(15, 25));
        if (Math.random() < 0.05) {
          client?.track("recent-trades-db-errors");
        }
      } else {
        try {
          fetch("/api/recenttrades")
            .then((response) => response.json())
            .then(async (data) => {
              setRecentTrades(data);
              const t2 = Date.now()
              const speed = (t2 - t1)
              console.log("PostgreSQL speed is: " + speed + "ms")
            });

        } catch (error) {
          console.log("error", error);
        }
      }
    } else {
      // const t1 = Date.now();
      console.log("releasNewInvestmentRecentTradeDBFlag is disabled");
      if (runDemo) {
        client?.track("recent-trades-db-latency", undefined, randomLatency(40, 60));
        if (Math.random() < 0.75) {
          client?.track("recent-trades-db-errors");
        }
      } else {
        await wait(randomLatency(4, 6));
        setRecentTrades(investmentData);
      }
    }
    await client?.flush();
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
      }, 100);

      errorInterval = setInterval(async () => {
        if (client) {
          runDBScript();
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
  }, [client, releasNewInvestmentRecentTradeDBFlag, runDemo]);

  const toggleRunDemo = () => {
    setRunDemo((prev) => !prev);
    if (runDemo == true) {
      loginUser(loggedUser, loggedEmail);
    }
  };

  return (
    <>
      <h3
        className={`text-lg font-sohnelight ${" animate-pulse hover:animate-none cursor-pointer hover:underline hover:text-investmentblue  "}`}
        onClick={() => (toggleRunDemo())}
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
