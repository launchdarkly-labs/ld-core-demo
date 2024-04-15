import React, { useContext, useState } from "react";
import { LDContext } from "Providers/LaunchDarkly/context.js";
import { checkCloudMigrationTwoStagesLDFlag } from "Utils/flagsUtils.js";
import { investmentColors } from "Utils/styleUtils";
import { STOCK_LOGO_IMAGE } from "Constants/constants";
import CircleLoader from "Components/CircleLoader";
import StatusBubble from "Components/SalientComponents/StatusBubble";
import ColumnComponent from "./ColumnComponent";
import { formatMoneyTrailingZero } from "Utils/utils";
import Modal from "Components/Modal";
import { truncateString } from "Utils/utils";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const StockCard = ({
  title,
  columnHeaders,
  stocks,
  isLoadingStocks,
  extraHeaderColumns,
  showMigration,
  showViewMore = true,
  handleClick,
  rowWrapperOverride,
  stockChosen,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <h3 className="font-bold text-lg mb-5">{title}</h3>

      <div className="flex flex-col gap-y-6 mb-5" {...props}>
        <ColumnHeaderComponent
          columnHeaders={columnHeaders}
          extraHeaderColumns={extraHeaderColumns}
        />
        {isLoadingStocks ? (
          <CircleLoader marginY={"!my-[4rem]"} />
        ) : (
          <RowComponent
            stocks={stocks}
            rowWrapperOverride={rowWrapperOverride}
            handleClick={handleClick}
            stockChosen={stockChosen}
          />
        )}
      </div>
      {isLoadingStocks || !showViewMore ? null : (
        <p
          className="text-primary hover:underline cursor-pointer"
          data-testid="stock-card-modal-open-link-test-id"
          onClick={() => setIsOpen(true)}
        >
          View More
        </p>
      )}
      <AnimatePresence>
        <Modal
          open={isOpen}
          onClose={onClose}
          modalClassOverride={`w-full h-full lg:w-auto lg:h-auto`}
        >
          <StockCardModal
            title={title}
            columnHeaders={columnHeaders}
            extraHeaderColumns={extraHeaderColumns}
            stocks={stocks}
            isOpen={isOpen}
            isLoadingStocks={isLoadingStocks}
            showMigration={showMigration}
          />
        </Modal>
      </AnimatePresence>
    </>
  );
};

const RowComponent = ({
  stocks = [],
  renderInModal,
  rowWrapperOverride = "",
  handleClick,
  stockChosen,
}) => {
  const { flags } = useContext(LDContext);
  const showCloudMigrationTwoStagesLDFlag = checkCloudMigrationTwoStagesLDFlag({ flags })?.includes("complete");

  return (
    <div className={`flex flex-col gap-y-6 overflow-y-auto ${renderInModal || (!renderInModal && stocks.length < 6) ? "" : "sm:h-[22.5rem]"}`}>
      {stocks?.map((stock, index) => {
        const percentageChange = formatMoneyTrailingZero(
          Math.round((stock.c - stock.o) * 100) / 100
        );
        const position = percentageChange.toString().includes("-") ? "negative" : "positive";

        return (
          <div
            className={`${renderInModal ? "flex justify-between items-center text-base" : ""}`}
            key={index}
            data-stock-id={stock?.T}
              onClick={handleClick}
          >
            <div
              className={`flex justify-between items-center text-base gap-x-1 sm:gap-x-4 ${rowWrapperOverride} ${
                stockChosen?.[stock?.T] ? "!border-primary shadow-lg" : "border-transparent"
              }`}
              data-stock-id={stock?.T}
              onClick={handleClick}
            >
              {stock?.T ? (
                <ColumnComponent>
                  <div
                    className="text-left stock-icon-group flex items-center gap-x-2"
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-icon-${index}-test-id`
                        : `stock-card-column-icon-${index}-test-id`
                    } `}
                    data-stock-id={stock?.T}
                    onClick={handleClick}
                  >
                    <img
                      src={STOCK_LOGO_IMAGE[stock?.T]}
                      alt={stock?.T}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm bg-red object-fit"
                    />

                    <span>{stock?.T}</span>
                  </div>
                </ColumnComponent>
              ) : null}

              {stock?.c ? (
                <ColumnComponent>
                  <div
                    className={`text-right`}
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-price-${index}-test-id`
                        : `stock-card-column-price-${index}-test-id`
                    } `}
                    data-stock-id={stock?.T}
                    onClick={handleClick}
                  >
                    ${formatMoneyTrailingZero(stock?.c)}
                  </div>
                </ColumnComponent>
              ) : null}

              {stock?.o && showCloudMigrationTwoStagesLDFlag ? (
                <ColumnComponent>
                  <div
                    className={`text-right font-bold ${investmentColors[position]} ${
                      stock?.dummyPositions ? `!${investmentColors[stock?.dummyPositions]}` : ""
                    }`}
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-position-${index}-test-id`
                        : `stock-card-column-position-${index}-test-id`
                    } `}
                    data-stock-id={stock?.T}
                    onClick={handleClick}
                  >
                    {percentageChange}%
                  </div>
                </ColumnComponent>
              ) : null}
              {/* {stock?.v && showCloudMigrationTwoStagesLDFlag ? (
          <ColumnComponent>
            <div className={`text-right text-blue-600`}>{stock?.v.toLocaleString()}</div>
          </ColumnComponent>
        ) : null} */}

              {stock?.shares ? (
                <ColumnComponent>
                  <div
                    className={`text-right`}
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-shares-${index}-test-id`
                        : `stock-card-column-shares-${index}-test-id`
                    } `}
                  >
                    {stock?.shares}
                  </div>
                </ColumnComponent>
              ) : null}

              {stock?.total && renderInModal ? (
                <ColumnComponent>
                  <div
                    className={`text-right`}
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-total-profit-${index}-test-id`
                        : `stock-card-column-total-profit-${index}-test-id`
                    } `}
                  >
                    {stock?.total}
                  </div>
                </ColumnComponent>
              ) : null}

              {stock?.status ? (
                <ColumnComponent>
                  <div
                    className={`text-right `}
                    data-testid={`${
                      renderInModal
                        ? `stock-card-modal-column-status-${index}-test-id`
                        : `stock-card-column-status-${index}-test-id`
                    } `}
                  >
                    <StatusBubble status={stock?.status} />
                  </div>
                </ColumnComponent>
              ) : null}
            </div>

            {stock?.news && renderInModal ? (
              <div className="w-[20rem]" key={index}>
                <div
                  className={`text-right cursor-pointer hover:underline ml-[3rem] hidden sm:block`}
                  data-testid={`${
                    renderInModal
                      ? `stock-card-modal-column-news-${index}-test-id`
                      : `stock-card-column-news-${index}-test-id`
                  } `}
                  title={stock?.news}
                >
                  {truncateString(stock?.news, 100)}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const ColumnHeaderComponent = ({
  columnHeaders,
  renderInModal,
  columnHeaderWrapperOverride = "",
}) => {
  return (
    <div className={`flex text-sm text-slate-400 ${columnHeaderWrapperOverride}`}>
      <div
        className={`flex justify-between items-center ${
          renderInModal ? "gap-x-1 sm:gap-x-4" : " w-full"
        }`}
      >
        <ColumnComponent>
          <div className="text-left ">{columnHeaders[0]}</div>
        </ColumnComponent>
        {columnHeaders.map((header, index) => {
          if (index === 0) return null;
          if (index === columnHeaders.length - 1 && renderInModal) return null;
          if (
            !renderInModal &&
            (header?.includes("Total Price") || header?.includes("Ticker News"))
          )
            return null;
          if (!header) return null;
          return (
            <ColumnComponent key={index}>
              <div className="text-right break-words">{header}</div>
            </ColumnComponent>
          );
        })}
      </div>
      {renderInModal && columnHeaders[columnHeaders.length - 1]?.includes("News") ? (
        <ColumnComponent>
          <div className="text-right break-words">{columnHeaders[columnHeaders.length - 1]}</div>
        </ColumnComponent>
      ) : null}
    </div>
  );
};

const StockCardModal = ({
  stocks,
  title,
  isOpen,
  columnHeaders,
  extraHeaderColumns,
  isLoadingStocks,
  showMigration,
}) => {
  return (
    <>
      <div
        className={`hidden flex-col gap-y-6 my-[2rem] mx-[2rem]
          lg:flex `}
        id="stock-card-modal-desktop"
        data-testid="stock-card-modal-test-id"
      >
        <h3 className="font-bold text-lg mb-5 text-left">{title}</h3>
        <ColumnHeaderComponent
          columnHeaders={columnHeaders}
          extraHeaderColumns={extraHeaderColumns}
          renderInModal={isOpen}
        />
        {isLoadingStocks ? (
          <CircleLoader marginY={"!my-[4rem]"} />
        ) : (
          <RowComponent stocks={stocks} renderInModal={isOpen} />
        )}
      </div>

      <div
        className="flex flex-col gap-y-6 my-[1rem] w-full h-full
          lg:hidden "
        id="stock-card-modal-mobile"
      >
        <h3 className="font-bold text-lg mb-2 text-center">{title}</h3>
        {stocks.map((stock, index) => {
          const percentageChange = formatMoneyTrailingZero(
            Math.round((stock.c - stock.o) * 100) / 100
          );
          const position = percentageChange.toString().includes("-") ? "negative" : "positive";
          return (
            <div className="flex flex-col border-2 rounded-md p-2 shadow-md" key={index}>
              <div className="flex">
                {stock?.T ? (
                  <ColumnComponent>
                    <div className="text-left text-sm text-slate-400 mb-2">{columnHeaders[0]}</div>
                    <div
                      className="text-left stock-icon-group flex items-center gap-x-2"
                      data-testid={`stock-card-column-icon-${index}-modal-mobile-test-id`}
                    >
                      <img
                        src={STOCK_LOGO_IMAGE[stock?.T]}
                        alt={stock?.T}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm bg-red object-fit"
                      />

                      <span>{stock?.T}</span>
                    </div>
                  </ColumnComponent>
                ) : null}

                {stock?.c ? (
                  <ColumnComponent>
                    <div className="text-right text-sm text-slate-400 mb-2">{columnHeaders[1]}</div>
                    <div
                      className={`text-right`}
                      data-testid={`stock-card-column-price-${index}-modal-mobile-test-id`}
                    >
                      ${formatMoneyTrailingZero(stock?.c)}
                    </div>
                  </ColumnComponent>
                ) : null}
              </div>

              {showMigration ? <hr className=" border-slate-400/40 my-[1rem] mx-4" /> : null}

              <div className="flex flex-col mb-2 gap-y-2">
                {stock?.shares ? (
                  <div className="flex justify-between items-center">
                    <p className="text-left text-sm text-slate-400 mr-auto">{columnHeaders[2]}</p>
                    <p
                      className={`text-right`}
                      data-testid={`stock-card-column-shares-${index}-modal-mobile-test-id`}
                    >
                      {stock?.shares}
                    </p>
                  </div>
                ) : null}

                {stock?.total && isOpen ? (
                  <div className="flex justify-between items-center">
                    <p className="text-left text-sm text-slate-400 mr-auto">{columnHeaders[3]}</p>
                    <p
                      className={`text-right`}
                      data-testid={`stock-card-column-total-${index}-modal-mobile-test-id`}
                    >
                      {stock?.total}
                    </p>
                  </div>
                ) : null}

                {stock?.status ? (
                  <div className="flex justify-between items-center">
                    <p className="text-left text-sm text-slate-400 mr-auto">{columnHeaders[4]}</p>
                    <div
                      className={`text-right `}
                      data-testid={`stock-card-column-status-${index}-modal-mobile-test-id`}
                    >
                      <StatusBubble status={stock?.status} />
                    </div>
                  </div>
                ) : null}

                {stock?.o && showMigration ? (
                  <div className="flex justify-between items-center">
                    <p className="text-left text-sm text-slate-400 mr-auto">{columnHeaders[2]}</p>
                    <div
                      className={`text-right font-bold ${investmentColors[position]} ${
                        stock?.dummyPositions ? `!${investmentColors[stock?.dummyPositions]}` : ""
                      }`}
                      data-testid={`stock-card-column-position-${index}-test-id`}
                    >
                      {percentageChange}%
                    </div>
                  </div>
                ) : null}
              </div>

              {stock?.news && isOpen ? (
                <ColumnComponent columnWrapperOverride="sm:!w-[100%]">
                  <p className=" text-sm text-slate-400 mb-2">{columnHeaders[5]}</p>
                  <p
                    className={`text-left cursor-pointer hover:underline w-full`}
                    data-testid={`stock-card-column-news-${index}-modal-mobile-test-id`}
                    title={stock?.news}
                  >
                    {stock?.news}
                  </p>
                </ColumnComponent>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default StockCard;
