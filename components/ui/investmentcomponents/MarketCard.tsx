import { investmentColors } from "@/utils/styleUtils";
import React, { useEffect, useState } from "react";

import { BounceLoader } from "react-spinners";
import { wait, randomLatency } from "@/utils/utils";

const dummyData = [
  {
    name: "S&P 500",
    price: "4,267.52",
    priceChange: "16.33",
    percentageChange: "0.38",
    position: "negative",
  },
  {
    name: "DOW Jones",
    price: "33,665.02",
    priceChange: "91.74",
    percentageChange: "0.27",
    position: "positive",
  },
  {
    name: "NASDAQ",
    price: "13,104.89",
    priceChange: "171.52",
    percentageChange: "1.29",
    position: "negative",
  },
];

const MarketCard = () => {
  const renderedData = dummyData;

  const [loadingStocksTable, setStocksTable] = useState(false);

  useEffect(() => {
    const waiting = async () => {
      setStocksTable(true);
      await wait(1);
      setStocksTable(false);
    };
    waiting();
  }, []);

  return (
    <>
      <h3 className="font-bold text-lg mb-4">Market</h3>
      {loadingStocksTable ? (
        <div className="flex justify-center items-center h-full w-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4 gap-x-4">
            {renderedData.map((datum) => {
              return (
                <div className="" key={datum.name}>
                  <p className="mb-1">{datum.name}</p>
                  <p className={` ${investmentColors[datum.position]}`}>
                    {datum.position.includes("positive") ? "+" : "-"}${datum.priceChange}
                  </p>
                  <p className={`${investmentColors[datum.position]}`}>
                    ({datum.position.includes("positive") ? "+" : "-"}
                    {datum.percentageChange}%)
                  </p>
                  <p className="text-investmentgrey">${datum.price}</p>
                </div>
              );
            })}
          </div>

          <p className="text-investmentblue hover:underline cursor-default text-center">
            View More
          </p>
        </>
      )}
    </>
  );
};

export default MarketCard;
