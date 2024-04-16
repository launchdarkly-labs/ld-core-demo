import { investmentColors } from "@/utils/styleUtils";
import { BounceLoader } from "react-spinners";

const dummyData = [
  {
    name: "S&P 500",
    price: "4,267.52",
    priceChange: "16.33",
    percentageChange: "0.38",
    position: "negative",
  },
  {
    name: "DOW Jones",
    price: "33,665.02",
    priceChange: "91.74",
    percentageChange: "0.27",
    position: "positive",
  },
  {
    name: "NASDAQ",
    price: "13,104.89",
    priceChange: "171.52",
    percentageChange: "1.29",
    position: "negative",
  },
];

const MarketCard = ({ isLoadingStocks }: { isLoadingStocks: boolean }) => {
  const renderedData = dummyData;

  return (
    <>
      <h3 className="font-bold text-lg mb-4">Market</h3>
      <div className="flex justify-between mb-4 gap-x-4">
        {isLoadingStocks ? (
          <BounceLoader />
        ) : (
          renderedData.map((datum) => {
            return (
              <div className="" key={datum.name}>
                <p className="mb-1">{datum.name}</p>
                <p className={` ${investmentColors[datum.position]}`}>
                  {datum.position.includes("positive") ? "+" : "-"}${datum.priceChange}
                </p>
                <p className={`${investmentColors[datum.position]}`}>
                  ({datum.position.includes("positive") ? "+" : "-"}
                  {datum.percentageChange}%)
                </p>
                <p className="text-investmentgrey">${datum.price}</p>
              </div>
            );
          })
        )}
      </div>
      {isLoadingStocks ? null : (
        <p className="text-primary hover:underline cursor-pointer">View More</p>
      )}
    </>
  );
};

export default MarketCard;
