import React, { useContext, useState, useEffect, useMemo } from "react";


import { BanknoteIcon, AcademicCapIcon, ArrowTrendingUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/investmentcomponents/Modal";

import { useParams, useNavigate, useRouter } from "next/router";
import StockCard from "./StockCard";
import { ALERT_TYPES } from "@/utils/constants.js";
import { handleAlert } from "@/utils/utils";
import { formatMoneyTrailingZero } from "@/utils/utils";

const dummyStocks = [
  {
    T: "AMZN",
    c: "87.36",
    o: "87.46",
    v: 61166283,
  },
  {
    T: "SHOP",
    c: "37.19",
    o: "37.70",
    v: 22978271,
  },
  {
    T: "MSFT",
    c: "227.12",
    o: "226.45",
    v: 20567159,
  },
  {
    T: "WMT",
    c: "144.95",
    o: "146.32",
    v: 3953216,
  },

  {
    T: "TSLA",
    c: "119.77",
    o: "118.96",
    v: 112643377,
  },

  {
    T: "NVDA",
    c: "156.28",
    o: "152.84",
    v: 47788389,
  },
];

const TradingTrainingCard = ({ stocks, alert, setRecentTrades, recentTrades }) => {

  // const params = useParams();
  // const navigate = useNavigate();
  const router = useRouter();


  const initialAccounts = { RothIRA: false, RolloverIRA: false, Brokerage: false };

  const initialStocks = {
    AMZN: false,
    SHOP: false,
    MSFT: false,
    WMT: false,
    TSLA: false,
    NVDA: false,
  };

  const initialTradeCardContent = useMemo(() => {
    return {
      title: "Start Trading Here",
      subtitle: "Start your investment journey with us through our advance trading platform.",
      buttonText: "Trade Now",
      icon: <BanknoteIcon className="rounded-full bg-primary p-3 h-20 w-20 text-primary-text" />,
    };
  }, []);



  const [isOpen, setIsOpen] = useState(false);

  const [tradeCardContent, setTradeCardContent] = useState({
    ...initialTradeCardContent,
  });
  const [accountChosen, setAccountChosen] = useState({
    ...initialAccounts,
  });
  const [stockChosen, setStockChosen] = useState({
    ...initialStocks,
  });

  const showInvestmentTradeButtonLDFlag = true;
  const showCloudMigrationTwoStagesLDFlag = true;
  const showInvestmentCardPromoLDFlag = true;

  useEffect(() => {
    if (showInvestmentTradeButtonLDFlag && !showInvestmentCardPromoLDFlag) {
      setTradeCardContent({
        title: "First Time Investing?",
        subtitle: "Let us help you with our Investment 101 training course.",
        buttonText: "Learn Trading 101 Here",
        icon: (
          <AcademicCapIcon className="rounded-full bg-green-500 p-3 h-20 w-20 text-primary-text" />
        ),
      });
    }

    if (!showInvestmentTradeButtonLDFlag && showInvestmentCardPromoLDFlag) {
      setTradeCardContent({
        title: "Jump Start Your Investment Journey",
        subtitle: "Start here with our advance trading platform",
        buttonText: "Jump Start Trading Here",
        icon: (
          <ArrowTrendingUpIcon className="rounded-full bg-green-500 p-3 h-20 w-20 text-primary-text" />
        ),
      });
    }

    if (showInvestmentTradeButtonLDFlag && showInvestmentCardPromoLDFlag) {
      return;
    }

    if (!showInvestmentTradeButtonLDFlag && !showInvestmentCardPromoLDFlag) {
      setTradeCardContent({
        ...initialTradeCardContent,
      });
    }
  }, [showInvestmentCardPromoLDFlag, showInvestmentTradeButtonLDFlag, initialTradeCardContent]);

  if (stocks.length === 0 || stocks === undefined) stocks = dummyStocks; //to deal with rate limit

  
  const onClose = () => {
    setIsOpen(false);

    setAccountChosen({ ...initialAccounts });

    setStockChosen({ ...initialStocks });

    // navigate("/investment");

    router.push("/investment");
  };

  const handleAccountChosen = (e) => {
    const dataAccountId = e.target.getAttribute("data-account-id");
    setAccountChosen((prevState) => ({
      ...!prevState,
      [dataAccountId]: true,
    }));
    //ldClient?.track("Investment Account Selected");
  };

  const handleStockChosen = (e) => {
    const dataStockId = e.target.getAttribute("data-stock-id");
    setStockChosen((prevState) => ({
      ...!prevState,
      [dataStockId]: true,
    }));
    ldClient?.track("Investment Stock Selected");
  };

  const handleTradeSubmit = () => {
    const stockName = Object.keys(stockChosen)[0];
    let stockPrice;

    stocks.forEach((stock) => {
      if (stock?.T.includes(stockName)) {
        stockPrice = stock?.c;
      }
    });

    const tradePrice = formatMoneyTrailingZero(Math.round(20 * stockPrice * 100) / 1000);
    //divided by 1000 instead of 100 in order for trade price to be in the 100s rather than 1000s to match other trades

    const stockTraded = {
      id: "202020202020wwww",
      name: stockName,
      price: `$${tradePrice}`,
      shares: "20",
      status: "processing",
      type: "investment",
    };

    setRecentTrades([stockTraded, ...recentTrades]);

    setIsOpen(false);

    setAccountChosen({ ...initialAccounts });

    setStockChosen({ ...initialStocks });

    ldClient?.track("Trade Completed");

    handleAlert({
      alert: alert,
      type: ALERT_TYPES.SUCCESS,
      message: `Trade is successful!`,
      timeout: 5000,
    });
  };



  const accountTypeArr = ["Roth IRA", "Rollover IRA", "Brokerage"];

  return (
    <div className="flex flex-col items-center gap-y-4">
      {tradeCardContent.icon}
      <h3 className="text-2xl text-center" data-testid="trading-training-card-header-test-id">
        {tradeCardContent.title}
      </h3>
      <p className="text-center">{tradeCardContent.subtitle}</p>
      <Button
        classButtonOverride="!bg-button !text-button-text"
        handleClick={() => {
          setIsOpen(true);
          (showInvestmentCardPromoLDFlag && !showInvestmentTradeButtonLDFlag) ||
          showInvestmentCardPromoLDFlag
            ? ldClient?.track("CTA Investment Component Button")
            : ldClient?.track("Start Trade Button Click");
        }}
        href="/investment/trade/1"
      >
        {tradeCardContent.buttonText}
      </Button>
      <Modal
        open={isOpen}
        onClose={onClose}
        modalClassOverride={`w-full h-full lg:w-auto lg:h-auto`}
      >
        {/* {params["*"]?.includes("trade/1") ? ( */}
          {false ? (
          <div
            className={`flex-col  my-[2rem] mx-[2rem]
          lg:flex text-gray-900 `}
          >
            <h3 className="font-bold text-lg mb-4 text-left">
              Which Account Do you Want to Invest In?
            </h3>

            <ul className="flex flex-col gap-y-2 mb-4">
              {accountTypeArr.map((account, index) => {
                return (
                  <li
                    className={`border-2 border-gray-900 rounded-md p-2 cursor-pointer hover:shadow-lg hover:border-primary ${
                      accountChosen[`${account.split(" ").join("")}`]
                        ? "bg-primary text-primary-text border-primary"
                        : "bg-white text-gray-900"
                    }`}
                    key={index}
                    data-account-id={`${account.split(" ").join("")}`}
                    onClick={(e) => {
                      handleAccountChosen(e);
                    }}
                  >
                    {account}
                  </li>
                );
              })}
            </ul>

            <Button
              classButtonOverride="!bg-button !text-button-text"
              href="/investment/trade/2"
              ldTrackMetricString="Investment Account Selected"
            >
              <span>
                Continue <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
        ) : null}

        {/* {params["*"]?.includes("trade/2") ? ( */}
                  {false ? (
          <div
            className={`flex-col  my-[2rem] mx-[2rem]
          lg:flex text-gray-900`}
          >
            <h3 className="font-bold text-lg mb-4 text-left">
              Which Stocks Do you Want to Invest In?
            </h3>
            <StockCard
              columnHeaders={[
                "Symbol",
                "Price ($)",
                showCloudMigrationTwoStagesLDFlag ? "Gain/Loss (%)" : null,
              ]}
              stocks={stocks}
              showMigration={showCloudMigrationTwoStagesLDFlag}
              showViewMore={false}
              stockChosen={stockChosen}
              rowWrapperOverride={`border-2 border-transparent rounded-md p-2 cursor-pointer hover:border-primary hover:shadow-lg`}
              handleClick={(e) => handleStockChosen(e)}
            />
            <Button
              classButtonOverride="!bg-button !text-button-text"
              handleClick={() => handleTradeSubmit()}
              href="/investment"
              ldTrackMetricString="Trade Completed"
            >
              <span>Complete Trade</span>
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
//TODO: repalce withalert with toast
export default TradingTrainingCard;
