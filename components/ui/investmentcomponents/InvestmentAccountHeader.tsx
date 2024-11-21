import React from "react";
import { Button } from "../button";

const InvestmentAccountHeader = () => {
  return (
    <div className=" pt-[2rem] sm:pt-[2rem] lg:pt-[4rem] pb-[2rem] sm:pb-[0rem] font-sohnelight  ">
      <div className="mx-4 xl:mx-auto max-w-7xl h-[12.5rem] sm:h-[11rem] lg:h-[8rem] flex flex-col justify-between">
        <div className="flex justify-between flex-col lg:flex-row gap-y-6 lg:gap-y-0">
          <h1 className="text-4xl">All accounts</h1>
          <div className="flex gap-x-4">
            <Button className="bg-investmentblue p-2 rounded-full w-[8rem] shadow-xl text-white cursor-default">
              Trade
            </Button>
            <Button className="bg-investmentblue p-2 shadow-xl rounded-full w-[8rem] text-white cursor-default">
              Transfer
            </Button>
            <Button className="bg-investmentblue p-2 shadow-xl rounded-full w-[8rem] text-white cursor-default">Buy</Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between w-full lg:w-[66%] text-investmentgrey gap-y-2 sm:gap-y-0 gap-x-4 sm:gap-x-8">
          <p
            className={`block pb-4 px-4 bg-transparent transition-colors 
            cursor-auto hover:bg-gradient-airline-buttons bg-[length:100%_3px] 
            bg-no-repeat bg-bottom bg-gradient-investment outline-none `}
          >
            Home
          </p>
          <p>Investments</p>
          <p>Balance</p>
          <p>Activity & Orders</p>
          <p>Documents</p>
          <p>More</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAccountHeader;
