import React, { useContext } from "react";
import { LDContext } from "Providers/LaunchDarkly/context.js";
import { checkCloudMigrationTwoStagesLDFlag, checkPatchCloudMigrationLDFlag } from "Utils/flagsUtils.js";
import BalanceChart from "./BalanceChart";
import Button from "Components/Button";
import { investmentColors } from "Utils/styleUtils";
import { balanceCardTierStatusData } from "./BalanceChartData";
import CircleLoader from "Components/CircleLoader";
import AuthContext from "Components/Auth/AuthContext";
import silver from "img/graphs/silver.png";
import gold from "img/graphs/gold.png";
import diamond from "img/graphs/diamond.png";

const BalanceCard = ({ isLoadingStocks }) => {
  const { flags } = useContext(LDContext);
  const auth = useContext(AuthContext);
  const showCloudMigrationTwoStagesLDFlag = checkCloudMigrationTwoStagesLDFlag({ flags })?.includes("complete");
  const showPatchCloudMigrationLDFlag = checkPatchCloudMigrationLDFlag({ flags });
  const isDeveloper = auth?.userObject?.usertype?.includes("developer");
  const userTierStatus = auth.userObject?.tierStatus;

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
        <CircleLoader marginY={"!my-[30vh]"} />
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
