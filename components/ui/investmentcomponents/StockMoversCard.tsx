import React, { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyTrailingZero } from "@/utils/utils";
import { investmentColors } from "@/utils/styleUtils";
import { STOCK_LOGO_IMAGE } from "@/utils/constants";
import { wait, randomLatency } from "@/utils/utils";
import { BounceLoader } from "react-spinners";
import { stockData } from "./InvestmentData";

const StockMoversCard = () => {
  const tableRef = useRef(null);
  const [loadingStocksTable, setStocksTable] = useState(false);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.parentNode.style["overflow-y"] = "hidden";
    }
  }, []);

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
      <h3 className=" text-lg font-sohnelight">Stock Movers</h3>
      {loadingStocksTable ? (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <Table
          className="font-sohnelight my-2 !overflow-hidden"
          ref={tableRef}
          id="stock-movers-table"
        >
          {/* <TableCaption>Your Items</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead>Gain/Loss (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockData.map((stock, index) => {
              const percentageChange = formatMoneyTrailingZero(
                Math.round((stock.c - stock.o) * 100) / 100
              );
              const position = percentageChange.toString().includes("-") ? "negative" : "positive";
              return (
                <TableRow key={index}>
                  <TableCell className="">
                    <div
                      className="text-left stock-icon-group flex items-center gap-x-2"
                      data-testid={`stock-card-column-icon-${index}-modal-mobile-test-id`}
                    >
                      <img
                        src={STOCK_LOGO_IMAGE[stock?.T].src}
                        alt={stock?.T}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm bg-red object-fit"
                      />

                      <span>{stock?.T}</span>
                    </div>
                  </TableCell>
                  <TableCell className="">${stock.c}</TableCell>
                  <TableCell className={`${investmentColors[position]}`}>
                    {percentageChange}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default StockMoversCard;
