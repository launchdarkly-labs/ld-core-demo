import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import { BounceLoader } from "react-spinners";
import { truncateString } from "@/utils/utils";
import { wait, randomLatency } from "@/utils/utils";
import { newsData } from "@/components/ui/investmentcomponents/InvestmentData";

const NewsCard = () => {
  const [loadingStocksTable, setStocksTable] = useState(false);

  useEffect(() => {
    const waiting = async () => {
      setStocksTable(true);
      await wait(randomLatency(0.5, 1.5));
      setStocksTable(false);
    };
    waiting();
  }, []);

  return (
    <>
      <h3 className="font-bold text-lg mb-4">News about your investment</h3>

      {loadingStocksTable ? (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 mb-4">
          {newsData?.slice(0, 7).map((datum: any, index: number) => {
            const dateCleaned = format(new Date(datum.published_utc), "MMM d, yyyy");
            return (
              <div className="" key={`${datum.id}-${index}`}>
                <p
                  className="text-sm hover:underline cursor-pointer"
                  data-testid="stock-news-title-test-id"
                  title={datum.title}
                >
                  {truncateString(datum.title, 60)}
                </p>
                <p className="text-investmentgrey text-xs">
                  {datum.publisher.name} &#183; <span>{dateCleaned}</span>
                </p>
              </div>
            );
          })}
          <p className="text-investmentblue hover:underline cursor-default text-center mt-4">
            View More
          </p>
        </div>
      )}
    </>
  );
};

export default NewsCard;
