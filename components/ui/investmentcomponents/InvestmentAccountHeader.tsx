import React from "react";
import { Button } from "../button";

const InvestmentAccountHeader = () => {
  return (
    <div className="bg-white pt-[4rem]  ">
      <div className="mx-auto max-w-7xl h-[8rem] flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl">All accounts</h1>
          <div className="flex gap-x-4">
            <Button className="bg-investmentblue p-2 rounded-full w-[8rem] text-white cursor-none">
              Trade
            </Button>
            <Button className="bg-investmentblue p-2 rounded-full w-[8rem] text-white cursor-none">
              Transfer
            </Button>
            <Button className="bg-investmentblue p-2 rounded-full w-[8rem] text-white cursor-none">Buy</Button>
          </div>
        </div>

        <div className="flex justify-between w-[50%] text-investmentgrey gap-x-8">
          <p
            className={`block pb-4 px-4 bg-transparent transition-colors cursor-auto hover:bg-gradient-airline-buttons bg-[length:100%_3px] bg-no-repeat bg-bottom bg-gradient-investment outline-none`}
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
