import React, { useContext } from "react";

import StockCard from "./StockCard";
import { formatMoneyTrailingZero } from "@/utils/utils"

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

const RecentTradesCard = ({ recentTrades, isLoadingRecentTrades }) => {

  // const showInvestmentDatabaseMigrationSixStages =
  //   checkInvestmentDatabaseMigrationSixStagesLDFlag({ flags })?.includes("complete") ||
  //   checkInvestmentDatabaseMigrationSixStagesLDFlag({ flags })?.includes("rampdown") ||
  //   checkInvestmentDatabaseMigrationSixStagesLDFlag({ flags })?.includes("live") ||
  //   checkInvestmentDatabaseMigrationSixStagesLDFlag({ flags })?.includes("shadow");

  const showInvestmentDatabaseMigrationSixStages =
  true;


  if (recentTrades?.length === 0 || recentTrades === undefined) recentTrades = dummyStocks; //to deal with rate limit

  if (recentTrades?.length > 0) {
    const standardizedTradeArr = [];

    recentTrades.forEach((trade) => {
      const totalProfit = formatMoneyTrailingZero(
        Math.round(
          parseFloat(trade?.price?.split("$").splice(1, 2).join("")) *
            parseFloat(trade?.shares) *
            100
        ) / 100
      );
      const newObj = showInvestmentDatabaseMigrationSixStages
        ? {
            T: trade?.name,
            c: trade?.price?.split("$").splice(1, 2).join(""), //to remove the $
            shares: trade?.shares,
            total: `$${totalProfit}`,
            status: trade?.status?.includes("completed") ? "success" : trade?.status,
            news: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
          }
        : {
            T: trade?.name,
            c: trade?.price?.split("$").splice(1, 2).join(""), //to remove the $
          };
      return standardizedTradeArr.push(newObj);
    });

    recentTrades = standardizedTradeArr;
  }

  return (
    <StockCard
      title="Recent Trades"
      columnHeaders={[
        "Symbol",
        "Trade Amount ($)",
        showInvestmentDatabaseMigrationSixStages ? "Shares" : null,
        showInvestmentDatabaseMigrationSixStages ? "Total Price ($)" : null,
        showInvestmentDatabaseMigrationSixStages ? "Status" : null,
        showInvestmentDatabaseMigrationSixStages ? "Ticker News" : null,
      ]}
      stocks={recentTrades}
      isLoadingStocks={isLoadingRecentTrades}
      showMigration={showInvestmentDatabaseMigrationSixStages}
    />
  );
};

export default RecentTradesCard;
