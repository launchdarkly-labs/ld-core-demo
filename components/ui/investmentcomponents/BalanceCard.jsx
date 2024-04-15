import React, { useContext } from "react";
import BalanceChart from "./BalanceChart";
import { Button } from "@/components/ui/button";
import { investmentColors } from "@/utils/styleUtils";
import { balanceCardTierStatusData } from "./BalanceChartData";
import { BounceLoader } from "react-spinners";
import silver from "@/public/investment/graphs/silver.png";
import gold from "@/public/investment/graphs/gold.png";
import diamond from "@/public/investment/graphs/diamond.png";

const BalanceCard = ({ isLoadingStocks }) => {
  

  const showCloudMigrationTwoStagesLDFlag = true;
  const showPatchCloudMigrationLDFlag = true;
  const isDeveloper = true;
  const userTierStatus = "gold";

  const imgGraph = {
    silver: silver,
    gold: gold,
    diamond: diamond,
  };

  const errorUI =
    showCloudMigrationTwoStagesLDFlag && !showPatchCloudMigrationLDFlag && isDeveloper ? "text-red-500" : "";

  let renderedData;

  if (showCloudMigrationTwoStagesLDFlag && showPatchCloudMigrationLDFlag) {
    renderedData = balanceCardTierStatusData[userTierStatus]?.dummyData;
  } else if (showCloudMigrationTwoStagesLDFlag && !showPatchCloudMigrationLDFlag) {
    renderedData = balanceCardTierStatusData[userTierStatus]?.noData;
  } else {
    renderedData = balanceCardTierStatusData[userTierStatus]?.dummyData;
  }

  return (
    <>
      <h3 className={`font-bold text-lg mb-5 ${errorUI}`}>Your Balance</h3>
      {isLoadingStocks ? (
        <BounceLoader marginY={"!my-[30vh]"} />
      ) : (
        <>
          <h4
            className={`text-2xl font-bold mb-1 ${errorUI}`}
            data-testid="stock-balance-total-test-id"
          >
            ${renderedData?.balance}
          </h4>
          <p className={`text-sm mb-5 ${investmentColors[renderedData?.position]} ${errorUI}`}>
            {renderedData?.position.includes("positive") ? "+" : "-"}$
            {renderedData?.dailyPriceChange} ({renderedData?.dailyPercentageChange}%) today
          </p>
          <div className="w-[100%] h-[350px] lg:h-[350px] mb-5">
            {window?.location?.ancestorOrigins?.item(0)?.includes("reprise") || window?.location?.hostname?.includes("reprise")   ? (
              <img src={imgGraph[userTierStatus]} alt={userTierStatus} className="w-full h-full object-contain"/>
            ) : (
              <BalanceChart />
            )}
          </div>
          <p
            className={`text-sm mb-5 text-center ${
              investmentColors[renderedData?.position]
            } ${errorUI}`}
          >
            {renderedData?.position.includes("positive") ? "+" : "-"}$
            {renderedData?.yearlyPriceChange} ({renderedData?.yearlyPercentageChange}%) in the past
            year
          </p>
          <div className="flex justify-between w-[300px] mx-auto mb-5">
            <Button classButtonOverride="!rounded-[100%] h-10 w-10 !bg-slate-500">1M</Button>
            <Button classButtonOverride="!rounded-[100%] h-10 w-10 !bg-slate-500">1Y</Button>
            <Button classButtonOverride="!rounded-[100%] h-10 w-10 !bg-slate-500">2Y</Button>
            <Button classButtonOverride="!rounded-[100%] h-10 w-10  !bg-primary">YTD</Button>
          </div>
          <p className="text-primary hover:underline cursor-pointer">Balance Details</p>
        </>
      )}
    </>
  );
};

export default BalanceCard;
