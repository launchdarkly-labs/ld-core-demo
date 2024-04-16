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

const StockRecommendationCard = ({ stocks, isLoadingStocks } : { stocks: any, isLoadingStocks: boolean }) => {
  
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

  return (
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
  );
};

export default StockRecommendationCard;
