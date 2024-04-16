import React, { useContext } from "react";

import StockCard from "./StockCard";

const dummyStocks = [
  {
    T: "AMZN",
    c: "87.36",
    o: "87.46",
    v: 61166283,
  },
  {
    T: "SHOP",
    c: "37.19",
    o: "37.70",
    v: 22978271,
  },
  {
    T: "MSFT",
    c: "227.12",
    o: "226.45",
    v: 20567159,
  },
  {
    T: "WMT",
    c: "144.95",
    o: "146.32",
    v: 3953216,
  },

  {
    T: "TSLA",
    c: "119.77",
    o: "118.96",
    v: 112643377,
  },

  {
    T: "NVDA",
    c: "156.28",
    o: "152.84",
    v: 47788389,
  },
];

const StockMoversCard = ({ stocks, isLoadingStocks } : { stocks:any, isLoadingStocks: boolean }) => {

  const showCloudMigrationTwoStagesLDFlag =true;

  if (stocks.length === 0 || stocks === undefined) stocks = dummyStocks; //to deal with rate limit

  return (
    <StockCard
      title="Your biggest movers"
      columnHeaders={[
        "Symbol",
        "Price ($)",
        showCloudMigrationTwoStagesLDFlag ? "Gain/Loss (%)" : null,
        // showCloudMigrationTwoStagesLDFlag ? "Daily Trade Volume" : null,
      ]}
      stocks={stocks}
      isLoadingStocks={isLoadingStocks}
      showMigration={showCloudMigrationTwoStagesLDFlag}
    />
  );
};

export default StockMoversCard;
