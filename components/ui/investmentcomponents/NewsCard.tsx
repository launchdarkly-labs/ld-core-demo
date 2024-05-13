import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import { BounceLoader } from "react-spinners";
import { truncateString } from "@/utils/utils";
import { wait, randomLatency } from "@/utils/utils";
import {
  newsData,
  investmentData,
  stockData,
} from "@/components/ui/investmentcomponents/InvestmentData";

const time = new Date().getTime();
const date = format(new Date(time), "MMM d, yyyy");


const NewsCard = ({ news, isLoadingNews }: { news: any; isLoadingNews: boolean }) => {
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
      <div className="flex flex-col gap-y-2 mb-4">
      {loadingStocksTable ? (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color="#FF386B" />
        </div>
      ) : (
          <>
            {news.map((datum: any, index: number) => {
              const dateCleaned = format(new Date(datum.published_utc), "MMM d, yyyy");
              return (
                <div className="" key={`${datum.id}-${index}`}>
                  <a
                    className="text-sm hover:underline cursor-pointer"
                    href={datum.article_url}
                    data-testid="stock-news-title-test-id"
                    title={datum.title}
                  >
                    {truncateString(datum.title, 60)}
                  </a>
                  <p className="text-investmentgrey text-xs">
                    {datum.publisher.name} &#183; <span>{dateCleaned}</span>
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
      <p className="text-investmentblue hover:underline cursor-default text-center">View More</p>
    </>
  );
};

export default NewsCard;
