// import RetirementChart from "./RetirementChart";
import { Button } from "@/components/ui/button";
import retirementGraph from "@/public/investment/graphs/retirement_graph.png";
import React, { useEffect, useState } from "react";

import { BounceLoader } from "react-spinners";
import { wait, randomLatency } from "@/utils/utils";

const RetirementCard = () => {
  const [loadingStocksTable, setStocksTable] = useState(false);

  useEffect(() => {
    const waiting = async () => {
      setStocksTable(true);
      await wait(1);
      setStocksTable(false);
    };
    waiting();
  }, []);

  const retireDate = "36";

  return (
    <>
      <h3 className="font-bold text-lg text-left">Goals</h3>
      {/* <div className="h-[25rem] w-[100%] mb-4 mt-[-5rem]">
        <RetirementChart />
       
      </div> */}
      {loadingStocksTable ? (
        <div className="flex justify-center items-center h-full w-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <>
          <img
            src={retirementGraph.src}
            alt="retirement-graph"
            className="w-full sm:w-[50%] lg:w-[80%] investmentXL:w-full "
          />
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl mb-4 text-center">
              You could retire in {retireDate} years. Are you on target?{" "}
            </h3>
            <Button className="bg-investmentblue rounded-none cursor-default">
              Get Retirement Score
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default RetirementCard;
