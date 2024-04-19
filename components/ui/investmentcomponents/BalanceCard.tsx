import React, { useContext } from "react";
import BalanceChart from "./BalanceChart";
import { Button } from "@/components/ui/button";
import { investmentColors } from "@/utils/styleUtils";
import { balanceCardTierStatusData } from "./BalanceChartData";
import { BounceLoader } from "react-spinners";
import silver from "@/public/investment/graphs/silver.png";
import gold from "@/public/investment/graphs/gold.png";
import diamond from "@/public/investment/graphs/diamond.png";

const BalanceCard = ({ isLoadingStocks }: { isLoadingStocks: boolean }) => {
  

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
      <h3 className={`font-bold text-lg mb-4 ${errorUI}`}>Your Balance</h3>
      {isLoadingStocks ? (
        <BounceLoader marginy={"!my-[30vh]"} />
      ) : (
        <>
          <h4
            className={`text-2xl font-bold mb-1 ${errorUI}`}
            data-testid="stock-balance-total-test-id"
          >
            ${renderedData?.balance}
          </h4>
          <p className={`text-sm mb-4 ${investmentColors[renderedData?.position]} ${errorUI}`}>
            {renderedData?.position.includes("positive") ? "+" : "-"}$
            {renderedData?.dailyPriceChange} ({renderedData?.dailyPercentageChange}%) today
          </p>
          <div className="w-[100%] h-[350px] lg:h-[350px] mb-4">
            {window?.location?.ancestorOrigins?.item(0)?.includes("reprise") || window?.location?.hostname?.includes("reprise")   ? (
              <img src={imgGraph[userTierStatus]} alt={userTierStatus} className="w-full h-full object-contain"/>
            ) : (
              <BalanceChart />
            )}
          </div>
          <p
            className={`text-sm mb-4 text-center ${
              investmentColors[renderedData?.position]
            } ${errorUI}`}
          >
            {renderedData?.position.includes("positive") ? "+" : "-"}$
            {renderedData?.yearlyPriceChange} ({renderedData?.yearlyPercentageChange}%) in the past
            year
          </p>
          <div className="flex justify-between w-[300px] mx-auto mb-4">
            <Button className="rounded-full bg-black h-10 w-10">1M</Button>
            <Button className="rounded-full bg-black h-10 w-10">1Y</Button>
            <Button className="rounded-full bg-black h-10 w-10">2Y</Button>
            <Button className="rounded-full bg-gradient-investment h-10 w-10">YTD</Button>
          </div>
          <p className="text-investmentblue hover:underline cursor-pointer text-center">Balance Details</p>
        </>
      )}
    </>
  );
};

export default BalanceCard;
